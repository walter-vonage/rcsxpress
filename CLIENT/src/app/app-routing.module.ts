import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenHomeComponent } from './screen/screen-home/screen-home.component';
import { ScreenCreateRcsCardComponent } from './screen/screen-create-rcs-card/screen-create-rcs-card.component';
import { ScreenCreateRcsEcommerceFlowComponent } from './screen/screen-create-rcs-ecommerce-flow/screen-create-rcs-ecommerce-flow.component';

const routes: Routes = [
    {path: '', component: ScreenHomeComponent},
    {path: 'new/rcs/card', component: ScreenCreateRcsCardComponent},
    {path: 'new/rcs/flow/ecommerce', component: ScreenCreateRcsEcommerceFlowComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: 'enabled'    //  Scrolls to top automatically
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
