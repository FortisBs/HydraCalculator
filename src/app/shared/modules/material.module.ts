import { NgModule, Type } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor, MatButton, MatIconButton, MatMiniFabAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatTooltip } from "@angular/material/tooltip";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { MatStep, MatStepLabel, MatStepper } from "@angular/material/stepper";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  MatTable,
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef
} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTab, MatTabGroup } from "@angular/material/tabs";

const materialModules: Type<any>[] = [
  MatToolbar,
  MatIconButton,
  MatIcon,
  MatDialogContent,
  MatDialogActions,
  MatButton,
  MatDialogClose,
  MatCard,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatFormField,
  MatLabel,
  MatInput,
  MatMiniFabAnchor,
  MatTooltip,
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription,
  MatDialogTitle,
  MatAnchor,
  MatStepper,
  MatStep,
  MatStepLabel,
  MatHint,
  MatSuffix,
  MatProgressSpinner,
  MatTable,
  MatSort,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatSortHeader,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatNoDataRow,
  MatPaginator,
  MatTabGroup,
  MatTab,
];

@NgModule({
  imports: [materialModules],
  exports: [materialModules]
})
export class MaterialModule {}
