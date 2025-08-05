import React from 'react';
import { useTranslation } from 'react-i18next';

import {
	Container, Row, Col,
	Card, CardBody
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';
import './InvalidRouteScreen.scss';

export default function InvalidRouteScreen(props) {
	const { t } = useTranslation();

	return(
		<Container className="invalid-route-container h-100" fluid>
			<Card className="invalid-route-card">
				<CardBody className="text-center invalid-route-cardbody">
					<Row className="justify-content-center">
						<Col>
							<FlowbiteIllustration name="error" className="pb-4" height="180px" title={t("InvalidRouteScreen|Nothing here")}/>
							<p className="card-text">{t("InvalidRouteScreen|Sorry, we can't find the page you are looking for.")}</p>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Container>
	)
}
