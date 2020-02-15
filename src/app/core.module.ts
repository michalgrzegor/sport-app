import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { GuardGuard } from './auth/guard.guard';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    GuardGuard
  ],
  exports: [
    ServiceWorkerModule
  ]
})
export class CoreModule{}