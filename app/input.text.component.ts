import { Component,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'inputText',
  template: `
  <form #form>
    <div class="info karaoke-form" *ngFor="let input of inputs; let i = index;" >
              <label class="karaoke-label" for="inputPlayerName">{{input.name}}</label>
              <input id="inputPlayerName" class="karaoke-input" (change)="updateInput($event)" placeholder="{{input.name}}" type="text"  />
    </div>
  </form>
  `,
   // Outputs:['searchSong']
})
export class InputTextComponent implements AfterViewInit { 
  @Input()  inputs: Array<any>;
  @Output() updateForm = new EventEmitter();
  @ViewChild('form') form:ElementRef;
  // @Output() searchSong = new EventEmitter();
  // private song:String;
  constructor(){
     // this.searchSong.emit('Riki')
    
  }
  
  ngAfterViewInit(){
    $(this.form.nativeElement).find('input').on('focus',function(){
      $(this).parent().addClass('input--filled')
    }).on('blur',function(){
      $(this).parent().removeClass('input--filled')
    })
  }
  updateInput(e:any){
    this.updateForm.emit({value:e.target.value,input:e.target.placeholder})
  }
  // onSearchClick(){
  //   this.searchSong.emit(this.song)

  // }

  // valuechange(newValue:any) {
  //   this.searchSong.emit(newValue)
  //   console.log(newValue)
  // }

  
}



