import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from "./profile.component";
import { AddDelegateComponent } from "./add-delegate/add-delegate.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../../shared/material/material.module";

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'addDelegate', component: AddDelegateComponent }
];

@NgModule({
  declarations: [ProfileComponent, AddDelegateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProfileModule {}
