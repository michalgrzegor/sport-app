import { HttpCommentClientService } from '../../shared/http-comment-client.service';
import { StarDialogComponent } from './star-dialog/star-dialog.component';
import { Star, Association, CalendarComment } from '../../shared/store/tiles-data.reducers';
import { SummaryDataService, Summary } from '../../shared/summary-data.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { Subscription, Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

import * as _ from 'lodash';
import * as moment from 'moment';

//store imports
import * as fromApp from '../../shared/store/app.reducers';
import * as CalendarDataActions from '../../shared/store/calendar-data.actions';
import { Store } from '@ngrx/store';
import * as TilesActions from '../../shared/store/tiles-data.actions';
import * as fromTilesData from '../../shared/store/tiles-data.reducers'
import * as TilesDataActions from '../../shared/store/tiles-data.actions';

import { OpenedDay } from '../../shared/store/calendar-data.reducers';
import { CalendarArray } from 'src/app/shared/calendar-data.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RepeatDialogComponent, RepeatData } from '../repeat-dialog/repeat-dialog.component';
import { TrainingPlan } from '../../shared/store/tiles-data.reducers';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { FabBtnAnimations } from 'src/app/shared/fab-btn/fab-btn.animations';
import { AddTilesHandsetComponent } from 'src/app/nodesktop/add-tiles-handset/add-tiles-handset.component';
import { VerifyDialogAllDayComponent } from 'src/app/tile/verify-dialog-allday/verify-dialog-allday.component';
import { HttpClientService } from 'src/app/shared/http-client.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpCalendarClientService } from 'src/app/shared/http-calendar-client.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentComponent } from '../comment/comment.component';
import { VerifyDialogCommentComponent } from '../comment/verify-dialog-comment/verify-dialog-comment.component';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  animations: [
    trigger('hideShow', [
      state('show', style({minHeight: '235px'})),
      state('hide', style({height: '0px'})),
      transition('show => hide', animate('0.2s ease-in')),
      transition('hide => show', animate('0.2s ease-out'))
    ]),
    trigger('fade', [
      transition('* => void', [style({opacity: 1}), animate('0.2s ease-in')])
    ]),
    trigger('rotate', [
      state('show', style({transform: 'rotate(0deg)'})),
      state('hide', style({transform: 'rotate(180deg)'})),
      transition('show => hide', animate('0.6s ease-in')),
      transition('hide => show', animate('0.6s ease-out'))
    ]), FabBtnAnimations
  ]
})
export class CalendarDayComponent implements OnInit, OnDestroy {  
  
  
  
  //animation
  get stateName() {
    return this.summaryClose ? 'show' : 'hide'
  }

  get runChangeDetection() {
    return true;
  }
  
  dayDateString: string;

  summary: Summary = null;
  summaryDay: Summary = null;
  
  summaryCloseSub: Subscription;
  summaryCloseState: Observable<boolean>;
  summaryClose: boolean;
  
  dayState: Observable<any>;
  daySub: Subscription;
  
  tilesSub: Subscription;
  tilesState: Observable<fromTilesData.State>;
  tiles: Tile[];
  
  dragTileState: Observable<any>;
  dragTileSub: Subscription;
  dragTile: Tile = null;

  
  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;
  tPStar: Star = null;
  
  isChangeSessionState: Observable<any>;
  isChangeSessionSub: Subscription;
  isChangeSession: Tile = null;
  
  gridArrayState: Observable<Tile[]>;
  gridArraySub: Subscription;
  day;
  gridArray: Tile[];
  gridArrayS1: Tile[] = [];
  gridArrayS2: Tile[] = [];
  gridArrayS3: Tile[] = [];
  
  
  calendarArrayState: Observable<CalendarArray>;
  calendarArraySub: Subscription;
  calendarArray: CalendarArray = null;
  
  openedDayState: Observable<any>;
  openedDaySub: Subscription;
  openedDay: OpenedDay = null;
  
  planNameState: Observable<string>;
  planNameSub: Subscription;
  planName: string = null;
  
  array: Association[] = [];
  
  dayDateState: Observable<any>;
  dayDateSub: Subscription;
  dayDate: string = null;
  
  weekState: Observable<Tile[]>;
  weekSub: Subscription;
  week: Tile[] = null;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  copiedDayState: Observable<Association[]>;
  copiedDaySub: Subscription;
  copiedDay: Association[];

  pastedState: Observable<number>;
  pastedSub: Subscription;
  pasted: number;

  tilesToChangeState: Observable<Association[]>;
  tilesToChangeSub: Subscription;
  tilesToChange: Association[];

  commentsState: Observable<CalendarComment[]>;
  commentsSub: Subscription;
  comments: CalendarComment[];
  commentsAll: CalendarComment[];

  
  //cdk drag drop array
  idArrayState: Observable<string[]>;
  idArraySub: Subscription;
  idArray: string[] = null;

  allMomentDateArrayState: Observable<string[]>;
  allMomentDateArraySub: Subscription;
  allMomentDateArray: string[] = null;
  
  sessions: number[] = [];
  assoIndex: number;
  
  //repeat funcionality data
  weekly: number;
  daily: number;
  repeats: number;
  interval: number;
  
  //data from star
  star_date: string;
  star_color: string;
  star_description: string;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;
  isTabletLand: boolean;

  //handset fab button variables
  tileToAdd: Tile = null;


  constructor(
    private _store: Store<fromApp.AppState>,
    public _dialog: MatDialog,
    private _cdr: ChangeDetectorRef,
    private _summaryData: SummaryDataService,
    public _breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
    private _httpService: HttpClientService,
    private _cookieService: CookieService,
    public _authService: AuthService,
    private _httpCalendarService: HttpCalendarClientService,
    private _httpCommentService: HttpCommentClientService
    ) {
    }
    
    ngOnInit(): void {

      this._breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = true;
        this.isTablet = false;
        this.isTabletLand = false;
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
        this.isTabletLand = false;
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
        this.isTabletLand = false;
        this.isWeb = true;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.TabletLandscape])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = false;
        this.isTabletLand = true;
        this.isWeb = false;
      } else {
      }
    });

      this.commentsState = this._store.select(state => state.tiles.comments);
      this.commentsSub = this.commentsState.subscribe(
        data => {
          this.commentsAll = data
          if(data && this.dayDate){
            this.makeComments(data, this.dayDate)
          }
        }
      )

      this.allMomentDateArrayState = this._store.select(state => state.calendar.allMomentDateArray);
      this.allMomentDateArraySub = this.allMomentDateArrayState.subscribe(
        data => {
          if(data){
            this.allMomentDateArray = data;
            if(this.idArray){
              this.allMomentDateArray = this.allMomentDateArray.concat(this.idArray);
            }
          }
        }
      )

      this.planNameState = this._store.select(state => state.calendar.planName);
      this.planNameSub = this.planNameState.subscribe(
        data => this.planName = data
      )

      this.idArrayState = this._store.select(state => state.calendar.idArray);
      this.idArraySub = this.idArrayState.subscribe(
        data => {
          if(data){
            this.idArray = data;
            if(this.allMomentDateArray){
              this.allMomentDateArray = this.allMomentDateArray.concat(this.idArray);
            }
          }
        }
      )

      this.isChangeSessionState = this._store.select(state => state.tiles.isChangeSession);
      this.isChangeSessionSub = this.isChangeSessionState.subscribe(
        data => this.isChangeSession = data
      )

      this.calendarArrayState = this._store.select(state => state.calendar.calendar);
      this.calendarArraySub = this.calendarArrayState.subscribe(
        data => {
          this.calendarArray = data;
        }
      );

      this.copiedDayState = this._store.select(state => state.calendar.copiedAsso);
      this.copiedDaySub = this.copiedDayState.subscribe(
        data => {
          this.copiedDay = data;
        }
      );

      this.summaryCloseState = this._store.select(state => state.tiles.summaryClose);
      this.summaryCloseSub = this.summaryCloseState.subscribe(
        data => {
          this.summaryClose = data;
        }
      );

      this.tilesToChangeState = this._store.select(state => state.calendar.tilesToChange);
      this.tilesToChangeSub = this.tilesToChangeState.subscribe(
        data => {
          this.tilesToChange = data;
          if(data && data.length > 0 && this.gridArray && this.gridArray.length > 0){
            this.addMissingID(this.gridArray, this.tilesToChange);
            this.makeGrids(this.gridArray);
          }
        }
      );

      this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
      this.isPaidAccountSub = this.isPaidAccountState.subscribe(
        data => this.isPaidAccount = data
      );

      this.weekState = this._store.select(state => state.tiles.week);
      this.weekSub = this.weekState.subscribe(
        data => {
          this.week = data;
          this.makeSummary(data);
        }
      );

      this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
      this.trainingPlanSub = this.trainingPlanState.subscribe(
        data => {
          this.trainingPlan = data;
          if(this.sessions.length === 0){
            for (let i = 1; i <= data.training_sesion_number; i++){
              this.sessions.push(i);
            }
          }
          if(data && this.dayDate){
            this.tPStar = null
            data.calendar_stars.forEach(
              (star: Star) => {
                if(moment(star.star_date).format() === moment(this.dayDate).format()){
                  this.tPStar = star;
                }})}
              }
      );

      this.gridArrayState = this._store.select(state => state.tiles.day);
      this.gridArraySub = this.gridArrayState.subscribe(
        data => {
          this.day = data;
          this.gridArray = data;
          if(data){
            this.makeGrids(this.gridArray)
            if(this.tilesToChange && this.tilesToChange.length > 0 && data.length > 0){
              this.addMissingID(this.gridArray, this.tilesToChange);
              this.makeGrids(this.gridArray);
            }
          }
          this.summaryDay = this._summaryData.makeSummary(data);
        }
      )

      this.openedDayState = this._store.select(state => state.calendar.openedDay);
      this.openedDaySub = this.openedDayState.subscribe(
        data => {
          this.openedDay = data;
          this.dayDateString = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate
        }
      )

      this.pastedState = this._store.select(state => state.calendar.pasted);
      this.pastedSub = this.pastedState.subscribe(
        data => {
          this.pasted = data;
          if(data > 1 && this.openedDay){
            const openedDay = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
            this._store.dispatch(new TilesDataActions.MakeDay({date: openedDay.momentDate, day: openedDay}));
            this.makeWeek(this.openedDay.calendarIndex, this.openedDay.weeksIndex);
          }
        }
      )

      this.dayDateState = this._store.select(state => state.calendar.dayDate);
      this.dayDateSub = this.dayDateState.subscribe(
        data => {
          this.dayDate = data;
          if(data && this.trainingPlan){
            this.tPStar = null
            this.trainingPlan.calendar_stars.forEach(
              (star: Star) => {
                if(star && moment(star.star_date).format() === moment(data).format()){
                  this.tPStar = star;
                }
              }
            )
          }
          if(data && this.commentsAll){
            this.makeComments(this.commentsAll, data)
          }
        }
      )

      this.tilesState = this._store.select(state => state.tiles);
      this.tilesSub = this.tilesState.subscribe(
        data => this.tiles = data.tiles
      );

      this.dayState = this._store.select(state => state.calendar.day);
      this.daySub = this.dayState.subscribe(
        data => {
          this.array = data;
          if(data && this.gridArray){
            this.array.forEach(asso => {
              this.gridArray.forEach(
                grid => {
                  if(asso.asso_temporary_id === grid.tile_temporary_id){
                    grid.tile_session = asso.training_sesion;
                  }
                }
              )
            });
            this.makeGrids(this.gridArray)
          };

        }
      )

      //drag tile data
      this.dragTileState = this._store.select(state => state.tiles.dragTile);
      this.dragTileSub = this.dragTileState.subscribe(
        data => this.dragTile = data
      )
  }

  makeComments($comments:CalendarComment[], date: string){
    this.comments = [];
    $comments.forEach(
      com => {
        if(moment(com.comment_day).format('YYYY-MM-DD')===moment(date).format('YYYY-MM-DD')){
          this.comments.push(com)
        }
      }
    );
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  //fab button func
  fabbuttons = [
    {
      icon: 'comment'
    },
    {
      icon: 'star'
    },
    {
      icon: 'delete'
    },
    {
      icon: 'assignment_turned_in'
    },
    {
      icon: 'file_copy'
    },
    {
      icon: 'repeat'
    },
    {
      icon: 'add'
    }
  ];
  fabbuttonsInactive = [
    {
      icon: 'comment'
    },
    {
      icon: 'assignment_turned_in'
    },
    {
      icon: 'file_copy'
    },
    {
      icon: 'repeat'
    },
  ];

  buttons = [];
  fabTogglerState: any = 'inactive';

  makeGrids(data){
    this.gridArrayS1 = [];
    this.gridArrayS2 = [];
    this.gridArrayS3 = [];
    data.forEach(
      el => {
        if(el.tile_session === 1){
          this.gridArrayS1.push(Object.assign({}, el));
        }else if(el.tile_session === 2){
          this.gridArrayS2.push(Object.assign({}, el));
        }else if(el.tile_session === 3){
          this.gridArrayS3.push(Object.assign({}, el));
        }
      }
    )
    this.gridArrayS1 = this.gridArrayS1.sort(this.compare);
    this.gridArrayS2 = this.gridArrayS2.sort(this.compare);
    this.gridArrayS3 = this.gridArrayS3.sort(this.compare);
  }

  addMissingID(tiles: Tile[], assocs:Association[]){
    if(assocs.length > 200){
      this._httpService.getTrainingPlanById(this.trainingPlan.id);
      this._store.dispatch(new CalendarDataActions.ResetATCH())
    }
    if(tiles.length > 0 && assocs.length > 0){
      tiles.forEach(
        tile => {
          if(!tile.asso_id){
            assocs.forEach(
              asso => {
                if(asso.tile_id === tile.id && asso.training_sesion === tile.tile_session && asso.asso_index_in_array === tile.asso_index_in_array && asso.calendar_date === tile.asso.calendar_date){
                  tile.asso_id = asso.id;
                  tile.asso.id = asso.id;
                }
              }
            )
          }
        }
      )
    }
  }

  showItems(date) {
    this.fabTogglerState = 'active';
    if(this.dayToedit(date)){
      this.buttons = this.fabbuttonsInactive;
    }else{
      this.buttons = this.fabbuttons;
    }
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab(date) {
    this.buttons.length ? this.hideItems() : this.showItems(date);
  }

  fabbtnclick(name: string){
    if(name === 'repeat') {
      this.repeat();
    } else if(name === 'file_copy'){
      this.copy()
    } else if(name === 'add'){
      this.add()
    } else if(name === 'assignment_turned_in'){
      this.paste()
    } else if(name === 'delete'){
      this.delete()
    } else if(name === 'arrow_downward'){
      this.moveWeek()
    } else if(name === 'star' && this.tPStar){
      this.editStar()
    } else if ( name === 'star' && !this.tPStar ) {
      this.addStar()
    } else if (name === 'comment'){
      this.addComment()
    }
    this.hideItems()
  }

  add(){
    let width = null;
    if(this.isTablet){
      width = '50vw'
    }else if(this.isTabletLand){
      width = '35vw'
    }else{
      width = '600px'
    }
    this.isVerifiedSub = this._dialog.open(AddTilesHandsetComponent, {
      width: '92vw',
      maxWidth: width,
      maxHeight: '92vh',
      data: {data: this.tileToAdd},
      autoFocus: false,
      id: 'add-tile-handset'
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      if(result){
        const allId = [];
        this.gridArrayS1.forEach(tile => allId.push(tile.tile_temporary_id));
        const lastId = _.max(allId);

        const tile = Object.assign({}, result);
        tile.tile_temporary_id = lastId + 1;

        let number_in_array;
        if(this.gridArrayS1.length>0){number_in_array = this.gridArrayS1[this.gridArrayS1.length-1].asso_index_in_array+1}else{number_in_array=1};


        let asso: Association = {
          tile_id: tile.tile_id,
          calendar_date: this.dayDate,
          training_plan: this.planName,
          tile_color: tile.tile_type_color,
          training_sesion: 1,
          tile_type: tile.tile_type,
          asso_temporary_id: tile.tile_temporary_id,
          asso_index_in_array: number_in_array
        };

        const newOrder = [];
        this.gridArrayS1.push(tile);
        this.gridArrayS1.forEach(item => {newOrder.push(item.tile_temporary_id);});
        const varTwo = {date: this.dayDate, day: this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex]}
        this._httpCalendarService.postCalendarAssoc(this.trainingPlan, this.trainingPlan.id, asso, this.openedDay.calendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, newOrder, 1 , varTwo, lastId+1, true, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);
        this.makeWeek(this.openedDay.calendarIndex, this.openedDay.weeksIndex);

        //Open Snack Bar
        let snackBarRef = this._snackBar.open(`Do you want to repeat this action?`, `REPEAT`, {duration: 6000});
        //Add functionality after close
        snackBarRef.onAction().subscribe(() => this.openDialog(asso, this.openedDay.calendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex))
      }
    })
  }

  makeSummary(data: Tile[]): any {
    this.summary = this._summaryData.makeSummary(data);
  }

  trackByName(index, tile) {
    return tile;
  }

  compare(a, b) {
    const genreA = a.asso_index_in_array;
    const genreB = b.asso_index_in_array;
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  drop(event: CdkDragDrop<Tile[]>){
    let sessionNumber: number = null;
    let number_in_array: number = null;
    if(event.container.id === this.idArray[0]){
      sessionNumber = 1;
      if(this.gridArrayS1.length>0){number_in_array = this.gridArrayS1[this.gridArrayS1.length-1].asso_index_in_array+1}else{number_in_array=1};
    }else if(event.container.id === this.idArray[1]){
      sessionNumber = 2;
      if(this.gridArrayS2.length>0){number_in_array = this.gridArrayS2[this.gridArrayS2.length-1].asso_index_in_array+1}else{number_in_array=1};
    }else if(event.container.id === this.idArray[2]){
      sessionNumber = 3;
      if(this.gridArrayS3.length>0){number_in_array = this.gridArrayS3[this.gridArrayS3.length-1].asso_index_in_array+1}else{number_in_array=1};
    }

    const tileMove: Tile = Object.assign({},event.previousContainer.data[event.previousIndex]);
    let assoMove: Association = {
      tile_id: tileMove.tile_id,
      calendar_date: this.dayDate,
      training_plan: this.planName,
      tile_color: tileMove.tile_type_color,
      training_sesion: sessionNumber,
      tile_type: tileMove.tile_type,
      asso_temporary_id: tileMove.tile_temporary_id,
      asso_index_in_array: undefined
    };

    if(event.container.id === this.idArray[0] && event.container.id === event.previousContainer.id){
      moveItemInArray(this.gridArrayS1, event.previousIndex, event.currentIndex)
      const newOrder = this.makeNewOrder(this.gridArrayS1);
      const newOrderArray = this.makeNewOrderArray(newOrder, this.gridArrayS1);
      this._httpCalendarService.makeNewOrderAssoc(this.trainingPlan.id, newOrderArray)
      this._store.dispatch(new CalendarDataActions.ChangeAssoIndex({sessionNumber: 1, newOrder: newOrder}))
    } else if(event.container.id === this.idArray[1] && event.container.id === event.previousContainer.id){
      moveItemInArray(this.gridArrayS2, event.previousIndex, event.currentIndex)
      const newOrder = this.makeNewOrder(this.gridArrayS2);
      const newOrderArray = this.makeNewOrderArray(newOrder, this.gridArrayS2);
      this._httpCalendarService.makeNewOrderAssoc(this.trainingPlan.id, newOrderArray)
      this._store.dispatch(new CalendarDataActions.ChangeAssoIndex({sessionNumber: 2, newOrder: newOrder}))
    } else if(event.container.id === this.idArray[2] && event.container.id === event.previousContainer.id){
      moveItemInArray(this.gridArrayS3, event.previousIndex, event.currentIndex)
      const newOrder = this.makeNewOrder(this.gridArrayS3);
      const newOrderArray = this.makeNewOrderArray(newOrder, this.gridArrayS3);
      this._httpCalendarService.makeNewOrderAssoc(this.trainingPlan.id, newOrderArray)
      this._store.dispatch(new CalendarDataActions.ChangeAssoIndex({sessionNumber: 3, newOrder: newOrder}))
    } else if (event.previousContainer.id === "tiles-collection") {

      const newOrder = [];
      const allId = [];
      this.gridArrayS1.forEach(tile => allId.push(tile.tile_temporary_id));
      this.gridArrayS2.forEach(tile => allId.push(tile.tile_temporary_id));
      this.gridArrayS3.forEach(tile => allId.push(tile.tile_temporary_id));
      let lastId = null;
      if(allId.length>0){lastId = _.max(allId);}else(lastId = 0)

      const tile = Object.assign({},event.previousContainer.data[event.previousIndex]);
      tile.tile_temporary_id = lastId + 1;

      let session = null;

      if(event.container.id === this.idArray[0]){
        this.gridArrayS1.push(tile);
        this.gridArrayS1.forEach(item => {newOrder.push(item.tile_temporary_id);})
        session = 1;
      }else if(event.container.id === this.idArray[1]){
        this.gridArrayS2.push(tile);
        this.gridArrayS2.forEach(item => {newOrder.push(item.tile_temporary_id);})
        session = 2;
      }else if(event.container.id === this.idArray[2]){
        this.gridArrayS3.push(tile);
        this.gridArrayS3.forEach(item => {newOrder.push(item.tile_temporary_id);})
        session = 3;
      }

      let asso: Association = {
        tile_id: tile.tile_id,
        calendar_date: this.dayDate,
        training_plan: this.planName,
        tile_color: tile.tile_type_color,
        training_sesion: sessionNumber,
        tile_type: tile.tile_type,
        asso_temporary_id: tile.tile_temporary_id,
        asso_index_in_array: number_in_array
      };


      const varTwo = {date: this.dayDate, day: this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex]};
      this._httpCalendarService.postCalendarAssoc(this.trainingPlan, this.trainingPlan.id, asso, this.openedDay.calendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, newOrder, session , varTwo, lastId+1, true, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);

      //Open Snack Bar
      let snackBarRef = this._snackBar.open(`Do you want to repeat this action?`, `REPEAT`, {duration: 6000});
      //Add functionality after close
      snackBarRef.onAction().subscribe(() => this.openDialog(asso, this.openedDay.calendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex))
    } else {
      const tileChangeSession = Object.assign({},event.previousContainer.data[event.previousIndex]);
      let assoChangeSession: Association = {
        tile_id: tileChangeSession.tile_id,
        calendar_date: this.dayDate,
        training_plan: this.planName,
        tile_color: tileChangeSession.tile_type_color,
        training_sesion: sessionNumber,
        tile_type: tileChangeSession.tile_type,
        asso_temporary_id: tileChangeSession.tile_temporary_id,
        asso_index_in_array: number_in_array
      };
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this._httpCalendarService.patchCalendarAssoc(this.trainingPlan.id, tileChangeSession.asso_id, assoChangeSession, this.openedDay.calendarIndex, this.openedDay.weeksIndex, this.openedDay.weekDatesIndex, tileChangeSession.tile_temporary_id, sessionNumber);
    }


    //sumary

    this.makeWeek(this.openedDay.calendarIndex, this.openedDay.weeksIndex);

    
  }

  makeNewOrder(array: Tile[]){
    const newOrder = [];
    array.forEach(
      item => {
        newOrder.push(item.tile_temporary_id);
      }
    );
    return newOrder;
  }

  makeNewOrderArray(array: number[], tile_array: Tile[]){
    const newOrderArray = [];
    let asso_id = null
    array.forEach(
      item => {
        tile_array.forEach(
          tile => {
            if(tile.tile_temporary_id === item){
              asso_id = tile.asso_id
            }
          }
        )
        newOrderArray.push({id: asso_id, asso_index_in_array: array.indexOf(item) + 1})
      }
    );
    return {
      calendar_assocs: newOrderArray
    };
  }

  openDialog(ass, calendarIndex: number, weeksIndex: number, weekDatesIndex: number): void {
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

    const asso: Association[] = [];
    if(ass){
      asso.push(ass)
    }

    //subscribe to data from closed dialog
    dialogRef.afterClosed().subscribe((data) => {if(data){this.repeatAction(data, asso, calendarIndex, weeksIndex, weekDatesIndex)}})
  }

  close(){
    const calendarIndex = this.openedDay.calendarIndex;
    const weeksIndex = this.openedDay.weeksIndex;
    const weekDatesIndex = this.openedDay.weekDatesIndex;

    this._store.dispatch(new CalendarDataActions.CloseContainer({calendarIndex: calendarIndex, weeksIndex: weeksIndex, weekDatesIndex: weekDatesIndex}))

  }

  isVerified: boolean;
  isVerifiedSub: any;

  delete(){

    const allmom = [...this.allMomentDateArray];
    const calendarIndex = this.openedDay.calendarIndex;
    const weeksIndex = this.openedDay.weeksIndex;
    const weekDatesIndex = this.openedDay.weekDatesIndex;
    const day = this.calendarArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex];
    const assocs = day.association;
    const calendar = this.calendarArray;

    
    // summary:
    this.makeWeek(calendarIndex, weeksIndex);

    const tp = Object.assign({}, this.trainingPlan);
    const arrayWithNewAsso = tp.calendar_assocs;
    assocs.forEach(
      asso => {
        const index = arrayWithNewAsso.indexOf(asso);
        arrayWithNewAsso.splice(index,1);
      }
    );
    tp.calendar_assocs = arrayWithNewAsso;

    calendar.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex].association = [];


    
    this.isVerifiedSub = this._dialog.open(VerifyDialogAllDayComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-allday',
      data: {isVerified: this.isVerified}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      this.isVerified = result;
      if(result){
        this._httpCalendarService.deleteDay(this.trainingPlan.id, assocs ,calendarIndex, weeksIndex, weekDatesIndex, day, tp, calendar, allmom, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates)
      }
    })
  }

  copy(){
    const array = [];
    this.gridArray.forEach(
      grid => {
        const newGrid = Object.assign({}, grid.asso);
        delete newGrid.id;
        array.push(newGrid);
      }
    )
    this._store.dispatch(new CalendarDataActions.CopyAsso(array))
  }

  paste(){
    const calendar = Object.assign({}, this.calendarArray);
    const calendarIndex = this.openedDay.calendarIndex;
    const weeksIndex = this.openedDay.weeksIndex;
    const weekDatesIndex = this.openedDay.weekDatesIndex;
    const day = this.calendarArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex];
    const tp: TrainingPlan = Object.assign({}, this.trainingPlan);
    const array = [];
    
    this.copiedDay.forEach(
      asso => {
        const newAsso = Object.assign({}, asso);
        newAsso.calendar_date = this.dayDate;
        array.push(newAsso);
        tp.calendar_assocs.push(newAsso);
      }
    );
    array.forEach(asso=>day.association.push(asso));
    this._httpCalendarService.pasteAsso(this.trainingPlan.id, array, tp, this.openedDay.calendarIndex, this.openedDay.weeksIndex, day, calendar, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates)
  }

  repeat(): void {
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

    const calendarIndex = this.openedDay.calendarIndex;
    const weeksIndex = this.openedDay.weeksIndex;
    const weekDatesIndex = this.openedDay.weekDatesIndex;
    const asso = this.calendarArray.calendar[calendarIndex].weeks[weeksIndex].weekDates[weekDatesIndex].association;

    //subscribe to data from closed dialog
    dialogRef.afterClosed().subscribe((data) => {if(data){this.repeatAction(data, asso, calendarIndex, weeksIndex, weekDatesIndex)}});

    // summary:
    this.makeWeek(calendarIndex, weeksIndex);
  }

  repeatAction(data: RepeatData, asso: Association[], calendarIndexV: number, weeksIndex: number, weekDatesIndex: number): void {
    if(data.daily){
      const tp: TrainingPlan = Object.assign({}, this.trainingPlan);
      const calendarRDD = this.calendarArray;
      const calendarNumberRDD = calendarIndexV;
      const weeksNumberRDD = weeksIndex;
      const weekDatesNumberRDD = weekDatesIndex;
      let nRDD = 0;
      const limitRDD = (calendarRDD.calendar.length * 6 * 7) - (calendarNumberRDD * 6 * 7) - (weeksNumberRDD * 7) - weekDatesNumberRDD - 7;
      const newAssoArrayRDD = [];
      for(let i = 1; i <= Number(data.daily) + nRDD && i < limitRDD; i++) {
          let a = calendarNumberRDD + Math.floor((weeksNumberRDD + Math.floor((weekDatesNumberRDD + i) / 7))/6);
          let b = weeksNumberRDD + Math.floor((weekDatesNumberRDD + i) / 7) - (6 * Math.floor((weeksNumberRDD + Math.floor((weekDatesNumberRDD + i) / 7))/6));
          let c = weekDatesNumberRDD + i - (7 * (Math.floor((weekDatesNumberRDD + i) / 7)));
          if(calendarRDD.calendar[a].weeks[b].weekDates[c].available){
              let newAsso = [];
              asso.forEach(as => newAsso.push(Object.assign({}, as)));
              newAsso.forEach(asso => {
                asso.date = calendarRDD.calendar[a].weeks[b].weekDates[c].momentDate;
                asso.calendar_date = calendarRDD.calendar[a].weeks[b].weekDates[c].momentDate;
                delete asso.id
              })
              calendarRDD.calendar[a].weeks[b].weekDates[c].association.push(...newAsso);
              newAsso.forEach(asso=>{
                const newAss = Object.assign({},asso);
                delete newAss.id
                newAssoArrayRDD.push(newAss);
              });
          } else {
              nRDD = nRDD + 1;
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
        openedDayDate = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate
      }

      this._httpCalendarService.repeatDailyDayAsso(this.trainingPlan.id, newAssoArrayRDD ,calendarRDD,tp, isOpenedDay, calendarIndex, weeksIndexx, openedDayDate, this.calendarArray, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);
      
    } else if (data.weekly) {
      const tp: TrainingPlan = Object.assign({}, this.trainingPlan);
      const calendarRWD = this.calendarArray;
      const calendarNumberRWD = calendarIndexV;
      const weeksNumberRWD = weeksIndex;
      const weekDatesNumberRWD = weekDatesIndex;
      let nRWD = 0;
      const limitRWD = (calendarRWD.calendar.length * 6) - (calendarNumberRWD*6 + weeksNumberRWD);
      const newAssoArrayRWD = [];
      for(let i = 1; i <= Number(data.weekly)+nRWD && i < limitRWD; i++){
          if(calendarRWD.calendar[calendarNumberRWD + Math.floor((weeksNumberRWD + i) / 6)].weeks[(weeksNumberRWD + i - (6 * (Math.floor((weeksNumberRWD + i) / 6))))].weekDates[weekDatesNumberRWD].available){
              let newAsso = [];
              asso.forEach(as => newAsso.push(Object.assign({}, as)));
              newAsso.forEach(asso => {
                delete asso.id
                asso.date = asso.date = calendarRWD.calendar[calendarNumberRWD + Math.floor((weeksNumberRWD + i) / 6)].weeks[(weeksNumberRWD + i - (6 * (Math.floor((weeksNumberRWD + i) / 6))))].weekDates[weekDatesNumberRWD].momentDate;
                asso.calendar_date = calendarRWD.calendar[calendarNumberRWD + Math.floor((weeksNumberRWD + i) / 6)].weeks[(weeksNumberRWD + i - (6 * (Math.floor((weeksNumberRWD + i) / 6))))].weekDates[weekDatesNumberRWD].momentDate;
              });
              calendarRWD.calendar[calendarNumberRWD + Math.floor((weeksNumberRWD + i) / 6)].weeks[(weeksNumberRWD + i - (6 * (Math.floor((weeksNumberRWD + i) / 6))))].weekDates[weekDatesNumberRWD].association.push(...newAsso);
              newAsso.forEach(asso=>{
                const newAss = Object.assign({},asso);
                delete newAss.id
                newAssoArrayRWD.push(newAss);
              });
          }else{
              nRWD = nRWD + 1;
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
        openedDayDate = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex].momentDate
      }

      this._httpCalendarService.repeatWeaklyDayAsso(this.trainingPlan.id, newAssoArrayRWD ,calendarRWD,tp, isOpenedDay, calendarIndex, weeksIndexx, openedDayDate, this.calendarArray, this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates);

    } 

    //sumary
    this.makeWeek(calendarIndexV, weeksIndex);
  }

  toggleAction(){
    let bool = !this.summaryClose;
    this._store.dispatch(new TilesActions.SummaryTogle(bool));
  }
  
  onDragStart(data: Tile, index: number): void {
    this.assoIndex = index;
    this._store.dispatch(new TilesActions.DragTile({tile: data, changeSession: true}))
  }

  
  
  makeWeek(calendarIndex: number, weeksIndex: number){
    const openedDay = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
    const assoArray = [];
    this.calendarArray.calendar[calendarIndex].weeks[weeksIndex].weekDates.forEach(
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
      this._store.dispatch(new TilesDataActions.MakeDay({date: openedDay.momentDate, day: openedDay}));
    }
  }

  moveWeek(){
    const openedDay = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
    this._store.dispatch(new CalendarDataActions.MoveWeek({calendarIndex: this.openedDay.calendarIndex, weeksIndex: this.openedDay.weeksIndex}));
    this._store.dispatch(new TilesDataActions.MakeDay({date: openedDay.momentDate, day: openedDay}));
    this.makeWeek(this.openedDay.calendarIndex, this.openedDay.weeksIndex);
  }

  addStar(){
    const openedDay = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
    const dialogRef = this._dialog.open(StarDialogComponent, {
      width: '408px',
      id: 'star',
      autoFocus: false,
      data: {star_date: moment(openedDay.momentDate).format(), star_color: this.star_color, star_description: this.star_description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        this._httpService.postTrainingPlanStar(this.trainingPlan.id, result);
      }
    });
  }

  editStar(){
    const openedDay = this.calendarArray.calendar[this.openedDay.calendarIndex].weeks[this.openedDay.weeksIndex].weekDates[this.openedDay.weekDatesIndex];
    const dialogRef = this._dialog.open(StarDialogComponent, {
      width: '408px',
      id: 'star',
      autoFocus: false,
      data: {star_date: moment(openedDay.momentDate).format(), star_color: this.tPStar.star_color, star_description: this.tPStar.star_description, id: this.tPStar.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._httpService.patchTrainingPlanStar(this.trainingPlan.id, result, this.tPStar.id)
        this.tPStar = result;
        openedDay.star = result.star_color;
      }
    });
  }

  dayToedit(date): boolean {
    const one = moment(date).format('YYYY-MM-DD')
    const two = moment().format('YYYY-MM-DD')
    return moment(one).isBefore(moment(two))
  }

  isMyComment(comment: CalendarComment):boolean{
    if(comment.comment_user_role==='trainer' && this.isPaidAccount){
      return true
    }else if(comment.comment_user_role==='trainer' && !this.isPaidAccount){
      return false
    }else if(comment.comment_user_role!=='trainer' && !this.isPaidAccount){
      return true
    }else if(comment.comment_user_role!=='trainer' && this.isPaidAccount){
      return false
    }
  }

  myNickname(){
    const profile = JSON.parse(this._authService.getUserProfile());
    return profile.nickname && profile.name
  }

  dateNow(){
    return moment().format('YYYY-MM-DD');
  }

  addComment(){
    let width = '';
    if(this.isHandset){
      width = '95%';
    }else{
      width = '45%';
    }
    const dialogRef = this._dialog.open(CommentComponent, {
      autoFocus: true,
      id: `tp-editor`,
      minWidth: width,
      data: {comment_user: this.myNickname(), comment_data:'', comment_body:'', comment_is_edited:false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const json = {
          comment_data: result.comment_data,
          comment_body: result.comment_body,
          comment_day: this.dayDate,
          comment_user: result.comment_user
        }
        if(this.isPaidAccount){
          this._httpCommentService.postCommentTrainer(this.trainingPlan.id, json);
        }else{
          this._httpCommentService.postCommentAthlete(json);
        }
      }
    })
  }

  editComment(comment: CalendarComment){
    let width = '';
    if(this.isHandset){
      width = '95%';
    }else{
      width = '45%';
    }
    const dialogRef = this._dialog.open(CommentComponent, {
      autoFocus: true,
      id: `tp-editor`,
      minWidth: width,
      data: {comment_user:comment.comment_user, comment_data:comment.comment_data, comment_body:comment.comment_body, comment_is_edited:comment.comment_is_edited}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const json = {
          comment_data: result.comment_data,
          comment_body: result.comment_body,
          comment_day: result.comment_day,
          comment_user: result.comment_user
        }
        if(this.isPaidAccount){
          this._httpCommentService.patchCommentTrainer(comment.id,this.trainingPlan.id, json);
        }else{
          this._httpCommentService.patchCommentAthlete(comment.id, json);
        }
      }
    })
  };

  deleteComment(comment: CalendarComment){
    this.isVerifiedSub = this._dialog.open(VerifyDialogCommentComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: null}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      if(result){
        if(this.isPaidAccount){
          this._httpCommentService.deleteCommentTrainer(comment.id,this.trainingPlan.id);
        }else{
          this._httpCommentService.deleteCommentAthlete(comment.id);
        }
    }})
  }



  ngOnDestroy() {
    this.daySub.unsubscribe();
    this.tilesSub.unsubscribe();
    this.dayDateSub.unsubscribe();
    this.dragTileSub.unsubscribe();
    this.openedDaySub.unsubscribe();
    this.planNameSub.unsubscribe();
    this.isChangeSessionSub.unsubscribe();
    this.gridArraySub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
    this.calendarArraySub.unsubscribe();
    this.weekSub.unsubscribe();
    this.summaryCloseSub.unsubscribe();
    this.idArraySub.unsubscribe();
    this.allMomentDateArraySub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.copiedDaySub.unsubscribe();
    this.pastedSub.unsubscribe();
    this.tilesToChangeSub.unsubscribe();
    this.commentsSub.unsubscribe();
  }

}