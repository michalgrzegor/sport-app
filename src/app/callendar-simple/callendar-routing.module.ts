import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CallendarSimpleComponent } from './callendar-simple.component';
import { GuardGuard } from '../auth/guard.guard';

const routes: Routes = [
        { path: '', component: CallendarSimpleComponent, canActivate: [GuardGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalendarRoutingModule {}