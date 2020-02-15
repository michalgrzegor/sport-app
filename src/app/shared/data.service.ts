import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TrainingType, Tag } from '../tile-editor/tile-editor.component';
import { Tile } from '../models/tile';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private httpClient: HttpClient) { }
  
  // tiles collection data
  
  tiles: Tile[] = [];

  getTiles(): Observable<any> {
    return this.httpClient.get('./assets/tiles.json');
  }

  //basic units
  getBasicUnits(){
    return {
      intensityArray: this.intensityArray,
      unitsArray: this.unitsArray,
      energyUnitsArray: this.energyUnitsArray,
      energyUnitsArrayNutrient: this.energyUnitsArrayNutrient
    }
  }
  intensityArray: string[] = ['km/h', 'm/min', 'min/km', 'wat/min', 'min/mile'];
  unitsArray: string[] = ['metres', 'kilometres', 'miles', 'kilograms', 'wats', 'minute', 'second', 'hour'];
  energyUnitsArray: string[] = ['kcal', 'kJ', 'g', 'mg'];
  energyUnitsArrayNutrient: string[] = ['kcal', 'kJ', 'g', 'mg', 'capsules'];

  // newTrainingType: TrainingType;

  trainingTypes: TrainingType[] = [
    // {name: 'add', type: '', color: '#614EA1', selected: false},
    {name: 'training', type: 'training', color: '#FF5D51', selected: false},
    {name: 'diet', type: 'diet', color: '#88C540', selected: false},
    {name: 'note', type: 'motivation', color: '#31C2E1', selected: false},
    {name: 'question', type: 'question', color: '#E8A022', selected: false}
  ];

  trainingTypeSub: Subject<TrainingType[]> = new Subject<TrainingType[]>();
  newTrainingTypeSub: Subject<TrainingType> = new Subject<TrainingType>();
  trainingTypeColorSub: Subject<string> = new Subject<string>();

  getNewTrainingTypeColor(trainingTypeColor) {
    this.trainingTypeColorSub.next(trainingTypeColor);
  }

  getNewTrainingType(trainingType) {
    this.trainingTypeColorSub.next(trainingType);
    this.addNewTrainingType(trainingType);
  }

  addNewTrainingType(training) {
    this.trainingTypes.push(training);
    this.trainingTypeSub.next(this.trainingTypes.slice());
  }

  gettrainingTypes() {
    return this.trainingTypes.slice();
  }


  // data tags

  tagSub: Subject<Tag[]> = new Subject<Tag[]>();

  tags: Tag[] = [
    {tag_name: 'chudy', selected: false}, 
    {tag_name: 'interwały', selected: false}, 
    {tag_name: 'zima', selected: false}, 
    {tag_name: 'baza', selected: false}
  ];

  getTags() {
    let tags = this.tags.slice();
    this.tagSub.subscribe(
      result => tags = result
    )
    return tags.slice();
  };

  addTag(tagName) {
    this.tags.push({ tag_name: tagName, selected: false });
    this.tagSub.next(this.tags.slice());
  }

  changeTagToMs(tag: string){
    const time = ['0:00','0:30 a.m.','1:00 a.m.','1:30 a.m.','2:00 a.m.','2:30 a.m.','3:00 a.m.','3:30 a.m.','4:00 a.m.','4:30 a.m.','5:00 a.m.','5:30 a.m.','6:00 a.m.','6:30 a.m.','7:00 a.m.','7:30 a.m.','8:00 a.m.','8:30 a.m.','9:00 a.m.','9:30 a.m.','10:00 a.m.','10:30 a.m.','11:00 a.m.','11:30 a.m.','12:00','0:30 p.m.','1:00 p.m.','1:30 p.m.','2:00 p.m.','2:30 p.m.','3:00 p.m.','3:30 p.m.','4:00 p.m.','4:30 p.m.','5:00 p.m.','5:30 p.m.','6:00 p.m.','6:30 p.m.','7:00 p.m.','7:30 p.m.','8:00 p.m.','8:30 p.m.','9:00 p.m.','9:30 p.m.','10:00 p.m.','10:30 p.m.','11:00 p.m.','11:30 p.m.']
    const number = time.indexOf(tag);
    return number*30*60*1000
  }


}