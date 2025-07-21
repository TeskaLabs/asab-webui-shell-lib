import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppStore } from 'asab_webui_components'
import { Alert } from 'reactstrap';

import { ACK_ALERT, DEL_ALERT } from '../../actions';
import { useTranslation } from 'react-i18next'

import './alerts.scss';

export default function AlertsComponent(props) {
	const [seconds, setSeconds] = useState(0);
	const { dispatch } = useAppStore();
	const alerts = useAppSelector(state => state.alerts.alerts);
	const { t } = useTranslation();

	// Expire old alerts
	useEffect(() => {

		// There is probably smarter way how to set interval to avoid speculative ticking
		const interval = 1000;

		const intervalId = setTimeout(() => {
			setSeconds(seconds => seconds + 1);

			const now = new Date();
			for (const i in alerts) {
				let alert = alerts[i];

				if (alert.expire < now) {
					if (alert.acked) {
						dispatch({ type: DEL_ALERT, key: alert.key });
					} else {
						dispatch({ type: ACK_ALERT, key: alert.key });
					}
				}
			}

		}, interval);
		return () => { clearInterval(intervalId) };
	}, [seconds]);

	return (
		<div id='alerts'>
			{alerts.map((alert) => {
				if (alert.component === null) {
					return (
						<Alert
							key={alert.key}
							color={alert.level}
							className={`shadow alerts-style d-print-none`}
							fade={true}
							isOpen={!alert.acked}
							toggle={(() => dispatch({ type: ACK_ALERT, key: alert.key }))}
						>
							{alert.shouldBeTranslated ? t(alert.message) : alert.message}
						</Alert>
					);
				} else {
					return alert.component(alert, store);
				}
			})}
		</div>
	);
}
