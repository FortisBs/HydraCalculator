import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IDelegate } from "../../shared/models/delegate.interface";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { DelegatesService } from "../../shared/services/delegates.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['rank', 'delegate', 'share', 'votes', 'daily', 'monthly', 'yearly'];
  dataSource!: MatTableDataSource<IDelegate>;
  firstLoad: boolean = true;
  subscription!: Subscription;

  @ViewChild(MatTable) table!: MatTable<IDelegate[]>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private delegateService: DelegatesService) {}

  ngOnInit(): void {
    this.subscription = this.delegateService.delegateList$.subscribe((data) => {
      (this.firstLoad) ? this.fillTable(data) : this.refreshTable(data);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter(filterInput: HTMLInputElement): void {
    this.dataSource.filter = '';
    filterInput.value = '';
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private mySort(data: IDelegate[], sort: MatSort) {
    return (data: IDelegate[], sort: MatSort) => {
      return data.sort((a: IDelegate, b: IDelegate) => {
        const isAsc = sort.direction === 'asc';
        if (!sort.direction) return this.compare(a.rank, b.rank, true);
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
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = this.mySort(data, this.sort);
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
