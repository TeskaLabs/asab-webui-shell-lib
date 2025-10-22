import { Service } from 'asab_webui_components';
import ThemeReducer from './ThemeReducer';
import ThemeButton from "./ThemeButton";
import { CHANGE_THEME } from './actions';

export default class ThemeService extends Service {

	constructor(app, serviceName = "ThemeService") {
		super(app, serviceName);
		app.ReduxService.addReducer("theme", ThemeReducer);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: ThemeButton,
			order: 400,
			fullscreenVisible: true
		});

		let initialTheme;

		// Check localStorage (read-only, no saving)
		try {
			const savedTheme = localStorage.getItem('asabTheme');
			if (savedTheme) {
				initialTheme = savedTheme;
			}
		} catch (error) {
			console.warn('Failed to read theme from localStorage:', error);
		}

		// If there is nothing in localStorage, use the browser preferences.
		if (!initialTheme) {
			/*
				Detect initial theme (based on color-scheme aka user prefered theme)
				Doesn't work in Chromiuim in Ubuntu
				more info https://bugs.chromium.org/p/chromium/issues/detail?id=998903
			*/
			initialTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
				? "dark"
				: "light";
		}

		// Dispatch theme
		this.App?.AppStore?.dispatch?.({
			type: CHANGE_THEME,
			theme: initialTheme
		});

		// TODO: Add listener to the system theme and change light/dark based on that
	}

}
