import { COLLAPSE_SIDEBAR } from "../../actions";

const initialState = {
	isSidebarCollapsed: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case COLLAPSE_SIDEBAR: {
			if (action.isSidebarCollapsed) {
				document.getElementById('app').classList.add('sidebar-collapsed');
			} else {
				document.getElementById('app').classList.remove('sidebar-collapsed');
			}

			return {
				...state,
				isSidebarCollapsed: action.isSidebarCollapsed
			}
		}
		default: {
			return state;
		}

	}
}
