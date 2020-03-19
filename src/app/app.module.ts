import { LoopsModule } from './loops/loops.module';
import { CardComponent } from './payment/card/card.component';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { TrainingPlanModule } from './training-plan/training-plan.module';
import { TileModule } from './tile/tile.module';
import { NodesktopModule } from './nodesktop/nodesktop.module';
import { TileEditorModule } from './tile-editor/tile-editor.module';
import { AppStoreModule } from './shared/app-store.module';
import { QuestionsDialogComponent } from './questions-dialog/questions-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientXsrfModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { PaymentComponent } from './payment/payment.component';
import { ErrorsHandler } from './shared/handle-errors';
import { VerifyDialogLeavePlatformComponent } from './verify-dialog-leave-platform/verify-dialog-leave-platform.component';
import { LoginComponent } from './login/login.component';
import { StepperComponent } from './tutorial/stepper/stepper.component';
import { CreatorComponent } from './tutorial/creator/creator.component';
import { AthleteCreatorComponent } from './athletes/athlete-creator/athlete-creator.component';
import { TrainingPlanEditorComponent } from './training-plan/training-plan-editor/training-plan-editor.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    AppComponent,
    QuestionsDialogComponent,
    PaymentComponent,
    CardComponent,
    VerifyDialogLeavePlatformComponent,
    LoginComponent,
    StepperComponent,
    CreatorComponent,
    AthleteCreatorComponent,
    TrainingPlanEditorComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
    TrainingPlanModule,
    TileModule,
    LoopsModule,
    NodesktopModule,
    TileEditorModule,
    AppStoreModule,
    HttpModule,
    InfiniteScrollModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    CookieService,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    }
  ],
  entryComponents: [
    QuestionsDialogComponent,
    PaymentComponent,
    VerifyDialogLeavePlatformComponent,
    StepperComponent,
    CreatorComponent,
    AthleteCreatorComponent,
    TrainingPlanEditorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
