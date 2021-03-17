import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from './shared/stock.service';
import {Stock} from './shared/stock.model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject();
  stocks: Stock[] = [];
  selectedStock: Stock;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {

    this.stockService.getStocks()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( stocksFromDb => {
        this.stocks = stocksFromDb;
      });
    this.stockService.connect();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.stockService.disconnect();
  }

  onSelect(stock: Stock): void {
    this.selectedStock = stock;
  }

}


