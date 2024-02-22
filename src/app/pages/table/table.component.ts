import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IDelegate } from "../../shared/models/delegate.interface";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { DecimalPipe, PercentPipe } from '@angular/common';
import { CalculatorComponent } from './calculator/calculator.component';
import { MaterialModule } from "../../shared/modules/material.module";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [CalculatorComponent, DecimalPipe, PercentPipe, MaterialModule]
})
export class TableComponent implements AfterViewInit {
  displayedColumns = ['rank', 'delegate', 'share', 'votes', 'daily', 'monthly', 'yearly'];
  dataSource = new MatTableDataSource<IDelegate>([]);
  isLoading = true;

  @ViewChild(MatTable) table!: MatTable<IDelegate[]>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.fillTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter(filterInput: HTMLInputElement): void {
    this.dataSource.filter = '';
    filterInput.value = '';
  }

  refreshTable(data: IDelegate[]): void {
    this.dataSource.data = data;
    this.table.renderRows();
    this.isLoading && (this.isLoading = false);
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

  private fillTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortData = this.mySort([], this.sort);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: {username: string}, value:string) => {
      return data.username.trim().toLowerCase().includes(value);
    }
  }
}
