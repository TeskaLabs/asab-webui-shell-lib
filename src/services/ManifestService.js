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

	/**
	 * @param {Object} entry
	 * @param {string} entry.id - Stable id (e.g. Module Federation name)
	 * @param {string} [entry.displayName] - Human-readable name; defaults to id
	 * @param {string} [entry.version] - Version / git describe tag
	 * @param {string} [entry.created_at] - Build time (UTC ISO)
	 */
	register(entry) {
		if (entry == null || typeof entry !== 'object') {
			console.warn('ManifestService: manifest entry must be an object');
			return;
		}

		const id = entry.id;
		if (id == null || String(id).trim() === '') {
			console.warn('ManifestService: manifest entry requires a non-empty id');
			return;
		}

		const key = String(id);
		const existing = this._manifests.get(key);
		const displayName = entry.displayName ?? entry.name ?? existing?.displayName ?? key;

		this._manifests.set(key, {
			...existing,
			...entry,
			id: key,
			displayName,
		});
	}

	get(id) {
		if (id == null) {
			return undefined;
		}
		return this._manifests.get(String(id));
	}

	/** All registered manifests, sorted by displayName then id. */
	getAll() {
		return [...this._manifests.values()].sort((a, b) => {
			const nameCmp = String(a.displayName).localeCompare(String(b.displayName));
			if (nameCmp !== 0) {
				return nameCmp;
			}
			return String(a.id).localeCompare(String(b.id));
		});
	}
}
