import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Place;
  form: FormGroup;
  isLoading = false;
  private offerSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.isLoading = true;
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const offerId = paramMap.get('offerId');
      this.offerSub = this.placesService.singlePlace(offerId).subscribe(place => {
        this.offer = place;
        this.form = new FormGroup({
          title: new FormControl(this.offer.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.offer.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(150)]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error Occurred!',
          message: 'Place couldn\'t be fetched. Please try again later.',
          buttons: [{text: 'OK', handler: () => {
            this.router.navigateByUrl('/places/tabs/offers');
          }}]
        })
        .then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    } else {
      const values = this.form.value;
      this.loadingCtrl.create({
        message: 'Updating...'
      }).then(loadingEl => {
        loadingEl.present();
        this.placesService.updatePlace(this.offer.id, values.title, values.description)
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offers');
        });
      });
    }
  }
}
