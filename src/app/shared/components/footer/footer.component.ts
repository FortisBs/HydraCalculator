import {ChangeDetectionStrategy, Component, inject, TemplateRef} from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbar, MatIconButton, MatIcon, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class FooterComponent {
  private _dialog: MatDialog = inject(MatDialog);

  openDialog(modal: TemplateRef<any>): void {
    this._dialog.open(modal);
  }
}
