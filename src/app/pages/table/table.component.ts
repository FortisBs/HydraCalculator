import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IDelegate } from "../../shared/models/delegate.interface";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatTable, MatTableDataSource, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow } from "@angular/material/table";
import { HydraledgerService } from "../../shared/services/hydraledger.service";
import { Subscription } from "rxjs";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, DecimalPipe, PercentPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { CalculatorComponent } from './calculator/calculator.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CalculatorComponent, MatFormField, MatLabel, MatInput, MatIconButton, MatSuffix, MatIcon, NgIf, MatProgressSpinner, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow, MatPaginator, DecimalPipe, PercentPipe]
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns = ['rank', 'delegate', 'share', 'votes', 'daily', 'monthly', 'yearly'];
  dataSource!: MatTableDataSource<IDelegate>;
  firstLoad = true;
  subscription!: Subscription;

  @ViewChild(MatTable) table!: MatTable<IDelegate[]>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private delegateService: HydraledgerService) {}

  ngOnInit(): void {
    this.subscription = this.delegateService.delegateList$.subscribe((data) => {
      (this.firstLoad) ? this.fillTable(data) : this.refreshTable(data);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter(filterInput: HTMLInputElement): void {
    this.dataSource.filter = '';
    filterInput.value = '';
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private mySort(data: IDelegate[], sort: MatSort) {
    return (data: IDelegate[], sort: MatSort) => {
      this.paginator.pageIndex = 0;

      return data.sort((a: IDelegate, b: IDelegate) => {
        const isAsc = sort.direction === 'asc';

        switch (sort.active) {
          case 'rank': return this.compare(a.rank, b.rank, isAsc);
          case 'delegate': return this.compare(a.username, b.username, isAsc);
          case 'share': return this.compare(a.share, b.share, isAsc);
          case 'votes': return this.compare(a.votes, b.votes, isAsc);
          case 'daily': return this.compare(a.payment, b.payment, isAsc);
          case 'monthly': return this.compare(a.payment, b.payment, isAsc);
          case 'yearly': return this.compare(a.payment, b.payment, isAsc);
          default: return 0;
        }
      });
    }
  }

  private fillTable(data: IDelegate[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortData = this.mySort(data, this.sort);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: {username: string}, value:string) => {
      return data.username.trim().toLowerCase().includes(value);
    }
    this.firstLoad = false;
  }

  private refreshTable(data: IDelegate[]) {
    this.dataSource.data = data;
    this.table.renderRows();
  }
}
