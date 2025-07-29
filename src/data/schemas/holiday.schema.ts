import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HolidayDocument = HydratedDocument<Holiday>;

@Schema()
export class Holiday {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  date: string;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
