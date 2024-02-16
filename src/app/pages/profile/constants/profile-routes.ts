import { Routes } from "@angular/router";
import { ProfileComponent } from "../profile.component";
import { AddDelegateComponent } from "../add-delegate/add-delegate.component";

export const profileRoutes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'add-delegate', component: AddDelegateComponent }
];
