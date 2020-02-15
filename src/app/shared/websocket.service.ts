import { Injectable } from "@angular/core";
import * as Rx from "rxjs/Rx";
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class WebsocketService {
  url: string = 'https://gremmo-one.herokuapp.com/api/v1/';

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

  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService
  ) {}

  private subject: Rx.Subject<MessageEvent>;
  ws: any;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url: string): Rx.Subject<MessageEvent> {
    this.ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });
    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }

  public getObservable(url: string) {
    if (!this.subject) {
      this._http.get(`${this.url}connection_verification_token`, this.getHttpOptions()).subscribe(
        (response: any) => {
          this.subject = this.create(`${url}/${response.verification_token}`);
        }
      )
    }
    return this.subject.asObservable();
  }

  public sendMessage(message){
    this.subject.next(message);
  }

  public close() {
    if(this.ws){
      this.ws.close()
    }
  }
}