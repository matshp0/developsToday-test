import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('available')
  async getAvailableCountries() {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':code')
  async getCountryInfo(@Param('code') code: string) {
    const countryInfo = await this.countriesService.getCountryInfo(code);
    if (!countryInfo) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }
    return countryInfo;
  }
}
