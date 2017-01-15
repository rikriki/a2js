import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { InterfaceItem } from './interface.item';

declare var _:any;

@Injectable()

export class PostsService{
	extractData:any
	handleError:any
	url:String ='http://localhost:1338'
	constructor(private http: Http){
		console.log('Post init')
	}
	preload(){
		return {
			getGenres:()=>{
				return this.http.get(this.url+'/genres')
					.toPromise()
					.then(this.extractData)
					.catch(this.handleError)
			},
			getSongs:()=>{
				return this.http.get(this.url+'/songs')
			     .toPromise()
	             .then(this.extractData)
	             .catch(this.handleError);
			},
			getCategory:()=>{
				return this.http.get(this.url+'/language')
				 .toPromise()
	             .then(this.extractData)
	             .catch(this.handleError);
			}
		}	
	}


	posts(item:InterfaceItem){
		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		console.log(item,'RIKI')
		return this.http.post('http://localhost:1338/items',item)
				.map(res => res.json())
	}

	getPhotosPromise(){
		return this.http.get('https://jsonplaceholder.typicode.com/photos')
		     .toPromise()
             .then(this.extractData)
             .catch(this.handleError);
	}
}
