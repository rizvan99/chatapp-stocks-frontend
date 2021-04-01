import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Stock} from './stock.model';
import {Observable} from 'rxjs';
import {SocketTwo} from '../../app.module';
import {ChatClient} from '../../chat/shared/chat-client.model';
import {ChatMessage} from '../../chat/shared/chat-message.model';
import {CreateStockDto} from './create-stock.dto';

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

  updateStock(stock: Stock): void {
    this.socket.emit('updateStock', stock);
  }

  createStock(stock: CreateStockDto): void {
    this.socket.emit('createStock', stock);
  }

  deleteStock(id: number): void {
    this.socket.emit('deleteStock', id);
  }

  listenForCreate(): Observable<CreateStockDto> {
    return this.socket.fromEvent<CreateStockDto>('stock-created');
  }
  listenForCreateError(): Observable<string> {
    return this.socket.fromEvent<string>('stock-created-error');
  }
  listenForDelete(): Observable<number> {
    return this.socket.fromEvent<number>('stock-deleted');
  }
  listenForUpdate(): Observable<Stock> {
    return this.socket.fromEvent<Stock>('stock-update');
  }
  getAllStocks(): Observable<Stock[]> {
    return this.socket.fromEvent<Stock[]>('stock-getAll');
  }
  listenForStocks(): Observable<Stock[]> {
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
