import { HttpCalendarClientService } from './../shared/http-calendar-client.service';
import { TrainingPlan, Association } from './../shared/store/tiles-data.reducers';
import { HttpClientService } from './../shared/http-client.service';
import { Router } from '@angular/router';
import { VerifyDialogComponent } from './verify-dialog/verify-dialog.component';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { Observable, Subscription } from 'rxjs';
import { OpenedDay } from 'src/app/shared/store/callendar-data.reducers';
import { Store } from '@ngrx/store';
import {MatDialog} from '@angular/material';

import * as fromApp from '../shared/store/app.reducers';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import { CallendarArray } from 'src/app/shared/callendar-data.service';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { VerifyDialogDayComponent } from './verify-dialog-day/verify-dialog-day.component';

import * as moment from 'moment';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hideShow', [
      state('show', style({minHeight: '120px'})),
      state('hide', style({minHeight: '0px', height: '0px'})),
      transition('show => hide', animate('0.2s ease-in')),
      transition('hide => show', animate('0.2s ease-out'))
    ]),
    trigger('fade', [
      state('*', style({opacity: 1})),
      state('void', style({opacity: 0})),
      transition('* => void', animate('0s ease-in')),
      transition('void => *', animate('0.4s ease-in'))
    ]),
    trigger('rotate', [
      state('show', style({transform: 'rotate(180deg)'})),
      state('hide', style({transform: 'rotate(0deg)'})),
      transition('show => hide', animate('0.2s ease-in')),
      transition('hide => show', animate('0.2s ease-out'))
    ])
  ]
})

export class TileComponent implements OnInit, OnDestroy {
  summaryClose: boolean = false;
  get stateName() {
    return this.summaryClose ? 'show' : 'hide'
  }
  togleSummary(){
    this.summaryClose = !this.summaryClose;
  }

  @Input() tileRef: Tile;
  @Input() index: number;
  @Input() isInCollection: boolean;
  @Input() tr_id: number;
  @Input() asso_id: number;
  @Input() dateTile: any;
  @Input() isOpen: boolean;

  tileRefJson;
  
  openedDayState: Observable<OpenedDay>;
  openedDaySub: Subscription;
  openedDay: OpenedDay = null;
  
  callendarArrayState: Observable<CallendarArray>;
  callendarArraySub: Subscription;
  callendarArray: CallendarArray = null;
  
  mainRouteState: Observable<string>;
  mainRouteSub: Subscription;
  mainRoute: string = null;
  
  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  gridArrayState: Observable<Tile[]>;
  gridArraySub: Subscription;
  numberArray: number[];

  tile: Tile;
  tileType: any;

  isVerified: boolean;
  isVerifiedSub: any;

  safeLink: SafeResourceUrl;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  disabledUp: boolean = false;
  disabledDown: boolean = false;


  constructor(
    private _store: Store<fromApp.AppState>,
    public _dialog: MatDialog,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _httpService: HttpClientService,
    private _httpCalendarService: HttpCalendarClientService,
    private _changeDetector : ChangeDetectorRef,
    public _breakpointObserver: BreakpointObserver
    ) { }

  

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

    this.tileType = this.tileRef.tile_type;

    if(this.isOpen){
      setTimeout(()=>this.openTile(),100)
    }

    


    //youtube link sanitizing
    if(this.tileRef.tile_type === 'motivation' && this.tileRef.tile_motivation.tile_motivation_link){
      let link = this.tileRef.tile_motivation.tile_motivation_link;
      if(link.includes('watch?v=')){
        link = link.replace('watch?v=', 'embed/')
      }
      this.safeLink = this._sanitizer.bypassSecurityTrustResourceUrl(link);
    }
    this.tile = Object.assign({}, this.tileRef); 

    //changing tiles key from null to '' | need for shorten subtitles

    if(this.tileRef.tile_type === 'training' && this.tileRef.tile_activities.length > 0){
      if(this.tileRef.tile_activities[0].tile_activity_name === null){this.tileRef.tile_activities[0].tile_activity_name = ''};
    }

    if(this.tileRef.tile_type === 'diet' && this.tileRef.tile_diets.length > 0){
      if(this.tileRef.tile_diets[0].tile_diet_meal === null){this.tileRef.tile_diets[0].tile_diet_meal=''}
    }

    if(this.tileRef.tile_type === 'question' && this.tileRef.tile_question.tile_ask_question === null){this.tileRef.tile_question.tile_ask_question=''};

    if(this.tileRef.tile_type === 'motivation' && this.tileRef.tile_motivation.tile_motivation_sentence === null){this.tileRef.tile_motivation.tile_motivation_sentence=''};

    //subscriptions to states
    
    this.callendarArrayState = this._store.select(state => state.callendar.calendar);
    this.callendarArraySub = this.callendarArrayState.subscribe(
      data => {
        this.callendarArray = data;
      }
    );

    this.openedDayState = this._store.select(state => state.callendar.openedDay);
    this.openedDaySub = this.openedDayState.subscribe(
      data => this.openedDay = data
    );

    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        this.trainingPlan = tp;
        if(tp){
          if(this.tileRef.tile_session && this.tileRef.tile_session === this.trainingPlan.training_sesion_number){
            this.disabledDown = true;
          }
          if(this.tileRef.tile_session && this.tileRef.tile_session === 1){
            this.disabledUp = true;
          }
        }
      }
    )

    this.mainRouteState = this._store.select(state => state.tiles.mainRoute);
    this.mainRouteSub = this.mainRouteState.subscribe(
      data => this.mainRoute = data
    );

    this.gridArrayState = this._store.select(state => state.tiles.day);
      this.gridArraySub = this.gridArrayState.subscribe(
        data => {
          if(data){
            const firstArray = [];
            const secondArray = [];
            const thirdArray = [];
            const numberArray = [];
            data.forEach(
              tile => {
                if(tile.tile_session === 1){firstArray.push('one')}else if(tile.tile_session === 2){secondArray.push('two')}else if(tile.tile_session === 3){thirdArray.push('three')};
              }
            );
            numberArray.push(firstArray.length, secondArray.length, thirdArray.length);
            this.numberArray = numberArray
          }
        }
      )
  }

  openTile(){
    this.tileRef.tile_is_open = !this.tileRef.tile_is_open;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this._changeDetector.markForCheck();
  }

  delete(){
    if(!this.isInCollection){
      const openedDay = this.callendarArray.calendar[this.openedDay.callendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
  
      this.isVerifiedSub = this._dialog.open(VerifyDialogComponent, {
        width: '300px',
        autoFocus: false,
        id: 'delete-dialog-tile',
        data: {isVerified: this.isVerified}
      });
      this.isVerifiedSub.afterClosed().subscribe(result => {
        this.isVerified = result;
        if(result){
          this._httpCalendarService.deleteCalendarAssoc(this.trainingPlan, this.tr_id, this.asso_id, this.openedDay.callendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, this.tileRef.tile_temporary_id, openedDay.momentDate, openedDay, this.callendarArray.calendar[this.openedDay.callendarIndex].weeks[this.openedDay.weeksIndex].weekDates);
          this.makeWeek(this.openedDay.callendarIndex, this.openedDay.weeksIndex)
        }
      })
    } else {
      this.isVerifiedSub = this._dialog.open(VerifyDialogDayComponent, {
        width: '300px',
        autoFocus: false,
        id: 'delete-dialog-tile',
        data: {isVerified: this.isVerified}
      });
      this.isVerifiedSub.afterClosed().subscribe(result => {
        this.isVerified = result;
        if(result){
          this._store.dispatch(new TilesDataActions.DeleteTile(this.index));
          if(this.tileRef.tile_type === 'training'){
            this._httpService.deleteTrainingTile(this.tileRef.tile_id);
          }else if(this.tileRef.tile_type === 'diet'){
            this._httpService.deleteDietTile(this.tileRef.tile_id);
          }else if(this.tileRef.tile_type === 'question'){
            this._httpService.deleteQuestionTile(this.tileRef.tile_id);
          }else if(this.tileRef.tile_type === 'motivation'){
            this._httpService.deleteMotivationTile(this.tileRef.tile_id);
          }
        }
      })
    }
  }

  edit(){
    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], { queryParams: { 'right': 'tileeditor' }})
    }else{
      this._router.navigate(['/tileeditor']);
    }
    this._store.dispatch(new TilesDataActions.EditTile(this.tileRef));
  }

  makeWeek(callendarIndex: number, weeksIndex: number){
    const assoArray = [];
    this.callendarArray.calendar[callendarIndex].weeks[weeksIndex].weekDates.forEach(
      week => {
        if(week.association){
          week.association.forEach(
            asso => assoArray.push(asso)
          )
        }
      }
    );
    if(assoArray.length != 0){
      this._store.dispatch(new TilesDataActions.MakeWeek(assoArray))
    }
  }

  goDown(){
    const sessions = this.trainingPlan.training_sesion_number;
    const session = this.tile.tile_session;
    if(session === sessions){
      return
    }else{
      let assoChangeSession: Association = {
        tile_id: this.tile.id,
        calendar_date: this.tile.asso.calendar_date,
        training_plan: this.trainingPlan.training_plan_name,
        tile_color: this.tile.tile_type_color,
        training_sesion: session+1,
        tile_type: this.tile.tile_type,
        asso_temporary_id: this.tile.asso.asso_temporary_id,
        asso_index_in_array: this.numberArray[session]+1
      };
      this._httpCalendarService.patchCalendarAssoc(this.trainingPlan.id, this.asso_id, assoChangeSession, this.openedDay.callendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, this.tile.asso.asso_temporary_id, session+1);
    }
  };

  goUp(){
    const session = this.tile.tile_session;
    if(session === 1){
      return
    }else{
      let assoChangeSession: Association = {
        tile_id: this.tile.id,
        calendar_date: this.tile.asso.calendar_date,
        training_plan: this.trainingPlan.training_plan_name,
        tile_color: this.tile.tile_type_color,
        training_sesion: session-1,
        tile_type: this.tile.tile_type,
        asso_temporary_id: this.tile.asso.asso_temporary_id,
        asso_index_in_array: this.numberArray[session-1]+1
      };
      this._httpCalendarService.patchCalendarAssoc(this.trainingPlan.id, this.asso_id, assoChangeSession, this.openedDay.callendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, this.tile.asso.asso_temporary_id, session-1);
    }
  };

  dayToedit(): boolean {
    if(!this.isInCollection){
      const one = moment(this.dateTile).format('YYYY-MM-DD')
      const two = moment().format('YYYY-MM-DD')
      
      return moment(one).isBefore(moment(two))
    }else{
      return false
    }
  }

  ngOnDestroy(){
    this.openedDaySub.unsubscribe();
    this.callendarArraySub.unsubscribe();
    this.mainRouteSub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
  }

}