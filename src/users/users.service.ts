import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserProfile } from '../types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<UserProfile> {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .upsert([{ user_id: userId, ...createProfileDto }], { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabaseService
      .client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException('Profile not found');
    
    return data;
  }

  async updateProfile(userId: string, updateData: Partial<CreateProfileDto>): Promise<UserProfile> {
    const { data, error } = await this.supabaseService
      .client
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException('Profile not found');

    return data;
  }

  async deleteProfile(userId: string): Promise<void> {
    const { error } = await this.supabaseService
      .client
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  async sendEmail(userId: string): Promise<void> {
   
  }
} 