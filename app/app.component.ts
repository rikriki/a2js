
import { Component,AfterViewInit,ViewChild, ViewContainerRef,ElementRef,ComponentFactoryResolver  } from '@angular/core';

import { PostsService } from './posts.service';
import { hostComponent } from './host.component'
import { JoinComponent } from './join.component'
import {TitlePipe} from './TitlePipe';
import * as io from 'socket.io-client';

declare var _:any
declare var $:any

@Component({
  selector: 'my-app',
  template: `
  		<div class="container introContainer" *ngIf="foo==false && bar==false">
  			<div class="row text-center introBox">
  				<h1 class="introTitle">M-Karaoke.IO</h1>
		  		<div *ngIf="bar==false">
	  				<button class="btn btn-primary" (click)="createNewGame()">Create Karaoke Room</button>
	  				<button class="btn btn-primary" (click)="joinGame()" >Join a Room</button>
	  			</div>
  			</div>

  		</div>
  			
  			

  			<div *ngIf="foo">
  				<host></host>
  			</div>
  			<div #join>
  				
  			</div>

  			<div #remoteComponent></div>
  			
  			`,

  providers:[PostsService],
  entryComponents: [
	JoinComponent
	]
  // pipes: [TitlePipe]
})

//https://scotch.io/tutorials/how-to-deal-with-different-form-controls-in-angular-2

export class AppComponent  {
 @ViewChild(hostComponent) hostComp: hostComponent;
 @ViewChild(JoinComponent) joinComp: JoinComponent;
 @ViewChild('host') hostEl:ElementRef;
 @ViewChild('join', { read: ViewContainerRef })
 private join: any;
private target: ViewContainerRef;
 name:String = 'Player';
 titleValue:String 
 genres = ['pop','rock'];
 songs:Array<any> = [];
 items:Array<any> = [];
 filteredSongs:Array<any> = []
 genreSelected:String;
 client:any
 gameId:String
 mySocketId:String
 myRole:String
 hostID:String

 
 foo:boolean = false;
 bar:boolean = false;
   //constructor(private builder: DynamicBuilder, private componentResolver: ComponentResolver) {}
	 constructor(private postsService:PostsService,private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef ){
	 	
	 	this.client = io.connect('http://localhost:1338');
	 	this.client.on( "connect", function () {
		  	console.log( 'Client: Connected to port ' );
		} );
		this.client.on('newGameCreated',this.onNewGameCreated.bind(this))
			
	 }
	 
     onSelect(genre:String){
     	console.log(genre)
     	this.filteredSongs =_.filter(this.songs,function(u:any){
     		return u.genre==genre
     	})
     }
     createNewGame(){
     	
     	// const factory = this.componentFactoryResolver.resolveComponentFactory(hostComponent);
     	
      //   const ref = this.viewContainerRef.createComponent(factory);
      //   ref.changeDetectorRef.detectChanges();
        this.foo = true;
     	this.client.emit('hostCreateNewGame');
     	
	 }

	 joinGame(){
	 	this.bar = true;
	 	// 
	 	// const factory = this.componentFactoryResolver.resolveComponentFactory(JoinComponent);
     	
   //      const ref = this.viewContainerRef.createComponent(factory);
   //      ref.changeDetectorRef.detectChanges();
	 	// joinComp.initClient(this.client)
	 	let componentFactory = this.componentFactoryResolver.resolveComponentFactory(JoinComponent);
		let joinRef = this.join.createComponent(componentFactory);
		joinRef.instance.initClient(this.client)
	 }
	 
	 onNewGameCreated(data:any){
	 	this.gameId = data.gameId;
	 	this.mySocketId=data.mySocketId;
	 	this.myRole ="Host"
	 	this.hostID = data.mySocketId;
	 	this.hostComp.initHost(data.gameId,this.client)


	 	        
	 }
      
  }