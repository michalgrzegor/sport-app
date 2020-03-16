import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as AthletesDataActions from './athletes-data.actions'
import { switchMap, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AthleteDataEffects {
    url: string = 'https://ccoach-app.herokuapp.com/api/v1/';
    

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

    @Effect()
    athleteSet = this.actions$
        .pipe(
            ofType(AthletesDataActions.FETCH_ATHLETE_DATA),
            switchMap(() => {
                return this._httpClient.get(`${this.url}athlete_platforms`, this.getHttpOptions());
            }),
            map((athlete) => {
                return {
                    type: AthletesDataActions.SET_ATHLETE_DATA,
                    payload: athlete
                }
            })
        )

    @Effect()
    athletesSet = this.actions$
        .pipe(
            ofType(AthletesDataActions.FETCH_ATHLETES_DATA),
            switchMap(() => {
                return this._httpClient.get(`${this.url}athlete_platforms`, this.getHttpOptions());
            }),
            map((athletes) => {
                return {
                    type: AthletesDataActions.SET_ATHLETES_DATA,
                    payload: athletes
                }
            })
        )

    constructor(
        private actions$: Actions,
        private _httpClient: HttpClient,
        private _cookieService: CookieService
    ){}
}