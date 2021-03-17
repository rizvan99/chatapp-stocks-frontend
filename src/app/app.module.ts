import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@Injectable()
export class SocketOne extends Socket {

  constructor() {
    super({ url: 'http://localhost:3000', options: {} });
  }

}
@Injectable()
export class SocketTwo extends Socket {

  constructor() {
    super({ url: 'http://localhost:3500', options: {} });
  }

}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    NgbModule
  ],
  providers: [SocketOne, SocketTwo],
  bootstrap: [AppComponent]
})
export class AppModule { }
