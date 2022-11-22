import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from "./profile.component";
import { AddDelegateComponent } from "./add-delegate/add-delegate.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ProfileComponent, AddDelegateComponent, DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ProfileComponent, canActivate: [AuthGuard]}]),
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ProfileModule {}
