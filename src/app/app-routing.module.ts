import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./shared/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/table/table.component').then(c => c.TableComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.component').then(c => c.RegistrationComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/constants/profile-routes').then(m => m.profileRoutes)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
