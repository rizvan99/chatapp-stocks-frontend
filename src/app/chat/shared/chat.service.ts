import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {ChatClient} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {WelcomeDto} from './welcome.dto';
import {SocketOne} from '../../app.module';
import {map} from 'rxjs/operators';
import {JoinChatDto} from './join-chat.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatClient: ChatClient;

  constructor(private socket: SocketOne) { }

  sendMessage(msg: ChatMessage): void {
    this.socket.emit('message', msg);
  }

  sendTyping(b: boolean): void {
    this.socket.emit('typing', b);
  }

  joinChat(dto: JoinChatDto): void {
    this.socket.emit('joinChat', dto);
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

  disconnect(): void {
    this.socket.disconnect();
  }

  connect(): void {
    this.socket.connect();
  }

}


