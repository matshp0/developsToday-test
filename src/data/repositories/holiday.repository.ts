import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Holiday } from '../schemas/holiday.schema';
import { Model } from 'mongoose';

@Injectable()
export class HolidayRepository {
  constructor(
    @InjectModel(Holiday.name) private holidayModel: Model<Holiday>,
  ) {}

  async addHolidays(userId: string, holidays: Holiday[]) {
    const existingHolidays = await this.holidayModel
      .find({
        userId,
        date: { $in: holidays.map((h) => h.date) },
        name: { $in: holidays.map((h) => h.name) },
      })
      .lean()
      .exec();

    const uniqueHolidaysToSave = holidays.filter(
      (newHoliday) =>
        !existingHolidays.some(
          (existing) =>
            existing.userId === userId &&
            existing.date === newHoliday.date &&
            existing.name === newHoliday.name,
        ),
    );

    if (uniqueHolidaysToSave.length > 0) {
      await this.holidayModel.insertMany(uniqueHolidaysToSave);
    }
    return uniqueHolidaysToSave;
  }
}
