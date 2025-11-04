import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector, forwardRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScreenHomeComponent } from './screen/screen-home/screen-home.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { TypewriterBlockComponent } from './components/typewriter-block/typewriter-block.component';
import { ToastComponent } from './components/toast/toast.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './utils/auth.interceptor';
import { ScreenCreateRcsCardComponent } from './screen/screen-create-rcs-card/screen-create-rcs-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScreenCreateRcsEcommerceFlowComponent } from './screen/screen-create-rcs-ecommerce-flow/screen-create-rcs-ecommerce-flow.component';
import { EcommercePreviewComponent } from './components/flow/ecommerce/ecommerce-preview/ecommerce-preview.component';
import { StoredConfigurationsComponent } from './components/stored-configurations/stored-configurations.component';

@NgModule({
    declarations: [
        AppComponent,
        ScreenHomeComponent,
        ThemeToggleComponent,
        TypewriterBlockComponent,
        ToastComponent,
        ScreenCreateRcsCardComponent,
        ScreenCreateRcsEcommerceFlowComponent,
        EcommercePreviewComponent,
        StoredConfigurationsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserModule,
        CommonModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        provideHttpClient(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
