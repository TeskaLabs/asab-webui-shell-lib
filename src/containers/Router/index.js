import React, { Component } from 'react';
import { SET_ROUTES } from '../../actions';

export default class Router extends Component {

	constructor(app) {
		super(app);
		this.Routes = [];
		this.App = app;
		// Debounce timer for batching route updates
		this._dispatchTimeout = null;
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

		// Debounce the dispatch to batch multiple route additions during init
		// This prevents creating multiple routers when modules register routes
		if (this._dispatchTimeout) {
			clearTimeout(this._dispatchTimeout);
		}

		this._dispatchTimeout = setTimeout(() => {
			this._dispatchTimeout = null;
			if (this.App.AppStore) {
				this.App.AppStore.dispatch?.({ type: SET_ROUTES, routes: [...this.Routes] });
			}
		}, 0);
	}
}
