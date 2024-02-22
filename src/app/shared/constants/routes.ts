import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { AddDelegateComponent } from "../../pages/profile/add-delegate/add-delegate.component";

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../pages/table/table.component').then(c => c.TableComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('../../pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('../../pages/registration/registration.component').then(c => c.RegistrationComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => profileRoutes
  },
  { path: '**', redirectTo: '' }
];

export const profileRoutes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'add-delegate', component: AddDelegateComponent }
];
