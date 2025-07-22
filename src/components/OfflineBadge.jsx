import React from 'react';
import { Badge } from 'reactstrap';
import { useTranslation } from 'react-i18next';

// Header badge for displaying offline status
export function OfflineBadge() {
	const { t } = useTranslation();

	return <Badge className='mx-2' pill color='warning'><i className='bi bi-wifi-off'/> {t('You are offline')}</Badge>	
}
	