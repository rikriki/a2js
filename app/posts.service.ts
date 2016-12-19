import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { InterfaceItem } from './interface.item';


@Injectable()

export class PostsService{
	constructor(private http: Http){
		console.log('Post init')
	}

	getPosts(){
		return this.http.get('http://frederick-rosales.herokuapp.com/portfolios')
			.map(res => res.json());
	}
	posts(item:InterfaceItem){
		console.log(item,'RIKI')
	}
}