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
