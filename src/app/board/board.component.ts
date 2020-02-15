import { Note } from './../shared/store/board-data.reducers';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as BoardDataActions from '../shared/store/board-data.actions';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import * as fromApp from '../shared/store/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { NoteCreatorComponent } from './note-creator/note-creator.component';
import { NoteComponent } from './note/note.component';
import { Athlete } from '../shared/store/athletes-data.reducers';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { VerifyDialogNoteComponent } from '../tile/verify-dialog-note/verify-dialog-note.component';
import { HttpClientService } from '../shared/http-client.service';
import { CookieService } from 'ngx-cookie-service';
import { TpInfo, TrainingPlan } from '../shared/store/tiles-data.reducers';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  
  boardNotesState: Observable<Note[]>;
  boardNotesSub: Subscription;
  boardNotes: Note[] = null;
  
  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  planNameState: Observable<string>;
  planNameSub: Subscription;
  planName: string = '';

  isMaxWidthState: Observable<boolean>;
  isMaxWidthSub: Subscription;
  isMaxWidth: boolean = false;

  tpManagerState: Observable<TpInfo[]>;
  tpManagerSub: Subscription;
  tpManager: TpInfo[] = [];

  name = 'main'

  //note creator variables
  board_note_name: string;
  board_note_link: string;
  board_note_description: string;
  board_note_id: number;

  index: number;

  athleteCardModeState: Observable<boolean>;
  athleteCardModeSub: Subscription;
  athleteCardMode: boolean;


  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  athleteAccountonPaidAccountState: Observable<boolean>;
  athleteAccountonPaidAccountSub: Subscription;
  athleteAccountonPaidAccount: boolean;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;


  isVerified: boolean;
  isVerifiedSub: any;

  constructor(
    private _store: Store<fromApp.AppState>,
    private _sanitizer: DomSanitizer,
    public _dialog: MatDialog,
    public _breakpointObserver: BreakpointObserver,
    public _httpService: HttpClientService,
    private _cookieService: CookieService
  ) { }

  ngOnInit(): void {
    console.log(`odpalił się board note LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL`)
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


    this.planNameState = this._store.select(state => state.callendar.planName);
    this.planNameSub = this.planNameState.subscribe(
      data => this.planName = data
    )

    this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
    this.isPaidAccountSub = this.isPaidAccountState.subscribe(
      data => this.isPaidAccount = data
    );

    this.athleteAccountonPaidAccountState = this._store.select(state => state.tiles.athleteAccountonPaidAccount);
    this.athleteAccountonPaidAccountSub = this.athleteAccountonPaidAccountState.subscribe(
      data => {
        console.log(data)
        this.athleteAccountonPaidAccount = data;
        
        let app_metadata = null;
        if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://gremo.sport.comapp_metadata']){
          app_metadata = JSON.parse(this.getUserProfile())['https://gremo.sport.comapp_metadata']
        }

        if(this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 0){
          //when athlete account
          console.log(`athlete account`);
          this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(false));
          this._store.dispatch(new TilesDataActions.SetAthleteAccount(true));
        }else if(
          (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && !app_metadata.account_level_data && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'].training_plan_last_id) && !data||
          (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'].training_plan_last_id) && !data || 
          (this.getUserProfile() && app_metadata && app_metadata.account_level_data  && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'] && JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'].training_plan_last_id) && !data){

          //when paid or trial account
          console.log(`paid or trial account`);
          this._store.dispatch(new TilesDataActions.SetNoTp(false));
          this._store.dispatch(new BoardDataActions.FetchTrainingBoard());
          this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
        }else if(!data){
          console.log(`else`);
          this.name = 'main'
          this._store.dispatch(new TilesDataActions.SetNoTp(true))
          this._store.dispatch(new BoardDataActions.FetchBoard());
          this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
        }
      }
    );

    this.tpManagerState = this._store.select(state => state.tiles.tPManagaer);
    this.tpManagerSub = this.tpManagerState.subscribe(
      (data: TpInfo[]) => {
        this.tpManager = data;
        if(data){
          data.forEach(tpM => {
              if(tpM.id === JSON.parse(this.getUserProfile())['https://gremo.sport.comuser_metadata'].training_plan_last_id){
                this.name = tpM.training_plan_name;
              }})
        }else{
          this.name = 'main'
        }})

    this.isMaxWidthState = this._store.select(state => state.board.isMaxWidth);
    this.isMaxWidthSub = this.isMaxWidthState.subscribe(
      data => this.isMaxWidth = data
    );

    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        this.trainingPlan = tp;
        if(tp){
          this.name = tp.training_plan_name
        }
      }
    );

    this.boardNotesState = this._store.select(state => state.board.boardNotes);
    this.boardNotesSub = this.boardNotesState.subscribe(
      data => {
        let noteArray = data;
        if(data && !this.athleteCardMode){
          noteArray.forEach(
            note => {
              let link = note.board_note_link;
              if(link.includes('watch?v=')){
                link = link.replace('watch?v=', 'embed/')
              }
              note.board_note_safe_link = this._sanitizer.bypassSecurityTrustResourceUrl(link);
            }
          );
          this.boardNotes = noteArray;
        }
      }
    )

    this.athleteCardModeState = this._store.select(state => state.athletes.athleteCardMode);
    this.athleteCardModeSub = this.athleteCardModeState.subscribe(
      data => {
        this.athleteCardMode = data;
        if(data && this.athlete){
          let noteArray = this.athlete.platform_notes
          const newNoteArray = [];
          noteArray.forEach(
            note => {
              let noteNew: Note = {
                board_note_name: note.platform_note_name,
                board_note_link: note.platform_note_link,
                board_note_description: note.platform_note_description,
                board_note_safe_link: null,
                id: note.id
              }
              let link = note.platform_note_link;
              if(link.includes('watch?v=')){
                link = link.replace('watch?v=', 'embed/')
              }
              noteNew.board_note_safe_link = this._sanitizer.bypassSecurityTrustResourceUrl(link);
              newNoteArray.push(noteNew)
            }
          );
          this.boardNotes = newNoteArray;
        }
      }
    )

    this.athleteState = this._store.select(state => state.athletes.athlete);
    this.athleteSub = this.athleteState.subscribe(
      data => {
        this.athlete = data;
        if(data && this.athleteCardMode){
          let noteArray = data.platform_notes;
          const newNoteArray = [];
          noteArray.forEach(
            note => {
              let noteNew: Note = {
                board_note_name: note.platform_note_name,
                board_note_link: note.platform_note_link,
                board_note_description: note.platform_note_description,
                board_note_safe_link: null,
                id: note.id
              }
              let link = note.platform_note_link;
              if(link && link.includes('watch?v=')){
                link = link.replace('watch?v=', 'embed/')
              }
              noteNew.board_note_safe_link = this._sanitizer.bypassSecurityTrustResourceUrl(link);
              newNoteArray.push(noteNew)
            }
          );
          this.boardNotes = newNoteArray;
        }
      }
    )
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  newNote(){
    this.board_note_name = '';
    this.board_note_link = '';
    this.board_note_description = '';
    
    const dialogRef = this._dialog.open(NoteCreatorComponent, {
      width: '408px',
      autoFocus: false,
      id: 'note-creator',
      data: {
        board_note_name: this.board_note_name, 
        board_note_link: this.board_note_link, 
        board_note_description: this.board_note_description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.board_note_name = result.board_note_name;
        this.board_note_link = result.board_note_link;
        this.board_note_description = result.board_note_description;

        let link = result.board_note_link;
        if(link.includes('watch?v=')){
          link = link.replace('watch?v=', 'embed/')
        }
        if(!this.athleteCardMode){
          let note = {
            board_note_name : result.board_note_name,
            board_note_link : result.board_note_link,
            board_note_description : result.board_note_description,
            board_note_safe_link : this._sanitizer.bypassSecurityTrustResourceUrl(link)
          }
          if(this.name === 'main'){
            this._httpService.postBoardNote(note);
          }else{
            this._httpService.postBoardNoteTP(note, this.trainingPlan.id)
          }
        }else if(this.athleteCardMode){
          let note = {
            platform_note_name : result.board_note_name,
            platform_note_link : result.board_note_link,
            platform_note_description : result.board_note_description,
            platform_note_safe_link : this._sanitizer.bypassSecurityTrustResourceUrl(link)
          }
          this._httpService.postPlatformNote(this.athlete.id, note);
        }
      }
    });
  }
  loadMainBoard(){
    this._store.dispatch(new BoardDataActions.FetchBoard());
    this.name = 'main';
  }

  loadBoard(id: number, name: string){
    this._httpService.loadBoardById(id);
    this._httpService.getTrainingPlanById(id);
    this.name = name
  }

  openNote(index: number){
    this.index = index;
    this._store.dispatch(new BoardDataActions.SetNote(this.boardNotes[index]));

    const dialogRef = this._dialog.open(NoteComponent, {
      width: '600px',
      data: {index: this.index, name: this.name },
      id: 'note-dialog',
      autoFocus: false
    })
  }

  deleteNote(index: number){
    this.isVerifiedSub = this._dialog.open(VerifyDialogNoteComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      this.isVerified = result;
      if(result){
        if(!this.athleteCardMode){
          if(this.name === 'main'){
            this._httpService.deleteBoardNote(this.boardNotes[index].id, index);
          }else{
            this._httpService.deleteBoardNoteTP(this.trainingPlan.id, this.boardNotes[index].id, index);
          }
        }else if(this.athleteCardMode){
          this._httpService.deletePlatformNote(this.athlete.id, this.boardNotes[index])
        }
      }
    })
  }

  editNote(index: number){
    this.board_note_name = this.boardNotes[index].board_note_name;
    this.board_note_link = this.boardNotes[index].board_note_link;
    this.board_note_description = this.boardNotes[index].board_note_description;
    this.board_note_id = this.boardNotes[index].id;
    
    const dialogRef = this._dialog.open(NoteCreatorComponent, {
      width: '408px',
      autoFocus: false,
      id: 'note-creator',
      data: {
        board_note_name: this.boardNotes[index].board_note_name, 
        board_note_link: this.boardNotes[index].board_note_link, 
        board_note_description: this.boardNotes[index].board_note_description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.board_note_name = result.board_note_name;
        this.board_note_link = result.board_note_link;
        this.board_note_description = result.board_note_description;

        let link = result.board_note_link;
        if(link.includes('watch?v=')){
          link = link.replace('watch?v=', 'embed/')
        }
        if(!this.athleteCardMode){
          let note = {
            board_note_name : result.board_note_name,
            board_note_link : result.board_note_link,
            board_note_description : result.board_note_description,
            board_note_safe_link : this._sanitizer.bypassSecurityTrustResourceUrl(link),
            id: this.boardNotes[index].id
          }
          if(this.name === 'main'){
            console.log(`kiedy main`)
            this._httpService.patchBoardNote(note, note.id, index)
          }else{
            console.log(`kiedy nie main`)
            this._httpService.patchBoardNoteTP(note, this.trainingPlan.id, note.id,  index)
          }
        }else if(this.athleteCardMode){
          console.log(`kiedy nie athletecardmode`)
          let note = {
            platform_note_name : result.board_note_name,
            platform_note_link : result.board_note_link,
            platform_note_description : result.board_note_description,
            platform_note_safe_link : this._sanitizer.bypassSecurityTrustResourceUrl(link),
            id: this.boardNotes[index].id
          }
          this._httpService.patchPlatformNote(this.athlete.id, note);
        }
        
        
      }
    });
  }

  ngOnDestroy(): void {
    this.boardNotesSub.unsubscribe();
    this.planNameSub.unsubscribe();
    this.athleteCardModeSub.unsubscribe();
    this.athleteSub.unsubscribe();
    this.isMaxWidthSub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
    this.tpManagerSub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.athleteAccountonPaidAccountSub.unsubscribe();
  }
}