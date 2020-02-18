import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface NewNoteData {
  board_note_name: string;
  board_note_link: string;
  board_note_description: string;
}

@Component({
  selector: 'app-note-creator',
  templateUrl: './note-creator.component.html',
  styleUrls: ['./note-creator.component.scss']
})
export class NoteCreatorComponent implements OnInit {
  //errors
  errorReq: string = 'this field is required'

  constructor(
    public dialogRef: MatDialogRef<NoteCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewNoteData) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close()
  }

}
