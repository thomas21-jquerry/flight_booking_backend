import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SupabaseService } from '../services/supabase.service';
import { BookingsSseController } from './bookings-sse.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [BookingsController, BookingsSseController],
  providers: [BookingsService, SupabaseService],
})
export class BookingsModule {} 