import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { IDelegate } from "../models/delegate.interface";
import { ITransaction } from "../models/transaction.interface";
import { IWallet } from "../models/wallet.interface";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HydraledgerService {
  private url = environment.hydraledgerExplorerUrl;
  private _delegateList: WritableSignal<IDelegate[]> = signal([]);

  delegateList: Signal<IDelegate[]> = this._delegateList.asReadonly();

  constructor(private http: HttpClient) {}

  updateDelegateList(list: IDelegate[]): void {
    this._delegateList.set(list);
  }

  getAll(): Observable<IDelegate[]> {
    const url = `${this.url}/delegates?limit=53`;
    return this.http.get<{data: IDelegate[], meta: any}>(url).pipe(
      map((response) => response.data)
    );
  }

  getDelegateBy(query: 'username' | 'publicKey', value: string): Observable<IDelegate> {
    const url = `${this.url}/delegates?${query}=${value}`;
    return this.http.get<{data: IDelegate[], meta: any}>(url).pipe(
      map((response) => response.data[0])
    );
  }

  getWallet(address: string): Observable<IWallet> {
    const url = `${this.url}/wallets/${address}`;
    return this.http.get<{data: IWallet}>(url).pipe(
      map(response => response.data)
    );
  }

  getTransaction(id: string): Observable<ITransaction> {
    const url = `${this.url}/transactions/${id}`;
    return this.http.get<{data: ITransaction}>(url).pipe(
      map((response) => response.data)
    );
  }
}
