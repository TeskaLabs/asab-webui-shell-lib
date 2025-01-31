import React from 'react';
import { Module } from 'asab_webui_components';
import TenantService from './service';
import TenantDropdown from './TenantDropdown';
import reducer from './reducer';

export default class TenantModule extends Module {

	constructor(app, name) {
		super(app, "TenantModule");
		this.App = app;

		this.TenantService = new TenantService(app, "TenantService");

		this.App.ReduxService.addReducer("tenant", reducer);
	}


	initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: TenantDropdown,
			order: 600
		});
	}

}
