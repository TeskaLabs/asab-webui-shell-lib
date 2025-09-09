import React from 'react';
import { useTranslation } from 'react-i18next';

// Header badge for displaying offline status
export function OfflineIndication() {
	const { t } = useTranslation();

	return <span title={t('General|Functionality of the Application may be limited')} className='mx-2'><i className='bi bi-wifi-off pe-1'/>{t('General|You are offline')}</span>
}
