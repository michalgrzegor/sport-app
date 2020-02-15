import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  name: string, 
  type: string, 
  color: string, 
  selected: boolean
}

@Component({
  selector: 'app-new-tile-type',
  templateUrl: './new-tile-type.component.html',
  styleUrls: ['./new-tile-type.component.css']
})
export class NewTileTypeComponent implements OnInit, OnDestroy {
  subColor: Subscription;

  constructor(
    public dialogRef: MatDialogRef<NewTileTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _data: DataService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.subColor = this._data.trainingTypeColorSub.subscribe(
      result => this.data.color = result
    );
  }

  ngOnDestroy() {
    this.subColor.unsubscribe();
  }

}
