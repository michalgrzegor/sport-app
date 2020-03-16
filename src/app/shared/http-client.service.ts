import { Tag } from './../tile-editor/tile-editor.component';
import { CustomAthleteParameter } from './store/athletes-data.reducers';

import { Athlete, AthleteMin } from 'src/app/shared/store/athletes-data.reducers';
import { Note } from './store/board-data.reducers';
import { Tile } from './../models/tile';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducers';
import * as TilesActions from './store/tiles-data.actions';
import * as BoardDataActions from './store/board-data.actions';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import * as AthleteDataActions from '../shared/store/athletes-data.actions';
import * as ChartDataActions from '../shared/store/chart-data.actions';
import * as LoopsDataActions from '../shared/store/loops.actions';

import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import * as LoopsActions from '../shared/store/loops.actions'

import { CookieService } from 'ngx-cookie-service';
import { TrainingPlan, TpInfo, Star } from './store/tiles-data.reducers';
import { Answear } from './store/chart-data.reducers';
import { Tags } from './store/loops.reducers';
import { DataService } from './data.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService implements OnDestroy {

  URL: string = 'https://ccoach-app.herokuapp.com/api/v1/';

  getHttpOptions() {
    const token = this._cookieService.get('token');
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        })
      };
    return httpOptions;
}

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  
  mainRouteState: Observable<string>;
  mainRouteSub: Subscription;
  mainRoute: string;


  constructor(
    private _http: HttpClient,
    public _breakpointObserver: BreakpointObserver,
    private _store: Store<fromApp.AppState>,
    private _router: Router,
    private _cookieService: CookieService,
    private _snackBar: MatSnackBar,
    private _data: DataService
  ) { 
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
  
    this.mainRouteState = this._store.select(state => state.tiles.mainRoute);
    this.mainRouteSub = this.mainRouteState.subscribe(
      data => {
        this.mainRoute = data;
      }
    )

  };

  changeTPLastId(id){
    let profile = JSON.parse(this._cookieService.get('profile'));
    if(id === null){
      delete profile['https://sport.app.comuser_metadata'].training_plan_last_id;
    }else if(id){
      let json;
      if(profile['https://sport.app.comuser_metadata']){
        json = profile['https://sport.app.comuser_metadata'];
        json.training_plan_last_id = id;
      }else{
        json = {training_plan_last_id: id};
      }
      profile['https://sport.app.comuser_metadata'] = json;
    }
    this._cookieService.set('profile', JSON.stringify(profile) );
  };

  changeAthleteLastId(id){
    let profile = JSON.parse(this._cookieService.get('profile'));
    if(id === null){
      delete profile['https://sport.app.comuser_metadata'].athlete_platform_last_id;
    }else if(id){
      let json;
      if(profile['https://sport.app.comuser_metadata']){
        json = profile['https://sport.app.comuser_metadata'];
        json.athlete_platform_last_id = id;
      }else{
        json = {athlete_platform_last_id: id};
      }
      profile['https://sport.app.comuser_metadata'] = json;
    }
    this._cookieService.set('profile', JSON.stringify(profile) );
  };

  changeTags(tags){
    let profile = JSON.parse(this._cookieService.get('profile'));
    if(tags === null){
      delete profile['https://sport.app.comuser_metadata'].tags;
    }else if(tags){
      let json;
      if(profile['https://sport.app.comuser_metadata']){
        json = profile['https://sport.app.comuser_metadata'];
        json.tags = tags;
      }else{
        json = {tags: tags};
      }
      profile['https://sport.app.comuser_metadata'] = json;
    }
    this._cookieService.set('profile', JSON.stringify(profile) );
  };

  createTileFunctions(tile: Tile){
    this._store.dispatch(new TilesActions.PostTrainingTile(tile));
    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], {queryParams: { 'right': 'tilecollection' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tilecollection']);
      this._store.dispatch(new TilesActions.SeteMainRoute('tilecollection'))
    }
  }

  //POST REQUESTS TILES

  createTrainingTile(tile: Tile) {
    this._http.post(`${this.URL}training_tiles`, tile, this.getHttpOptions() ).subscribe(
      response => {
        this.createTileFunctions(response);
      }
    )
  }

  createDietTile(tile: Tile) {
    this._http.post(`${this.URL}diet_tiles`, tile, this.getHttpOptions() ).subscribe(
      response => {
        this.createTileFunctions(response);
      }
    )
  }

  createQuestionTile(tile: Tile) {
    this._http.post(`${this.URL}question_tiles`, tile, this.getHttpOptions() ).subscribe(
      response => {
        this.createTileFunctions(response);
        
      }
    )
  }

  createMotivationTile(tile: Tile) {
    this._http.post(`${this.URL}motivation_tiles`, tile, this.getHttpOptions() ).subscribe(
      response => {
        this.createTileFunctions(response);
      }
    )
  }

  //DELETE REQUESTS TILES

  deleteTrainingTile(id: string){
    this._http.delete(`${this.URL}training_tiles/${id}`, this.getHttpOptions()).subscribe(
    )
  }

  deleteDietTile(id: string){
    this._http.delete(`${this.URL}diet_tiles/${id}`, this.getHttpOptions()).subscribe(
    )
  }

  deleteQuestionTile(id: string){
    this._http.delete(`${this.URL}question_tiles/${id}`, this.getHttpOptions()).subscribe(
    )
  }

  deleteMotivationTile(id: string){
    this._http.delete(`${this.URL}motivation_tiles/${id}`, this.getHttpOptions()).subscribe(
    )
  }


  //UPDATE TILES

  updateTrainingTile(id: number, tile: Tile){
    this._http.patch(`${this.URL}training_tiles/${id}`, tile, this.getHttpOptions()).subscribe(
      (response: Tile) => {
        this._store.dispatch(new TilesActions.UpdateTiles(response));
      }
    )
  }
  updateDietTile(id: number, tile: Tile){
    this._http.patch(`${this.URL}diet_tiles/${id}`, tile, this.getHttpOptions()).subscribe(
      (response: Tile) => {
        this._store.dispatch(new TilesActions.UpdateTiles(response));
      }
    )
  }
  updateQuestionTile(id: number, tile: Tile){
    this._http.patch(`${this.URL}question_tiles/${id}`, tile, this.getHttpOptions()).subscribe(
      (response: Tile) => {
        this._store.dispatch(new TilesActions.UpdateTiles(response));
      }
    )
  }
  updateMotivationTile(id: number, tile: Tile){
    this._http.patch(`${this.URL}motivation_tiles/${id}`, tile, this.getHttpOptions()).subscribe(
      (response: Tile) => {
        this._store.dispatch(new TilesActions.UpdateTiles(response));
      }
    )
  }

  
  //PATCH REQUESTS TILES

  //POST REQUEST BOARD NOTE

  postBoardNote(note: Note){
    this._http.post(`${this.URL}user_board_notes`, note, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new BoardDataActions.AddNote(response));
      }
    )
  }

  //DELETE REQUEST BOARD NOTE

  deleteBoardNote(id: number, index: number){
    this._http.delete(`${this.URL}user_board_notes/${id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new BoardDataActions.DeleteNote(index));
      }
    )
  }

  //PATCH REQUEST BOARD NOTE

  patchBoardNote(note, id: number, index: number){
    this._http.patch(`${this.URL}user_board_notes/${id}`, note, this.getHttpOptions()).subscribe(
      (response: Note) => {
        this._store.dispatch(new BoardDataActions.UpdateNote({index: index, note: response}));
        this._store.dispatch(new BoardDataActions.SetNote(response));
      }
    )
  }

  //set user metadata

  setUserMetaData(id: number){
    this._http.post(`${this.URL}auth_metadatas`, {metadata_type: 'training_plan_last_id', training_plan_last_id: id}, this.getHttpOptions()).subscribe(
      response => {
        this.changeTPLastId(id);
      }
    )
  }

  setAthleteUserMetaData(id: number){
    this._http.post(`${this.URL}auth_metadatas`, {metadata_type: 'athlete_platform_last_id', athlete_platform_last_id: id}, this.getHttpOptions()).subscribe(
      response => {
        this.changeAthleteLastId(id);
      }
    )
  }

  //post training plan

  postTrainingPlan(tp: TrainingPlan){
    this._http.post(`${this.URL}training_plans`, tp, this.getHttpOptions()).subscribe(
      (response: TrainingPlan) => {
        this._store.dispatch(new TilesActions.SetTrainingPlan(response));
        const tpElement: TpInfo = {
          training_plan_name: response.training_plan_name,
          training_plan_active: false,
          training_plan_athlete: null, 
          training_plan_id: response.id,
          id: response.id
        }
        this._store.dispatch(new TilesActions.AddTpManager(tpElement))
        this.setUserMetaData(response.id)
      }
    )
  }

  //get trainingPlan by id

  getTrainingPlanById(id: number){
    this._http.get(`${this.URL}training_plans/${id}`, this.getHttpOptions()).subscribe(
      (response: TrainingPlan) => {
        this._store.dispatch(new TilesActions.SetTrainingPlan(response));
        this._store.dispatch(new ChartDataActions.SetTP(response));
        this.setUserMetaData(response.id);
        this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
        this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
        this._store.dispatch(new TilesDataActions.SetNoTp(false));
      }
    )
  }

  //get traing plan from platform

  getTrainingPlanFromPlatform() {
    this._http.get(`${this.URL}platform_training_plan`, this.getHttpOptions()).subscribe(
      (response: any) => {
        if(response.message === "You have not been invited to any group yet"){
          this._store.dispatch(new TilesActions.SetTrainingPlan(null));
          this._store.dispatch(new ChartDataActions.SetTP(null));
          this._store.dispatch(new BoardDataActions.SetBoard(null));
          this._store.dispatch(new TilesDataActions.SetTiles([]));
          this._store.dispatch(new TilesDataActions.SetNoTp(true));
          this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
          this._store.dispatch(new TilesDataActions.SetOnPlatformWithoutPlan(false));
        }else if(response.message === "Your trainer have not activated any plan yet"){
          this._store.dispatch(new TilesActions.SetTrainingPlan(null));
          this._store.dispatch(new ChartDataActions.SetTP(null));
          this._store.dispatch(new BoardDataActions.SetBoard(null));
          this._store.dispatch(new TilesDataActions.SetTiles([]));
          this._store.dispatch(new TilesDataActions.SetNoTp(true));
          this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
          this._store.dispatch(new TilesDataActions.SetOnPlatformWithoutPlan(true));
        }else{
          this._store.dispatch(new TilesDataActions.FetchTilesFromPlatform());
          this._store.dispatch(new BoardDataActions.FetchBoardFromPlatform());
          this._store.dispatch(new TilesActions.SetTrainingPlan(response));
          this._store.dispatch(new ChartDataActions.SetTP(response));
          this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
          this._store.dispatch(new TilesDataActions.SetOnPlatformWithoutPlan(false));
          this._store.dispatch(new LoopsDataActions.FetchLoopsData());
        }
      }
    )
  }

  //patch training plan

  patchTrainingPlan(tp: TrainingPlan, id: number){
    this._http.patch(`${this.URL}training_plans/${id}`, tp, this.getHttpOptions()).subscribe(
      (response: TrainingPlan) => {
        this._store.dispatch(new TilesActions.SetTrainingPlan(response));
        this._store.dispatch(new TilesActions.FetchTpManager());
        this.setUserMetaData(response.id)
      }
    )
  }

  //delete training plan

  deleteTrainingPlan(id: number){
    console.log(`deletuje`, `${this.URL}training_plans/${id}`, this.getHttpOptions())
    this._http.delete(`${this.URL}training_plans/${id}`, this.getHttpOptions()).subscribe(
      (response) => {
        console.log(response)
        this._store.dispatch(new TilesDataActions.DeleteTpManager(id));
      }
    )
  }

  //BOARD NOTES TO TP BOARD
  //Post Board Note

  postBoardNoteTP(note: Note, id: number){
    this._http.post(`${this.URL}training_plans/${id}/training_plan_board_notes`, note, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new BoardDataActions.AddNote(response));
      }
    )
  }

  //Patch Board Note

  patchBoardNoteTP(note: Note, id: number, idBN: number, idNote: number){
    this._http.patch(`${this.URL}training_plans/${id}/training_plan_board_notes/${idBN}`, note, this.getHttpOptions()).subscribe(
      (response: Note) => {
        this._store.dispatch(new BoardDataActions.UpdateNote({index: idNote, note: response}));
        this._store.dispatch(new BoardDataActions.SetNote(response));
      }
    )
  }

  //Delete Board Note

  deleteBoardNoteTP(id: number, idBN: number, index: number){
    this._http.delete(`${this.URL}training_plans/${id}/training_plan_board_notes/${idBN}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new BoardDataActions.DeleteNote(index));
      }
    )
  }

  loadBoardById(id: number) {
    this._http.get(`${this.URL}training_plans/${id}/training_plan_board_notes`, this.getHttpOptions()).subscribe(
      (response: Note[]) => {
        this._store.dispatch(new BoardDataActions.SetBoard(response))
      }
    )
  }

  //ATHLETE MANAGER/CARDS/BOARD

  //Get athlete card by id

  getAthleteCardById(id: number){
    console.log(`idzie`)
    this._http.get(`${this.URL}athlete_platforms/${id}`, this.getHttpOptions()).subscribe(
      (response: Athlete) => {
        this._store.dispatch(new AthleteDataActions.SetAthleteData(response));
        this.setAthleteUserMetaData(response.id);
      })}
    
  postAthlete(athlete: Athlete){
    this._http.post(`${this.URL}athlete_platforms`, athlete, this.getHttpOptions()).subscribe(
      (response: Athlete) => {
        this._store.dispatch(new AthleteDataActions.SetAthleteData(response));
        this.setAthleteUserMetaData(response.id);
        const athleteMin: AthleteMin = {
          id:  response.id,
          athlete_name: response.athlete_name,
          activated_training_plan: {
            training_plan_id: null,
            training_plan_name: null,
        }}
        this._store.dispatch(new AthleteDataActions.UpdateAthletesData(athleteMin))
    })}

  patchAthlete(id: number, athlete: Athlete){
    this._http.patch(`${this.URL}athlete_platforms/${id}`, athlete, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.UpdateAthleteData(response))
      }
    )
  };

  deleteAthlete(id: number){
    this._http.delete(`${this.URL}athlete_platforms/${id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.FetchAthletesData())
      }
    )
  }

  searchUser(email:string){
    this._http.post(`${this.URL}user_account_searches`, {user_email: email}, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.SpinnerOnOffInvite(false));
        this._store.dispatch(new AthleteDataActions.SetUserId(response.user_id))
        if(response.user_exist && response.users_data.length === 1){
          this._store.dispatch(new AthleteDataActions.ResponseEmailStatus({status: 2, id: response.users_data[0].user_id}))
          this._store.dispatch(new AthleteDataActions.IsValidOnOff(true))
        }else if(response.user_exist && response.users_data.length > 1){
          this._store.dispatch(new AthleteDataActions.ResponseEmailStatus({status: 4, id: null}));
          this._store.dispatch(new AthleteDataActions.SetUsersByEmail(response.users_data))
          this._store.dispatch(new AthleteDataActions.IsValidOnOff(false))
        }else{
          this._store.dispatch(new AthleteDataActions.ResponseEmailStatus({status: 3, id: response.id}))
          this._store.dispatch(new AthleteDataActions.IsValidOnOff(true))
        }
      }
    )
  }

  inviteNewUser(platform_id: number, user_email: string){
    this._http.post(`${this.URL}athlete_platforms/${platform_id}/to_app_invitations`, {athlete_email: user_email}, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.UpdateAthlete({id: response.id, email: user_email, status: 3}));
        this._store.dispatch(new AthleteDataActions.SetInvitationSucces(true));
      }
    )
  }

  inviteExistUser(platform_id: number, user_id: string, user_email: string){
    this._http.post(`${this.URL}athlete_platforms/${platform_id}/invitations`, {user_id: user_id}, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.UpdateAthlete({id: response.id, email: user_email, status: 2}));
        this._store.dispatch(new AthleteDataActions.SetInvitationSucces(true));
      }
    )
  }

  deleteInviteNewUser(platform_id: number, invitation_id: number){
    this._http.delete(`${this.URL}athlete_platforms/${platform_id}/to_app_invitations/${invitation_id}`, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.DeleteInvitations())
      }
    )
  }

  deleteInviteExistUser(platform_id: number, invitation_id: number){
    this._http.delete(`${this.URL}athlete_platforms/${platform_id}/invitations/${invitation_id}`, this.getHttpOptions()).subscribe(
      (response: any) => {
        this._store.dispatch(new AthleteDataActions.DeleteInvitations())
      }
    )
  }

  acceptInvitation(trainer_token){
    this._http.post( `${this.URL}attendant_memberships`, { platform_token : trainer_token }, this.getHttpOptions() ).subscribe(
      response => {
        this._cookieService.delete('invitations');
        this._store.dispatch(new TilesActions.SetInvitations(null));
      }
    )
  }

  deleteInvitation(platform_token: string, index: number){
    this._http.delete( `${this.URL}athleted_invitations/${platform_token}`, this.getHttpOptions() ).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.CancelInvitation(index));
      }
    )
  }

  exitFromPlatform(){
    this._http.delete(`${this.URL}attendant_membership`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new TilesDataActions.SetOnPlatformWithoutPlan(false));
      }
    )
  }

  removeAthlete(athlete_platform_id: number, id: number){
    this._http.delete(`${this.URL}athlete_platforms/${athlete_platform_id}/memberships/${id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.FetchAthletesData());
        this._store.dispatch(new AthleteDataActions.UpdateAthlete({id: null, email: null, status: 4}));
      }
    )
  }

  //CUSTOM PARAMS ATHLETE
  
  //post custom params athlete

  postCustomParams(athlete_platform_id: number, custom_params){
    this._http.post(`${this.URL}athlete_platforms/${athlete_platform_id}/custom_athlete_parameters`, custom_params, this.getHttpOptions()).subscribe(
      (response: CustomAthleteParameter)=>{
        this._store.dispatch(new AthleteDataActions.AddCustomParams(response))
      }
    )
  }

  deleteCustomParam(id: number, athlete_platform_id: number){
    this._http.delete(`${this.URL}athlete_platforms/${athlete_platform_id}/custom_athlete_parameters/${id}`, this.getHttpOptions()).subscribe(
      response => {
      }
    )
  }

  patchCustomParam(id: number, athlete_platform_id: number, custom_param: CustomAthleteParameter){
    this._http.patch(`${this.URL}athlete_platforms/${athlete_platform_id}/custom_athlete_parameters/${id}`, custom_param, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.EditCustomParams(response))
      }
    )
  }

  //PLATFORM NOTES
  //post note

  postPlatformNote(id:number, note: Note){
    this._http.post(`${this.URL}athlete_platforms/${id}/platform_notes`, note, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.UpdateAthleteNotes(response))
      }
    )
  }

  patchPlatformNote(id:number, note: Note){
    this._http.patch(`${this.URL}athlete_platforms/${id}/platform_notes/${note.id}`, note, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.UpdateAthleteNote(response));
      }
    )
  }

  deletePlatformNote(id:number, note: Note){
    this._http.delete(`${this.URL}athlete_platforms/${id}/platform_notes/${note.id}`, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new AthleteDataActions.DeleteAthleteNote(note))
      }
    )
  }

  //Training Plan stars

  postTrainingPlanStar(tp_id: number, star: Star){
    this._http.post(`${this.URL}training_plans/${tp_id}/calendar_stars`, star, this.getHttpOptions()).subscribe(
      (response: Star) => {
        this._store.dispatch(new TilesDataActions.AddStar(response));
        //
      }
    )
  }

  patchTrainingPlanStar(tp_id: number, star: Star, star_id: number){
    this._http.patch(`${this.URL}training_plans/${tp_id}/calendar_stars/${star_id}`, star, this.getHttpOptions()).subscribe(
      (response: Star) => {
        this._store.dispatch(new TilesDataActions.AddStar(response));
      }
    )
  }

  deleteTrainingPlanStar(tp_id: number, star_id: number){
    this._http.delete(`${this.URL}training_plans/${tp_id}/calendar_stars/${star_id}`, this.getHttpOptions()).subscribe(
      (response: Star) => {
        this._store.dispatch(new TilesDataActions.DeleteStar(star_id));
      }
    )
  }

 






  //answers for questions

  postAnswers(json, notifications: any[]){
    this._http.post(`${this.URL}platform_training_plan_question_answers`, json, this.getHttpOptions()).subscribe(
      response => {
        this._store.dispatch(new LoopsDataActions.SetNotifications(notifications));
      }
    )
  }

  fetchChartData(tp_id: number){
    this._http.get(`${this.URL}training_plans/${tp_id}/training_plan_question_answers`, this.getHttpOptions()).subscribe(
      (response: Answear[]) => {
        this._store.dispatch(new ChartDataActions.SetChartData(response))
      }
    )
  }


  //tag functionality

  postTag(tagName: string){
    this._http.post(`${this.URL}tile_tags`, {tag_name: tagName}, this.getHttpOptions()).subscribe(
      (response: Tag) => {
        this._store.dispatch(new TilesDataActions.AddTag(response));
      }
    )
  };

  deleteTag(tag_id: number){
    this._http.delete(`${this.URL}tile_tags/${tag_id}`, this.getHttpOptions()).subscribe(
      (response) => {
        
      }
    )
  };

  setTagsQuestions(tags: any){
    this._http.post(`${this.URL}auth_metadatas`, tags, this.getHttpOptions()).subscribe(
      response => {
        this.changeTags(tags);

        const tag: Tags = {};
        tag.firstTSTag = this._data.changeTagToMs(tags.first_training_session);
        tag.secondTSTag = this._data.changeTagToMs(tags.second_training_session);
        tag.thirdTSTag = this._data.changeTagToMs(tags.third_training_session);

        this._store.dispatch(new LoopsActions.SetTags(tag));
      }
    )
  };

  
  ngOnDestroy(): void {
    this.mainRouteSub.unsubscribe();
  }
}