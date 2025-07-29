export interface CountryFlagResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    flag: string;
    iso2: string;
    iso3: string;
  };
}

export interface PopulationCount {
  year: number;
  value: number;
}

export interface CountryPopulationResponse {
  error: boolean;
  msg: string;
  data: {
    country: string;
    code: string;
    iso3: string;
    populationCounts: PopulationCount[];
  };
}

export interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: null | BorderCountry[];
}

export interface Country {
  code: string;
  name: string;
}

export interface CountryInfoResponse {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: BorderCountry[];
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: null | string[];
  launchYear: null | number;
  types: string[];
}

export type HolidayResponse = Holiday[];
