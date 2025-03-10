import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getBrandImage } from '../../components/branding/BrandImage';

import {
	Container, Row, Col,
	Card, CardHeader, CardBody,
} from 'reactstrap';


function AboutScreen(props) {
	const [ brandImage, setBrandImage ] = useState(undefined);
	const theme = useSelector(state => state.theme);

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
					<AboutCard app={props.app} />
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


// TODO: add info about version release and date of the release

function AboutCard(props) {
	const { t } = useTranslation();
	const title = useSelector(state => state.config?.title);
	const vendor = useSelector(state => state.config?.vendor);
	const website = useSelector(state => state.config?.website);
	const email = useSelector(state => state.config?.email);

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
