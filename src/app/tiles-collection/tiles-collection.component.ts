import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { Observable, Subscription } from 'rxjs';

import * as fromApp from '../shared/store/app.reducers';
import * as TilesActions from '../shared/store/tiles-data.actions';
import * as fromTilesData from '../shared/store/tiles-data.reducers'
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';
import * as _ from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tiles-collection',
  templateUrl: './tiles-collection.component.html',
  styleUrls: ['./tiles-collection.component.css']
})
export class TilesCollectionComponent implements OnInit, OnDestroy {
  tileAllAttrState: Observable<fromTilesData.State>;
  tileAllAttrSub: Subscription;
  tileAllAttr = null;
  tiles: Tile[] = [];

  isCategoryModeState: Observable<boolean>;
  isCategoryModeSub: Subscription;
  isCategoryMode: boolean = false;

  allMomentDateArrayState: Observable<string[]>;
  allMomentDateArraySub: Subscription;
  allMomentDateArray: string[] = null;

  mainRouteState: Observable<string>;
  mainRouteSub: Subscription;
  mainRoute: string = null;

  isSearchModeState: Observable<boolean>;
  isSearchModeSub: Subscription;
  isSearchMode: boolean = false;
  subsData: Subscription;

  idArrayCDK = ['session-1', 'session-2', 'session-3', 'session-4', 'session-5', 'session-6'];

   //responsive variables
   isHandset: boolean;
   isTablet: boolean;
   isWeb: boolean;
  isTabletLand: boolean;

  constructor( 
    private _store: Store<fromApp.AppState>,
    private _router: Router,
    public _breakpointObserver: BreakpointObserver
     ) { }

  ngOnInit() {
    this._breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = true;
        this.isTablet = false;
        this.isTabletLand = false;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Tablet])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = true;
        this.isTabletLand = false;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Web])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = false;
        this.isTabletLand = false;
        this.isWeb = true;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.TabletLandscape])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = false;
        this.isTabletLand = true;
        this.isWeb = false;
      } else {
      }
    });

    
    this._store.dispatch(new TilesActions.FetchTiles());
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
            filter(tile => _.includes(this.getTagsName(tile), data.tagName) || data.tagName === '')
          )
          const arr = [];
          this.subsData = pipeData.subscribe(data => {
            arr.push(data);
            this.tiles = arr;
          })
        }
      }

    )

    this.isCategoryModeState = this._store.select(state => state.tiles.isCategoryMode);
    this.isCategoryModeSub = this.isCategoryModeState.subscribe(
      data => this.isCategoryMode = data
    )

    this.mainRouteState = this._store.select(state => state.tiles.mainRoute);
    this.mainRouteSub = this.mainRouteState.subscribe(
      data => this.mainRoute = data
    )

    this.allMomentDateArrayState = this._store.select(state => state.callendar.allMomentDateArray);
    this.allMomentDateArraySub = this.allMomentDateArrayState.subscribe(
      data =>{
        if(data){
          this.allMomentDateArray = data
          this.idArrayCDK = this.idArrayCDK.concat(this.allMomentDateArray);
        }
      }
    )

    this.isSearchModeState = this._store.select(state => state.tiles.isSearchMode);
    this.isSearchModeSub = this.isSearchModeState.subscribe(
      data => this.isSearchMode = data
    )
  }

  drop(event: CdkDragDrop<Tile[]>){
    moveItemInArray(this.tiles, event.previousIndex, event.currentIndex)
  }

  getTagsName(tile: Tile): string[] {
    const array = [];
    if(tile.tile_tags && tile.tile_tags.length > 0){
      tile.tile_tags.forEach(
        tag => array.push(tag.tag_name)
      );
    }
    return array
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

  toTileEditor(){
    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], { queryParams: { 'right': 'tileeditor' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tileeditor']);
      this._store.dispatch(new TilesActions.SeteMainRoute('tileeditor'))
    }
  }

  ngOnDestroy() {
    this.tileAllAttrSub.unsubscribe();
    this.isCategoryModeSub.unsubscribe();
    this.isSearchModeSub.unsubscribe();
    this.allMomentDateArraySub.unsubscribe();
    this.mainRouteSub.unsubscribe();
    this._store.dispatch(new TilesActions.EnterTilesCollectionMode(false));
  }
}