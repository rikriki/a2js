import { Component,AfterViewInit } from '@angular/core';
import { PostsService } from './posts.service';
import {TitlePipe} from './TitlePipe';
declare var _:any
declare var $:any
@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1>
  			<remote></remote>
  			<div>
		        <label>Genre</label>
		         
		            <select  
		            	[(ngModel)]="genreSelected"
		            	(change) ="onSelect($event.target.value)"
		            >
		                <option *ngFor="let x of genres" [value]="x" >{{x}}</option>
		            </select>
		        
		    </div>
  			<ul>
  				<li *ngFor="let user of (filteredUsers)">
  					<b></b><span>{{user.title}} | {{user.userId}}| {{user.genre}}</span>
  				</li>
  			</ul>`,

  providers:[PostsService],
  pipes: [TitlePipe]
})

//https://scotch.io/tutorials/how-to-deal-with-different-form-controls-in-angular-2

export class AppComponent implements AfterViewInit {
 name:String = 'Angular';
 titleValue:String 
 genres = ['Pop','rock'];
 users:Array<any> = []
 filteredUsers:Array<any> = []
 genreSelected:String;
	 constructor(private postsService:PostsService ){
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
      	
      	this.genreSelected = this.genres[0];

	    Promise.all(promises).then(function(results){
	    	
	    	console.log(results)
	    	
	    	self.users = JSON.parse(results[0]._body)
	    	self.filteredUsers=self.users=_.map(self.users,function(u,i){
	    		return {
	    			title:u.title,
	    			userId:u.userId,
	    			genre:(i%2)?'pop':'rock'
	    		}
	    	})
	    })

	 }
	 ngAfterViewInit(){
		let self=this;
     }
     onSelect(genre:String){
     	console.log(genre)
     	debugger
     	this.filteredUsers =_.filter(this.users,function(u){
     		return u.genre==genre
     	})
     }
      
  }
