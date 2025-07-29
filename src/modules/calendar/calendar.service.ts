import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddHolidayDto } from 'src/dto/addHoliday.dto';
import { HolidayRepository } from 'src/data/repositories/holiday.repository';
import {
  HolidayBadRequestResponse,
  HolidayResponse,
} from 'src/types/external-api.types';

@Injectable()
export class CalendarService {
  private readonly dateNagerApi = 'https://date.nager.at/api/v3';

  constructor(
    private httpService: HttpService,
    private holidayRepository: HolidayRepository,
  ) {}

  async addHolidays(userId: string, body: AddHolidayDto) {
    const { countryCode, year, holidays } = body;
    const allHolidays = await this.fetchHolidays(countryCode, year);
    if (!holidays)
      return await this.holidayRepository.addHolidays(
        userId,
        allHolidays.map(({ name, date }) => ({
          name,
          countryCode,
          date,
          userId,
        })),
      );
    const selectedHolidays = allHolidays.filter(({ name }) =>
      holidays.includes(name),
    );
    const holidaysToSave = selectedHolidays.map(({ name, date }) => ({
      userId,
      countryCode,
      name,
      date,
    }));
    return await this.holidayRepository.addHolidays(userId, holidaysToSave);
  }

  private async fetchHolidays(countryCode: string, year: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<HolidayResponse>(
          `${this.dateNagerApi}/PublicHolidays/${year}/${countryCode}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response?.status === 404) {
              throw new NotFoundException(
                `Country with code ${countryCode} not found`,
              );
            }
            if (error.response?.status === 400) {
              const { title, errors } = error.response
                .data as HolidayBadRequestResponse;
              throw new BadRequestException({
                message: title,
                errors: errors,
              });
            }
            throw new Error('An error happened while fetching borders!');
          }),
        ),
    );
    return data;
  }
}
