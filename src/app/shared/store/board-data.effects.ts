import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as BoardDataActions from './board-data.actions'
import { switchMap, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class BoardDataEffects {
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
    };

    getTPID(){
        const id = JSON.parse(this._cookieService.get('profile'))['https://sport.app.comuser_metadata'].training_plan_last_id;
        return id;        
    }

    @Effect()
    tilesSet = this.actions$
        .pipe(
            ofType(BoardDataActions.FETCH_BOARD),
            switchMap(() => {
                return this._httpClient.get(`${this.url}user_board_notes`, this.getHttpOptions());
            }),
            map((boardNotes) => {
                return {
                    type: BoardDataActions.SET_BOARD,
                    payload: boardNotes
                }
            })
        )

    @Effect()
    boardSetFromPlatform = this.actions$
        .pipe(
            ofType(BoardDataActions.FETCH_BOARD_FROM_PLATFORM),
            switchMap(() => {
                return this._httpClient.get(`${this.url}platform_training_plan_board_notes`, this.getHttpOptions());
            }),
            map((boardNotes) => {
                return {
                    type: BoardDataActions.SET_BOARD,
                    payload: boardNotes
                }
            })
        )

    @Effect()
    tilesTpSet = this.actions$
        .pipe(
            ofType(BoardDataActions.FETCH_TRAINING_BOARD),
            switchMap(() => {
                return this._httpClient.get(`${this.url}training_plans/${this.getTPID()}/training_plan_board_notes`, this.getHttpOptions());
            }),
            map((boardNotes) => {
                return {
                    type: BoardDataActions.SET_BOARD,
                    payload: boardNotes
                }
            })
        )

    constructor(
        private actions$: Actions,
        private _httpClient: HttpClient,
        private _cookieService: CookieService
    ){}
}