import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.key');
    
    if (!url || !key) {
      throw new Error('Supabase credentials are not properly configured');
    }

    this.supabase = createClient<Database>(url, key);
  }

  get client() {
    return this.supabase;
  }
} 