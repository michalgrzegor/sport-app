import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpPaymentClientService } from './../shared/http-payment-client.service';
import { PaymentServiceService } from './payment-service.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSliderChange } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { Store } from '@ngrx/store';
import * as fromApp from '../shared/store/app.reducers';
import * as TilesDataActions from '../shared/store/tiles-data.actions';

export interface Plan {
  user_amount: number;
  price: number;
  sub_name: string;
  plan_id: string;
}

export interface SubscriptionData {
  isManage: boolean;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  

  handler: any;
  planSubscriptions: Plan[] = [
    {
      user_amount: 6,
      price: 18,
      sub_name: '6 users',
      plan_id: 'plan_Fp0PDLA7iZuQ4Y'
    },
    {
      user_amount: 10,
      price: 24,
      sub_name: '10 users',
      plan_id: 'plan_Fp0P2vZZVN7bJv'
    },
    {
      user_amount: 14,
      price: 29,
      sub_name: '14 users',
      plan_id: 'plan_Fp0QjruxMOu2u8'
    },
    {
      user_amount: 18,
      price: 34,
      sub_name: '18 users',
      plan_id: 'plan_Fp0Q2nU7U97mup'
    },
    {
      user_amount: 22,
      price: 38,
      sub_name: '22 users',
      plan_id: 'plan_Fp0RJoJb55lVJY'
    },
    {
      user_amount: 26,
      price: 42,
      sub_name: '26 users',
      plan_id: 'plan_Fp0RbXAZcyatLt'
    },
    {
      user_amount: 30,
      price: 46,
      sub_name: '30 users',
      plan_id: 'plan_Fp0SVcG153V9oB'
    },
    {
      user_amount: 34,
      price: 49,
      sub_name: '34 users',
      plan_id: 'plan_Fp0S4MvHFjlAz7'
    },
    {
      user_amount: 38,
      price: 52,
      sub_name: '38 users',
      plan_id: 'plan_Fp0Svgy2aP7QPb'
    },
    {
      user_amount: 42,
      price: 55,
      sub_name: '42 users',
      plan_id: 'plan_Fp0TvK7dASqfFw'
    },
    {
      user_amount: 46,
      price: 58,
      sub_name: '46 users',
      plan_id: 'plan_Fp0TTXJ29v3Pdq'
    },
    {
      user_amount: 50,
      price: 60,
      sub_name: '50 users',
      plan_id: 'plan_Fp0T4WCqBa1yBJ'
    },
  ];


  planSubscrition: Plan = this.planSubscriptions[0];
  level: number = 1;
  sameLevel: boolean = false;


  cardPaymentState: Observable<boolean>;
  cardPaymentSub: Subscription;
  cardPayment: boolean = false;

  isManageState: Observable<boolean>;
  isManageSub: Subscription;
  isManage: boolean = false;

  planShowState: Observable<boolean>;
  planShowSub: Subscription;
  planShow: boolean = true;

  spinnerState: Observable<boolean>;
  spinnerSub: Subscription;
  spinner: boolean = false;

  isPaidState: Observable<boolean>;
  isPaidSub: Subscription;
  isPaid: boolean = false;

  isPaidAccountState: Observable<boolean>;
  isPaidAccountSub: Subscription;
  isPaidAccount: boolean;

  isTrialState: Observable<boolean>;
  isTrialSub: Subscription;
  isTrial: boolean;

  upgradeDowngradeState: Observable<boolean>;
  upgradeDowngradeSub: Subscription;
  upgradeDowngrade: boolean;

  managerState: Observable<boolean>;
  managerSub: Subscription;
  manager: boolean = false;

  confirmationState: Observable<boolean>;
  confirmationSub: Subscription;
  confirmation: boolean = false;

  accountLevelState: Observable<number>;
  accountLevelSub: Subscription;
  accountLevel: number;

  priceState: Observable<number>;
  priceSub: Subscription;
  price: number;

  @Input() amount: number;
  @Input() description: string;

 
  constructor(
    public _pmt: PaymentServiceService,
    public dialogRef: MatDialogRef<PaymentComponent>,
    private _store: Store<fromApp.AppState>,
    private _httpPaymentService: HttpPaymentClientService,
    private _cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: SubscriptionData,
  ) { }

  ngOnInit() {
    this.isPaid = false;
    this.spinner = false;
    this.planShow = true;
    this.isManage = this.data.isManage;
    this._store.dispatch(new TilesDataActions.UpgradeDowngradeSet(false));
    this._store.dispatch(new TilesDataActions.ConfirmationChangePlan(false));
    this._store.dispatch(new TilesDataActions.IsPaidChange(false));
    this._store.dispatch(new TilesDataActions.CardPaymentChange(false));

    let app_metadata
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata'];
      if(this.getUserProfile() && app_metadata && app_metadata.account_level_data.account_level > 0 && app_metadata.account_level_data.current_paid_access_end_date){
        if(app_metadata.account_level_data.current_paid_access_end_date*1000 > Date.now()){
          this._store.dispatch(new TilesDataActions.ManagerInit(true));
        }
      }
    }

    this.isPaidState = this._store.select(state => state.tiles.isPaid);
    this.isPaidSub = this.isPaidState.subscribe(
      data => this.isPaid = data
    );

    this.spinnerState = this._store.select(state => state.tiles.spinner);
    this.spinnerSub = this.spinnerState.subscribe(
      data => this.spinner = data
    );

    this.planShowState = this._store.select(state => state.tiles.planShow);
    this.planShowSub = this.planShowState.subscribe(
      data => this.planShow = data
    );

    this.confirmationState = this._store.select(state => state.tiles.confirmation);
    this.confirmationSub = this.confirmationState.subscribe(
      data => this.confirmation = data
    );

    this.upgradeDowngradeState = this._store.select(state => state.tiles.upgradeDowngrade);
    this.upgradeDowngradeSub = this.upgradeDowngradeState.subscribe(
      data => this.upgradeDowngrade = data
    );

    this.isManageState = this._store.select(state => state.tiles.isManage);
    this.isManageSub = this.isManageState.subscribe(
      data => this.isManage = data
    );

    this.cardPaymentState = this._store.select(state => state.tiles.cardPayment);
    this.cardPaymentSub = this.cardPaymentState.subscribe(
      data => {
        this.cardPayment = data}
    );

    this.isPaidAccountState = this._store.select(state => state.tiles.isPaidAccount);
    this.isPaidAccountSub = this.isPaidAccountState.subscribe(
      data => this.isPaidAccount = data
    );

    this.accountLevelState = this._store.select(state => state.tiles.accountLevel);
    this.accountLevelSub = this.accountLevelState.subscribe(
      data => this.accountLevel = data
    );

    this.priceState = this._store.select(state => state.tiles.price);
    this.priceSub = this.priceState.subscribe(
      data => this.price = data
    );

    this.managerState = this._store.select(state => state.tiles.manager);
    this.managerSub = this.managerState.subscribe(
      data => this.manager = data
    );

    this.isTrialState = this._store.select(state => state.tiles.isTrial);
    this.isTrialSub = this.isTrialState.subscribe(
      data => this.isTrial = data
    );
  }

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }
  
 
  onInputChange(event: MatSliderChange) {
    this.planSubscriptions.forEach(
      (plan, index) => {if(plan.user_amount === event.value){this.planSubscrition = plan; this.level = index+1}}
    );
    if(this.accountLevel === this.level){
      this.sameLevel = true
    }else{
      this.sameLevel = false;
    }
  }

  openHandler(){
    this._store.dispatch(new TilesDataActions.CardPaymentChange(true));
    this.planShow = false;
  }

  back(){
    this.cardPayment = false;
    this.planShow = true;
  };

  cancelSubscription(){
    this._httpPaymentService.cancelSubscription();
    this._store.dispatch(new TilesDataActions.SpinnerChange(false));
  }

  upgradeDowngradeSubscription(){
    this._store.dispatch(new TilesDataActions.UpgradeDowngradeSet(true));
    this._store.dispatch(new TilesDataActions.ManagerInit(false));
  };

  backUpgrade(){
    this._store.dispatch(new TilesDataActions.UpgradeDowngradeSet(false));
    this._store.dispatch(new TilesDataActions.ManagerInit(true));
  }

  changePlan(){
    this._store.dispatch(new TilesDataActions.SpinnerChange(true));
    this._store.dispatch(new TilesDataActions.IsManageChange(false));
    this._store.dispatch(new TilesDataActions.UpgradeDowngradeSet(false));

    const data = {
      stripe_data: {
        plan: this.planSubscrition.plan_id
      }
    };
    this.sameLevel = false;
    this._httpPaymentService.upgradeDowngradeSubscription(data);
    
  }

  backConf(){
    this._store.dispatch(new TilesDataActions.ConfirmationChangePlan(false));
    this._store.dispatch(new TilesDataActions.UpgradeDowngradeSet(true));
  }

  confirm(){
    this._store.dispatch(new TilesDataActions.SpinnerChange(true));
    this._store.dispatch(new TilesDataActions.IsManageChange(false));
    this._store.dispatch(new TilesDataActions.ConfirmationChangePlan(false));
    const data = {
      stripe_data: {
        plan: this.planSubscrition.plan_id
      }
    };
    this._httpPaymentService.confirmUpgradeDowngradeSubscription(data);
  };

  closeDialog(){
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    this.cardPaymentSub.unsubscribe();
    this.isManageSub.unsubscribe();
    this.planShowSub.unsubscribe();
    this.spinnerSub.unsubscribe();
    this.isPaidSub.unsubscribe();
    this.isPaidAccountSub.unsubscribe();
    this.managerSub.unsubscribe();
    this.upgradeDowngradeSub.unsubscribe();
    this.isTrialSub.unsubscribe();
    this.confirmationSub.unsubscribe();
    this.accountLevelSub.unsubscribe();
    this.priceSub.unsubscribe();
  }
}