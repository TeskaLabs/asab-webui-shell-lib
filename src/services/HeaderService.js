import { Service } from 'asab_webui_components';
import { SET_HEADER_NAVIGATION_ITEMS } from '../actions';

export default class HeaderService extends Service {

	/*
	Header service expects `header-logo-full.svg` and `header-logo-minimized.svg` SVG images
	in `/public/media/logo/` directory:

	 * `header-logo-full.svg` dimensions: 150 x 50 pixels
	 * `header-logo-minimized.svg` dimensions: 50 x 50 pixels
	*/

	constructor(app, serviceName="HeaderService"){
		super(app, serviceName)
		this.Items = [];
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

	addComponent(component) {
		this.Items.push({
			'component': component.component,
			'componentProps': component.componentProps,
			'order': component.order,
			'fullscreenVisible': component.fullscreenVisible
		})
		this.App?.AppStore?.dispatch?.({ type: SET_HEADER_NAVIGATION_ITEMS, headerNavItems: this.Items });
	}

	// This function removes a component from the Header
	removeComponent(component) {
		const filteredItems = this.Items.filter(item => item.component !== component);
		this.Items = filteredItems;
		this.App.AppStore?.dispatch?.({ type: SET_HEADER_NAVIGATION_ITEMS, headerNavItems: this.Items });
	}

}
