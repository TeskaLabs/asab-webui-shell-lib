import React, { useEffect } from 'react';
import { useAppStore, useAppSelector } from 'asab_webui_components';

import { SET_HELP_PATH } from '../../actions';
import UnauthorizedAccessScreen from '../../screens/UnauthorizedAccessScreen';


export default function RouteRenderer(props) {
	const resources = useAppSelector((state) => state.auth?.resources ? state.auth.resources : []);
	const { dispatch } = useAppStore();
	const defaultHelp = props.app.Config.get("help");

	// Set up and dispatch help content
	useEffect(() => {
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
