import React from 'react';
import { Toast, ToastBody, ToastHeader, Button } from 'reactstrap'
import { DEL_TOAST } from '../../actions';
// import { timeToString } from 'asab_webui_components';

// Component for displaying Toast messages
export function ToastComponent({ app, content, dispatch }) {

	return(
		<Toast
			fade={true}
			className='toast d-print-none'
		>
			<ToastHeader
				toggle={() => dispatch({ type: DEL_TOAST, key: content.key })}
				className='toast-header'
				icon={content?.level ? `${content.level}` : 'secondary'}
			>
				{content?.title ? content.title : ':-('}
				{/*TODO add datetime info (the relative time)*/}
				{/*timeToString(1694691607)?.distanceToNow*/}
			</ToastHeader>
			<ToastBody>
				{content?.message ? content.message : 'Ooops, mistake is on our side. Message has not been defined!'}
			</ToastBody>
		</Toast>
	)
}
