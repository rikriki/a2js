import { Component,AfterViewInit } from '@angular/core';
import { PostsService } from './posts.service';
import {TitlePipe} from './TitlePipe';
import * as io from 'socket.io-client'

declare var _:any
declare var $:any

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1>
  			
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
 name:String = 'Player';
 titleValue:String 
 genres = ['pop','rock'];
 songs:Array<any> = [];
 items:Array<any> = [];
 filteredSongs:Array<any> = []
 genreSelected:String;
	 constructor(private postsService:PostsService ){
	 	
	 	var client = io.connect('http://localhost:1338');
	 	client.on( "connect", function () {
		  	// debugger
		    console.log( 'Client: Connected to port ' );

		    // client.emit( "echo", "Hello World", function ( message:any ) {
		    //     console.log( 'Echo received: ', message );
		    //     client.disconnect();
		    // } );
		} );


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
      	
      	

	    Promise.all(promises).then(function(results){
	    	_.each(results,function(r){
	    		self.items = JSON.parse(r._body)
	    		
	    		switch(self.items.type){
	    			case 'songs' :
	    				self.songs = self.items.items
				    	self.filteredSongs=self.songs=_.map(self.songs,function(u:any,i:number){
				    		return {
				    			title:u.title,
				    			genre:(i%2)?'Pop':'Rock'
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
	 ngAfterViewInit(){
		let self=this;
     }
     onSelect(genre:String){
     	console.log(genre)
     	this.filteredSongs =_.filter(this.songs,function(u:any){
     		return u.genre==genre
     	})
     }
      
  }