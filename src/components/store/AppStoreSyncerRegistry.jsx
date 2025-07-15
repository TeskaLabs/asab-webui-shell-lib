// Dynamic syncers registry (to be used eg in Classes), used for dynamic syncers registration
const syncers = [];

export function registerAppStoreSyncer(syncer) {
	syncers.push(syncer);
}

export function getAppStoreSyncers() {
	return [...syncers];
}
