import { PaidGuard } from './../auth/paid.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteCardComponent } from './athlete-card/athlete-card.component';

const routes: Routes = [
    { path: '', component: AthleteCardComponent, canActivate: [PaidGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AthletesRoutingModule {}