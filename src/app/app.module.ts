import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { preloaderConfig } from "./utils/preloader-config";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";

import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(preloaderConfig),
    NgxUiLoaderRouterModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
