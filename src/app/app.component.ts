import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Loops, LoopsDays, Tags } from './shared/store/loops.reducers';
import { TrainingPlan, Invitation } from './shared/store/tiles-data.reducers';
import { Subscription, Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints, MediaMatcher } from '@angular/cdk/layout'
import { MatDialog, MatSnackBar } from '@angular/material';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { QuestionsDialogComponent } from './questions-dialog/questions-dialog.component';
import { Tile } from './models/tile';
import { TrainingPlanEditorComponent } from './training-plan/training-plan-editor/training-plan-editor.component';
import { PaymentComponent } from './payment/payment.component';
import { VerifyDialogLeavePlatformComponent } from './verify-dialog-leave-platform/verify-dialog-leave-platform.component';
import { StepperComponent } from './tutorial/stepper/stepper.component';
import { environment } from 'src/environments/environment';

import { PollingService } from './shared/polling.service';
import { HttpPaymentClientService } from './shared/http-payment-client.service';
import { HttpClientService } from './shared/http-client.service';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './shared/data.service';
import { GoogleAnalyticsService } from './shared/google-analytics.service';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import * as fromApp from './shared/store/app.reducers';
import * as TilesDataActions from './shared/store/tiles-data.actions';
import * as AthleteDataActions from './shared/store/athletes-data.actions';
import * as BoardDataActions from './shared/store/board-data.actions';
import * as ChartDataActions from './shared/store/chart-data.actions';
import * as LoopsActions from './shared/store/loops.actions';
import * as CalendarDataActions from './shared/store/calendar-data.actions';

declare let gtag: Function;
const URL_WSS = 'wss://gremmo-one.herokuapp.com/cable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('list1', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(300)]),
      transition('* => void', [
        animate(10, style({
          opacity: 0
        }))]),
      ]),
      trigger('rotate', [
        state('show', style({transform: 'rotate(0deg)'})),
        state('hide', style({transform: 'rotate(90deg)'})),
        transition('show => hide', animate('0.02s ease-in')),
        transition('hide => show', animate('0.02s ease-out'))
      ])
    ]
  })
export class AppComponent implements OnInit, OnDestroy {
  get stateName() {
    return this.isTPOpen ? 'hide' : 'show'
  }

  isTilesCollectionModeState: Observable<boolean>;
  isTilesCollectionModeSub: Subscription;
  isTilesCollectionMode: boolean;

  tilesState: Observable<Tile[]>;
  tilesSub: Subscription;
  tiles: Tile[];

  isTpCollectionModeState: Observable<boolean>;
  isTpCollectionModeSub: Subscription;
  isTpCollectionMode: boolean;

  isSearchModeState: Observable<boolean>;
  isSearchModeSub: Subscription;
  isSearchMode: boolean;

  isCategoryModeState: Observable<boolean>;
  isCategoryModeSub: Subscription;
  isCategoryMode: boolean;

  isInGroupState: Observable<boolean>;
  isInGroupSub: Subscription;
  isInGroup: boolean;

  allTPNamesState: Observable<[]>;
  allTPNamesSub: Subscription;
  allTPNames: [];

  invitationsState: Observable<Invitation[]>;
  invitationsSub: Subscription;
  invitations: Invitation[] = [];

  loopsState: Observable<Loops[]>;
  loopsSub: Subscription;
  loops: Loops[];

  loopsDaysState: Observable<LoopsDays[]>;
  loopsDaysSub: Subscription;
  loopsDays: LoopsDays[];

  notificationsState: Observable<any[]>;
  notificationsSub: Subscription;
  notifications: any[] = [];
  athleteNotifications: any[] = [];

  isAuthState: Observable<boolean>;
  isAuthSub: Subscription;
  isAuth: boolean;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  isTrialState: Observable<boolean>;
  isTrialSub: Subscription;
  isTrial: boolean;

  isInPlatformState: Observable<boolean>;
  isInPlatformSub: Subscription;
  isInPlatform: boolean;

  isAuthenticatedState: Observable<boolean>;
  isAuthenticatedSub: Subscription;
  isAuthenticated: boolean;

  tagsState: Observable<Tags>;
  tagsSub: Subscription;
  tags: Tags;

  isChatOnState: Observable<boolean>;
  isChatOnSub: Subscription;
  isChatOn: boolean;
  
  athleteAccountonPaidAccountState: Observable<boolean>;
  athleteAccountonPaidAccountSub: Subscription;
  athleteAccountonPaidAccount: boolean;
  
  paidAccountForDisplaysState: Observable<boolean>;
  paidAccountForDisplaysSub: Subscription;
  paidAccountForDisplays: boolean;

  loopsToNotifications: LoopsDays[] = [];

  menuLeftWidth: boolean = true;
  menuRight: any = '365px';
  profileSub: Subscription;
  profile: any;
  menuRightHide: boolean = true;
  isTPOpen: boolean = true;
  training_plan_name: string;
  date_from: string;
  date_to: string;
  training_sesion_number: string;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  //routes variables
  mainRoute: string = 'calendar';
  queryParam: any = null;
  routeSub: Subscription;

  //subscription variables
  isManage: boolean;

  isVerified: boolean;

  pollingSubscribe: Subscription;

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor( 
    public _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _store: Store<fromApp.AppState>,
    private _cd: ChangeDetectorRef,
    public _dialog: MatDialog,
    public _breakpointObserver: BreakpointObserver,
    private _swUpdate: SwUpdate,
    private _snackBar: MatSnackBar,
    private _media: MediaMatcher,
    private _cookieService: CookieService,
    private _httpService: HttpClientService,
    private _httpPaymentService: HttpPaymentClientService,
    private _analytics: GoogleAnalyticsService,
    private _pollingService: PollingService,
    private _data: DataService,
    private _swPush: SwPush
    ) {
    this.mobileQuery = _media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => _cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this._router.events.subscribe(event => {
      if(event instanceof NavigationEnd){

        gtag('config', 'UA-148354485-1', {'page_path': event.urlAfterRedirects});
      }
    })
  }



  ngOnInit() {
    this._store.dispatch(new CalendarDataActions.SetTutorial(false));
    this._store.dispatch(new CalendarDataActions.SetClose(false));

    //check for invitation

    if(this.getInvitations() && this.getInvitations() !== `[object Object]`){
      const invArray = JSON.parse(this.getInvitations());
      this._store.dispatch(new TilesDataActions.SetInvitations(invArray));
    }


    //auth0 handle login

    this._authService.handleLoginCallback();

    //active route params
    
    this.routeSub = this._route.queryParams.subscribe(
      param => {
        this.queryParam = param.right;
      }
    )
    //service worker logic

    if(this._swUpdate.isEnabled){
      this._swUpdate.available.subscribe(
        () => {
          //Open Snack Bar
          let snackBarRef = this._snackBar.open(`New version available. Load New Version?`, `RELOAD`, {duration: 6000});
          //Add functionality after close
          snackBarRef.onAction().subscribe(() => {
            window.location.reload();
          })
        }
      )
    };

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
    

    //data from ngrx

    this.athleteAccountonPaidAccountState = this._store.select(state => state.tiles.athleteAccountonPaidAccount);
    this.athleteAccountonPaidAccountSub = this.athleteAccountonPaidAccountState.subscribe(
      data => {
        this.athleteAccountonPaidAccount = data;
        if(data && this.loopsDays){
          this.makeTags();
        }
        }
    );

    this.paidAccountForDisplaysState = this._store.select(state => state.tiles.paidAccountForDisplays);
    this.paidAccountForDisplaysSub = this.paidAccountForDisplaysState.subscribe(
      data => {
        this.paidAccountForDisplays = data;
        }
    );

    this.isAuthenticatedState = this._store.select(state => state.tiles.isAuth);
    this.isAuthenticatedSub = this.isAuthenticatedState.subscribe(
      data => {
        this.isAuthenticated = data;
        if(data && this.isInGroup){
          setTimeout(()=>this.polling(),2000);
        }
      }
    );

    this.loopsState = this._store.select(state => state.loops.loops);
    this.loopsSub = this.loopsState.subscribe(
      data => {
        if(data){
          this.loops = data;
          this._store.dispatch(new LoopsActions.MakeLoopsDay(data))
        }
      }
    );

    this.notificationsState = this._store.select(state => state.loops.notifications);
    this.notificationsSub = this.notificationsState.subscribe(
      data => {
        if(data){
          this.notifications = data;
        }
      }
    );

    this.loopsDaysState = this._store.select(state => state.loops.loopsDay);
    this.loopsDaysSub = this.loopsDaysState.subscribe(
      data => {
        if(data){
          this.loopsDays = data;
          if(this.athleteAccountonPaidAccount){
            this.makeTags();
          }
        }
      }
    );

    this.tagsState = this._store.select(state => state.loops.tags);
    this.tagsSub = this.tagsState.subscribe(
      data => {
        if(data){
          this.tags = data;
          if(this.loopsDays){
            this.makeNotificationsArray(this.loopsDays);
          }
        }
      }
    );
    
    
    this.tilesState = this._store.select(state => state.tiles.tiles);
    this.tilesSub = this.tilesState.subscribe(
      data => {
        this.tiles = data;
      }
    );
    
    this.isInPlatformState = this._store.select(state => state.athletes.isInPlatform);
    this.isInPlatformSub = this.isInPlatformState.subscribe(
      data => {
        this.isInPlatform = data;
      }
    );
    
    this.isInGroupState = this._store.select(state => state.tiles.isInGroup);
    this.isInGroupSub = this.isInGroupState.subscribe(
      data => {
        this.isInGroup = data;
        if(data && this.isAuthenticated){
          setTimeout(()=>this.polling(),2000);
        }else if(!data && this.pollingSubscribe && this.isAuthenticated){
          this.pollingSubscribe.unsubscribe();
        }
      }
    );
    
    this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
    this.isPaidAccountSub = this.isPaidAccountState.subscribe(
      data => this.isPaidAccount = data
    );

    this.isAuthState = this._store.select(state => state.tiles.isAuthenticated);
    this.isAuthSub = this.isAuthState.subscribe(
      data => {
        this.isAuth = data;
      }
    );
    
    this.isTilesCollectionModeState = this._store.select(state => state.tiles.isTilesCollectionMode);
    this.isTilesCollectionModeSub = this.isTilesCollectionModeState.subscribe(
      data => {
        this.isTilesCollectionMode = data;
        this._cd.detectChanges();
      }
    );
    
    this.isTpCollectionModeState = this._store.select(state => state.tiles.isTpCollectionMode);
    this.isTpCollectionModeSub = this.isTpCollectionModeState.subscribe(
      data => {
        this.isTpCollectionMode = data;
        this._cd.detectChanges();
      }
    );

    this.isSearchModeState = this._store.select(state => state.tiles.isSearchMode);
    this.isSearchModeSub = this.isSearchModeState.subscribe(
      data => {
        this.isSearchMode = data;
      }
    );

    this.allTPNamesState = this._store.select(state => state.calendar.allTPNames);
    this.allTPNamesSub = this.allTPNamesState.subscribe(
      data => {
        this.allTPNames = data;
        
        this.isTPOpen = false;
      }
    );

    this.invitationsState = this._store.select(state => state.tiles.invitations);
    this.invitationsSub = this.invitationsState.subscribe(
      data => {
        this.invitations = data;
        if(data){
          this.setInvitations(JSON.stringify(data) );
          if(this.getUserProfile()){
            const profile = JSON.parse(this.getUserProfile());
            if(profile['https://sport.app.comapp_metadata'] && profile['https://sport.app.comapp_metadata'].invitations){
              profile['https://sport.app.comapp_metadata'].invitations = data;
            }
            this._cookieService.set('profile', JSON.stringify(profile));
          }
        }
      }
    );

    this.isCategoryModeState = this._store.select(state => state.tiles.isCategoryMode);
    this.isCategoryModeSub = this.isCategoryModeState.subscribe(
      data => {
        this.isCategoryMode = data;
      }
    );

    this.profileSub = this._authService.profile.subscribe(
      profile => {
        this.profile = profile
      }
    );

    this.isTrialState = this._store.select(state => state.tiles.isTrial);
    this.isTrialSub = this.isTrialState.subscribe(
      data => this.isTrial = data
    );
    
    if(this._authService.isAuthenticated()){
      this.profile = JSON.parse(this._cookieService.get('profile'));
    };
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  getInvitations(){
    const invitations = this._cookieService.get('invitations');
    return invitations;
  }

  setInvitations(invitations){
    this._cookieService.set('invitations', invitations);
  }

  //main menu function

  polling(): void {
    this.pollingSubscribe = this._pollingService.invitationsPolling$.subscribe((data: Invitation[]) => {
      if(data.length > 0){
        this.invitations = data;
        this.setInvitations(JSON.stringify(data) );
        if(this.getUserProfile()){
          const profile = JSON.parse(this.getUserProfile());
          if(profile['https://sport.app.comapp_metadata'] && profile['https://sport.app.comapp_metadata'].invitations){
            profile['https://sport.app.comapp_metadata'].invitations = data;
          }
          this._cookieService.set('profile', JSON.stringify(profile));
        };
        this._store.dispatch(new TilesDataActions.SetInGroup(false))
      }
    });
  }

  onTileEditor(): void {
    this.toNormal();
    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], { queryParams: { 'right': 'tileeditor' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tileeditor']);
      this._store.dispatch(new TilesDataActions.SeteMainRoute('tileeditor'))
    }
  }

  onTileCollection(): void {
    this.toNormal();
    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], {queryParams: { 'right': 'tilecollection' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tilecollection']);
      this._store.dispatch(new TilesDataActions.SeteMainRoute('tilecollection'))
    }
  }

  onCallendar(): void {
    if(this.isPaidAccount){
      this.toNormal();
    }
    if(this.isWeb){
      this._router.navigate(['/calendar'], { queryParams: { 'right': 'tp' }});
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/calendar'])
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }
  }

  onBoard(): void{
    if(this.isPaidAccount){
      this.toNormal();
    }
    this._router.navigate(['/board'], {queryParams: { 'right': `tp`}});
    this.mainRoute = 'board';
    this._store.dispatch(new TilesDataActions.SeteMainRoute('board'))
  }

  onLoops(): void{
    if(this.isPaidAccount){
      this.toNormal();
    }
    this._router.navigate(['/loops'], {queryParams: { 'right': `${this.queryParam}`}});
    this.mainRoute = 'loops';
    this._store.dispatch(new TilesDataActions.SeteMainRoute('loops'))
  }

  onChart(): void{
    this._store.dispatch(new ChartDataActions.Loading(true))
    this.toSmall();
    this._router.navigate(['/chart'], {queryParams: { 'right': `tp`}});
    this.mainRoute = 'chart';
    this._store.dispatch(new TilesDataActions.SeteMainRoute('chart'))
  }

  onAthletes(): void{
    this.toNormal();
    if(this.isWeb){
      this._router.navigate(['/athletecard'], { queryParams: { 'right': 'athletemanager'}});
      this.mainRoute = 'athletecard';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('athletecard'))
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/athletecard'])
      this.mainRoute = 'athletecard';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('athletecard'))
    }
  }

  onAthleteAccount(){
    this.notifications = this.athleteNotifications;

    this.toSmall();
    if(this.isWeb){
      this._router.navigate(['/calendar'], { queryParams: { 'right': 'tp' }});
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/calendar'])
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }

    this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(true));
    this._store.dispatch(new TilesDataActions.IsPaidAccountSet(false));
    this._store.dispatch(new TilesDataActions.AccountLevelSet(0));
    this._store.dispatch(new TilesDataActions.AccountTrialSet(false));
    this._store.dispatch(new TilesDataActions.SetTpManager(null));
    this._store.dispatch(new TilesDataActions.SetAthleteAccountOnPaidAccount(true));
    this._store.dispatch(new TilesDataActions.SetAthleteAccount(true));
    this._httpService.getTrainingPlanFromPlatform();
  }

  onTrainerAccount(){
    this._store.dispatch(new TilesDataActions.SpinnerStartStopCalendar(true));
    this.athleteNotifications = this.notifications;
    this.notifications = [];

    this.toNormal();
    if(this.isWeb){
      this._router.navigate(['/calendar'], { queryParams: { 'right': 'tp' }});
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/calendar'])
      this.mainRoute = 'calendar';
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }


    let app_metadata = null;
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    };
    
    this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
    this._store.dispatch(new TilesDataActions.SetAthleteAccountOnPaidAccount(false));

    if(this.getUserProfile() && app_metadata && app_metadata.account_level_data.account_level === 0){
      //there is athlete acount
      this._store.dispatch(new TilesDataActions.IsPaidAccountSet(false));
      this._store.dispatch(new TilesDataActions.AccountLevelSet(0));
      this._store.dispatch(new TilesDataActions.AccountTrialSet(false));
    }else if(this.getUserProfile() && app_metadata && app_metadata.account_level_data.account_level === 1 && !app_metadata.account_level_data.current_paid_access_end_date){
      //there is trial account
      this._store.dispatch(new TilesDataActions.IsPaidAccountSet(true));
      this._store.dispatch(new TilesDataActions.AccountLevelSet(1));
      this._store.dispatch(new TilesDataActions.AccountTrialSet(true));
      // this._store.dispatch(new TilesDataActions.FetchTrainingPlan());
      this._store.dispatch(new TilesDataActions.SetNoTp(true));
      this._store.dispatch(new TilesDataActions.FetchTpManager());
      this._store.dispatch(new TilesDataActions.FetchTiles());
      this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      if(app_metadata.account_level_data.trial_end_date*1000 < Date.now()){
        this._store.dispatch(new TilesDataActions.IsPaidAccountSet(false));
        this._store.dispatch(new TilesDataActions.AccountLevelSet(0));
        this._store.dispatch(new TilesDataActions.AccountTrialSet(false));
      }
    }else if(this.getUserProfile() && app_metadata && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date){
      //there is paid account
      if(app_metadata.account_level_data.current_paid_access_end_date*1000 > Date.now()){
        //tutaj idzie logika gdy jest dostęp
        this._store.dispatch(new TilesDataActions.IsPaidAccountSet(true));
        this._store.dispatch(new TilesDataActions.AccountLevelSet(app_metadata.account_level_data.account_level));
        this._store.dispatch(new TilesDataActions.SetNoTp(false));
        this._store.dispatch(new TilesDataActions.FetchTpManager());
        this._store.dispatch(new TilesDataActions.FetchTiles());
        this._store.dispatch(new TilesDataActions.SetAthleteAccount(false));
      }
    }
  }

  //function controling menu moves
  toggle() {
    this.menuLeftWidth = !this.menuLeftWidth;
    this._store.dispatch(new ChartDataActions.SetLeftOpen(this.menuLeftWidth))
    this.isTPOpen = false;
    if(this.menuRight === '69px' && !this.menuLeftWidth){
      //ismax true
      this._store.dispatch(new BoardDataActions.IsMaxWidthToggle(true));
    }else{
      //ismax false
      this._store.dispatch(new BoardDataActions.IsMaxWidthToggle(false));
    }
  }

  toNormal() {
    this._store.dispatch(new ChartDataActions.SetOpen(true));
    this.menuRight = '365px';
    this.menuRightHide = true;
    this._store.dispatch(new BoardDataActions.IsMaxWidthToggle(false));
    this._store.dispatch(new ChartDataActions.OpenCloseRightPanel('open'));
  }

  toSmall() {
    this._store.dispatch(new ChartDataActions.SetOpen(false));
    this.menuRight = '69px';
    this.menuRightHide = false;
    if(!this.menuLeftWidth){
      //ismax true
      this._store.dispatch(new BoardDataActions.IsMaxWidthToggle(true));
    }
    this._store.dispatch(new ChartDataActions.OpenCloseRightPanel('close'));
  }

  enterCategoryMode(){
    if(this.isCategoryMode){
      this._store.dispatch(new TilesDataActions.TypeSearch(''));
      this._store.dispatch(new TilesDataActions.TagsSearch(''));
    }
    this._store.dispatch(new TilesDataActions.EnterCategoryMode())
  }

  toggleFilter(){
    this._store.dispatch(new TilesDataActions.FilterModeSwitch())
  }

  enterSearchMode(){
    if(this.isSearchMode){
      this._store.dispatch(new TilesDataActions.SearchWord(''));
    }
    this._store.dispatch(new TilesDataActions.EnterSearchMode())
  }

  openAllTP(){
    this.menuLeftWidth = true;
    this.isTPOpen = !this.isTPOpen;
  }

  openTPEditor(){
    this.training_plan_name = null;
    this.date_from = null;
    this.date_to = null;
    this.training_sesion_number = null;

    const dialogRef = this._dialog.open(TrainingPlanEditorComponent, {
      width: `408px`,
      data: {training_plan_name: this.training_plan_name, date_from: this.date_from, date_to: this.date_to, training_sesion_number: this.training_sesion_number }
    });

    const newTP: TrainingPlan = {
      training_plan_name: null,
      date_from: moment().format('YYYY-MM-DD'),
      date_to: moment().add(1, 'month').format('YYYY-MM-DD'),
      training_sesion_number: null,
      calendar_assocs: [],
      calendar_stars: []
    }

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.training_plan_name = result.training_plan_name;
        this.date_from = result.date_from;
        this.date_to = result.date_to;
        this.training_sesion_number = result.training_sesion_number;
        
        newTP.training_plan_name = result.training_plan_name;
        if(result.date_from !== null){
          newTP.date_from = moment(result.date_from).format('YYYY-MM-DD');
        }
        if(result.date_to !== null){
          newTP.date_to = moment(result.date_to).format('YYYY-MM-DD');
        }
        newTP.training_sesion_number = result.training_sesion_number;

        this._store.dispatch(new TilesDataActions.SetTrainingPlan(newTP))
      }
    })
  }

  openAnswers(not, index: number){
    const tilesFiltered = [];
    this.tiles.forEach(tile => {
      not.questions.forEach(q => {
        if(q === tile.tile_id){
          tilesFiltered.push(Object.assign({}, tile))
        }
      })
    });
    const formAnswer = []
    not.questions.forEach(
      id => {
        formAnswer.push(
          {
            tile_id : id,
            question_date : not.date,
            question_answer: null,
            answer_comment: null,
            noQuestion: false
          }
        )
      }
    )
    const dialogRef = this._dialog.open(QuestionsDialogComponent, {
      autoFocus: false,
      id: `tp-editor`,
      width: `408px`,
      data: {date: not.date, sessionNumber: not.sessionNumber, questions: not.questions, tiles: tilesFiltered, calendar_assoc_id: not.calendar_assoc_id, formAnswer: formAnswer}
    });

    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const nots = [...this.notifications];
        nots.splice(index,1);
        const jsonForRequest = {
          question_answers: result.formAnswer,
          calendar_assoc_id: result.calendar_assoc_id
        }
        this._httpService.postAnswers(jsonForRequest,nots);
      }
    })
  }

  makeTags(){
    let app_metadata = null;
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
        app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    }
    if(this.getUserProfile() && app_metadata && app_metadata.tags){
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

        this._httpService.setTagsQuestions(tags);
      }
  }

  makeNotificationsArray(loopsDays: LoopsDays[]){
    const now = moment().valueOf();
    const notifications = [];
    loopsDays.forEach(
      loop => {
        loop.sessions.forEach(
          session => {
            const notification = {
              date: moment(loop.date).format("YYYY-MM-DD") ,
              sessionNumber: null,
              questions: session.questions,
              calendar_assoc_id: session.calendar_asocs
            };
            if(session.training_sesion === 1 && session.questions.length > 0 && moment(loop.date).valueOf()+this.tags.firstTSTag <= now){
              notification.sessionNumber = '1st';
              notifications.push(notification);
            }else if(session.training_sesion === 2 && session.questions.length > 0 && moment(loop.date).valueOf()+this.tags.secondTSTag <= now){
              notification.sessionNumber = '2nd';
              notifications.push(notification);
            }else if(session.training_sesion === 3 && session.questions.length > 0 && moment(loop.date).valueOf()+this.tags.thirdTSTag <= now){
              notification.sessionNumber = '3rd';
              notifications.push(notification);
            }
          }
        )
      }
    )

    this._store.dispatch(new LoopsActions.SetNotifications(notifications));
  };

  cancelInvitation(invitation: Invitation, index: number){
    this._httpService.deleteInvitation(invitation.platform_token, index);
  }

  acceptInvitation(invitation: Invitation, index: number){
    this._httpService.acceptInvitation(invitation.platform_token);
    this.invitations = [];
  }

  openUpgradeDialog(){
    this.isManage = false;

    const dialogRef = this._dialog.open(PaymentComponent, {
      autoFocus: false,
      id: `payment`,
      width: `408px`,
      maxHeight: `90vh`,
      data: {isManage: this.isManage}
    });

    this._analytics.eventEmitter('view_item_list', 'engagement', 'open_upgrade');
  }

  onManageSubscription(){
    this.isManage = true;

    const dialogRef = this._dialog.open(PaymentComponent, {
      autoFocus: false,
      id: `payment`,
      width: `408px`,
      maxHeight: `90vh`,
      data: {isManage: this.isManage}
    });

  }

  exitPlatform(){
    const isVerifiedSub = this._dialog.open(VerifyDialogLeavePlatformComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    });
    isVerifiedSub.afterClosed().subscribe(result => {
      this.isVerified = result;
      if(result){
        this._httpService.exitFromPlatform();
        this._store.dispatch(new AthleteDataActions.SetIsInPlatform(false));
        this._store.dispatch(new TilesDataActions.SetInGroup(true));
      }
    })
  };

  openTutorial(){
    if(this.isWeb){
      this._router.navigate(['/calendar'], { queryParams: { 'right': 'tp' }});
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/calendar'])
      this._store.dispatch(new TilesDataActions.SeteMainRoute('calendar'))
    }
    let width = '38%';
    if(!this.isWeb){width = `95%`};

    const dialogRef = this._dialog.open(StepperComponent, {
      autoFocus: false,
      id: 'tp-editor',
      width: width,
      height: '80%',
      data: {firstTimeUser: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      this._store.dispatch(new CalendarDataActions.SetTutorial(false));
    })
  }
  
  ngOnDestroy() {
    this.profileSub.unsubscribe();
    this.isTilesCollectionModeSub.unsubscribe();
    this.isSearchModeSub.unsubscribe();
    this.isCategoryModeSub.unsubscribe();
    this.allTPNamesSub.unsubscribe();
    this.loopsSub.unsubscribe();
    this.loopsDaysSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.tilesSub.unsubscribe();
    this.isTpCollectionModeSub.unsubscribe();
    this.invitationsSub.unsubscribe();
    this.isAuthSub.unsubscribe();
    this.isTrialSub.unsubscribe();
    this.isInPlatformSub.unsubscribe();
    this.athleteAccountonPaidAccountSub.unsubscribe();
    this.paidAccountForDisplaysSub.unsubscribe();
    this.tagsSub.unsubscribe();
    this.isInGroupSub.unsubscribe();
    this.notificationsSub.unsubscribe();
    this.isAuthenticatedSub.unsubscribe();
    this.isChatOnSub.unsubscribe();
    this.pollingSubscribe.unsubscribe();
  }
}
