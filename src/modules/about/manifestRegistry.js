/*
	Build-time metadata from the host and loaded microfrontends (webpack MANIFEST_*).
	Microfrontends call app.registerManifest when their module loads; About lists entries here.

	Example entry:
		{
			id: 'lmio_observability_webui',
			displayName: 'LogMan.io Observability WebUI',
			version: 'v1.0.0',
			created_at: '2025-01-01T00:00:00.000Z',
		}
*/

import MOCK_MANIFEST_ENTRIES from './manifestRegistryMockData.js';

const manifests = new Map();

// Register or replace a manifest entry (keyed by id).
export function registerManifest(entry) {
	if (entry == null || typeof entry !== 'object') {
		console.warn('Application: manifest entry must be an object');
		return;
	}

	const manifestId = String(entry.id ?? '').trim();
	if (!manifestId) {
		console.warn('Application: manifest entry requires a non-empty id');
		return;
	}

	manifests.set(manifestId, {
		...entry,
		id: manifestId,
		displayName: entry.displayName ?? manifestId,
	});
}

/** Development-only sample apps for About / DataTable UI testing. */
export function registerMockManifests() {
	for (const entry of MOCK_MANIFEST_ENTRIES) {
		registerManifest(entry);
	}
}

function registerMockManifestsInDevelopment() {
	// Webpack replaces process.env.NODE_ENV; do not gate on `typeof process` (no `process` in browser).
	if (process.env.NODE_ENV !== 'production') {
		registerMockManifests();
	}
}

registerMockManifestsInDevelopment();

/** Paginated list for DataTable loaders (`p` = page, `i` = limit per page). */
export function listManifests(params = {}) {
	const all = [...manifests.values()].sort((a, b) => {
		return String(a.displayName).localeCompare(String(b.displayName));
	});
	const page = Math.max(1, parseInt(params.p, 10) || 1);
	const limit = Math.max(1, parseInt(params.i, 10) || 10);
	const start = (page - 1) * limit;
	return {
		count: all.length,
		data: all.slice(start, start + limit),
	};
}