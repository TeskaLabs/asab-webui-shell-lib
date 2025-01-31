import { Module } from 'asab_webui_components';
import I18nService from './service.js';
import LanguageDropdown from './dropdown.js';
import languageReducer from './reducer.js'

export default class I18nModule extends Module {

	constructor(app, name, props) {
		super(app, "I18nModule");
		this.App = app;

		this.I18nService = new I18nService(app, "I18nService");
		this.App.ReduxService.addReducer("language", languageReducer);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: LanguageDropdown,
			componentProps: {children: "LanguageDropdown"},
			order: 500,
			fullscreenVisible: true
		});
	}

}
