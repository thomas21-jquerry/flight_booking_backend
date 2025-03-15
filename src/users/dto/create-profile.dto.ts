import { IsString, IsOptional, IsUrl, IsInt, IsEnum, Min, Max } from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export class CreateProfileDto {
  @IsString()
  full_name: string;

  @IsOptional()
  @IsUrl()
  profile_photo_url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
} 