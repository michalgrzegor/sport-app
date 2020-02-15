import { Athlete } from 'src/app/shared/store/athletes-data.reducers';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import * as fromApp from '../../shared/store/app.reducers';
import { Store } from '@ngrx/store';
import { HttpClientService } from 'src/app/shared/http-client.service';

@Component({
  selector: 'app-athlete-creator',
  templateUrl: './athlete-creator.component.html',
  styleUrls: ['./athlete-creator.component.css']
})
export class AthleteCreatorComponent implements OnInit {
  
  isTutorialState: Observable<boolean>;
  isTutorialSub: Subscription;
  isTutorial: boolean;

  constructor(
    public dialogRef: MatDialogRef<AthleteCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Athlete,
    private _store: Store<fromApp.AppState>,
    private _httpService: HttpClientService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.isTutorialState = this._store.select(state => state.callendar.isTutorial);
    this.isTutorialSub = this.isTutorialState.subscribe(
      data => {
        this.isTutorial = data;
        console.log(data)
      }
    );
  }

  closeDialog(){
    this.dialogRef.close()
  }

  createAthleteTutorial(){
    if(this.isTutorial){
      const newAthlete: Athlete = {
      athlete_name: this.data.athlete_name,
      athlete_phone_number: null,
      athlete_email: null,
      athlete_sport_discipline: null,
      athlete_age: null,
      athlete_height: null,
      athlete_weight: null,
      athlete_arm: null,
      athlete_chest: null,
      athlete_waist: null,
      athlete_hips: null,
      athlete_tigh: null,
      fitness_level: null,
      custom_athlete_parameters: [],
      platform_notes: [],
    }

    console.log(newAthlete)
    this._httpService.postAthlete(newAthlete);
    }
  }

}
