import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../shared/store/app.reducers';
import * as TilesActions from '../../shared/store/tiles-data.actions';

@Component({
  selector: 'app-tiles-search',
  templateUrl: './tiles-search.component.html',
  styleUrls: ['./tiles-search.component.css']
})
export class TilesSearchComponent implements OnInit {

  constructor(
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
  }

  onSearch(searchWord){
    this._store.dispatch(new TilesActions.SearchWord(searchWord))
  }

}
