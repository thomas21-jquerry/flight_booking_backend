import { IsString, IsNumber, IsNotEmpty, Min, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  airline: string;

  @IsString()
  @IsNotEmpty()
  flight_number: string;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  @IsNotEmpty()
  departure_time: string;

  @IsDateString()
  @IsNotEmpty()
  arrival_time: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  available_seats: number;
} 