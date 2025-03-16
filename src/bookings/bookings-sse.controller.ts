// src/bookings/bookings-sse.controller.ts
import { Controller, Sse, Query, UnauthorizedException } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupabaseService } from '../services/supabase.service';

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('booking')
export class BookingsSseController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly supabaseService: SupabaseService
  ) {}

  @Sse('events')
  async sse(@Query('token') token: string): Promise<Observable<MessageEvent>> {
    console.log(`[BookingsSseController] SSE connection opened`);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const { data: { user }, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !user) {
      console.error(`[SSE] Authentication error: ${error?.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log(user, 'user');

    const userId = user.id;
    console.log(`[BookingsSseController] Authenticated userId: ${userId}`);

    const subject = new Subject<MessageEvent>();

    this.eventEmitter.on('booking_confirmed', (eventData) => {
      console.log('got the event', eventData.user_id, userId);
      if (eventData.user_id === userId) {
        console.log('here');
        const event = {
          type: 'booking_confirmed',
          id: '1',
          data: JSON.stringify({ booking_id: eventData.booking_id, status: eventData.status }),
        };
        // Check if subject is still subscribed before sending
        if (!subject.closed) {
          subject.next(event);
          console.log('[BookingsSseController] Event sent to subject:', event);
        } else {
          console.log('[BookingsSseController] Subject closed, event not sent:', event);
        }
      }
    });

    return new Observable<MessageEvent>((observer) => {
      subject.subscribe(observer);
      return () => {
        console.log('[BookingsSseController] Client disconnected, cleaning up');
        subject.unsubscribe();
      };
    }).pipe(
      map((event: MessageEvent) => {
        console.log('[BookingsSseController] Event mapped for SSE:', event);
        return {
          ...event,
          data: typeof event.data === 'string' ? event.data : JSON.stringify(event.data),
        };
      })
    );
  }
}