import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { Database } from '../types/database.types';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';

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
} 