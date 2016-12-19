import { Component } from '@angular/core';
import { PostsService } from './posts.service';
import { InterfaceItem } from './interface.item';

@Component({
  selector: 'item',
  template: `<h1>Add New Items</h1>
  	<p>{{this.item.name}} asdasdad</p>
  	<form >
  		<label>Name</label>
  		<input type="text" name="item.name" [(ngModel)]="item.name" /><br/>
  		<label>Link</label>
  		<input type="text" name="link" [(ngModel)]="item.link" /><br/>
  		<label>Image</label>
  		<input type="text" name="image" [(ngModel)]="item.image" /><br/>
  		<label>Sub Headline</label>
  		<input type="text" name="subHeadline" [(ngModel)]="item.subHeadline" /><br/>
  		<label>descriptions</label>
  		<input type="text" name="descriptions" [(ngModel)]="item.descriptions" /><br/>
  		<br/>
  		<input type="button" (click)="postItem()" />
  	</form>
  `,
  providers:[PostsService]
})
export class ItemComponent  { 
	item:InterfaceItem;
	constructor(private postService:PostsService){
		this.item={}
		this.postService.getPosts().subscribe(posts=>{
			console.log(posts)
		});
	}
	postItem(){
		console.log('yow')
		this.postService.posts({
			name:this.item.name,
			link:this.item.link
		})
	}
	
	
}

