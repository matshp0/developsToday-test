import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HolidayResponse } from 'src/types/external-api.types';
import { InjectModel } from '@nestjs/mongoose';
import { Holiday } from 'src/data/schemas/holiday.schema';
import { Model } from 'mongoose';

@Injectable()
export class CalendarService {
  private readonly dateNagerApi = 'https://date.nager.at/api/v3';
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel(Holiday.name) private holidayModel: Model<Holiday>,
  ) {}

  async addHolidays(
    userId: string,
    countryCode: string,
    year: number,
    holidays: string[],
  ) {
    const allHolidays = await this.fetchHolidays(countryCode, year);
    const selectedHolidays = allHolidays.filter(({ name }) =>
      holidays.includes(name),
    );
    const holidaysToSave = selectedHolidays.map(({ name, date }) => ({
      userId,
      name,
      date,
    }));

    const existingHolidays = await this.holidayModel
      .find({
        userId,
        date: { $in: holidaysToSave.map((h) => h.date) },
        name: { $in: holidaysToSave.map((h) => h.name) },
      })
      .lean()
      .exec();

    const uniqueHolidaysToSave = holidaysToSave.filter(
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
  }

  private async fetchHolidays(countryCode: string, year: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<HolidayResponse>(
          `${this.dateNagerApi}/PublicHolidays/${year}/${countryCode}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('An error happened while fetching holidays!');
          }),
        ),
    );
    return data;
  }
}
