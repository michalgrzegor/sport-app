import { Injectable, OnInit } from '@angular/core';

import * as moment from 'moment';
import * as _ from 'lodash';
import { TrainingPlan, Association } from './store/tiles-data.reducers';

@Injectable({
  providedIn: 'root'
})
export class CalendarDataService implements OnInit {
  localeString: string = 'en';
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: any[] = [];
  trainingPlanMonths: [] = [];
  daysWithTiles: string[];

  expandedTrue: boolean = false;
  numFirst: number;
  numDay: number;

  assoArray = [];
  dateArray = [];

  constructor() { }

  ngOnInit() {
    // moment.locale(this.localeString);
    // this.navDate = moment();
  }

  makeArray(tp: TrainingPlan): CalendarArray {
    moment.locale(this.localeString);
    this.navDate = moment();
    const dateFrom = moment(tp.date_from);
    const dateTo = moment(tp.date_to);

    //making assocs array and date array
    this.assoArray = [];
    this.dateArray = [];
    tp.calendar_assocs.forEach(
      asso => {
        this.dateArray.push(asso.calendar_date)
      }
    );
    this.dateArray = _.uniq(this.dateArray);
    this.dateArray.forEach(
      (date,index) => {
        this.assoArray.push(
          {
            momentDate: date,
            array: []
          }
        );
        tp.calendar_assocs.forEach(
          asso => {
            if(asso.calendar_date===date){
              this.assoArray[index].array.push(asso);
            }
          }
        )
      }
    );

    
    let months = moment.duration(dateTo.diff(dateFrom)).asMonths();

    if(dateFrom.date() === dateTo.date()){
      months = months + 1;
    };
    
    if(Number(dateFrom.date()) > Number(dateTo.date())){
      months = months + 1;
    };
    
    
    let dateStart = moment(tp.date_from);

    let calendarArray: CalendarArray = {
      calendar : []
    }
    for (let i = 0; i <= months; i++) {
      calendarArray.calendar.push(this.makeMonthArray(dateStart, tp));
      dateStart.add(1, 'month');
    }
    calendarArray.id = tp.id;
    return calendarArray;
  }

  makeMonthArray(date: moment.Moment, tp: TrainingPlan): MonthArray {
    let monthArray: MonthArray = {
      monthName: null,
      weekDays: [],
      weeks: []
    };

    //monthName work
    let monthName: MonthName = {monthDate: null};
    monthName.monthDate = moment(date).format();
    monthArray.monthName = monthName;

    //sun, mon, etc - working!
    const numberArray: number[] = [0, 1, 2, 3, 4, 5, 6];
    let weekdays = [];
    numberArray.forEach(day => {
      let dayName: DayName = {dayOfTheWeek: null};
      dayName.dayOfTheWeek = moment().weekday(day).format('ddd');
      weekdays.push(dayName);
    })
    monthArray.weekDays = weekdays;

    //making array of calendar day date
    let gridArr = [];

    const firstDayDate: moment.Moment = moment(date).startOf('month');
    const initialEmptyCells: number = firstDayDate.weekday();
    const daysInMonth: number = date.daysInMonth();
    let arrayLength: number = 42;


    let referenceDay: moment.Moment = moment(date).startOf('month');
    let referenceDayBefore: moment.Moment = moment(date).subtract(1, 'month').endOf('month').subtract(initialEmptyCells - 1, 'days');
    let referenceDayAfter: moment.Moment = moment(date).add(1, 'month').startOf('month');


    for(let i = 0; i < arrayLength; i++) {
      let obj: WeekDate = {
        available: false,
        expanded: false,
        hasData: false,
        momentDate: null,
        value: null,
        association: null,
        star: null
      };
      if(i < initialEmptyCells) {
        obj.value = referenceDayBefore.date();
        obj.available = false;
        obj.momentDate = referenceDayBefore.format();
        obj.hasData = this.hasData(referenceDayBefore);
        obj.expanded = true;
        referenceDayBefore.add(1, 'day');
      } else if ( i > initialEmptyCells + daysInMonth -1) {
        obj.value = referenceDayAfter.date();
        obj.available = false;
        obj.momentDate = referenceDayAfter.format();
        obj.hasData = this.hasData(referenceDayAfter);
        obj.expanded = true;
        referenceDayAfter.add(1, 'day');
      } else {
        obj.value = referenceDay.date();
        obj.available = true;
        obj.momentDate = referenceDay.format();
        obj.hasData = this.hasData(referenceDay);
        obj.expanded = true;
        // obj.association = tp.calendar_assocs.filter(
        //   ass => {
        //     return (moment(ass.calendar_date).format() === referenceDay.format())
        //     }
        // );
        obj.association = this.makeAssoDay(referenceDay.format())
        referenceDay.add(1, 'day');
      }
      gridArr.push(Object.assign({},obj));
    }
    //add container object
    for( let i = 0; i < arrayLength; i = i + 7 ){
      let weekDates: WeekDates = {
        weekDates: [],
        container: []
      }
      let container: Container = {container: true, expanded: false};
      weekDates.weekDates = gridArr.slice(i, i + 7);
      weekDates.container.push(container);
      monthArray.weeks.push(weekDates);
    }
    return monthArray;
  }
  
  hasData(date: moment.Moment): boolean{
    return _.includes(this.daysWithTiles, moment(date).format())
  }
  
  makeAssoDay(date: string){
    const array = [];
    if(this.dateArray.indexOf(date)>-1){
      this.assoArray[this.dateArray.indexOf(date)].array.forEach(
        asso => array.push(Object.assign({},asso))
      )
    }
    return array
  }

  
}

//interfaces of objects from calendar
export interface Container {
  container: boolean;
  expanded: boolean;
}

export interface WeekDate {
  available: boolean;
  expanded: boolean;
  hasData: boolean;
  momentDate: string;
  value: number;
  association: Association[];
  star: string
}

export interface MonthName {
  monthDate: string;
}

export interface DayName {
  dayOfTheWeek: string;
}

//interfaces of arrays from calendar


export interface WeekDates {
  weekDates: WeekDate[];
  container: Container[];
}

//interface of the month of the calendar

export interface MonthArray {
  monthName: MonthName;
  weekDays: DayName[];
  weeks: WeekDates[];
}

//interface of the calendar

export interface CalendarArray {
  calendar: MonthArray[];
  id?: number;
}