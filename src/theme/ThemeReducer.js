import { CHANGE_THEME } from "./actions";

const themeInitState = null;

export default function ThemeReducer(state = themeInitState, action) {
	switch (action.type) {
		
		case CHANGE_THEME: 
			const root = document.querySelector(':root');
			root.dataset.bsTheme = action.theme;  // Set the theme for Bootstrap `data-bs-theme`
			return action.theme;
		
		default:
			return state;
	}
}
