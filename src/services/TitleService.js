import React from 'react';
import { Service } from 'asab_webui_components';
import { SET_SUBTITLE } from '../actions';

export default class TitleService extends Service {
	constructor(app, serviceName = "TitleService") {
		super(app, serviceName);
		this.App = app;
	}

	// Method for setting the subtitle
	setSubtitle = (subtitle) => {
		this._updateSubtitle(subtitle);
	};

	// Method for clearing the subtitle
	clearSubtitle = () => {
		this._updateSubtitle(undefined);
	};

	// Method for dispatching subtitle update to Redux store
	_updateSubtitle = (subtitle) => {
		this.App.Store.dispatch({
			type: SET_SUBTITLE,
			subtitle: subtitle
		});
	};
}
