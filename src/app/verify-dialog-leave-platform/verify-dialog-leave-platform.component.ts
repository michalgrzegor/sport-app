import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog-leave-platform',
  templateUrl: './verify-dialog-leave-platform.component.html',
  styleUrls: ['./verify-dialog-leave-platform.component.scss']
})
export class VerifyDialogLeavePlatformComponent {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogLeavePlatformComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }
}
