import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

@Injectable()
export class BookingsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select('*, flights(*)');
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select('*, flights(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(bookingData: BookingInsert) {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .insert([bookingData])
      .select('*, flights(*)');
    
    if (error) throw error;
    return data[0];
  }

  async update(id: string, bookingData: BookingUpdate) {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select('*, flights(*)');
    
    if (error) throw error;
    return data[0];
  }

  async remove(id: string) {
    const { error } = await this.supabaseService.client
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select('*, flights(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
} 