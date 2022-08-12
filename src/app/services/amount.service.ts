import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AmountService {
  amount$ = new Subject();

  changeAmount(amount: any) {
    this.amount$.next(amount);
  }
}
