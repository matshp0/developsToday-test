import { Controller, Post, Param, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('holidays')
  async addHolidays(
    @Param('userId') userId: string,
    @Body() body: { countryCode: string; year: number; holidays: string[] },
  ) {
    const { countryCode, year, holidays } = body;
    const result = await this.calendarService.addHolidays(
      userId,
      countryCode,
      year,
      holidays,
    );
    return { message: 'Holidays added successfully' };
  }
}
