import { Component,AfterViewInit,ViewChild, ViewContainerRef, ComponentFactoryResolver  } from '@angular/core';

import { PostsService } from './posts.service';
import { hostComponent } from './host.component'
import {TitlePipe} from './TitlePipe';
import * as io from 'socket.io-client';

declare var _:any
declare var $:any

@Component({
  selector: 'my-app',
  template: `<h1  (click)="test()">Hello {{name}}</h1>
  			<div *ngIf="foo">
  				<host></host>
  			</div>
  			<button (click)="createNewGame()">Create a new game</button>
  			<div #remoteComponent></div>
  			<div>
		        <label>Genre</label>
		         
		            <select  
		            	[(ngModel)]="genreSelected"
		            	(change) ="onSelect($event.target.value)"
		            >
		                <option *ngFor="let x of genres" [value]="x.type" >{{x.type}}</option>
		            </select>
		        
		    </div>
  			<ul>
  				<li *ngFor="let song of (filteredSongs)">
  					<b></b><span>{{song.title}} | {{song.genre}}</span>
  				</li>
  			</ul>`,

  providers:[PostsService],
  // pipes: [TitlePipe]
})

//https://scotch.io/tutorials/how-to-deal-with-different-form-controls-in-angular-2

export class AppComponent implements AfterViewInit {
 @ViewChild(hostComponent) host: hostComponent
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
 host:String
 foo:boolean = false;
   //constructor(private builder: DynamicBuilder, private componentResolver: ComponentResolver) {}
	 constructor(private postsService:PostsService,private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef ){
	 	
	 	this.client = io.connect('http://localhost:1338');
	 	this.client.on( "connect", function () {
		  	// debugger
		    console.log( 'Client: Connected to port ' );
		} );
		this.client.on('newGameCreated',this.onNewGameCreated)


	 	let promises:any[] = [];
	 	let self=this;
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
      	
      	

	    // Promise.all(promises).then(function(results){
	    // 	_.each(results,function(r){
	    // 		self.items = JSON.parse(r._body)
	    		
	    // 		switch(self.items.type){
	    // 			case 'songs' :
	    // 				self.songs = self.items.items
				 //    	self.filteredSongs=self.songs=_.map(self.songs,function(u:any,i:number){
				 //    		return {
				 //    			title:u.title,
				 //    			genre:(i%2)?'Pop':'Rock'
				 //    		}
				 //    	})
	    // 			break;
	    // 			case 'genres':
	    // 				self.genres = self.items.items
	    // 				self.genreSelected = self.genres[0];
	    // 			break;
	    			


	    // 		}
	    // 	})
	    // })

	 }
	 ngAfterViewInit(){
		let self=this;
     }
     onSelect(genre:String){
     	debugger
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
	 test(){
	 	this.foo = true;
	 }
	 onNewGameCreated(data){
	 	this.gameId = data.gameId;
	 	this.mySocketId=data.mySocketId;
	 	this.myRole ="Host"
	 	this.host = data.mySocketId;



	 	        
	 }
      
  }