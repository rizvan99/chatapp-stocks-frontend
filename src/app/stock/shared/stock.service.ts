import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Stock} from './stock.model';
import {Observable} from 'rxjs';
import {SocketTwo} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketTwo) {
  }

  getStocks(): Observable<Stock[]> {
    return this.socket
      .fromEvent<Stock[]>('stocks');
  }

  connect(): void {
    this.socket.connect();
  }
  disconnect(): void {
    this.socket.disconnect();
  }

}
