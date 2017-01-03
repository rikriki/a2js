import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()

export class PostsService{
	extractData:any
	handleError:any
	constructor(private http: Http){
		console.log('Post init')
	}
	preload(){
		return {
			getPosts:()=>{
				return this.http.get('https://jsonplaceholder.typicode.com/albums')
					.toPromise()
					.then(this.extractData)
					.catch(this.handleError)
			},
			getPhotos:()=>{
				return this.http.get('https://jsonplaceholder.typicode.com/photos')
			     .toPromise()
	             .then(this.extractData)
	             .catch(this.handleError);
			}
		}	
	}

	getPosts(){
		return this.http.get('http://frederick-rosales.herokuapp.com/portfolios')
			.map(res => res.json());
	}
}