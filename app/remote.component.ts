import { Component } from '@angular/core';

@Component({
  selector: 'host',
  template: `<h1>welcome to this game {{name}}</h1>`,
})

export class remoteComponent  { name = 'player1'; }
