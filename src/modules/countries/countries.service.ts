import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
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
  private readonly dateNagerApi = 'https://date.nager.at/api/v3';
  private readonly countriesNowApi = 'https://countriesnow.space/api/v0.1';

  constructor(private httpService: HttpService) {}

  async getAvailableCountries(): Promise<Country[]> {
    return await this.fetchAllCountries();
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

  private async fetchAllCountries() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Country[]>(`${this.dateNagerApi}/AvailableCountries`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(
              'An error happened while fetching available countries!',
              error,
            );
          }),
        ),
    );
    return data;
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
            if (error.response?.status === 404) {
              throw new NotFoundException(
                `Country with name ${country} not found`,
              );
            }
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
            if (error.response?.status === 404) {
              throw new NotFoundException(
                `Country with code ${code} not found`,
              );
            }
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
            if (error.response?.status === 404) {
              throw new NotFoundException(
                `Country with name ${country} not found`,
              );
            }
            throw new Error('An error happened while fetching borders!');
          }),
        ),
    );
    return data.data;
  }
}
