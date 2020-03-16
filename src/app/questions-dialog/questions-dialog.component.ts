import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

export interface QDialogData {
  date: string;
  sessionNumber: string;
  questions: string[];
  tiles: any[];
  calendar_assoc_id: number[];
  formAnswer: any[];
}

@Component({
  selector: 'app-questions-dialog',
  templateUrl: './questions-dialog.component.html',
  styleUrls: ['./questions-dialog.component.scss']
})
export class QuestionsDialogComponent implements OnInit {
  question_answers = [];
  calendar_assoc_id = [];
  valid: boolean = false;
  mytext: string;

  constructor(
    public dialogRef: MatDialogRef<QuestionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QDialogData) {}
  
  ngOnInit() {
    this.question_answers = [];
    this.data.tiles.forEach((tile, index)=>{
      const numArray = [];
      if(!tile.tile_question.tile_answer_numeric){
        if(tile.tile_question && tile.tile_question.tile_answers_descriptives){
          let array = tile.tile_question.tile_answers_descriptives.split(',');
          tile.array = array;
        }else{
          tile.array = null;
          this.data.formAnswer[index].noQuestion = true;
        }
      }else if(tile.tile_question.tile_answer_numeric){
        const from = Number(tile.tile_question.tile_answer_numeric_from);
        const to = Number(tile.tile_question.tile_answer_numeric_to);
        
        tile.array = _.range(from, to+1);
      }
    });
    this.calendar_assoc_id = this.data.calendar_assoc_id;
    this.checkForValid();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form){
  }

  checkForValid(){
    const validArray = []
    this.data.formAnswer.forEach(option=>{
      if(!option.question_answer && !option.noQuestion){
        validArray.push(`0`);
      }else if(!option.question_answer && option.noQuestion){
        validArray.push(`1`);
      }else{
        validArray.push(`1`);
      }
    })
    this.valid = !(_.includes(validArray, `0`));
  }

  changeTextarea(data){
  }


}
