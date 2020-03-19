import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';

import { NewTileTypeComponent } from './new-tile-type/new-tile-type.component';
import { ColorPickerComponent } from './color-picker/color-picker/color-picker.component';
import { ColorSliderComponent } from './color-picker/color-picker/color-slider/color-slider.component';
import { ColorPaletteComponent } from './color-picker/color-picker/color-palette/color-palette.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyDialogEditorComponent } from './verify-dialog-day/verify-dialog-editor.component';
import { TileMotivationComponent } from './tile-kind/tile-motivation/tile-motivation.component';
import { TileQuestionComponent } from './tile-kind/tile-question/tile-question.component';
import { TileDietComponent } from './tile-kind/tile-diet/tile-diet.component';
import { TileTrainingComponent } from './tile-kind/tile-training/tile-training.component';

@NgModule({
    declarations: [
        NewTileTypeComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        ColorPaletteComponent,
        VerifyDialogEditorComponent
    ],
    imports: [
        ComponentsModule,
        SharedModule
    ],
    entryComponents: [
        NewTileTypeComponent,
        VerifyDialogEditorComponent
    ]
})
export class TileEditorModule{}