import React from 'react';
import { Module } from 'asab_webui_components';
import AttentionRequiredService from './service.jsx';
import connectivityReducer from './connectivityReducer.jsx';
import attentionRequiredReducer from './attentionRequiredReducer.jsx';

export default class AttentionRequiredModule extends Module {

	constructor(app, name = "AttentionRequiredModule") {
		super(app, name);
		this.App = app;

		this.AttentionRequiredService = new AttentionRequiredService(app, "AttentionRequiredService");

		this.App.ReduxService.addReducer("attentionrequired", attentionRequiredReducer);
		this.App.ReduxService.addReducer("connectivity", connectivityReducer);
	}

}
