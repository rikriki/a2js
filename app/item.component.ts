import { Component, AfterViewInit,OnInit,ElementRef,ViewChild, AfterViewChecked } from '@angular/core';
import { PostsService } from './posts.service';
import { InterfaceItem } from './interface.item';
declare var $:any;
declare var _:any;
@Component({
  selector: 'item',
  template: `
  <div #selectElem>
    <div class="loading"></div>
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
  </div>
  `,
  providers:[PostsService]
})
export class ItemComponent implements AfterViewInit { 
	item:InterfaceItem;
	response:string;
  @ViewChild('selectElem') el:ElementRef;
  constructor(private postService:PostsService){
		this.item={
      name:"",
      link:"",
      image:"",
      subHeadline:"",
      descriptions:""
    };
    
  }
  ngAfterViewInit() { 
    //  debugger;
      // this.logIt(`OnInit`); 
      $(this.el.nativeElement).find('.container').toggle();
      
      // this.postService.getPosts().subscribe(
      //   data=>{
      //     console.log(data, "Response from server")
    
      //   }
      // )
      let $loader = $(this.el.nativeElement).find('.loading');
      let $container= $(this.el.nativeElement).find('.container');
      let preloadItems:Number = Object.keys(this.postService.preload()).length
      //$loader.html('Preloading ' + preloadItems.toString() + ' number of items..')
      

      let self=this;
      let promises:any[] = [];
     
      _.each(this.postService.preload(),function(func:any,key:String){
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
          _.delay(function(){
            $(self.el.nativeElement).find('.loading').removeClass('loading').addClass('done').delay(500).fadeToggle();    
            $(self.el.nativeElement).find('.container').delay(1000).fadeToggle();
          },2000)
      })
      
  };
  
	postItem(){
		console.log('yow',this.item)
		this.postService.posts(this.item).subscribe(
      data=>{
        this.response = data.items
        console.log(data, "Response from server")
      },
      err=>{
       console.log(err) 
      },
      ()=>{
       console.log('Done') 
      }
    )
	}
}

