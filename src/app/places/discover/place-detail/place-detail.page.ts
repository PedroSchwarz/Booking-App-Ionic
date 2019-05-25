import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  placeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private authService: AuthService,
    private bookingsService: BookingsService,
    private navCtrl: NavController,
    private router: Router,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.isLoading = true;
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.placeSub = this.placesService.singlePlace(placeId).subscribe(place => {
        this.place = place;
        this.isBookable = this.place.userId !== this.authService.userId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error Occurred!',
          message: 'Place couldn\'t be fetched. Please try again later.',
          buttons: [{text: 'OK', handler: () => {
            this.router.navigateByUrl('/places/tabs/discover');
          }}]
        })
        .then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.actionSheetCtrl.create(
      {
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select a Date',
            handler: () => {
              this.openBookingModel('select');
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModel('random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }
    )
    .then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModel(mode: 'select' | 'random') {
    this.modalCtrl.create({component: CreateBookingComponent, componentProps: {selectedPlace: this.place, mode}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: 'Booking...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingsService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.dateFrom,
            data.dateTo).subscribe(() => {
              loadingEl.dismiss();
            });
        });
      }
    });
  }
}
