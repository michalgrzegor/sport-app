import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.scss']
})
export class VerifyDialogComponent {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }
}
