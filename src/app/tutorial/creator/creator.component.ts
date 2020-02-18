import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';


import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as CalendarDataActions from '../../shared/store/callendar-data.actions';

export interface CreatorData {
  creator: string
}

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  array = ['program', 'tile', 'card']

  tileCloseState: Observable<boolean>;
  tileCloseSub: Subscription;
  tileClose: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreatorData,
    private _store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.tileCloseState = this._store.select(state => state.callendar.tileClose);
    this.tileCloseSub = this.tileCloseState.subscribe(
      data => {
        this.tileClose = data;
        if(data){
          this.dialogRef.close();
          this._store.dispatch(new CalendarDataActions.SetClose(false))
        }
      }
    );
  }

}
