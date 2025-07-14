// Config syncer
import React, { useEffect } from 'react';
import { useAppStore } from '../components/store/AppStore.jsx';
import { CHANGE_CONFIG } from '../actions';

import ConfigService from './ConfigService.js';

export default function ConfigSyncer() {
	const { dispatch } = useAppStore();

	useEffect(() => {
		const config = ConfigService.instance?.Config;
		if (!config) return;

		const handleChange = (newConfig) => {
			dispatch({ type: CHANGE_CONFIG, config: newConfig });
		};

		// Initial dispatch with the current merged config
		handleChange(config.getMergedConfig());

		// Listen for future changes
		config.onChange(handleChange);

		return () => {
			config.offChange(handleChange);
		};
	}, [dispatch]);

	return null;
}
