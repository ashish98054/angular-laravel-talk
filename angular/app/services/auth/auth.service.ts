import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RouteHelper } from '../../helpers';
import { StorageService } from '../storage/storage.service';
import { AuthResponseInterface, AuthUserInterface, AuthTokenInterface } from  '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authToken = new BehaviorSubject<AuthTokenInterface>(null);
  public authUser = new BehaviorSubject<AuthUserInterface>(null);

  constructor(
    private _http: HttpClient,
    private _route: RouteHelper,
    private _storage: StorageService
  ) {
    this.authToken.next(this._authToken);
    this.authUser.next(this._authUser);
  }

  emailAuth(params:any) {
    return this._http.post<AuthResponseInterface>(this._route.route('auth.email'), params);
  }

  socialAuth(provider:string, params:any) {
    return this._http.post<AuthResponseInterface>(this._route.route('auth.social', {provider: provider}), params);
  }

  set _authToken(authToken:AuthTokenInterface) {
    authToken.expires_in = DateTime.local().plus({
      seconds: authToken.expires_in
    }).valueOf();
    this.authToken.next(authToken);
    this._storage.setItem('authToken', authToken);
  }

  get _authToken() {
    return this._storage.getItem('authToken');
  }

  set _authUser(authUser:AuthUserInterface) {
    this.authUser.next(authUser);
    this._storage.setItem('authUser', authUser);
  }

  get _authUser() {
    return this._storage.getItem('authUser');
  }

  get authorizationHeader() {
    if ( this._authToken ) {
      return `${this._authToken.token_type} ${this._authToken.access_token}`;
    }
    return '';
  }

  get isAuthenticated() {
    if ( this._authToken ) {
      return DateTime.local() < DateTime.fromMillis(this._authToken.expires_in);
    }
    return false;
  }
}
