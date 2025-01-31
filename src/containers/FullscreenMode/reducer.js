import { SET_FULLSCREEN_MODE } from "../../actions";

const initialState = {
	status: 'off',
}

export default function fullscreenModeReducer(state = initialState, action) {
	switch (action.type) {
		case SET_FULLSCREEN_MODE: {
			return {
				...state,
				status: action.status
			}
		}

		default:
			return state;
	}
}
