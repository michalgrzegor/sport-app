import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { TpMenuComponent } from './tp-menu/tp-menu.component';
import { GuardGuard } from '../auth/guard.guard';

const routes: Routes = [
    { path: 'tp', component: TpMenuComponent, outlet: 'side', canActivate: [GuardGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainingPlanRoutingModule{}