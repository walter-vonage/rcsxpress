import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenHomeComponent } from './screen/screen-home/screen-home.component';
import { ScreenCreateRcsCardComponent } from './screen/screen-create-rcs-card/screen-create-rcs-card.component';

const routes: Routes = [
    {path: '', component: ScreenHomeComponent},
    {path: 'new/rcs/card', component: ScreenCreateRcsCardComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
