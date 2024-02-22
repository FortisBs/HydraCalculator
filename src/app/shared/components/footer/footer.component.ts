import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MaterialModule } from "../../modules/material.module";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent {
  private _dialog: MatDialog = inject(MatDialog);

  openDialog(modal: TemplateRef<any>): void {
    this._dialog.open(modal);
  }
}
