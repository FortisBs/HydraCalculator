import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, Subject } from "rxjs";
import { IDelegate } from "../models/delegate.interface";
import { ITransaction } from "../models/transaction.interface";
import { IWallet } from "../models/wallet.interface";

@Injectable({
  providedIn: 'root'
})
export class DelegatesService {
  delegateList$ = new Subject<IDelegate[]>();

  constructor(private http: HttpClient) {}

  updateDelegateList(list: IDelegate[]) {
    this.delegateList$.next(list);
  }

  getAll(): Observable<IDelegate[]> {
    const url = 'https://explorer.hydraledger.io:4705/api/v2/delegates?limit=53';
    return this.http.get<{data: IDelegate[], meta: any}>(url).pipe(
      map((response) => response.data)
    );
  }

  getDelegate(username: string): Observable<IDelegate> {
    const url = `https://explorer.hydraledger.io:4705/api/v2/delegates?username=${username}`;
    return this.http.get<{data: IDelegate[], meta: any}>(url).pipe(
      map((response) => response.data[0])
    );
  }

  getWallet(address: string): Observable<IWallet> {
    const url = 'https://explorer.hydraledger.io:4705/api/v2/wallets/';
    return this.http.get<{data: IWallet}>(url + address).pipe(
      map(response => response.data)
    );
  }

  getTransaction(id: string): Observable<ITransaction> {
    const url = `https://explorer.hydraledger.io:4705/api/v2/transactions/${id}`;
    return this.http.get<{data: ITransaction}>(url).pipe(
      map((response) => response.data)
    );
  }
}
