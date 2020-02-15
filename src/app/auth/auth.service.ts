import { HttpPaymentClientService } from './../shared/http-payment-client.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observer, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as auth0 from 'auth0-js';

import { CookieService } from 'ngx-cookie-service';

import * as fromApp from '../shared/store/app.reducers';
import * as TilesActions from '../shared/store/tiles-data.actions';
import { Store } from '@ngrx/store';

(window as any).global = window;

@Injectable()
export class AuthService {
  
  
  userProfile: Observer<any>;
  profile: Observable<any> = new Observable(obs => this.userProfile = obs);
  id;
  tokenRenewalTimeout: any;
  
  constructor(
    public _router: Router,
    private _cookieService: CookieService,
    private _store: Store<fromApp.AppState>,
    private _httpPaymentService: HttpPaymentClientService
    ) {
      this.getAccesToken();
      this.scheduleRenewal();
  }

  auth0 = new auth0.WebAuth({
    clientID: environment.auth0.clientID,
    domain: environment.auth0.domain,
    responseType: 'token id_token',
    redirectUri: environment.auth0.callbackURL,
    audience: environment.auth0.audience,
    scope: 'openid profile email client_metadata app_metadata user_metadata'
  });


  login(){
    this.auth0.authorize();
    this.scheduleRenewal();
  }

  handleLoginCallback(){
    this.auth0.parseHash((err, authResult) => {
      if(authResult && authResult.accessToken) {
        window.location.hash = '';
        this.getUserInfo(authResult);
        
      }else if(err) {
        console.log(`Error: ${err.error}`)
      }else{
        this.makeCheckAppMetadata()
      }
      this._router.navigate(['/']);
    })
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  refreshTokens(){
    this.auth0.checkSession({}, (err, authResult) => {
      if(authResult && authResult.accessToken){
        this.getUserInfo(authResult);
      }
    })
  }

  getAccesToken(){
    this.auth0.checkSession({}, (err, authResult) => {
      if(authResult && authResult.accessToken){
        this.getUserInfo(authResult);
      }
    })
  }

  getAccesTokenRenew(){
    this.auth0.checkSession({}, (err, authResult) => {
      if(authResult && authResult.accessToken){
        this.getUserInfo(authResult);
      }else if(err){
        console.log(err.error);
        this.login();
      }
    })
  }
  
  getUserInfo(authResult){
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if(profile){
        this._setSession(authResult, profile);
        this.makeCheckAppMetadata();
      }else if(err){
        console.log(err.error)
      }
    })
  };

  getAccountLevel(){
    let app_metadata = null;
    if(this.getUserProfile()){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    }
    return app_metadata.account_level_data.account_level
  }
  
  makeCheckAppMetadata(){
    

    let app_metadata = null;
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    }

    //check for invitations
    if(this.getUserProfile() && app_metadata && app_metadata.invitations && app_metadata.invitations.length > 0){
      const invArray = []
      app_metadata.invitations.forEach(
        invitation => {
          invArray.push(invitation)
        }
      );
      this._cookieService.set('invitations', JSON.stringify(invArray));
      this._store.dispatch(new TilesActions.SetInvitations(invArray))
    };

    //check for first time account
    if(this.getUserProfile() && !app_metadata){
      this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
      this._httpPaymentService.startTrial();

    }
    else if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 0){
      //there is athlete acount
      this._store.dispatch(new TilesActions.SetNoTrial(false));
      this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
      this._store.dispatch(new TilesActions.AccountLevelSet(0));
      this._store.dispatch(new TilesActions.AccountTrialSet(false));
      this._store.dispatch(new TilesActions.SetPaidAccountForDisplays(false));
      this._store.dispatch(new TilesActions.SetAthleteAccount(true));
    }else if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date){
      //there is trial account
      this._store.dispatch(new TilesActions.SetNoTrial(false));
      this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
      this._store.dispatch(new TilesActions.AccountLevelSet(1));
      this._store.dispatch(new TilesActions.AccountTrialSet(true));
      this._store.dispatch(new TilesActions.SetPaidAccountForDisplays(true))
      if(app_metadata.account_level_data.trial_end_date*1000 < Date.now()){
        this._store.dispatch(new TilesActions.SetNoTrial(false));
        this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
        this._store.dispatch(new TilesActions.AccountLevelSet(0));
        this._store.dispatch(new TilesActions.AccountTrialSet(false));
        this._httpPaymentService.endTrial();
        this._store.dispatch(new TilesActions.SetPaidAccountForDisplays(false))
      }
    }else if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date){
      //there is paid account
      if(app_metadata.account_level_data.current_paid_access_end_date*1000 > Date.now()){
        //tutaj idzie logika gdy jest dostęp
        this._store.dispatch(new TilesActions.SetNoTrial(false));
        this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
        this._store.dispatch(new TilesActions.AccountLevelSet(app_metadata.account_level_data.account_level));
        this._store.dispatch(new TilesActions.SetPaidAccountForDisplays(true))
      }
    }
  }

  scheduleRenewal() {
    if (typeof window !== 'undefined') {
      const expiresAt = +this._cookieService.get('expires_at')
      const delay = expiresAt - Date.now() - 20000;
      if (delay > 0) {
        this.tokenRenewalTimeout = setTimeout(() => {
          this.getAccesTokenRenew();
        }, delay);
      }
    }
    }

  private _setSession(authResult, profile) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this._cookieService.set('token', authResult.accessToken);
    this._cookieService.set('id_token', authResult.idToken);
    this._cookieService.set('profile', JSON.stringify(profile));
    this._cookieService.set('expires_at', expiresAt);
    this.userProfile.next(JSON.parse(this._cookieService.get('profile')));
    this.scheduleRenewal();
    this._store.dispatch(new TilesActions.SetAuth());
    this._store.dispatch(new TilesActions.SetIsAuth(true));
    
  }

  logout() {
    this._cookieService.delete('token');
    this._cookieService.delete('id_token');
    this._cookieService.delete('profile');
    this._cookieService.delete('expires_at');
    this._cookieService.delete('invitations');
    clearTimeout(this.tokenRenewalTimeout);
    this._store.dispatch(new TilesActions.OffAuth());
    this.auth0.logout({
      returnTo: 'https://serene-kare-990ab9.netlify.com',
      clientID: environment.auth0.clientID
    })
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(this._cookieService.get('expires_at') || '{}'); 
    return new Date().getTime() < expiresAt;
  }



}