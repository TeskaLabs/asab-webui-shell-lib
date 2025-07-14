import { CHANGE_THEME } from './actions';

const initialState = null;

export default function ThemeReducer(state = initialState, action) {
	switch (action.type) {
		case CHANGE_THEME:
			return action.theme;
		default:
			return state;
	}
}
