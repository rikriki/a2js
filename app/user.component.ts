import { Component } from '@angular/core';


@Component({
  selector: 'user',
  template: `<h1>Hello {{name}}</h1>
  	<h3>{{address.street}},{{address.number}},{{address.city}}</h3>
  	<ul>
  		<li *ngFor="let skill of skills; let i = index;">
  			{{skill}}<button (click)="toggleSkills(i)">{{i}}</button>
  		</li>

  		
  	</ul>
  	<hr/>
  	<form (submit)="addHobies(hoby.value)">
  		<label>Add Hobier</label>
  		<input type="text" #hoby /><br/>
  	</form>
  	<form>
  		<label>Name</label>
  		<input type="text" name="name" [(ngModel)]="name" /><br/>
  		<input type="text" name="street" [(ngModel)]="address.street" /><br/>
  		<input type="text" name="number" [(ngModel)]="address.number" /><br/>
  		<input type="text" name="city" [(ngModel)]="address.city" />
  	</form>
  `,
})
export class UserComponent  { 
	name:string;
	skills:string[];
	address:Address;
	fname:string
	constructor(){
		this.name = "riki"	
		this.fname = "diday"		
		this.skills=['a','b','c']
		this.address = {
			street:'ontario st.',
			number:'568',
			city:'St.Catharines'
		}
	}
	toggleSkills(i:string){
		console.log(i)
	}
	addHobies(hobby:string){
	this.skills.push(hobby)
	}
}

interface Address {
	street:string;
	number:string;
	city:string;
}