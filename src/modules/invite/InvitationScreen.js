import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResultCard, useAppSelector, CopyableInput } from 'asab_webui_components';
import { useNavigate } from 'react-router';

import {
	Container, Row, Col,
	Button, Form,
	Card, CardBody, CardHeader, CardFooter,
	InputGroup, InputGroupText, Input, Label
} from 'reactstrap';

import { FlowbiteIllustration } from 'asab_webui_components';

// Component that handles user invitation
export default function InvitationScreen(props) {
	const [emailValue, setEmailValue] = useState('');
	const [responseData, setResponseData] = useState(undefined);
	const tenant = useAppSelector(state => state.tenant?.current);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const SeaCatAuthAPI = props.app.axiosCreate('seacat-auth');

	// Handle email input change
	const handleEmailChange = (e) => {
		e.preventDefault();
		setEmailValue(e.target.value);
	}

	// Send invitation to the specified email
	const sendInvitation = async (e) => {
		e.preventDefault();
		const body = {
			email: emailValue
		};
		try {
			let response = await SeaCatAuthAPI.post(`/account/${tenant}/invite`, body)
			setResponseData(response?.data);
			setEmailValue('');
		} catch(e) {
			if (e?.response?.data) {
				setResponseData(e?.response?.data);
			} else {
				props.app.addAlertFromException(e, t('InvitationScreen|Failed to create invitation'));
			}
		}
	}

	if (responseData) {
		const emailSent = responseData.email_sent?.result === 'OK';
		const emailError = responseData.email_sent?.error;
		const registrationUrl = responseData.registration_url;
		
		if (responseData.result === 'OK') {
			return (
				<ResultCard status={emailSent ? 'success' : 'warning'}>
					<h5 className='mb-3'>{t('InvitationScreen|Invitation was created successfully')}</h5>
					{emailSent
						? <p>{t('InvitationScreen|The user will receive an email with registration link.')}</p>
						: <p>{t(
							'InvitationScreen|However, it was not possible to send the invitation to the user via email ({{reason}}).',
							{ reason: t(emailError) },
						)}</p>
					}
					{registrationUrl
						&& <>
							{emailSent
								? <p>{t('InvitationScreen|You can also share the link manually:')}</p>
								: <p>{t('InvitationScreen|You can share the link manually:')}</p>
							}
							<div>
								<CopyableInput
									className='mt-2 mb-3'
									value={registrationUrl}
								/>
							</div>
						</>
					}
					<div className='mt-2'>
						<Button
							onClick={() => navigate('/auth/credentials')}
							color='primary'
							size='lg'
						>
							{t('General|Continue')}
						</Button>
					</div>
				</ResultCard>
			);
		}

		const responseError = responseData.error;
		return (
			<ResultCard status='danger'>
				<h5>{t('InvitationScreen|Invitation request failed')}</h5>
				{responseError
					&& <p>{t(responseError)}</p>
				}
				<div className='mt-2'>
					<Button
						onClick={() => setResponseData(undefined)}
						color='primary'
						size='lg'
					>
						{t('General|Back')}
					</Button>
				</div>
			</ResultCard>
		);
	}

	return (
		<Container fluid>
			<Row className='justify-content-center pt-5'>
				<Col md='4'>
					<Form onSubmit={sendInvitation}>
						<Card className='invite-card'>
							<CardHeader className='card-header-flex'>
								<div className='flex-fill'>
									<h3>
										<i className='bi bi-person-plus pe-2' />
										{t('InvitationScreen|Invite other user')}
									</h3>
								</div>
							</CardHeader>
							<CardBody>
								<div className="w-50 mx-auto">
									<FlowbiteIllustration
										name='invite'
										className='pb-3'
										title={t('InvitationScreen|Invite other user')}
									/>
								</div>
								<Label>{t('InvitationScreen|Enter the user\'s email address')}</Label>
								<InputGroup>
									<InputGroupText>
										<i className='bi bi-envelope-at' />
									</InputGroupText>
									<Input
										name='email'
										type='email'
										autoComplete='email'
										autoFocus={true}
										value={emailValue}
										onChange={handleEmailChange}
									/>
								</InputGroup>
							</CardBody>
							<CardFooter className='card-footer-flex'>
								<Button
									outline
									color='primary'
									type='button'
									onClick={() => navigate(-1)}
								>
									{t('General|Cancel')}
								</Button>
								<div className='flex-fill'>&nbsp;</div>
								<Button
									color='primary'
									disabled={emailValue === ''} // Disable button if input is empty
								>
									{t('InvitationScreen|Invite')}
								</Button>
							</CardFooter>
						</Card>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
