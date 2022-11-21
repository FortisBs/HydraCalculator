import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./shared/material/material.module";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { preloaderConfig } from "./utils/preloader-config";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";

import { AppComponent } from './app.component';
import { TableComponent } from './pages/table/table.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalculatorComponent } from './pages/table/calculator/calculator.component';
import { DashboardComponent } from './pages/profile/dashboard/dashboard.component';
import { AddDelegateComponent } from './pages/profile/add-delegate/add-delegate.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    CalculatorComponent,
    DashboardComponent,
    AddDelegateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(preloaderConfig),
    NgxUiLoaderRouterModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
