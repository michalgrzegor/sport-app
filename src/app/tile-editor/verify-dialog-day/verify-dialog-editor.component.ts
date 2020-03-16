import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

export interface TileVerifyData {
  tileType: string
}

@Component({
  selector: 'app-verify-dialog-editor',
  templateUrl: './verify-dialog-editor.component.html'
})
export class VerifyDialogEditorComponent implements OnInit {

  message: string = '';

  constructor(
    public _dialogRef: MatDialogRef<VerifyDialogEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: TileVerifyData
  ) { }

  ngOnInit() {

    if(this._data.tileType==='training'){
      this.message = 'Are you sure you want to delete this activity?'
    }else if(this._data.tileType==='diet'){
      this.message = 'Are you sure you want to delete this meal?'
    }else if(this._data.tileType==='nutrient'){
      this.message = 'Are you sure you want to delete this nutrient?'
    }
  }

}
