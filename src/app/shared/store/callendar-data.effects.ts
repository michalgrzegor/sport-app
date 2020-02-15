import { Association } from './tiles-data.reducers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as CalendarDataActions from './callendar-data.actions';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY } from 'rxjs';
import { CallendarDataService } from '../callendar-data.service';

@Injectable()
export class CalendarDataEffects {
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

    cons(message){
        console.log(message);
    }

    @Effect()
    deleteAllDayEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.DELETE_ALL_DAY_EFFECT),
            map((action: CalendarDataActions.DeleteAllDayEffect) => action.payload),
            switchMap((payload) => {
                return this._http.patch(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_destroy`, payload.assocs, this.getHttpOptions())
                .pipe(
                    map((response) => new CalendarDataActions.ConsoleLog(response)),
                    catchError(() => EMPTY)
                )
            }),
        )

    @Effect()
    deleteDayEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.DELETE_DAY_EFFECT),
            map((action: CalendarDataActions.DeleteDayEffect) => action.payload),
            switchMap((payload) => {
                return this._http.delete(`${this.url}training_plans/${payload.training_plan_id}/calendar_assocs/${payload.asso_id}`, this.getHttpOptions())
                .pipe(
                    map((response) => new CalendarDataActions.ConsoleLog(response)),
                    catchError(() => EMPTY)
                )
            }),
        )

    @Effect()
    pasteAssoEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.PASTE_ASSO_EFFECT),
            map((action: CalendarDataActions.PasteAssoEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_create`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association[])=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar(response)
                    ]),
                    catchError(() => EMPTY)
                )
            }),
        )

    @Effect()
    RWAEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.RWA_EFFECT),
            map((action: CalendarDataActions.RWAEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_create`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association[])=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar(response)
                    ]),
                    catchError(() => EMPTY)
                )
            })
        )

    @Effect()
    RDAEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.RDA_EFFECT),
            map((action: CalendarDataActions.RDAEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_create`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association[])=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar(response)
                    ]),
                    catchError(() => EMPTY)
                )
            })
        )

    @Effect()
    RWDAEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.RWDA_EFFECT),
            map((action: CalendarDataActions.RWDAEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_create`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association[])=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar(response)
                    ]),
                    catchError(() => EMPTY)
                )
            })
        )

    @Effect()
    RDDAEffect = this.actions$
        .pipe(
            ofType(CalendarDataActions.RDDA_EFFECT),
            map((action: CalendarDataActions.RDDAEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs_mass_create`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association[])=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar(response)
                    ]),
                    catchError(() => EMPTY)
                )
            })
        )

    @Effect()
    PCA_EFFECT = this.actions$
        .pipe(
            ofType(CalendarDataActions.PCA_EFFECT),
            map((action: CalendarDataActions.PCAEffect) => action.payload),
            switchMap((payload) => {
                return this._http.post(`${this.url}training_plans/${payload.tp_id}/calendar_assocs`, payload.assocs, this.getHttpOptions())
                .pipe(
                    switchMap((response: Association)=>[
                        new CalendarDataActions.ConsoleLog(response),
                        new CalendarDataActions.UpdateCalendar([response])
                    ]),
                    catchError(() => EMPTY)
                )
            })
        )

    constructor(
        private actions$: Actions,
        private _http: HttpClient,
        private _cookieService: CookieService,
        private _calendarService: CallendarDataService
    ){}
}