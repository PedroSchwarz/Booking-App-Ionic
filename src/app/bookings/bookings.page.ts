import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[] = [];
  bookingsSub: Subscription;

  constructor(private bookingsService: BookingsService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingsSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  onDeleteBooking(bookingId: string) {
    this.loadingCtrl.create({message: 'Deleting...'})
    .then(loadingEl => {
      loadingEl.present();
      this.bookingsService.deleteBooking(bookingId)
      .subscribe(() => {
        loadingEl.dismiss();
      });
    });
    // this.alertCtrl.create({
    //   header: 'Are You Sure?',
    //   message: 'Do you want to delete this booking?',
    //   buttons: [
    //     {
    //       text: 'Delete',
    //       handler: () => {
    //         this.loadingCtrl.create({message: 'Deleting...'})
    //         .then(loadingEl => {
    //           loadingEl.present();
    //           this.bookingsService.deleteBooking(bookingId)
    //           .subscribe(() => {
    //             loadingEl.dismiss();
    //           });
    //         });
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel'
    //     }
    //   ]
    // })
    // .then(alertEl => {
    //   alertEl.present();
    // });
  }
}
