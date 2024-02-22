import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HydraledgerService } from "../../shared/services/hydraledger.service";
import { AuthService } from "../../shared/services/auth.service";
import { MatStepper } from "@angular/material/stepper";
import { DelegatesService } from "../../shared/services/delegates.service";
import { LoginResponse, NewDelegate } from "../../shared/models/user.interface";
import { Observable, switchMap } from "rxjs";
import { RouterLink } from '@angular/router';
import { MaterialModule } from "../../shared/modules/material.module";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, MaterialModule]
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
    name: new FormControl(null, Validators.required),
    shareRate: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(0(\.\d{1,2})?|1(\.0{1,2})?)$|^([01](\.\d{1,2})?)$/)
    ])
  });
  transactionForm = new FormGroup({
    transactionId: new FormControl(null, Validators.required),
  });
  profileForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required, Validators.minLength(3)
    ]),
    password: new FormControl(null, [
      Validators.required, Validators.minLength(4), Validators.maxLength(16)
    ])
  });

  constructor(
    private hydraledgerService: HydraledgerService,
    private authService: AuthService,
    private delegatesService: DelegatesService
  ) {}

  findDelegate(stepper: MatStepper) {
    this.findDelegatePending = true;
    const name = this.delegateForm.value.name! as string;

    this.hydraledgerService.getDelegateBy('username', name).subscribe((delegate) => {
      if (!delegate || name !== delegate.username) {
        this.delegateErrorMessage = 'Delegate not found';
        this.findDelegatePending = false;
        return;
      }

      this.delegatesService.getDelegateByName(name).subscribe({
        next: (ownDelegate) => {
          if (ownDelegate) {
            this.delegateErrorMessage = 'Already registered';
            this.findDelegatePending = false;
          } else {
            this.delegateAddress = delegate.address;
            this.delegateErrorMessage = '';
            stepper.next();
          }
        },
        error: (err) => {
          this.delegateErrorMessage = err.error.message;
          this.findDelegatePending = false;
        }
      });
    });
  }

  confirmTransaction(stepper: MatStepper) {
    this.transactionPending = true;
    const transactionId = this.transactionForm.value.transactionId! as string;

    this.hydraledgerService.getTransaction(transactionId).subscribe({
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

  register(stepCredentials: MatStepper) {
    this.registrationPending = true;

    this.createUser()
      .pipe(
        switchMap((res) => this.createDelegate(res.user._id))
      )
      .subscribe({
        next: () => stepCredentials.next(),
        error: (err) => {
          this.registrationPending = false;
          this.registrationErrorMessage = err.error.message;
        }
      });
  }

  private createUser(): Observable<LoginResponse> {
    const { username, password } = this.profileForm.value;
    return this.authService.registerUser(username!, password!).pipe(
      switchMap(() => this.authService.login(username!, password!))
    );
  }

  private createDelegate(userId: string): Observable<unknown> {
    const delegate: NewDelegate = {
      name: this.delegateForm.value.name!,
      shareRate: this.delegateForm.value.shareRate!,
      userId
    };
    return this.delegatesService.addDelegate(delegate);
  }
}
