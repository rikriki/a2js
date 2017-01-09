import { Component,AfterViewInit } from '@angular/core';
import { PostsService } from './posts.service';
declare var $:any
declare var YT:any
@Component({
  selector: 'host',
  template: `<div class="container-fuild">
	  			<div class="row text-center">
	  				<h1> Welcome to M-Karaoke.IO</h1>
	  				<p>Visit this link http://localhost:3002 and join with this id:{{roomId}}</p>
			  		<div class="singers btn-primary"><span class="glyphicon glyphicon-user icon btn-lg" aria-hidden="true"><b class="text-primary btn-default">{{user}}</b></span></div>
 		     	</div>
 		     	<div class="row">
 		     		<div class="col-md-8" id="player"></div>
 		     		<div class="col-md-4" id="playlist" #playList> 
 		     			<h1>Songs</h1>
 		     			<div class="list-group ">
			            	<button type="button"  *ngFor="let reserve of (reserveSongs) "class="list-group-item" >
			                	{{reserve.singer}} - {{reserve.title}}
			                </button>
			            </div>
 		     		</div>
 		     	</div>

	  		</div>
  `,
  providers:[PostsService]
  
})
// <iframe src="http://www.youtube.com/embed/dD3I4k0gA2M" id="videokeScreen" frameborder="0" scrolling="no" allowfullscreen="true" style="width: 800px; height: 500px;"></iframe>
export class hostComponent implements AfterViewInit {
	roomId:String
	user:number = 0;
	socket:any;
	player:any;
	reserveSongs:Array<any> =[];
	homepage:String
	reserve:Array<any>=[];
	private userInitiated = false;

	constructor(private postsService:PostsService){
		let promises:any[] = [];
	 	
	}
	initHost(roomID:string,socket:any){
		this.socket = socket
		this.roomId = roomID
		this.user = 0;
		this.homepage = window.location.origin
		console.log("Room number is ", roomID)
		this.socket.on('singerJoinedRoom',this.singerJoinedRoom.bind(this));
		this.socket.on('hostReserveSong',this.hostReserveSong.bind(this));
		this.socket.on('hostReceivedCommand',this.hostReceivedCommand.bind(this));
		this.socket.on('hostRemoveItemPlaylist',this.hostRemoveItemPlaylist.bind(this))

		
		
	}
	setVideo(songID:string){

	}
	singerJoinedRoom(data:any){
		this.user = this.user + 1;
		console.log(data.name, " Joine the game.")
	}
	hostReserveSong(data:any){
		// $('#videokeScreen').attr('src','http://www.youtube.com/embed/'+videoId+'?autoplay=1')
		this.reserveSongs.push(data)
	}
	hostRemoveItemPlaylist(data:any){
		let index:number = _.findIndex(this.reserveSongs,_.pick(data,['title','videoId','singer']))
		this.reserveSongs.splice(index,1)
		this.removefromReserve(data)

	}
	hostReceivedCommand(data:any){
		// $('#videokeScreen').attr('src','http://www.youtube.com/embed/'+videoId+'?autoplay=1')
		switch(data.command){
			case "play":
				this.player.playVideo()
			break;
			case "pause":
				this.player.pauseVideo()
			break;
			case "stop":
				this.player.stopVideo()
			break;
		}
		this.userInitiated = true;
	}
	hostPlayedSong(){
		let data:any = this.reserveSongs.shift()
		this.player.loadVideoById(data.videoId, 15, "large")
		this.removefromReserve(data)	
	}
	removefromReserve(data){
		this.socket.emit('hostRemoveReserve',data)
	}
	ngAfterViewInit() {
	  
	  var done = false;
      this.player = new YT.Player('player', {
          height: window.innerHeight*.8,
          width: '100%',
          videoId: 'AEbkkRn8i-Y',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange.bind(this)
          }
        });
	}
	 
    onPlayerReady(event:any) {
       event.target.playVideo();
    }
    onPlayerStateChange(event:any) {
  		//-1 (unstarted)
		// 0 (ended)
		// 1 (playing)
		// 2 (paused)
		// 3 (buffering)
		// 5 (video cued).

    	
        if (event.data == 0 || (event.data == -1 && this.userInitiated==true)) {
          console.log('done, play next!')
          if(this.reserveSongs.length){
			this.hostPlayedSong()	
		  }
        }
        this.userInitiated = false;
    }
   
}
