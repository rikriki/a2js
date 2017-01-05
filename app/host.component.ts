import { Component,AfterViewInit } from '@angular/core';
import { PostsService } from './posts.service';
declare var $:any
@Component({
  selector: 'host',
  template: `<h1>welcome to this videoke {{roomId}}</h1>
 		     <div>Number of user{{user}}</div>
 		     <div id="player"></div>
  `,
  providers:[PostsService]
  
})
// <iframe src="http://www.youtube.com/embed/dD3I4k0gA2M" id="videokeScreen" frameborder="0" scrolling="no" allowfullscreen="true" style="width: 800px; height: 500px;"></iframe>
export class hostComponent implements AfterViewInit {
	roomId:String
	user:number
	socket:any;
	player:any;
	reserve:Array<string>
	constructor(private postsService:PostsService){
		let promises:any[] = [];
	 	
	}
	initHost(roomID:String,socket:any){
		this.socket = socket
		this.roomId = roomID
		this.user = 0;
		console.log("Room number is ", roomID)
		this.socket.on('singerJoinedRoom',this.singerJoinedRoom.bind(this));
		this.socket.on('hostReserveSong',this.hostReserveSong.bind(this));
		
	}
	setVideo(songID:String){

	}
	singerJoinedRoom(data:any){
		this.user = this.user + 1;
		console.log(data.name, " Joine the game.")
	}
	hostReserveSong(videoId:String){
		// $('#videokeScreen').attr('src','http://www.youtube.com/embed/'+videoId+'?autoplay=1')
		
		this.reserve.push(videoId)
	}
	hostPlayedSong(){
		this.player.loadVideoById(this.reserve.push, 15, "large")	
	}

	ngAfterViewInit() {
	  
	  var done = false;
      this.player = new YT.Player('player', {
          height: '500',
          width: '800',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          }
        });
	}
	 
    onPlayerReady(event) {
       event.target.playVideo();
    }
    onPlayerStateChange(event) {
  		//-1 (unstarted)
		// 0 (ended)
		// 1 (playing)
		// 2 (paused)
		// 3 (buffering)
		// 5 (video cued).

    	
        if (event.data == 0 || event.data == 2 ) {
          console.log('done, play next!')
          if(this.reserve.length){
			this.hostPlayedSong()	
		  }
        }
    }
   
}
