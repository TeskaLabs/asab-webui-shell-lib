// ThemeSyncer.jsx
import React, { useEffect } from 'react';
import { useAppStore } from '../components/store/AppStore.jsx';
import { CHANGE_THEME } from './actions';

export default function ThemeSyncer() {
	const { dispatch } = useAppStore();

	useEffect(() => {
        const prefersColorScheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
		? "dark"
		: "light"
		;

		dispatch({
			type: CHANGE_THEME,
			theme: prefersColorScheme
		});
	}, [dispatch]);

	return null;
}
