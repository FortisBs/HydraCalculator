import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(modal: any): void {
    this.dialog.open(modal);
  }
}