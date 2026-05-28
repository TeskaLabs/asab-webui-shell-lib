import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'asab_webui_components';

import {
	Container, Row, Col,
	Card, CardBody
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';
import './UnauthorizedAccessScreen.scss';

/*
	Unauthorized Access screen can be displayed only when:
	- AuthModule is present within the application
	- user does not have a particular resource and user is not superuser

	Unauthorized Access screen replace the content of the container by its own screen with
	information about what resource is missing to enable the access to the desired (blocked)
	screen.
*/
export default function UnauthorizedAccessScreen(props) {
	const { t } = useTranslation();
	const resources = useAppSelector((state) => state.auth?.resources ? state.auth.resources : []);

	// Check if auth module is active. If not, return the original component
	// Check for desired resource. If present or user is superuser, return the original component
	const isAuthorized = (props.resource === "*") ||
			(props.app.Modules.filter(obj => obj.Name === "AuthModule").length === 0) ||
			(resources.indexOf(props.resource) !== -1) ||
			(resources.indexOf("authz:superuser") !== -1);

	useLayoutEffect(() => {
		// Determine if the component should be in print-ready or print-unauthorized state
		if (!isAuthorized) {
			document.body.setAttribute('print-ready', 'true');
			document.body.setAttribute('print-unauthorized', 'true');
		} else {
			document.body.removeAttribute('print-ready');
			document.body.removeAttribute('print-unauthorized');
		}

		// Cleanup function to remove the attributes when the component unmounts
		return () => {
			document.body.removeAttribute('print-ready');
			document.body.removeAttribute('print-unauthorized');
		};
	}, [isAuthorized]);

	// If user is authorized, let them see the screen content
	if (isAuthorized) {
		return <>{props.routeComponent}</>;
	}

	// Else return the Not authorized screen
	return(
		<Container className="unauthorized-container h-100">
			<Card className="unauthorized-card">
				<CardBody className="text-center unauthorized-cardbody">
					<Row className="justify-content-center">
						<Col>
							<div className="unauthorized-img-container">
								<FlowbiteIllustration name="unauthorized" className="pb-4" title={t("UnauthorizedAccessScreen|Unauthorized access")}/>
							</div>
							{props.resource ?
								<>
									<p className="card-text">{t("UnauthorizedAccessScreen|You are not authorized to access this part of the application. Please ask your application administrator for following resource")}:</p>
									<h5 className="card-title">{props.resource}</h5>
								</>
								:
								<p className="card-text">{t("UnauthorizedAccessScreen|You are not authorized to access this part of the application.")}</p>
							}
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Container>
	)
}
