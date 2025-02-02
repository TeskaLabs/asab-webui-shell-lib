import React, { Component } from 'react';
import { SET_ROUTES } from '../../actions';

export default class Router extends Component {

	constructor(app) {
		super(app);
		this.Routes = [];
		this.App = app;
	}

	addRoute(route) {
		/* Example route:
			{
				path: '/some/path', // Url path
				end: true, // Whether path must be matched exactly
				name: 'Some Name', // Route name
				component: ReactComponent, // Component to be rendered
				resource: some:resource, // Resource of the component | *optional
				help: "https://docs.teskalabs.com" // Help content of the screen (route) | *optional
			}
		*/
		this.Routes.push(route);
		this.App.Store.dispatch({ type: SET_ROUTES, routes: this.Routes });
	}
}
