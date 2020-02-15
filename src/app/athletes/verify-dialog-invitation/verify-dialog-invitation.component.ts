import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

export interface VerifyData {
  isVerified: boolean;
}

@Component({
  selector: 'app-verify-dialog-invitation',
  templateUrl: './verify-dialog-invitation.component.html'
})
export class VerifyDialogInvitationComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
