import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // new Place(
  //   'p1', 'Manhattan Mansion',
  //   'In the heart of New York City',
  //   'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
  //   149.99,
  //   new Date('2019-02-02'),
  //   new Date('2020-02-02'),
  //   'u1'
  // ),
  // new Place(
  //   'p2', 'Osaka Temple',
  //   'Mixing modern with acient culture',
  //   'https://cdn.sweetescape.com/images/cities/osaka/cover/ba725feb-46fa-4913-b321-68e74c75d2ce-1920.jpg',
  //   260.00,
  //   new Date('2019-02-02'),
  //   new Date('2020-02-02'),
  //   'u1'
  // ),
  // new Place(
  //   'p3', 'Gramado House',
  //   'Romantic city, clean, nice weather and people!',
  //   'https://cdn.zarpo.com.br/media/catalog/product/cache/1/base/640x360/9df78eab33525d08d6e5fb8d27136e95/g/r/gramado_arquitetura_2.jpg',
  //   800.00,
  //   new Date('2019-02-02'),
  //   new Date('2020-02-02'),
  //   'u2'
  // ),
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.httpClient.get<{[key: string]: PlaceData}>('https://booking-app-ionic.firebaseio.com/offered-places.json')
    .pipe(
      map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const place = resData[key];
            places.push(
              new Place(
                key,
                place.title,
                place.description,
                place.imageUrl,
                place.price,
                new Date(place.availableFrom),
                new Date(place.availableTo),
                place.userId
              )
            );
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  singlePlace(placeId: string) {
    return this.httpClient.get<PlaceData>(`https://booking-app-ionic.firebaseio.com/offered-places/${placeId}.json`)
    .pipe(map(resData => new Place(
      placeId,
      resData.title,
      resData.description,
      resData.imageUrl,
      resData.price,
      new Date(resData.availableFrom),
      new Date(resData.availableTo),
      resData.userId
      )
    ));
  }

  singleOffer(offerId: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(place => place.id === offerId)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let newPlaceId = null;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://www.oxy.edu/sites/default/files/styles/banner_image/public/page/banner-images/los-angeles_main_1440x800.jpg?itok=GiOVS9-4',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.httpClient.post<{name: string}>('https://booking-app-ionic.firebaseio.com/offered-places.json', {...newPlace, id: null})
    .pipe(
      switchMap(resData => {
        newPlaceId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = newPlaceId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[] = [];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }),
    switchMap(places => {
      const placeIndex = places.findIndex(place => place.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[placeIndex];
      updatedPlaces[placeIndex] = new Place(
        placeId,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );
      return this.httpClient.put(
        `https://booking-app-ionic.firebaseio.com/offered-places/${placeId}.json`,
        {...updatedPlaces[placeIndex], id: null}
      );
    }),
    tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
