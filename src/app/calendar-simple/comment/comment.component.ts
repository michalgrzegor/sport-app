import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';


export interface CommentData {
  comment_user: string;
  comment_data: string;
  comment_body: string;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<CommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentData
    ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close()
  }

  createComment(){
    this.data.comment_data = moment().format('YYYY-MM-DD, h:mm a');
  }

}
