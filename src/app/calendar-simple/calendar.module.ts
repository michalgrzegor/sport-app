import { ComponentsModule } from '../components/components.module';
import { NgModule } from '@angular/core';

import { CalendarChartComponent } from './calendar-chart/calendar-chart.component';
import { CalendarSimpleComponent } from './calendar-simple.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { SharedModule } from '../shared/shared.module';
import { RepeatDialogComponent } from './repeat-dialog/repeat-dialog.component';
import { StarDialogComponent } from './calendar-day/star-dialog/star-dialog.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { TrainingPlanModule } from '../training-plan/training-plan.module';
import { TileModule } from '../tile/tile.module';
import { VerifyDialogTpComponent } from './verify-dialog-tp/verify-dialog-tp.component';
import { CommentComponent } from './comment/comment.component';
import { VerifyDialogCommentComponent } from './comment/verify-dialog-comment/verify-dialog-comment.component';
import { WeekSummaryComponent } from './calendar-day/week-summary/week-summary.component';
import { TileOpenedComponent } from './calendar-day/week-summary/tile-opened/tile-opened.component';

@NgModule({
    declarations: [
        CalendarChartComponent,
        CalendarSimpleComponent,
        CalendarDayComponent,
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
        CalendarDayComponent,
        RepeatDialogComponent,
        StarDialogComponent,
        VerifyDialogTpComponent,
        CommentComponent,
        VerifyDialogCommentComponent
    ]
})
export class CalendarModule {}