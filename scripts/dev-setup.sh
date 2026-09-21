#!/bin/bash
# TODO: npm install en backend + frontend
echo "Setting up backend..."
cd backend && npm install

echo "Setting up frontend..."
cd ../frontend && npm install

echo "Done!"