import { Service } from 'asab_webui_components';
import ConfigReducer from './ConfigReducer';

import { CHANGE_CONFIG } from '../actions';


export default class ConfigService extends Service {

	constructor(app, serviceName = "ConfigService") {
		super(app, serviceName);
		app.ReduxService.addReducer("config", ConfigReducer);

		this.Config = new Config();
	}

	initialize() {
		/*
			Initialization of dynamic configuration

			Dynamic branding of the header logo can be done via nginx location configuration.
			The support of meta tags for configuration of the header logo brand image has been striped of in 09/2025
			from ASAB WebUI Shell version 26.3.1

			Example of setting up the nginx location for full logo. Same way it can be done for minimized variation.

			...

			location /<app path>/media/logo/header-logo-full-dark.svg {
				alias /<path to logo>/<logo name for dark theme>.svg;
			}

			location /<app path>/media/logo/header-logo-full.svg {
				alias /<path to logo>/<logo name for light theme>.svg;
			}

			...

		*/
		const title = document.getElementsByName('title')[0]?.content;
		const customCSS = document.getElementsByName('custom-css-file')[0]?.content;
		let dynamicConfig = {};

		// Add custom title
		if ((title != undefined) && (title != "")) {
			dynamicConfig["title"] = title;
		}
		// Add custom CSS
		if ((customCSS != undefined) && (customCSS != "")) {
			const link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', customCSS);
			// Append to the `head` element
			document.head.appendChild(link);
		}

		// Dispatch customs to config store
		if (Object.keys(dynamicConfig).length > 0) {
			this.Config._dynamic_config = dynamicConfig;

			if (this.App.AppStore) {
				this.Config.dispatch(this.App.AppStore);
			} else {
				console.warn('Dynamic configuration has not been dispatched to application store');
			}
		}
	}


	addDefaults(defaults, override) {
		if (defaults === undefined) return;
		if (defaults === null) return;

		if (override === false) {
			for (var key in defaults) {
				if (this.Config._defaults[key] === undefined) {
					this.Config._defaults[key] = defaults[key];
				}
			}
		} else {
			for (var key in defaults) {
				this.Config._defaults[key] = defaults[key];
			}
		}

		if (this.App.AppStore) {
			this.Config.dispatch(this.App.AppStore);
		} else {
			console.warn('Default configuration has not been dispatched to application store');
		}

	}

}


class Config {

	constructor(app) {
		this._dynamic_config = {};
		this._defaults = {};

		if (typeof LOCAL_CONFIG !== 'undefined') {
			this._local_config = LOCAL_CONFIG;
		} else {
			this._local_config = {};
		}

	}


	get(key) {
		// First check the remote config
		if (this._dynamic_config[key] != undefined) {
			return this._dynamic_config[key];
		};

		// Then check the local config
		if (this._local_config[key] != undefined) {
			return this._local_config[key];
		};

		// And finally, check defaults
		if (this._defaults[key] != undefined) {
			return this._defaults[key];
		};

		return undefined;
	}


	dispatch(store) {
		var config = Object.assign({}, this._defaults, this._local_config, this._dynamic_config);
		store?.dispatch?.({
			type: CHANGE_CONFIG,
			config: config
		});
	}
}
