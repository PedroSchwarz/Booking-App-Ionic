import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  userLocation: any;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onLocateUser(){
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    } else {
      Plugins.Geolocation.getCurrentPosition()
        .then(geoLocation => {
          this.userLocation = geoLocation.coords;
        })
        .catch(err => {
          return;
        });
    }
  }

  onCreateOffer() {
    if (!this.form.valid || !this.userLocation) {
      return;
    } else {
      const values = this.form.value;
      this.loadingCtrl.create({
        message: 'Saving...'
      }).then(loadingEl => {
        loadingEl.present();
        this.placesService.addPlace(
          values.title,
          values.description,
          +values.price,
          new Date(values.dateFrom),
          new Date(values.dateTo)
          ).subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('/places/tabs/offers');
          });
      });
    }
  }
}
