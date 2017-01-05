import { Component } from '@angular/core';
import {PostsService} from './posts.service';
@Component({
  selector: 'join',
  template: `
        <div *ngIf="connected">
          Welcome {{player}}
          <button (click)="stopVideo()">Stop</button>
          <div>
            <label>Genre</label>
             
                <select  
                  [(ngModel)]="genreSelected"
                  (change) ="onSelect($event.target.value)">
                    <option *ngFor="let x of genres" [value]="x.videoId" (click)="setVideo(x.videoId)" >{{x.type}}</option>
                </select>
          </div>
          <ul>
            <li *ngFor="let song of (filteredSongs)" (click)="selectSong(song.videoId)">
              <b></b><span>{{song.title}} | {{song.genre}}</span>
            </li>
          </ul>

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
  providers:[PostsService]
})

export class JoinComponent  {
	private item:any = {
		name:'',
		id:''
	}
  private connected:Boolean
  privateplayer:String
  socket:any;
  mySocketId:String
  karaokeId:String
  private genreSelected:String;
  private filteredSongs:Array<any>;
  private songs:Array<any> = [];
  private genres:Array<any> = [];
  private postsService:PostsService;
  constructor(private postsService:PostsService){
    this.postsService = postsService
  }

	initClient(socket:any){
    
    this.socket = socket
    this.socket.on('singerJoinedRoom',this.singerJoinedRoom.bind(this));
    this.player="" 
    this.connected=false; 
    // this.postsService;
  }
  selectSong(videoId:String){
    console.log(videoId," Selected song id")
     var data = {
                    karaokeId: this.karaokeId,
                    singerId: this.socket.id,
                    videoId: videoId
                   
                }
    this.socket.emit('singerSendSong',data)
  }
	joinRoom(){
		
		console.log("singer detail ", this.item)
    this.socket.emit('singerJoinRoom',this.item)
	}
  stopVideo(){
     var data = {
                    karaokeId: this.karaokeId,
                    singerId: this.socket.id
                   
                }
   this.socket.emit('singerStopVideo',data) 
  }
  singerJoinedRoom(data:any){

    if(this.socket.id==data.mySocketId){
      this.player = data.name
      this.connected= true 
      let promises:any[] = [];
      let self = this;
      this.karaokeId = data.id
      _.each(this.postsService.preload(),function(func:any,key:String){
            promises.push(func().then(
              (datas:any)=>{
                // let one:any ={[key]:datas} 
                return datas
              },(error:any)=>{
                this.errorMessage
              }
            ))
      })
      Promise.all(promises).then(function(results){
        _.each(results,function(r){
          self.items = JSON.parse(r._body)
          
          switch(self.items.type){
            case 'songs' :
              self.songs = self.items.items
              self.filteredSongs=self.songs=_.map(self.songs,function(u:any,i:number){
                return {
                  title:u.title,
                  genre:(i%2)?'Pop':'Rock',
                  videoId:u.videoId
                }
              })
            break;
            case 'genres':
              self.genres = self.items.items
              self.genreSelected = self.genres[0];
            break;
          }
        })
      }) 
    }
  }
}
