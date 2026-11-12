import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, DataTableCard2 } from 'asab_webui_components';

import { getBrandImage } from '../../components/branding/BrandImage';

import {
	Container, Row, Col,
	Card, CardHeader,
} from 'reactstrap';


function AboutScreen(props) {
	const [ brandImage, setBrandImage ] = useState(undefined);
	const theme = useAppSelector(state => state.theme);

	useEffect(() => {
		setBrandImage(getBrandImage(props, theme));
	}, [theme]);

	return (
		<Container>
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
	const manifestService = app?.Services?.ManifestService;

	const loader = async ({ params }) => {
		const { count, data } = manifestService?.list?.(params) ?? { count: 0, data: [] };
		return { count, rows: data };
	};

	const columns = [
		{
			title: t('General|Name'),
			thStyle: { minWidth: '8rem' },
			render: ({ row }) => <span className="fw-semibold">{row.displayName ?? row.id}</span>,
		},
		{
			title: t('AboutCard|Tag'),
			thStyle: { minWidth: '8rem' },
			render: ({ row }) => <span>{row.version ?? ''}</span>,
		},
		{
			title: t('AboutCard|Built at'),
			thStyle: { minWidth: '6rem' },
			render: ({ row }) => <span>{row.created_at ?? ''}</span>,
		},
	];

	const Header = () => (
		<div className="flex-fill">
			<h3>{t('AboutCard|Application versions')}</h3>
		</div>
	);

	if (!manifestService || manifestService.isEmpty()) {
		return null;
	}

	return (
		<div className="mt-4">
			<DataTableCard2
				columns={columns}
				loader={loader}
				header={<Header />}
				disableParams={true}
			/>
		</div>
	);
}
