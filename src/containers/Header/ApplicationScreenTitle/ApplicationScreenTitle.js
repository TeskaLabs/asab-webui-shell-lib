import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'asab_webui_components';

import './ApplicationScreenTitle.scss';

/*
	Example of use hasHeaderTitle.
	It must be set in App configuration.
	If not set to `false` or at all, it is considered as true.

	...

	const ConfigDefaults = {
		...
		hasHeaderTitle: false,
	}

	root.render(
		<HashRouter>
			<Application
				configdefaults={ConfigDefaults} 
				modules={modules}
			/>
		</HashRouter>
	);
*/

const ApplicationScreenTitle = (props) => {

	const subtitle = useAppSelector(state => state.header?.subtitle);
	const title = useAppSelector(state => state.config?.title);
	const hasHeaderTitle = useAppSelector(state => state?.config?.hasHeaderTitle);

	const { t } = useTranslation();
	const route = props.routes?.[0];

	const routeName = useMemo(() =>{
		if (route && route.name) {
			return route.name;
		} else {
			return title;
		}
	}, [route]);

	useEffect(() => {
		document.title = (title && routeName) ? `${title} | ${routeName}` : title;
	}, [routeName, t]);

	// If specifically declared in the configuration, that header title should not be available, dont display header title
	if (hasHeaderTitle === false) {
		return null;
	}

	return (
		<div className="application-screen-title text-primary">
			<h4 className="m-0">{t(`ApplicationScreenTitle|${routeName}`)}</h4>
			{subtitle &&
				<>
					<span className="px-2 subtitle-separator">{"|"}</span>
					<h5 className="m-0">{subtitle}</h5>
				</>}
		</div>
	)
}

export default ApplicationScreenTitle;
