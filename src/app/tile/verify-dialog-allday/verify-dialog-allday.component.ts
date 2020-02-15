import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog-allday',
  templateUrl: './verify-dialog-allday.component.html',
  styleUrls: ['./verify-dialog-allday.component.css']
})
export class VerifyDialogAllDayComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogAllDayComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
