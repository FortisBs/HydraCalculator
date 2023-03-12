import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../shared/material/material.module";
import { RegistrationComponent } from "./registration.component";

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: RegistrationComponent}]),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class RegistrationModule { }
