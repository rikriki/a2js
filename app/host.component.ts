import { Component } from '@angular/core';
import { PostsService } from './posts.service';

@Component({
  selector: 'host',
  template: `<h1>welcome to this videoke {{roomId}}</h1>
  <iframe src="http://www.youtube.com/embed/dD3I4k0gA2M" id="videokeScreen" frameborder="0" scrolling="no" allowfullscreen="true" style="width: 800px; height: 500px;"></iframe>
  <div>Number of user{{user}}</div>
  `,
  providers:[PostsService]
  
})
export class hostComponent {
	roomId = '';
	user:number
	socket:any;
	constructor(private postsService:PostsService){
		let promises:any[] = [];
	 	
	}
	initHost(roomID:String,socket){
		this.socket = socket
		this.roomId = roomID
		this.user = 0;
		console.log("Room number is ", roomID)
		this.socket.on('playerJoinedRoom',this.playerJoinedRoom.bind(this));
	}
	setVideo(songID:String){

	}
	playerJoinedRoom(data){
		this.user = this.user + 1;
		console.log(data.name, " Joine the game.")
	}
}
