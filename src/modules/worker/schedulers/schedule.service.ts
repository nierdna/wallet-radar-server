import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ScheduleService implements OnApplicationBootstrap, OnModuleInit {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    console.log('🔍 ScheduleService onModuleInit');
  }

  async onApplicationBootstrap() {
    console.log('🔍 ScheduleService onApplicationBootstrap');
  }
}
