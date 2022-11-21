import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OwnDelegate } from "../../../shared/models/user.interface";
import { DatabaseService } from "../../../shared/services/database.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Output() openAddDelegate = new EventEmitter<'addDelegate'>();
  @Input() ownDelegates!: OwnDelegate[];
  editingDelegate!: OwnDelegate;
  previousShareRate!: number;

  constructor(private db: DatabaseService, private dialog: MatDialog) {}

  goToAddDelegate() {
    this.openAddDelegate.emit('addDelegate');
  }

  onDeleteDelegate(index: number) {
    const uid = localStorage.getItem('hydraCalcUser');
    const deletedItem = this.ownDelegates.splice(index, 1);

    this.db.updateDelegate(uid!, { ownDelegates: this.ownDelegates })
      .catch(() => this.ownDelegates.splice(index, 0, ...deletedItem));
  }

  openEdit(del: OwnDelegate, modalEdit: any) {
    this.editingDelegate = del;
    this.previousShareRate = del.shareRate;
    this.dialog.open(modalEdit);
  }

  saveEditedDelegate() {
    const uid = localStorage.getItem('hydraCalcUser');
    if (!uid) {
      this.editingDelegate.shareRate = this.previousShareRate;
      return;
    }

    this.db.updateDelegate(uid, { ownDelegates: this.ownDelegates })
      .then(() => this.dialog.closeAll())
      .catch(() => this.editingDelegate.shareRate = this.previousShareRate);
  }
}
