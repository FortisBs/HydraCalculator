import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DelegatesService } from "../../../shared/services/delegates.service";
import { AuthService } from "../../../shared/services/auth.service";
import { DatabaseService } from "../../../shared/services/database.service";
import { MatStepper } from "@angular/material/stepper";
import { OwnDelegate } from "../../../shared/models/user.interface";

@Component({
  selector: 'app-add-delegate',
  templateUrl: './add-delegate.component.html',
  styleUrls: ['./add-delegate.component.scss']
})
export class AddDelegateComponent {
  @Output() openDashboard = new EventEmitter<'dashboard'>();
  @Input() ownDelegates!: OwnDelegate[];

  delegateAddress!: string;
  secretKey = Math.floor(Math.random() * 10**10);
  delegateErrorMessage!: string;
  transactionErrorMessage!: string;
  findDelegatePending = false;
  transactionPending = false;

  delegateForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    shareRate: new FormControl(null, [
      Validators.required, Validators.min(0), Validators.max(1)
    ])
  });
  transactionForm = new FormGroup({
    transactionId: new FormControl(null, Validators.required),
  });

  constructor(
    private delegatesService: DelegatesService,
    private auth: AuthService,
    private db: DatabaseService
  ) {}

  goToDashboard() {
    this.openDashboard.emit('dashboard');
  }

  findDelegate(stepper: MatStepper) {
    this.findDelegatePending = true;
    const username = this.delegateForm.value.username! as string;

    this.delegatesService.getDelegate(username).subscribe({
      next: (delegate) => {
        if (!delegate || username !== delegate.username) {
          this.delegateErrorMessage = 'Delegate not found';
          this.findDelegatePending = false;
          return;
        }

        this.db.getRegisteredDelegates().subscribe({
          next: (value) => {
            const isAlreadyRegistered = value.some((delegateData) => {
              return delegateData.username === username;
            });

            if (isAlreadyRegistered) {
              this.delegateErrorMessage = 'Already registered';
              this.findDelegatePending = false;
              return;
            }

            this.delegateAddress = delegate.address;
            this.delegateErrorMessage = '';
            stepper.next();
          }
        });
      }
    });
  }

  confirmTransaction(stepper: MatStepper) {
    this.transactionPending = true;
    const transactionId = this.transactionForm.value.transactionId! as string;

    this.delegatesService.getTransaction(transactionId).subscribe({
      next: (transaction) => {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const oneHourInSeconds = 3600;
        const timeOneHourAgo = currentTime - oneHourInSeconds;
        const myAddress = 'hL6khm9bNfD8TbowVSjry7yQnjmh85JQsJ';

        if (transaction.sender !== this.delegateAddress) {
          this.transactionErrorMessage = 'Wrong sender';
          this.transactionPending = false;
          return;
        }
        if (transaction.recipient !== myAddress) {
          this.transactionErrorMessage = 'Wrong recipient';
          this.transactionPending = false;
          return;
        }
        if (transaction.vendorField !== this.secretKey.toString()) {
          this.transactionErrorMessage = 'Wrong secret key';
          this.transactionPending = false;
          return;
        }
        if (transaction.timestamp.unix < timeOneHourAgo) {
          this.transactionErrorMessage = 'Transaction is too late';
          this.transactionPending = false;
          return;
        }

        this.transactionErrorMessage = '';
        const uid = localStorage.getItem('hydraCalcUser');
        this.createDelegate(uid!)
          .then(() => stepper.next())
          .catch(() => this.ownDelegates.pop());
      },
      error: () => {
        this.transactionErrorMessage = "Transaction doesn't exist";
        this.transactionPending = false;
      }
    });
  }

  private createDelegate(id: string) {
    const username = this.delegateForm.value.username! as string;
    const shareRate = this.delegateForm.value.shareRate! as number;
    this.ownDelegates.push({ username, shareRate });

    return this.db.updateDelegate(id, { ownDelegates: this.ownDelegates });
  }
}
