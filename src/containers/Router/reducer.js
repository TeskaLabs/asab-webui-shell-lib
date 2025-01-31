import { SET_ROUTES } from "../../actions";

const initialState = {
	routes: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_ROUTES:
			return {
				...state,
				routes: action.routes
			}

		default: {
			return state;
		}

	}
}
