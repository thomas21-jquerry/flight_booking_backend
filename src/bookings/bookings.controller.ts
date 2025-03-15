import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Database } from '../types/database.types';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAll();
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
} 