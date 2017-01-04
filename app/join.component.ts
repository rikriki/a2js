import { Component } from '@angular/core';

@Component({
  selector: 'join',
  template: `<h1>Join a room</h1>
  			<div class="info">
                <label for="inputPlayerName">Your Name:</label>
                <input id="inputPlayerName" type="text" [(ngModel)]="item.name" />
            </div>

            <div class="info">
                <label for="inputGameId">Game ID:</label>
                <input id="inputGameId" [(ngModel)]="item.id" type="text"/>
            </div>
            <button (click)="joinRoom()">Join</button>
  `,
})

export class JoinComponent  {
	item:any = {
		name:'',
		id:''
	}
	
	joinRoom(){
		
		console.log("player detail ", this.item)
	}
}
