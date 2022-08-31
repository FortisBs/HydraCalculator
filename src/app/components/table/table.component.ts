import { Component, OnInit, ViewChild } from '@angular/core';
import { DelegatesService } from "../../services/delegates.service";
import { AddressService } from "../../services/address.service";
import { IDelegate } from "../../models/delegate.interface";
import { IWallet } from "../../models/wallet.interface";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { delShareData } from "../../utils/del-share";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'delegate', 'share', 'votes', 'daily', 'monthly', 'yearly'];
  dataSource!: MatTableDataSource<IDelegate>;
  hydAmount: string = '100000';
  hydAddress: string = '';
  isValidAddress: boolean = true;
  smallScreen!: boolean;

  @ViewChild(MatTable) table!: MatTable<IDelegate[]>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private delegatesService: DelegatesService,
              private addressService: AddressService,
              private ngxLoader: NgxUiLoaderService
  ) {
    this.smallScreen = window.screen.width < 700;
    if (this.smallScreen) this.displayedColumns.splice(-2);
  }

  ngOnInit(): void {
    this.delegatesService.getAll().subscribe((data: IDelegate[]) => {
      this.dataSource = new MatTableDataSource(this.extendDelegate(data));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortData = this.mySort(data, this.sort);
      this.dataSource.filterPredicate = (data: {username: string}, filter:string) => {
        return data.username.trim().toLowerCase().includes(filter);
      }
      console.log(this.dataSource.data);
    });
  }

  private calcReward(votes: number, share: number): number {
    const delegates = 53;
    const blockReward = 8;
    const blockTime = 12;
    const secInOneDay = 86400;
    const hydsPerDay = (secInOneDay / blockTime) * blockReward;
    const delegateForgesPerDay = (hydsPerDay / delegates) * share;
    const userPartInVotes = +this.hydAmount / votes;

    return delegateForgesPerDay * userPartInVotes;
  }

  private extendDelegate(arr: IDelegate[]): IDelegate[] {
    return arr.map((delegate: IDelegate) => {
      delegate.share = delShareData[delegate.username] ?? 0;
      delegate.votes = +delegate.votes / 10**8;
      delegate.payment = this.calcReward(delegate.votes, delegate.share);
      return delegate;
    });
  }

  recalculate(): void {
    this.ngxLoader.startLoader('table-loader');

    this.dataSource.data.forEach((delegate: IDelegate) => {
      delegate.payment = this.calcReward(delegate.votes, delegate.share);
    });
    this.table.renderRows();

    this.ngxLoader.stopLoader('table-loader');
  }

  calcByAddress(): void {
    if (!this.hydAddress || this.hydAddress.length < 34) {
      this.isValidAddress = false;
      return;
    }

    try {
      this.addressService.getWallet(this.hydAddress).subscribe((wallet: IWallet) => {
        this.hydAmount = wallet.balance.slice(0, 6);
        this.isValidAddress = true;
        this.recalculate();
      });
    } catch (e) {
      this.isValidAddress = false;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private mySort(data: IDelegate[], sort: MatSort) {
    return (data: IDelegate[], sort: MatSort) => {
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

}
