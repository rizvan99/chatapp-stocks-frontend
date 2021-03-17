import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageFc = new FormControl('');
  nicknameFc = new FormControl('');

  messages: ChatMessage[] = [];
  unsubscribe$ = new Subject();
  clients$: Observable<ChatClient[]>;
  errors$: Observable<string>;
  chatClient: ChatClient;
  clientIsTyping: ChatClient[] = [];
  socketId: string;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {

    this.clients$ = this.chatService.listenForClients();
    this.errors$ = this.chatService.listenForErrors();

    // Needs to be reworked
    this.chatService.getAllMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(msg => {
        this.messages = msg;
      });

    // Listen when someone starts typing
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe(value => {
        this.chatService.sendTyping(value.length > 0);
      });

    this.chatService.listenForClientTyping()
      .pipe(takeUntil(this.unsubscribe$)
      )
      .subscribe(chatClient => {
        if (chatClient.isTyping && !this.clientIsTyping.find((c) => c.id === chatClient.id)) {
          this.clientIsTyping.push(chatClient);
        } else {
          this.clientIsTyping = this.clientIsTyping.filter((c) => c.id !== chatClient.id);
        }
      });

    // When someone sends a message, display it
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });

    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
      });

    if (this.chatService.chatClient) {
      this.chatService.sendNickname(this.chatService.chatClient.nickname);
    }



  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.setValue('');
  }

  sendNickname(): void {
    if (this.nicknameFc.value)
    {
      this.chatService.sendNickname(this.nicknameFc.value);
    }

  }
}
