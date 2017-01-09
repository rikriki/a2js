// import {Pipe} from '@angular/core'

// @Pipe({
// 	name:'ArtistPipe'
// })


// export class ArtistPipe{
// 	transform(value,args){
// 		let [artist] = args;
// 		return value.filter(song=>{
// 			return song.title.match.(new RegExp(artist,"i"))
// 		})
// 	}

// }


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'Artist'})
export class ArtistPipe implements PipeTransform {
  transform(value: string, args: string[]): any {
  //   if (!value) return value;

  //   let [artist] = args;
		// return value.filter(song=>{
		// 	return song.title.match.(new RegExp(artist,"i"))
		// })
		// debugger;
		return value
  }
}





