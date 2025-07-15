import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {useAppSelector} from '../../../components/store/AppStore.jsx';

import {
	Modal,
	NavLink,
	Button, Card, CardHeader, CardBody
} from 'reactstrap';
import { Spinner } from 'asab_webui_components';


import './HelpButton.scss';

export default function HelpButton() {
	const {t} = useTranslation();

	const [modal, setModal] = useState(false);
	const [isIframeLoading, setIsIframeLoading] = useState(true);

	const path = useAppSelector(state => state?.header.helpPath);
	if (path == undefined) return null;

	const toggle = () => {
		setModal(prev => {
			const newModal = !prev;
			if (newModal) {
				setIsIframeLoading(true)
			}
			return newModal;
		})
	};

	const handleIframeLoad = () => {
		setIsIframeLoading(false);
	};

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
						{isIframeLoading && (
							<div className='d-flex justify-content-center align-items-center help-iframe'>
								<Spinner />
							</div>
						)}
						<iframe
							className="help-iframe"
							src={path}
							onLoad={handleIframeLoad}
							onError={handleIframeLoad}
							style={{ display: isIframeLoading ? 'none' : '' }}
						/>
					</CardBody>
				</Card>
			</Modal>
		</>
	);
}
