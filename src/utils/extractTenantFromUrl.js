export function extractTenantFromUrl() {
	const search = window.location.search;
	const params = new URLSearchParams(search);
	let tenant = params.get('tenant');
	return tenant;
}
