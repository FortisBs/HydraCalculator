import {inject, Injectable, Signal} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import {NewDelegate, OwnDelegate, User} from "../models/user.interface";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DelegatesService {
  private _http: HttpClient = inject(HttpClient);
  private _user: Signal<User | null> = inject(AuthService).user;

  private url = environment.serverUrl + '/delegates';
  private userDelegates: OwnDelegate[] = [];

  userDelegates$ = new BehaviorSubject<OwnDelegate[]>([]);

  addDelegate(delegate: NewDelegate): Observable<unknown> {
    return this._http.post(this.url, delegate, this.authHeaders);
  }

  getDelegateByName(name: string): Observable<OwnDelegate | null> {
    return this._http.get<OwnDelegate | null>(`${this.url}/getBy?name=${name}`);
  }

  getUserDelegates(): void {
    const user: User | null = this._user();
    let delegates$: Observable<OwnDelegate[]> = of([]);

    if (user?.roles.includes('USER')) {
      delegates$ = this._http.get<OwnDelegate[]>(`${this.url}/getBy?userId=${user?._id}`);
    }

    if (user?.roles.includes('ADMIN')) {
      delegates$ = this.getRegisteredDelegates();
    }

    delegates$.subscribe((delegates) => {
      this.userDelegates = delegates;
      this.userDelegates$.next([...this.userDelegates]);
    });
  }

  getRegisteredDelegates(): Observable<OwnDelegate[]> {
    return this._http.get<OwnDelegate[]>(this.url);
  }

  updateDelegate(delegate: OwnDelegate): void {
    this._http.patch<OwnDelegate>(this.url, delegate, this.authHeaders)
      .subscribe((updatedDelegate) => {
        const i = this.userDelegates.findIndex((del) => del._id === updatedDelegate._id);
        this.userDelegates[i] = updatedDelegate;
        this.userDelegates$.next([...this.userDelegates]);
      });
  }

  deleteDelegate(id: string): void {
    this._http.delete(this.url + '/' + id, this.authHeaders)
      .subscribe(() => {
        const i = this.userDelegates.findIndex((del) => del._id === id);
        this.userDelegates.splice(i, 1);
        this.userDelegates$.next([...this.userDelegates]);
      });
  }

  private get authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token!);
    return { headers };
  }
}
