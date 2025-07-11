// Reducer registry
const reducers = {};
const initialStates = {};

export function registerReducer(key, reducer, initialState) {
	reducers[key] = reducer;
	initialStates[key] = initialState;
}

export function getReducers() {
	return { ...reducers };
}

export function getInitialStates() {
	return { ...initialStates };
}
