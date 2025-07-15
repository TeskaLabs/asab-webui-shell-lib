// Config syncer
import React, { useEffect } from 'react';
import { useAppStore } from '../components/store/AppStore.jsx';
import { CHANGE_CONFIG } from '../actions';

import ConfigService from './ConfigService.js';

export default function ConfigSyncer() {
	const { dispatch } = useAppStore();

	useEffect(() => {
		if (!ConfigService?.instance) return;
		const config = ConfigService.instance?.Config;
		dispatch({ type: CHANGE_CONFIG, config: config.getMergedConfig() });
	}, [dispatch]);

	return null;
}
