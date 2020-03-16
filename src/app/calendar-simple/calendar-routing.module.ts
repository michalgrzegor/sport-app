import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CalendarSimpleComponent } from './calendar-simple.component';
import { GuardGuard } from '../auth/guard.guard';

const routes: Routes = [
        { path: '', component: CalendarSimpleComponent, canActivate: [GuardGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalendarRoutingModule {}