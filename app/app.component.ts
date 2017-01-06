
import { Component,AfterViewInit,ViewChild, ViewContainerRef,ElementRef,ComponentFactoryResolver  } from '@angular/core';

import { PostsService } from './posts.service'
import { hostComponent } from './host.component'
import { JoinComponent } from './join.component'
import {TitlePipe} from './TitlePipe'
import * as io from 'socket.io-client'
import * as THREE from 'three'


declare var _:any
declare var $:any
declare var TweenMax:any


@Component({
  selector: 'my-app',
  template: `
		<div class="webGl" #webGl *ngIf="foo==false && bar==false"></div>
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


export class AppComponent implements AfterViewInit {
 @ViewChild(hostComponent) hostComp: hostComponent;
 @ViewChild(JoinComponent) joinComp: JoinComponent;
 @ViewChild('host') hostEl:ElementRef;
@ViewChild('webGl') webGl:ElementRef;
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
 scene:any
 camera:any
 renderer:any
 geometry:any 
 material:any 
 mesh:any
 meshX:number = 0
 foo:boolean = false;
 bar:boolean = false;
 

 meshes:Array<any>
 animID:any
   //constructor(private builder: DynamicBuilder, private componentResolver: ComponentResolver) {}
	 constructor(private postsService:PostsService,private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef ){
	 	
	 	this.client = io.connect('http://localhost:1338');
	 	this.client.on( "connect", function () {
		  	console.log( 'Client: Connected to port ' );
		} );
		this.client.on('newGameCreated',this.onNewGameCreated.bind(this))
		this.meshes=[];
		this.init();
		this.animate();	
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





	init() {

	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	    this.camera.position.z = 1000;
	    this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
	    this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	    //this.mesh = new THREE.Mesh( this.geometry, this.material );
	   	this.meshes.push(new THREE.Mesh( this.geometry, this.material ))
	   	this.meshes.push(new THREE.Mesh( this.geometry, this.material ))
	   	this.meshes.push(new THREE.Mesh( this.geometry, this.material ))
	   	this.meshes.push(new THREE.Mesh( this.geometry, this.material ))
	    this.scene.add( this.meshes[0] );
	    this.scene.add( this.meshes[1] );
	    this.renderer = new THREE.WebGLRenderer();
	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	   	

	   	this.animateParticle();
	   	
	    //document.body.appendChild( this.renderer.domElement );

	}
	animateParticle(){
		//this.mesh.position.x=0
		
		var self= this
		_.each(this.meshes,function(m){
			m.position.x = 0;
			TweenMax.to(m.position,2,{
		   		x:800,
		   		onComplete:self.animateParticle.bind(self)
		   	})

		   	TweenMax.to(m.rotation,1000,{
		   		x:1000
		   	})
		   	
		   	TweenMax.to(m.scale,2,{
		   		x:4,
		   		y:4,
		   		z:4,
		   		repeat:-1
		   	})	
		})
		// TweenMax.to(this.mesh.position,2,{
	 //   		x:800,
	 //   		onComplete:this.animateParticle.bind(this)
	 //   	})

	 //   	TweenMax.to(this.mesh.rotation,1000,{
	 //   		x:1000
	 //   	})
	   	
	 //   	TweenMax.to(this.mesh.scale,2,{
	 //   		x:4,
	 //   		y:4,
	 //   		z:4,
	 //   		repeat:-1
	 //   	})
	}
	ngAfterViewInit(){
		$(this.webGl.nativeElement).append( this.renderer.domElement );
	}
	animate() {
	    this.animID = requestAnimationFrame( this.animate.bind(this));
	    // this.mesh.rotation.x += 0.01;
	    // this.mesh.rotation.y += 0.02;
	    // this.mesh.position.y += 2.2;
	    // this.mesh.position.z += 2.2;

	    this.renderer.render( this.scene, this.camera );
	   
	}
   
  }