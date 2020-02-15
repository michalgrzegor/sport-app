import { CallendarArray, CallendarDataService, WeekDate } from './callendar-data.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducers';
import * as TilesActions from './store/tiles-data.actions';
import * as TilesDataActions from './store/tiles-data.actions';
import * as CallendarDataActions from './store/callendar-data.actions';
import * as ChartDataActions from './store/chart-data.actions';

import { CookieService } from 'ngx-cookie-service';
import { TrainingPlan, Association } from './store/tiles-data.reducers';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HttpCalendarClientService {

  url: string = 'https://gremmo-one.herokuapp.com/api/v1/';
  
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



  constructor(
    private _http: HttpClient,
    private _store: Store<fromApp.AppState>,
    private _cookieService: CookieService,
    private _calendarService: CallendarDataService
  ) { };

  makeWeek(openDayDate: string, tp: TrainingPlan){
    // console.log(`make week from http client`)
    // const callendarArray: CallendarArray = this._calendarService.makeArray(tp);
    // const assoArray = [];
    // callendarArray.calendar[callendarIndex].weeks[weeksIndex].weekDates.forEach(
    //   week => {
    //     if(week.association){
    //       week.association.forEach(
    //         asso => assoArray.push(asso)
    //       )
    //     }
    //   }
    // );
    // this._store.dispatch(new TilesDataActions.MakeWeek(assoArray));
    const firstDay = moment(openDayDate).weekday(0);
    const lastDay = moment(openDayDate).weekday(6);
    const assoArray = [];
    tp.calendar_assocs.forEach(
      asso => {
        if(moment(asso.calendar_date).isBetween(firstDay,lastDay) || moment(asso.calendar_date).format() === firstDay.format() || moment(asso.calendar_date).format() === lastDay.format()){
          assoArray.push(asso);
        }
      }
    );
    console.log(assoArray)
    this._store.dispatch(new TilesDataActions.MakeWeek(assoArray));
  }

  makeClendarArray(tp: TrainingPlan, calendarArray){
    console.log(`make calendar array`,calendarArray)
    this._store.dispatch(new CallendarDataActions.InitDataNoItteration({calendar: calendarArray, planName: tp.training_plan_name}))
    this._store.dispatch(new TilesDataActions.SetTrainingPlan(tp));
  }

  // makeClendarArray(tp: TrainingPlan){
  //   const calendarArray = this._calendarService.makeArray(tp);
  //   this._store.dispatch(new CallendarDataActions.InitData({calendar: calendarArray, planName: tp.training_plan_name}))
  //   this._store.dispatch(new TilesDataActions.SetTrainingPlan(tp));
  // }

  //REQUESTS
  //MASS Create Asso

  pasteAsso(tp_id: number, associations: Association[], tp: TrainingPlan, callendarIndex: number, weeksIndex: number, day, array: CallendarArray, callendarWeek: WeekDate[]){
    const assocs = {
      calendar_assocs: associations
    };
    this._store.dispatch(new ChartDataActions.SetTP(tp));
    this._store.dispatch(new TilesDataActions.MakeDay({date: day.momentDate, day: day}));
    if(assocs && assocs.calendar_assocs && assocs.calendar_assocs.length > 0){
      this._store.dispatch(new CallendarDataActions.SetDaysToChange([assocs.calendar_assocs[0].calendar_date]))
    }
    this.makeClendarArray(tp,array);
    this.makeWeek(day.momentDate,tp);

    this._store.dispatch(new CallendarDataActions.PasteAssoEffect({tp_id: tp_id, assocs: assocs}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.post(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_create`, assocs, this.getHttpOptions()).subscribe(
    //   (response: Association[]) => {
    //     console.log(response);
    //   }
    // )
  }

  repeatWeaklyAsso(tp_id: number, associations: Association[], calendar: CallendarArray, tp: TrainingPlan, isOpenedDay: boolean, callendarIndex: number, weeksIndex: number, openedDayDate: string, arrayt: CallendarArray, callendarWeek: WeekDate[]){
    const assocs = {
      calendar_assocs: associations
    };
    let array = [];
    if(assocs){
      assocs.calendar_assocs.forEach(asso => {array.push(asso.calendar_date);});
      array = _.uniq(array)
    }
    const trP = Object.assign({}, tp);
    associations.forEach(asso=>trP.calendar_assocs.push(asso));
    this._store.dispatch(new ChartDataActions.SetTP(trP));
    this._store.dispatch(new CallendarDataActions.SetDaysToChange(array))
    this.makeClendarArray(tp,arrayt);
    if(isOpenedDay){
      this.makeWeek(openedDayDate,tp);
    }

    this._store.dispatch(new CallendarDataActions.RWAEffect({tp_id: tp_id, assocs: assocs, tp: trP}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.post(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_create`, assocs, this.getHttpOptions()).subscribe(
    //   (response: Association[]) => {
    //     console.log(response);
    //     // const trP = Object.assign({}, tp);
    //     // response.forEach(asso=>trP.calendar_assocs.push(asso));
    //     // this._store.dispatch(new ChartDataActions.SetTP(trP));
    //     // this._store.dispatch(new CallendarDataActions.SetDaysToChange(array))
    //     // this.makeClendarArray(trP);
    //     // if(isOpenedDay){
    //     //   this.makeWeek(callendarIndex,weeksIndex,trP);
    //     // }
    //   }
    // )
  }

  repeatDailyAsso(tp_id: number, associations: Association[], calendar: CallendarArray, tp: TrainingPlan, isOpenedDay: boolean, callendarIndex: number, weeksIndex: number, openedDayDate: string, arrayt: CallendarArray, callendarWeek: WeekDate[]){
    const assocs = {
      calendar_assocs: associations
    };
    let array = [];
    if(assocs){
      assocs.calendar_assocs.forEach(asso => {array.push(asso.calendar_date);});
      array = _.uniq(array)
    }
    const trP = Object.assign({}, tp);
    associations.forEach(asso=>trP.calendar_assocs.push(asso));
    this._store.dispatch(new ChartDataActions.SetTP(trP));
    this._store.dispatch(new CallendarDataActions.SetDaysToChange(array))
    this.makeClendarArray(tp,arrayt);
    if(isOpenedDay){
      this.makeWeek(openedDayDate,tp);
    }

    this._store.dispatch(new CallendarDataActions.RDAEffect({tp_id: tp_id, assocs: assocs, tp: trP}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.post(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_create`, assocs, this.getHttpOptions()).subscribe(
    //   (response: Association[]) => {
    //     console.log(response);
    //     // const trP = Object.assign({}, tp);
    //     // response.forEach(asso=>trP.calendar_assocs.push(asso));
    //     // this._store.dispatch(new ChartDataActions.SetTP(trP));
    //     // this._store.dispatch(new CallendarDataActions.SetDaysToChange(array))
    //     // this.makeClendarArray(trP);
    //     // if(isOpenedDay){
    //     //   this.makeWeek(callendarIndex,weeksIndex,trP);
    //     // }
    //   }
    //   )
    }
    
  repeatWeaklyDayAsso(tp_id: number, associations: Association[], calendar: CallendarArray, tp: TrainingPlan, isOpenedDay: boolean, callendarIndex: number, weeksIndex: number, openedDayDate: string, arrayt: CallendarArray, callendarWeek: WeekDate[]){
    const assocs = {
      calendar_assocs: associations
    };
    let array = [];
    if(assocs){
      assocs.calendar_assocs.forEach(asso => {array.push(asso.calendar_date);});
      array = _.uniq(array)
    }
    const trP = Object.assign({}, tp);
    associations.forEach(asso=>trP.calendar_assocs.push(asso));
    this._store.dispatch(new ChartDataActions.SetTP(trP));
    this._store.dispatch(new CallendarDataActions.SetDaysToChange(array))
    this.makeClendarArray(tp,arrayt);
    if(isOpenedDay){
      this.makeWeek(openedDayDate,tp);
    }

    this._store.dispatch(new CallendarDataActions.RWDAEffect({tp_id: tp_id, assocs: assocs, tp: trP}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.post(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_create`, assocs, this.getHttpOptions()).subscribe(
    //   (response: Association[]) => {
    //     console.log(response);
    //   }
    // )
  }

  repeatDailyDayAsso(tp_id: number, associations: Association[], calendar: CallendarArray, tp: TrainingPlan, isOpenedDay: boolean, callendarIndex: number, weeksIndex: number, openedDayDate: string, arrayt: CallendarArray, callendarWeek: WeekDate[]){
    console.log(associations)
    const assocs = {
      calendar_assocs: associations
    };
    let array = [];
    if(assocs){
      assocs.calendar_assocs.forEach(asso => {array.push(asso.calendar_date);});
      array = _.uniq(array)
    }
    const trP = Object.assign({}, tp);
    associations.forEach(asso=>trP.calendar_assocs.push(asso));
    this._store.dispatch(new ChartDataActions.SetTP(trP));
    this._store.dispatch(new CallendarDataActions.SetDaysToChange(array));
    // this.makeClendarArray(tp,arrayt);
    if(isOpenedDay){
      this.makeWeek(openedDayDate,tp);
    }

    this._store.dispatch(new CallendarDataActions.RDDAEffect({tp_id: tp_id, assocs: assocs, tp: trP}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.post(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_create`, assocs, this.getHttpOptions()).subscribe(
    //   (response: Association[]) => {
    //     console.log(response);
    //   }
    // )
  }

  //MASS DELETE DAY

  deleteDay(tp_id: number, associations: Association[], callendarIndex:number, weeksIndex:number, weekDatesIndex:number, day, tp: TrainingPlan, calendar: CallendarArray, array: string[], callendarWeek: WeekDate[]){
    const idArray = [];
    associations.forEach(
      asso => {
        idArray.push(asso.id);
      }
    )
    const assocs = {
      calendar_assocs: idArray
    };
    day.association = [];
    this._store.dispatch(new TilesDataActions.MakeDay({date: day.momentDate, day: day}));
    if(assocs){
      this._store.dispatch(new CallendarDataActions.SetDaysToChange([day.momentDate]))
    }
    this.makeClendarArray(tp,calendar);
    this.makeWeek(day.momentDate,tp);


    this._store.dispatch(new CallendarDataActions.DeleteAllDayEffect({tp_id: tp_id, assocs: assocs}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.patch(`${this.url}training_plans/${tp_id}/calendar_assocs_mass_destroy`, assocs, this.getHttpOptions()).subscribe(
    //   response => {
    //     console.log(response);
    //   }
    // )
  }

   //CALENDAR ASOCSY
  //post assocc

  postCalendarAssoc(
    training_plan: TrainingPlan,
    training_plan_id: number, 
    calendar_assoc: Association, 
    callendarIndex: number, 
    weeksIndex: number, 
    weekDatesIndex: number, 
    newOrder: any,
    sessionNumber: number,
    varTwo: any,
    temporary_id: number,
    isOpenedDay: boolean,
    openedDayDate: string,
    callendarWeek: WeekDate[]
    ){

      const asso: Association = Object.assign({}, calendar_assoc);
      asso.asso_temporary_id = temporary_id;
      this._store.dispatch(new CallendarDataActions.AddAsso({callendarIndex: callendarIndex, weeksIndex: weeksIndex, weekDatesIndex: weekDatesIndex, associations: asso, newOrder: newOrder, sessionNumber: sessionNumber}));
      
      const tp = Object.assign({}, training_plan);
      tp.calendar_assocs.push(asso);
      this._store.dispatch(new ChartDataActions.SetTP(tp));
      this._store.dispatch(new CallendarDataActions.SetDaysToChange([calendar_assoc.calendar_date]));

      console.log(`post htp client: `, isOpenedDay, openedDayDate)
      
      if(isOpenedDay){
        this._store.dispatch(new TilesActions.MakeDay(varTwo));
        this.makeWeek(openedDayDate,tp);
      }

      this._store.dispatch(new CallendarDataActions.PCAEffect({tp_id: training_plan_id, assocs: calendar_assoc, tp: tp}));

      const cal = [];
      callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
      this._store.dispatch(new CallendarDataActions.SetWeek(cal));
      // this._http.post(`${this.url}training_plans/${training_plan_id}/calendar_assocs`, calendar_assoc, this.getHttpOptions()).subscribe(
      //   (response: any) => {
      //     console.log(response);

      //   }
      // )
  }

  deleteCalendarAssoc(
    training_plan: TrainingPlan,
    training_plan_id: number, 
    asso_id: number,
    callendarIndex: number,
    weeksIndex: number,
    weekDatesIndex: number,
    tempId: number,
    date: string,
    day: any,
    callendarWeek: WeekDate[]
  ){

    this._store.dispatch(new CallendarDataActions.DeleteAsso({callendarIndex: callendarIndex, weeksIndex: weeksIndex, weekDatesIndex: weekDatesIndex, tempId: tempId}));
    this._store.dispatch(new TilesDataActions.MakeDay({date: date, day: day}));
    let tp = Object.assign({}, training_plan);
    tp.calendar_assocs.forEach(
      (asso, index) => {
        if(asso.id === asso_id){
          tp.calendar_assocs.splice(index,1);
        }
      }
    )
    this._store.dispatch(new ChartDataActions.SetTP(tp));
    this._store.dispatch(new CallendarDataActions.SetDaysToChange([date]));
    this.makeWeek(day.momentDate,tp);


    this._store.dispatch(new CallendarDataActions.DeleteDayEffect({training_plan_id: training_plan_id, asso_id: asso_id}));
    const cal = [];
    callendarWeek.forEach(c=>cal.push(Object.assign({},c)));
    cal.forEach((c:WeekDate)=>c.association.forEach((a,index)=>{if(a.id===asso_id){c.association.splice(index,1)}}))
    this._store.dispatch(new CallendarDataActions.SetWeek(cal));
    // this._http.delete(`${this.url}training_plans/${training_plan_id}/calendar_assocs/${asso_id}`, this.getHttpOptions()).subscribe(
    //   response => {
    //     console.log(response);
    //   }
    // )
  }

  patchCalendarAssoc(
    training_plan_id: number, 
    asso_id: number, 
    calendar_asso: Association,
    callendarIndex: number,
    weeksIndex: number,
    weekDatesIndex: number,
    tempId: number,
    sessionNumber: number
  ){
    this._store.dispatch(new CallendarDataActions.ChangeSession({callendarIndex: callendarIndex, weeksIndex: weeksIndex, weekDatesIndex: weekDatesIndex, tempId: tempId, sessionNumber: sessionNumber}));
    this._http.patch(`${this.url}training_plans/${training_plan_id}/calendar_assocs/${asso_id}`, calendar_asso, this.getHttpOptions()).subscribe(
      response => {
        console.log(response);
      }
    )
  }

  makeNewOrderAssoc(
    training_plan_id: number,
    new_order_array: {}
  ){
    console.log(`to z http client: `,new_order_array, training_plan_id)
    this._http.post(`${this.url}/training_plans/${training_plan_id}/mass_index_update`, new_order_array, this.getHttpOptions()).subscribe(
      response => {
        console.log(response);
      }
    )
  }
}