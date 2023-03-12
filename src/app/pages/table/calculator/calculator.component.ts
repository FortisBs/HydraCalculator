import { Component, OnInit } from '@angular/core';
import { HydraledgerService } from "../../../shared/services/hydraledger.service";
import { IDelegate } from "../../../shared/models/delegate.interface";
import { delShareData } from "../../../utils/del-share";
import { IWallet } from "../../../shared/models/wallet.interface";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Subscription, switchMap } from "rxjs";
import { OwnDelegate } from "../../../shared/models/user.interface";
import { DelegatesService } from "../../../shared/services/delegates.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  hydAmount: number = 100000;
  hydAddress: string = '';
  isValidAddress: boolean = true;
  delegates!: IDelegate[];
  subscription!: Subscription;

  constructor(
    private hydraledgerService: HydraledgerService,
    private delegatesService: DelegatesService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    let registeredDelegates: OwnDelegate[];
    this.delegatesService.getRegisteredDelegates().pipe(
      switchMap((databaseDelegates) => {
        registeredDelegates = databaseDelegates;
        return this.hydraledgerService.getAll();
      })
    ).subscribe((data) => {
      this.delegates = this.extendDelegate(data, registeredDelegates);
      this.hydraledgerService.updateDelegateList(this.delegates);
    });
  }

  private calcReward(votes: number, share: number): number {
    const delegates = 53;
    const blockReward = 8;
    const blockTime = 12;
    const secInOneDay = 86400;
    const hydsPerDay = (secInOneDay / blockTime) * blockReward;
    const delegateForgesPerDay = (hydsPerDay / delegates) * share;
    const userPartInVotes = this.hydAmount / votes;

    return delegateForgesPerDay * userPartInVotes;
  }

  private extendDelegate(arr: IDelegate[], registeredDelegates: OwnDelegate[]): IDelegate[] {
    return arr.map((delegate: IDelegate) => {
      const timeHalfHourAgo = new Date().getTime() / 1000 - 1800;
      let registeredDelShareRate: number | null = null;

      delegate.isForging = delegate.blocks.last.timestamp.unix > timeHalfHourAgo;
      delegate.isRegistered = registeredDelegates.some((del) => {
        const registeredStatus = del.name === delegate.username;
        registeredDelShareRate = registeredStatus ? del.shareRate : null;
        return registeredStatus;
      });

      delegate.share = delegate.isRegistered
        ? registeredDelShareRate
        : (delShareData[delegate.username] ?? 0);
      delegate.votes = +delegate.votes / 10**8;
      delegate.payment = this.calcReward(delegate.votes, delegate.share);

      return delegate;
    });
  }

  recalculate(): void {
    this.ngxLoader.startLoader('table-loader');
    this.delegates.forEach((delegate: IDelegate) => {
      delegate.payment = this.calcReward(delegate.votes, delegate.share);
    });
    this.hydraledgerService.updateDelegateList(this.delegates);
    this.ngxLoader.stopLoader('table-loader');
  }

  calcByAddress(): void {
    if (!this.hydAddress || this.hydAddress.length < 34) {
      this.isValidAddress = false;
      return;
    }

    this.hydraledgerService.getWallet(this.hydAddress).subscribe({
      next: (wallet: IWallet) => {
        this.hydAmount = +wallet.balance.slice(0, -8);
        this.isValidAddress = true;
        this.recalculate();
      },
      error: () => {
        this.isValidAddress = false;
      }
    });
  }
}
