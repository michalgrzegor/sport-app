import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as ChartDataActions from './chart-data.actions'
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class ChartDataEffects {

    @Effect()
    tilesSet = this.actions$
        .pipe(
            ofType(ChartDataActions.FETCH_CHART_DATA),
            switchMap(() => {
                return this._httpClient.get('./assets/responses.json');
            }),
            map((answers) => {
                return {
                    type: ChartDataActions.SET_CHART_DATA,
                    payload: answers
                }
            })
        )

    constructor(
        private actions$: Actions,
        private _httpClient: HttpClient
    ){}
}