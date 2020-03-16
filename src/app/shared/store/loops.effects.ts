import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as LoopsActions from './loops.actions'
import { switchMap, map, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoopsEffects {
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
            ofType(LoopsActions.FETCH_LOOPS_DATA),
            switchMap(() => {
                return this._httpClient.get(`${this.url}platform_training_plan_question_answer_metadata`, this.getHttpOptions());
            }),
            take(1),
            map((loops) => {
                return {
                    type: LoopsActions.SET_LOOPS_DATA,
                    payload: loops
                }
            })
        )


    constructor(
        private actions$: Actions,
        private _httpClient: HttpClient,
        private _cookieService: CookieService
    ){}
}