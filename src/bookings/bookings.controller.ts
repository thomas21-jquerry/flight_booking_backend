import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Database } from '../types/database.types';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

interface TicketRequest {
  flight_id: string;
  passenger_name: string;
  seat_class: 'economy' | 'premium' | 'business' | 'first_class';
}

interface CreateBookingDto {
  data: TicketRequest[];
  return_booked: boolean;
}

@ApiTags('Bookings') // Grouping in Swagger UI
@ApiBearerAuth() // Adds Authorization header for JWT
@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Results per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 100,
  ) {
    return this.bookingsService.findAll(user.id, page, limit);
  }

  @ApiOperation({ summary: 'Get a specific booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all bookings for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of bookings for a user' })
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @CurrentUser() user: any) {
    return this.bookingsService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: Object, description: 'Booking details' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
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

  @ApiOperation({ summary: 'Update an existing booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: Object, description: 'Updated booking details' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: BookingUpdate,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.remove(id);
  }

  @ApiOperation({ summary: 'Create a booking with multiple tickets' })
  @ApiBody({
    type: Object,
    description: 'Booking details with multiple tickets',
  })
  @ApiResponse({ status: 201, description: 'Booking and tickets created successfully' })
  @Post('/create')
  async createBookingWithTickets(
    @CurrentUser() user: any,
    @Body() bookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createBookingWithTickets(user.id, bookingDto.data, bookingDto.return_booked);
  }

  @ApiOperation({ summary: 'Get all tickets' })
  @Get('/tickets')
  async findAllTickets(@CurrentUser() user: any) {
      return this.bookingsService.getAllTickets(user.id)
  }

  @ApiOperation({ summary: 'Update ticket status' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket status updated successfully' })
  @Patch('tickets/:id/status')
  async updateTicketStatus(@Param('id') id: string) {
    return this.bookingsService.updateTicketStatus(id);
  }
}
