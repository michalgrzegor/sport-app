import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Athlete, CustomAthleteParameter, AthleteMin, PlatformNote } from 'src/app/shared/store/athletes-data.reducers';

import { Store } from '@ngrx/store';
import * as AthleteDataActions from '../../shared/store/athletes-data.actions';
import * as fromApp from '../../shared/store/app.reducers';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from 'src/app/shared/http-client.service';
import { AthleteCreatorComponent } from '../athlete-creator/athlete-creator.component';
import { VerifyDialogAthleteComponent } from '../verify-dialog-athlete/verify-dialog-athlete.component';

import { TpInfo } from 'src/app/shared/store/tiles-data.reducers';

import * as _ from 'lodash';

@Component({
  selector: 'app-athlete-card',
  templateUrl: './athlete-card.component.html',
  styleUrls: ['./athlete-card.component.scss']
})
export class AthleteCardComponent implements OnInit, OnDestroy {
  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  athletesState: Observable<AthleteMin[]>;
  athletesSub: Subscription;
  athletes: AthleteMin[];

  accountLimitState: Observable<number>;
  accountLimitSub: Subscription;
  accountLimit: number;

  

  //errors
  errorMaxLengthShort: string = 'this field requied only 255 characters';
  errorReq: string = 'this field is required';

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  athleteManagerMode: boolean = false;

  spinnerState: Observable<boolean>;
  spinnerSub: Subscription;
  spinner: boolean = true;

  noDataState: Observable<boolean>;
  noDataSub: Subscription;
  noData: boolean = true;

  tpManagerState: Observable<TpInfo[]>;
  tpManagerSub: Subscription;
  tpManager: TpInfo[] = [];
  unactiveTpManager: TpInfo[] = [];

  athlete_name?: string;
  athlete_phone_number?: string;
  athlete_email?: string;
  athlete_sport_discipline?: string;
  athlete_age?: string;
  athlete_height?: string;
  athlete_weight?: string;
  athlete_arm?: string;
  athlete_chest?: string;
  athlete_waist?: string;
  athlete_hips?: string;
  athlete_tigh?: string;
  fitness_level?: number;
  custom_athlete_parameters?: CustomAthleteParameter[];
  platform_notes?: PlatformNote[];

  isVerifiedSub: any;
  isVerified: any;

  isActivatedPlan: boolean = false;
  activatedPlan: any;

  openedBookmark: string = 'card';


  
  constructor(
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    private _cookieService: CookieService,
    private _httpService: HttpClientService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.openedBookmark = 'card';

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

    if(!this.athlete){
      console.log(`odpala athlete card`)
      if(JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].athlete_platform_last_id){
        this._httpService.getAthleteCardById(JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].athlete_platform_last_id)
        this._store.dispatch(new AthleteDataActions.OnACMode());
      }else{
        this._store.dispatch(new AthleteDataActions.OnACMode());
        this._store.dispatch(new AthleteDataActions.SpinnerOnOffAthlete(false));
      }
    }


    this.athletesState = this._store.select(state => state.athletes.athletes);
    this.athletesSub = this.athletesState.subscribe(
      data => {
        this.athletes = data;
      }
    );

    this.noDataState = this._store.select(state => state.athletes.noData);
    this.noDataSub = this.noDataState.subscribe(
      data => {
        this.noData = data;
      }
    );

    this.spinnerState = this._store.select(state => state.athletes.spinnerAthlete);
    this.spinnerSub = this.spinnerState.subscribe(
      data => {
        this.spinner = data;
      }
    );

    this.accountLimitState = this._store.select(state => state.tiles.accountLimit);
    this.accountLimitSub = this.accountLimitState.subscribe(
      data => {
        this.accountLimit = data;
      }
    );

    this.tpManagerState = this._store.select(state => state.tiles.tPManagaer);
    this.tpManagerSub = this.tpManagerState.subscribe(
      (data: TpInfo[]) => {
        if(data){
          this.tpManager = data;
          this.unactiveTpManager = [];
          data.forEach(tpInfo=>{if(!tpInfo.training_plan_active){this.unactiveTpManager.push(tpInfo)}});
        }
      }
    );

    this.athleteState = this._store.select(state => state.athletes.athlete);
    this.athleteSub = this.athleteState.subscribe(
      data => {
        if(data){
          this.athlete = data;

          if(data.plan_appends && data.plan_appends[0] && data.plan_appends[0].plan_activity_status === "activated"){
            this.isActivatedPlan = true;
            this.tpManager.forEach(
              tp => {
                if(tp.id === data.plan_appends[0].training_plan_id){
                  this.activatedPlan = tp.training_plan_name
                }
              }
            )
          }else{
            this.isActivatedPlan = false;
            this.activatedPlan = null;
          }
        }
      }
    )
  }

  setAthlete(athlete: Athlete){
    this._httpService.getAthleteCardById(athlete.id)
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  managerMode(){
    this.athleteManagerMode = !this.athleteManagerMode
  }

  deleteAthlete(){
    this.isVerifiedSub = this._dialog.open(VerifyDialogAthleteComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      if(result){
        this._httpService.deleteAthlete(this.athlete.id);
        this.athletes.forEach((at,index)=>{if(at.id === this.athlete.id){this.athletes.splice(index,1)}})
        this._store.dispatch(new AthleteDataActions.DeleteAthleteFromAthletes(this.athlete));
        if(this.athletes.length > 0){
          this._httpService.getAthleteCardById(this.athletes[0].id);
        }else if(this.athletes.length == 0){
          this._httpService.setAthleteUserMetaData(null);
          this._store.dispatch(new AthleteDataActions.SetAthleteData(null));
          this.athlete = null;
          this._store.dispatch(new AthleteDataActions.NoDataLoading(true));
        }
      }
    })


  }

  openAthleteEditor(){
    let athletesLength = 0;
    if(this.athletes){
      athletesLength = this.tpManager.length;
    }else{
      athletesLength = 0;
    }
    if(this.accountLimit*2 > athletesLength){
      this.athlete_name = null;
      this.athlete_phone_number = null;
      this.athlete_email = null;
      this.athlete_sport_discipline = null;
      this.athlete_age = null;
      this.athlete_height = null;
      this.athlete_weight = null;
      this.athlete_arm = null;
      this.athlete_chest = null;
      this.athlete_waist = null;
      this.athlete_hips = null;
      this.athlete_tigh = null;
      this.fitness_level = null;
      this.custom_athlete_parameters = [];
      this.platform_notes = [];
  
      const dialogRef = this._dialog.open(AthleteCreatorComponent, {
        autoFocus: false,
        id: `tp-editor`,
        width: `408px`,
        data: {
          athlete_name: this.athlete_name,
          athlete_phone_number: this.athlete_phone_number,
          athlete_email: this.athlete_email,
          athlete_sport_discipline: this.athlete_sport_discipline,
          athlete_age: this.athlete_age,
          athlete_height: this.athlete_height,
          athlete_weight: this.athlete_weight,
          athlete_arm: this.athlete_arm,
          athlete_chest: this.athlete_chest,
          athlete_waist: this.athlete_waist,
          athlete_hips: this.athlete_hips,
          athlete_tigh: this.athlete_tigh,
          fitness_level: this.fitness_level,
          custom_athlete_parameters: this.custom_athlete_parameters,
          platform_notes: this.platform_notes,
        }
      });
  
      const newAthlete: Athlete = {
        athlete_name: this.athlete_name,
        athlete_phone_number: this.athlete_phone_number,
        athlete_email: this.athlete_email,
        athlete_sport_discipline: this.athlete_sport_discipline,
        athlete_age: this.athlete_age,
        athlete_height: this.athlete_height,
        athlete_weight: this.athlete_weight,
        athlete_arm: this.athlete_arm,
        athlete_chest: this.athlete_chest,
        athlete_waist: this.athlete_waist,
        athlete_hips: this.athlete_hips,
        athlete_tigh: this.athlete_tigh,
        fitness_level: this.fitness_level,
        custom_athlete_parameters: this.custom_athlete_parameters,
        platform_notes: this.platform_notes,
      }
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.athlete_name = result.athlete_name;
          this.athlete_phone_number = result.athlete_phone_number;
          this.athlete_email = result.athlete_email;
          this.athlete_sport_discipline = result.athlete_sport_discipline;
          this.athlete_age = result.athlete_age;
          this.athlete_height = result.athlete_height;
          this.athlete_weight = result.athlete_weight;
          this.athlete_arm = result.athlete_arm;
          this.athlete_chest = result.athlete_chest;
          this.athlete_waist = result.athlete_waist;
          this.athlete_hips = result.athlete_hips;
          this.athlete_tigh = result.athlete_tigh;
          this.fitness_level = result.fitness_level;
          this.custom_athlete_parameters = result.custom_athlete_parameters;
          this.platform_notes = result.platform_notes;
          
          newAthlete.athlete_name = result.athlete_name;
  
          this._httpService.postAthlete(newAthlete);
        }
      })

    }else{
      this.openSnackBar(`You reached limit. You can upgrade Your Subscription Plan or delete inactive athlete`)
    }
  }

  openSnackBar(message: string){
    this._snackBar.open(message, null, {
      duration: 8000
    })
  }

  changeBookmark(string: string){
    this.openedBookmark = string;
  }

  ngOnDestroy(): void {
    this.athleteSub.unsubscribe();    
    this.athletesSub.unsubscribe();    
    this.accountLimitSub.unsubscribe()
    this.spinnerSub.unsubscribe()
    this.noDataSub.unsubscribe()
    this.tpManagerSub.unsubscribe();
    this._store.dispatch(new AthleteDataActions.OffACMode());
  }

}