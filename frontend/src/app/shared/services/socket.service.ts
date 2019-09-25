import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';

interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
  }
  
declare var io : {
  connect(url: string): Socket;
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: Socket;
  observer: Observer<number>;

  msgSocket: Socket;
  msgObserver: Observer<number>;

  getQuotes(userId) : Observable<number> {
    this.socket = socketIo('http://localhost:8100');

    this.socket.emit('clientdata', userId);

    this.socket.on('data', (res) => {
      this.observer.next(res);
    });

    return this.createObservable();
  }

  createObservable() : Observable<number> {
      return new Observable(observer => {
        this.observer = observer;

      });
  }

  getMsg(userId): Observable<number> {
    this.msgSocket = socketIo('http://localhost:8200');
    this.msgSocket.emit('clientdata', userId);
    this.msgSocket.on('data', (res)=>{
      this.msgObserver.next(res);
    });
    return this.createMsgObservable();
  }
  createMsgObservable() : Observable<number> {
    return new Observable(observer => {
      this.msgObserver = observer;
    });
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        let errMessage = error.error.message;
        return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

}