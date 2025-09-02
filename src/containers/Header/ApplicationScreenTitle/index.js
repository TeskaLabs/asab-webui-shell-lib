import React from 'react';
import { useAppSelector } from 'asab_webui_components';
import { useMatch } from 'react-router';

import ApplicationScreenTitle from './ApplicationScreenTitle';

const ApplicationTitleRouter = (props) => {
	const routes = useAppSelector(state => state.router?.routes || []);
	const filteredRoutes = filterRoutesByMatch(routes);

	return (
		<ApplicationScreenTitle app={props.app} routes={filteredRoutes} />
	)
}

export default ApplicationTitleRouter;

function filterRoutesByMatch(routes) {
	return routes.filter(route => {
		const match = useMatch({
			path: `${route.path}`
		});
		return match;
	});
}
