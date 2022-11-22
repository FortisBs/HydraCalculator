import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from "./table.component";
import { CalculatorComponent } from "./calculator/calculator.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [TableComponent, CalculatorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TableComponent }]),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTabsModule,
    NgxUiLoaderModule
  ]
})
export class TableModule { }
