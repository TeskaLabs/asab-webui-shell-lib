import React, { Component, Suspense, useEffect } from 'react';
import Axios from 'axios';

import { Module, PubSubProvider, ErrorHandler, AppStoreProvider, createAppStore } from "asab_webui_components";

import Header from './Header';
import Sidebar from './Sidebar';
import Toast from './Toast/ToastContainer.jsx';
import NavbarBrand from './Sidebar/NavbarBrand.js';
import Alerts from './Alerts';
import Navigation from './Navigation';
import Router from './Router';
import Sidepanel from './Sidepanel/Sidepanel.js';

import alertsReducer from './Alerts/reducer';
import sidebarReducer from './Sidebar/reducer';
import headerReducer from './Header/reducer';
import navigationReducer from './Navigation/reducer';
import routerReducer from './Router/reducer';
import fullscreenModeReducer from './FullscreenMode/reducer';
import advancedModeReducer from './AdvancedMode/reducer';

import ReduxService from '../services/ReduxService';
import ConfigService from '../config/ConfigService';
import HeaderService from '../services/HeaderService';
import ThemeService from '../theme/ThemeService';
import BrandingService from '../services/BrandingService';
import TitleService from "../services/TitleService";
import HelpService from "./Header/Help/HelpService";

import AccessDeniedCard from '../modules/tenant/access/AccessDeniedCard';
import ApplicationRouter from './Router/ApplicationRouter';

import SuspenseScreen from '../screens/SuspenseScreen';

import './Application.scss';

import { ADD_ALERT, SET_ADVANCED_MODE, SET_FULLSCREEN_MODE, SET_CONNECTIVITY_STATUS } from '../actions';

class Application extends Component {

	constructor(props) {
		super(props);

		// Create App store with global AppStore variables
		this.AppStore = createAppStore();

		this.Modules = [];
		this.Services = {};

		this.ReduxService = new ReduxService(this, "ReduxService");
		this.ConfigService = new ConfigService(this, "ConfigService");
		this.Config = this.ConfigService.Config;

		// Register reducers which are not part of any app service
		this.ReduxService.addReducer("alerts", alertsReducer);
		this.ReduxService.addReducer("advmode", advancedModeReducer);
		this.ReduxService.addReducer("fullscreenmode", fullscreenModeReducer);
		this.ReduxService.addReducer("header", headerReducer);
		this.ReduxService.addReducer("sidebar", sidebarReducer);
		this.ReduxService.addReducer("navigation", navigationReducer);
		this.ReduxService.addReducer("router", routerReducer);

		this.Router = new Router(this);
		this.Navigation = new Navigation(this);

		this.SplashscreenRequestors = new Set(); // If not empty, the splash screen will be rendered
		this.AxiosInterceptors = new Set();
		this.WebSocketInterceptors = new Set();

		this.HeaderService = new HeaderService(this, "HeaderService");
		this.ThemeService = new ThemeService(this, "ThemeService");
		this.BrandingService = new BrandingService(this, "BrandingService");
		this.TitleService = new TitleService(this, "TitleService");
		this.HelpService = new HelpService(this, "HelpService");

		// The application can provide a list of keys that should be automatically parsed as BigInt, when received from the server in Axios call
		// This is important to preserve 64bit numbers from the server such as IP addresses, timestamps etc.
		this.JSONParseBigInt = new Set(props?.bigint);

		this._handleKeyUp = this._handleKeyUp.bind(this);
		// Clear print-ready timeout handler
		this._clearPrintReadyTimeout = this._clearPrintReadyTimeout.bind(this);
		this._printReadyTimeout = null;

		this.state = {
			networking: 0, // If more than zero, some networking activity is happening
			splashscreenRequestors: 0,
			printReadyIndicators: 0, // If more than zero, some print-ready activity is happening
		}

		// Subscribe and unsubscribe handlers for connectivity detection
		this._initConnectivitySubscription = this._initConnectivitySubscription.bind(this);
		this._unsubscribeConnectivity = null;

		// Subscribe and unsubscribe handlers for print-ready state detection
		this._initPrintReadySubscription = this._initPrintReadySubscription.bind(this);
		this._unsubscribePrintReady = null;

		this.ConfigService.addDefaults(props.configdefaults);

		this.addSplashScreenRequestor(this);
		this.state.splashscreenRequestors = this.SplashscreenRequestors.size;

		var that = this;

		async function modules_init() {
			// Instantiate statically imported modules
			for (var i in props.modules) {

				// The candidate can be:
				//  1. { Module } from "asab_webui_components"
				//  2. A promise that loads the remote module from the federated application
				const modcandidate = props.modules[i];

				let modloaded;
				if (modcandidate.prototype instanceof Module) {
					// This is a Module from "asab_webui_components"
					const mod = new modcandidate(that);
					that.Modules.push(mod);

				} else {
					// This is load of the remote module from a federated application using promise
					try {
						modloaded = await Promise.resolve(modcandidate);
					}
					catch (error) {
						if (error instanceof Error && error.name == 'ScriptExternalLoadError') {
							// The initial load of the remote failed; it is ok in development environment
							console.warn("Failed to load a remote module: ScriptExternalLoadError:", error.message);
						} else {
							console.error(error);
						}
						continue;
					}

					// Sanity check
					if (!modloaded.default.prototype instanceof Module) {
						console.error("The default object from the remote is not a Module - skipping");
						continue; // The load of the remote failed
					}

					const mod = new modloaded.default(that); // We expect 'export default class ...Module extends Module'
					that.Modules.push(mod);
				}

			}

			// Initialize statically imported modules
			for (var i in that.Modules) {
				let ret = that.Modules[i].initialize();

				// Transform result in the promise
				// It unifies synchronous and asynchronous `initialize()` calls
				await Promise.resolve(ret);
			}
		}

		modules_init().then(async function () {

			// Initialize all services
			for (var i in that.Services) {
				let ret = that.Services[i].initialize();

				// Transform result in the promise
				// It unifies synchronous and asynchronous `initialize()` calls
				await Promise.resolve(ret);

			}

			that.removeSplashScreenRequestor(that);
		});

	}


	getServiceURL(service) {
		// Handle if service is unknown => return undefined
		if (service == undefined) {
			console.warn(`Service is undefined!`);
			return undefined;
		}

		// Handle if SERVICES not provided, empty object will be used as default
		let services = this.Config.get('SERVICES') ? this.Config.get('SERVICES') : {};

		// Handle if service is not in SERVICES => use service as service_path
		let service_path = services[service] ? services[service] : service;

		// If service_path is complete URL, then return that URL
		if (service_path.toString().indexOf('http://') !== -1 || service_path.toString().indexOf('https://') !== -1) {
			return service_path;
		}
		// If service_path is complete WebSocket URL, then return that URL
		if (service_path.toString().indexOf('ws://') !== -1 || service_path.toString().indexOf('wss://') !== -1) {
			return service_path;
		}

		// Obtain BASE_URL
		let BASE_URL = undefined;
		if (this.Config.get('BASE_URL') == undefined) {
			// If BASE_URL has not been defined => take browser URL as BASE_URL
			BASE_URL = window.location.protocol + '//' + window.location.host + window.location.pathname.replace(/\/$/, '');
		} else if (this.Config.get('BASE_URL').toString().indexOf('http://') !== -1 || this.Config.get('BASE_URL').toString().indexOf('https://') !== -1) {
			// If BASE_URL has been defined => take defined BASE_URL as BASE_URL
			BASE_URL = this.Config.get('BASE_URL');
		} else {
			// If BASE_URL has been defined but with relative path => take browser URL as BASE_URL and append relative path from BASE_URL behind the browser URL
			let relative_base_url = this.Config.get('BASE_URL');
			// Check if trailing slash has been added on first place of a BASE_URL string and if so, remove it
			if (relative_base_url.indexOf("/", 0) == 0) {
				relative_base_url = relative_base_url.substring(1);
			}
			BASE_URL = window.location.protocol + '//' + window.location.host + window.location.pathname.replace(/\/$/, '') + '/' + relative_base_url.replace(/\/$/, '');
		}

		// Compose service_url
		let service_url = undefined;
		if (this.Config.get('API_PATH') == undefined) {
			// If API_PATH has not been defined => use /api to compose service_url
			service_url = BASE_URL.replace(/\/$/, '') + '/api';
		} else if (this.Config.get('API_PATH').toString().indexOf('http://') !== -1 || this.Config.get('API_PATH').toString().indexOf('https://') !== -1) {
			// If API_PATH has been defined but with absolute URL => use API_PATH as service_url
			service_url = this.Config.get('API_PATH');
		} else {
			// If API_PATH has been defined => use API_PATH to compose service_url
			let api_path = this.Config.get('API_PATH');
			// Check if trailing slash has been added on first place of a API_PATH string and if so, remove it
			if (api_path.indexOf("/", 0) == 0) {
				api_path = api_path.substring(1);
			}
			service_url = BASE_URL.replace(/\/$/, '') + "/" + api_path;
		}

		return service_url.replace(/\/$/, '') + "/" + service_path;
	}


	/*
	 *	Creates an AXIOS object for communication with TeskaLabs API's
	 *
	 *	IMPORTANT NOTE:
	 *		Bearer token will be sent to any URL specified in the API / Services configuration.
	 *		axiosCreate must only be used for creating http sessions
	 *		towards TeskaLabs API's, since it adds Bearer token to all calls.
	 */
	axiosCreate(service, props) {
		var service_url = this.getServiceURL(service);
		if (service_url == undefined) {
			this.addAlert('danger', "ASABApplicationContainer|Service URL is undefined, please check service paths passed to axios", 5, true);
			return undefined;
		}

		var axios = Axios.create({
			...props,
			transformResponse: res => res,  // Disable implicit JSON parsing, we explicitly parse JSON in the interceptor ( https://stackoverflow.com/questions/41013082/disable-json-parsing-in-axios )
			baseURL: service_url,
		});

		// Iterate through custom interceptors
		for (let interceptor of this.AxiosInterceptors.keys()) {
			this.interceptorRequest(axios, interceptor);
		}

		var that = this;

		/*
			We want to be notified when networking activity is taking place,
			thus we use pushNetworkingIndicator.

			Default request headers are X-App and X-Request-Id which
			define recognition of the requests from the service perspective
		*/
		axios.interceptors.request.use(function (config) {
			/* Usage of networking indicator is optional and can be set as following among other headers:
				headers: { 'X-Networking-Indicator': 'off' }
			*/
			const networkingIndicatorOff = config?.headers?.['X-Networking-Indicator'] === 'off';
			// Store flag in config for response interceptors to access
			config._networkingIndicatorOff = networkingIndicatorOff;
			if (!networkingIndicatorOff) {
				that.pushNetworkingIndicator();
			}
			that.pushPrintReadyIndicator();
			// Remove the X-Networking-Indicator header before sending to service (its only for internal use)
			delete config?.headers?.['X-Networking-Indicator'];
			config.headers['X-App'] = "webui"; // Include X-App header in every axios API request
			config.headers['X-Request-Id'] = that._generateUID(); // Include X-Request-Id header in every axios API request
			return config;
		}, function (error) {
			return Promise.reject(error);
		});

		// We want to remove the networking indicator when we receive the response
		axios.interceptors.response.use(function (response) {
			// Call the `popNetworkingIndicator` method to remove the networking indicator (e.g., loading spinner)
			if (!response.config._networkingIndicatorOff) {
				that.popNetworkingIndicator();
			}
			that.popPrintReadyIndicator();
			/*
				Custom flag to control JSON parsing for specific requests.
				If 'skipJsonParsing' is set to true in the request config,
				we return the raw response and skip automatic JSON parsing in the interceptor.
				This is useful when we need to get the response as plain text (e.g., for retrieving raw content).
			*/
			if (response.config.skipJsonParsing) {
				return response;
			}

			// Check if the response content type is 'application/json' or starts with 'application/json'
			if (response?.headers['content-type']?.startsWith('application/json')) {
				// If the response is JSON, then parse it with respect to BigInt
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
				try {
					// Parse the response data using a custom reviver function
					response.data = JSON.parse(
						response.data,
						// Custom reviver function to handle BigInt values
						(key, value, context) => {
							// If there is no data in the JSONParseBigInt, return the value immediately
							if (that.JSONParseBigInt.size === 0) {
								return value
							}
							// Check if the key is in the `JSONParseBigInt` set and the value is a number
							if (that.JSONParseBigInt.has(key) && (typeof value === 'number')) {
								// Convert the number to a BigInt
								return BigInt(context.source);
							}
							// Return the original value if no conversion is needed
							return value;
						}
					);
				} catch (e) {
					// Log any errors that occur during JSON parsing
					console.error("Error in axios.interceptors.response", e);
				}
			}
			// If the request was satisfied (application/json and presence of BigInt) return the modified object. If not, we return unchanged object
			return response;
		}, function (error) {
			if (!error.config?._networkingIndicatorOff) {
				that.popNetworkingIndicator();
			}
			that.popPrintReadyIndicator();
			const contentType = error?.response?.headers?.['content-type'];
			// Check if the response content type is 'application/json' and data is a string
			if (contentType?.startsWith('application/json') && (typeof error?.response?.data === 'string')) {
				try {
					error.response.data = JSON.parse(error.response.data);
				} catch (e) {
					console.error("Error parsing error of the error body:", e);
				}
			}

			return Promise.reject(error);
		});

		return axios;
	}

	// Internal method for generating random UID's
	_generateUID() {
		/*
			- Math.random() * 0x100000000: Generates a random floating-point number between 0 and 0x100000000.
			- >>> 0: Applies a bitwise unsigned right shift by 0, effectively converting the floating-point number to a 32-bit unsigned integer.
			- toString(36): Converts the integer to a base-36 string, using the digits 0-9 and letters a-z.
		*/
		return(
			(Math.random() * 0x100000000 >>> 0).toString(36) +
			(Math.random() * 0x100000000 >>> 0).toString(36) +
			(Math.random() * 0x100000000 >>> 0).toString(36) +
			(Math.random() * 0x100000000 >>> 0).toString(36)
		)
	};


	interceptorRequest(axios, interceptor) {
		// Add a request interceptor
		axios.interceptors.request.use(
			interceptor,
			function (error) {
				return Promise.reject(error)
			});
	}


	addAxiosInterceptor(interceptor) {
		this.AxiosInterceptors.add(interceptor);
	}


	removeAxiosInterceptor(interceptor) {
		this.AxiosInterceptors.delete(interceptor);
	}


	addWebSocketInterceptor(interceptor) {
		this.WebSocketInterceptors.add(interceptor);
	}

	removeWebSocketInterceptor(interceptor) {
		this.WebSocketInterceptors.delete(interceptor);
	}


	getWebSocketURL(service, subpath) {
		// Handle if service is unknown => return undefined
		var service_url = this.getServiceURL(service);
		if (service_url == undefined) {
			return undefined
		}

		// Handle if subpath is unknown => subpath = ""
		if (subpath == undefined) {
			subpath = "";
		}

		// If service_path is complete WebSocket URL, then return that URL
		if (service_url.toString().indexOf('ws://') !== -1 || service_url.toString().indexOf('wss://') !== -1) {
			return service_url;
		}

		// Replace http:// or https:// protocol with ws:// or wss://
		let ws_service_url = service_url.replace(/(http)(s)?\:\/\//, "ws$2://");

		return ws_service_url + subpath;

	}


	createWebSocket(service, subpath) {
		var socket_url = this.getWebSocketURL(service, subpath);
		if (socket_url == undefined) {
			this.addAlert('danger', "ASABApplicationContainer|WebSocket URL is undefined, please check service and subpath passed to WebSocket", 5, true);
			return undefined;
		}

		/*
			Adding ws interceptors to the ws subprotocols (e.g. to pass auth token).

			"asab" subprotocol is given by default for consumer (any websocket service)
			which require this particular value to authenticate websocket connection,
			since some browsers (Chrome, Safari, ...) requires Sec-Websocket-Accept
			response header.

			Another default subprotocols are "app_webui" and "request_id_<uid>"
			which define recognition of the requests from the service perspective
		*/
		let subprotocols = ["asab", "app_webui", `request_id_${this._generateUID()}`];
		for (let interceptor of this.WebSocketInterceptors.keys()) {
			// Avoid pushing undefined interceptor values
			if (interceptor) {
				subprotocols.push(interceptor);
			}
		}

		// Create new WebSocket based on socket URL
		const socket = new WebSocket(socket_url, subprotocols);

		return socket;
	}


	// Display and hide networking indicator
	pushNetworkingIndicator() {
		this.setState((prevState, props) => ({
			networking: prevState.networking + 1,
		}));
	}

	popNetworkingIndicator() {
		this.setState((prevState, props) => ({
			networking: prevState.networking - 1,
		}));
	}

	// Display and hide print-ready indication
	pushPrintReadyIndicator() {
		this.setState((prevState) => ({
			printReadyIndicators: prevState.printReadyIndicators + 1,
		}));
	}

	popPrintReadyIndicator() {
		this.setState((prevState) => {
			const nextValue = prevState.printReadyIndicators - 1;
			if (nextValue < 0) {
				console.warn('printReadyIndicators would go negative, setting its value to 0. The value was:', nextValue);
			}
			return {
				printReadyIndicators: Math.max(nextValue, 0),
			};
		});
	}

	registerService(service) {
		if (service.Name in this.Services) {
			console.warn(`Service ${service.Name} is already registered.`);
			return;
		}
		this.Services[service.Name] = service;
	}

	locateService(name) {
		if (!name in this.Services) {
			console.warn(`Service ${name} doesn't exist.`);
			return null;
		}
		return this.Services[name];
	}


	// This function handles keystroke events and performs enabling/disabling of mods
	_handleKeyUp(event) {
		// CTRL+SHIFT+F enables the fullscreen mode
		if (event.ctrlKey && event.shiftKey && event.code === 'KeyF') {
			this.setFullScreenMode('on');
		}

		// CTRL+Q (Windows) or CTRL+1 (Linux) enables the advanced mode
		if ((event.ctrlKey && event.code === 'KeyQ') || (event.code === 'Digit1' && event.ctrlKey)) {
			this.setAdvancedMode(0);
		}

	}

	componentDidMount() {
		document.addEventListener("keyup", this._handleKeyUp, false);

		// Subscribe to Application.status! once PubSub is available
		this._initConnectivitySubscription();
		// Subscribe to print-ready indication subscription if PubSub is available
		this._initPrintReadySubscription();
		// Add print-landscape class to body if not present
		if (!document.body.classList.contains('print-landscape')) {
			document.body.classList.add('print-landscape');
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.printReadyIndicators === this.state.printReadyIndicators) {
			return;
		}

		// Setting a print-ready attribute to the body of the application element
		if (this.state.printReadyIndicators === 0) {
			this._clearPrintReadyTimeout();
			this._printReadyTimeout = setTimeout(() => {
				if (this.state.printReadyIndicators === 0) {
					document.body.setAttribute('print-ready', 'true');
					this._printReadyTimeout = null;
				}
			}, 500); // Add 500ms delay to ensure that the print-ready attribute is set after the last print-ready indicator is popped
		} else {
			this._clearPrintReadyTimeout();
			document.body.setAttribute('print-ready', 'false');
		}
	}

	componentWillUnmount() {
		document.removeEventListener("keyup", this._handleKeyUp, false);

		// Unsubscribe from Application.status! PubSub
		if (this._unsubscribeConnectivity) {
			this._unsubscribeConnectivity();
			this._unsubscribeConnectivity = null;
		}

		if (this._unsubscribePrintReady) {
			this._unsubscribePrintReady();
			this._unsubscribePrintReady = null;
		}

		this._clearPrintReadyTimeout();
		document.body.removeAttribute('print-ready');
	}

	_clearPrintReadyTimeout() {
		if (this._printReadyTimeout !== null) {
			clearTimeout(this._printReadyTimeout);
			this._printReadyTimeout = null;
		}
	}

	// Splash screen

	addSplashScreenRequestor(obj) {
		const origLen = this.SplashscreenRequestors.size;
		this.SplashscreenRequestors.add(obj);
		if (origLen != this.SplashscreenRequestors.size) {
			// Set print-ready indicator if no splash screen requestors are present
			if (origLen == 0) {
				this.pushPrintReadyIndicator();
			}
			this.state.splashscreenRequestors = this.SplashscreenRequestors.size;
		}
		let splashscreen = document.getElementById('app-splashscreen'); // See public/index.html`
		splashscreen?.classList.remove("d-none");
	}

	removeSplashScreenRequestor(obj) {
		const origLen = this.SplashscreenRequestors.size;
		this.SplashscreenRequestors.delete(obj);
		if (origLen != this.SplashscreenRequestors.size) {
			this.setState({
				splashscreenRequestors: this.SplashscreenRequestors.size
			});
		}
		if (this.SplashscreenRequestors.size == 0) {
			let splashscreen = document.getElementById('app-splashscreen'); // See public/index.html
			splashscreen?.classList.add("d-none");
			// Remove print-ready indicator if no splash screen requestors are present
			this.popPrintReadyIndicator();
		}
	}


	// Alerts
	/*
		levels:
		* danger
		* warning
		* info
		* success
	*/
	addAlert(level, message, expire = 5, shouldBeTranslated = false, component = null) {
		this.AppStore.dispatch?.({
			type: ADD_ALERT,
			level: level,
			message: message,
			expire: expire,
			shouldBeTranslated: shouldBeTranslated,
			component: component,
		});
	}

	/*
		Alert from exception suppose to be used ONLY for exception cases.
		By default it requires:

			- exception - this is comming from the try{...}catch(exception){...} . It is important to pass the whole exception.
			- message - this is the custom message written by developer based on the situation

		Additional options are:

			- expire - expiration of the aler (by default set to 30s)
			- shouldBeTranslated - boolean for cases where is not possible to use useTranslation hook (by default false)
			- component - option to pass additional component of the alert message e.g. button (by default null)

		addAlertFromException will always use "danger" color as its background and the full exception will be printed into the console
	*/
	addAlertFromException(exception, message, expire = 30, shouldBeTranslated = false, component = null) {
		console.error(exception); // Log the whole exception in the browser
		let exceptionMessage = <span>{message}</span>;
		/*
			If the exception has an error_dict in the response data (error in the new format),
			the ErrorHandler component is used to display the error,
			along with the exception message in the form-text class.
		*/
		if (exception?.response?.data?.error_dict) {
			exceptionMessage = <><ErrorHandler error={exception.response.data} />{exception?.message && <div className="form-text">{exception.message}</div>}</>;
		} else {
			/*
				Capture the cases when service returns a message in the exception response data.
				Add hoc messages are displayed in form-text class on the new line
			*/
			if (exception?.response?.data?.message) {
				exceptionMessage = <><h5>{exceptionMessage}</h5><div className="mt-2" style={{whiteSpace: 'pre-wrap'}}>{exception.response.data.message}</div></>;
			} else {
				// Exception message is always present in the exception
				exceptionMessage = <><h5>{exceptionMessage}</h5>{exception?.message && <div className="mt-2">{exception.message}</div>}</>;
			}
		}
		this.AppStore.dispatch?.({
			type: ADD_ALERT,
			level: "danger",
			message: exceptionMessage,
			expire: expire,
			shouldBeTranslated: shouldBeTranslated,
			component: component,
		});
	}


	setAdvancedMode(enabled) {
		if (enabled === 0) {
			const state = this.AppStore.getState();
			enabled = !state?.advmode?.enabled;
		}
		this.AppStore.dispatch?.({
			type: SET_ADVANCED_MODE,
			enabled: enabled
		});
		if (enabled) {
			this.addAlert('warning', "ASABApplicationContainer|Advanced mode enabled", 1, true);
		} else {
			this.addAlert('success', "ASABApplicationContainer|Advanced mode disabled", 1, true);
		}
	}

	/*
		This method toggles the full-screen mode of the application container.
		It takes a parameter called "status" to indicate whether to turn the full-screen mode on or off.
	*/
	setFullScreenMode(status) {
		const state = this.AppStore.getState();
		if (status === 'on' && (state?.fullscreenmode?.status === 'on')) {
			status = 'off';
		}
		this.AppStore.dispatch?.({
			type: SET_FULLSCREEN_MODE,
			status: status
		});
		if (status === 'on') {
			document.body.classList.add('fullscreen');
			this.addAlert('info', 'ASABApplicationContainer|Fullscreen mode turned on. To turn it off, press CTRL + SHIFT + F.', 30, true);
		} else {
			document.body.classList.remove('fullscreen');
			this.addAlert('info', 'ASABApplicationContainer|Fullscreen mode turned off', 30, true);
		}
	}

	render() {

	if (this.state.splashscreenRequestors > 0) return (
		// When splashscreenRequestors is requested, the application is not rendered.
		// This prevents race conditions during application init time.
		<AppStoreProvider app={this}>
		<PubSubProvider app={this}>
			<Suspense fallback={<div></div>}>
				<Alerts app={this} />
				<main id="app-main">
					<AccessDeniedCard app={this} />
				</main>
			</Suspense>
		</PubSubProvider>
		</AppStoreProvider>
	);

	return (
		<AppStoreProvider app={this}>
		<PubSubProvider app={this}>
			<Suspense fallback={<div></div>}>
				<div id="app-networking-indicator" className={"progress-bar progress-bar-animated progress-bar-striped" + ((this.state.networking == 0) ? " transparent" : "")} ></div>
				<Alerts app={this} />
				<NavbarBrand app={this} />
				<Sidebar app={this} />
				<Toast app={this} />
				<Header app={this} />
				<main id="app-main">
					<Suspense fallback={<SuspenseScreen app={this} />} /*The suspense that captures lazy loading of the federated apps*/>
						<ApplicationRouter app={this} />
					</Suspense>
				</main>
				<Sidepanel app={this} />
			</Suspense>
		</PubSubProvider>
		</AppStoreProvider>
	); }

}

/*
	On Application initialization, initialize subscription to Application.status!
	once PubSub is assigned by PubSubProvider
*/
Application.prototype._initConnectivitySubscription = function () {
	if (this.PubSub && typeof this.PubSub.subscribe === 'function') {
		if (!this._unsubscribeConnectivity) {
			this._unsubscribeConnectivity = this.PubSub.subscribe('Application.status!', (value) => {
				// Prefer store so UI updates predictably
				this.AppStore.dispatch?.({
					type: SET_CONNECTIVITY_STATUS,
					status: value.status,
				});
			});
		}
		return;
	}
	/*
		This is a safety precaution which retry initialization, PubSubProvider may assigns app.PubSub
		in its useEffect after first render (however we use useLayoutEffect there, so it should not be an issue).
	*/
	setTimeout(this._initConnectivitySubscription, 0);
};


/*
	On Application initialization, initialize subscription to echart.fetchData!, echart.frame.end! and echart.error!
	once PubSub is assigned by PubSubProvider.
	This subscription serves the purpose of indicating the print-ready state of the application.
*/
Application.prototype._initPrintReadySubscription = function () {
	if (this.PubSub && typeof this.PubSub.subscribe === 'function') {
		if (!this._unsubscribePrintReady) {
			const unsubscribeStart = this.PubSub.subscribe('echart.fetchData!', () => this.pushPrintReadyIndicator());
			const unsubscribeEnd = this.PubSub.subscribe('echart.frame.end!', () => this.popPrintReadyIndicator());
			const unsubscribeError = this.PubSub.subscribe('echart.error!', () => this.popPrintReadyIndicator());
			this._unsubscribePrintReady = () => {
				unsubscribeStart?.();
				unsubscribeEnd?.();
				unsubscribeError?.();
			};
		}
		return;
	}
	/*
		This is a safety precaution which retry initialization, PubSubProvider may assigns app.PubSub
		in its useEffect after first render (however we use useLayoutEffect there, so it should not be an issue).
	*/
	setTimeout(this._initPrintReadySubscription, 0);
};

export default Application;
