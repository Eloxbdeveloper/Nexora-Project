import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IncidentsModule } from './incidents/incidents.module';
import { ReportsModule } from './reports/reports.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { IncidentsModule } from './incidents.module';
import { IncidentsModule } from './incidents.module';
import { IncidentsModule } from './incidents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    IncidentsModule,
    ReportsModule,
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}