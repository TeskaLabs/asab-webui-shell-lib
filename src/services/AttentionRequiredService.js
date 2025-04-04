import { Service } from 'asab_webui_components';
import { SET_ATTENTION_REQUIRED_BEACON } from '../actions';

// Service handling attention required
export default class AttentionRequiredService extends Service {

	constructor(app, serviceName="AttentionRequiredService"){
		super(app, serviceName);
		this.beaconWebSocket = null; // beacon websocket variable
		this.reconnectTimeout = null; // timeout variable
		this.reconnectInterval = 5000; // initial reconnection interval (5 seconds)
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
			console.error("Beacon WebSocket error: Tenant was not found!");
			this.reconnectBeaconWebSocket();
			return;
		}

		const BeaconServiceClient = this.App.createWebSocket('asab-remote-control', `/beacon/${currentTenant}/ws`);
		this.beaconWebSocket = BeaconServiceClient;

		this.beaconWebSocket.onopen = () => {
			// TODO: may be removed
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
			this.distributeData({});
			this.reconnectBeaconWebSocket();
		};

		this.beaconWebSocket.onclose = () => {
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

	// Method for distributing the data into redux store
	distributeData(data) {
		const transformedData = this.transformData(data);
		this.App.Store.dispatch({ type: SET_ATTENTION_REQUIRED_BEACON, beacon: transformedData });
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
}
