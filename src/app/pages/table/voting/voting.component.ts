import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HydraledgerService } from "../../../shared/services/hydraledger.service";
import { FormsModule } from '@angular/forms';
import { MaterialModule } from "../../../shared/modules/material.module";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.scss',
  standalone: true,
  imports: [FormsModule, MaterialModule]
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
