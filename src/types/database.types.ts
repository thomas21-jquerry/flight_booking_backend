export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string
          airline: string
          flight_number: string
          origin: string
          destination: string
          departure_time: string
          arrival_time: string
          duration: string
          price: number
          available_seats: number
          created_at: string
        }
        Insert: {
          id?: string
          airline: string
          flight_number: string
          origin: string
          destination: string
          departure_time: string
          arrival_time: string
          duration: string
          price: number
          available_seats: number
          created_at?: string
        }
        Update: {
          id?: string
          airline?: string
          flight_number?: string
          origin?: string
          destination?: string
          departure_time?: string
          arrival_time?: string
          duration?: string
          price?: number
          available_seats?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          flight_id: string
          return_flight_id: string | null
          passenger_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          flight_id: string
          return_flight_id?: string | null
          passenger_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flight_id?: string
          return_flight_id?: string | null
          passenger_name?: string
          created_at?: string
        }
      }
    }
  }
} 