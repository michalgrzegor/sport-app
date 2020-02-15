import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog-comment',
  templateUrl: './verify-dialog-comment.component.html'
})
export class VerifyDialogCommentComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
