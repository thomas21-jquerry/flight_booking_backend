import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { SupabaseService } from '../services/supabase.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

enum SeatClass {
  Economy = "economy",
  Premium = "premium",
  Business = "business",
  FirstClass = "first_class"
}

interface TicketRequest {
  flight_id: string;
  passenger_name: string;
  seat_class: SeatClass;
}

describe('BookingsService', () => {
  let service: BookingsService;
  let supabaseService: SupabaseService;

  const mockSupabaseService = {
    client: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ 
        data: { id: 'ticket1', booking_id: 'booking1' }, 
        error: null 
      }),
      range: jest.fn().mockReturnThis(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated bookings', async () => {
      const mockResponse = {
        data: [{ id: 1, user_id: 'user1' }],
        count: 1,
        error: null,
      };

      mockSupabaseService.client.select.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await service.findAll('user1');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
    });
  });

  describe('updateTicketStatus', () => {
//     it('should update ticket status and booking details', async () => {
//       const mockTicket = {
//         id: 'ticket1',
//         booking_id: 'booking1',
//         passenger_name: 'John Doe',
//       };

//       const mockActiveTickets = [{ passenger_name: 'Jane Doe' }];

//       mockSupabaseService.client.single.mockResolvedValueOnce({
//         data: mockTicket,
//         error: null,
//       });

//       mockSupabaseService.client.eq.mockImplementation(() => ({
//         select: jest.fn().mockResolvedValue({ data: mockActiveTickets, error: null }),
//       }));

//       const result = await service.updateTicketStatus('ticket1');
//       expect(result).toHaveProperty('message', 'Ticket deactivated and booking updated successfully');
//     });

//     it('should throw NotFoundException when ticket not found', async () => {
//       mockSupabaseService.client.single.mockResolvedValueOnce({
//         data: null,
//         error: null,
//       });

//       await expect(service.updateTicketStatus('nonexistent')).rejects.toThrow(NotFoundException);
//     });
  });

  describe('createBookingWithTickets', () => {
    it('should throw BadRequestException when no tickets provided', async () => {
      await expect(service.createBookingWithTickets('user1', [], false)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should create booking with tickets successfully', async () => {
      const mockFlight = {
        id: 'flight1',
        economy_price: 100,
        economy_available: 5,
      };

      const mockTickets: TicketRequest[] = [
        {
          flight_id: 'flight1',
          passenger_name: 'John Doe',
          seat_class: 'economy' as SeatClass, // Correct type
        },
      ];

      mockSupabaseService.client.single.mockResolvedValueOnce({
        data: mockFlight,
        error: null,
      });

      const result = await service.createBookingWithTickets('user1', mockTickets, false);
      expect(result).toHaveProperty('message', 'Booking and tickets created successfully');
    });
  });
});
