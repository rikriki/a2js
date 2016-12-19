import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

import {AppComponent} from './app.component'
import {About} from './about.component'
import {UserComponent} from './user.component'

const appRoutes: Routes=[
	{
		path:'',
		component:UserComponent
	},
	{
		path:'about',
		component:About
	}
]

export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes);