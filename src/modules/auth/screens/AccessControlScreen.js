import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'asab_webui_components';

import {
	Container, Row, Col,
	Card, CardHeader
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';

/*

	Language localizations for AccessControlScreen can be added to the translation.json files of
	public/locales/en & public/locales/cs of the product where AccessControlScreen component is used.

	Example:

	{
		"AccessControlScreen": {
			"Access control": "Access control",
			"Username": "Username",
			"Tenant": "Tenant",
			"Resources": "Resources"
		}
	}

*/

function AccessControlScreen(props) {

	return (
		<Container>
			<Row className="justify-content-center pt-5">
				<Col md="6">
					<AccessControlCard />
				</Col>
			</Row>
		</Container>
	);
}

export default AccessControlScreen;


function AccessControlCard(props) {
	const { t, i18n } = useTranslation();
	const tenant = useAppSelector(state => state.tenant?.current);
	const userinfo = useAppSelector(state => state.auth?.userinfo);
	const resources = (useAppSelector(state => state.auth?.resources) || []).slice().sort();

	return (
		<Card>
			<CardHeader className="card-header-flex">
				<div className="flex-fill">
					<h3>
						{t('AccessControlScreen|Access control')}
					</h3>

				</div>
			</CardHeader>
			<ul className="list-group list-group-flush">
				<div className="w-50 mx-auto">
					<FlowbiteIllustration name="access" className="py-4" title={t('AccessControlScreen|Access control')} />
				</div>
				{userinfo?.username &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AccessControlScreen|Username')}
						</Col>
						<Col>
							{userinfo.username}
						</Col>
					</Row>
				</li>}
				{tenant &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AccessControlScreen|Tenant')}
						</Col>
						<Col>
							{tenant}
						</Col>
					</Row>
				</li>}
				{resources &&
				<li className="list-group-item">
					<Row>
						<Col className="col-6">
							{t('AccessControlScreen|Resources')}
						</Col>
						<Col>
							{resources.map((resource) =>
								<div key={resource}>{resource}</div>
							)}
						</Col>
					</Row>
				</li>}
			</ul>
		</Card>
	)
}
