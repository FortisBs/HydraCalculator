import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { OwnDelegate } from "../../shared/models/user.interface";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { DelegatesService } from "../../shared/services/delegates.service";
import { Observable } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
