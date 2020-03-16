import { HttpClientService } from 'src/app/shared/http-client.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducers';
import * as TilesActions from './store/tiles-data.actions';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import * as AthleteDataActions from '../shared/store/athletes-data.actions';
import * as CalendarDataActions from '../shared/store/calendar-data.actions';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

import { CookieService } from 'ngx-cookie-service';
import { Invitation } from './store/tiles-data.reducers';
import { MatDialog } from '@angular/material';
import { StepperComponent } from '../tutorial/stepper/stepper.component';

@Injectable({
  providedIn: 'root'
})
export class HttpPaymentClientService {
  
  URL: string = 'https://ccoach-app.herokuapp.com/api/v1/';

  getHttpOptions() {
    const token = this._cookieService.get('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        })
      };
    return httpOptions;
}

//responsive variables
isHandset: boolean;
isTablet: boolean;
isWeb: boolean;



  constructor(
    private _http: HttpClient,
    public _breakpointObserver: BreakpointObserver,
    private _store: Store<fromApp.AppState>,
    private _cookieService: CookieService,
    private _httpClient: HttpClientService,
    public _dialog: MatDialog
  ) { 
    //break points

    this._breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = true;
        this.isTablet = false;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Tablet])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = true;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Web])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = false;
        this.isWeb = true;
      } else {
      }
    });
  };

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  openTutorial(){
    let width = '38%';
    if(!this.isWeb){width = `95%`};

    const dialogRef = this._dialog.open(StepperComponent, {
      autoFocus: false,
      id: 'tp-editor',
      width: width,
      height: '80%',
      data: {firstTimeUser: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      this._store.dispatch(new CalendarDataActions.SetTutorial(false));
    })
  }


  //Check for platform

  leavePlatform(){
    this._http.delete(`${this.URL}attendant_membership`, this.getHttpOptions()).subscribe(
      (response)=>{
        this._httpClient.getTrainingPlanFromPlatform();
      }
    )
  }

  checkPlatform(){
    this._http.get(`${this.URL}attendant_membership`, this.getHttpOptions()).subscribe(
      (response: any) => {
        if(response.is_in_active_platform){
          this._store.dispatch(new AthleteDataActions.SetIsInPlatform(true));
        }else if(!response.is_in_active_platform){
          this._store.dispatch(new AthleteDataActions.SetIsInPlatform(false));
        }
      }
    )
  }

  activatePlan(platfom_id: number, tp_id: number, athlete_id: number){
    this._http.post(`${this.URL}athlete_platforms/${platfom_id}/plan_appends`, {training_plan_id: tp_id}, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.FetchAthletesData());
        this._httpClient.getAthleteCardById(athlete_id)
      }
    )
  }

  deactivatePlan(platfom_id: number, plan_append_id: number, athlete_id: number){
    this._http.delete(`${this.URL}athlete_platforms/${platfom_id}/plan_appends/${plan_append_id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.FetchAthletesData());
        this._httpClient.getAthleteCardById(athlete_id)
      }
    )
  }

  firstTimeLogInvitation(){
    this._http.post(`${this.URL}queue_invitations`, null, this.getHttpOptions()).subscribe(
      (response: any) => {
        if(response.message === "No queue invitation processes to perform."){
          return
        }else{
          this._store.dispatch(new TilesDataActions.SetInvitations(response))
        }
      }
    )
  }

  invitationStream$ = this._http.get(`${this.URL}athleted_invitations`, this.getHttpOptions());

  //ACOUNT LEVEL 
  startTrial(){
    this._http.post(`${this.URL}create_trial`, {}, this.getHttpOptions()).subscribe(
      (response: any) => {
        
        //changing cookies
        let profile = null;
        if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
        profile['https://sport.app.comapp_metadata'] = {account_level_data: response.account_level_data};
        this._cookieService.set('profile', JSON.stringify(profile));

        
        this.firstTimeLogInvitation();

        //allow other requests
        this._store.dispatch(new TilesActions.SetNoTrial(false));
        
        //changing store
        this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
        this._store.dispatch(new TilesActions.AccountLevelSet(1));
        this._store.dispatch(new TilesActions.AccountTrialSet(true));

        
        this._store.dispatch(new TilesActions.SetPaidAccountForDisplays(true))

        this.openTutorial();
        this.firstTiles();
      }
      )
    };

  firstTiles(){
    this._http.post(`${this.URL}initial_tile_collections`, {}, this.getHttpOptions()).subscribe(
    )
  }
  
  endTrial(){
    this._http.put(`${this.URL}end_trial`, null, this.getHttpOptions()).subscribe(
      (response: any) => {

        //changing cookies
        let profile = null;
        if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
        profile['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
        profile['https://sport.app.comapp_metadata'].account_level_data.trial_end_date = response.account_level_data.trial_end_date;
        profile['https://sport.app.comapp_metadata'].account_level_data.trial_start_date = response.account_level_data.trial_start_date;
        this._cookieService.set('profile', JSON.stringify(profile));

        //changing store
        this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
        this._store.dispatch(new TilesActions.AccountLevelSet(0));
        this._store.dispatch(new TilesActions.AccountTrialSet(false));
      }
    )
  }
    
  startSubscription(data){
    this._http.post(`${this.URL}create_first_stripe_subscription`, data, this.getHttpOptions()).subscribe(
      (response: any) => {

        if(response.message === 'Payment failed'){
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesDataActions.CardFail(true));
        }else{
          //changing cookies
          let profile = null;
          if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
          profile['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_end_date = response.account_level_data.current_paid_access_end_date;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_start_date = response.account_level_data.current_paid_access_start_date;
          profile['https://sport.app.comapp_metadata'].account_level_data.stripe_customer_id = response.account_level_data.stripe_customer_id;
          this._cookieService.set('profile', JSON.stringify(profile));
  
          //changing store
          this._store.dispatch(new TilesDataActions.CardFail(false));
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
          this._store.dispatch(new TilesActions.AccountLevelSet(response.account_level_data.account_level));
          this._store.dispatch(new TilesActions.CardPaymentChange(false));
          this._store.dispatch(new TilesActions.IsPaidChange(true));
          this._store.dispatch(new TilesActions.AccountTrialSet(false));
        }
        

      },
      error => {
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));
      }
    )
  }

  startSubscriptionWithID(plan_id){
    this._http.post(`${this.URL}create_stripe_subscription`, plan_id, this.getHttpOptions()).subscribe(
      (response: any) => {

        if(response.message === 'Payment failed'){
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesDataActions.CardFail(true));
        }else{
          //changing cookies
          let profile = null;
          if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
          profile['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_end_date = response.account_level_data.current_paid_access_end_date;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_start_date = response.account_level_data.current_paid_access_start_date;
          this._cookieService.set('profile', JSON.stringify(profile));
  
          //changing store
          this._store.dispatch(new TilesDataActions.CardFail(false));
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
          this._store.dispatch(new TilesActions.AccountLevelSet(response.account_level_data.account_level));
          this._store.dispatch(new TilesActions.CardPaymentChange(false));
          this._store.dispatch(new TilesActions.IsPaidChange(true));
          this._store.dispatch(new TilesActions.AccountTrialSet(false));
        }
        
      },
      error => {
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));
      }
    )
  };

  cardFailureUpdate(plan_id){
    this._http.post(`${this.URL}create_stripe_subscription`, plan_id, this.getHttpOptions()).subscribe(
      (response: any) => {

        if(response.message === 'Payment failed'){
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesDataActions.CardFail(true));
        }else{
          //changing cookies
          let profile = null;
          if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
          profile['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_end_date = response.account_level_data.current_paid_access_end_date;
          profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_start_date = response.account_level_data.current_paid_access_start_date;
          this._cookieService.set('profile', JSON.stringify(profile));
  
          //changing store
          this._store.dispatch(new TilesDataActions.CardFail(false));
          this._store.dispatch(new TilesDataActions.SpinnerChange(false));
          this._store.dispatch(new TilesActions.IsPaidAccountSet(true));
          this._store.dispatch(new TilesActions.AccountLevelSet(response.account_level_data.account_level));
          this._store.dispatch(new TilesActions.CardPaymentChange(false));
          this._store.dispatch(new TilesActions.IsPaidChange(true));
          this._store.dispatch(new TilesActions.AccountTrialSet(false));
        }
        
      },
      error => {
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));
      }
    )
  };

  cancelSubscription(){
    this._http.put(`${this.URL}cancel_stripe_subscription`, null, this.getHttpOptions()).subscribe(
      (response: any) => {
          
        //changing cookies
        let profile = null;
        if(this.getUserProfile()){profile = JSON.parse(this.getUserProfile())}
        profile['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
        delete profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_end_date;
        delete profile['https://sport.app.comapp_metadata'].account_level_data.current_paid_access_start_date;
        this._cookieService.set('profile', JSON.stringify(profile));

        this._store.dispatch(new TilesDataActions.FetchTpManager());
        this._store.dispatch(new AthleteDataActions.FetchAthletesData());

        //changing store
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));
        this._store.dispatch(new TilesDataActions.ManagerInit(false));
        if(response.account_level_data.account_level === 0){
          this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
          this._store.dispatch(new TilesActions.AccountTrialSet(false));
          this._store.dispatch(new TilesActions.AccountLevelSet(response.account_level));
        }else if(response.account_level_data.account_level === 1){
          this._store.dispatch(new TilesActions.IsPaidAccountSet(false));
          this._store.dispatch(new TilesActions.AccountTrialSet(true));
          this._store.dispatch(new TilesActions.AccountLevelSet(response.account_level));
        }
      }
    )
  }

  upgradeDowngradeSubscription(plan_id){
    this._http.post(`${this.URL}preview_proration`, plan_id, this.getHttpOptions()).subscribe(
      (response: any) => {

        this._store.dispatch(new TilesActions.SetPrice(response.proration));
        this._store.dispatch(new TilesActions.ConfirmationChangePlan(true));
        this._store.dispatch(new TilesActions.UpgradeDowngradeSet(false));
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));

        
      }
      )
    }
    
  confirmUpgradeDowngradeSubscription(plan_id){
    this._http.put(`${this.URL}update_stripe_subscription`, plan_id, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new TilesDataActions.SpinnerChange(false));
        this._store.dispatch(new TilesDataActions.AccountLevelSet(response.account_level_data.account_level));
        this._store.dispatch(new TilesActions.ConfirmationChangePlan(false));
        const user = JSON.parse(this.getUserProfile());
        user['https://sport.app.comapp_metadata'].account_level_data.account_level = response.account_level_data.account_level;
        this._cookieService.set(`profile`, JSON.stringify(user));
        this._store.dispatch(new TilesDataActions.IsPaidChange(true));

        this._store.dispatch(new TilesDataActions.FetchTpManager());
        this._store.dispatch(new AthleteDataActions.FetchAthletesData());
      }
    )
  }
}