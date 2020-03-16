import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { reducers } from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { TilesDataEffects } from './store/tiles-data.effects';
import { CalendarDataEffects } from './store/calendar-data.effects';
import { BoardDataEffects } from './store/board-data.effects';
import { ChartDataEffects } from './store/chart-data.effects';
import { AthleteDataEffects } from './store/athletes-data.effects';
import { LoopsEffects } from './store/loops.effects';

@NgModule({
    imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([TilesDataEffects, CalendarDataEffects, BoardDataEffects, ChartDataEffects, AthleteDataEffects, LoopsEffects]),
    ],
    exports: [
        StoreModule,
        EffectsModule
    ]
})
export class AppStoreModule {}