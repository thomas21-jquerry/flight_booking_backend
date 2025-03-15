import { Database } from '../../types/database.types';

type FlightRow = Database['public']['Tables']['flights']['Row'];

export class FlightResponseDto implements FlightRow {
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
  available_seats: number;
  created_at: string;
} 