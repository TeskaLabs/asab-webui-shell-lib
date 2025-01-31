import { SET_HELP_PATH, SET_SUBTITLE, SET_FLAG, SET_HEADER_NAVIGATION_ITEMS } from '../../actions';

const initialState = {
	helpPath: "https://docs.teskalabs.com/logman.io/user/",
	subtitle: undefined,
	flag: undefined,
	headerNavItems: []
}

export default (state = initialState, action) => {

	switch (action.type) {
		case SET_HELP_PATH:
			return {
				...state,
				helpPath: action.helpPath
			}

		case SET_SUBTITLE:
			return {
				...state,
				subtitle: action.subtitle
			}

		case SET_FLAG:
			return {
				...state,
				flag: action.flag
			}

		case SET_HEADER_NAVIGATION_ITEMS:
			// Sort the navigation items
			action.headerNavItems.sort((a, b) => {
				if ((a.order == undefined) && (b.order == undefined)) {
					return 0; // No order specified for both, keep order unchanged
				} else if (a.order == undefined) {
					return 1; // Move items without order to the end
				} else if (b.order == undefined) {
					return -1; // Move items without order to the end
				} else {
					return a.order - b.order; // Sort by order
			}});
			return {
				...state,
				headerNavItems: action.headerNavItems
			}

		default:
			return state
	}
}
