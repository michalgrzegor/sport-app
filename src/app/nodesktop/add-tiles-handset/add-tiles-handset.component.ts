import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { Subscription, Observable } from 'rxjs';

import * as fromTilesData from '../../shared/store/tiles-data.reducers';
import * as TilesActions from '../../shared/store/tiles-data.actions';
import * as fromApp from '../../shared/store/app.reducers';
import { Store } from '@ngrx/store';

import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-tiles-handset',
  templateUrl: './add-tiles-handset.component.html',
  styleUrls: ['./add-tiles-handset.component.css']
})
export class AddTilesHandsetComponent implements OnInit, OnDestroy {
  tileAllAttrState: Observable<fromTilesData.State>;
  tileAllAttrSub: Subscription;
  tileAllAttr = null;
  tiles: any[] = [];
  
  isCategoryModeState: Observable<boolean>;
  isCategoryModeSub: Subscription;
  isCategoryMode: boolean = false;

  isSearchModeState: Observable<boolean>;
  isSearchModeSub: Subscription;
  isSearchMode: boolean = false;
  subsData: Subscription;
  tileToAdd: any;

  constructor(
    private _store: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<AddTilesHandsetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tile
  ) { }

  ngOnInit() {
    this._store.dispatch(new TilesActions.EnterTilesCollectionMode(true));

    this.tileAllAttrState = this._store.select(state => state.tiles);
    this.tileAllAttrSub = this.tileAllAttrState.subscribe(
      data => {
        if(this.subsData){
          this.subsData.unsubscribe();
        }
        if(data.tiles){
          this.tiles = [];
          const obsFrom = from(data.tiles);
          const pipeData = obsFrom.pipe(
            filter(tile => tile.tile_title.toLowerCase().includes(data.wordName.toLowerCase())),
            filter(tile => tile.tile_type_name === data.typeName || data.typeName === ''),
            filter(tile => _.includes(tile.tile_tags, data.tagName) || data.tagName === '')
          )
          const arr = [];
          this.subsData = pipeData.subscribe(data => {
            arr.push(data);
            arr.forEach(
              tile => tile.opacity = true
            )
            this.tiles = arr;
          })
        }
      }

    )
    this.isCategoryModeState = this._store.select(state => state.tiles.isCategoryMode);
    this.isCategoryModeSub = this.isCategoryModeState.subscribe(
      data => this.isCategoryMode = data
    )

    this.isSearchModeState = this._store.select(state => state.tiles.isSearchMode);
    this.isSearchModeSub = this.isSearchModeState.subscribe(
      data => this.isSearchMode = data
    )
  }

  enterCategoryMode(){
    if(this.isCategoryMode){
      this._store.dispatch(new TilesActions.TypeSearch(''));
      this._store.dispatch(new TilesActions.TagsSearch(''));
    }
    this._store.dispatch(new TilesActions.EnterCategoryMode())
    window.scrollTo(0, 0)
  }

  toggleFilter(){
    this._store.dispatch(new TilesActions.FilterModeSwitch())
  }

  enterSearchMode(){
    if(this.isSearchMode){
      this._store.dispatch(new TilesActions.SearchWord(''));
    }
    this._store.dispatch(new TilesActions.EnterSearchMode())
  }

  add(index: number){
    this.tiles.forEach(
      tile => tile.opacity = false
    );
    this.tiles[index].opacity = true;

    this.tileToAdd = Object.assign({}, this.tiles[index]);
    delete this.tileToAdd.opacity;

    this.data = this.tileToAdd;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.tileAllAttrSub.unsubscribe()
    this.isCategoryModeSub.unsubscribe()
    this.isSearchModeSub.unsubscribe()
  }
}
