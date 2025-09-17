import React from 'react';
import { useTranslation } from 'react-i18next';

// Header badge for displaying offline status
export function OfflineIndication() {
	const { t } = useTranslation();

	return <i
		title={t('General|You are offline. Functionality of the Application may be limited.')}
		className='bi bi-wifi-off mx-3'
		style={{ fontSize: '16px' }} // Align with fontsize of navitems of Header
	/>
}
