import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as TilesActions from '../../shared/store/tiles-data.actions';

@Component({
  selector: 'app-tiles-search',
  templateUrl: './tiles-search.component.html'
})
export class TilesSearchComponent {

  constructor(
    private _store: Store<fromApp.AppState>
  ) { }

  onSearch(searchWord){
    this._store.dispatch(new TilesActions.SearchWord(searchWord))
  }

}
