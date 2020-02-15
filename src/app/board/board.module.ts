import { BoardRoutingModule } from './board-routing.module';
import { NgModule } from '@angular/core';

import { NoteCreatorComponent } from './note-creator/note-creator.component';
import { NoteComponent } from './note/note.component';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        NoteCreatorComponent,
        NoteComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        BoardRoutingModule
    ],
    entryComponents: [
        NoteCreatorComponent,
        NoteComponent
    ]
})
export class BoardModule {}