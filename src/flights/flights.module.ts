import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { SupabaseService } from '../services/supabase.service';

@Module({
  controllers: [FlightsController],
  providers: [FlightsService, SupabaseService],
})
export class FlightsModule {} 