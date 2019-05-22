import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[] = [];
  private offersSub: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.offersSub = this.placesService.places.subscribe(places => {
      this.loadedOffers = places;
    });
  }

  ngOnDestroy() {
    if (this.offersSub) {
      this.offersSub.unsubscribe();
    }
  }
}
