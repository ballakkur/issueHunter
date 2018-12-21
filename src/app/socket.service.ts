import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  url = 'http://localhost:8080/issueTrackingTool'
  constructor() { 
    this.socket = io(this.url);
  }
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verify-user', (data) => {
        observer.next(data);
      });
    });
  }
  public setUser = (authToken) =>{
    this.socket.emit('set-user',authToken);
};

public authError = () =>{
  let listen = Observable.create((observer) =>{
    this.socket.on('auth-error',(err) =>{
      console.log("Received err from auth-error");
      observer.next(err);
    });
  });
  return listen;
};
public watchAIssue = (watcherDetails) =>{
  this.socket.emit('watching-to-a-issue',watcherDetails);
}

public emitGetWatchersList = (issueId) =>{
  
  this.socket.emit('get-watcher-list',issueId);
}

public gettingWatchersList(issueId): any{
  
  let listen = Observable.create((observer) =>{
    this.socket.on(issueId,(data) =>{
      observer.next(data);
    });
  });
  return listen;
};

public broadcastToAllWatchers = (data) =>{
  
  this.socket.emit('broadcast-to-watchers',data);
}

public getNotification(): any{
  
  let listen = Observable.create((observer) =>{
    this.socket.on('notify-watchers',(data) =>{
      console.log("Notification");
      observer.next(data);
    });
  });
  return listen;
};

// we are creating this event to delete the user from online user,because above functions only calls up on closing the window
public logout = () =>{
  this.socket.emit('logout','');
};

public exitSocket(): any{
  // disconnect event which is on server is emitted by the browser on closing the tab by default
  this.socket.disconnect();
  
}
}
