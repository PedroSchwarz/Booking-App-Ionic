import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings: Booking[] = [
    new Booking('b1', 'p1', 'u1', 'Manhattan Mansion', 2),
    new Booking('b2', 'p2', 'u2', 'Osaka Temple', 4),
  ];

  constructor() { }

  get bookings() {
    return [...this._bookings];
  }
}
