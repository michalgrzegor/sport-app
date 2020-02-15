import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';
//store imports
import * as fromApp from '../../shared/store/app.reducers';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { OpenedDay } from 'src/app/shared/store/callendar-data.reducers';
import { Association } from 'src/app/shared/store/tiles-data.reducers';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-callendar-chart',
  templateUrl: './callendar-chart.component.html',
  styleUrls: ['./callendar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class CallendarChartComponent implements OnInit, OnDestroy {
  calendarArrayState: Observable<any>;
  calendarArraySub: Subscription;
  calendarArray: any;

  openedDayState: Observable<OpenedDay>;
  openedDaySub: Subscription;
  openedDay: OpenedDay = null;

  daysToChangeState: Observable<string[]>;
  daysToChangeSub: Subscription;
  daysToChange: string[] = null;

  fireChangeState: Observable<string>;
  fireChangeSub: Subscription;
  fireChange: string = null;

  @Input() callendarIndex: number;
  @Input() weeksIndex: number;
  @Input() weekDatesIndex: number;

  isToday: boolean = false;
  isOpenedDay: boolean = false;
  isOpened: boolean = false;

  day: Association[];

  trainingColor: string[] = [];
  chartSub: Subscription;
  pieSlices: Slice[] = [];

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  constructor(private _store: Store<fromApp.AppState>,
    private _changeDetector : ChangeDetectorRef,
    public _breakpointObserver: BreakpointObserver) {
     }

  ngOnInit(): void {
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

    this.daysToChangeState = this._store.select(state => state.callendar.daysToChange);
    this.daysToChangeSub = this.daysToChangeState.subscribe(
      data => {
        if(data){
          
          data.forEach(
            day => {
              if(this.calendarArray && moment(day).format("MM-DD-YYYY") === moment(this.calendarArray.calendar.calendar[this.callendarIndex].weeks[this.weeksIndex].weekDates[this.weekDatesIndex].momentDate).format("MM-DD-YYYY")){
                console.log(`detekcja`)
                this._changeDetector.markForCheck();
              }
            }
          )
        }
      }
    )

    
    
    this.calendarArrayState = this._store.select(state => state.callendar);
    this.calendarArraySub = this.calendarArrayState.subscribe(
      (data) => {
        if(!this.calendarArray){
          this._changeDetector.markForCheck();
        }
        this.calendarArray = data;
        this.day = data.calendar.calendar[this.callendarIndex].weeks[this.weeksIndex].weekDates[this.weekDatesIndex].association;
        this.drawPieChart();
        if(moment().format("MM-DD-YYYY") === moment(data.calendar.calendar[this.callendarIndex].weeks[this.weeksIndex].weekDates[this.weekDatesIndex].momentDate).format("MM-DD-YYYY")){
          this.isToday = true;
        }else{
          this.isToday = false;
        }
      }
    );

    this.openedDayState = this._store.select(state => state.callendar.openedDay);
    this.openedDaySub = this.openedDayState.subscribe(
      data => {
        this.openedDay = data;
      }
    )

    

    

    if (this.day){
      this.drawPieChart();
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this._changeDetector.markForCheck();
    this.fireChangeState = this._store.select(state => state.tiles.fireChange);
    this.fireChangeSub = this.fireChangeState.subscribe(
      data => {
        this.fireChange = data;
        if(data){
          console.log(`?????????????<-------------------- odpala --------------------------->????????????????????????`)
          this._changeDetector.markForCheck();
        }
      }
    )
  }

  drawPieChart(){
    if(this.day){
      let day = this.day;
      let trainingColor: string[] = [];
      
      day.forEach(
        ass => trainingColor.push(ass.tile_color)
      )
  
      let pieSlices: Slice[] = []
      if(trainingColor.length <= 6) {
        for (let i = 0; i < trainingColor.length; i++) {
          let slice: Slice = {
            'offset' : ((50 + (50/6) + (i * (50 / 3)))/100)*360,
            'value' : ((50 / 3)/100)*360,
            'bg' : trainingColor[i]
          }
          pieSlices.push(slice)
        }
      } else {
        for (let i = 0; i < trainingColor.length; i++) {
          let slice: Slice = {
            'offset' : (50 + (50/6) + (i * (100 / trainingColor.length)/100))*360,
            'value' : ((100 / trainingColor.length)/100)*360,
            'bg' : trainingColor[i]
          }
          pieSlices.push(slice)
        }
      }
      this.pieSlices = pieSlices;
    }
  }

  ngOnDestroy(){
    this.calendarArraySub.unsubscribe();
    this.openedDaySub.unsubscribe();
    this.fireChangeSub.unsubscribe();
    this.calendarArray = null;
  }

  

}
export interface Slice {
  offset?: number,
  value: number,
  bg: string
}

export interface ChartData {
  data?: Object,
  colors: string[],
  hasData?: boolean,
}