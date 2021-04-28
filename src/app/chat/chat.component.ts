import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {JoinChatDto} from './shared/join-chat.dto';
import {StorageService} from '../shared/storage.service';
import {ChatState} from './state/chat.state';
import {Select, Store} from '@ngxs/store';
import {ChatClientLoggedIn, ListenForClients, LoadClientFromStorage, StopListeningForClients} from './state/chat.action';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Select(ChatState.clients) clients$: Observable<ChatClient[]> | undefined;
  @Select(ChatState.clientIds) clientsIds$: Observable<string[]> | undefined;
  @Select(ChatState.loggedInClient) chatClient$: Observable<ChatClient> | undefined;

  messageFc = new FormControl('');
  nicknameFc = new FormControl('');

  messages: ChatMessage[] = [];
  unsubscribe$ = new Subject();
  errors$: Observable<string>;
  // chatClient: ChatClient;
  clientIsTyping: ChatClient[] = [];
  socketId: string;

  constructor(private chatService: ChatService,
              private storageService: StorageService,
              private store: Store) { }

  ngOnInit(): void {

    // this.clients$ = this.chatService.listenForClients();
    this.errors$ = this.chatService.listenForErrors();
    this.store.dispatch(new ListenForClients());


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
        // this.chatClient = this.chatService.chatClient = welcome.client;
        this.store.dispatch(new ChatClientLoggedIn(welcome.client));
        this.storageService.saveChatClient(welcome.client);
      });

    this.store.dispatch(new LoadClientFromStorage());


    /*const oldClient = this.storageService.loadChatClient();
    if (oldClient) {
      this.chatService.joinChat({
        id: oldClient.id,
        nickname: oldClient.nickname
      });
    }*/

    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( (id) => {
        this.socketId = id;
      });
    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( (id) => {
        this.socketId = id;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.dispatch(new StopListeningForClients());
  }

  sendMessage(): void {
    // const clientLoggedIn = this.storageService.loadChatClient();
    const client = this.store.selectSnapshot(ChatState.loggedInClient);
    const newMessage: ChatMessage = {
      message: this.messageFc.value,
      sender: client
    };
    this.chatService.sendMessage(newMessage);
    this.messageFc.setValue('');
  }

  sendNickname(): void {
    if (this.nicknameFc.value)
    {
      const dto: JoinChatDto = {nickname: this.nicknameFc.value};
      this.chatService.joinChat(dto);
    }
  }
}
