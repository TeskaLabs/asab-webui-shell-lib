import { Module } from 'asab_webui_components';
import { OfflineBadge } from './OfflineBadge.jsx';

/*
	Module for detecting if the Application is online.

	Prerequisities: asab-ping service
*/

export default class PingModule extends Module {
	constructor(app, name) {
		super(app, "PingModule");

		// Tracking online/offline events
		this._handleOnline = this._handleOnline.bind(this);
		this._handleOffline = this._handleOffline.bind(this);
		// Periodic check for internet access
		this.onlineValidationInterval = null;
		this._validateInternetConnection = this._validateInternetConnection.bind(this);
		// Initially check if the application is online
		this.isAppOnline = navigator.onLine;

		this.headerService = null;

	}

	initialize() {
		// Locate and setup header service (to eventually inject the OfflineBadge)
		this.headerService = this.App.locateService("HeaderService");
		// Add online validation event listeners to track the online/offline status
		window.addEventListener('online', this._handleOnline);
		window.addEventListener('offline', this._handleOffline);

		// Periodic check for internet status (check every 10s)
		this.onlineValidationInterval = setInterval(this._validateInternetConnection, 10000);
		// Check the online status right when the component is mounted
		if (!this.isAppOnline) {
			this._isOffline();
		}

	}

	async _handleOnline() {
		const isOnline = await this._detectOfflineState();
		if (isOnline) {
			// Directly update the state to indicate the app is online
			this.isAppOnline = true;
			this.headerService?.removeComponent(OfflineBadge);
		}
	}

	async _handleOffline() {
		const isOnline = await this._detectOfflineState();
		if (!isOnline) {
			// Directly update the state to indicate the app is offline
			this.isAppOnline = false
			this.headerService?.addComponent({
				component: OfflineBadge,
				order: 100
			});
		}
	}

	_isOffline() {
		// Display offline alert if not online
		if (!this.isAppOnline) {
			this.headerService?.addComponent({
				component: OfflineBadge,
				order: 100
			});
		}
	}

	_isOnline() {
		// Display online alert if online
		if (this.isAppOnline) {
			this.headerService?.removeComponent(OfflineBadge);
		}
	}

	async _validateInternetConnection() {
		const isOnline = await this._detectOfflineState();
		// Validate if the network status has changed (online -> offline or vice versa)
		if (isOnline && !this.isAppOnline) {
			this.isAppOnline = true;
			this._isOnline();
		} else if (!isOnline && this.isAppOnline) {
			this.isAppOnline = false;
			this._isOffline();
		}
	}

	// Detecting online/offline state
	async _detectOfflineState() {
		const ASABPingAPI = this.App.axiosCreate('asab-ping');
		try {
			// Make request for initial data
			await ASABPingAPI.get('/ping', {
				headers: {
					'Cache-Control': 'no-store'
				}
			});
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	// Returns info if application is online
	isOnline() {
		return this.isAppOnline;
	}

	// Dispose the module and clean up resources
	dispose() {
		// Cleanup online validation event listeners when the component is unmounted
		window.removeEventListener('online', this._handleOnline);
		window.removeEventListener('offline', this._handleOffline);
		// Cleanup the online validation interval
		clearInterval(this.onlineValidationInterval);
	}

}
