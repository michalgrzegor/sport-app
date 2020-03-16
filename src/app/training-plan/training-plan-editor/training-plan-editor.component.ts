import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { HttpClientService } from 'src/app/shared/http-client.service';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';



export interface TPDialogData {
  training_plan_name: string;
  date_from: string;
  date_to: string;
  training_sesion_number: string;
  isEdited: boolean;
}

@Component({
  selector: 'app-training-plan-editor',
  templateUrl: './training-plan-editor.component.html',
  styleUrls: ['./training-plan-editor.component.scss']
})
export class TrainingPlanEditorComponent implements OnInit, OnDestroy {
  date = new Date();
  minDate = new Date(this.date.setDate(this.date.getDate() - 30));
  minDateTo = new Date(this.minDate.setDate(this.minDate.getDate() + 1));

  validDate: boolean = false;
  noDate: boolean = false;

  isTutorialState: Observable<boolean>;
  isTutorialSub: Subscription;
  isTutorial: boolean;

  @ViewChild('1') oneDate;
  @ViewChild('2') twoDate;

  constructor(
    public dialogRef: MatDialogRef<TrainingPlanEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TPDialogData,
    private _store: Store<fromApp.AppState>,
    private _httpService: HttpClientService
    ) {}

  ngOnInit() {
    if(this.data.isEdited){
      this.validDate = true;
    }

    this.isTutorialState = this._store.select(state => state.calendar.isTutorial);
    this.isTutorialSub = this.isTutorialState.subscribe(
      data => {
        this.isTutorial = data;
        if(data){
          const dateFrom = moment().format("YYYY-MM-DD");
          const dateTo = moment().add(3,'months').format("YYYY-MM-DD");
          this.data.training_plan_name = 'First training plan';
          this.data.date_from = dateFrom;
          this.data.date_to = dateTo;
          this.data.training_sesion_number = '2';
          this.validDate = true;
        }
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkDateValid(){
    const date_one = moment(this.oneDate.nativeElement.value, "MM-DD-YYYY").valueOf()
    const date_two = moment(this.twoDate.nativeElement.value, "MM-DD-YYYY").valueOf()
    if(date_one && date_two && date_one >= date_two){
      this.validDate = false;
    }else if(date_one && date_two && date_one < date_two){
      this.validDate = true;
    }else if(!date_one || !date_two){
      this.validDate = false;
      this.noDate = true;
    }
  }

  setMinDateTo(event){
    let date = new Date(event.value);
    this.minDateTo = new Date(date.setDate(date.getDate()+1))
  }

  closeDialog(){
    this.dialogRef.close()
  }

  
  createFirstPlan(){
    if(this.isTutorial && this.data.training_plan_name && this.data.date_from && this.data.date_to && this.data.training_sesion_number){
      const newTP = {
        training_plan_name : null,
        date_from : null,
        date_to : null,
        training_sesion_number : null,
      };
      
      newTP.training_plan_name = this.data.training_plan_name;
      newTP.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
      newTP.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
      newTP.training_sesion_number = this.data.training_sesion_number;
      this._httpService.postTrainingPlan(newTP);
    }
  }
  
  ngOnDestroy(): void {
    this.isTutorialSub.unsubscribe()
  }
  
}
