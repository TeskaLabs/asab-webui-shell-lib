import { Service } from 'asab_webui_components';

/*
	Registry of build-time manifests from the host and loaded microfrontends.
	Each federated app registers in its Module constructor via app.registerManifest(...).
*/
export default class ManifestService extends Service {
	constructor(app, serviceName = 'ManifestService') {
		super(app, serviceName);
		this._manifests = new Map();
	}

	register(entry) {
		if (entry == null || typeof entry !== 'object') {
			console.warn('ManifestService: manifest entry must be an object');
			return;
		}

		const manifestId = String(entry.id ?? '').trim();
		if (!manifestId) {
			console.warn('ManifestService: manifest entry requires a non-empty id');
			return;
		}

		this._manifests.set(manifestId, {
			...entry,
			id: manifestId,
			displayName: entry.displayName ?? manifestId,
		});
	}

	isEmpty() {
		return this._manifests.size === 0;
	}

	/** Paginated list for DataTable loaders (`p` = page, `i` = limit per page). */
	list(params = {}) {
		const all = this._getSortedManifests();
		const page = Math.max(1, parseInt(params.p, 10) || 1);
		const limit = Math.max(1, parseInt(params.i, 10) || 10);
		const start = (page - 1) * limit;
		return {
			count: all.length,
			data: all.slice(start, start + limit),
		};
	}

	_getSortedManifests() {
		return [...this._manifests.values()].sort((a, b) => {
			const nameCmp = String(a.displayName).localeCompare(String(b.displayName));
			if (nameCmp !== 0) {
				return nameCmp;
			}
			return String(a.id).localeCompare(String(b.id));
		});
	}
}
