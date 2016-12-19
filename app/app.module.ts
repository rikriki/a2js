import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';
import { UserComponent }  from './user.component';
import { About }  from './about.component';
import { routing }  from './app.routing';


@NgModule({
  imports:      [ BrowserModule,FormsModule ,routing],
  declarations: [ AppComponent,UserComponent,About],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
