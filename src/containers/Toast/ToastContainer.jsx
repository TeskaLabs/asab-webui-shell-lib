import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { DEL_TOAST, ADD_TOAST } from '../../actions';

import { ToastComponent } from './ToastComponent.jsx';
import { toastReducer } from './reducer.jsx';

// Toast container
export default function ToastContainer(props) {
	// Get the toast data from Redux (assuming it comes from `attentionrequired.beacon`)
	const attentionRequired = useSelector((state) => state.attentionrequired?.beacon);
	const toastData = attentionRequired?.['beacon.toast']?.data || [];

	// useReducer to manage the local state of toasts
	const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

	// Handle new toast data from attention required store
	useEffect(() => {
		if (toastData && toastData.length > 0) {
			toastData.forEach((reduxToast) => {
				// Add new toast into the toast redux store
				dispatch({
					type: ADD_TOAST,
					title: reduxToast?.title,
					message: reduxToast?.message,
					level: reduxToast?.level, // 'info', 'warning', etc.
					expire: reduxToast?.expire || 30, // Toast expiration time (in seconds)
				});
			});
		}
	}, [toastData, dispatch]);

	// useEffect to automatically remove expired toasts
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			state?.toasts.forEach((toast) => {
				if (toast.expire <= now) {
					dispatch({ type: DEL_TOAST, key: toast.key }); // Remove expired toast
				}
			});
		}, 2000); // Check for expiration every 2 seconds

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [state?.toasts, dispatch]);

	return (
		<div className="toast-container position-fixed bottom-0 end-0 p-3">
			{state?.toasts && state?.toasts.length > 0 && state?.toasts.map((toast, idx) => (
				<ToastComponent
					key={idx}
					app={props.app}
					content={toast}
					dispatch={dispatch}
				/>
			))}
		</div>
	);
}
