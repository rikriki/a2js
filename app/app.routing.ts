import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

import {AppComponent} from './app.component'
import {About} from './about.component'
import {UserComponent} from './user.component'
import {ItemComponent} from './item.component'

const appRoutes: Routes=[
	{
		path:'',
		component:ItemComponent
	},
	{
		path:'item',
		component:UserComponent
	}
]

export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes);