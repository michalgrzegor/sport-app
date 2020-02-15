
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { timer, from } from 'rxjs'
import { concatMap, map } from 'rxjs/operators';

import * as fromApp from './store/app.reducers';
import * as TilesDataActions from './store/tiles-data.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
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
    private _cookieService: CookieService,
    private _store: Store<fromApp.AppState>
  ) { };

  checkIfInGroup(){
    this._http.get(`${this.url}invitation_stream_status`, this.getHttpOptions()).subscribe(
      (response: any) => {
        if(response.permitted){
          this._store.dispatch(new TilesDataActions.SetInGroup(true));
        }
      }
    )
  }

  
  invitationStream$ = this._http.get(`${this.url}athleted_invitations`, this.getHttpOptions());
  invitationsPolling$ =  timer(0, 20000).pipe(
    concatMap(_ => from(this.invitationStream$))
  )
  
  getAcceptInvitation(id){
    const acceptInvitationStream$ = this._http.get(`${this.url}athlete_platforms/${id}/athlete_status`, this.getHttpOptions());
    const acceptInvitationPolling$ =  timer(0, 20000).pipe(
      concatMap(_ => from(acceptInvitationStream$))
    )
    return acceptInvitationPolling$
  }
  

}