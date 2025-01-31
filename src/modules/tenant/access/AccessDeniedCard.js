import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Card, CardHeader, CardBody,
	Button
} from 'reactstrap';

import { locationReplace } from '../../../components/locationReplace';

import './AccessDeniedCard.scss';

function AccessDeniedCard(props) {
	const { t } = useTranslation();
	const [ accessDenied, setAccessDenied ] = useState(false);
	const [ deniedTenant, setDeniedTenant ] = useState("");

	useEffect(() => {
		var qs = new URLSearchParams(window.location.search);
		const errorType = qs.get('error');
		/*
			If error appears in the URL search params and is NOT
			tenant_access_denied, user will stay in splashscreen
			with Access denied card
		*/
		if ((errorType != undefined) && (errorType != 'tenant_access_denied')) {
			setAccessDenied(true);
			if (errorType.includes("no_tenants")) {
				setDeniedTenant(t("AccessDeniedCard|is not assigned!"));
			} else {
				const tenantParameter = qs.get('tenant');
				setDeniedTenant(tenantParameter);
			}
		}
	}, [])

	/*
		We can't use logout/redirection to login via /openidconnect/logout,
		since we dont have a oauth token here (access denied)
	*/
	const continueToLogin = async () => {
		const SeaCatAuthAPI = props.app.axiosCreate('seacat-auth');
		let response;
		try {
			// Use public logout
			response = await SeaCatAuthAPI.put('/public/logout');
		} catch (e) {
			props.app.addAlertFromException(e, t("AccessDeniedCard|Silly as it sounds, the logout failed"));
		}
		await locationReplace(`${window.location.pathname}`);
	}

	return (
		props.app.Services.TenantService &&
		(props.app.Modules.filter(obj => obj.Name === "AuthModule").length > 0) &&
		(accessDenied == true) ?
			<div className="access-denied-wrapper">
				<Card>
					<CardHeader className="card-header-flex">
						<div className="flex-fill text-center">
							<h2 className="text-primary">
								{t("AccessDeniedCard|Access denied")}
							</h2>
						</div>
					</CardHeader>
					<CardBody>
						<p className="text-center">
							{t("AccessDeniedCard|Please contact application administrator for assigning appropriate access rights.")}
						</p>
						{deniedTenant &&
						<p className="text-center tenant-text">
							<span>Tenant </span>{deniedTenant}
						</p>}
						<Button
							className="justify-content-center"
							block
							color="primary"
							onClick={() => {continueToLogin()}}
						>
							{t("AccessDeniedCard|Leave")}
						</Button>
					</CardBody>
				</Card>
			</div>
		: null
	);
}

export default AccessDeniedCard;
