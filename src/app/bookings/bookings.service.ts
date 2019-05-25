import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this.httpClient.get<{[key: string]: BookingData}>(
      `https://booking-app-ionic.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    )
    .pipe(
      map(resData => {
        const bookings = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const booking = resData[key];
            bookings.push(new Booking(
              key,
              booking.placeId,
              booking.userId,
              booking.placeTitle,
              booking.placeImage,
              booking.firstName,
              booking.lastName,
              booking.guestNumber,
              new Date(booking.bookedFrom),
              new Date(booking.bookedTo)
            ));
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let newBookingId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.httpClient.post<{name: string}>('https://booking-app-ionic.firebaseio.com/bookings.json', {...newBooking, id: null})
    .pipe(
      switchMap(resData => {
        newBookingId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(places => {
        newBooking.id = newBookingId;
        this._bookings.next(places.concat(newBooking));
      })
    );
  }

  deleteBooking(bookingId: string) {
    return this.httpClient.delete(`https://booking-app-ionic.firebaseio.com/bookings/${bookingId}.json`)
    .pipe(
      switchMap(resData => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
      })
    );
  }
}
