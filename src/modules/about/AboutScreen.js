import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, DataTableCard2 } from 'asab_webui_components';

import { getBrandImage } from '../../components/branding/BrandImage';

import {
	Container, Row, Col,
	Card, CardHeader,
} from 'reactstrap';


function AboutScreen(props) {
	const theme = useAppSelector(state => state.theme);
	const brandImage = useMemo(() => getBrandImage(props, theme), [theme]);

	return (
		<Container className='h-100'>
			<Row className="justify-content-center h-100 pt-4">
				<Col md="6" className='d-flex flex-column gap-4 h-100 min-vh-0'>
					{brandImage && 
						<div style={{ height: '8rem' }}>
							<img
								src={brandImage.full}
								alt="TeskaLabs logo"
							/>
						</div>
					}
					<AboutCard />
					<div className='flex-grow-1'>
						<ApplicationManifestsCard app={props.app} />
					</div>
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
			tdStyle: { width: '8rem', maxWidth: '12rem' },
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
			title: t('AboutCard|Tag'),
			tdStyle: { width: '8rem', maxWidth: '12rem' },
			render: ({ row }) => {
				const tag = row.version ?? '';
				return (
					<span className="d-block text-truncate" title={tag}>
						{tag}
					</span>
				);
			},
		},
		{
			title: t('AboutCard|Built at'),
			tdStyle: { width: '8rem', maxWidth: '12rem' },
			render: ({ row }) => {
				const builtAt = row.created_at ?? '';
				return (
					<span className="d-block text-truncate" title={builtAt}>
						{builtAt}
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

	if (!manifestService || manifestService.isEmpty()) {
		return null;
	}

	return (
			<DataTableCard2
				columns={columns}
				loader={loader}
				header={<Header />}
				disableParams={true}
			/>
	);
}
