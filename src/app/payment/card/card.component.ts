import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpPaymentClientService } from 'src/app/shared/http-payment-client.service';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as TilesDataActions from '../../shared/store/tiles-data.actions';

declare var Stripe;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('rotate', [
      state('show', style({transform: 'rotate(0deg)'})),
      state('hide', style({transform: 'rotate(180deg)'})),
      transition('show => hide', animate('0.6s ease-in')),
      transition('hide => show', animate('0.6s ease-out'))
    ])
  ]
})
export class CardComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElement: ElementRef;
  @Input() planSubscrition;
  summaryClose: boolean = false;

  //animation
  get stateName() {
    return this.summaryClose ? 'show' : 'hide'
  }

  first_last_name: string = '';
  phone_number: string = '';
  address: string = '';
  line1: string = '';
  city: string = '';
  country: string = '';
  postal_code: string = '';
  state: string = '';
  invoice_data: boolean = false;

  style = {
    base: {
      fontSize: '16px',
      color: "rgba(255, 255, 255, 0.67)",
      fontFamily: "Lato"
    },
    empty: {
      color: "rgba(255,255,255,0.37)",
      fontFamily: "Lato"
    }
  };

  card;
  stripe;
  elements;

  cardFailState: Observable<boolean>;
  cardFailSub: Subscription;
  cardFail: boolean;

  constructor(
    private _cookieService: CookieService,
    private _httpPaymentService: HttpPaymentClientService,
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this._store.dispatch(new TilesDataActions.CardFail(false));
    this.cardFailState = this._store.select(state => state.tiles.cardFail);
    this.cardFailSub = this.cardFailState.subscribe(
      data => {
        this.cardFail = data;
      }
    );
  }

  ngAfterViewInit() {
    this.stripe = Stripe(environment.stripeKey);
    this.elements = this.stripe.elements();
  
    this.card = this.elements.create('card', {style: this.style});
    this.card.mount(this.cardElement.nativeElement);
  
    this.card.addEventListener('change', function(event) {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  };

  getUserProfile(){
    const profile = this._cookieService.get('profile');
    return profile;
  }

  getEmail() {
    const email = JSON.parse(this._cookieService.get('profile')).email;
    return email;
  }

  openInvoiceData(){
    this.invoice_data = !this.invoice_data;
    this.summaryClose = !this.summaryClose;
  }

  async handleForm(e) {
    e.preventDefault();

    this._store.dispatch(new TilesDataActions.CardFail(false));

    let app_metadata
    if(this.getUserProfile() && JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']){
      app_metadata = JSON.parse(this.getUserProfile())['https://sport.app.comapp_metadata']
    }

    const {token, error} = await this.stripe.createToken(this.card);

    this._store.dispatch(new TilesDataActions.SpinnerChange(true))

    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
      
    } else {
      // Send the token to your server.
      if(!app_metadata.account_level_data || !app_metadata.account_level_data.stripe_customer_id || !app_metadata && !this.cardFail){
        const data = {
          stripe_data: {
            email: this.getEmail(), 
            phone: this.phone_number,
            name: this.first_last_name,
            address: {
              line1: this.line1,
              city: this.city,
              country: this.country,
              postal_code: this.postal_code,
              state: this.state,
            },
            source: token.id,
            plan: this.planSubscrition.plan_id
          }
        };
        this._httpPaymentService.startSubscription(data);

      }else if(app_metadata && app_metadata.account_level_data.stripe_customer_id && !this.cardFail){
        const data = {
          stripe_data: {
            plan: this.planSubscrition.plan_id,
            phone: this.phone_number,
            name: this.first_last_name,
            address: {
              line1: this.line1,
              city: this.city,
              country: this.country,
              postal_code: this.postal_code,
              state: this.state,
            },
            source: token.id
          }
        };
        this._httpPaymentService.startSubscriptionWithID(data);
        
      }else if(this.cardFail){
        const data = {
          stripe_data: {
            plan: this.planSubscrition.plan_id,
            phone: this.phone_number,
            name: this.first_last_name,
            address: {
              line1: this.line1,
              city: this.city,
              country: this.country,
              postal_code: this.postal_code,
              state: this.state,
            },
            source: token.id
          }
        };
        
        this._httpPaymentService.cardFailureUpdate(data);

      }
    }
  }

  ngOnDestroy(): void {
    this.cardFailSub.unsubscribe()
  }

}
