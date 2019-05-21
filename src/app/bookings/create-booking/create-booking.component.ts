import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() mode: 'select' | 'random';
  @ViewChild('form') form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availablTo = new Date(this.selectedPlace.availableTo);
    if (this.mode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() *
        (availablTo.getTime() -
        7 * 24 * 60 * 60 * 1000 -
        availableFrom.getTime())).toISOString();

      this.endDate = new Date (
        new Date(this.startDate).getTime() +
        Math.random() *
        (new Date(this.startDate).getTime() +
        6 * 24 * 60 * 60 * 1000 -
        new Date(this.startDate).getTime())).toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValidator()) {
      return;
    }
    const values = this.form.value;
    this.modalCtrl.dismiss({bookingData: {
      firstName: values['first-name'],
      lastName: values['last-name'],
      guestNumber: values['guest-number'],
      startDate: values['date-from'],
      endDate: values['date-to']
    }}, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  datesValidator() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
