import React from 'react';
import { useTranslation } from 'react-i18next';

import {
	Container, Row, Col,
	Card, CardBody
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';
import { getBrowserLabel } from '../utils/browserSupport.jsx';
import './UnsupportedBrowserScreen.scss';

/*
	Shown in #app-main when the browser fails the shell capability probe.
	Header and Sidebar stay mounted so the user can still log out.
*/
export function UnsupportedBrowserScreen() {
	const { t } = useTranslation();
	const browser = getBrowserLabel();

	const message = browser
		? t(
			'UnsupportedBrowserScreen|We are sorry for the inconvenience. Your browser ({{browser}}) is not supported. Please upgrade to a newer version or use another modern browser (Chrome, Firefox, Edge, or Safari).',
			{ browser }
		)
		: t(
			'UnsupportedBrowserScreen|We are sorry for the inconvenience. Your browser is not supported. Please upgrade to a newer version or use another modern browser (Chrome, Firefox, Edge, or Safari).'
		);

	return (
		<Container className="unsupported-browser-container h-100">
			<Card className="unsupported-browser-card">
				<CardBody className="text-center unsupported-browser-cardbody">
					<Row className="justify-content-center">
						<Col>
							<div className="unsupported-browser-img-container">
								<FlowbiteIllustration
									name="error"
									className="pb-4"
									title={t('UnsupportedBrowserScreen|Browser not supported')}
								/>
							</div>
							<h4 className="mb-3">{t('UnsupportedBrowserScreen|Browser not supported')}</h4>
							<p className="card-text">{message}</p>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Container>
	);
}
