import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChartComponent } from './chart.component';
import { GuardGuard } from '../auth/guard.guard';

const routes: Routes = [
    { path: '', component: ChartComponent,  canActivate: [GuardGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChartRoutingModule{}