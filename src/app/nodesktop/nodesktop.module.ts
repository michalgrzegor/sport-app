import { NgModule } from '@angular/core';
import { AddTilesHandsetComponent } from './add-tiles-handset/add-tiles-handset.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { TileModule } from '../tile/tile.module';

@NgModule({
    declarations: [
        AddTilesHandsetComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        TileModule
    ],
    entryComponents: [
        AddTilesHandsetComponent
    ]
})
export class NodesktopModule{}