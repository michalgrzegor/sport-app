import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CustomAthleteParameter, PlatformNote, Athlete } from 'src/app/shared/store/athletes-data.reducers';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HttpClientService } from 'src/app/shared/http-client.service';
import { TpInfo } from 'src/app/shared/store/tiles-data.reducers';
import { HttpPaymentClientService } from 'src/app/shared/http-payment-client.service';
import { MatDialog } from '@angular/material';
import { AthleteInviteComponent } from '../athlete-invite/athlete-invite.component';
import { VerifyDialogInvitationComponent } from '../verify-dialog-invitation/verify-dialog-invitation.component';
import { Subscription, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';

import { PollingService } from 'src/app/shared/polling.service';

@Component({
  selector: 'app-athlete-info',
  templateUrl: './athlete-info.component.html',
  styleUrls: ['./athlete-info.component.css']
})
export class AthleteInfoComponent implements OnInit, OnDestroy {
  @Input() isActivatedPlan: boolean;
  @Input() activatedPlan: boolean;
  @Input() unactiveTpManager: TpInfo[];

  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  athlete_name?: string;
  athlete_phone_number?: string;
  athlete_email?: string;
  athlete_sport_discipline?: string;
  athlete_age?: string;
  athlete_height?: string;
  athlete_weight?: string;
  athlete_arm?: string;
  athlete_chest?: string;
  athlete_waist?: string;
  athlete_hips?: string;
  athlete_tigh?: string;
  fitness_level?: number;
  custom_athlete_parameters?: CustomAthleteParameter[];
  platform_notes?: PlatformNote[];

  //form for static data
  isEditMode: boolean = false;
  athleteCard = new FormGroup({
    athlete_name: new FormControl('', [Validators.maxLength(255), Validators.required]),
    athlete_phone_number: new FormControl('', Validators.maxLength(255)),
    athlete_email: new FormControl('', Validators.maxLength(255)),
    athlete_sport_discipline: new FormControl('', Validators.maxLength(255)),
    athlete_age: new FormControl('', Validators.maxLength(255)),
    athlete_height: new FormControl('', Validators.maxLength(255)),
    athlete_weight: new FormControl('', Validators.maxLength(255)),
    athlete_arm: new FormControl('', Validators.maxLength(255)),
    athlete_chest: new FormControl('', Validators.maxLength(255)),
    athlete_waist: new FormControl('', Validators.maxLength(255)),
    athlete_hips: new FormControl('', Validators.maxLength(255)),
    athlete_tigh: new FormControl('', Validators.maxLength(255)),
  });

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  //errors
  errorMaxLengthShort: string = 'this field requied only 255 characters';
  errorReq: string = 'this field is required';

  isInvited: boolean;
  email: any;
  id: any;
  isVerifiedSub: any;
  isVerified: any;
  status: any;
  invite_id: any;

  chosenPlan: TpInfo;

  accepInvitationPolling: Subscription;
  emailForPolling: string;

  constructor(
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    private _httpService: HttpClientService,
    private _httpPaymentService: HttpPaymentClientService,
    public _dialog: MatDialog,
    private _pollingService: PollingService
  ) { }

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

    this.athleteState = this._store.select(state => state.athletes.athlete);
    this.athleteSub = this.athleteState.subscribe(
      data => {
        if(data){
          this.athlete = data;

          if(this.accepInvitationPolling){
            this.accepInvitationPolling.unsubscribe();
          }

          if(data.invitation){
            setTimeout(()=>{
              this.emailForPolling = data.invitation.athlete_email;
              this.accepInvitationPolling = this._pollingService.getAcceptInvitation(data.id).subscribe(
                (dataSub: any) => {
                  if(dataSub.athlete_in_platform){
                    // this._store.dispatch(new AthleteDataActions.UpdateAthlete({id: data.attendant_membership_id , email: this.email, status: 3}));
                    const a = {
                      athlete_email: this.emailForPolling,
                      id: dataSub.attendant_membership_id 
                    }
                    this.athlete.attendant_membership = a;
                    delete this.athlete.invitation
                    this.accepInvitationPolling.unsubscribe();
                  }
                }
              )
            },1000)
          }

          this.athleteCard.patchValue({
            athlete_name: data.athlete_name,
            athlete_phone_number: data.athlete_phone_number,
            athlete_email: data.athlete_email,
            athlete_sport_discipline: data.athlete_sport_discipline,
            athlete_age: data.athlete_age,
            athlete_height: data.athlete_height,
            athlete_weight: data.athlete_weight,
            athlete_arm: data.athlete_arm,
            athlete_chest: data.athlete_chest,
            athlete_waist: data.athlete_waist,
            athlete_hips: data.athlete_hips,
            athlete_tigh: data.athlete_tigh
          });

        }
      }
    )

  }

  onSubmit(){
    this.isEditMode = false;
    
    const athleteData = this.athleteCard.value;
    const athlete: Athlete = {
      athlete_name: athleteData.athlete_name,
      athlete_phone_number: athleteData.athlete_phone_number,
      athlete_email: athleteData.athlete_email,
      athlete_sport_discipline: athleteData.athlete_sport_discipline,
      athlete_age: athleteData.athlete_age,
      athlete_height: athleteData.athlete_height,
      athlete_weight: athleteData.athlete_weight,
      athlete_arm: athleteData.athlete_arm,
      athlete_chest: athleteData.athlete_chest,
      athlete_waist: athleteData.athlete_waist,
      athlete_hips: athleteData.athlete_hips,
      athlete_tigh: athleteData.athlete_tigh,
      fitness_level: this.athlete.fitness_level,
      custom_athlete_parameters: this.athlete.custom_athlete_parameters,
      platform_notes: this.athlete.platform_notes,
    } 
    
    this._httpService.patchAthlete(this.athlete.id, athlete)
  }

  editMode(){
    this.isEditMode = true;
  }

  closePersonal(){
    this.isEditMode = false;
    this.athleteCard.patchValue({
      athlete_name: this.athlete.athlete_name,
      athlete_phone_number: this.athlete.athlete_phone_number,
      athlete_email: this.athlete.athlete_email,
      athlete_sport_discipline: this.athlete.athlete_sport_discipline,
      athlete_age: this.athlete.athlete_age,
      athlete_height: this.athlete.athlete_height,
      athlete_weight: this.athlete.athlete_weight,
      athlete_arm: this.athlete.athlete_arm,
      athlete_chest: this.athlete.athlete_chest,
      athlete_waist: this.athlete.athlete_waist,
      athlete_hips: this.athlete.athlete_hips,
      athlete_tigh: this.athlete.athlete_tigh
    });
  }

  setLevel(number: number){
    this.athlete.fitness_level = number;
  }

  setPlan(tp: TpInfo){
    this.chosenPlan = tp;
  };

  deactivatePlan(){
    this._httpPaymentService.deactivatePlan(this.athlete.id, this.athlete.plan_appends[0].id, this.athlete.id);
  }

  activatePlan(){
    this._httpPaymentService.activatePlan(this.athlete.id, this.chosenPlan.id, this.athlete.id);
  }

  inviteAthlete(){
    this.isInvited = false;
    this.email = null;
    this.id = this.athlete.id;
    this.status = null;
    this.invite_id = null;

    const dialogRef = this._dialog.open(AthleteInviteComponent, {
      autoFocus: false,
      id: `tp-editor`,
      width: `408px`,
      data: {isInvited: this.isInvited, email: this.email, id: this.id, status: this.status, invite_id: this.invite_id, succes: false}
    });
  }

  removeInvitation(){
    this.isVerified = false;

    const dialogRef = this._dialog.open(VerifyDialogInvitationComponent, {
      autoFocus: false,
      width: '300px',
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._httpService.deleteInviteExistUser(this.athlete.id, this.athlete.invitation.id);
        if(this.accepInvitationPolling){
          this.accepInvitationPolling.unsubscribe();
        }
      }
    })
  }

  remowePending(){
    this.isVerified = false;

    const dialogRef = this._dialog.open(VerifyDialogInvitationComponent, {
      autoFocus: false,
      width: '300px',
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._httpService.deleteInviteNewUser(this.athlete.id, this.athlete.pending_user_invitation.id);
        if(this.accepInvitationPolling){
          this.accepInvitationPolling.unsubscribe();
        }
        
      }
    })
  }

  removeAthlete(){
    this._httpService.removeAthlete(this.athlete.id, this.athlete.attendant_membership.id)
  }

  ngOnDestroy(): void {
    this.athleteSub.unsubscribe();   
    if(this.accepInvitationPolling){
      this.accepInvitationPolling.unsubscribe()
    }
  }

}
