import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HydraledgerService } from "../../../shared/services/hydraledger.service";
import { AuthService } from "../../../shared/services/auth.service";
import { MatStepper } from "@angular/material/stepper";
import { NewDelegate } from "../../../shared/models/user.interface";
import { DelegatesService } from "../../../shared/services/delegates.service";
import { Observable } from "rxjs";
import { RouterLink } from '@angular/router';
import { MaterialModule } from "../../../shared/modules/material.module";

@Component({
  selector: 'app-add-delegate',
  templateUrl: './add-delegate.component.html',
  styleUrl: './add-delegate.component.scss',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, MaterialModule]
})
export class AddDelegateComponent {
  delegateAddress!: string;
  secretKey = Math.floor(Math.random() * 10**10);
  delegateErrorMessage!: string;
  transactionErrorMessage!: string;
  findDelegatePending = false;
  transactionPending = false;

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
        this.createDelegate().subscribe({
          next: () => stepper.next(),
          error: (err) => {
            this.transactionErrorMessage = err.error.message;
            this.transactionPending = false;
          }
        });
      },
      error: () => {
        this.transactionErrorMessage = "Transaction doesn't exist";
        this.transactionPending = false;
      }
    });
  }

  private createDelegate(): Observable<unknown> {
    const delegate: NewDelegate = {
      name: this.delegateForm.value.name!,
      shareRate: this.delegateForm.value.shareRate!,
      userId: this.authService.user()!._id
    };

    return this.delegatesService.addDelegate(delegate);
  }
}
