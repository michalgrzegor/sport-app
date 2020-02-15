import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ErrorMsgComponent } from './error-msg/error-msg.component';

const routes: Routes = [
        { path: 'error', component: ErrorMsgComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {}