import React, { lazy } from 'react';
import { Module, registerReducer } from 'asab_webui_components';

import { AuthHeaderDropdown, AuthHeaderInvitation } from './header';
import reducer from './reducer';
import { types } from './actions';
import { SET_NAVIGATION_ITEMS } from '../../actions';
import { SeaCatAuthApi } from './api';
import { locationReplace } from '../../components/locationReplace';

// TODO: Use SessionExpirationAlert only after proper fix of the component
import { SessionExpirationAlert }from './components/SessionExpirationAlert';
const AccessControlScreen = lazy(() => import('./screens/AccessControlScreen'));
const InvitationScreen = lazy(() => import('./screens/InvitationScreen'));

export default class AuthModule extends Module {

	constructor(app, name) {
		super(app, "AuthModule");

		this.OAuthTokens = JSON.parse(sessionStorage.getItem('SeaCatOAuth2Tokens'));
		this.UserInfo = null;
		this.Api = new SeaCatAuthApi(app);
		this.RedirectURL = window.location.href;
		this.MustAuthenticate = true; // Setting this to false means, that we can operate without authenticated user
		registerReducer("auth", reducer);
		this.App.addSplashScreenRequestor(this);
		this.Authorization = this.App.Config.get("authorization"); // Get authorization settings from configuration

		this.SessionExpiration = null; // Session expiration as defined in user info
		this.sessionValidationInterval = null; // Initialize session validation interval

		// Access control screen
		app.Router.addRoute({
			path: '/auth/access-control',
			end: true,
			name: 'Access control',
			component: AccessControlScreen,
			resource: "*"
		});

		// Invitation screen
		app.Router.addRoute({
			path: '/auth/invite',
			end: true,
			name: 'Invite',
			component: InvitationScreen,
			resource: "seacat:tenant:assign"
		});
	}

	async initialize() {
		const headerService = this.App.locateService("HeaderService");
		headerService.addComponent({
			component: AuthHeaderInvitation,
			componentProps: { AuthModule: this },
			order: 200
		});
		headerService.addComponent({
			component: AuthHeaderDropdown,
			componentProps: { AuthModule: this },
			order: 700
		});

		if (typeof MOCK_USERINFO !== 'undefined') {
			/* This section is only for DEV purposes! */
			await this.simulateUserinfo(MOCK_USERINFO);
			/* End of DEV section */
		} else {
			// Check the query string for 'code'
			var qs = new URLSearchParams(window.location.search);
			const authorization_code = qs.get('code');

			// Checking error type in params
			const errorType = qs.get('error');
			if ((errorType != undefined) && (errorType != 'tenant_access_denied')) {
				/*
					If error appears in the URL search params and is NOT
					tenant_access_denied, user will stay in splashscreen
					with Access denied card
				*/
				return;
			}

			if (authorization_code !== null) {
				await this._exchangeCodeForTokens(authorization_code);
				// Remove 'code' from a query string
				qs.delete('code');

				const stateIndex = qs.get("state");
				let state = "";
				// Check if stateIndex is present, eventually return empty state string
				if (stateIndex != undefined) {
					// Check if oauth2_state_ is present, eventually return empty string
					if (localStorage.getItem(`oauth2_state_${stateIndex}`) != undefined) {
						state = localStorage.getItem(`oauth2_state_${stateIndex}`);
					}
				}
				localStorage.removeItem(`oauth2_state_${stateIndex}`);

				// Remove 'state' from a query string
				qs.delete("state");

				// Construct the new URL without `code` in the query string
				// For this case, condition on empty qs string is sufficient and tested
				let reloadUrl;
				if (qs.toString() == '') {
					// Remove `?` part from URL completely, if empty
					reloadUrl = window.location.pathname + state; // part form localstorage instead of hash
				} else {
					reloadUrl = window.location.pathname + '?' + qs.toString() + state; // part form localstorage instead of hash
				}

				// Reload the app with `code` removed
				await locationReplace(reloadUrl);
			}

			// Do we have an oauth token (we are authorized to use the app)
			if (this.OAuthTokens != null) {
				// Update the user info
				let result = await this.updateUserInfo();
				if (!result) {
					// User info not found - go to login
					sessionStorage.removeItem('SeaCatOAuth2Tokens');
					let force_login_prompt = true;
					await this.Api.login(this.RedirectURL, force_login_prompt);
					return;
				}

				// Add interceptor with Bearer token in the Header into axios calls
				this.App.addAxiosInterceptor(this.authInterceptor());
				// Add webSocket interceptor with Bearer token into websocket calls
				this.App.addWebSocketInterceptor(this.webSocketAuthInterceptor());


				// Authorization of the user based on tenant access
				if (this.App.Config.get("authorization") !== "disabled" && this.App.Services.TenantService) {
					// Tenant access validation
					let tenantAuthorized = this.validateTenant();
					if (!tenantAuthorized) {
						// If tenant not authorized, redirect to Access denied card
						let force_login_prompt = false;
						await this.Api.login(this.RedirectURL, force_login_prompt);
						return;
					}
				}

				// Validate resources of items and children in navigation (resource validation depends on tenant)
				if (this.App.AppStore && this.App.Services.TenantService && (this.UserInfo !== null)) {
					let currentTenant = this.App.Services.TenantService.getCurrentTenant();
					let resources = this.UserInfo.resources ? this.UserInfo.resources[currentTenant] : [];
					/*
						When switching between tenants,
						we need to force authorization to obtain
						correct data (resources) for particular
						tenant (this is unavailable until auth token is updated)
					*/
					if (resources == undefined) {
						let force_login_prompt = false;
						await this.Api.login(this.RedirectURL, force_login_prompt);
						return;
					}

					this.App.AppStore.dispatch?.({ type: types.AUTH_RESOURCES, resources: resources });
					await this.validateNavigation({resources});
				}

				if (this.UserInfo != null) {
					await this._startSessionExpirationValidation(); // Start session validation
				}
			}

			if ((this.UserInfo == null) && (this.MustAuthenticate)) {
				// TODO: force_login_prompt = true to break authentication failure loop
				let force_login_prompt = false;
				await this.Api.login(this.RedirectURL, force_login_prompt);
				return;
			}
		}

		this.App.removeSplashScreenRequestor(this);
	}

	authInterceptor() {
		const interceptor = config => {
			config.headers['Authorization'] = 'Bearer ' + this.OAuthTokens['access_token'];
			return config;
		}
		return interceptor;
	}

	webSocketAuthInterceptor() {
		return `access_token_${this.OAuthTokens['access_token']}`;
	}

	async simulateUserinfo(mock_userinfo) {
		/*
			This method takes parameters from wepack.dev.js settings

			plugins: [
				...
				new webpack.DefinePlugin({
					'MOCK_USERINFO': JSON.stringify({  // Inject mocked UserInfo object, this means the application will NOT require user authorization
						"username": "johndev",
						"email": "dev@dev.de",
						"phone": "123456789",
						"resources": ["authz:superuser"],
						"roles": ["default/Admin"],
						"sub": "devdb:dev:1abc2def3456",
						"tenants": ["default"]
					})
				}),
				...
			],

		*/
		this.App.addAlert("warning", "ASABAuthModule|You are using MOCK_USERINFO!", 1, true);
		let mockParams = mock_userinfo;
		if (mockParams.resources) {
			mockParams["resources"] = Object.values(mockParams.resources)
		}
		if (mockParams.roles) {
			mockParams["roles"] = Object.values(mockParams.roles)
		}
		if (mockParams.tenants) {
			mockParams["tenants"] = Object.values(mockParams.tenants)
		}

		if (this.App.AppStore) {
			this.App.AppStore.dispatch?.({ type: types.AUTH_USERINFO, payload: mockParams });
			this.App.AppStore.dispatch?.({ type: types.AUTH_RESOURCES, resources: mockParams["resources"] });
		}

		/** Check for TenantService and pass tenants list obtained from userinfo */
		let availableTenants = mockParams.tenants;
		if (this.App.Services.TenantService) {
			await this.App.Services.TenantService.setTenants(availableTenants, this._getAuthorizedTenant(mockParams));
		}
	}

	logout() {
		this.App.addSplashScreenRequestor(this);

		this._stopSessionExpirationValidation(); // Stop session validation and clear the timeout

		sessionStorage.removeItem('SeaCatOAuth2Tokens');
		const promise = this.Api.logout(this.OAuthTokens['access_token'])
		if (promise == null) {
			window.location.reload();
		}

		promise.then(response => {
			window.location.reload();
		}).catch((error) => {
			window.location.reload();
		});
	}

	// TODO: reconsider removing async/await with promise
	async validateNavigation({resources}) {
		const state = this.App.AppStore.state;
		let navItems = state.navigation?.navItems;
		let authorizedNavItems = [];
		navItems && await Promise.all(navItems.map(async (itm, idx) => {
			if (resources.indexOf('authz:superuser') !== -1) {
				// If user is superuser, validate every navigation item
				authorizedNavItems.push(itm);
			} else {
				if (itm.resource) {
					if (itm.children) {
						itm.children = await this._validateChildrenNav(itm, resources);
					}
					// Item validation
					let access_auth = this._validateItemNav(itm.resource, resources);
					if (access_auth == true) {
						authorizedNavItems.push(itm);
					}
				} else {
					if (itm.children) {
						itm.children = await this._validateChildrenNav(itm, resources);
						if (itm.children.length > 0) {
							authorizedNavItems.push(itm);
						}
					}
				}
			}
		}))

		this.App.AppStore.dispatch?.({ type: SET_NAVIGATION_ITEMS, navItems: authorizedNavItems });
	}

	// Validate sidebar's item children
	async _validateChildrenNav(itm, resources) {
		// Item's children validation
		let authorizedNavChildren = [];
		await Promise.all(itm.children.map(async (child, id) => {
			if (child.resource) {
				let access_auth = this._validateItemNav(child.resource, resources);
				if (access_auth == true) {
					authorizedNavChildren.push(child);
				}
			}
		}))
		return authorizedNavChildren;
	}

	// Validate sidebar items
	_validateItemNav(resource, resources) {
		let valid = resources ? resources.indexOf(resource) !== -1 : false;
		// If user is superuser, then item is enabled
		if (resources.indexOf('authz:superuser') !== -1) {
			valid = true;
		}
		return valid;
	}

	// Validate tenant access
	validateTenant() {
		let resources = [];
		let tenants = [];
		let currentTenant = this.App.Services.TenantService.getCurrentTenant();
		if (this.UserInfo !== null) {
			resources = this.UserInfo.resources ? this.UserInfo.resources[currentTenant] : [];
			tenants = this.UserInfo.tenants ? this.UserInfo.tenants : [];
		}
		let valid = tenants ? tenants.indexOf(currentTenant) !== -1 : false;
		// If user is superuser, then tenant access is granted
		if ((resources) && (resources.indexOf('authz:superuser') !== -1)) {
			valid = true;
		}
		return valid;
	}

	async updateUserInfo() {
		let response;
		try {
			response = await this.Api.userinfo(this.OAuthTokens.access_token);
		}
		catch (err) {
			console.error("Failed to update user info", err);
			this.UserInfo = null;
			if (this.App.AppStore) {
				this.App.AppStore.dispatch?.({ type: types.AUTH_USERINFO, payload: this.UserInfo });
			}
			return false;
		}

		this.UserInfo = response.data;
		this.SessionExpiration = response.data?.exp;
		if (this.App.AppStore) {
			this.App.AppStore.dispatch?.({ type: types.AUTH_USERINFO, payload: this.UserInfo });
		}

		/** Check for TenantService and pass tenants list obtained from userinfo */
		let availableTenants = this.UserInfo.tenants;
		if (this.App.Services.TenantService) {
			await this.App.Services.TenantService.setTenants(availableTenants, this._getAuthorizedTenant(this.UserInfo));
		}

		return true;
	}

	// Method for obtaining and storing the OAuth tokens based on authorization code
	async _exchangeCodeForTokens(authorization_code) {
		try {
			const response = await this.Api.token_authorization_code(authorization_code, this.RedirectURL);
			this.OAuthTokens = response.data;
			sessionStorage.setItem('SeaCatOAuth2Tokens', JSON.stringify(response.data));
			return true;
		}
		catch (err) {
			console.error("Failed to update token", err);
			return false;
		}
	}

	// Method for refreshing OAuth tokens
	async _refreshTokens() {
		// If no refresh_token found, return false
		if (!this.OAuthTokens?.refresh_token) {
			return false;
		}

		try {
			const response = await this.Api.token_refresh(this.OAuthTokens.refresh_token);
			this.OAuthTokens = response.data;
			sessionStorage.setItem('SeaCatOAuth2Tokens', JSON.stringify(response.data));
			return true;
		}
		catch (err) {
			console.error("Failed to refresh token", err);
			return false;
		}
	}

	_getAuthorizedTenant(userInfo) {
		/*
			Return the authorized tenant ID from userinfo. 
			Pick the first one if there are multiple tenants.
		*/
		if (userInfo?.resources) {
			for (let tenantId in userInfo.resources) {
				if (tenantId != '*' && userInfo.resources.hasOwnProperty(tenantId)) {
					return tenantId
				}
			}
		} else {
			return undefined;
		}
	}

	// Loop validating session expiration
	async _startSessionExpirationValidation() {
		if (!this.SessionExpiration) {
			console.warn("Session expiration is not set.");
			return;
		}

		// Max session duration
		const MAX_SESSION_DURATION = Math.pow(2, 31) - 1;

		// Proactivelly validate session expiration
		let lastKnownExpiration = this.SessionExpiration; // Last known session expiration
		let sessionStartTime = Date.now() / 1000; // Session start time
		let sessionDuration = lastKnownExpiration - sessionStartTime; // Session duration
		// Prevent glitches on very large time remaining values
		if (sessionDuration > MAX_SESSION_DURATION) {
			// Set timeout to maximum allowed value
			sessionDuration = MAX_SESSION_DURATION;
		}
		let sessionMidpoint = sessionStartTime + sessionDuration / 2; // Session midpoint value
		let refreshSessionDone = false; // Tracks if the session has been proactivelly refreshed
		let warningDisplayed = false; // Tracks if the "about to expire" warning has been shown

		const validateSession = async () => {
			const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
			let timeRemaining = this.SessionExpiration - currentTime; // Time difference for triggering "about to expire" warning
			// Prevent glitches on very large time remaining values
			if (timeRemaining > MAX_SESSION_DURATION) {
				// Set timeout to maximum allowed value
				timeRemaining = MAX_SESSION_DURATION;
			}

			// Validate session on half of the session expiration or if the remaining time is <= 5min
			if (!refreshSessionDone && ((timeRemaining <= 300) || (currentTime >= sessionMidpoint))) {
				refreshSessionDone = true;
				const tokensRefreshed = await this._refreshTokens();
				// Recalculate if session expiration was extended
				if (tokensRefreshed) {
					await this.updateUserInfo(); // Update userinfo
					// If current session expiration differs from last known expiration, recalculate session variables
					if (this.SessionExpiration !== lastKnownExpiration) {
						lastKnownExpiration = this.SessionExpiration;
						sessionStartTime = currentTime;
						sessionDuration = lastKnownExpiration - sessionStartTime;
						// Prevent glitches on very large time remaining values
						if (sessionDuration > MAX_SESSION_DURATION) {
							// Set timeout to maximum allowed value
							sessionDuration = MAX_SESSION_DURATION;
						}
						sessionMidpoint = sessionStartTime + sessionDuration / 2;
						refreshSessionDone = false;
					}
				}
			}

			// If remaining time is between 1 and 60s, repetitivelly ask for userInfo and trigger "about to expire" warning
			if ((timeRemaining <= 60) && (timeRemaining > 0)) {
				const tokensRefreshed = await this._refreshTokens(); // Returns true/false if token is refreshed/not refreshed
				await this.updateUserInfo(); // Continue updating user info
				if (!tokensRefreshed && !warningDisplayed) {
					this.App.addAlert("info", "General|Your session will expire soon", 30, true);
					warningDisplayed = true; // Mark the warning as displayed
				}
			}

			// Validation on expired session
			if (this.SessionExpiration <= currentTime) {
				// Handle refresh token prior updating user info
				await this._refreshTokens();
				// Handle session expiration
				const isUserInfoUpdated = await this.updateUserInfo();
				if (!isUserInfoUpdated) {
					// Stop further checks
					clearTimeout(this.sessionValidationInterval);
					this.sessionValidationInterval = null;
					this.App.addAlert("info", "ASABAuthModule|Your session has expired.", 3600 * 1000, true, (alert) => <SessionExpirationAlert alert={alert} />);
					// Disable UI elements
					if (this.App.AppStore) {
						this.App.AppStore.dispatch?.({ type: types.AUTH_SESSION_EXPIRATION, sessionExpired: true });

						// Disable UI elements
						[...document.querySelectorAll('#app-sidebar .nav-link, [class^="btn"]:not(.alert-button), [class*=" btn"]:not(.alert-button), .btn-group a, .page-item, input, select')].forEach(i => {
							i.classList.add("disabled");
							i.setAttribute("disabled", "");
						});

						// Reload on navigation actions
						window.addEventListener("popstate", () => {
							window.location.reload();
						});
					}
					return;
				}
			}

			// Re-trigger validation after 10 seconds
			this.sessionValidationInterval = setTimeout(validateSession, 10000);
		};

		// Start the first validation cycle
		validateSession();
	}

	// Stop looping on session expiration validation
	_stopSessionExpirationValidation() {
		if (this.sessionValidationInterval) {
			clearInterval(this.sessionValidationInterval);
			this.sessionValidationInterval = null;
		}
	}

}
