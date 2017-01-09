import { Component,EventEmitter } from '@angular/core';
import {PostsService} from './posts.service';
import {NavComponent} from './nav.component'
declare var $:any
declare var _:any
@Component({
  selector: 'join',
  template: `
  <navigation [name]="voter" (searchSong)="searchSonged($event)"></navigation>
  
  <div class="container" >
    <div class="row">
        <div *ngIf="connected">
          <div class="info form-group">
            <h1>Welcome {{player}}</h1>
            <button  class="btn btn-primary" (click)="videoControl('stop')">Stop</button>
            <button  class="btn btn-primary" (click)="videoControl('play')">Play</button>
            <button  class="btn btn-primary" (click)="videoControl('pause')">Pause</button>
            <button  class="btn btn-primary" (click)="switchScreen()" *ngIf="playlist==false">Reserved songs</button>
            <button  class="btn btn-primary" (click)="switchScreen()" *ngIf="playlist">Back to list</button>
            <div class="info form-inline pull-right">
              <label class="control-label">Genre</label>
                  <select class="form-control" 
                    [(ngModel)]="genreSelected"
                    (change) ="onSelect($event.target.value)">
                      <option *ngFor="let x of genres" [value]="x.videoId" (click)="setVideo(x.videoId)" >{{x.type}}</option>
                  </select>
            </div>
          </div>
          
            
          <div class="list-group songLists" *ngIf="playlist">
            <button type="button" class="list-group-item" *ngFor="let song of (savePlaylist)" (click)="removeSong(song.videoId,song.title)">
            {{song.title}} | {{song.genre}}
            </button>
          </div>
          
          <ul class="list-group songLists" *ngIf="playlist==false" >
              <li class="list-group-item" *ngFor="let song of (filteredSongs)" >
                 <label for="checkbox">
                         {{song.title}} | {{song.genre}}
                 </label>
                  <div class="pull-right action-buttons">
                      
                      <button class="btn btn-primary"  (click)="selectSong(song.videoId,song.title)"><span class="glyphicon glyphicon-plus"></span></button>
                  </div>
              </li>
          </ul>

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
          <div class="alert alert-danger" *ngIf="errorMessage">
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>{{errorMessage}}</strong> 
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
  private errorMessage:String;
  private playlist:Boolean = false;
  private savePlaylist:Array<any>=[];

  
  constructor(private postsService:PostsService){
    
  }

	initClient(socket:any){
    
    this.socket = socket

    this.socket.on('singerJoinedRoom',this.singerJoinedRoom.bind(this))
    this.socket.on('singerRemoveItemPlaylist',this.singerRemoveItemPlaylist.bind(this))
    
    this.socket.on('OnError',this.onError.bind(this))

    
    this.connected=false
    // this.initTest()
    // this.postsService;
  }
  selectSong(videoId:String,title:String){
    console.log(videoId," Selected song id")
    var data = {
                  karaokeId: this.karaokeId,
                  singerId: this.socket.id,
                  videoId: videoId,
                  title:title,
                  singer:this.player
                }
    this.savePlaylist.push(data)                
    this.socket.emit('singerSendSong',data)
  }
  searchSonged(searchStr:any){
    
    this.filteredSongs = _.filter(this.songs,function(v:any){
      return (v.title.match(new RegExp(searchStr,'i')))
    })
  }
  removeSong(videoId:String,title:String){
    this.savePlaylist.splice(_.findIndex(this.savePlaylist,{videoId:videoId}),1)
    var data = {
                  karaokeId: this.karaokeId,
                  singerId: this.socket.id,
                  videoId: videoId,
                  title:title,
                  singer:this.player
                }
    this.socket.emit('singerRemoveSong',data)                
  }
  singerRemoveItemPlaylist(data){
    let index:number = _.findIndex(this.savePlaylist,_.pick(data,['title','videoId','singer']))
    this.savePlaylist.splice(index,1)
  }
	joinRoom(){
		
		console.log("singer detail ", this.item)
    this.socket.emit('singerJoinRoom',this.item)
	}
  onError(data:any){
    this.errorMessage = data.message
    _.delay(function(){this.errorMessage=""}.bind(this),1000)
  }

  videoControl(command:String){
    var data = {
                karaokeId: this.karaokeId,
                singerId: this.socket.id,
                command:command
               }
   this.socket.emit('singerSendCommand',data)  
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
  switchScreen(){
    this.playlist= !this.playlist
  }
  initTest(){
    this.connected= true
    this.player = "Testing"
      this.connected= true 
      let promises:any[] = [];
      let self = this;
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
