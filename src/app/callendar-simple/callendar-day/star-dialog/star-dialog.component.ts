import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Star, TrainingPlan } from 'src/app/shared/store/tiles-data.reducers';
import { HttpClientService } from 'src/app/shared/http-client.service';
import { Subscription, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../../../shared/store/app.reducers';

@Component({
  selector: 'app-star-dialog',
  templateUrl: './star-dialog.component.html',
  styleUrls: ['./star-dialog.component.css']
})
export class StarDialogComponent implements OnInit, OnDestroy {

  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  constructor(
    private _httpService: HttpClientService,
    private _store: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<StarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Star) {};

  ngOnInit(): void {
    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        this.trainingPlan = tp;
      })

  }

  delete(){
    this._httpService.deleteTrainingPlanStar(this.trainingPlan.id, this.data.id)
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(){
    this.trainingPlanSub.unsubscribe()
  }

}
