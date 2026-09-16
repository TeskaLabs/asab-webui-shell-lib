import React from 'react';
import { useTranslation } from 'react-i18next';

import {
	Card, CardHeader, CardBody,
} from 'reactstrap';

import './LoginLoopCard.scss';

export function LoginLoopCard(props) {
	const { t } = useTranslation();

	// Validate if AuthModule is present
	const hasAuthModule = props.app?.Modules?.some(m => m.Name === 'AuthModule');
	if (!hasAuthModule) {
		return null;
	}

	// Read the number of login attempts from sessionStorage and render the card if the number is greater than 10
	const attempts = parseInt(sessionStorage.getItem('SeaCatLoginAttempts') || '0', 10);
	if (!Number.isFinite(attempts) || attempts <= 10) {
		return null;
	}

	return (
		<div className='auth-login-loop-wrapper'>
			<Card>
				<CardHeader className='card-header-flex'>
					<div className="flex-fill text-center">
						<h2 className='text-primary'>
							{t('ASABAuthModule|Authentication error')}
						</h2>
					</div>
				</CardHeader>
				<CardBody>
					{t('ASABAuthModule|Too many login redirects occurred. Please contact application administrator.')}
				</CardBody>
			</Card>
		</div>
	);
}
