export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string;
          airline: string;
          flight_number: string;
          origin: string;
          destination: string;
          departure_time: string;
          arrival_time: string;
          duration: string;
          economy_price: number;
          premium_price: number;
          business_price: number;
          first_class_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          airline: string;
          flight_number: string;
          origin: string;
          destination: string;
          departure_time: string;
          arrival_time: string;
          duration: string;
          economy_price?: number;
          premium_price?: number;
          business_price?: number;
          first_class_price?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          airline?: string;
          flight_number?: string;
          origin?: string;
          destination?: string;
          departure_time?: string;
          arrival_time?: string;
          duration?: string;
          economy_price?: number;
          premium_price?: number;
          business_price?: number;
          first_class_price?: number;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          flight_id: string;
          return_flight_id: string | null;
          passenger_name: string;
          total_tickets: number;
          total_price_paid: number;
          created_at: string;
          active: boolean; // New field added
        };
        Insert: {
          id?: string;
          user_id: string;
          flight_id: string;
          return_flight_id?: string | null;
          passenger_name: string;
          total_tickets?: number;
          total_price_paid?: number;
          created_at?: string;
          active?: boolean; // New field added
        };
        Update: {
          id?: string;
          user_id?: string;
          flight_id?: string;
          return_flight_id?: string | null;
          passenger_name?: string;
          total_tickets?: number;
          total_price_paid?: number;
          created_at?: string;
          active?: boolean; // New field added
        };
      };
      tickets: {
        Row: {
          id: string;
          booking_id: string;
          flight_id: string;
          passenger_name: string;
          seat_class: 'economy' | 'premium' | 'business' | 'first_class';
          seat_number: string | null;
          price: number;
          created_at: string;
          active: boolean; // New field added
        };
        Insert: {
          id?: string;
          booking_id: string;
          flight_id: string;
          passenger_name: string;
          seat_class: 'economy' | 'premium' | 'business' | 'first_class';
          seat_number?: string | null;
          price: number;
          created_at?: string;
          active?: boolean; // New field added
        };
        Update: {
          id?: string;
          booking_id?: string;
          flight_id?: string;
          passenger_name?: string;
          seat_class?: 'economy' | 'premium' | 'business' | 'first_class';
          seat_number?: string | null;
          price?: number;
          created_at?: string;
          active?: boolean; // New field added
        };
      };
    };
  };
}
