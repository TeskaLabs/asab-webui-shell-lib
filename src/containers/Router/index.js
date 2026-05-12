import React, { Component } from 'react';

import RouteErrorHandler from '../RouteErrorHandler';
import RouteRenderer from './RouteRenderer';
import { getRouterInstance } from './registry';

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
				end: true, // Whether path must be matched exactly (legacy; ignored in data router)
				name: 'Some Name', // Route name
				component: ReactComponent, // Component to be rendered
				resource: some:resource, // Resource of the component | *optional
				help: "https://docs.teskalabs.com" // Help content of the screen (route) | *optional
				props: {...} // Props forwarded to the route component | *optional
			}
		*/
		this.Routes.push(route);

		const router = getRouterInstance();
		if (!router) {
			console.warn("Router instance is not available. addRoute() must be called after setRouterInstance(router) in bootstrap.js.");
			return;
		}

		const RouteComponent = route.component;
		const dataRoute = {
			path: route.path,
			element: (
				<RouteErrorHandler>
					<RouteRenderer
						app={this.App}
						route={route}
						routeComponent={<RouteComponent app={this.App} {...route.props} />}
					/>
				</RouteErrorHandler>
			),
			handle: {
				name: route.name,
				help: route.help,
				resource: route.resource,
			},
		};

		router.patchRoutes('root', [dataRoute]);
	}
}
