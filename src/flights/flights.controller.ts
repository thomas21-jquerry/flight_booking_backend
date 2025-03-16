import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Flights') // Group in Swagger UI
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @ApiOperation({ summary: 'Get all available flights' })
  @ApiResponse({ status: 200, description: 'List of flights', type: [FlightResponseDto] })
  @Get()
  async findAll(): Promise<FlightResponseDto[]> {
    return this.flightsService.findAll();
  }

  @ApiOperation({ summary: 'Get recommended flights based on user preferences' })
  @ApiQuery({ name: 'origin', required: false, description: 'Departure location' })
  @ApiQuery({ name: 'destination', required: false, description: 'Arrival location' })
  @ApiQuery({ name: 'date', required: false, description: 'Flight date' })
  @ApiResponse({ status: 200, description: 'List of recommended flights', type: [FlightResponseDto] })
  @Get('recommend')
  async recommendFlights(@Query() searchDto: SearchFlightsDto): Promise<FlightResponseDto[]> {
    return this.flightsService.recommendation(searchDto);
  }

  @ApiOperation({ summary: 'Search for flights based on criteria' })
  @ApiQuery({ name: 'origin', required: true, description: 'Departure location' })
  @ApiQuery({ name: 'destination', required: true, description: 'Arrival location' })
  @ApiQuery({ name: 'date', required: false, description: 'Flight date' })
  @ApiResponse({ status: 200, description: 'List of matching flights', type: [FlightResponseDto] })
  @Get('search')
  async searchFlights(@Query() searchDto: SearchFlightsDto): Promise<FlightResponseDto[]> {
    return this.flightsService.searchFlights(searchDto);
  }

  @ApiOperation({ summary: 'Get flight details by ID' })
  @ApiParam({ name: 'id', description: 'Flight ID' })
  @ApiResponse({ status: 200, description: 'Flight details', type: FlightResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FlightResponseDto> {
    return this.flightsService.findOne(id);
  }

  // @ApiBearerAuth() // JWT Authentication
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Create a new flight (Admin Only)' })
  // @ApiBody({ type: CreateFlightDto, description: 'Flight details' })
  // @ApiResponse({ status: 201, description: 'Flight created successfully', type: FlightResponseDto })
  // @Post()
  // async create(
  //   @Body() createFlightDto: CreateFlightDto,
  //   @CurrentUser() user: any,
  // ): Promise<FlightResponseDto> {
  //   return this.flightsService.create(createFlightDto);
  // }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Update an existing flight (Admin Only)' })
  // @ApiParam({ name: 'id', description: 'Flight ID' })
  // @ApiBody({ type: UpdateFlightDto, description: 'Updated flight details' })
  // @ApiResponse({ status: 200, description: 'Flight updated successfully', type: FlightResponseDto })
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateFlightDto: UpdateFlightDto,
  //   @CurrentUser() user: any,
  // ): Promise<FlightResponseDto> {
  //   return this.flightsService.update(id, updateFlightDto);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a flight (Admin Only)' })
  @ApiParam({ name: 'id', description: 'Flight ID' })
  @ApiResponse({ status: 200, description: 'Flight deleted successfully' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.flightsService.remove(id);
  }
}
