import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-repeat-dialog',
  templateUrl: './repeat-dialog.component.html'
})
export class RepeatDialogComponent implements OnInit {
  input: number;

  constructor(
    public _dialogRef: MatDialogRef<RepeatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RepeatData
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

}

export interface RepeatData {
  weekly?: number;
  daily?: number;
  repeats?: number;
  interval?: number
}
