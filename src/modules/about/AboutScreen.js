import React, { useState, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, DataTableCard2, DateTime } from 'asab_webui_components';

import { getBrandImage } from '../../components/branding/BrandImage';
import { listManifests } from './manifestRegistry.js';

import {
	Container, Row, Col,
	Card, CardHeader,
} from 'reactstrap';


function AboutScreen(props) {
	const theme = useAppSelector(state => state.theme);
	const [ brandImage, setBrandImage ] = useState(null);
	const showAppManifests = listManifests().count > 0;

	useLayoutEffect(() => {
		setBrandImage(getBrandImage(props, theme));
	}, [theme]);

	const contentWidth = { md: 7 };

	return (
		<Container className="h-100">
			<Row className="justify-content-center">
				<Col md={6} className="my-4 text-center">
					{brandImage ?
						<img
							src={brandImage?.full}
							alt="TeskaLabs logo"
						/>
					:
						null
					}
				</Col>
			</Row>
			<Row className="justify-content-center pb-4">
				<Col {...contentWidth}>
					<AboutCard />
				</Col>
			</Row>
			{showAppManifests && (
				<Row className="justify-content-center h-75">
					<Col {...contentWidth}>
						<ApplicationManifestsCard />
					</Col>
				</Row>
			)}
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

	return (
		<Card>
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
				{email &&
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
	);
}

function ApplicationManifestsCard() {
	const { t } = useTranslation();

	const loader = async ({ params }) => {
		const { count, data } = listManifests(params);
		return { count, rows: data };
	};

	const columns = [
		{
			title: t('General|Name'),
			thStyle: { width: '8rem', maxWidth: '12rem' },
			render: ({ row }) => {
				const label = row.displayName ?? row.id;
				return (
					<span className="fw-semibold d-block text-truncate" title={label}>
						{label}
					</span>
				);
			},
		},
		{
			title: 'Tag', // No need to translate
			thStyle: { width: '8rem', maxWidth: '12rem' },
			render: ({ row }) => {
				const tag = row.version ?? '';
				return (
					<span className="font-monospace d-block text-truncate" title={tag}>
						{tag}
					</span>
				);
			},
		},
		{
			title: t('AboutCard|Built at'),
			thStyle: { width: '8rem', maxWidth: '12rem' },
			render: ({ row }) => {
				const builtAt = row.created_at ?? '';
				return (
					<span className="d-block text-truncate" title={builtAt}>
						<DateTime value={builtAt} />
					</span>
				);
			},
		},
	];

	const Header = () => (
		<div className="flex-fill">
			<h3>{t('AboutCard|Application versions')}</h3>
		</div>	
	);

	return (
		<DataTableCard2
			columns={columns}
			loader={loader}
			header={<Header />}
			disableParams={true}
			className='h-100'
		/>
	);
}
