import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll(): Promise<FlightResponseDto[]> {
    return this.flightsService.findAll();
  }

  @Get('search')
  async searchFlights(@Query() searchDto: SearchFlightsDto): Promise<FlightResponseDto[]> {
    return this.flightsService.searchFlights(searchDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FlightResponseDto> {
    return this.flightsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createFlightDto: CreateFlightDto,
    @CurrentUser() user: any,
  ): Promise<FlightResponseDto> {
    return this.flightsService.create(createFlightDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlightDto: UpdateFlightDto,
    @CurrentUser() user: any,
  ): Promise<FlightResponseDto> {
    return this.flightsService.update(id, updateFlightDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.flightsService.remove(id);
  }
} 