import { LoginComponent } from './login/login.component';
import { PaidGuard } from './auth/paid.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TilesCollectionComponent } from './tiles-collection/tiles-collection.component';
import { GuardGuard } from './auth/guard.guard';
import { TileEditorComponent } from './tile-editor/tile-editor.component';

const routes: Routes = [
    { path: '', redirectTo: 'calendar', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'tilecollection', component: TilesCollectionComponent, canActivate: [PaidGuard] },
    { path: 'tileeditor', component: TileEditorComponent, canActivate: [PaidGuard]},
    { path: 'chart', loadChildren: './chart/chart.module#ChartModule', canActivate: [PaidGuard] },
    { path: 'board', loadChildren: './board/board.module#BoardModule', canActivate: [GuardGuard] },
    { path: 'athletecard', loadChildren: './athletes/athletes.module#AthletesModule', canActivate: [PaidGuard] },
    { path: 'calendar', loadChildren: './calendar-simple/calendar.module#CalendarModule', canActivate: [GuardGuard] },
    { path: 'loops', loadChildren: './loops/loops.module#LoopsModule', canActivate: [GuardGuard] }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
