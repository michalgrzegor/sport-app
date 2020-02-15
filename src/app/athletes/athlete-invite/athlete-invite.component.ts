
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { HttpClientService } from 'src/app/shared/http-client.service';
import { Store } from '@ngrx/store';
import * as AthleteDataActions from '../../shared/store/athletes-data.actions';
import * as fromApp from '../../shared/store/app.reducers';

export interface IsInvited {
  isInvited: boolean;
  email: string;
  id: number;
  status: number;
  invite_id: number;
  succes: boolean;
}

@Component({
  selector: 'app-athlete-invite',
  templateUrl: './athlete-invite.component.html',
  styleUrls: ['./athlete-invite.component.css']
})
export class AthleteInviteComponent implements OnInit, OnDestroy {

  isValidState: Observable<boolean>;
  isValidSub: Subscription;
  isValid: boolean = false;
  
  spinnerInviteState: Observable<boolean>;
  spinnerInviteSub: Subscription;
  spinnerInvite: boolean = false;
  
  invitationSuccesState: Observable<boolean>;
  invitationSuccesSub: Subscription;
  invitationSucces: boolean;
  
  responsEmailState: Observable<number>;
  responsEmailSub: Subscription;
  responsEmail: number = 1;
  
  userIDState: Observable<string>;
  userIDSub: Subscription;
  userID: string = null;
  
  invite_idState: Observable<number>;
  invite_idSub: Subscription;
  invite_id: number = null;

  usersByEmailState: Observable<any[]>;
  usersByEmailSub: Subscription;
  usersByEmail: any[] = null;

  index: number

  constructor(
    private _store: Store<fromApp.AppState>,
    private _httpService: HttpClientService,
    public dialogRef: MatDialogRef<AthleteInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IsInvited) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this._store.dispatch(new AthleteDataActions.SpinnerOnOffInvite(false));
    this._store.dispatch(new AthleteDataActions.IsValidOnOff(false));
    this._store.dispatch(new AthleteDataActions.ResponseEmailStatus({status: 1, id: null}));
    this._store.dispatch(new AthleteDataActions.SetInvitationSucces(false));

    this.isValidState = this._store.select(state => state.athletes.isValid);
    this.isValidSub = this.isValidState.subscribe(
      data => {
        this.isValid = data;
      }
    );

    this.userIDState = this._store.select(state => state.athletes.userID);
    this.userIDSub = this.userIDState.subscribe(
      data => {
        this.userID = data;
      }
    );

    this.invite_idState = this._store.select(state => state.athletes.responseId);
    this.invite_idSub = this.invite_idState.subscribe(
      data => {
        this.invite_id = data;
      }
    );

    this.invitationSuccesState = this._store.select(state => state.athletes.invitationSucces);
    this.invitationSuccesSub = this.invitationSuccesState.subscribe(
      data => {
        this.invitationSucces = data;
      }
    );

    this.spinnerInviteState = this._store.select(state => state.athletes.spinnerInvite);
    this.spinnerInviteSub = this.spinnerInviteState.subscribe(
      data => {
        this.spinnerInvite = data;
      }
    );

    this.responsEmailState = this._store.select(state => state.athletes.responsEmail);
    this.responsEmailSub = this.responsEmailState.subscribe(
      data => {
        this.responsEmail = data;
      }
    );

    this.usersByEmailState = this._store.select(state => state.athletes.usersByEmail);
    this.usersByEmailSub = this.usersByEmailState.subscribe(
      data => {
        this.usersByEmail = data;
      }
    );
  }

  search(){
    this._store.dispatch(new AthleteDataActions.SpinnerOnOffInvite(true));
    this._httpService.searchUser(this.data.email)
  }

  submitInvitation(){
    this.data.status = this.responsEmail;
    this.data.invite_id = this.invite_id
    if(this.responsEmail === 2){
      this._httpService.inviteExistUser(this.data.id, this.userID, this.data.email)
    }else if(this.responsEmail === 3){
      this._httpService.inviteNewUser(this.data.id, this.data.email)
    }else if(this.responsEmail === 4){
      this._httpService.inviteExistUser(this.data.id, this.userID, this.data.email)
    }
    this.data.succes = true;
  }

  chooseUser(user, index: number){
    this.index = index
    this._store.dispatch(new AthleteDataActions.IsValidOnOff(true));
    this._store.dispatch(new AthleteDataActions.SetInviteId(user.user_id));

  }

  closeDialog(){
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    this.isValidSub.unsubscribe();
    this.spinnerInviteSub.unsubscribe();
    this.responsEmailSub.unsubscribe();
    this.userIDSub.unsubscribe();
    this.invite_idSub.unsubscribe();
    this.usersByEmailSub.unsubscribe();
    this.invitationSuccesSub.unsubscribe();
  }

}
