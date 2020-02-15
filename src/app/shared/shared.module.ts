import { NgModule } from '@angular/core';

import { ShortenPipe } from './pipes/shorten.pipe';
import { ClickStopPropagation } from './directives/stop-propagation.directive';
import { FabBtnComponent } from './fab-btn/fab-btn.component';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardComponent } from '../board/board.component';
import { TileComponent } from '../tile/tile.component';
import { TpMenuComponent } from '../training-plan/tp-menu/tp-menu.component';
import { TilesCollectionComponent } from '../tiles-collection/tiles-collection.component';
import { TilesCategoryComponent } from '../tiles-collection/tiles-category/tiles-category.component';
import { TilesSearchComponent } from '../tiles-collection/tiles-search/tiles-search.component';
import { AthleteManagerComponent } from '../athletes/athlete-manager/athlete-manager.component';
import { TileEditorComponent } from '../tile-editor/tile-editor.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
    declarations: [
        ShortenPipe,
        ClickStopPropagation,
        FabBtnComponent,
        BoardComponent,
        TileComponent,
        TpMenuComponent,
        TilesCollectionComponent,
        TilesCategoryComponent,
        TilesSearchComponent,
        AthleteManagerComponent,
        TileEditorComponent,
        SpinnerComponent,
        ErrorMsgComponent,
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ComponentsModule,
        HttpClientModule,
        OverlayModule,
        ScrollingModule,
        DragDropModule,
        SharedRoutingModule
    ],
    exports: [
        ShortenPipe,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ComponentsModule,
        HttpClientModule,
        OverlayModule,
        ScrollingModule,
        DragDropModule,
        ClickStopPropagation,
        FabBtnComponent,
        BoardComponent,
        TileComponent,
        TpMenuComponent,
        TilesCollectionComponent,
        TilesCategoryComponent,
        TilesSearchComponent,
        AthleteManagerComponent,
        TileEditorComponent,
        SpinnerComponent,
    ]
})
export class SharedModule {}