import {Pipe,PipeTransform} from '@angular/core';
// Tell Angular2 we're creating a Pipe with TypeScript decorators

@Pipe({ name: 'TitlePipe' })
export class TitlePipe implements PipeTransform{
	
  // Transform is the new "return function(value, args)" in Angular 1.x
  transform(value:any) {
  	debugger
    // ES6 array destructuring
    // let [minAge] = args;
    // return value.filter(person => {
    //   return person.age >= +minAge;
    };
  }




// import { Pipe, PipeTransform } from '@angular/core';

// import { Flyer } from './heroes';

// @Pipe({ name: 'flyingHeroes' })
// export class FlyingHeroesPipe implements PipeTransform {
//   transform(allHeroes: Flyer[]) {
//     return allHeroes.filter(hero => hero.canFly);
//   }
// }