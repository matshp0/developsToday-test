import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [HttpModule, DataModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
