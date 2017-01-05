import { Component } from '@angular/core';

@Component({
  selector: 'join',
  template: `
        <div *ngIf="connected">
          Welcome {{player}}
        </div>
        <div *ngIf="connected==false">
          <h1>Join a room</h1>
    			<div class="info">
                  <label for="inputPlayerName">Your Name:</label>
                  <input id="inputPlayerName" type="text" [(ngModel)]="item.name" />
              </div>

              <div class="info">
                  <label for="inputGameId">Game ID:</label>
                  <input id="inputGameId" [(ngModel)]="item.id" type="text"/>
              </div>
              <button (click)="joinRoom()">Join</button>
        </div>
  `,
})

export class JoinComponent  {
	item:any = {
		name:'',
		id:''
	}
  connected:Boolean
  player:String
  socket:any;
  constructor(){

  }
	initClient(socket:any){
    this.socket = socket
    this.socket.on('playerJoinedRoom',this.playerJoinedRoom.bind(this));
    this.player="" 
    this.connected=false; 
  }
	joinRoom(){
		
		console.log("singer detail ", this.item)
    this.socket.emit('singerJoinRoom',this.item)
	}
  playerJoinedRoom(data){
    debugger
    this.player = data.name
    this.connected= true
  }
}
