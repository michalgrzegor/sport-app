
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as TilesActions from './tiles-data.actions';
import * as ChartDataActions from './chart-data.actions';
import { switchMap, map, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import * as fromApp from './app.reducers';

@Injectable()
export class TilesDataEffects {
    // url: string = 'https://gremo-one-test.herokuapp.com/api/v1/';
    url: string = 'https://gremmo-one.herokuapp.com/api/v1/';

    constructor(
        private _store: Store<fromApp.AppState>,
        private actions$: Actions,
        private _httpClient: HttpClient,
        private _cookieService: CookieService
    ){}
    

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

    getTPID(){
        const id = JSON.parse(this._cookieService.get('profile'))['https://gremo.sport.comuser_metadata'].training_plan_last_id;
        return id;        
    }

    setTPtoTiles(tp){
        console.log(tp)
        return this._store.dispatch(new TilesActions.SetTrainingPlan(tp))
    }

    setTPtoChart(tp){
        console.log(tp)
        return this._store.dispatch(new ChartDataActions.SetTP(tp))
    }

    @Effect()
    tilesSet = this.actions$
        .pipe(
            ofType(TilesActions.FETCH_TILES),
            switchMap(() => {
                console.log(`efekt `, this.getHttpOptions())
                return this._httpClient.get(`${this.url}tiles`, this.getHttpOptions());
            }),
            map((tiles) => {
                return {
                    type: TilesActions.SET_TILES,
                    payload: tiles
                }
            })
        )

    @Effect()
    tilesSetFromPlatform = this.actions$
        .pipe(
            ofType(TilesActions.FETCH_TILES_FROM_PLATFORM),
            switchMap(() => {
                
                return this._httpClient.get(`${this.url}platform_training_plan_tiles`, this.getHttpOptions());
            }),
            map((tiles) => {
                return {
                    type: TilesActions.SET_TILES,
                    payload: tiles
                }
            })
        )

    @Effect()
    trainingPlanSet = this.actions$
        .pipe(
            ofType(TilesActions.FETCH_TRAINING_PLAN),
            switchMap(() => {
                console.log(`FETCH_TRAINING_PLAN `)
                return this._httpClient.get(`${this.url}training_plans/${this.getTPID()}`, this.getHttpOptions());
            }),
            switchMap((tp)=>[
                new TilesActions.SetTrainingPlan(tp),
                new ChartDataActions.SetTP(tp)
            ]),
        );

    @Effect()
    tPManagerSet = this.actions$
        .pipe(
            ofType(TilesActions.FETCH_TPMANAGER),
            switchMap(() => {
                return this._httpClient.get(`${this.url}training_plans`, this.getHttpOptions());
            }),
            map((tpInfo) => {
                return {
                    type: TilesActions.SET_TPMANAGER,
                    payload: tpInfo
                }
            })
        );

    @Effect()
    tagsSet = this.actions$
        .pipe(
            ofType(TilesActions.FETCH_TAGS),
            switchMap(() => {
                return this._httpClient.get(`${this.url}tile_tags`, this.getHttpOptions());
            }),
            map((tags) => {
                return {
                    type: TilesActions.SET_TAGS,
                    payload: tags
                }
            })
        );

    
}

