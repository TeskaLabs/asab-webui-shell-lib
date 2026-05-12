import React from 'react';
import { useMatches } from 'react-router';

import ApplicationScreenTitle from './ApplicationScreenTitle';

const ApplicationTitleRouter = (props) => {
	const matches = useMatches();
	const routes = matches
		.filter(match => match.handle && match.handle.name)
		.map(match => ({ name: match.handle.name, path: match.pathname }));

	return (
		<ApplicationScreenTitle app={props.app} routes={routes} />
	)
}

export default ApplicationTitleRouter;
