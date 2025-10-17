import { SET_ATTENTION_REQUIRED_BEACON } from "../../actions";

const initialState = {
	beacon: {},
}

// Reducer for attention required, returning beacon
export default function attentionRequiredReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ATTENTION_REQUIRED_BEACON: {
			return {
				...state,
				beacon: action.beacon
			}
		}

		default:
			return state;
	}
}
