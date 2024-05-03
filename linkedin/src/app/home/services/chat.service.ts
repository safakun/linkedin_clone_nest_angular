import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { User } from 'src/app/auth/models/user.model';
import { ChatSocketService } from '../../../app/core/chat-socket.service';
import { environment } from 'src/environments/environment';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: ChatSocketService, private http: HttpClient) {}

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`);
  }

  sendMessage(message: string, conversation: Conversation): void {
    const newMessage: Message = {
      message,
      conversation,
    };
    this.socket.emit('sendMessage', newMessage);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  createConversation(friend: User): void {
    this.socket.emit('createConversation', friend);
  }

  joinConversation(friendId: number): void {
    this.socket.emit('joinConversation', friendId);
  }

  leaveConversation(): void {
    this.socket.emit('leaveConversation');
  }

  getConversationMessages(): Observable<Message[]> {
    return this.socket.fromEvent<Message[]>('messages');
  }

  getConversations(): Observable<Conversation[]> {
    return this.socket.fromEvent<Conversation[]>('conversations');
  }
}


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { Observable } from 'rxjs';
// import { User } from 'src/app/auth/models/user.model';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {

//   constructor(
//     private socket: Socket,
//     private http: HttpClient
//   ) { }

//   sendMessage(message: string): void {
//     this.socket.emit('sendMessage', message)
//   }

//   getNewMessage(): Observable<string> {
//     return this.socket.fromEvent<string>('newMessage');
//   }

//   getFriends(): Observable<User[]> {
//     return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`)
//   }
// }
