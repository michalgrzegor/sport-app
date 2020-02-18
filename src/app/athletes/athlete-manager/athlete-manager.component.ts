import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AthleteMin, Athlete } from 'src/app/shared/store/athletes-data.reducers';

import { Store } from '@ngrx/store';
import * as AthleteDataActions from '../../shared/store/athletes-data.actions';
import * as fromApp from '../../shared/store/app.reducers';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClientService } from 'src/app/shared/http-client.service';

export interface AthleteMinFlat {
  id: number;
  athlete_name: string;
  training_plan_name: string;
}

@Component({
  selector: 'app-athlete-manager',
  templateUrl: './athlete-manager.component.html',
  styleUrls: ['./athlete-manager.component.scss']
})
export class AthleteManagerComponent implements OnInit, OnDestroy {
  athletesState: Observable<AthleteMin[]>;
  athletesSub: Subscription;
  athletes: AthleteMin[];

  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  //table
  dataSource: any;
  displayedColumns: string[] = ['selected', 'athlete_name', 'training_plan_name'];
  sort: any;
  selection: any;

  filterMode: boolean = true;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
    }
  }

  constructor(
    private _store: Store<fromApp.AppState>,
    private _httpService: HttpClientService
  ) { }

  ngOnInit() {

    if(!this.athletes){
      this._store.dispatch(new AthleteDataActions.FetchAthletesData());
    }

    this.athleteState = this._store.select(state => state.athletes.athlete);
    this.athleteSub = this.athleteState.subscribe(
      data => {
        this.athlete = data;
        const AthleteMinFlatArray = [];
        if(data && this.athletes){
          this.athletes.forEach(
            (athleteMin: AthleteMin) => {
              let athleteMinFlatObj = {
                id: athleteMin.id,
                athlete_name: athleteMin.athlete_name,
                training_plan_name: athleteMin.activated_training_plan.training_plan_name
              }
              AthleteMinFlatArray.push(athleteMinFlatObj);
            }
          )
        }
        this.dataSource = new MatTableDataSource<AthleteMinFlat>(AthleteMinFlatArray);
        this.selection = new SelectionModel<AthleteMinFlat>(false, [this.dataSource.data[this.getID()]]);
        this.dataSource.sort = this.sort;
      }
    )

    this.athletesState = this._store.select(state => state.athletes.athletes);
    this.athletesSub = this.athletesState.subscribe(
      data => {
        this.athletes = data;
        const AthleteMinFlatArray = [];
        if(data && this.athlete){
          data.forEach(
            (athleteMin: AthleteMin) => {
              let athleteMinFlatObj = {
                id: athleteMin.id,
                athlete_name: athleteMin.athlete_name,
                training_plan_name: athleteMin.activated_training_plan.training_plan_name
              }
              AthleteMinFlatArray.push(athleteMinFlatObj);
            }
          )
        }
        this.dataSource = new MatTableDataSource<AthleteMinFlat>(AthleteMinFlatArray);
        this.selection = new SelectionModel<AthleteMinFlat>(false, [this.dataSource.data[this.getID()]]);
        this.dataSource.sort = this.sort;
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setAthlete(athlete){
    console.log(athlete)
    this._httpService.getAthleteCardById(athlete.id)
  }

  getID(): number {
    let ind = null;
    if(this.athletes && this.athlete){
      this.athletes.forEach((el, index) => {
          if(el.id === this.athlete.id){
            ind = index
          }});}
    return ind;
  }

  ngOnDestroy(): void {
    this.athletesSub.unsubscribe();    
    this.athleteSub.unsubscribe();    
  }

}
