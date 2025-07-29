import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Country,
  CountryFlagResponse,
  CountryInfoResponse,
  CountryPopulationResponse,
} from 'src/types/external-api.types';

@Injectable()
export class CountriesService {
  private readonly dateNagerApi = 'https://dte.nager.at/api/v3';
  private readonly countriesNowApi = 'https://countriesnow.space/api/v0.1';
  private readonly logger = new Logger(CountriesService.name);

  constructor(private httpService: HttpService) {}

  async getAvailableCountries(): Promise<Country[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Country[]>(`${this.dateNagerApi}/AvailableCountries`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error(
              'An error happened while fetching available countries!',
            );
          }),
        ),
    );
    return data;
  }

  async getCountryInfo(code: string) {
    const { commonName, borders } = await this.fetchCountryInfo(code);
    const [{ populationCounts }, { flag }] = await Promise.all([
      this.fetchPopulationData(commonName),
      this.fetchFlagUrl(commonName),
    ]);

    return {
      borders,
      population: populationCounts,
      flagUrl: flag,
    };
  }

  private async fetchPopulationData(country: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<CountryPopulationResponse>(
          `${this.countriesNowApi}/countries/population`,
          {
            country,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error(
              'An error happened while fetching population data!',
            );
          }),
        ),
    );
    return data.data;
  }

  private async fetchCountryInfo(code: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<CountryInfoResponse>(`${this.dateNagerApi}/countryinfo/${code}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('An error happened while fetching borders!');
          }),
        ),
    );
    return data;
  }

  private async fetchFlagUrl(country: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<CountryFlagResponse>(
          `${this.countriesNowApi}/countries/flag/images`,
          {
            country,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('An error happened while fetching flag URL!');
          }),
        ),
    );
    return data.data;
  }
}
