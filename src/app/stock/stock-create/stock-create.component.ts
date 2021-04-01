import { Component, OnInit } from '@angular/core';
import {Stock} from '../shared/stock.model';
import {FormBuilder} from '@angular/forms';
import {StockService} from '../shared/stock.service';
import {CreateStockDto} from '../shared/create-stock.dto';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss']
})
export class StockCreateComponent implements OnInit {

  stockForm = this.fb.group({
    name: [''],
    description: [''],
    value: [''],
  });
  error: string;

  constructor(private fb: FormBuilder,
              private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.listenForCreate()
      .subscribe(stockCreate => {
        this.stockForm.reset();
      });
    this.stockService.listenForCreateError()
      .subscribe(errorMessage => {
        this.error = errorMessage;
      });
  }

  createStock(): void {
    this.error = undefined;
    const newStock: CreateStockDto  = this.stockForm.value;
    this.stockService.createStock(newStock);
  }

}
