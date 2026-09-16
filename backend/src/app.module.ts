import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma.module.js';
import { JobsModule } from './jobs/jobs.module.js';



@Module({
  imports: [

    JobsModule,
    PrismaModule,
  ],
  
  controllers: [],
  providers: [],
})
export class AppModule {}
