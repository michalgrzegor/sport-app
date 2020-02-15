import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from 'src/app/tile-editor/new-tile-type/new-tile-type.component';

@Component({
  selector: 'app-verify-dialog-note',
  templateUrl: './verify-dialog-note.component.html',
  styleUrls: ['./verify-dialog-note.component.css']
})
export class VerifyDialogNoteComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) { }

  ngOnInit() {
  }

}
