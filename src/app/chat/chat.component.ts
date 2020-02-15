import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../shared/store/app.reducers';
import * as ChatActions from '../shared/store/chat.actions';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { WebsocketService } from '../shared/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  subject: Subject<any>;
  
  message: string;
  contacsOpen: boolean = false;

  contacts: Contact[] = [];

  conversation: ChatMessage[] = [];

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;
  

  constructor(
    private _store: Store<fromApp.AppState>,
    public _breakpointObserver: BreakpointObserver,
    private _wss: WebsocketService
  ) { }

  ngOnInit() {
    
    //websocket

    this._wss.getObservable('wss://gremmo-one.herokuapp.com/cable').subscribe(
      msg => console.log('message received: ' + msg), 
      // Called whenever there is a message from the server    
      err => console.log(err), 
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete') 
      // Called when connection is closed (for whatever reason)
    )

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
    
    this.contacts = [
      {
        contact_name: 'Michał Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCnRNwe44gVx2kmPr1D1342vx56kUKmQ9kSllXcKQ',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      },
      {
        contact_name: 'Mateusz Grzegorczyk',
        contact_avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mCehCCbIzDOVwWFIssTlega3wzhuoyZl4iDHHHC9A',
        contact_status: 'available'
      }
    ]
    this.conversation = [
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt turpis sit amet sagittis porta. Nullam orci erat, gravida a turpis ac, rutrum imperdiet odio.',
        chat_message_time: '2019-10-30, 11:46 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Mauris quis mauris a nulla tincidunt suscipit. Mauris blandit tortor dapibus faucibus accumsan.',
        chat_message_time: '2019-10-30, 11:47 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Aliquam blandit vulputate velit sit amet gravida.',
        chat_message_time: '2019-10-30, 11:48 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Nam quam leo, placerat ut sapien sit amet, pharetra venenatis urna. Cras in consectetur sapien, vel mollis sem. Nullam vitae augue vitae arcu vehicula finibus at eu nulla. Praesent a urna diam.',
        chat_message_time: '2019-10-30, 11:49 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Praesent vitae ornare dolor.',
        chat_message_time: '2019-10-30, 11:50 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Mauris quis mauris a nulla tincidunt suscipit. Mauris blandit tortor dapibus faucibus accumsan.',
        chat_message_time: '2019-10-30, 11:51 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt turpis sit amet sagittis porta. Nullam orci erat, gravida a turpis ac, rutrum imperdiet odio.',
        chat_message_time: '2019-10-30, 11:52 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Mauris quis mauris a nulla tincidunt suscipit. Mauris blandit tortor dapibus faucibus accumsan.',
        chat_message_time: '2019-10-30, 11:53 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt turpis sit amet sagittis porta. Nullam orci erat, gravida a turpis ac, rutrum imperdiet odio.',
        chat_message_time: '2019-10-30, 11:54 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Aliquam blandit vulputate velit sit amet gravida.',
        chat_message_time: '2019-10-30, 11:55 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Nam quam leo, placerat ut sapien sit amet, pharetra venenatis urna. Cras in consectetur sapien, vel mollis sem. Nullam vitae augue vitae arcu vehicula finibus at eu nulla. Praesent a urna diam.',
        chat_message_time: '2019-10-30, 11:56 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Aliquam blandit vulputate velit sit amet gravida.',
        chat_message_time: '2019-10-30, 11:57 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Praesent vitae ornare dolor.',
        chat_message_time: '2019-10-30, 11:58 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Mauris quis mauris a nulla tincidunt suscipit. Mauris blandit tortor dapibus faucibus accumsan.',
        chat_message_time: '2019-10-30, 11:59 am'
      },
      {
        chat_message_name: 'Michał Grzegorczyk',
        chat_message_body: 'Praesent vitae ornare dolor.',
        chat_message_time: '2019-10-30, 12:00 am'
      },
      {
        chat_message_name: 'Mateusz Grzegorczyk',
        chat_message_body: 'Nam quam leo, placerat ut sapien sit amet, pharetra venenatis urna. Cras in consectetur sapien, vel mollis sem. Nullam vitae augue vitae arcu vehicula finibus at eu nulla. Praesent a urna diam.',
        chat_message_time: '2019-10-30, 12:01 am'
      }
    ]

    setTimeout(()=>this.scrollToBottom(),200);
    console.log(this.conversation)
  }
  

  close(){
    this._store.dispatch(new ChatActions.IsOnChat(false));
  }

  onScroll(){
    console.log(`scroll`)
  }

  handleEnter(event){
    if(event.keyCode===13 && !event.shiftKey) {
      event.preventDefault();
      console.log(this.message);
      this._wss.sendMessage(this.message)
      this.message = ''
    }else if(event.keyCode===13 && event.shiftKey) {
      this.message = this.message+'\n'
      event.preventDefault();
    }
  }

  showContacts(){
    this.contacsOpen = !this.contacsOpen
  }

  isTrainer(name: string): boolean{
    if(name==='Michał Grzegorczyk'){
      return true
    }else{
      return false
    }
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnDestroy() {
    this._wss.close();
  }


}

export interface Contact {
  contact_name: string;
  contact_avatar: string;
  contact_status: string;
}

export interface ChatMessage {
  chat_message_name: string;
  chat_message_body: string;
  chat_message_time: string;
}