import { SET_NAVIGATION_ITEMS } from "../../actions";

const initialState = {
	navItems: []
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_NAVIGATION_ITEMS:
			// Remove navigation items which does not have populated children
			const filteredNavItems = action.navItems
				? action.navItems.filter(item => !(item.children && item.children.length === 0))
				: [];

			// Sort children within each navigation item if they exist
			filteredNavItems.forEach(item => {
				if (item.children && (item.children.length > 0)) {
					item.children.sort((a, b) => sortItemsByOrder(a, b));
				}
			});
			// Sort the navigation items
			filteredNavItems.sort((a, b) => sortItemsByOrder(a, b));
			return {
				...state,
				navItems: filteredNavItems
			}

		default: {
			return state;
		}

	}
}

// Method to sort items by order property
function sortItemsByOrder(a, b) {
	if ((a.order == undefined) && (b.order == undefined)) {
		return 0; // No order specified for both, keep order unchanged
	} else if (a.order == undefined) {
		return 1; // Move items without order to the end
	} else if (b.order == undefined) {
		return -1; // Move items without order to the end
	} else {
		return a.order - b.order; // Sort by order
	}
}
