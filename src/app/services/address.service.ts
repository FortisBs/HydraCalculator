import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Wallet } from "../models/wallet.interface";

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly url: string = 'https://explorer.hydraledger.io:4705/api/v2/wallets/';

  constructor(private http: HttpClient) {}

  getWallet(address: string): Observable<Wallet> {
    return this.http.get<{data: Wallet}>(this.url + address).pipe(
      map(response => response.data)
    );
  }
}
