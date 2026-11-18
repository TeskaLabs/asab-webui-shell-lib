const SUPERUSER_RESOURCE = 'authz:superuser';

/**
 * Whether the user holds the required resource(s)
 *
 * @param {string | string[] | undefined | null} required
 *   A single resource id, or an array meaning ALL ids must be assigned (AND).
 *   '*' matches any user (public route), consistent with UnauthorizedAccessScreen.
 * @param {string[]} assigned User resources from auth state.
 * @returns {boolean}
 */
export function hasAssignedResources(required, assigned) {
	const resources = Array.isArray(assigned) ? assigned : [];

	if (resources.includes(SUPERUSER_RESOURCE)) {
		return true;
	}

	if (required === '*') {
		return true;
	}

	if (required == null || required === '') {
		return false;
	}

	if (typeof required === 'string') {
		return resources.includes(required);
	}

	if (Array.isArray(required)) {
		if (required.length === 0) {
			return false;
		}
		return required.every(
			(id) => resources.includes(id)
		);
	}

	return false;
}

/**
 * Human-readable list of required resources for unauthorized UI
 *
 * @param {string | string[] | undefined | null} required
 * @returns {string}
 */
export function formatRequiredResources(required) {
	if (required == null || required === '') {
		return '';
	}

	if (typeof required === 'string') {
		return required;
	}

	if (Array.isArray(required)) {
		return required.join(', ');
	}

	return '';
}
