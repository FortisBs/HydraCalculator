import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DelegatesService } from "../../shared/services/delegates.service";
import { DatabaseService } from "../../shared/services/database.service";
import { AuthService } from "../../shared/services/auth.service";
import { MatStepper } from "@angular/material/stepper";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  delegateAddress!: string;
  secretKey = Math.floor(Math.random() * 10**10);
  delegateErrorMessage!: string;
  transactionErrorMessage!: string;
  registrationErrorMessage!: string;
  findDelegatePending = false;
  transactionPending = false;
  registrationPending = false;

  delegateForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    shareRate: new FormControl(null, [
      Validators.required, Validators.min(0), Validators.max(1)
    ])
  });
  transactionForm = new FormGroup({
    transactionId: new FormControl(null, Validators.required),
  });
  profileForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private delegatesService: DelegatesService,
    private auth: AuthService,
    private db: DatabaseService
  ) {}

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
        stepper.next();
      },
      error: () => {
        this.transactionErrorMessage = "Transaction doesn't exist";
        this.transactionPending = false;
      }
    });
  }

  private createUser() {
    const email = this.profileForm.value.email! as string;
    const password = this.profileForm.value.password! as string;

    return this.auth.addUser(email, password);
  }

  private createDelegate(id: string) {
    const username = this.delegateForm.value.username! as string;
    const shareRate = this.delegateForm.value.shareRate! as number;
    const ownDelegates = [{ username, shareRate }];

    return this.db.updateDelegate(id, { ownDelegates });
  }

  register(stepCredentials: MatStepper) {
    this.registrationPending = true;

    this.createUser()
      .then((res) => {
        this.createDelegate(res.user!.uid)
          .then(() => stepCredentials.next())
          .catch(() => {
            this.registrationPending = false;
            this.registrationErrorMessage = 'Something went wrong';
          })
      })
      .catch((error) => this.handleRegistrationError(error));
  }

  private handleRegistrationError(error: any) {
    this.registrationPending = false;
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.registrationErrorMessage = 'Email already in use';
        break;
      case 'auth/invalid-email':
        this.registrationErrorMessage = 'Invalid email';
        break;
      case 'auth/weak-password':
        this.registrationErrorMessage = 'Password is too short';
        break;
      default:
        this.registrationErrorMessage = 'Something went wrong';
    }
  }
}
