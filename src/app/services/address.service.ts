import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { IWallet } from "../models/wallet.interface";

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly url: string = 'https://explorer.hydraledger.io:4705/api/v2/wallets/';

  constructor(private http: HttpClient) {}

  getWallet(address: string): Observable<IWallet> {
    return this.http.get<{data: IWallet}>(this.url + address).pipe(
      map(response => response.data)
    );
  }
}
