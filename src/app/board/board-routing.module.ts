import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board.component';
import { GuardGuard } from '../auth/guard.guard';

const routes: Routes = [
    { path: '', component: BoardComponent, canActivate: [GuardGuard]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BoardRoutingModule {}