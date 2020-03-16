import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CreatorComponent } from '../creator/creator.component';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as CalendarDataActions from '../../shared/store/calendar-data.actions';

export interface StepperData {
  firstTimeUser: boolean
}

type PaneType = 'one' | 'two' | 'three' | 'four' | 'five';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  animations: [
    trigger('slide', [
      state('one', style({ transform: 'translateX(0)' })),
      state('two', style({ transform: 'translateX(-20%)' })),
      state('three', style({ transform: 'translateX(-40%)' })),
      state('four', style({ transform: 'translateX(-60%)' })),
      state('five', style({ transform: 'translateX(-80%)' })),
      transition('* => *', animate(300))
  ]),
    trigger('slideClient', [
      state('one', style({ transform: 'translateX(0)' })),
      state('two', style({ transform: 'translateX(-33.3333333%)' })),
      state('three', style({ transform: 'translateX(-66.6666666%)' })),
      transition('* => *', animate(300))
  ])
]
})
export class StepperComponent implements OnInit {

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  activeStep: number = 0;
  activePane: string = 'one';
  panes = ['one', 'two', 'three', 'four', 'five']
  activeStepClient: number = 0;
  activePaneClient: string = 'one';
  panesClient = ['one', 'two', 'three']

  isWelcome = true;
  isClient = false;


  constructor(
    public dialogRef: MatDialogRef<StepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StepperData,
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    public _dialog: MatDialog
    ) {}

  ngOnInit() {

    this._store.dispatch(new CalendarDataActions.SetTutorial(true));
    this._store.dispatch(new CalendarDataActions.SetClose(false));

    //break points

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
  }

  welcomeOff(){
    this.isWelcome = false;
    this.isClient = false;
  }

  toClient(){
    this.isWelcome = false;
    this.isClient = true;
  }

  activateStep(number: string){
    this.activePane = number;
    this.activeStep = this.panes.indexOf(number);
  }

  activateNextStep(number: number){
    this.activeStep = this.activeStep + number;
    this.activePane = this.panes[this.activeStep];
  }

  activateStepClient(number: string){
    this.activePaneClient = number;
    this.activeStepClient = this.panesClient.indexOf(number);
  }

  activateNextStepClient(number: number){
    this.activeStepClient = this.activeStepClient + number;
    this.activePaneClient = this.panesClient[this.activeStepClient];
  }

  onNoClick(): void {
    this.dialogRef.close();
    
  }

  openCreator(kind: string){
    let width = '24%';
    if(!this.isWeb){width = `95%`};

    this._dialog.open(CreatorComponent, {
      autoFocus: false,
      id: 'creator',
      width: width,
      data: {creator: kind}
    });
  }
}
