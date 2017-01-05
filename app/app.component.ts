
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
  template: `<h1>Hello {{name}}</h1>

  			<div *ngIf="foo">
  				<host></host>
  			</div>
  			<div #join>
  				
  			</div>
  			<div *ngIf="bar==false">
  				<button (click)="createNewGame()">Start Videoke</button>
  				<button (click)="joinGame()">Join a game</button>
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

export class AppComponent implements AfterViewInit {
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


	 	let promises:any[] = [];
	 	
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

	 }
	 ngAfterViewInit(){
		
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