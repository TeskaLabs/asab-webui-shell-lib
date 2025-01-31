import { Service } from 'asab_webui_components';
import PreviewFlag from "./PreviewFlag";

export default class PreviewService extends Service {

	constructor(app, serviceName = "PreviewService") {
		super(app, serviceName);
	}

	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: PreviewFlag,
			order: 100
		});
	}
}
