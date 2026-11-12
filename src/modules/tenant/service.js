import { Service } from 'asab_webui_components';
import { types } from './actions';
import { locationReplace } from '../../components/locationReplace';
import { extractTenantFromUrl } from '../../utils/extractTenantFromUrl';

export default class TenantService extends Service {

	constructor(app, name = 'TenantService') {
		super(app, name);
		// Tenant data cache
		this.TenantDataCache = {};
	}

	async initialize() {

		// If the tenant list is in the configuration, use it
		// This is useful when tenants are present but auth not
		const tenants = this.App.Config.get('tenants');
		if (tenants) {
			await this.setTenants(tenants.filter((tenant) => tenant !== undefined));
		}
	}

	/*
		setTenants updates the current active tenant and the list of available tenants
		and dispatches that information into the application store
	*/
	async setTenants(availableTenants, authorizedTenant = undefined) {
		// Extract the current tenant from URL params
		const tenantFromUrl = extractTenantFromUrl();

		if (availableTenants) {
			// Sort available tenants alphabetically
			availableTenants.sort((a, b) =>{
				const tenantA = a?.toString()?.toLowerCase() || '';
				const tenantB = b?.toString()?.toLowerCase() || '';
				return tenantA.localeCompare(tenantB);
			});
		}

		/* If tenant has not been provided in access URL, insert the authorized tenant
		or the first available tenant (preferably not the system one) into the URL and reload the application */
		if (tenantFromUrl === null) {
			let tenant;

			if (authorizedTenant) {
				tenant = authorizedTenant;
			} else if (availableTenants && availableTenants.length > 0) {
				const withoutSystem = availableTenants.filter((tenant) => tenant !== 'system');

				if (withoutSystem.length > 0) {
					tenant = withoutSystem[0];
				} else {
					tenant = availableTenants[0];
				}
			} else {
				// no tenant to inject to the url
				await locationReplace(window.location.pathname + window.location.hash);
				return;
			}

			await locationReplace(`${window.location.pathname}?tenant=${tenant}${window.location.hash}`);
			return;
		}

		// In case the list of available tenants is empty or undefined, remove the tenant parameter from URL
		if (!availableTenants || availableTenants.length === 0) {
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
		const currentTenant = this.getCurrentTenant();
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
			currentTenant = extractTenantFromUrl();
		}
		return currentTenant;
	}
}
