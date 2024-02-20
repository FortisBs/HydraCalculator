import { Component, OnInit } from '@angular/core';
import { HydraledgerService } from "../../../shared/services/hydraledger.service";
import { IDelegate } from "../../../shared/models/delegate.interface";
import { IWallet } from "../../../shared/models/wallet.interface";
import { switchMap } from "rxjs";
import { OwnDelegate } from "../../../shared/models/user.interface";
import { DelegatesService } from "../../../shared/services/delegates.service";
import { VotingComponent } from '../voting/voting.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  standalone: true,
  imports: [VotingComponent, MatTabGroup, MatTab, MatFormField, MatLabel, MatInput, FormsModule, MatSuffix, MatButton, MatIconButton, MatIcon]
})
export class CalculatorComponent implements OnInit {
  hydAmount = 100000;
  hydAddress = '';
  votedDelegate = '';
  isValidAddress = true;
  openVoting = false;
  delegates: IDelegate[] = [];

  constructor(
    private hydraledgerService: HydraledgerService,
    private delegatesService: DelegatesService
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

      delegate.share = registeredDelShareRate ?? 0;
      delegate.votes = +delegate.votes / 10**8;
      delegate.payment = this.calcReward(delegate.votes, delegate.share);

      return delegate;
    });
  }

  recalculate(): void {
    this.delegates.forEach((delegate: IDelegate) => {
      delegate.payment = this.calcReward(delegate.votes, delegate.share);
    });
    this.hydraledgerService.updateDelegateList(this.delegates);
  }

  calcByAddress(): void {
    if (!this.hydAddress || this.hydAddress.length < 34) {
      this.isValidAddress = false;
      return;
    }

    this.hydraledgerService.getWallet(this.hydAddress).subscribe({
      next: (wallet: IWallet) => {
        this.isValidAddress = true;
        this.openVoting = true;
        this.hydAmount = +wallet.balance.slice(0, -8);
        this.recalculate();

        if (wallet.vote) {
          this.hydraledgerService
            .getDelegateBy('publicKey', wallet.vote)
            .subscribe((delegate) => {
              this.votedDelegate = delegate.username;
            });
        } else {
          this.votedDelegate = '';
        }
      },
      error: () => {
        this.isValidAddress = false;
      }
    });
  }

  clearAddress(): void {
    this.hydAddress = '';
    this.isValidAddress = true;
  }

  recalculateFromVoting(simulatedDelegate: string): void {
    this.delegates.forEach((delegate: IDelegate) => {
      if (delegate.username === this.votedDelegate) {
        delegate.votes -= this.hydAmount;
      }
      if (delegate.username === simulatedDelegate) {
        delegate.votes += this.hydAmount;
      }
      delegate.payment = this.calcReward(delegate.votes, delegate.share);
    });
    this.votedDelegate = simulatedDelegate;
    this.hydraledgerService.updateDelegateList(this.delegates);
  }
}
