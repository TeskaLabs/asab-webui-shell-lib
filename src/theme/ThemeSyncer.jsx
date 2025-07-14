// Theme syncer
import React, { useEffect } from 'react';
import { useAppStore, useAppSelector } from '../components/store/AppStore.jsx';
import { CHANGE_THEME } from './actions';

export default function ThemeSyncer() {
	const { dispatch } = useAppStore();
	const theme = useAppSelector(state => state.theme);

	useEffect(() => {
		const prefersColorScheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
			? "dark"
			: "light";

		dispatch({
			type: CHANGE_THEME,
			theme: prefersColorScheme
		});

		const listener = (e) => {
			const newTheme = e.matches ? 'dark' : 'light';
			dispatch({ type: CHANGE_THEME, theme: newTheme });
		};
		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		mql.addEventListener('change', listener);

		return () => mql.removeEventListener('change', listener);
	}, [dispatch]);

	// Apply the theme to the DOM
	useEffect(() => {
		if (theme === 'dark' || theme === 'light') {
			document.documentElement.setAttribute('data-bs-theme', theme);
		}
	}, [theme]);

	return null;
}
