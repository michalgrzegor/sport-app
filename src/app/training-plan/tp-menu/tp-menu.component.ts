import { HttpClientService } from './../../shared/http-client.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as tilesDataActions from '../../shared/store/tiles-data.actions';
import * as CallendarDataActions from '../../shared/store/callendar-data.actions';
import * as ChartDataActions from '../../shared/store/chart-data.actions';
import * as fromApp from '../../shared/store/app.reducers';
import { TpInfo, TrainingPlan } from '../../shared/store/tiles-data.reducers';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import * as TilesDataActions from '../../shared/store/tiles-data.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tp-menu',
  templateUrl: './tp-menu.component.html',
  styleUrls: ['./tp-menu.component.css']
})
export class TpMenuComponent implements OnInit, OnDestroy {
  tpManagerState: Observable<TpInfo[]>;
  tpManagerSub: Subscription;
  tpManager: TpInfo[] = [];

  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  mainRouteState: Observable<string>;
  mainRouteSub: Subscription;
  mainRoute: string = null;
  
  athleteAccountonPaidAccountState: Observable<boolean>;
  athleteAccountonPaidAccountSub: Subscription;
  athleteAccountonPaidAccount: boolean;
  
  noTrialState: Observable<boolean>;
  noTrialSub: Subscription;
  noTrial: boolean;

  dataSource: any = new MatTableDataSource<TpInfo>(this.tpManager);
  displayedColumns: string[] = ['selected', 'training_plan_name', 'training_plan_athlete', 'training_plan_active'];
  sort: any;
  selection: any;

  filterModeState: Observable<boolean>;
  filterModeSub: Subscription;
  filterMode: boolean = false;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  @ViewChild(MatSort) set content(content: ElementRef) {
  this.sort = content;
  if (this.sort){
     this.dataSource.sort = this.sort;
  }}

  constructor(
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    private _httpService: HttpClientService,
    private _cookieService: CookieService
  ) { }

  ngOnInit(): void {
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

    


    this.filterModeState = this._store.select(state => state.tiles.filterMode);
    this.filterModeSub = this.filterModeState.subscribe(
      data => this.filterMode = data
    );

    this.athleteAccountonPaidAccountState = this._store.select(state => state.tiles.athleteAccountonPaidAccount);
    this.athleteAccountonPaidAccountSub = this.athleteAccountonPaidAccountState.subscribe(
      data => {
        this.athleteAccountonPaidAccount = data;
        if(data){
          this.doRequests(this.noTrial, data)
        }
      }
    );

    this.noTrialState = this._store.select(state => state.tiles.noTrial);
    this.noTrialSub = this.noTrialState.subscribe(
      data => {
        this.noTrial = data;
        if(!data){
          this.doRequests(data, this.athleteAccountonPaidAccount)
        }
      }
    );


    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        this.trainingPlan = tp;
        this.selection = new SelectionModel<TpInfo>(false, [this.dataSource.data[this.getID()]]);
      }
    );

    this.mainRouteState = this._store.select(state => state.tiles.mainRoute);
    this.mainRouteSub = this.mainRouteState.subscribe(
      data => this.mainRoute = data
    )

    this.tpManagerState = this._store.select(state => state.tiles.tPManagaer);
    this.tpManagerSub = this.tpManagerState.subscribe(
      (data: TpInfo[]) => {
        this.tpManager = data;
        if(data){
          this._store.dispatch(new TilesDataActions.FireChange(`fire!!`));
          const tpMan = [];
          this.tpManager.forEach(
            tp => {
              const obj: TpInfo = {
                training_plan_name: tp.training_plan_name,
                training_plan_active: tp.training_plan_active,
                training_plan_athlete: tp.training_plan_athlete,
                training_plan_id: tp.training_plan_id,
                id: tp.id
              }
              tpMan.push(obj)
            }
          );
          this.dataSource = new MatTableDataSource<TpInfo>(this.tpManager);
          this.selection = new SelectionModel<TpInfo>(false, [this.dataSource.data[this.getID()]]);
          this.dataSource.sort = this.sort;
          this.dataSource.data = this.dataSource.data.slice()
        }else if(data === null){
          this.dataSource = new MatTableDataSource<TpInfo>([]);
        }
      }
    )
  }

  doRequests(noTrial:boolean, athleteAccount:boolean){
    if(this.tpManager && this.tpManager !== null){
      let app_metadata = null;
      if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
        app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
      }
  
      if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 0 && !athleteAccount && !noTrial){
        //when athlete account
        this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
        this._store.dispatch(new TilesDataActions.SetAthleteAccount(true));
      }else if(
        (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && !app_metadata.account_level_data && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial||
        (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial || 
        (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://sport.app.comuser_metadata'].training_plan_last_id) && !athleteAccount && !noTrial){
  
        //when paid or trial account
        this._store.dispatch(new tilesDataActions.TpMode(true));
        this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      }else if(!athleteAccount && !noTrial){
        this._store.dispatch(new tilesDataActions.FetchTpManager());
        this._store.dispatch(new tilesDataActions.TpMode(true));
        this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      }
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadTp(element){
    if(this.mainRoute === 'board'){
      this._httpService.loadBoardById(element.id);
      this._httpService.getTrainingPlanById(element.id);
    }else if(this.mainRoute === 'calendar'){
      this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(true))
      this._httpService.getTrainingPlanById(element.id);
    }else if(this.mainRoute === 'chart'){
      this._store.dispatch(new ChartDataActions.Loading(true))
      this._httpService.getTrainingPlanById(element.id);
    }
  }

  closeTpBoard(){
    this._store.dispatch(new CallendarDataActions.CloseTpBoard());
  }

  getID(): number {
    let ind = null;
    if(this.tpManager && this.trainingPlan){
      this.tpManager.forEach((el, index) => {
          if(el.id === this.trainingPlan.id){
            ind = index
          }
        }
      );
    }
    return ind;
  };

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }
  

  ngOnDestroy(): void {
    this.tpManagerSub.unsubscribe();
    this.filterModeSub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
    this.mainRouteSub.unsubscribe();
    this.athleteAccountonPaidAccountSub.unsubscribe();
    this._store.dispatch(new tilesDataActions.TpMode(false));
  }

}
