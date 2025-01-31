import { Service } from 'asab_webui_components';
import Axios from 'axios';
import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";

export default class I18nService extends Service {

	constructor(app, name="I18nService") {
		super(app, name);
		app.addSplashScreenRequestor(this);

		this.Sources = [];

		var config = this.App.Config.get('i18n');
		if (config === undefined) {
			config = {
				debug: true
			}
		}

		// config.supportedLngs is not an array but some faked array crap so we need to convert that
		var supportedLngs = []
		for (var i in config.supportedLngs) {
			supportedLngs.push(config.supportedLngs[i]);
		}
		config.supportedLngs = supportedLngs;

		// Missing keys are displayed without the namespace
		config.parseMissingKeyHandler = (key) => {
			var n = key.lastIndexOf("|");
			if (n > 0) {
				return key.slice(n+1);
			}
			return key;
		}

		// Set default key separator
		config.keySeparator = "|";

		this.Sources.push(async (language, namespace) => {
			// This will load locales from the shell application `public/locales` folder
			const response = await Axios.get(`locales/${language}/${namespace}.json`);
			return response.data;
		});

		this.Backend = {
			type: "backend",

			init: (services, backendOptions, i18nextOptions) => {
			},

			read: (language, namespace, callback) => {
				// Prepare all promises that obtain (downloads) translations for a given language and namespace
				const promises = this.Sources.flatMap((source) => source(language, namespace))

				return new Promise(async function(resolve, reject) {

					// Execute prepared promises
					const bundles = await Promise.all(promises.map(p => p.catch(err => {
						console.warn("Failed to load locales:", err);
						return {}; // Skip errors
					})));

					// Combine downloaded bundles into a one
					let combined = bundles.reduce((accumulator, currentObject) => {
						return { ...accumulator, ...currentObject };
					}, {});

					// Set the combined bundle to i18n
					resolve(callback(null, combined));
				})
			},
		};

		this.i18n = i18n
			.use(this.Backend)
			.use(initReactI18next)
			.use(LanguageDetector)
			.init(config, (err, t) => {
				if (err) {
					console.log('Failed to load localizations:', err);
				}
			});
	}


	async initialize() {
		await this.i18n
		await i18n.reloadResources();
		this.App.removeSplashScreenRequestor(this);
	}


	addSource(promise) {
		this.Sources.push(promise);
	}

}

