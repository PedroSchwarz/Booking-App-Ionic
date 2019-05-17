import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;

  constructor() { }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
}
