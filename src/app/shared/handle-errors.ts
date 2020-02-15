import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

  constructor(
    private _snackBar: MatSnackBar,
    private _injector: Injector
  ){}

  openSnackBar(message: string){
    this._snackBar.open(message, null, {
      duration: 2000
    })
  }

  handleError(error: Error | HttpErrorResponse) {  
    const router = this._injector.get(Router);

    if (error instanceof HttpErrorResponse) {
       // Server or connection error happened
       if (!navigator.onLine) {
         // Handle offline error
         this.openSnackBar('No Internet Connection')
        } else {
          // Handle Http Error (error.status === 403, 404...)
          // this.openSnackBar(`${error.status} - ${error.message}`);
          
       }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)  
      // router.navigate(['/error'])   
    }
   // Log the error anyway
  //  console.error('It happens: ', error);
 }
}