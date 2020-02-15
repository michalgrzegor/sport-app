import { style } from '@angular/animations';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

import * as fromApp from '../../../shared/store/app.reducers';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Tile } from 'src/app/models/tile';
import { WeekDate } from 'src/app/shared/callendar-data.service';

import * as moment from 'moment';

@Component({
  selector: 'app-week-summary',
  templateUrl: './week-summary.component.html',
  styleUrls: ['./week-summary.component.css']
})
export class WeekSummaryComponent implements OnInit, OnDestroy {
  @ViewChild("rectangle") rectangle: ElementRef;
  @Input() dayDateString: string;

  weekState: Observable<WeekDate[]>;
  weekSub: Subscription;
  week: WeekDate[];

  tilesState: Observable<Tile[]>;
  tilesSub: Subscription;
  tiles: Tile[];
  tile: Tile;

  arrayWithTiles: any[];

  preview: boolean = false;

  constructor(
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {

    this.weekState = this._store.select(state => state.callendar.week);
    this.weekSub = this.weekState.subscribe(
      data => {
        this.week = data;
        if(this.tiles && this.week && this.tiles.length>0){
          this.arrayWithTiles = this.makeTilesArray();
        }
      }
    );

    this.tilesState = this._store.select(state => state.tiles.tiles);
    this.tilesSub = this.tilesState.subscribe(
      data => {
        this.tiles = data;
        if(this.tiles && this.week && this.tiles.length>0){
          this.arrayWithTiles = this.makeTilesArray();
        }
      }
    );

  }

  makeTilesArray(){
    const array = [];
    this.week.forEach(
      (day, index) => {
        array.push({
          date: day.momentDate,
          tileArray: [],
          available: day.available
        })
        if(day.association){
          day.association.forEach(
            asso => array[index].tileArray.push(this.tiles.find(tile=>tile.id===asso.tile_id))
          )
        }else{
          day.association = []
        }
      }
    );
    return array
  }

  isOpened(date: string): boolean {
    return moment(this.dayDateString).valueOf()===moment(date).valueOf()
  }

  setStyle(event, tile: Tile){
    this.tile = tile
    this.preview = true;
  }

  setPosition(event){
    this.rectangle.nativeElement.style.top = event.pageY - 56 + 'px'
    this.rectangle.nativeElement.style.left = event.pageX + 'px'
  }

  exitPreview(){
    this.preview = false;
  }

  ngOnDestroy(): void {
    this.weekSub.unsubscribe();
    this.tilesSub.unsubscribe();
  }

}
