import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class SearchFlightsDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
} 