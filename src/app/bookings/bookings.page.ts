import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[] = [];

  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onDeleteBooking(bookingId: string) {
    console.log(bookingId);
    return;
  }
}
