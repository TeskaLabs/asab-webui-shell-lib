import { Service } from 'asab_webui_components';
import ConfigReducer from './ConfigReducer';

import { registerReducer } from '../components/store/reducer/reducerRegistry.jsx';

// Import config syncer to use AppStore in the Service class
import ConfigSyncer from './ConfigSyncer.jsx';
import { registerAppStoreSyncer } from '../components/store/AppStoreSyncerRegistry.jsx';

export default class ConfigService extends Service {

	// Create static instance for to create a singleton used in Config syncer
	static instance = null;

	constructor(app, serviceName = "ConfigService") {
		super(app, serviceName);
		// Create ConnfigService singleton instance (used in Config syncer)
		if (!ConfigService.instance) {
			ConfigService.instance = this;
		}

		registerAppStoreSyncer(ConfigSyncer);
		registerReducer('config', ConfigReducer, {});

		this.Config = new Config();
	}

	// TODO: test dynamic imports from meta tags
	initialize() {
		// Read meta tags and build dynamic config
		const headerLogoFull = document.getElementsByName('header-logo-full')[0]?.content;
		const headerLogoMini = document.getElementsByName('header-logo-minimized')[0]?.content;
		const headerLogoFullDark = document.getElementsByName('header-logo-full-dark')[0]?.content;
		const headerLogoMiniDark = document.getElementsByName('header-logo-minimized-dark')[0]?.content;
		const title = document.getElementsByName('title')[0]?.content;
		const customCSS = document.getElementsByName('custom-css-file')[0]?.content;

		let dynamicConfig = {};
		// determine if any logos have been dynamically configured and assign brandImage property as an empty object
		if (((headerLogoFull != undefined) && (headerLogoFull != "")) || ((headerLogoFullDark != undefined) && (headerLogoFullDark != "")) || ((headerLogoMini != undefined) && (headerLogoMini != "")) || ((headerLogoMiniDark != undefined) && (headerLogoMiniDark != ""))) {
			dynamicConfig.brandImage = {};
		}
		// If header's full light logo has been configured, add it to dynamic config object
		if ((headerLogoFull != undefined) && (headerLogoFull != "")) {
			Object.assign(dynamicConfig.brandImage, {"light": {"full": headerLogoFull}});
		}
		// If header's full dark logo has been configured, extend/add it to dynamic config's brandImage property
		if ((headerLogoFullDark != undefined) && (headerLogoFullDark != "")) {
			Object.assign(dynamicConfig.brandImage, {"dark": {"full": headerLogoFullDark}});
		}
		// If header's minimized light logo has been configured, extend/add it to dynamic config brandImage property
		if ((headerLogoMini != undefined) && (headerLogoMini != "")) {
			Object.assign(dynamicConfig.brandImage, {...dynamicConfig.brandImage, "light" : {...dynamicConfig.brandImage?.light, "minimized": headerLogoMini}})
		}
		// If header's minimized dark logo has been configured, extend/add it to dynamic config brandImage property
		if ((headerLogoMiniDark != undefined) && (headerLogoMiniDark != "")) {
			Object.assign(dynamicConfig.brandImage, {...dynamicConfig.brandImage, "dark" : {...dynamicConfig.brandImage?.dark, "minimized": headerLogoMiniDark}})
		}
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

		// Dispatch to AppStore context
		if (Object.keys(dynamicConfig).length > 0) {
			// Store dynamic config in the Config instance
			this.Config._dynamic_config = dynamicConfig;
			this.Config._notifyChange(); // Notify listeners (ConfigSyncer) of the new config

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

		this.Config._notifyChange(); // Notify listeners of the change
	}

}


class Config {

	constructor(app) {
		this._dynamic_config = {};
		this._defaults = {};
		this._listeners = [];

		if (typeof LOCAL_CONFIG !== 'undefined') {
			this._local_config = LOCAL_CONFIG;
		} else {
			this._local_config = {};
		}
	}

	get(key) {
		// First check the remote config
		if (this._dynamic_config[key] !== undefined) {
			return this._dynamic_config[key];
		}
		// Then check the local config
		if (this._local_config[key] !== undefined) {
			return this._local_config[key];
		}
		// And finally, check defaults
		if (this._defaults[key] !== undefined) {
			return this._defaults[key];
		}
		return undefined;
	}

	getMergedConfig() {
		return Object.assign({}, this._defaults, this._local_config, this._dynamic_config);
	}

	_notifyChange() {
		const merged = this.getMergedConfig();
		this._listeners.forEach(fn => fn(merged));
	}
}
