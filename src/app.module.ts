import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';
import { CalendarModule } from './calendar/calendar.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import configSchema from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configSchema,
    }),
    CountriesModule,
    CalendarModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbUrl'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
