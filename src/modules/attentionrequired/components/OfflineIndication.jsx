import React from 'react';
import { useTranslation } from 'react-i18next';

// Header badge for displaying offline status
export function OfflineIndication() {
	const { t } = useTranslation();

	return <span className='mx-2'><i title={t('General|Functionality of the Application may be limited.')} className='bi bi-wifi-off pe-1'/>{t('General|You are offline.')}</span>
}