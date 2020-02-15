import { BoardModule } from './../board/board.module';
import { AthletesRoutingModule } from './athletes-routing.module';

import { NgModule } from '@angular/core';
import { ComponentsModule } from './../components/components.module';

import { AthleteCardComponent } from './athlete-card/athlete-card.component';
import { SharedModule } from '../shared/shared.module';
import { AthleteInviteComponent } from './athlete-invite/athlete-invite.component';
import { VerifyDialogAthleteComponent } from './verify-dialog-athlete/verify-dialog-athlete.component';
import { VerifyDialogCustomParamComponent } from './verify-dialog-custom-param/verify-dialog-custom-param.component';
import { VerifyDialogInvitationComponent } from './verify-dialog-invitation/verify-dialog-invitation.component';
import { AthleteInfoComponent } from './athlete-info/athlete-info.component';
import { AthleteDataAndProgressComponent } from './athlete-data-and-progress/athlete-data-and-progress.component';

@NgModule({
    declarations: [  
        AthleteCardComponent,
        AthleteInviteComponent,
        VerifyDialogAthleteComponent,
        VerifyDialogCustomParamComponent,
        VerifyDialogInvitationComponent,
        AthleteInfoComponent,
        AthleteDataAndProgressComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        AthletesRoutingModule,
        BoardModule
    ],
    entryComponents: [
        AthleteInviteComponent,
        VerifyDialogAthleteComponent,
        VerifyDialogCustomParamComponent,
        VerifyDialogInvitationComponent
    ]
})
export class AthletesModule {}