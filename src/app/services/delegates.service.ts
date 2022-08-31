import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { IDelegate } from "../models/delegate.interface";

@Injectable({
  providedIn: 'root'
})
export class DelegatesService {
  private readonly url: string = 'https://explorer.hydraledger.io:4705/api/v2/delegates?limit=53';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IDelegate[]> {
    return this.http.get<{data: IDelegate[], meta: any}>(this.url).pipe(
      map((response) => response.data)
    );
  }

}
