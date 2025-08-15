import { CHANGE_THEME } from './actions';

const initialState = null;

export default function ThemeReducer(state = initialState, action) {
	switch (action.type) {

		case CHANGE_THEME:
			const root = document.querySelector(':root');
			root.dataset.bsTheme = action.theme;  // Set the theme for Bootstrap `data-bs-theme`
			return action.theme;

		default:
			return state;
	}
}
