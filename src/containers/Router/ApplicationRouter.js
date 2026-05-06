import React, { useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router';
import { useAppStore, useAppSelector } from 'asab_webui_components';

import { SET_HELP_PATH } from '../../actions';
import RouteErrorHandler from '../RouteErrorHandler';
// TODO: properly isolate authorization screen from the Application (should be injected when needed and only when AuthModule is enabled)
import UnauthorizedAccessScreen from '../../screens/UnauthorizedAccessScreen';
import InvalidRouteScreen from "../../screens/InvalidRouteScreen";


export default function ApplicationRouter(props) {
	const routes = useAppSelector(state => state.router?.routes);
	const [router, setRouter] = useState(null);

	useEffect(() => {
		if (!routes || routes.length === 0) {
			return;
		}

		const routeObjects = routes.map(route => {
			return {
				path: route.path,
				handle: {
					name: route.name,
					help: route.help,
					resource: route.resource
				},
				element: (
					<RouteErrorHandler>
						<RouteRenderer app={props.app} route={route} routeComponent={<route.component app={props.app} {...route.props} />} />
					</RouteErrorHandler>
				)
			};

		});

		// Catch all undefined routes (404)
		routeObjects.push({
			path: '*',
			element: <InvalidRouteScreen />
		});

		const newRouter = createHashRouter(routeObjects);
		setRouter(newRouter);
	}, [routes, props.app]);

	if (!router) {
		return null;
	}

	return <RouterProvider router={router} />;
}


function RouteRenderer(props) {
	const resources = useAppSelector((state) => state.auth?.resources ? state.auth.resources : []);
	const { dispatch } = useAppStore();
	const defaultHelp = props.app.Config.get("help");

	// Set up and dispatch help content
	useEffect(() => {
		dispatch({
			type: SET_HELP_PATH,
			helpPath: props.route.help ? props.route.help : defaultHelp
		});
	}, [props.route.help, defaultHelp, dispatch]);

	// Route component renders the approriate screen based on the route
	if (props.route.resource) {
		// If resource present, let UnauthorizedAccessScreen to decide if the Screen will be rendered
		return <UnauthorizedAccessScreen app={props.app} resource={props.route.resource} routeComponent={props.routeComponent} />;
	} else if (!props.route.resource && (resources.includes("authz:superuser") == false)) {
		// If resource is not present, the user is not a superuser and the page is not access control, the UnauthorizedAccessScreen will block the page
		return <UnauthorizedAccessScreen app={props.app} resource={props.route.resource} routeComponent={props.routeComponent} />;
	} else {
		return <>{props.routeComponent}</>;
	}
}
