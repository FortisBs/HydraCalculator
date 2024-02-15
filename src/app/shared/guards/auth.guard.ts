import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? true : this.router.createUrlTree(['/']);
  }
}
