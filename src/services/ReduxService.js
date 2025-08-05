import { registerReducer } from 'asab_webui_components';

export default class ReduxService {
	// Register reducer
	addReducer(name, reducer) {
		registerReducer(name, reducer);
	}
}
