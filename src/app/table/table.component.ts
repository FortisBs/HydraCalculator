import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DelegatesService } from "../services/delegates.service";
import { Delegate } from "../models/delegate.interface";
import { delShare } from "../utils/del-share"
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { AmountService } from "../services/amount.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'delegate', 'share', 'votes', 'daily', 'monthly', 'yearly'];
  dataSource!: MatTableDataSource<Delegate>;

  @Input() userHydAmount!: number;
  @ViewChild(MatTable) table!: MatTable<Delegate[]>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private delegatesService: DelegatesService,
              private amountService: AmountService
  ) {}

  ngOnInit(): void {
    this.delegatesService.getAll().subscribe((data: Delegate[]) => {
      this.dataSource = new MatTableDataSource(this.extendDelegate(data));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.sortData = (data: Delegate[], sort: MatSort) => {
        return data.sort((a: Delegate, b: Delegate) => {
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

      this.dataSource.filterPredicate = (data: {username: string}, filter:string) => {
        return data.username.trim().toLowerCase().includes(filter);
      }
      console.log(this.dataSource);
    });

    this.amountService.amount$.subscribe(data => this.recalculate(data));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private calcReward(votes: number, amount: number, share: number): number {
    const delegates = 53;
    const blockReward = 8;
    const blockTime = 12;
    const secInOneDay = 86400;
    const hydsPerDay = (secInOneDay / blockTime) * blockReward;
    const delegateForgesPerDay = (hydsPerDay / delegates) * share;
    const userPartInVotes = amount / votes;

    return delegateForgesPerDay * userPartInVotes;
  }

  private extendDelegate(arr: Delegate[]): Delegate[] {
    return arr.map((delegate: Delegate) => {
      delegate.share = delShare[delegate.username] ?? 0;
      delegate.votes = +delegate.votes / 10**8;
      delegate.payment = this.calcReward(delegate.votes, this.userHydAmount, delegate.share);
      return delegate;
    });
  }

  recalculate(amount: any): void {
    this.dataSource.data.forEach((delegate: Delegate) => {
      delegate.payment = this.calcReward(delegate.votes, amount, delegate.share);
    });
    this.table.renderRows();
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
