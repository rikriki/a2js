import { Component,EventEmitter } from '@angular/core';
import {PostsService} from './posts.service';
import {NavComponent} from './nav.component'
declare var $:any
declare var _:any
@Component({
  selector: 'join',
  template: `
  <navigation></navigation>
  <div class="container">
    <div class="row">
        <div *ngIf="connected">
          Welcome {{player}}
          <button (click)="stopVideo()">Stop</button>
          <div>
            <label>Genre</label>
             
                <select class="formControl" 
                  [(ngModel)]="genreSelected"
                  (change) ="onSelect($event.target.value)">
                    <option *ngFor="let x of genres" [value]="x.videoId" (click)="setVideo(x.videoId)" >{{x.type}}</option>
                </select>
          </div>
          <div class="list-group songLists">
            <button type="button" class="list-group-item" *ngFor="let song of (filteredSongs)" (click)="selectSong(song.videoId)">
              {{song.title}} | {{song.genre}}
            </button>
          </div>

        </div>
        <div *ngIf="connected==false">
          <h1>Join a room</h1>
    			<div class="info form-group">
                  <label class="control-label" for="inputPlayerName">Your Name:</label>
                  <input id="inputPlayerName"  class="form-control" type="text" [(ngModel)]="item.name" />
              </div>

              <div class="info form-group">
                  <label for="inputGameId" class="control-label">Game ID:</label>
                  <input  class="form-control" id="inputGameId" [(ngModel)]="item.id" type="text"/>
              </div>
              <button (click)="joinRoom()" class="btn btn-primary">Join</button>
        </div>
    </div>
  </div>
  `,
  providers:[PostsService]
})

export class JoinComponent  {
	private item:any = {
		type:'',
		id:''
	}
  private connected:Boolean
  private player:String
  socket:any;
  mySocketId:String
  karaokeId:String
  
  private genreSelected:String;
  private filteredSongs:Array<any>;
  private songs:Array<any> = [];
  private genres:Array<any> = [];

  private items:any;

  
  constructor(private postsService:PostsService){
    
  }

	initClient(socket:any){
    
    this.socket = socket

    this.socket.on('singerJoinedRoom',this.singerJoinedRoom.bind(this))
    
    this.connected=false

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
        _.each(results,function(r:any){
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
