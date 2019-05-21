import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1', 'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99,
      new Date('2019-02-02'),
      new Date('2020-02-02')
    ),
    new Place(
      'p2', 'Osaka Temple',
      'Mixing modern with acient culture',
      'https://cdn.sweetescape.com/images/cities/osaka/cover/ba725feb-46fa-4913-b321-68e74c75d2ce-1920.jpg',
      260.00,
      new Date('2019-02-02'),
      new Date('2020-02-02')
    ),
    new Place(
      'p3', 'Gramado House',
      'Romantic city, clean, nice weather and people!',
      'https://cdn.zarpo.com.br/media/catalog/product/cache/1/base/640x360/9df78eab33525d08d6e5fb8d27136e95/g/r/gramado_arquitetura_2.jpg',
      800.00,
      new Date('2019-02-02'),
      new Date('2020-02-02')
    ),
  ];

  get places() {
    return [...this._places];
  }

  singlePlace(placeId: string) {
    return {...this._places.find(place => place.id === placeId)};
  }

  singleOffer(offerId: string) {
    return {...this._places.find(place => place.id === offerId)};
  }

  constructor() { }
}
