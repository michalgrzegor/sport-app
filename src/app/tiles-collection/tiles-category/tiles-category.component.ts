import { Tag, TrainingType } from './../../tile-editor/tile-editor.component';
import { DataService } from 'src/app/shared/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as TilesActions from '../../shared/store/tiles-data.actions';


@Component({
  selector: 'app-tiles-category',
  templateUrl: './tiles-category.component.html',
  styleUrls: ['./tiles-category.component.scss'],
  animations: [
    trigger('hideShow', [
      state('show', style({height: '235px'})),
      state('hide', style({height: '0px'})),
      transition('show => hide', animate('0.2s ease-in')),
      transition('hide => show', animate('0.2s ease-out'))
    ]),
    trigger('fade', [
      transition('* => void', [style({opacity: 1}), animate('0.2s ease-in')])
    ]),
    trigger('rotate', [
      state('show', style({transform: 'rotate(0deg)'})),
      state('hide', style({transform: 'rotate(180deg)'})),
      transition('show => hide', animate('0.3s ease-in')),
      transition('hide => show', animate('0.3s ease-out'))
    ])],
})
export class TilesCategoryComponent implements OnInit, OnDestroy {
  //animation
  get typeOptions() {
    return this.typeClose ? 'show' : 'hide'
  }
  get tagsOptions() {
    return this.tagsClose ? 'show' : 'hide'
  }

  typeClose: boolean = true;
  tagsClose: boolean = true;

  
  tagsState: Observable<Tag[]>;
  tagsSub: Subscription;
  tags: Tag[] = null;
  
  previousIndex: number = null;

  trainingTypes: TrainingType[] = [];
  previousTypeIndex: number = null;

  constructor(
    private _data: DataService,
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this._store.dispatch(new TilesActions.FetchTags());
    this.tagsState = this._store.select(state => state.tiles.tags);
    this.tagsSub = this.tagsState.subscribe(
      data => {
        if(data){
          if(data.length > 0){
            const array = [...data];
            array.forEach(
              tag => tag.selected = false
            );
            this.tags = array;
          }
        }
      }
    );
    
    this.trainingTypes = this.getTrainngTypes()
  }

  openType(){
    this.typeClose = !this.typeClose
  }

  openTags(){
    this.tagsClose = !this.tagsClose
  }

  getTrainngTypes(): TrainingType[] {
    const trainingType: TrainingType[] = [];
    this._data.gettrainingTypes().forEach(
      type => {
        if(type.name !== 'add'){
          trainingType.push(Object.assign({}, type))
        }
      }
    );
    return trainingType;
  }

  onSelectType(index: number){
    if(this.previousTypeIndex === null){
      this.trainingTypes[index].selected = !this.trainingTypes[index].selected;
      this._store.dispatch(new TilesActions.TypeSearch(this.trainingTypes[index].name));
      this.previousTypeIndex = index;
    }else if(this.previousTypeIndex !== index){
      this.trainingTypes[index].selected = !this.trainingTypes[index].selected;
      this.trainingTypes[this.previousTypeIndex].selected = false;
      this._store.dispatch(new TilesActions.TypeSearch(this.trainingTypes[index].name));
      this.previousTypeIndex = index;
    }else{
      this._store.dispatch(new TilesActions.TypeSearch(''));
      this.trainingTypes[index].selected = !this.trainingTypes[index].selected;
      this.previousTypeIndex = null;
    }    
  }

  onTagSelect(index: number){
    if(this.previousIndex === null){
      this.tags[index].selected = !this.tags[index].selected;
      this._store.dispatch(new TilesActions.TagsSearch(this.tags[index].tag_name))
      this.previousIndex = index;     
    }else if(this.previousIndex !== index){
      this.tags[index].selected = !this.tags[index].selected;
      this.tags[this.previousIndex].selected = false;
      this._store.dispatch(new TilesActions.TagsSearch(this.tags[index].tag_name))
      this.previousIndex = index;      
    }else{
      this._store.dispatch(new TilesActions.TagsSearch(''))
      this.tags[index].selected = !this.tags[index].selected;
      this.previousIndex = null;
    }
  };

  ngOnDestroy(){
    this.tagsSub.unsubscribe();
  }

}
