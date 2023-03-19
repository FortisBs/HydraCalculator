import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../../shared/material/material.module";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { TableComponent } from "./table.component";
import { CalculatorComponent } from "./calculator/calculator.component";
import { VotingComponent } from './voting/voting.component';

@NgModule({
  declarations: [TableComponent, CalculatorComponent, VotingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TableComponent }]),
    FormsModule,
    MaterialModule,
    NgxUiLoaderModule
  ]
})
export class TableModule { }
