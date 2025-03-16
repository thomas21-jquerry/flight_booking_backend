import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { Database } from '../types/database.types';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<FlightResponseDto[]> {
    const { data, error } = await this.supabaseService.client
      .from('flights')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<FlightResponseDto> {
    const { data, error } = await this.supabaseService.client
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async searchFlights(searchDto: SearchFlightsDto): Promise<FlightResponseDto[]> {
    const { origin, destination, date } = searchDto;
    const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  // console.log({ startOfDay, endOfDay }); // Debugging

  const { data, error } = await this.supabaseService.client
  .from('flights')
  .select('*')
  .eq('origin', origin)
  .eq('destination', destination)
  .gte('departure_time', startOfDay)
  .lte('departure_time', endOfDay)
  .or(
    'economy_seats.gt.0, premium_seats.gt.0, business_seats.gt.0, first_class_seats.gt.0'
  );
    
    if (error) throw error;
    return data;
  }

  async create(createFlightDto: CreateFlightDto): Promise<FlightResponseDto> {
    const { data, error } = await this.supabaseService.client
      .from('flights')
      .insert([createFlightDto])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<FlightResponseDto> {
    const { data, error } = await this.supabaseService.client
      .from('flights')
      .update(updateFlightDto)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('flights')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async recommendation(searchDto: SearchFlightsDto): Promise<FlightResponseDto[]> {
    try {
      const { origin, destination, date } = searchDto;
      
      // Calculate the date range (2 days before and 2 days after)
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - 5);
      const startOfDay = startDate.toISOString().split('T')[0] + " 00:00:00";
  
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 5);
      const endOfDay = endDate.toISOString().split('T')[0] + " 23:59:59";
  
      const { data, error } = await this.supabaseService.client
        .from('flights')
        .select('*')
        .eq('origin', origin)
        .eq('destination', destination)
        .gte('departure_time', startOfDay)
        .lte('departure_time', endOfDay)
        .or('economy_seats.gt.0, premium_seats.gt.0, business_seats.gt.0, first_class_seats.gt.0');
  
      if (error) throw error;
      
      return data;
    } catch (err) {
      return [];
    }
  };
  

} 