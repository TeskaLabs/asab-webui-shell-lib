import { Service } from 'asab_webui_components';

// Import theme syncer to use AppStore in the Service class
import HeaderSyncer from './HeaderSyncer.jsx';
import { registerAppStoreSyncer } from '../components/store/AppStoreSyncerRegistry.jsx';

export default class HeaderService extends Service {

	/*
	Header service expects `header-logo-full.svg` and `header-logo-minimized.svg` SVG images
	in `/public/media/logo/` directory:

	 * `header-logo-full.svg` dimensions: 150 x 50 pixels
	 * `header-logo-minimized.svg` dimensions: 50 x 50 pixels
	*/

	// Create static instance for to create a singleton used in Header syncer
	static instance = null;

	constructor(app, serviceName="HeaderService"){
		super(app, serviceName);
		// Create HeaderService singleton instance (used in Header syncer)
		if (!HeaderService.instance) {
			HeaderService.instance = this;
		}

		registerAppStoreSyncer(HeaderSyncer);
		this.Items = [];
		this._listeners = [];
	}


	initialize() {
		this.App.ConfigService.addDefaults({
			'defaultBrandImage': {
				full: "media/logo/header-logo-full.svg",
				minimized: "media/logo/header-logo-minimized.svg",
				href: undefined,
			}
		}, true)
	}

	/*
	Adding items to the header can be done by using addComponent:

		const headerService = app.locateService("HeaderService");
		headerService.addComponent({
			component: NavLink,
			componentProps: {children: "My redirect button", href: "#/redirect", style: {marginRight: "2rem"}},
			order: 900
		});

	*/

	addChangeListener(listener) {
		this._listeners.push(listener);
	}

	removeChangeListener(listener) {
		this._listeners = this._listeners.filter(l => l !== listener);
	}

	_notify() {
		this._listeners.forEach(listener => listener(this.Items));
	}

	addComponent(component) {
		this.Items.push({
			'component': component.component,
			'componentProps': component.componentProps,
			'order': component.order,
			'fullscreenVisible': component.fullscreenVisible
		});
		this._notify();
	}

	removeComponent(component) {
		const filteredItems = this.Items.filter(item => item.component !== component);
		this.Items = filteredItems;
		this._notify();
	}

}
