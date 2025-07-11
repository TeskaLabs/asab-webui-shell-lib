import { Service } from 'asab_webui_components';
import ThemeReducer from './ThemeReducer';
import { CHANGE_THEME } from "./actions";
import ThemeButton from "./ThemeButton";

// Import theme syncer to use AppStore in the Service class
import ThemeSyncer from './ThemeSyncer.jsx';
import { registerAppStoreSyncer } from '../components/store/AppStoreSyncerRegistry.jsx';
registerAppStoreSyncer(ThemeSyncer);

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
	}

}
