import { Service } from 'asab_webui_components';
import { types } from './actions';
import { locationReplace } from '../../components/locationReplace';

export default class TenantService extends Service {

	constructor(app, name = 'TenantService') {
		super(app, name);
		// Tenant data cache
		this.TenantDataCache = {};
	}

	async initialize() {

		// If the tenant list is in the configuration, use it
		// This is useful when tenants are present but auth not
		var tenants = this.App.Config.get('tenants');
		if (tenants != null) {
			var tenants_list = [];
			for (var i = 0; tenants[i] != undefined; i++) {
				tenants_list.push(tenants[i]);
			}
			await this.setTenants(tenants_list);
		}
	}

	/*
		setTenants updates the current active tenant and the list of available tenants
		and dispatches that information into the application store
	*/
	async setTenants(availableTenants, authorizedTenant = undefined) {
		// Extract the current tenant from URL params
		var tenantFromUrl = this._extractTenantFromUrl();

		/* If tenant has not been provided in access URL, insert the authorized tenant 
		or the first available tenant into the URL and reload the application */
		if (tenantFromUrl == null) {
			if (authorizedTenant) {
				await locationReplace(`${window.location.pathname}?tenant=${authorizedTenant}${window.location.hash}`);
				return;
			} else if ((availableTenants) && (availableTenants.length > 0)) {
				await locationReplace(`${window.location.pathname}?tenant=${availableTenants[0]}${window.location.hash}`);
				return;
			}
		} 

		// In case the list of available tenants is empty or undefined, remove the tenant parameter from URL
		if ((!availableTenants) || (availableTenants.length == 0)) {
			await locationReplace(window.location.pathname + window.location.hash);
			return;
		}

		// Check if the tenant from URL is in the list of avaliable tenants
		let currentTenant;
		if (availableTenants) {
			if (!availableTenants.includes(tenantFromUrl)) {
				// Display Invalid tenant alert message only when authorization is disabled
				if (this.App.Config.get('authorization') === 'disabled') {
					this.App.addAlert('danger', 'ASABTenantModule|Invalid tenant', 40000, true);
				}
			}
			currentTenant = tenantFromUrl;
			// Sort available tenants
			availableTenants.sort((a, b) =>{
				const tenantA = a?.toString()?.toLowerCase() || '';
				const tenantB = b?.toString()?.toLowerCase() || '';
				return tenantA.localeCompare(tenantB);
			});
		} else {
			currentTenant = undefined;
		}

		// Dispatch tenants obtained from userinfo
		this.App?.AppStore?.dispatch?.({
			type: types.TENANTS_CHANGED,
			tenants_list: availableTenants,
			current: currentTenant
		});

	}

	/*
		getTenantData() method is used for returning the tenant data
		It requires SeaCat Auth service
	*/
	async getTenantData() {
		let currentTenant = this.getCurrentTenant();
		// If tenant data being cached already, then return the data
		if (this.TenantDataCache[currentTenant]) {
			return this.TenantDataCache[currentTenant];
		}
		let tenantData = {};
		if (currentTenant) {
			const SeaCatAuthAPI = this.App.axiosCreate('seacat-auth');
			try {
				let response = await SeaCatAuthAPI.get(`/tenant/${currentTenant}`);
				tenantData = response.data;
				this.TenantDataCache[currentTenant] = tenantData;
			} catch (e) {
				console.warn(`Tenant service can't retrieve data for ${currentTenant}`);
				console.error(e);
				// Remove data from the TenantDataCache eventually
				delete this.TenantDataCache[currentTenant];
			}
		}
		return tenantData;
	}

	// getCurrentTenant() method is used for obtaining current tenant
	getCurrentTenant() {
		const state = this.App?.AppStore?.getState();
		let currentTenant = state?.tenant?.current;
		// If current tenant is not in Application store yet, get it from the URL params
		if (!currentTenant) {
			currentTenant = this._extractTenantFromUrl();
		}
		return currentTenant;
	}

	// Extract tenant from URL params
	_extractTenantFromUrl() {
		const search = window.location.search;
		const params = new URLSearchParams(search);
		let tenant = params.get('tenant');
		return tenant;
	}
}
