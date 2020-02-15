import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuardGuard } from '../auth/guard.guard';
import { LoopsComponent } from './loops.component';

const routes: Routes = [
    { path: '', component: LoopsComponent,  canActivate: [GuardGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoopsRoutingModule{}