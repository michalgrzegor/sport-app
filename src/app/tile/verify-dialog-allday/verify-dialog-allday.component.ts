import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog-allday',
  templateUrl: './verify-dialog-allday.component.html',
  styleUrls: ['./verify-dialog-allday.component.scss']
})
export class VerifyDialogAllDayComponent {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogAllDayComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }
}
