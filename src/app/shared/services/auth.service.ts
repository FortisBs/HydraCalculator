import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginResponse, User } from "../models/user.interface";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _url = environment.serverUrl + '/auth';
  private _user: WritableSignal<User | null> = signal(null);

  user: Signal<User | null> = this._user.asReadonly();

  constructor(private http: HttpClient) {
    this._autoLogin();
  }

  registerUser(username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this._url}/registration`, { username, password });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this._url}/login`, { username, password }).pipe(
      tap((res) => {
        this._user.set(res.user);

        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout(): void {
    this._user.set(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private _autoLogin(): void {
    const token = localStorage.getItem('token');
    const userLS = localStorage.getItem('user');

    (token && userLS) && this._user.set(JSON.parse(userLS));
  }
}
