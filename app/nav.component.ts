import { Component,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'navigation',
  template: `
  {{name}}
  <nav class="navbar navbar-karaoke">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">M-Karaoke</a>
      </div>
      <form class="navbar-form navbar-right" role="search">
        <div class="form-group col-xs-10 searchForm">
          <input type="text" [(ngModel)]="song" (ngModelChange)="valuechange($event)"  class="form-control" placeholder="Search" [ngModelOptions]="{standalone: true}">
        </div>
        <button type="submit" class="btn btn-primary col-xs-2" (click)="onSearchClick()"><span class="glyphicon glyphicon-search"></span></button>

      </form>
    </div><!-- /.container-fluid -->
  </nav>
  `,
   // Outputs:['searchSong']
})
export class NavComponent { 
  @Output() searchSong = new EventEmitter();
  @Input()  name: string;
  private song:String;
  constructor(){
     this.searchSong.emit('Riki')
    
  }
  onSearchClick(){
    this.searchSong.emit(this.song)

  }

  valuechange(newValue:any) {
    this.searchSong.emit(newValue)
    console.log(newValue)
  }

  
}



