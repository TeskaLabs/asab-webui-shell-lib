import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'asab_webui_components';

import './ApplicationScreenTitle.scss';

const ApplicationScreenTitle = (props) => {
	const subtitle = useAppSelector(state => state.header?.subtitle);
	const title = useAppSelector(state => state.config?.title);
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
