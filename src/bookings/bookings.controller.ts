import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Database } from '../types/database.types';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
interface TicketRequest {
  flight_id: string;
  passenger_name: string;
  seat_class: 'economy' | 'premium' | 'business' | 'first_class';
}
interface createBookingDto {
  data: TicketRequest[];
  return_booked: boolean;
}

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(@CurrentUser() user: any,
  @Query('page') page = 1,
  @Query('limit') limit = 100,) {
    return this.bookingsService.findAll(user.id, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @CurrentUser() user: any) {
    return this.bookingsService.findByUserId(userId);
  }

  @Post()
  async create(
    @Body() createBookingDto: BookingInsert,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.create({
      ...createBookingDto,
      user_id: user.id,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: BookingUpdate,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.remove(id);
  }

  @Post('/create')
  async createBookingWithTickets(
    @CurrentUser() user: any,
    @Body() bookingDto: createBookingDto,
  ) {
    return this.bookingsService.createBookingWithTickets(user.id, bookingDto.data, bookingDto.return_booked);
  }

  @Get('/tickets')
  async findAllTickets( @CurrentUser() user: any,) {
    // return true
    console.log("here")
    
  }

  @Patch('tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    // @Body('active') active: boolean
  ) {
    return this.bookingsService.updateTicketStatus(id);
  }
} 