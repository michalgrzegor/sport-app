import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog-day.component.html',
  styleUrls: ['./verify-dialog-day.component.css']
})
export class VerifyDialogDayComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogDayComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
