import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll(): Promise<FlightResponseDto[]> {
    return this.flightsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FlightResponseDto> {
    return this.flightsService.findOne(id);
  }

  @Post()
  async create(@Body() createFlightDto: CreateFlightDto): Promise<FlightResponseDto> {
    return this.flightsService.create(createFlightDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlightDto: UpdateFlightDto,
  ): Promise<FlightResponseDto> {
    return this.flightsService.update(id, updateFlightDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.flightsService.remove(id);
  }
} 