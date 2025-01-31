import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { SET_HELP_PATH } from '../../actions';
import RouteErrorHandler from '../RouteErrorHandler';
// TODO: properly isolate authorization screen from the Application (should be injected when needed and only when AuthModule is enabled)
import UnauthorizedAccessScreen from '../../screens/UnauthorizedAccessScreen';
import InvalidRouteScreen from "../../screens/InvalidRouteScreen";


export default function ApplicationRouter(props) {
	const routes = useSelector(state => state.router?.routes);
	return(
		<Routes>
			{routes && routes.map((route, idx) => {
				return route.component ? (
					<Route
						key={idx}
						path={`${route.path}`}
						end={route.end}
						name={route.name}
						element={(
							<RouteErrorHandler>
								<RouteRenderer app={props.app} route={route} routeComponent={<route.component app={props.app} {...route.props} />} />
							</RouteErrorHandler>
						)}
					/>
				) : (null)
			})}
			<Route
				path="*"
				element={<InvalidRouteScreen />}
				// Handle all undefined routes (404)
			/>
		</Routes>
	)
}


function RouteRenderer(props) {
	const resources = useSelector((state) => state.auth?.resources ? state.auth.resources : []);
	const dispatch = useDispatch();
	// Set up and dispatch help content
	useEffect(() => {
		const defaultHelp = "https://docs.teskalabs.com/logman.io/user/";
		dispatch({
			type: SET_HELP_PATH,
			helpPath: props.route.help ? props.route.help : defaultHelp
		});
	}, [props.route.help]);
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
