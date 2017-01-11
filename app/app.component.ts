
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
declare var THREEx:any


@Component({
  selector: 'my-app',
  template: `
		<div class="webGl" #webGl *ngIf="foo==false && bar==false"></div>
  		<div class="" *ngIf="foo==false && bar==false" #introContainer>
	  		<div class="text">
			  <svg>
			   
			    <!-- Apply color here! -->
			    <!-- Color aquí -->
			    <rect id="base" x="0" y="0" width="100%" height="100%"/>
			    <text id="title" x="50%" y="0" dy="1.58em">M-KARAOKE.IO</text>
			  </svg>
			  <div class="text-button text-center" *ngIf="bar==false">
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
 @ViewChild('introContainer') introContainer:ElementRef;
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
 tilesW:number =15;
 tilesH:number =10;
 mouse:Array<any> = [.5, .5];
 exitTime:number =0
 enterTextTime:number =0


 meshes:Array<any>
 animID:any
 imagesArr:Array<any> = ['5 Seconds Of Summer.png','Alan Walker.png','Alessia Cara.png','Alicia Keys.png','Amy Winehouse.png','Andra Day.png','Andy Grammer.png','Andy Williams.png','Anna Clendening.png','Anna Kendrick.png','Ariana Grande.png','Auburn.png','Avril Lavigne.png','B.o.B ft. Hayley Williams.png','Backstreet Boys.png','Barenaked Ladies.png','Bars and Melody.png','Bea Miller.png','Bebe Rexha.png','Becky G.png','Bee Gees.png','Beyonc.png','Beyonce ft. JAY Z.png','Biffy Clyro.png','Bill Medley',' Jennifer Warnes.png','Bing Crosby.png','Birdy.png','Boyz II Men.png','Britney Spears.png','Bruno Mars.png','Bryan Adams.png','Bryson Tiller.png','Calum Scott.png','Carly Rae Jepsen.png','Celine Dion.png','Charlie Puth.png','Christina Aguilera.png','Christine and the Queens.png','Coldplay.png','Cyndi Lauper.png','DNCE.png','Dawin.png','Daya.png','Dean Martin.png','Demi Lovato.png','Descendants.png','Desiigner.png','Destiny\'s Child.png','Dove Cameron.png','East 17.png','Ed Sheeran.png','Ellie Goulding.png','Elton John.png','Elvis Presley.png','Fetty Wap.png','Fifth Harmony.png','Fleetwood Mac.png','Fleur East.png','Flo Rida.png','Florida Georgia Line.png','Fountains Of Wayne.png','Frankie Goes To Hollywood.png','Galantis.png','George Michael.png','Gnash.png','Grace VanderWaal.png','Green Day.png','Hailee Steinfeld.png','Halsey.png','High School Musical 2.png','Iggy Azalea.png','Imagine Dragons.png','Jacob Sartorius.png','Jason Derulo.png','Jennifer Lopez.png','Jess Glynne.png','Jessie J.png','JoJo Siwa.png','JoJo.png','Joel Adams.png','John Legend.png','John Lennon.png','Johnny Cash.png','Jon Bellion.png','Jordan Pruitt.png','Justin Bieber.png','Justin Timberlake.png','Kat Dahlia.png','Katrina and The Waves.png','Katy Perry.png','Kehlani.png','Kelly Clarkson.png','Kelsea Ballerini.png','Kent Jones.png','Kesha.png','Kings Of Leon.png','Kygo.png','LP.png','Lady Gaga.png','Lana Del Rey.png','Laura Marano.png','Les Miserables.png','Lia Marie Johnson.png','Linkin Park.png','Little Mix.png','Lost Frequencies.png','Louisa Johnson.png','Lukas Graham.png','MAX.png','Madilyn Bailey.png','Madonna.png','Marian Hill.png','Marvin Gaye.png','Meghan Trainor.png','Melanie Martinez.png','Michael Bubl.png','Michael Jackson.png','Mike Posner.png','Miley Cyrus.png','Mud.png','Nathan Sykes.png','Nirvana.png','Oasis.png','Oh Wonder.png','Olivia Holt.png','One Direction.png','OneRepublic.png','OutKast.png','Owl City.png','P!nk.png','Panic! At The Disco.png','Paramore.png','Percy Sledge.png','Perry Como.png','Phil Collins.png','Pink.png','Plain White T\'s.png','Pok.png','Post Malone.png','Rae Sremmurd.png','Rag\'n\'Bone Man.png','Rick Astley.png','Rihanna ft. Drake.png','Rihanna.png','Robyn.png','Ron Pope.png','Rusted Root.png','Ruth B.png','Sabrina Carpenter.png','Sam Smith.png','Savage Garden.png','Seal.png','Selena Gomez.png','Shakira.png','Shania Twain.png','Shawn Mendes.png','Sia.png','Sigala.png','Simple Plan.png','Slade.png','Smash Mouth.png','Sofia Carson.png','Sophia Grace.png','Stevie Wonder.png','TINI.png','Taylor Swift.png','The 1975.png','The Calling.png','The Girl And The Dreamcatcher.png','The Jackson 5.png','The Offspring.png','The Rembrandts.png','The Vamps.png','The Weeknd.png','Tory Lanez.png','Tove Lo.png','Travis Scott.png','Trevor Moran.png','Troye Sivan.png','Twenty One Pilots.png','WSTRN.png','Wham!.png','Wheatus.png','Whitney Houston.png','Wicked.png','X Ambassadors.png','ZAYN.png','Zara Larsson.png','Zella Day.png','Zendaya.png']
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
     	
     	
     	let self= this
     	_.each(this.meshes,function(m:any,i:number){
     		TweenMax.fromTo(m.position , 1,
			{
				y:m.position.y,
			},
			{
			 y:m.position.y-2000,
		     // repeat: 1, /* Aka infinite amount of repeats */
	    	 //yoyo: true, /* Make it go back and forth */
	    	 delay:(i+1)*.02,
	    	})

     	})
     	_.delay(function(){
     		self.foo = true;
     	self.client.emit('hostCreateNewGame');	
     	},self.exitTime)
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
		window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	    this.camera.position.z = 1500;
	    this.camera.position.x = 1400;
	    this.camera.position.y = 800;
	    this.geometry = new THREE.BoxGeometry( 200, 200, 10 );
	    // this.material  = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	    
	    var self = this
	    
	     this.imagesArr = this.shuffle(this.imagesArr)
	    let i:number=0;
	     _.times(self.tilesW, function(x:any){
	     	i=i+1;
			return _.times(self.tilesH,function(y:any){
				i=i+1;
				self.material =new THREE.MeshBasicMaterial({
			    	map:THREE.ImageUtils.loadTexture('/app/images/'+self.imagesArr[i]),
			    	side:THREE.DoubleSide,
			    	transparent:true
			    })
				let m:any = new THREE.Mesh( self.geometry, self.material )
				m.position.x = x*200
				m.position.y = y*200
				self.scene.add(m);
				self.meshes.push(m)
			   return m
			})
		});
	  
	    this.renderer = new THREE.WebGLRenderer();
	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	   	

	   	this.animateParticle();
	   	this.animate();

	   	THREEx.WindowResize(this.renderer, this.camera);
	    //document.body.appendChild( this.renderer.domElement );

	}
	onMouseMove(ev:any) {
		this.mouse[0] = ev.clientX / window.innerWidth;
		this.mouse[1] = ev.clientY / window.innerHeight;
	}
	


	animateParticle(){
		//this.mesh.position.x=0
		
		var self= this
		let mZ:number =0
		this.shuffle(this.meshes)
		_.each(this.meshes,function(m:any,i:any){
			//m.position.z =1000
			TweenMax.fromTo(m.position , 4,
			{
				z:m.position.z-3000,
			},
			{
			 z:m.position.z+600,
		     // repeat: 1, /* Aka infinite amount of repeats */
	    	 //yoyo: true, /* Make it go back and forth */
	    	 delay:(i+1)*.02
			})

			TweenMax.fromTo(m.rotation , 2,
			{
				x:self.getRandomInt(0,10),
				y:self.getRandomInt(0,10),
			},
			{
			 	x:0,
			 	y:0,
		     // repeat: 1, /* Aka infinite amount of repeats */
	    	 //yoyo: true, /* Make it go back and forth */
	    	 delay:(i+1)*.02
			})

			TweenMax.fromTo(m.material , 2,
			{
				opacity:0
			},
			{
			 	opacity:.6,
		     // repeat: 1, /* Aka infinite amount of repeats */
	    	 //yoyo: true, /* Make it go back and forth */
	    	 delay:(i+1)*.04
			})

			


		})
	}



	shuffle(array:Array<any>) {
	  let currentIndex:number = array.length,
	   temporaryValue:any, 
	   randomIndex:any;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	     temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}
	getRandomInt(min:number, max:number) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	ngAfterViewInit(){
		$(this.webGl.nativeElement).append( this.renderer.domElement );

	   	TweenMax.fromTo($(this.introContainer.nativeElement),this.enterTextTime,{
	   			opacity:0
	   		},{
	   			opacity:1,
	   			delay:this.enterTextTime
	   		})

	}
	animate() {
	    this.animID = requestAnimationFrame( this.animate.bind(this));
	    this.camera.rotation.x = Math.sin(.05 * Math.PI * (this.mouse[0] - .5)) 
		this.camera.rotation.y = Math.sin(.05 * Math.PI * (this.mouse[1] - .5))
		// this.camera.rotation.z = Math.cos(.5 * Math.PI * (this.mouse[0] - .5))
	    // this.mesh.rotation.x += 0.01;
	    // this.mesh.rotation.y += 0.02;
	    // this.mesh.position.y += 2.2;
	    // this.mesh.position.z += 2.2;

	    this.renderer.render( this.scene, this.camera );
	   
	}
   
  }