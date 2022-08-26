import { Component } from '@angular/core';
import { AmountService } from "./services/amount.service";
import { AddressService } from "./services/address.service";
import { Wallet } from "./models/wallet.interface";
import { MatDialog } from "@angular/material/dialog";
import { delShareData } from "./utils/del-share";

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
  delName!: string;
  delShare!: string;
  secretCounter: number = 0;

  constructor(private amountService: AmountService,
              private addressService: AddressService,
              private dialog: MatDialog,
  ) {}

  setAmount(): void {
    this.amountService.changeAmount(this.hydAmount);
  }

  setAmountByAddress(): void {
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

  openDialog(modal: any): void {
    this.dialog.open(modal);
  }

  secretDialog(modal: any): void {
    this.secretCounter++;

    if (this.secretCounter === 10) {
      this.dialog.open(modal);
      this.secretCounter = 0;
    }
  }

  secretUpdate(): void {
    if (this.delName && this.delShare) {
      if (delShareData.hasOwnProperty(this.delName)) {
        console.log(delShareData[this.delName]);

        delShareData[this.delName] = +this.delShare;
        console.log(delShareData[this.delName])
        // window.location.reload();
      }
    }
  }

}
