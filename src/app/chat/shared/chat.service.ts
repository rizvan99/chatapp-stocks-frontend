import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {ChatClient} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {WelcomeDto} from './welcome.dto';
import {SocketOne} from '../../app.module';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatClient: ChatClient;

  constructor(private socket: SocketOne) { }

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  sendTyping(b: boolean): void {
    this.socket.emit('typing', b);
  }

  sendNickname(nickname: string): void {
    this.socket.emit('nickname', nickname);
  }

  listenForMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }

  listenForClients(): Observable<ChatClient[]> {
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  listenForWelcome(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  listenForClientTyping(): Observable<ChatClient> {
    return this.socket
      .fromEvent<ChatClient>('clientTyping');
  }

  listenForConnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('connect')
      .pipe(
        map(
          () => {
            return this.socket.ioSocket.id;
          }
        )
      );
  }

  listenForDisconnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('disconnect')
      .pipe(
        map(
          () => {
            return this.socket.ioSocket.id;
          }
        )
      );
  }

  listenForErrors(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket
      .fromEvent<ChatMessage[]>('allMessages');
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }

}


