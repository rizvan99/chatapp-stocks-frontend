import {ChatClient} from './chat-client.model';

export interface ChatMessage {
  id?: number;
  message: string;
  sender: ChatClient;
}
