import { Service } from 'asab_webui_components';
import ThemeReducer from './ThemeReducer';
import ThemeButton from "./ThemeButton";
import { registerReducer } from '../components/store/reducer/reducerRegistry.jsx';

// Import theme syncer to use AppStore in the Service class
import ThemeSyncer from './ThemeSyncer.jsx';
import { registerAppStoreSyncer } from '../components/store/AppStoreSyncerRegistry.jsx';
registerAppStoreSyncer(ThemeSyncer);

export default class ThemeService extends Service {

	constructor(app, serviceName = "ThemeService") {
		super(app, serviceName);
		registerReducer('theme', ThemeReducer, null);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: ThemeButton,
			order: 400,
			fullscreenVisible: true
		});
	}

}
