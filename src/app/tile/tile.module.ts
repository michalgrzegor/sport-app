import { VerifyDialogDayComponent } from './verify-dialog-day/verify-dialog-day.component';
import { NgModule } from '@angular/core';

import { VerifyDialogComponent } from './verify-dialog/verify-dialog.component';
import { VerifyDialogAllDayComponent } from './verify-dialog-allday/verify-dialog-allday.component';
import { VerifyDialogNoteComponent } from './verify-dialog-note/verify-dialog-note.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [
        VerifyDialogComponent,
        VerifyDialogAllDayComponent,
        VerifyDialogNoteComponent,
        VerifyDialogDayComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule
    ],
    entryComponents: [
        VerifyDialogComponent,
        VerifyDialogAllDayComponent,
        VerifyDialogNoteComponent,
        VerifyDialogDayComponent
    ]
})
export class TileModule {}