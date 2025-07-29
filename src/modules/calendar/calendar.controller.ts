import { Controller, Post, Param, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AddHolidayDto } from 'src/dto/addHoliday.dto';

@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('addHolidays')
  async addHolidays(
    @Param('userId') userId: string,
    @Body() body: AddHolidayDto,
  ) {
    return await this.calendarService.addHolidays(userId, body);
  }
}
