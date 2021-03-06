import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog-tp.component.html'
})
export class VerifyDialogTpComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogTpComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
