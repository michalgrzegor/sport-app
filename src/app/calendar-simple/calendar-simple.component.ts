import { HttpPaymentClientService } from '../shared/http-payment-client.service';
import { HttpClientService } from '../shared/http-client.service';
import { OpenedDay } from '../shared/store/calendar-data.reducers';
import { Observable, Subscription } from 'rxjs';
import { CalendarDataService, CalendarArray, WeekDate } from '../shared/calendar-data.service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatSnackBar, MatDialog } from '@angular/material';
import { RepeatDialogComponent, RepeatData } from './repeat-dialog/repeat-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

//store imports
import * as fromApp from '../shared/store/app.reducers';
import * as CalendarDataActions from '../shared/store/calendar-data.actions';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import * as ChartDataActions from '../shared/store/chart-data.actions';
import { Store } from '@ngrx/store';
import { Tile } from '../models/tile';
import { TrainingPlan, Association, TpInfo } from '../shared/store/tiles-data.reducers';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { TrainingPlanEditorComponent } from '../training-plan/training-plan-editor/training-plan-editor.component';
import { CookieService } from 'ngx-cookie-service';
import { VerifyDialogTpComponent } from './verify-dialog-tp/verify-dialog-tp.component';
import { HttpCalendarClientService } from '../shared/http-calendar-client.service';
import { PollingService } from '../shared/polling.service';

export interface Day {
  value: number;
  available: boolean;
}

@Component({
  selector: 'app-calendar-simple',
  templateUrl: './calendar-simple.component.html',
  styleUrls: ['./calendar-simple.component.scss'],
  animations: [
    trigger('hideShow', [
      state('void', style({minHeight: '0px', height: '0px', opacity: 0})),
      state('*', style({minHeight: '350px', opacity: 1})),
      transition('void => *', animate('0.15s ease-in')),
      transition('* => void', animate('0.32s ease-out'))
    ])]
})
export class CalendarSimpleComponent implements OnInit, OnDestroy {
  //animation

  i: number = 0;

  isOpenBoardState: Observable<boolean>;
  isOpenBoardSub: Subscription;
  isOpenBoard: boolean = false;

  calendarArrayState: Observable<CalendarArray>;
  calendarArraySub: Subscription;
  calendarArray: CalendarArray = null;
  calendarNoDisplayArray: CalendarArray = null;
  
  openedDayState: Observable<OpenedDay>;
  openedDaySub: Subscription;
  openedDay: OpenedDay = null;

  planNameState: Observable<string>;
  planNameSub: Subscription;
  planName: string = null;

  tpManagerState: Observable<TpInfo[]>;
  tpManagerSub: Subscription;
  tpManager: TpInfo[] = [];

  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  accountLimitState: Observable<number>;
  accountLimitSub: Subscription;
  accountLimit: number;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  athleteAccountState: Observable<boolean>;
  athleteAccountSub: Subscription;
  athleteAccount: boolean;

  onPlatformWithoutPlanState: Observable<boolean>;
  onPlatformWithoutPlanSub: Subscription;
  onPlatformWithoutPlan: boolean;

  allMomentDateArrayState: Observable<string[]>;
  allMomentDateArraySub: Subscription;
  allMomentDateArray: string[] = null;
  pushData = ['tiles-collection', 'session-1', 'session-2','session-3', 'session-4', 'session-5','session-6']

  localeString: string = 'en';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: any[] = [];
  trainingPlanMonths: [] = [];

  expandedTrue: boolean = false;
  numFirst: number;
  numDay: number;

  //Training Plan editor variables

  training_plan_name: string;
  date_from: string;
  date_to: string;
  training_sesion_number: string;

  //repeat funcionality data

  weekly: number;
  daily: number;
  repeats: number;
  interval: number;

  fakeData = [];



  //responsive variables

  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  athleteAccountonPaidAccountState: Observable<boolean>;
  athleteAccountonPaidAccountSub: Subscription;
  athleteAccountonPaidAccount: boolean;

  noTrialState: Observable<boolean>;
  noTrialSub: Subscription;
  noTrial: boolean;

  //initial variable

  noTPState: Observable<boolean>;
  noTPSub: Subscription;
  noTP: boolean = false;
  isVerifiedSub: any;
  isVerified: any;

  loadingState: Observable<boolean>;
  loadingSub: Subscription;
  loading: boolean = true;
  lastOpenedDay: OpenedDay;
  

  constructor(
    private _cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
    private _calendarDataService: CalendarDataService,
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    private _cookieService: CookieService,
    private _httpService: HttpClientService,
    private _httpCalendarService: HttpCalendarClientService,
    private _pollingService: PollingService,
    private _httpPaymentService: HttpPaymentClientService
    ) {}

  expand(calendarIndex: number, weeksIndex: number, weekDatesIndex: number) {
    const day = this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex];
    this._store.dispatch(new CalendarDataActions.OpenContainer({calendarIndex: calendarIndex, weeksIndex: weeksIndex, weekDatesIndex: weekDatesIndex}));
    this._store.dispatch(new TilesDataActions.MakeDay({date: day.momentDate, day: this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex]}));
    this._store.dispatch(new CalendarDataActions.SetWeek(this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates));
    // summary:
    this.makeWeek(calendarIndex, weeksIndex);
  }
 
  ngOnInit() {
    
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


    
    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        let samePlan = false;
        if(this.trainingPlan && tp){
          if(tp.id === this.trainingPlan.id){samePlan = true;}
        }
        if(tp){
          if(!this.trainingPlan || tp.id !== this.trainingPlan.id){
            let array = this._calendarDataService.makeArray(tp);
            console.log(array)
            if(this.openedDay && samePlan){
              array.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].container[0].expanded = true;
            }
            this._store.dispatch(new CalendarDataActions.InitData({calendar: array, planName: tp.training_plan_name}));
          }
          this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false))
        }
        if(tp && this.calendarArray){
          this.makeStars(this.calendarArray, tp)
        }
        this.trainingPlan = tp;

        
      }
    );

    this.athleteAccountonPaidAccountState = this._store.select(state => state.tiles.athleteAccountonPaidAccount);
    this.athleteAccountonPaidAccountSub = this.athleteAccountonPaidAccountState.subscribe(
      data => {
        this.athleteAccountonPaidAccount = data;
        if(!this.trainingPlan && data){
          this.doRequests(this.noTrial, data)
        }
      }
    );

    this.noTrialState = this._store.select(state => state.tiles.noTrial);
    this.noTrialSub = this.noTrialState.subscribe(
      data => {
        this.noTrial = data;
        if(!this.trainingPlan && !data){
          this.doRequests(data, this.athleteAccountonPaidAccount)
        }
      }
    );
    
    //calendar array store
    this.calendarArrayState = this._store.select(state => state.calendar.calendar);
    this.calendarArraySub = this.calendarArrayState.subscribe(
      (data: CalendarArray) => {
        
        if(this.trainingPlan){
          if(this.calendarArray && this.calendarArray.id === data.id){
            const array = Object.assign({},data);
            if(this.openedDay){
              array.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].container[0].container = true;
              array.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].container[0].expanded = true;
            }
            this.calendarNoDisplayArray = array;
            if(this.calendarArray.calendar.length !== data.calendar.length){
              this.calendarArray = array;
              this.calendarNoDisplayArray = array;
            }
          }else{
            this.calendarArray = data;
            this.calendarNoDisplayArray = data;
            this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
            
          }
        }

        
        if(this.trainingPlan && data){
          this.makeStars(data, this.trainingPlan)
        }
      }
    );

    //drag tile data

    this.noTPState = this._store.select(state => state.tiles.noTP);
    this.noTPSub = this.noTPState.subscribe(
      data => {
        this.noTP = data
        if(data && this.tpManager !== null && this.tpManager.length>0){
          this.loadTp(this.tpManager[0].id);
        }
      }
    );

    this.athleteAccountState = this._store.select(state => state.tiles.athleteAccount);
    this.athleteAccountSub = this.athleteAccountState.subscribe(
      data => {
        this.athleteAccount = data;
        if(!data){
          this.doRequests(this.noTrial, this.athleteAccountonPaidAccount)
        }
      }
    );

    this.onPlatformWithoutPlanState = this._store.select(state => state.tiles.onPlatformWithoutPlan);
    this.onPlatformWithoutPlanSub = this.onPlatformWithoutPlanState.subscribe(
      data => this.onPlatformWithoutPlan = data
    );

    this.accountLimitState = this._store.select(state => state.tiles.accountLimit);
    this.accountLimitSub = this.accountLimitState.subscribe(
      data => {
        this.accountLimit = data;
      }
    );

    this.planNameState = this._store.select(state => state.calendar.planName);
    this.planNameSub = this.planNameState.subscribe(
      data => this.planName = data
    );

    this.loadingState = this._store.select(state => state.tiles.spinnerCalendar);
    this.loadingSub = this.loadingState.subscribe(
      data => this.loading = data
    );

    this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
    this.isPaidAccountSub = this.isPaidAccountState.subscribe(
      data => this.isPaidAccount = data
    );

    this.isOpenBoardState = this._store.select(state => state.calendar.isOpenTpBoard);
    this.isOpenBoardSub = this.isOpenBoardState.subscribe(
      data => this.isOpenBoard = data
    );

    this.tpManagerState = this._store.select(state => state.tiles.tPManagaer);
    this.tpManagerSub = this.tpManagerState.subscribe(
      (data: TpInfo[]) => {
        
        if(this.noTP && data && data.length > 0){
          this.loadTp(data[0].id);
        }
        if(data && this.tpManager && data.length < this.tpManager.length){
          if(data.length > 0 ){
            this._httpService.getTrainingPlanById(data[0].id);
          }else if(data.length == 0){
            this._httpService.setUserMetaData(null);
            this._store.dispatch(new TilesDataActions.SetTrainingPlan(null));
            this.trainingPlan = null;
            this.planName = null;
            this._store.dispatch(new TilesDataActions.SetNoTp(true));
          }
        }
        this.tpManager = data;
      }
    );

    this.allMomentDateArrayState = this._store.select(state => state.calendar.allMomentDateArray);
    this.allMomentDateArraySub = this.allMomentDateArrayState.subscribe(
      data => {
        if(data){
          this.allMomentDateArray = data;
          this.allMomentDateArray = this.allMomentDateArray.concat(this.pushData);
        }
      }
    )

    this.openedDayState = this._store.select(state => state.calendar.openedDay);
    this.openedDaySub = this.openedDayState.subscribe(
      data => {
        this.openedDay = data;
        if(data){
          this.calendarNoDisplayArray.calendar.forEach(
            month => month.weeks.forEach(
              week => {
                week.container[0].container = false;
                week.container[0].expanded = false;
              }
            )
          )
          this.calendarNoDisplayArray.calendar[data.calendarIndex].weeks[data.weeksIndex].container[0].container = true;
          this.calendarNoDisplayArray.calendar[data.calendarIndex].weeks[data.weeksIndex].container[0].expanded = true;
        }else if(data === null && this.calendarNoDisplayArray){
          this.calendarNoDisplayArray.calendar.forEach(
            month => month.weeks.forEach(
              week => {
                week.container[0].container = false;
                week.container[0].expanded = false;
              }
            )
          )
        }
      }
    )

    moment.locale(this.localeString);
    this.navDate = moment();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }
  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  doRequests(noTrial:boolean, athleteAccount:boolean){
    
    let app_metadata = null;
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    }

    if(this.getUserProfile() && app_metadata && app_metadata.account_level_data && app_metadata.account_level_data.account_level === 0 && !athleteAccount && !noTrial){
      //when athlete account
      this._httpService.getTrainingPlanFromPlatform();
      this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
      this._store.dispatch(new TilesDataActions.SetAthleteAccount(true));
      //polling
      this._pollingService.checkIfInGroup();
    }else if(
      (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && !app_metadata.account_level_data && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial||
      (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial || 
      (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial){

      //when paid or trial account
      this._store.dispatch(new TilesDataActions.FetchTrainingPlan());
      this._store.dispatch(new TilesDataActions.SetNoTp(false));
      this._store.dispatch(new TilesDataActions.FetchTpManager());
      this._store.dispatch(new TilesDataActions.FetchTiles());
      this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      //polling
      this._pollingService.checkIfInGroup();
    }else if(!athleteAccount && !noTrial){
      this._store.dispatch(new TilesDataActions.SetNoTp(true));
      this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
      this._store.dispatch(new TilesDataActions.FetchTpManager());
      this._store.dispatch(new TilesDataActions.FetchTiles());
      this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      //polling
      this._pollingService.checkIfInGroup();
    }else{
      this._store.dispatch(new TilesDataActions.SetTrainingPlan(null));
      this._store.dispatch(new ChartDataActions.SetTP(null))
      this._store.dispatch(new TilesDataActions.SetNoTp(true));
      this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
      this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      //polling
      this._pollingService.checkIfInGroup();

    }
  }

  drop(event: CdkDragDrop<Tile[]>, daya: WeekDate, calendarIndex: number, weeksIndex: number, weekDatesIndex: number){

    const tile = Object.assign({},event.previousContainer.data[event.previousIndex]);
    const arrayOne = []
    this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex].association.forEach(
      asso => {
        if(asso.training_sesion === 1){
          arrayOne.push(asso)
        }
      }
    );
    let index: number = null;
    if(arrayOne.length>0){index = arrayOne[arrayOne.length-1].asso_index_in_array+1}else{index = 1}

    let asso: Association = {
      tile_id: tile.tile_id,
      calendar_date: daya.momentDate,
      training_plan: this.planName,
      training_plan_id: this.trainingPlan.id,
      tile_color: tile.tile_type_color,
      training_sesion: 1,
      tile_type: tile.tile_type,
      asso_temporary_id: tile.tile_temporary_id,
      asso_index_in_array: index
    };
    let isOpenedDay: boolean = false;
    let openedDayDate: string = null
    const day = {
      date: null,
      day: {
        association: []
      }
    };

    if(this.openedDay){
      isOpenedDay = true;
      openedDayDate = this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate;
      day.date = this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate;
      this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].association.forEach(
        asso => day.day.association.push(asso)
      );
      if(this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate === daya.momentDate){
        day.day.association.push(asso);
      }
    }

    

    this._httpCalendarService.postCalendarAssoc(this.trainingPlan, this.trainingPlan.id, asso, calendarIndex, weeksIndex, weekDatesIndex, null, 1, {date: day.date, day: day.day}, null, isOpenedDay, openedDayDate, this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates);

    //sumary

    //Open Snack Bar
    let snackBarRef = this._snackBar.open(`Do you want to repeat this action?`, `REPEAT`, {duration: 6000});
    //Add functionality after close
    snackBarRef.onAction().subscribe(() => this.openDialog(asso, calendarIndex, weeksIndex, weekDatesIndex))
  }

  makeStars(calendar: CalendarArray, tp: TrainingPlan){
    calendar.calendar.forEach(
      calendar => calendar.weeks.forEach(
        week => week.weekDates.forEach(
          date => {
            tp.calendar_stars.forEach(
              star => {
                if(moment(star.star_date).format() === moment(date.momentDate).format()){
                  date.star = star.star_color
                }
              }
            )
          }
        )
      )
    )
  }


  openDialog(asso, calendarIndex: number, weeksIndex: number, weekDatesIndex: number): void {
    const dialogRef = this._dialog.open(RepeatDialogComponent, {
      width: `280px`,
      autoFocus: false,
      data: {
        weekly: this.weekly,
        daily: this.daily,
        repeats: this.repeats,
        interval: this.interval
      },
      id: `light-dialog`
    });

    //subscribe to data from closed dialog
    dialogRef.afterClosed().subscribe((data) => {if(data){this.repeatAction(data, asso, calendarIndex, weeksIndex, weekDatesIndex)}})
  }

  add(){
    const limit = this.calendarNoDisplayArray.calendar.length;
    if(this.i < limit - 1){
      this.i = this.i + 1;
      console.log(this.calendarArray.calendar[this.i])
      if(this.openedDay){
        this._store.dispatch(new CalendarDataActions.CloseContainer({calendarIndex: this.openedDay.calendarIndex, weeksIndex: this.openedDay.weeksIndex, weekDatesIndex: this.openedDay.weekDatesIndex}))
      }
    }
  }

  sub(){
    if(this.i > 0){
      this.i = this.i - 1;
      if(this.openedDay){
        this._store.dispatch(new CalendarDataActions.CloseContainer({calendarIndex: this.openedDay.calendarIndex, weeksIndex: this.openedDay.weeksIndex, weekDatesIndex: this.openedDay.weekDatesIndex}))
      }
    }
  }

  repeatAction(data: RepeatData, assos: Association, calendarIndexV: number, weeksIndex: number, weekDatesIndex: number): void {
    if(data.weekly){
      const tp: TrainingPlan = Object.assign({}, this.trainingPlan);
      const calendarRW = this.calendarNoDisplayArray;
      const calendarNumberRW = calendarIndexV;
      const weeksNumberRW = weeksIndex;
      const weekDatesNumberRW = weekDatesIndex;
      let nRW = 0;
      const limitRW = (calendarRW.calendar.length * 6) - (calendarNumberRW*6 + weeksNumberRW);
      const newAssoArrayRW = [];
      for(let i = 1; i <= Number(data.weekly)+nRW && i < limitRW; i++){
          if(calendarRW.calendar[calendarNumberRW + Math.floor((weeksNumberRW + i) / 6)].weeks[(weeksNumberRW + i - (6 * (Math.floor((weeksNumberRW + i) / 6))))].weekDates[weekDatesNumberRW].available){
              let asso = Object.assign({}, assos);
              asso.calendar_date = calendarRW.calendar[calendarNumberRW + Math.floor((weeksNumberRW + i) / 6)].weeks[(weeksNumberRW + i - (6 * (Math.floor((weeksNumberRW + i) / 6))))].weekDates[weekDatesNumberRW].momentDate;
              calendarRW.calendar[calendarNumberRW + Math.floor((weeksNumberRW + i) / 6)].weeks[(weeksNumberRW + i - (6 * (Math.floor((weeksNumberRW + i) / 6))))].weekDates[weekDatesNumberRW].association.push(asso);
              newAssoArrayRW.push(asso);
          }else{
              nRW = nRW + 1;
          }
      }

      let isOpenedDay: boolean = false;
      let calendarIndex: number = null;
      let weeksIndexx: number = null;
      let openedDayDate: string = null;
      if(this.openedDay){
        isOpenedDay = true;
        calendarIndex = this.openedDay.calendarIndex;
        weeksIndexx = this.openedDay.weeksIndex;
        openedDayDate = this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate
      }
      this._httpCalendarService.repeatWeaklyAsso(this.trainingPlan.id, newAssoArrayRW, calendarRW, tp, isOpenedDay, calendarIndex, weeksIndexx, openedDayDate, this.calendarArray,this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);
      
    } else if (data.daily) {
      const tp: TrainingPlan = Object.assign({}, this.trainingPlan);
      const calendarRD = this.calendarNoDisplayArray;
      const calendarNumberRD = calendarIndexV;
      const weeksNumberRD = weeksIndex;
      const weekDatesNumberRD = weekDatesIndex;
      let nRD = 0;
      const limitRD = (calendarRD.calendar.length * 6 * 7) - (calendarNumberRD * 6 * 7) - (weeksNumberRD * 7) - weekDatesNumberRD - 7;
      const newAssoArrayRD = [];
      for(let i = 1; i <= Number(data.daily) + nRD && i < limitRD; i++) {
        let a = calendarNumberRD + Math.floor((weeksNumberRD + Math.floor((weekDatesNumberRD + i) / 7))/6);
        let b = weeksNumberRD + Math.floor((weekDatesNumberRD + i) / 7) - (6 * Math.floor((weeksNumberRD + Math.floor((weekDatesNumberRD + i) / 7))/6));
        let c = weekDatesNumberRD + i - (7 * (Math.floor((weekDatesNumberRD + i) / 7)));
        if(calendarRD.calendar[a].weeks[b].weekDates[c].available){
          let asso = Object.assign({},assos);
          asso.calendar_date = calendarRD.calendar[a].weeks[b].weekDates[c].momentDate;
          calendarRD.calendar[a].weeks[b].weekDates[c].association.push(asso);
          newAssoArrayRD.push(asso);
        } else {
          nRD = nRD + 1;
        }
      }

      let isOpenedDay: boolean = false;
      let calendarIndex: number = null;
      let weeksIndexx: number = null;
      let openedDayDate: string = null;
      if(this.openedDay){
        isOpenedDay = true;
        calendarIndex = this.openedDay.calendarIndex;
        weeksIndexx = this.openedDay.weeksIndex;
        openedDayDate = this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate
      }
      this._httpCalendarService.repeatDailyAsso(this.trainingPlan.id, newAssoArrayRD, calendarRD, tp, isOpenedDay, calendarIndex, weeksIndexx, openedDayDate, this.calendarArray,this.calendarNoDisplayArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);
      
    } 
  }

  // summary:
  makeWeek(calendarIndex: number, weeksIndex: number){
    
    const assoArray = [];
    this.calendarNoDisplayArray.calendar[calendarIndex].weeks[weeksIndex].weekDates.forEach(
      week => {
        if(week.association){
          week.association.forEach(
            asso => assoArray.push(asso)
          )
        }
      }
    );
    this._store.dispatch(new TilesDataActions.MakeWeek(assoArray))
  }

  openTPEditor(){
    let tpManagerLength = 0;
    if(this.tpManager){
      tpManagerLength = this.tpManager.length;
    }else{
      tpManagerLength = 0;
    }
    if(this.accountLimit*10 > tpManagerLength){
      this.training_plan_name = null;
      this.date_from = null;
      this.date_to = null;
      this.training_sesion_number = null;
  
      const dialogRef = this._dialog.open(TrainingPlanEditorComponent, {
        autoFocus: false,
        id: `tp-editor`,
        width: `408px`,
        data: {training_plan_name: this.training_plan_name, date_from: this.date_from, date_to: this.date_to, training_sesion_number: this.training_sesion_number, isEdited: false }
      });
  
      const newTP: TrainingPlan = {
        training_plan_name: null,
        date_from: moment().format('YYYY-MM-DD'),
        date_to: moment().add(1, 'month').format('YYYY-MM-DD'),
        training_sesion_number: null,
        calendar_assocs: [],
        calendar_stars: []
      }
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.training_plan_name = result.training_plan_name;
          this.date_from = result.date_from;
          this.date_to = result.date_to;
          this.training_sesion_number = result.training_sesion_number;
          
          newTP.training_plan_name = result.training_plan_name;
          if(result.date_from !== null){
            newTP.date_from = moment(result.date_from).format('YYYY-MM-DD');
          }
          if(result.date_to !== null){
            newTP.date_to = moment(result.date_to).format('YYYY-MM-DD');
          }
          newTP.training_sesion_number = result.training_sesion_number;
  
          this._httpService.postTrainingPlan(newTP);
        }
      })
    }else{
      this.openSnackBar(`You reached limit. You can upgrade Your Subscription Plan or delete inactive training plan`);
    }
  }

  openSnackBar(message: string){
    this._snackBar.open(message, null, {
      duration: 8000
    })
  }
  
  deletePlan(){
    this.isVerifiedSub = this._dialog.open(VerifyDialogTpComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      this.isVerified = result;
      if(result){
        this._httpService.deleteTrainingPlan(this.trainingPlan.id);
      }})
  }

  openTpBoard(){
    this._store.dispatch(new CalendarDataActions.OpenTpBoard());
  }


  tPEdit(){
    this.training_plan_name = this.trainingPlan.training_plan_name;
    this.date_from = this.trainingPlan.date_from;
    this.date_to = this.trainingPlan.date_to;
    this.training_sesion_number = this.trainingPlan.training_sesion_number.toString();

    const dialogRef = this._dialog.open(TrainingPlanEditorComponent, {
      autoFocus: false,
      id: `tp-editor`,
      width: `408px`,
      data: {training_plan_name: this.training_plan_name, date_from: this.date_from, date_to: this.date_to, training_sesion_number: this.training_sesion_number, isEdited: true }
    });

    const newTP: TrainingPlan = {
      training_plan_name: null,
      date_from: moment().format('YYYY-MM-DD'),
      date_to: moment().add(1, 'month').format('YYYY-MM-DD'),
      training_sesion_number: null,
      calendar_assocs: this.trainingPlan.calendar_assocs,
      calendar_stars: this.trainingPlan.calendar_stars,
      id: this.trainingPlan.id
    }

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.training_plan_name = result.training_plan_name;
        this.date_from = result.date_from;
        this.date_to = result.date_to;
        this.training_sesion_number = result.training_sesion_number;
        
        newTP.training_plan_name = result.training_plan_name;
        if(result.date_from !== null){
          newTP.date_from = moment(result.date_from).format('YYYY-MM-DD');
        }
        if(result.date_to !== null){
          newTP.date_to = moment(result.date_to).format('YYYY-MM-DD');
        }
        newTP.training_sesion_number = result.training_sesion_number;

        this._httpService.patchTrainingPlan(newTP, newTP.id);
      }
    })
  }

  loadTp(id: number){
    if(id){
      this._httpService.getTrainingPlanById(id);
    }
  }

  leavePlatform(){
    this._httpPaymentService.leavePlatform();
  }

  dayToedit(date): boolean {
    const one = moment(date).format('YYYY-MM-DD')
    const two = moment().format('YYYY-MM-DD')
    return moment(one).isBefore(moment(two))
  }

  ngOnDestroy() {
    this.calendarArraySub.unsubscribe();
    this.planNameSub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
    this.openedDaySub.unsubscribe();
    this.allMomentDateArraySub.unsubscribe();
    this.isOpenBoardSub.unsubscribe();
    this.tpManagerSub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.accountLimitSub.unsubscribe();
    this.athleteAccountSub.unsubscribe();
    this.onPlatformWithoutPlanSub.unsubscribe();
    this.noTPSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.athleteAccountonPaidAccountSub.unsubscribe();
    this.noTrialSub.unsubscribe();
    this._store.dispatch(new TilesDataActions.FireChange(null));
  }

}
