import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from './shared/stock.service';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ChatClient} from '../chat/shared/chat-client.model';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject();
  stocks: Stock[] = [];
  selectedStock: Stock;
  updateStockValue = new FormControl('');
  stocks$: Observable<Stock[]>;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stocks$ = this.stockService.listenForStocks();

    this.stockService.getStocks()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( stocksFromDb => {
        this.stocks = stocksFromDb;
      });

    this.stockService.listenForCreate()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(stockCreate => {
        this.stocks.push(stockCreate);
      });

    this.stockService.listenForDelete()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(deletedStock => {
        console.log('stock id to delete', deletedStock);
        const index = this.stocks.findIndex(s => s.id === deletedStock);
        this.stocks.splice(index, 1);
        this.selectedStock = null;
      });

    this.stockService.listenForUpdate()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(updatedStock => {
        const index = this.stocks.findIndex(s => s.id === updatedStock.id);
        this.stocks[index] = updatedStock;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.stockService.disconnect();
  }

  onSelect(stock: Stock): void {
    this.selectedStock = stock;
    this.updateStockValue.setValue(stock.value);
  }

  updateStock(): void {
    const selStock = this.selectedStock;
    if (selStock) {
      selStock.value = this.updateStockValue.value;
      this.stockService.updateStock(selStock);
    }
  }

  deleteStock(): void {
    const stockToDelete = this.selectedStock;
    if (stockToDelete) {
      this.stockService.deleteStock(stockToDelete.id);
    }
  }

}


