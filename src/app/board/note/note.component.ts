import { HttpClientService } from './../../shared/http-client.service';
import { Store } from '@ngrx/store';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Note } from 'src/app/shared/store/board-data.reducers';
import { DomSanitizer } from '@angular/platform-browser';

import * as fromApp from '../../shared/store/app.reducers'
import { NoteCreatorComponent } from '../note-creator/note-creator.component';
import { Athlete } from 'src/app/shared/store/athletes-data.reducers';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { VerifyDialogNoteComponent } from 'src/app/tile/verify-dialog-note/verify-dialog-note.component';
import { CookieService } from 'ngx-cookie-service';
import { TrainingPlan } from 'src/app/shared/store/tiles-data.reducers';

export interface NoteIndex {
  index: number;
  name: string;
}

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, OnDestroy {

  boardNotesState: Observable<Note[]>;
  boardNotesSub: Subscription;
  boardNotes: Note[] = null;

  boardNoteState: Observable<Note>;
  boardNoteSub: Subscription;
  boardNote: Note = null;

  //note creator variables
  board_note_name: string;
  board_note_link: string;
  board_note_description: string;

  athleteCardModeState: Observable<boolean>;
  athleteCardModeSub: Subscription;
  athleteCardMode: boolean;


  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  isVerified: boolean;
  isVerifiedSub: any;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  constructor(
    public dialogRef: MatDialogRef<NoteComponent>,
    public _store: Store<fromApp.AppState>,
    public _dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    public _breakpointObserver: BreakpointObserver,
    private _httpService: HttpClientService,
    private _cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: NoteIndex) {}

  ngOnInit() {
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
    );

    this.boardNoteState = this._store.select(state => state.board.boardNote);
    this.boardNoteSub = this.boardNoteState.subscribe(
      data => {
          let note = data;
          let link = note.board_note_link;
          if(link.includes('watch?v=')){
            link = link.replace('watch?v=', 'embed/')
          }
          note.board_note_safe_link = this._sanitizer.bypassSecurityTrustResourceUrl(link);

          this.boardNote = note;
        }
    );

    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        this.trainingPlan = tp;
      }
    );

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
          this.boardNote = newNoteArray[this.data.index];
        }
      }
    );

    this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
    this.isPaidAccountSub = this.isPaidAccountState.subscribe(
      data => this.isPaidAccount = data
    );

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
          this.boardNote = newNoteArray[this.data.index];
        }
      }
    )
  }

  deleteNote(){
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
          if(this.data.name === 'main'){
            this._httpService.deleteBoardNote(this.boardNote.id, this.data.index);
          }else{
            this._httpService.deleteBoardNoteTP(this.trainingPlan.id, this.boardNote.id, this.data.index);
          }
        }else if(this.athleteCardMode){
          this._httpService.deletePlatformNote(this.athlete.id, this.boardNote)
        }
        this.dialogRef.close();
      }
    })
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  editNote(){
    this.board_note_name = this.boardNotes[this.data.index].board_note_name;
    this.board_note_link = this.boardNotes[this.data.index].board_note_link;
    this.board_note_description = this.boardNotes[this.data.index].board_note_description;
    
    const dialogRef = this._dialog.open(NoteCreatorComponent, {
      width: '408px',
      data: {
        board_note_name: this.boardNotes[this.data.index].board_note_name, 
        board_note_link: this.boardNotes[this.data.index].board_note_link, 
        board_note_description: this.boardNotes[this.data.index].board_note_description
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
            id: this.boardNote.id
          }
          if(this.data.name === 'main'){
            this._httpService.patchBoardNote(note, this.boardNote.id,  this.data.index)
          }else{
            this._httpService.patchBoardNoteTP(note, this.trainingPlan.id, note.id,  this.data.index)
          }
        }else if(this.athleteCardMode){
          let note = {
            platform_note_name : result.board_note_name,
            platform_note_link : result.board_note_link,
            platform_note_description : result.board_note_description,
            platform_note_safe_link : this._sanitizer.bypassSecurityTrustResourceUrl(link),
            id: this.boardNote.id
          }
          this._httpService.patchPlatformNote(this.athlete.id, note);
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.boardNotesSub.unsubscribe();
    this.athleteCardModeSub.unsubscribe();
    this.athleteSub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.trainingPlanSub.unsubscribe();
  }
}
