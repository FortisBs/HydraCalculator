import { ChangeDetectionStrategy, Component, inject, OnInit, Signal, TemplateRef } from '@angular/core';
import { OwnDelegate } from "../../shared/models/user.interface";
import { MatDialog } from "@angular/material/dialog";
import { DelegatesService } from "../../shared/services/delegates.service";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from "../../shared/modules/material.module";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, PercentPipe, MaterialModule]
})
export class ProfileComponent implements OnInit {
  private delegatesService: DelegatesService = inject(DelegatesService);
  private dialog: MatDialog = inject(MatDialog);

  userDelegates: Signal<OwnDelegate[]> = this.delegatesService.userDelegates;
  editingDelegate!: OwnDelegate;
  editForm!: FormGroup;

  ngOnInit(): void {
    this.delegatesService.getUserDelegates();
  }

  onDeleteDelegate(id: string): void {
    this.delegatesService.deleteDelegate(id);
  }

  openEdit(delegate: OwnDelegate, modalEdit: TemplateRef<any>): void {
    this.editingDelegate = { ...delegate };
    this.editForm = new FormGroup({
      shareRate: new FormControl(this.editingDelegate.shareRate, [
        Validators.required,
        Validators.pattern(/^(0(\.\d{1,2})?|1(\.0{1,2})?)$|^([01](\.\d{1,2})?)$/)
      ])
    });
    this.dialog.open(modalEdit);
  }

  onEditDelegate(): void {
    this.editingDelegate.shareRate = this.editForm.value.shareRate;
    this.delegatesService.updateDelegate(this.editingDelegate);
    this.dialog.closeAll();
  }
}
