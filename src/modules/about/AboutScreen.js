import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'asab_webui_components';

import { getBrandImage } from '../../components/branding/BrandImage';

import {
	Container, Row, Col,
	Card, CardHeader, CardBody,
} from 'reactstrap';


function AboutScreen(props) {
	const [ brandImage, setBrandImage ] = useState(undefined);
	const theme = useAppSelector(state => state.theme);

	useEffect(() => {
		setBrandImage(getBrandImage(props, theme));
	}, [theme]);

	return (
		<Container className='pt-5'>
			<Row className="justify-content-center">
				<Col md="6">
					<div className="my-4">
						{brandImage ?
								<img
									src={brandImage?.full}
									alt="TeskaLabs logo"
							/>
						:
							null
						}
					</div>
					<AboutCard />
					<ApplicationManifestsCard app={props.app} />
				</Col>
			</Row>
		</Container>
	);
}

export default AboutScreen;


/*

	Language localizations for AboutCard can be added to the translation.json files of
	public/locales/en & public/locales/cs

	Example:

	{
		"AboutCard": {
			"Vendor": "Vendor Ltd"
			"Web site": "https://example.com",
		}
	}

*/

function AboutCard() {
	const { t } = useTranslation();
	const title = useAppSelector(state => state.config?.title);
	const vendor = useAppSelector(state => state.config?.vendor);
	const website = useAppSelector(state => state.config?.website);
	const email = useAppSelector(state => state.config?.email);

	return(
		<Card>
			<CardHeader className="card-header-flex">
				<div className="flex-fill">
					<h3>
						{t('AboutCard|About')} {title}
					</h3>
				</div>
			</CardHeader>
			<ul className="list-group list-group-flush">
				{vendor &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AboutCard|Vendor')}
						</Col>
						<Col>
							{vendor}
						</Col>
					</Row>
				</li>}
				{website &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AboutCard|Website')}
						</Col>
						<Col>
							<a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
						</Col>
					</Row>
				</li>}
				{website &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AboutCard|Email')}
						</Col>
						<Col>
							<a href={`mailto:${email}`}>{email}</a>
						</Col>
					</Row>
				</li>}
			</ul>
		</Card>
	)
}

function ApplicationManifestsCard({ app }) {
	const { t } = useTranslation();

	const manifests = app?.Services?.ManifestService?.getAll?.() ?? [];
	if (manifests.length === 0) {
		return null;
	}

	return (
		<Card className="mt-4">
			<CardHeader className="card-header-flex">
				<div className="flex-fill">
					<h3>{t('AboutCard|Application versions')}</h3>
				</div>
			</CardHeader>
			<ul className="list-group list-group-flush">
				{manifests.map((entry) => (
					<li className="list-group-item" key={entry.id}>
						<Row>
							<Col className="fw-semibold">{entry.displayName ?? entry.id}</Col>
							{entry.version &&
								<Col>{entry.version}</Col>
							}
						</Row>
						{entry.created_at &&
						<Row>
							<Col className="col-6">{t('AboutCard|Built at')}</Col>
							<Col>{entry.created_at}</Col>
						</Row>}
					</li>
				))}
			</ul>
		</Card>
	);
}
