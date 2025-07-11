import React from 'react';
import { AppStore } from './AppStore.jsx';
import { getAppStoreSyncers } from './AppStoreSyncerRegistry.jsx';

// App store provider with dynamic syncer loading
export function AppStoreProvider({ children }) {
	const syncers = getAppStoreSyncers();
	return (
		<AppStore>
			{syncers.map((Syncer, idx) => <Syncer key={idx} />)}
			{children}
		</AppStore>
	);
}
