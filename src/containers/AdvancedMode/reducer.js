import { SET_ADVANCED_MODE } from "../../actions";

const initialState = {
	enabled: false,
}

export default function advancedModeReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ADVANCED_MODE: {
			return {
				...state,
				enabled: action.enabled
			}
		}

		default:
			return state;
	}
}
