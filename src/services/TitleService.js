import React from 'react';
import { Service } from 'asab_webui_components';
// Import theme syncer to use AppStore in the Service class
import TitleSyncer from './TitleSyncer.jsx';
import { registerAppStoreSyncer } from '../components/store/AppStoreSyncerRegistry.jsx';

export default class TitleService extends Service {
	// Create static instance for to create a singleton used in Title syncer
	static instance = null;

	constructor(app, serviceName = "TitleService") {
		super(app, serviceName);
		// Create TitleService singleton instance (used in Title syncer)
		if (!TitleService.instance) {
			TitleService.instance = this;
		}

		registerAppStoreSyncer(TitleSyncer);
		this._subtitle = undefined;
		this._listeners = [];
	}

	setSubtitle = (subtitle) => {
		this._subtitle = subtitle;
		this._notify();
	};

	clearSubtitle = () => {
		this._subtitle = undefined;
		this._notify();
	};

	getSubtitle = () => this._subtitle;

	addChangeListener = (listener) => {
		this._listeners.push(listener);
	};

	removeChangeListener = (listener) => {
		this._listeners = this._listeners.filter(l => l !== listener);
	};

	_notify = () => {
		this._listeners.forEach(listener => listener(this._subtitle));
	};

}
