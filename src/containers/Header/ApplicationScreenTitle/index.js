import React from 'react';
import { useSelector } from 'react-redux';
import { useMatch} from 'react-router-dom';

import ApplicationScreenTitle from './ApplicationScreenTitle';

const ApplicationTitleRouter = (props) => {
	const routes = useSelector(state => state.router?.routes);
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
