// Actions
import {types} from './actions';
	

const initialState = {
	tenants: [],
	current: null,
	additionalDropdownComponents: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case types.TENANTS_CHANGED:
			return {
				...state,
				tenants: action.tenants_list,
				current: action.current,
			};

		case types.TENANT_ADDITIONAL_DROPDOWN_COMPONENTS:
			return {
				...state,
				additionalDropdownComponents: action.additionalDropdownComponents,
			}

		default:
			return state
	}
}
