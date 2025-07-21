import { Service, getAppStoreDispatch, registerReducer } from 'asab_webui_components';
import ThemeReducer from './ThemeReducer';
import ThemeButton from "./ThemeButton";
import { CHANGE_THEME } from './actions';

export default class ThemeService extends Service {

	constructor(app, serviceName = "ThemeService") {
		super(app, serviceName);
		registerReducer('theme', ThemeReducer);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: ThemeButton,
			order: 400,
			fullscreenVisible: true
		});
		// Detect initial theme (based on color-scheme aka user prefered theme)
		// Doesn't work in Chromiuim in Ubuntu
		// more info https://bugs.chromium.org/p/chromium/issues/detail?id=998903
		const prefersColorScheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
		? "dark"
		: "light"
		;

		// Dispatch theme
		const dispatch = getAppStoreDispatch();
		dispatch({
			type: CHANGE_THEME,
			theme: prefersColorScheme
		});

		// TODO: Add listener to the system theme and change light/dark based on that
	}

}
