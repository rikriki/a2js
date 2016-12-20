import { Component } from '@angular/core';
import { PostsService } from './posts.service';
import { InterfaceItem } from './interface.item';

@Component({
  selector: 'item',
  template: `
  <div class="container">
   <p class="success">{{response}}</p>
    <h1>Add New Items</h1>
    	<form class="form-group row">

      <div class="form-group">
        <label class="form-control-label">Name</label>
        <input type="text" class="form-control" name="name" [(ngModel)]="item.name">
      </div>

      <div class="form-group">
        <label class="form-control-label">Link</label>
        <input type="text" class="form-control" name="link" [(ngModel)]="item.link">
      </div>

      <div class="form-group">
        <label class="form-control-label">Image</label>
        <input type="text" class="form-control" name="image" [(ngModel)]="item.image">
      </div>

      <div class="form-group">
        <label class="form-control-label">Sub Headline</label>
        <input type="text" class="form-control" name="subHeadline" [(ngModel)]="item.subHeadline">
      </div>

      <div class="form-group">
        <label class="form-control-label">Descriptions</label>
        <input type="text" class="form-control" name="descriptions" [(ngModel)]="item.descriptions">
      </div>
      <input type="button"  class="form-control pull-right" value="Submit" (click)="postItem()" />
    	</form>
  </div>
  `,
  providers:[PostsService]
})
export class ItemComponent  { 
	item:InterfaceItem;
	response:string;
  constructor(private postService:PostsService){
		this.item={
      name:"",
      link:"",
      image:"",
      subHeadline:"",
      descriptions:""
    };

		this.postService.getPosts().subscribe(posts=>{
			console.log(posts)
		});
	}
	postItem(){
		console.log('yow',this.item)
		this.postService.posts(this.item).subscribe(
      data=>{
        this.response = data.items
        console.log(data)
      },
      err=>{
       console.log(err) 
      },
      ()=>{
       console.log('Done') 
      }
    )
	}
	

// this.http.post('http://localhost:3001/sessions/create', creds, {
//     headers: headers
//     })
//     .map(res => res.json())
//     .subscribe(
//       data => this.saveJwt(data.id_token),
//       err => this.logError(err),
//       () => console.log('Authentication Complete')
//     );
	
}

