// Actions
import {types} from './actions';
	

const initialState = {
	tenants: [],
	current: null,
	extDropdownItems: []
}

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case types.TENANTS_CHANGED:
			return {
				...state,
				tenants: action.tenants_list,
				current: action.current,
			};

		case types.TENANT_DROPDOWN_ITEM:
			return {
				...state,
				extDropdownItems: action.extDropdownItems
			}

		default:
			return state
	}
}
