import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginResponse, User } from "../models/user.interface";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.serverUrl + '/auth';
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  createUser(username: string, password: string): Observable<unknown> {
    return this.http.post(`${this.url}/registration`, { username, password });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, { username, password }).pipe(
      tap((res) => {
        this.user$.next(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/profile');
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  autoLogin(): void {
    const token = localStorage.getItem('token');
    const userLS = localStorage.getItem('user');
    const user = token && userLS ? JSON.parse(userLS) as User : null;
    this.user$.next(user);
  }
}
