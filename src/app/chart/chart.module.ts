import { NgModule } from '@angular/core';

import { ChartComponent } from './chart.component';
import { SharedModule } from '../shared/shared.module';
import { ChartRoutingModule } from './chart-routing.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [
        ChartComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        ChartRoutingModule
    ]
})
export class ChartModule{}