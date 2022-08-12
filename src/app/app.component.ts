import { Component } from '@angular/core';
import { AmountService } from "./services/amount.service";
import { AddressService } from "./services/address.service";
import { Wallet } from "./models/wallet.interface";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HydraCalculator';
  hydAmount: string = '100000';
  hydAddress: string = '';
  isValidAddress: boolean = true;

  constructor(private amountService: AmountService,
              private addressService: AddressService
  ) {}

  setAmount() {
    this.amountService.changeAmount(this.hydAmount);
  }

  setAmountByAddress() {
    if (!this.hydAddress || this.hydAddress.length < 34) {
      this.isValidAddress = false;
      return;
    }

    try {
      this.addressService.getWallet(this.hydAddress).subscribe((wallet: Wallet) => {
        this.hydAmount = wallet.balance.slice(0, 6);
        this.setAmount();
        this.isValidAddress = true;
      });
    } catch (e) {
      this.isValidAddress = false;
    }
  }

}
