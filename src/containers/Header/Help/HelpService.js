import { Service } from 'asab_webui_components';
import HelpButton from "./HelpButton";

export default class HelpService extends Service {

	constructor(app, serviceName = "HelpService") {
		super(app, serviceName);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: HelpButton,
			order: 300
		});
	}
}
