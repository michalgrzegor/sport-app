import { HttpClientService } from 'src/app/shared/http-client.service';
import { Component, OnInit } from '@angular/core';

import * as fromApp from '../shared/store/app.reducers';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { TrainingPlan } from '../shared/store/tiles-data.reducers';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import * as LoopsActions from '../shared/store/loops.actions'
import { Tags } from '../shared/store/loops.reducers';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-loops',
  templateUrl: './loops.component.html',
  styleUrls: ['./loops.component.css']
})
export class LoopsComponent implements OnInit  {

    firstTS: string = null;
    secondTS: string = null;
    thirdTS: string = null;

    valid: boolean = false;

    time = ['0:00','0:30 a.m.','1:00 a.m.','1:30 a.m.','2:00 a.m.','2:30 a.m.','3:00 a.m.','3:30 a.m.','4:00 a.m.','4:30 a.m.','5:00 a.m.','5:30 a.m.','6:00 a.m.','6:30 a.m.','7:00 a.m.','7:30 a.m.','8:00 a.m.','8:30 a.m.','9:00 a.m.','9:30 a.m.','10:00 a.m.','10:30 a.m.','11:00 a.m.','11:30 a.m.','12:00','0:30 p.m.','1:00 p.m.','1:30 p.m.','2:00 p.m.','2:30 p.m.','3:00 p.m.','3:30 p.m.','4:00 p.m.','4:30 p.m.','5:00 p.m.','5:30 p.m.','6:00 p.m.','6:30 p.m.','7:00 p.m.','7:30 p.m.','8:00 p.m.','8:30 p.m.','9:00 p.m.','9:30 p.m.','10:00 p.m.','10:30 p.m.','11:00 p.m.','11:30 p.m.']


    subscribed: boolean = false;
    session_number: number = 0;

    trainingPlanState: Observable<TrainingPlan>;
    trainingPlanSub: Subscription;
    trainingPlan: TrainingPlan = null;
    
    athleteAccountonPaidAccountState: Observable<boolean>;
    athleteAccountonPaidAccountSub: Subscription;
    athleteAccountonPaidAccount: boolean;

    //responsive variables

    isHandset: boolean;
    isTablet: boolean;
    isWeb: boolean;

    constructor(
        private _store: Store<fromApp.AppState>,
        private _cookieService: CookieService,
        public _breakpointObserver: BreakpointObserver,
        private _httpClient: HttpClientService,
        private _data: DataService
    ) {
    }

    ngOnInit(){
        this._breakpointObserver
            .observe([Breakpoints.Handset])
            .subscribe((state: BreakpointState) => {
            if (state.matches) {
                this.isHandset = true;
                this.isTablet = false;
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
                this.isWeb = true;
            } else {
            }
        });

        

        this.athleteAccountonPaidAccountState = this._store.select(state => state.tiles.athleteAccountonPaidAccount);
        this.athleteAccountonPaidAccountSub = this.athleteAccountonPaidAccountState.subscribe(
            data => {
                this.athleteAccountonPaidAccount = data;
                let app_metadata = null;
                if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
                    app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
                }

                if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 0 && !data){
                    //when athlete account
                    this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
                    this._store.dispatch(new TilesDataActions.SetAthleteAccount(true));
                }else if(
                    (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && !app_metadata.account_level_data && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !data||
                    (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !data || 
                    (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !data){

                    //when paid or trial account
                    this._store.dispatch(new TilesDataActions.FetchTrainingPlan());
                    this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
                }else if(!data){
                    this.session_number = 0;
                    this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
                }

                if(this.getUserProfile() && app_metadata && app_metadata.tags){
                        this.firstTS = app_metadata.tags.first_training_session
                        this.secondTS = app_metadata.tags.second_training_session
                        this.thirdTS = app_metadata.tags.third_training_session

                        const tags: Tags = {};
                        tags.firstTSTag = this._data.changeTagToMs(app_metadata.tags.first_training_session);
                        tags.secondTSTag = this._data.changeTagToMs(app_metadata.tags.second_training_session);
                        tags.thirdTSTag = this._data.changeTagToMs(app_metadata.tags.third_training_session);

                        this._store.dispatch(new LoopsActions.SetTags(tags));
                }else{
                    const tags = {
                            metadata_type: 'tags', 
                            first_training_session: '8:00 a.m.',
                            second_training_session: '1:00 p.m.',
                            third_training_session: '6:00 p.m.'
                        }

                    this._httpClient.setTagsQuestions(tags);

                    this.firstTS = tags.first_training_session
                    this.secondTS = tags.second_training_session
                    this.thirdTS = tags.third_training_session

              
                }
            }
        );

        

        this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
        this.trainingPlanSub = this.trainingPlanState.subscribe(
            (tp: TrainingPlan) => {
                this.trainingPlan = tp;
                if(tp){
                    if(tp.training_sesion_number === 1){
                        this.session_number = 1
                    }else if(tp.training_sesion_number === 2){
                        this.session_number = 2
                    }else if(tp.training_sesion_number === 3){
                        this.session_number = 3
                    }
                }else{
                    this.session_number = 0;
                }
            }
        )
    }

    getUserProfile(){
        const profile = this._cookieService.get('profile');
        return profile;
      }

    change(){
        if(this.session_number === 1 && this.firstTS !== null){
            this.valid = true;
        }else if(this.session_number === 2 && this.firstTS !== null && this.secondTS !== null){
            this.valid = true;
        }else if(this.session_number === 3 && this.firstTS !== null && this.secondTS !== null && this.thirdTS !== null){
            this.valid = true;
        }
    }


    sendTag(){
        const tags = {
            metadata_type: 'tags', 
            first_training_session: this.firstTS,
            second_training_session: this.secondTS,
            third_training_session: this.thirdTS
        }

        this._httpClient.setTagsQuestions(tags);
         
    }

    ngOnDestroy(): void {
        this.trainingPlanSub.unsubscribe();
        this.athleteAccountonPaidAccountSub.unsubscribe();
    }

}
