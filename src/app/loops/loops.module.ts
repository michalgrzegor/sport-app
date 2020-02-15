import { LoopsComponent } from './loops.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { LoopsRoutingModule } from './loops-routing.module';

@NgModule({
    declarations: [
        LoopsComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        LoopsRoutingModule
    ]
})
export class LoopsModule{}