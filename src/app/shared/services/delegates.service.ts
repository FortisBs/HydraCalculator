import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { NewDelegate, OwnDelegate } from "../models/user.interface";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DelegatesService {
  private url = environment.serverUrl + '/delegates';
  private userDelegates: OwnDelegate[] = [];
  userDelegates$ = new BehaviorSubject<OwnDelegate[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  addDelegate(delegate: NewDelegate): Observable<unknown> {
    return this.http.post(this.url, delegate, this.authHeaders);
  }

  getDelegateByName(name: string): Observable<OwnDelegate | null> {
    return this.http.get<OwnDelegate | null>(`${this.url}/getBy?name=${name}`);
  }

  getUserDelegates(): void {
    this.authService.user$.pipe(
      switchMap((user) => {
        return this.http.get<OwnDelegate[]>(`${this.url}/getBy?userId=${user?._id}`);
      })
    ).subscribe((delegates) => {
      this.userDelegates = delegates;
      this.userDelegates$.next([...this.userDelegates]);
    });
  }

  getRegisteredDelegates(): Observable<OwnDelegate[]> {
    return this.http.get<OwnDelegate[]>(this.url);
  }

  updateDelegate(delegate: OwnDelegate): void {
    this.http.patch<OwnDelegate>(this.url, delegate, this.authHeaders)
      .subscribe((updatedDelegate) => {
        const i = this.userDelegates.findIndex((del) => del._id === updatedDelegate._id);
        this.userDelegates[i] = updatedDelegate;
        this.userDelegates$.next([...this.userDelegates]);
      });
  }

  deleteDelegate(id: string): void {
    this.http.delete(this.url + '/' + id, this.authHeaders)
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
