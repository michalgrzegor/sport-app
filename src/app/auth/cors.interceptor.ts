import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
  } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Injectable } from '@angular/core';
  
  @Injectable()
  export class WithCredentialsInterceptor implements HttpInterceptor {
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      request = request.clone({
        withCredentials: true
      });
  
      return next.handle(request);
    }
}