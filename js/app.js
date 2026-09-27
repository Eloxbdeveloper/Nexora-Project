// ==========================================
// MUÉVETE CB — app.js
// Script clásico (NO type="module"), así funciona abriendo index.html
// con doble clic, sin servidor ni build. Todo vive en este archivo para
// evitar problemas de orden de carga entre módulos.
// ==========================================
(function () {
  "use strict";

  var DATA = window.APPDATA;

  // Estado central ------------------------------------------------------
  var state = {
    reports: DATA.reports.slice(),
    posts: DATA.social.slice(),
    userMode: "adult",
    activeAlert: null,
  };
  var reportIdCounter = 1000;
  var postIdCounter = 2000;

  // ======================================================
  // MOTOR DE RUTAS (grafo formal+informal + Dijkstra)
  // ======================================================
  function buildGraph(routes, walks) {
    var graph = {};
    function addEdge(a, b, min, routeId, kind, extra) {
      if (!graph[a]) graph[a] = [];
      graph[a].push(Object.assign({ to: b, min: min, routeId: routeId, kind: kind }, extra || {}));
    }
    routes.forEach(function (r) {
      for (var i = 0; i < r.stops.length - 1; i++) {
        var a = r.stops[i], b = r.stops[i + 1];
        var boardWait = r.headwayMin / 2;
        var travel = r.segMin[i];
        addEdge(a, b, travel + boardWait, r.id, r.kind, { mode: r.mode, color: r.color, routeName: r.name });
        if (r.bidirectional) addEdge(b, a, travel + boardWait, r.id, r.kind, { mode: r.mode, color: r.color, routeName: r.name });
      }
    });
    walks.forEach(function (w) {
      addEdge(w.a, w.b, w.min, "walk", "walk", { mode: "walk", routeName: "Caminar" });
      addEdge(w.b, w.a, w.min, "walk", "walk", { mode: "walk", routeName: "Caminar" });
    });
    return graph;
  }

  function reportPenaltyFor(routeId, reports, penalties) {
    var extraMin = 0, closed = false, headwayMultiplier = 1;
    reports.forEach(function (rep) {
      if (rep.routeId !== routeId) return;
      if (rep.minutesAgo > rep.ttlMin) return;
      if (rep.type === "bloqueo") {
        var rule = penalties.reportRules.bloqueo[String(rep.severity)];
        if (rule && rule.closed) closed = true;
        if (rule && rule.extraMin) extraMin += rule.extraMin;
      } else if (rep.type === "demora") {
        extraMin += rep.minutesExtra || 0;
      } else if (rep.type === "cambio") {
        headwayMultiplier *= rep.headwayMultiplier || 1;
      }
    });
    return { extraMin: extraMin, closed: closed, headwayMultiplier: headwayMultiplier };
  }

  function shortestPath(graph, origin, destination, opts) {
    opts = opts || {};
    var reports = opts.reports || [], penalties = opts.penalties, stopsById = opts.stopsById || {};
    var dist = {}, prev = {}, visited = {};
    var startKey = origin + "|none";
    dist[startKey] = 0;
    var queue = [{ key: startKey, node: origin, routeId: "none", d: 0 }];

    while (queue.length) {
      queue.sort(function (a, b) { return a.d - b.d; });
      var cur = queue.shift();
      if (visited[cur.key]) continue;
      visited[cur.key] = true;
      if (cur.node === destination) break;

      var edges = graph[cur.node] || [];
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (opts.avoidNonAccessible && stopsById[e.to] && stopsById[e.to].accessible === false) continue;

        var weight = e.min, closed = false;
        if (e.routeId !== "walk" && penalties) {
          var pen = reportPenaltyFor(e.routeId, reports, penalties);
          weight += pen.extraMin;
          if (pen.headwayMultiplier !== 1) weight += (pen.headwayMultiplier - 1) * 4;
          closed = pen.closed;
        }
        if (closed) continue;

        var isTransfer = e.routeId !== "walk" && cur.routeId !== "none" && cur.routeId !== e.routeId && cur.routeId !== "walk";
        if (isTransfer && penalties) weight += penalties.transferPenaltyMin;

        var nextKey = e.to + "|" + e.routeId;
        var nd = cur.d + weight;
        if (nd < (dist[nextKey] === undefined ? Infinity : dist[nextKey])) {
          dist[nextKey] = nd;
          prev[nextKey] = { key: cur.key, edge: e };
          queue.push({ key: nextKey, node: e.to, routeId: e.routeId, d: nd });
        }
      }
    }

    var bestKey = null, bestD = Infinity;
    Object.keys(dist).forEach(function (key) {
      if (key.indexOf(destination + "|") === 0 && dist[key] < bestD) { bestKey = key; bestD = dist[key]; }
    });
    if (!bestKey) return null;

    var segments = [];
    var k = bestKey;
    while (prev[k]) { segments.unshift(prev[k].edge); k = prev[k].key; }
    return { totalMin: Math.round(bestD), segments: segments };
  }

  function toLegs(segments) {
    var legs = [];
    segments.forEach(function (seg) {
      var last = legs[legs.length - 1];
      if (last && last.routeId === seg.routeId) { last.min += seg.min; last.to = seg.to; }
      else legs.push({ routeId: seg.routeId, routeName: seg.routeName, kind: seg.kind, mode: seg.mode, color: seg.color, min: seg.min, to: seg.to });
    });
    return legs;
  }

  function planTrip(query, ctx) {
    var stopsById = {};
    ctx.stops.forEach(function (s) { stopsById[s.id] = s; });
    var graph = buildGraph(ctx.routes, ctx.walks);
    var activeReports = ctx.reports.filter(function (r) { return r.minutesAgo <= r.ttlMin; });

    var best = shortestPath(graph, query.origin, query.destination, { reports: activeReports, penalties: ctx.penalties, stopsById: stopsById });
    if (!best) return null;

    var legs = toLegs(best.segments);
    var marginMin = query.minutesAvailable != null ? query.minutesAvailable - best.totalMin : null;
    var usedRouteIds = [];
    legs.forEach(function (l) { if (l.routeId !== "walk" && usedRouteIds.indexOf(l.routeId) === -1) usedRouteIds.push(l.routeId); });
    var affectingReports = activeReports.filter(function (r) { return usedRouteIds.indexOf(r.routeId) !== -1; });

    return {
      totalMin: best.totalMin, marginMin: marginMin, legs: legs, usedRouteIds: usedRouteIds,
      affectingReports: affectingReports,
      hasInformal: legs.some(function (l) { return l.kind === "informal"; }),
      hasFormal: legs.some(function (l) { return l.kind === "formal"; }),
    };
  }

  // ======================================================
  // MODERACIÓN
  // ======================================================
  var PALABRAS_PROHIBIDAS = ["idiota", "estupido", "estúpido", "imbecil", "imbécil", "maldito", "maldita", "odio a", "muerete", "muérete"];
  var TEMAS_FUERA_DE_LUGAR = ["compra ahora", "gana dinero", "http://", "https://", "www."];

  function moderateText(text) {
    var t = (text || "").toLowerCase();
    if (!t.trim()) return { allowed: false, reason: "La publicación está vacía." };
    if (t.length > 500) return { allowed: false, reason: "El mensaje es demasiado largo para el feed de movilidad." };
    for (var i = 0; i < PALABRAS_PROHIBIDAS.length; i++) {
      if (t.indexOf(PALABRAS_PROHIBIDAS[i]) !== -1) {
        return { allowed: false, reason: "Tu publicación no cumple las normas de lenguaje de la comunidad." };
      }
    }
    for (var j = 0; j < TEMAS_FUERA_DE_LUGAR.length; j++) {
      if (t.indexOf(TEMAS_FUERA_DE_LUGAR[j]) !== -1) {
        return { allowed: false, reason: "Esto no parece un reporte de movilidad. El feed es solo para vías, rutas y seguridad." };
      }
    }
    var letters = t.replace(/[^a-záéíóúñ]/gi, "");
    var upper = text.replace(/[^A-ZÁÉÍÓÚÑ]/g, "");
    if (letters.length > 12 && upper.length / Math.max(letters.length, 1) > 0.8) {
      return { allowed: false, reason: "Evita escribir todo en mayúsculas, ayuda a mantener un tono tranquilo." };
    }
    return { allowed: true };
  }

  function moderateImageFlag(markedSensitive) {
    if (markedSensitive) return { allowed: false, reason: "La imagen fue bloqueada por contenido sensible. Solo se permite evidencia relacionada con la vía." };
    return { allowed: true };
  }

  function moderateForMinor(post) {
    if (post.wantsDirectMessage) return { allowed: false, reason: "Los usuarios menores de edad no pueden iniciar mensajes directos con desconocidos." };
    return { allowed: true, requiresSupervision: true };
  }

  // ======================================================
  // AGENTE DE IA (4 roles)
  // ======================================================
  function explainTrip(trip) {
    if (!trip) return { headline: "No encontré una ruta disponible", body: "Prueba con otro origen o destino, o revisa si hay una vía cerrada por un reporte reciente." };

    var chain = trip.legs.filter(function (l) { return l.routeId !== "walk"; })
      .map(function (l) { return l.routeName + " (" + l.kind + ")"; }).join(" → ");

    var marginTxt = "";
    if (trip.marginMin != null) {
      marginTxt = trip.marginMin >= 0 ? "Te sobran " + trip.marginMin + " min de margen." : "Vas " + Math.abs(trip.marginMin) + " min justos, sal ya.";
    }
    var why = "";
    if (trip.affectingReports.length > 0) {
      why = ' Ajusté la ruta por un reporte activo: "' + trip.affectingReports[0].description + '".';
    } else if (trip.hasInformal && trip.hasFormal) {
      why = " Combiné un tramo informal con el sistema formal porque es lo más rápido ahora mismo.";
    }
    return { headline: trip.totalMin + " min hasta tu destino", body: (chain + ". " + marginTxt + why).trim() };
  }

  function reviewSocialPost(post, userMode) {
    var textCheck = moderateText(post.text);
    if (!textCheck.allowed) return { allowed: false, published: false, reason: textCheck.reason };
    if (post.imageAttached) {
      var imgCheck = moderateImageFlag(post.markedSensitive);
      if (!imgCheck.allowed) return { allowed: false, published: false, reason: imgCheck.reason };
    }
    if (userMode === "minor") {
      var minorCheck = moderateForMinor(post);
      if (!minorCheck.allowed) return { allowed: false, published: false, reason: minorCheck.reason };
      return { allowed: true, published: true, status: "publicado_supervisado" };
    }
    return { allowed: true, published: true, status: "publicado" };
  }

  function distanceMeters(lat1, lng1, lat2, lng2) {
    var R = 6371000;
    function toRad(d) { return (d * Math.PI) / 180; }
    var dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function evaluateCorridor(minorProfile, currentLatLng, expectedPath) {
    var minDist = Infinity;
    expectedPath.forEach(function (p) {
      var d = distanceMeters(currentLatLng.lat, currentLatLng.lng, p.lat, p.lng);
      if (d < minDist) minDist = d;
    });
    if (minDist <= minorProfile.corridorToleranceMeters) return { state: "en_ruta", distanceMeters: Math.round(minDist) };
    if (minDist <= minorProfile.corridorToleranceMeters * 2) return { state: "chequeo_silencioso", distanceMeters: Math.round(minDist) };
    return { state: "alerta", distanceMeters: Math.round(minDist) };
  }

  function buildGuardianAlert(minorProfile, guardians, reason, extra) {
    return Object.assign({
      title: "Alerta de movilidad — " + minorProfile.name,
      body: reason,
      recipients: guardians.map(function (g) { return g.name; }),
      timestamp: new Date().toISOString(),
    }, extra || {});
  }

  // ======================================================
  // MAPA PROPIO EN SVG (sin dependencias externas)
  // ======================================================
  function project(lat, lng, bounds, width, height, pad) {
    pad = pad || 24;
    var x = pad + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - pad * 2);
    var y = pad + (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2);
    return { x: x, y: y };
  }
  function computeBounds(stops) {
    var lats = stops.map(function (s) { return s.lat; }), lngs = stops.map(function (s) { return s.lng; });
    return { minLat: Math.min.apply(null, lats) - 0.004, maxLat: Math.max.apply(null, lats) + 0.004, minLng: Math.min.apply(null, lngs) - 0.004, maxLng: Math.max.apply(null, lngs) + 0.004 };
  }
  var KIND_COLOR = { formal: "#0056A8", informal: "#C77700", mixto: "#5B4B8A" };
  var POI_ICON = { colegio: "🏫", universidad: "🎓", salud: "🏥", mercado: "🛒", jac: "🏛" };

  function renderMap(container, opts) {
    var stops = opts.stops, routes = opts.routes, pois = opts.pois, reports = opts.reports;
    var highlightRouteIds = opts.highlightRouteIds || [];
    var width = opts.width || 340, height = opts.height || 320;
    var bounds = computeBounds(stops);
    var stopsById = {}; stops.forEach(function (s) { stopsById[s.id] = s; });
    var activeReports = reports.filter(function (r) { return r.minutesAgo <= r.ttlMin; });
    var reportedRouteIds = {}; activeReports.forEach(function (r) { reportedRouteIds[r.routeId] = true; });

    var svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" height="' + height + '" role="img" aria-label="Mapa de rutas de Ciudad Bolívar">';
    svg += '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="#EFF3EE" rx="12"/>';

    routes.forEach(function (r) {
      var pts = r.stops.map(function (id) { return stopsById[id]; }).filter(Boolean).map(function (s) { return project(s.lat, s.lng, bounds, width, height); });
      if (pts.length < 2) return;
      var d = pts.map(function (p, i) { return (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" ");
      var isHighlighted = highlightRouteIds.indexOf(r.id) !== -1;
      var dash = r.kind === "informal" ? "2 8" : "none";
      var strokeWidth = isHighlighted ? 6 : 3;
      var opacity = highlightRouteIds.length > 0 && !isHighlighted ? 0.25 : 0.9;
      svg += '<path d="' + d + '" fill="none" stroke="' + r.color + '" stroke-width="' + strokeWidth + '" stroke-dasharray="' + dash + '" stroke-linecap="round" opacity="' + opacity + '"/>';
      if (reportedRouteIds[r.id]) {
        var mid = pts[Math.floor(pts.length / 2)];
        svg += '<text x="' + mid.x + '" y="' + (mid.y - 8) + '" font-size="14" text-anchor="middle">⚠️</text>';
      }
    });

    stops.forEach(function (s) {
      var p = project(s.lat, s.lng, bounds, width, height);
      var color = KIND_COLOR[s.kind] || "#0F1B2D";
      svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5" fill="' + color + '" stroke="white" stroke-width="1.5"/>';
    });

    pois.forEach(function (poi) {
      var p = project(poi.lat, poi.lng, bounds, width, height);
      svg += '<text x="' + p.x + '" y="' + p.y + '" font-size="13" text-anchor="middle">' + (POI_ICON[poi.type] || "📍") + "</text>";
    });

    svg += '<text x="' + (width - 8) + '" y="' + (height - 8) + '" font-size="9" text-anchor="end" fill="#7A7266">DATOS SIMULADOS</text>';
    svg += "</svg>";
    container.innerHTML = svg;
  }

  // ======================================================
  // MODAL GENÉRICO
  // ======================================================
  function openModal(innerHtml, onOpen) {
    var r = document.getElementById("modal-root");
    r.innerHTML =
      '<div class="modal-backdrop" id="modal-backdrop"><div class="modal-sheet" role="dialog" aria-modal="true">' +
      '<button class="modal-close" id="modal-close" aria-label="Cerrar">✕</button>' + innerHtml + "</div></div>";
    r.classList.remove("hidden");
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", function (e) { if (e.target.id === "modal-backdrop") closeModal(); });
    if (onOpen) onOpen(r);
  }
  function closeModal() {
    var r = document.getElementById("modal-root");
    r.classList.add("hidden");
    r.innerHTML = "";
  }

  // ======================================================
  // UI: pestañas (bottom nav)
  // ======================================================
  function initTabs(onChange) {
    var nav = document.getElementById("bottom-nav");
    var buttons = Array.prototype.slice.call(nav.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
    function activate(tabId) {
      buttons.forEach(function (b) { b.classList.toggle("active", b.dataset.tab === tabId); });
      panels.forEach(function (p) { p.classList.toggle("hidden", p.id !== "panel-" + tabId); });
      if (onChange) onChange(tabId);
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { activate(b.dataset.tab); }); });
    activate("inicio");
  }

  // ======================================================
  // APP: selects, búsqueda, reportes, social, seguridad
  // ======================================================
  var selectedMinutes = 40;

  function fillSelects() {
    var originSel = document.getElementById("input-origin");
    var destSel = document.getElementById("input-destination");
    originSel.innerHTML = DATA.stops.map(function (s) { return '<option value="' + s.id + '">' + s.name + "</option>"; }).join("");
    destSel.innerHTML =
      DATA.stops.map(function (s) { return '<option value="' + s.id + '">🚏 ' + s.name + "</option>"; }).join("") +
      DATA.pois.map(function (p) { return '<option value="' + p.id + '">📍 ' + p.name + "</option>"; }).join("");
    originSel.value = DATA.scenario.query.origin;
    destSel.value = DATA.scenario.query.destination;
  }

  function wirePillsAndChips() {
    document.querySelectorAll("#minutes-pills .pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#minutes-pills .pill").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        selectedMinutes = Number(btn.dataset.min);
      });
    });
    document.querySelectorAll("#profile-chips .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#profile-chips .chip").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
      });
    });
    document.querySelectorAll("#mode-chips .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#mode-chips .chip").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        state.userMode = btn.dataset.mode;
        updateModeBadge();
        renderSocialFeed();
      });
    });
  }

  function updateModeBadge() {
    document.getElementById("badge-mode").textContent = state.userMode === "minor" ? "👦 Modo menor" : "📴 Modo demo";
  }

  function resolveDestinationCoords(destId) {
    var poi = DATA.pois.filter(function (p) { return p.id === destId; })[0];
    if (poi) return { nearestStop: poi.nearestStop, extraWalkMin: poi.walkMin };
    return { nearestStop: destId, extraWalkMin: 0 };
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    var originId = document.getElementById("input-origin").value;
    var destRaw = document.getElementById("input-destination").value;
    var resolved = resolveDestinationCoords(destRaw);

    var trip = planTrip(
      { origin: originId, destination: resolved.nearestStop, minutesAvailable: selectedMinutes },
      { stops: DATA.stops, routes: DATA.routes, walks: DATA.walks, reports: state.reports, penalties: DATA.penalties }
    );
    if (trip) trip.totalMin += resolved.extraWalkMin;

    var explanation = explainTrip(trip);
    renderTripResult(trip, explanation);
  }

  function renderTripResult(trip, explanation) {
    var box = document.getElementById("trip-result");
    box.classList.remove("hidden");

    var legsHtml = (trip ? trip.legs : []).filter(function (l) { return l.routeId !== "walk"; })
      .map(function (l) {
        var cls = l.mode === "cable" ? "cable" : l.kind;
        var icon = l.mode === "cable" ? "🔴" : l.kind === "informal" ? "🟠" : "🔵";
        return '<span class="leg-chip ' + cls + '">' + icon + " " + l.routeName + "</span>";
      }).join("");

    var marginBadge = "";
    if (trip && trip.marginMin != null) {
      marginBadge = trip.marginMin >= 0
        ? '<span class="margin-ok">✅ ' + trip.marginMin + " min de margen</span>"
        : '<span class="margin-warn">⚠ ' + Math.abs(trip.marginMin) + " min justo</span>";
    }

    box.innerHTML =
      '<div class="map-box" id="map-container"></div>' +
      '<div class="result-card">' +
      '<div class="agent-tag">✨ Agente de rutas — Muévete CB</div>' +
      "<div><span class=\"hero-min\">" + (trip ? trip.totalMin + " min" : "—") + "</span>" + marginBadge + "</div>" +
      '<div class="legs-chain">' + (legsHtml || "<span class='muted small'>Sin tramos disponibles</span>") + "</div>" +
      '<div class="why-box">' + explanation.body + "</div>" +
      (trip && trip.affectingReports.length ? '<p class="muted small">⚠ Ruta reordenada por ' + trip.affectingReports.length + " reporte(s) activo(s).</p>" : "") +
      "</div>";

    renderMap(document.getElementById("map-container"), {
      stops: DATA.stops, routes: DATA.routes, pois: DATA.pois, reports: state.reports,
      highlightRouteIds: trip ? trip.usedRouteIds : [],
    });
  }

  // ---------------- Reportes ciudadanos ----------------
  function renderReportsChip() {
    var active = state.reports.filter(function (r) { return r.minutesAgo <= r.ttlMin; });
    document.getElementById("reports-count").textContent = active.length;
  }

  function openReportsModal() {
    var active = state.reports.filter(function (r) { return r.minutesAgo <= r.ttlMin; });
    var routeOptions = DATA.routes.map(function (r) { return '<option value="' + r.id + '">' + r.name + "</option>"; }).join("");

    var listHtml = active.map(function (r) {
      return '<div class="post-card"><div class="post-head"><span>' + r.type.toUpperCase() + " · " + r.routeId +
        '</span><span class="post-meta">hace ' + r.minutesAgo + ' min</span></div><p>' + r.description +
        '</p><button class="post-confirm" data-confirm="' + r.id + '">👍 Confirmar (' + r.confirmations + ")</button></div>";
    }).join("") || "<p class='muted'>No hay reportes activos.</p>";

    openModal(
      "<h3>Reportes activos</h3>" + listHtml +
      '<h3>Reportar algo nuevo</h3><form id="report-form">' +
      '<label>Tipo<select name="type"><option value="bloqueo">Bloqueo</option><option value="demora">Demora</option><option value="cambio">Cambio de horario</option></select></label>' +
      '<label>Ruta afectada<select name="routeId">' + routeOptions + "</select></label>" +
      '<label>Descripción<textarea name="description" rows="3" placeholder="Ej: vía cerrada por obra"></textarea></label>' +
      '<p id="report-error" class="error-text hidden"></p>' +
      '<button type="submit" class="btn-primary" style="margin-top:12px;">🚧 Reportar</button></form>',
      function (root) {
        root.querySelectorAll("[data-confirm]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            state.reports = state.reports.map(function (r) { return r.id === btn.dataset.confirm ? Object.assign({}, r, { confirmations: r.confirmations + 1 }) : r; });
            closeModal(); openReportsModal();
          });
        });
        root.querySelector("#report-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var fd = new FormData(e.target);
          var report = {
            id: "RP-" + reportIdCounter++, type: fd.get("type"), routeId: fd.get("routeId"),
            description: fd.get("description") || "", severity: 2, minutesExtra: 10, headwayMultiplier: 1.5,
            minutesAgo: 0, ttlMin: fd.get("type") === "bloqueo" ? 90 : fd.get("type") === "demora" ? 60 : 180,
            confirmations: 1, source: "ciudadano",
          };
          state.reports = [report].concat(state.reports);
          renderReportsChip();
          closeModal();
        });
      }
    );
  }

  // ---------------- Red social ----------------
  function renderSocialFeed() {
    var feed = document.getElementById("social-feed");
    if (!feed) return;
    feed.innerHTML = state.posts.map(function (p) {
      var minorBadge = p.authorMode === "minor" ? '<span class="post-badge-minor">supervisado</span>' : "";
      return '<div class="post-card"><div class="post-head"><span>' + p.authorName + " " + minorBadge +
        '</span><span class="post-meta">' + p.zone + " · hace " + p.minutesAgo + ' min</span></div>' +
        '<div class="post-type ' + p.type + '">' + p.type + "</div><p>" + p.text + '</p>' +
        '<button class="post-confirm" data-postconfirm="' + p.id + '">👍 Confirmar (' + p.confirmations + ")</button></div>";
    }).join("");
    feed.querySelectorAll("[data-postconfirm]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.posts = state.posts.map(function (p) { return p.id === btn.dataset.postconfirm ? Object.assign({}, p, { confirmations: p.confirmations + 1 }) : p; });
        renderSocialFeed();
      });
    });
  }

  function openPostModal() {
    var restriction = state.userMode === "minor"
      ? "<p class='muted small'>Estás en modo menor: tu publicación pasará por revisión antes de verse en el feed.</p>" : "";

    openModal(
      "<h3>Nueva publicación</h3>" + restriction +
      '<form id="post-form">' +
      '<label>Zona<input type="text" name="zone" placeholder="Ej: Sierra Morena" required></label>' +
      '<label>Tipo<select name="type"><option value="bloqueo">Bloqueo</option><option value="alerta">Alerta</option><option value="informativo">Informativo</option></select></label>' +
      '<label>Mensaje<textarea name="text" rows="3" placeholder="Cuéntale a la comunidad qué pasó" required></textarea></label>' +
      '<label style="display:flex; align-items:center; gap:8px; font-weight:400;"><input type="checkbox" name="markedSensitive" style="width:auto;"> Adjunté una imagen sensible (para probar el bloqueo del moderador)</label>' +
      '<p id="post-error" class="error-text hidden"></p>' +
      '<button type="submit" class="btn-primary" style="margin-top:12px;">Publicar</button></form>',
      function (root) {
        root.querySelector("#post-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var fd = new FormData(e.target);
          var draft = { text: fd.get("text"), zone: fd.get("zone"), type: fd.get("type"),
            imageAttached: fd.get("markedSensitive") === "on", markedSensitive: fd.get("markedSensitive") === "on" };
          var review = reviewSocialPost(draft, state.userMode);
          if (!review.published) {
            var err = root.querySelector("#post-error");
            err.textContent = "🛡️ " + review.reason;
            err.classList.remove("hidden");
            return;
          }
          var post = {
            id: "PST-" + postIdCounter++, authorName: state.userMode === "minor" ? "Camila (14 años)" : "Tú",
            authorMode: state.userMode, zone: draft.zone, type: draft.type, text: draft.text,
            minutesAgo: 0, confirmations: 0, status: review.status,
          };
          state.posts = [post].concat(state.posts);
          renderSocialFeed();
          closeModal();
        });
      }
    );
  }

  // ---------------- Ruta protegida / pánico ----------------
  var silentCheckTimer = null;

  function buildExpectedPath(minorProfile, stopsById, routesById) {
    var route = routesById[minorProfile.usualRouteId];
    if (!route) return [];
    return route.stops.map(function (id) { return stopsById[id]; }).filter(Boolean).map(function (s) { return { lat: s.lat, lng: s.lng }; });
  }

  function renderSafetyPanel(status) {
    var card = document.getElementById("safety-card");
    var minor = DATA.guardians.minorProfile;
    var routeName = (DATA.routes.filter(function (r) { return r.id === minor.usualRouteId; })[0] || {}).name || minor.usualRouteId;
    var map = {
      en_ruta: { label: "✅ En ruta, todo normal", cls: "status-en_ruta" },
      chequeo_silencioso: { label: "🔔 Chequeo silencioso enviado, esperando confirmación…", cls: "status-chequeo_silencioso" },
      alerta: { label: "🚨 Alerta enviada a contactos de confianza", cls: "status-alerta" },
      panico: { label: "🆘 Botón de pánico activado", cls: "status-panico" },
    };
    var info = map[status.state] || map.en_ruta;

    card.innerHTML =
      "<p><strong>" + minor.name + "</strong> (" + minor.age + " años) — ruta habitual: " + routeName + "</p>" +
      '<p class="' + info.cls + '" style="font-weight:700;">' + info.label + "</p>" +
      (status.distanceMeters != null ? '<p class="muted small">Distancia al corredor esperado: ' + status.distanceMeters + " m</p>" : "") +
      (status.state === "chequeo_silencioso" ? '<button id="confirm-safe-btn" class="btn-secondary">✅ Estoy bien</button>' : "") +
      (status.state === "alerta" || status.state === "panico"
        ? '<p class="muted small">Puntos seguros sugeridos: ' + DATA.guardians.puntosSeguros.map(function (p) { return p.name; }).join(", ") + "</p>" : "");

    var confirmBtn = document.getElementById("confirm-safe-btn");
    if (confirmBtn) confirmBtn.addEventListener("click", function () {
      clearTimeout(silentCheckTimer);
      renderSafetyPanel({ state: "en_ruta" });
    });
  }

  function renderGuardiansAndSafePoints() {
    var g = DATA.guardians;
    document.getElementById("guardians-list").innerHTML = g.guardians.map(function (x) {
      return '<div class="guardian-row"><span>' + x.name + '</span><span class="muted small">' + x.relation + (x.verified ? " ✅" : "") + "</span></div>";
    }).join("");
    document.getElementById("safe-points-list").innerHTML = g.puntosSeguros.map(function (x) {
      return '<div class="safepoint-row"><span>' + x.name + "</span></div>";
    }).join("");
  }

  function onSimulateDeviation() {
    var minor = DATA.guardians.minorProfile;
    var stopsById = {}; DATA.stops.forEach(function (s) { stopsById[s.id] = s; });
    var routesById = {}; DATA.routes.forEach(function (r) { routesById[r.id] = r; });
    var expectedPath = buildExpectedPath(minor, stopsById, routesById);
    var farAway = { lat: (stopsById[minor.originStopId] ? stopsById[minor.originStopId].lat : 4.55) + 0.02, lng: -74.10 };

    var result = evaluateCorridor(minor, farAway, expectedPath);
    clearTimeout(silentCheckTimer);

    if (result.state === "chequeo_silencioso") {
      renderSafetyPanel({ state: "chequeo_silencioso", distanceMeters: result.distanceMeters });
      silentCheckTimer = setTimeout(function () {
        state.activeAlert = buildGuardianAlert(minor, DATA.guardians.guardians, minor.name + " se salió de la ruta habitual y no respondió el chequeo silencioso.");
        renderSafetyPanel({ state: "alerta" });
      }, 8000);
    } else {
      state.activeAlert = buildGuardianAlert(minor, DATA.guardians.guardians, minor.name + " se alejó significativamente de su ruta habitual (" + result.distanceMeters + " m).");
      renderSafetyPanel({ state: "alerta", distanceMeters: result.distanceMeters });
    }
  }

  function onPanicPressed() {
    var minor = DATA.guardians.minorProfile;
    state.activeAlert = buildGuardianAlert(minor, DATA.guardians.guardians, minor.name + " activó el botón de pánico.", { priority: "alta" });
    renderSafetyPanel({ state: "panico" });
    var seguridadBtn = document.querySelector('[data-tab="seguridad"]');
    if (seguridadBtn) seguridadBtn.click();
  }

  // ======================================================
  // BOOT
  // ======================================================
  function boot() {
    fillSelects();
    renderReportsChip();
    renderSocialFeed();
    renderSafetyPanel({ state: "en_ruta" });
    renderGuardiansAndSafePoints();
    updateModeBadge();

    document.getElementById("trip-form").addEventListener("submit", onSearchSubmit);
    document.getElementById("reports-chip").addEventListener("click", openReportsModal);
    document.getElementById("new-post-btn").addEventListener("click", openPostModal);
    document.getElementById("panic-btn").addEventListener("click", onPanicPressed);
    document.getElementById("panic-btn-2").addEventListener("click", onPanicPressed);
    document.getElementById("simulate-deviation-btn").addEventListener("click", onSimulateDeviation);
    document.getElementById("simulate-reset-btn").addEventListener("click", function () {
      clearTimeout(silentCheckTimer);
      renderSafetyPanel({ state: "en_ruta" });
    });

    wirePillsAndChips();
    initTabs(function (tab) { if (tab === "social") renderSocialFeed(); });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
