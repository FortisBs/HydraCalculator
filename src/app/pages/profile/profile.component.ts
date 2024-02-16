import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { OwnDelegate } from "../../shared/models/user.interface";
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { DelegatesService } from "../../shared/services/delegates.service";
import { Observable } from "rxjs";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgFor, AsyncPipe, PercentPipe } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMiniFabAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCard, MatCardTitle, MatMiniFabAnchor, MatTooltip, RouterLink, MatIcon, MatCardContent, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, NgFor, MatButton, FormsModule, ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatFormField, MatLabel, MatInput, MatDialogActions, MatDialogClose, AsyncPipe, PercentPipe]
})
export class ProfileComponent implements OnInit {
  userDelegates$!: Observable<OwnDelegate[]>;
  editingDelegate!: OwnDelegate;
  editForm!: FormGroup;

  constructor(private delegatesService: DelegatesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userDelegates$ = this.delegatesService.userDelegates$;
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
