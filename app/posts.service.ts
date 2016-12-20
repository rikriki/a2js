import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
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
		var headers = new Headers();
  		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		console.log(item,'RIKI')
		return this.http.post('http://localhost:1338/items',item)
				.map(res => res.json())

		
	}
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