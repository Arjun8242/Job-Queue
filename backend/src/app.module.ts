import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaService } from './prisma.service.js';
import { JobsModule } from './jobs/jobs.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    JobsModule,
  ],
  
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
