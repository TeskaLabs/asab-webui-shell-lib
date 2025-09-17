import { SET_CONNECTIVITY_STATUS } from "../../actions";

const initialState = {
	status: null
};

// Reducer for connectivity status
export default function connectivityReducer(state = initialState, action) {
	switch (action.type) {
		case SET_CONNECTIVITY_STATUS: {
			return {
				...state,
				status: action.status
			}
		}

		default:
			return state;
	}
}
