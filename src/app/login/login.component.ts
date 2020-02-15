import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApp from '../shared/store/app.reducers';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthState: Observable<boolean>;
  isAuthSub: Subscription;
  isAuth: boolean;

  constructor(
    private _router: Router,
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.isAuthState = this._store.select(state => state.tiles.isAuthenticated);
    this.isAuthSub = this.isAuthState.subscribe(
      data => {
        this.isAuth = data;
        if(data){
          this._router.navigate(['/calendar'], { queryParams: { 'right': 'tp' }});
        }
        }
    );
  }

  ngOnDestroy(){
    this.isAuthSub.unsubscribe();
  }

}
