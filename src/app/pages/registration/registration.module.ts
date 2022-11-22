import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from "./registration.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: RegistrationComponent}]),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class RegistrationModule { }
