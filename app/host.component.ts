import { Component } from '@angular/core';

@Component({
  selector: 'host',
  template: `<h1>welcome to this game {{roomId}}</h1>`,
})

export class hostComponent  {
	roomId = '';
	test(){
		console.log('hellp')
	}
	setRoom(roomID:String){
		this.roomId = roomID
		console.log("Room number is ", roomID)
	}
}
