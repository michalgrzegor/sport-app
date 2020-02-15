import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducers';
import * as TilesDataActions from './store/tiles-data.actions';

import { BreakpointObserver } from '@angular/cdk/layout';

import { CookieService } from 'ngx-cookie-service';
import { CalendarComment } from './store/tiles-data.reducers';

@Injectable({
  providedIn: 'root'
})
export class HttpCommentClientService {
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
    public _breakpointObserver: BreakpointObserver,
    private _store: Store<fromApp.AppState>,
    private _cookieService: CookieService
  ) { };

  postCommentTrainer(tp_id: number, comment: CalendarComment){
    this._http.post(`${this.url}training_plans/${tp_id}/calendar_comments`, comment, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.AddComment(response));
      }
    )
  }

  postCommentAthlete(comment: CalendarComment){
    this._http.post(`${this.url}platform_training_plan_calendar_comments`, comment, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.AddComment(response));
      }
    )
  }

  patchCommentTrainer(comment_id: number, tp_id: number, comment: CalendarComment){
    this._http.patch(`${this.url}training_plans/${tp_id}/calendar_comments/${comment_id}`, comment, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.EditComment(response));
      }
    )
  }

  patchCommentAthlete(comment_id: number, comment: CalendarComment){
    this._http.patch(`${this.url}platform_training_plan_calendar_comments/${comment_id}`, comment, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.EditComment(response));
      }
    )
  }

  deleteCommentTrainer(comment_id: number, tp_id: number){
    this._http.delete(`${this.url}training_plans/${tp_id}/calendar_comments/${comment_id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.DeleteComment(comment_id));
      }
    )
  }

  deleteCommentAthlete(comment_id: number){
    this._http.delete(`${this.url}platform_training_plan_calendar_comments/${comment_id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.DeleteComment(comment_id));
      }
    )
  }
  
}