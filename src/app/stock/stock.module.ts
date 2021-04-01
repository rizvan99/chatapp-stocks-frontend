import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import {ReactiveFormsModule} from '@angular/forms';
import { StockCreateComponent } from './stock-create/stock-create.component';


@NgModule({
  declarations: [StockComponent, StockCreateComponent],
    imports: [
        CommonModule,
        StockRoutingModule,
        ReactiveFormsModule
    ]
})
export class StockModule { }
