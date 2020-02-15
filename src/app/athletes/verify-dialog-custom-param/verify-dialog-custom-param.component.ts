import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

export interface VerifyData {
  isVerified: boolean;
}

@Component({
  selector: 'app-verify-dialog-custom-param',
  templateUrl: './verify-dialog-custom-param.component.html'
})
export class VerifyDialogCustomParamComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogCustomParamComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
