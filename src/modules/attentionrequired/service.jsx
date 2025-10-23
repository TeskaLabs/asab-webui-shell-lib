import { Service } from 'asab_webui_components';
import { SET_ATTENTION_REQUIRED_BEACON } from '../../actions';
import { OfflineIndication } from './components/OfflineIndication.jsx';

// Service handling attention required
export default class AttentionRequiredService extends Service {

	constructor(app, serviceName="AttentionRequiredService"){
		super(app, serviceName);
		this.beaconWebSocket = null; // beacon websocket variable
		this.reconnectTimeout = null; // timeout variable
		this.reconnectInterval = 5000; // initial reconnection interval (5 seconds)
		this.prevStatus = null; // initial status
		this.prevBeacon = null; // initial beacon
	}

	// Start beacon websocket connection on initialization
	initialize() {
		this.connectBeaconWebSocket();
	}

	// Method for connection to beacon websocket
	connectBeaconWebSocket() {
		// Retrieve current tenant
		const currentTenant = this.App?.Services?.TenantService?.getCurrentTenant();
		// Gracefully reconnect if tenant was not found
		if (!currentTenant) {
			// TODO: maybe set offline
			console.error("Beacon WebSocket error: Tenant was not found!");
			this.reconnectBeaconWebSocket();
			return;
		}

		const BeaconServiceClient = this.App.createWebSocket('asab-remote-control', `/beacon/${currentTenant}/ws`);
		this.beaconWebSocket = BeaconServiceClient;

		this.beaconWebSocket.onopen = () => {
			this.connectionStatus('online');
			console.log('Beacon WebSocket connection established.');
		};

		this.beaconWebSocket.onmessage = (message) => {
			try {
				const data = JSON.parse(message.data);
				// TODO: implement some type based recognition
				this.distributeData(data);
			} catch (e) {
				console.error("Error parsing Beacon WebSocket message data:", e);
				this.distributeData({});
			}
		};

		this.beaconWebSocket.onerror = (error) => {
			console.error("Beacon WebSocket error:", error);
			console.error("Beacon WebSocket is attempting to reconnect...");
			this.connectionStatus('offline');
			this.distributeData({});
			this.reconnectBeaconWebSocket();
		};

		this.beaconWebSocket.onclose = () => {
			this.connectionStatus('offline');
			/*
				WebSocket connection is closed by the browser automatically when user
				leaves the application (not the screen).
			*/
			if (this.beaconWebSocket) {
				// Close the WebSocket connection
				this.beaconWebSocket.close();

				// Clean up event listeners
				this.beaconWebSocket.onopen = null;
				this.beaconWebSocket.onmessage = null;
				this.beaconWebSocket.onerror = null;
				this.beaconWebSocket.onclose = null;

				// Set WebSocket reference to null to free up memory
				this.beaconWebSocket = null;
			}

			// Clear the reconnect timeout if it exists
			if (this.reconnectTimeout) {
				clearTimeout(this.reconnectTimeout);
				this.reconnectTimeout = null;
			}

			console.log("Beacon WebSocket connection closed.");
		};
	}

	// Method for reconnection to beacon websocket
	reconnectBeaconWebSocket() {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}
		this.reconnectTimeout = setTimeout(() => {
			this.connectBeaconWebSocket();
		}, this.reconnectInterval); // Retry connection after the reconnection interval

		// Increase reconnection time by 5s, the limit is 60s (so that we dont overload the server)
		if ((this.reconnectInterval + 5000) <= 60000) {
			this.reconnectInterval += 5000;
		}
	}

	// Method for distributing the data into Application store
	distributeData(data) {
		const next = this.transformData(data);
		const initial = (this.prevBeacon === null);
		const nextEmpty = _isEmptyObject(next);
		const prevEmpty = _isEmptyObject(this.prevBeacon);

		/*
			We dont want to repetitivelly dispatch empty beacons to the AppStore
			because it is causing unwanted re-rendering of the Application
		*/
		if (initial || !nextEmpty || (nextEmpty && !prevEmpty)) {
			this.App?.AppStore?.dispatch?.({
				type: SET_ATTENTION_REQUIRED_BEACON,
				beacon: next,
			});
			// Update previous snapshot after dispatch
			this.prevBeacon = next;
		}
	}

	// Transform and group beacon data
	transformData(inputData) {
		// Validate if input data are array
		if (!Array.isArray(inputData)) {
			return {};
		}

		return inputData.reduce((acc, entry) => {
			const { type, _c, reference_path } = entry;

			// Identify the dynamic key (it could be 'library', 'configuration', 'services', etc.)
			const dynamicKey = Object.keys(entry).find(key => (typeof entry[key] === 'object') && (entry[key] !== null) && !Array.isArray(entry[key]));

			if (!dynamicKey) {
				// Skip if no valid dynamic key is found
				return acc;
			}

			const data = entry[dynamicKey];
			// Ensure type is present in the accumulator
			if (!acc[type]) {
				acc[type] = {
					count: 0,
					data: []
				};
			}
			// Push each entry into the data array
			acc[type].data.push(data);
			// Increment count for the type
			acc[type].count += 1;

			return acc;
		}, {});
	};

	// Method for publishing the connection status and displaying offline indication
	connectionStatus(status) {
		if (this.App?.PubSub) {
			// Distribute status
			this.App?.PubSub?.publish('Application.status!', { status });
			const headerService = this.App?.Services?.HeaderService;
			if (headerService) {
				if (this.prevStatus != status) {
					if (status === 'offline') {
						headerService?.addComponent({
							component: OfflineIndication,
							order: 100
						});
					} else {
						headerService?.removeComponent(OfflineIndication);
					}
					this.prevStatus = status;
				}
			}
		}
	}

}

// Method for identifying an empty object
function _isEmptyObject(o) {
	return o != null && typeof o === 'object' && Object.keys(o).length === 0;
}
