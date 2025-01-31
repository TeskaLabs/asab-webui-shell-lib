// Actions
import { ADD_TOAST, DEL_TOAST } from '../../actions';

const initialState = {
	toasts: [],
};

// Reducer for toast actions
export function toastReducer(state = initialState, action) {
	switch (action.type) {

		case ADD_TOAST: {
			// Set expiration time
			const expire = new Date();
			expire.setSeconds(expire.getSeconds() + action.expire);

			// Generate a new toast
			const newToast = {
				key: Math.floor(Math.random() * 65536),
				title: action.title,
				message: action.message,
				level: action.level,
				_c: action._c,
				expire: expire,
			};

			// Return new state with added toast
			return {
				...state,
				toasts: state?.toasts ? [...state?.toasts, newToast] : initialState.toasts,
			};
		}

		case DEL_TOAST: {
			// Filter out the toast to be deleted by key
			return {
				...state,
				toasts: state?.toasts.filter(toast => toast.key !== action.key),
			};
		}

		default:
			return state;
	}
}
