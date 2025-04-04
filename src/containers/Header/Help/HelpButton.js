import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from 'react-redux';

import {
	Modal,
	NavLink,
	Button, Card, CardHeader, CardBody
} from 'reactstrap';

import './HelpButton.scss';

export default function HelpButton() {
	const {t} = useTranslation();

	const [modal, setModal] = useState(false);

	const path = useSelector(state => state?.header.helpPath);
	if (path == undefined) return null;

	const toggle = () => setModal(!modal);

	return (
		<>
			<NavLink
				className="help-nav-link"
				onClick={toggle}
				title={t("HelpButton|Show help info")}
			>
				{t("HelpButton|Help")}
			</NavLink>

			<Modal isOpen={modal} toggle={toggle} className="help-modal-dialog">
				<Card className="help-card">
					<CardHeader className="card-header-flex">
						<div className="flex-fill">
							<h3>
								<i className="bi bi-question-circle pe-2"></i>
								{t("HelpButton|Help")}
							</h3>
						</div>
						<Button
							outline
							type="button"
							onClick={toggle}
							color="primary"
						>
							<i className="bi bi-x-lg"></i>
						</Button>
					</CardHeader>
					<CardBody>
						<iframe className="help-iframe" src={path} />
					</CardBody>
				</Card>
			</Modal>
		</>
	);
}
