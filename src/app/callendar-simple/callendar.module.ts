import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';

import { CallendarChartComponent } from './callendar-chart/callendar-chart.component';
import { CallendarSimpleComponent } from './callendar-simple.component';
import { CallendarDayComponent } from './callendar-day/callendar-day.component';
import { SharedModule } from '../shared/shared.module';
import { RepeatDialogComponent } from './repeat-dialog/repeat-dialog.component';
import { StarDialogComponent } from './callendar-day/star-dialog/star-dialog.component';
import { CalendarRoutingModule } from './callendar-routing.module';
import { TrainingPlanModule } from '../training-plan/training-plan.module';
import { TileModule } from '../tile/tile.module';
import { VerifyDialogTpComponent } from './verify-dialog-tp/verify-dialog-tp.component';
import { CommentComponent } from './comment/comment.component';
import { VerifyDialogCommentComponent } from './comment/verify-dialog-comment/verify-dialog-comment.component';
import { WeekSummaryComponent } from './callendar-day/week-summary/week-summary.component';
import { TileOpenedComponent } from './callendar-day/week-summary/tile-opened/tile-opened.component';

@NgModule({
    declarations: [
        CallendarChartComponent,
        CallendarSimpleComponent,
        CallendarDayComponent,
        RepeatDialogComponent,
        StarDialogComponent,
        VerifyDialogTpComponent,
        CommentComponent,
        VerifyDialogCommentComponent,
        WeekSummaryComponent,
        TileOpenedComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        CalendarRoutingModule,
        TrainingPlanModule,
        TileModule
    ],
    entryComponents: [
        CallendarDayComponent,
        RepeatDialogComponent,
        StarDialogComponent,
        VerifyDialogTpComponent,
        CommentComponent,
        VerifyDialogCommentComponent
    ]
})
export class CalendarModule {}