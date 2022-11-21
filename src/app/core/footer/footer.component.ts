import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(modal: any): void {
    this.dialog.open(modal);
  }
}
