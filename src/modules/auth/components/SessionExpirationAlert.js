import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, } from 'reactstrap';

// Session expiration custom Alert component
export function SessionExpirationAlert({ alert, store }) {
	const { t } = useTranslation(); // Use the hook inside the functional component

	return (
		<Alert
			key={alert.key}
			color={alert.level}
			fade={true}
			isOpen={!alert.acked}
		>
			<>
				<h5>{t(alert.message)}</h5>
				<div onClick={() => window.location.reload()} className="mt-2" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>{t('ASABAuthModule|Click here to proceed to login.')}</div>
			</>
		</Alert>
	);
}
