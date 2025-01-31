import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResultCard } from 'asab_webui_components';
import { useNavigate } from 'react-router-dom';

import {
	Container, Row, Col,
	Button, Form, FormText,
	Card, CardBody, CardHeader, CardFooter,
	InputGroup, InputGroupText, Input, Label
} from 'reactstrap';

// Component that handles user invitation
export default function InvitationScreen(props) {
	const [emailValue, setEmailValue] = useState('');
	const [isInvitationSuccessful, setIsInvitationSuccessful] = useState(undefined);
	const tenant = useSelector(state => state.tenant?.current);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const SeaCatAuthAPI = props.app.axiosCreate('seacat-auth');

	// Validate email input
	const emailValidation = (e) => {
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
			if (response?.data?.result !== 'OK') {
				throw new Error('Invitation has not been sent');
			}
			setIsInvitationSuccessful(true);
			setEmailValue('');
		} catch(e) {
			setIsInvitationSuccessful(false);
		}
	}

	// Display for successful invitation
	const SuccessfulInvitationCardBody = () => (
		<>
			<h6>{t('InvitationScreen|Invitation has been sent successfully')}</h6>
			<div className='mt-2'>
				<Button
					block
					onClick={() => navigate('/auth/credentials')}
					color='primary'
					size='lg'
				>
					{t('General|Continue')}
				</Button>
			</div>
		</>
	);

	// Display for unsuccessful invitation
	const UnsuccessfulInvitationCardBody = () => (
		<>
			<h6>{t('InvitationScreen|Invitation has not been sent')}</h6>
			<FormText>{t('InvitationScreen|The user could not be invited')}</FormText>
			<div className='mt-2'>
				<Button
					block
					onClick={() => setIsInvitationSuccessful(undefined)}
					color='primary'
					size='lg'
				>
					{t('General|Back')}
				</Button>
			</div>
		</>
	);

	return (
		<Container fluid className={(isInvitationSuccessful == undefined) ? '' : 'h-100'}>
			{(isInvitationSuccessful != undefined) ? (
				<ResultCard
					isSuccessful={isInvitationSuccessful ? true : false}
					body={isInvitationSuccessful ? <SuccessfulInvitationCardBody/> : <UnsuccessfulInvitationCardBody/>}
				/>
			) : (
				<Row className='justify-content-center pt-5'>
					<Col md='4'>
						<Form onSubmit={(e) => {sendInvitation(e)}}>
							<Card className='invite-card'>
								<CardHeader className='card-header-flex'>
									<div className='flex-fill'>
										<h3>
											<i className='bi bi-person-plus pe-2' />
											{t('InvitationScreen|Invite other users')}
										</h3>
									</div>
								</CardHeader>
								<CardBody>
									<Label>{t('InvitationScreen|Enter the email to invite a user')}</Label>
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
											onChange={(e) => {emailValidation(e)}}
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
										{t('InvitationScreen|Send')}
									</Button>
								</CardFooter>
							</Card>
						</Form>
					</Col>
				</Row>
			)}
		</Container>
	);
}
