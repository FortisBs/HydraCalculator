import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./material/material.module";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { preloaderConfig } from "./utils/preloader-config";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MaterialModule,
      HttpClientModule,
      FormsModule,
      NgxUiLoaderModule.forRoot(preloaderConfig),
      NgxUiLoaderRouterModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
