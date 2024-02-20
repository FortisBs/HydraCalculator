import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HydraledgerService } from "../../../shared/services/hydraledger.service";
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
  standalone: true,
  imports: [MatIconButton, MatTooltip, MatIcon, MatFormField, MatLabel, MatInput, FormsModule]
})
export class VotingComponent {
  @Input() votedDelegate = '';
  @Output() simulateVote = new EventEmitter<string>();

  isEditing = false;
  reqPending = false;
  editName = '';
  errorMessage = '';

  constructor(private hydraledgerService: HydraledgerService) {}

  openEdit(): void {
    this.editName = this.votedDelegate;
    this.isEditing = true;
  }

  closeEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
  }

  saveEdit(): void {
    if (this.votedDelegate === this.editName) {
      this.closeEdit();
      return;
    }

    if (!this.editName) {
      this.votedDelegate = this.editName;
      this.simulateVote.emit(this.votedDelegate);
      this.closeEdit();
      return;
    }

    this.reqPending = true;
    this.hydraledgerService
      .getDelegateBy('username', this.editName)
      .subscribe((delegate) => {
        if (!delegate || delegate.username !== this.editName) {
          this.errorMessage = 'Delegate not found';
          this.reqPending = false;
          return;
        }

        this.votedDelegate = this.editName;
        this.simulateVote.emit(this.votedDelegate);
        this.reqPending = false;
        this.closeEdit();
      });
  }
}
