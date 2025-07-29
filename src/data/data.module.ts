import { Module } from '@nestjs/common';
import { HolidayRepository } from './repositories/holiday.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaySchema } from './schemas/holiday.schema';

@Module({
  providers: [HolidayRepository],
  exports: [HolidayRepository],
  imports: [
    MongooseModule.forFeature([{ name: 'Holiday', schema: HolidaySchema }]),
  ],
})
export class DataModule {}
