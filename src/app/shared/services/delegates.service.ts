import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { NewDelegate, OwnDelegate, User } from "../models/user.interface";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DelegatesService {
  private _http: HttpClient = inject(HttpClient);
  private _user: Signal<User | null> = inject(AuthService).user;

  private url = environment.serverUrl + '/delegates';
  private _userDelegates: WritableSignal<OwnDelegate[]> = signal([]);

  userDelegates: Signal<OwnDelegate[]> = this._userDelegates.asReadonly();

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
      this._userDelegates.set(delegates);
    });
  }

  getRegisteredDelegates(): Observable<OwnDelegate[]> {
    return this._http.get<OwnDelegate[]>(this.url);
  }

  updateDelegate(delegate: OwnDelegate): void {
    this._http.patch<OwnDelegate>(this.url, delegate, this.authHeaders).subscribe((updatedDelegate) => {
      const updatedList = this.userDelegates().map((del) => {
        return del._id === updatedDelegate._id ? updatedDelegate : del;
      });

      this._userDelegates.set(updatedList);
    });
  }

  deleteDelegate(id: string): void {
    this._http.delete(this.url + '/' + id, this.authHeaders).subscribe(() => {
      const updatedList = this.userDelegates().filter((del) => del._id === id);

      this._userDelegates.set(updatedList);
    });
  }

  private get authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token!);
    return { headers };
  }
}
