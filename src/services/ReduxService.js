import { registerReducer } from 'asab_webui_components';

export default class ReduxService {
	constructor(){
		this.Reducers = {}
	}

	addReducer(name, reducer) {
		// TODO: remove this.Reducers since it is obsoleted
		if (name in this.Reducers) {
			console.warn(`Reducer with name ${name} already exists.`);
			return;
		}
		this.Reducers[name] = reducer;
		// End of TODO

		registerReducer(name, reducer);
	}
}