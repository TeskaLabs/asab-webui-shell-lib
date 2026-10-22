import React from 'react';
import { useTranslation } from 'react-i18next';

import {
	Container, Row, Col,
	Card, CardBody
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';
import { getBrowserLabel, MIN_SUPPORTED } from '../utils/browserSupport.jsx';
import './UnsupportedBrowserScreen.scss';

/*
	Shown in #app-main when the browser fails to match supported browser criteria.
	Header and Sidebar stay mounted so the user can still log out.
	Skipped when config browserSupportCheck is set to false
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
							<h4 className="mb-2">{t('UnsupportedBrowserScreen|Browser not supported')}</h4>
							<p className="card-text mb-2">{message}</p>
							<p className="mb-1">{t('UnsupportedBrowserScreen|Minimum supported versions:')}</p>
							<ul className="list-unstyled mb-0 unsupported-browser-versions">
								{Object.entries(MIN_SUPPORTED).map(([name, version]) => (
									<li key={name}>{name} {version}+</li>
								))}
							</ul>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Container>
	);
}
