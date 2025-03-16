import { Injectable, BadRequestException, NotFoundException  } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];


interface TicketRequest {
  flight_id: string;
  passenger_name: string;
  seat_class: 'economy' | 'premium' | 'business' | 'first_class';
}

@Injectable()
export class BookingsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(userId: string, page: number = 1, limit: number = 100) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, error, count } = await this.supabaseService.client
      .from('bookings')
      .select('*, flights!bookings_flight_id_fkey(*), tickets(*)', { count: 'exact' }) // Get total count
      .eq('user_id', userId)
      .range(start, end); // Apply pagination

    if (error) throw error;

    return {
        data,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
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

  async createBookingWithTickets(
    userId: string,
    ticketsData: TicketRequest[],
    return_booked: boolean
  ) {
    if (ticketsData.length === 0) {
      throw new BadRequestException('No tickets provided');
    }

    // Group tickets by flight_id
    console.log("ticketsData", ticketsData);
    const flightsMap = new Map<string, TicketRequest[]>();
    for (const ticket of ticketsData) {
      if (!flightsMap.has(ticket.flight_id)) {
        flightsMap.set(ticket.flight_id, []);
      }
      flightsMap.get(ticket.flight_id)?.push(ticket);
    }
    let totalPrice = 0;
    const ticketsToInsert: TicketInsert[] = [];
    let flight;

    for (const [flightId, tickets] of flightsMap.entries()) {
      // Get flight details
      const { data: flight1, error: flightError } = await this.supabaseService.client
        .from('flights')
        .select('*')
        .eq('id', flightId)
        .single();
      if (flightError || !flight1) {

        throw new NotFoundException(`Flight ${flightId} not found`);
      }

      flight = flight1
      // Check available seats for each seat class
      const seatCount: Record<string, number> = {};
      for (const ticket of tickets) {
        seatCount[ticket.seat_class] = (seatCount[ticket.seat_class] || 0) + 1;
      }

      for (const [seatClass, count] of Object.entries(seatCount)) {

        if (flight[`${seatClass}_available`] < count) {
          throw new BadRequestException(
            `Not enough ${seatClass} seats available on flight ${flightId}`
          );
        }
      }

      // Calculate total price & prepare tickets
      for (const ticket of tickets) {
        const pricePerTicket = flight[`${ticket.seat_class}_price`];
        totalPrice += pricePerTicket;

        ticketsToInsert.push({
          booking_id: '', // Placeholder, will update after booking creation
          flight_id: ticket.flight_id,
          passenger_name: ticket.passenger_name,
          seat_class: ticket.seat_class,
          seat_number: null, // Assign if needed
          price: pricePerTicket,
        });
      }
    }

    // Create booking record
    const bookingInsert: BookingInsert = {
      user_id: userId,
      flight_id: ticketsData[0].flight_id, // Assuming one booking per flight
      return_flight_id: return_booked ? ticketsData[ticketsData.length - 1].flight_id : null,
      passenger_name: ticketsData.map(t => t.passenger_name).join(', '),
      total_tickets: ticketsData.length,
      total_price_paid: totalPrice,
    };

    const { data: booking, error: bookingError } = await this.supabaseService.client
      .from('bookings')
      .insert([bookingInsert])
      .select('*')
      .single();

    if (bookingError) {
      throw new BadRequestException('Failed to create booking');
    }

    // Update tickets with booking ID
    ticketsToInsert.forEach(ticket => (ticket.booking_id = booking.id));
    // Insert tickets
    const { error: ticketError } = await this.supabaseService.client
      .from('tickets')
      .insert(ticketsToInsert);

    if (ticketError) {
      throw new BadRequestException('Failed to create tickets');
    }
    // Update available seats for each flight
    for (const [flightId, tickets] of flightsMap.entries()) {
      const seatUpdates: Record<string, number> = {};
      for (const ticket of tickets) {
        seatUpdates[ticket.seat_class] =
          (seatUpdates[ticket.seat_class] || 0) + 1;
      }

      const seatUpdateQuery: Record<string, number> = {};
      for (const [seatClass, count] of Object.entries(seatUpdates)) {
        seatUpdateQuery[`${seatClass}_seats`] = flight[`${seatClass}_seats`] - count;
      }

      const { error: seatUpdateError } = await this.supabaseService.client
        .from('flights')
        .update(seatUpdateQuery)
        .eq('id', flightId);

      if (seatUpdateError) {
        throw new BadRequestException('Failed to update available seats');
      }
    }

    return {
      booking,
      tickets: ticketsToInsert,
      message: 'Booking and tickets created successfully',
    };
  }

  async getAllTickets(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select(`
        *,
        tickets(*),
        flights_outbound:flights!bookings_flight_id_fkey(*),
        flights_return:flights!bookings_return_flight_id_fkey(*)
      `)
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching bookings with tickets:', error.message, error.details);
      throw error;
    }
  
    return data;
  }

  async updateTicketStatus(ticketId: string) {
    // Get ticket and booking details first
    const { data: ticket, error: findError } = await this.supabaseService.client
      .from('tickets')
      .select('*, bookings(*)')
      .eq('id', ticketId)
      .single();

    if (findError) throw findError;
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Update ticket status
    const { error: ticketError } = await this.supabaseService.client
      .from('tickets')
      .update({ active: false })
      .eq('id', ticketId);

    if (ticketError) throw ticketError;

    // Get remaining active tickets for this booking
    const { data: activeTickets, error: activeTicketsError } = await this.supabaseService.client
      .from('tickets')
      .select('passenger_name')
      .eq('booking_id', ticket.booking_id)
      .eq('active', true);

    if (activeTicketsError) throw activeTicketsError;

    // Update booking with new total_tickets and passenger_names
    const { data: updatedBooking, error: bookingError } = await this.supabaseService.client
      .from('bookings')
      .update({
        total_tickets: activeTickets.length,
        passenger_name: activeTickets.map(t => t.passenger_name).join(', ')
      })
      .eq('id', ticket.booking_id)
      .select()
      .single();

    if (bookingError) throw bookingError;

    return {
      ticket,
      booking: updatedBooking,
      message: 'Ticket deactivated and booking updated successfully'
    };
  }


}

