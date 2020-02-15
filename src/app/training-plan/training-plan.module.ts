import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { TrainingPlanRoutingModule } from './training-plan-routing.module';

@NgModule({
    imports: [
        SharedModule,
        ComponentsModule,
        TrainingPlanRoutingModule
    ]
})
export class TrainingPlanModule{}