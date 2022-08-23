import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./material/material.module";

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';

import { HydraPipe } from './pipes/hydra.pipe';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { preloaderConfig } from "./utils/preloader-config";

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HydraPipe
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
