import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
  })
export class PaidGuard implements CanActivate {
        
    constructor(
        private _auth: AuthService,
        private _router: Router,
    ){}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this._auth.isAuthenticated() || (this._auth.isAuthenticated() && this._auth.getAccountLevel() === 0)){
            this._router.navigate(['/']);
            return false;
        }
        return true;
    }
}