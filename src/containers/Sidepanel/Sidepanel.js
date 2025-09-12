import React, { useEffect, useState } from 'react';
import { Card, CardBody, Collapse } from 'reactstrap';

import { usePubSub } from "asab_webui_components";

import './Sidepanel.scss';

/*

	Overlay sidepanel:

		publish('Application.panel!', { mode:
			<SidePanelContent />,
			layout: 'overlay'
		});

	Docked sidepanel:

		publish('Application.panel!', { mode:
			<SidePanelContent />
		});

*/

// Application sidepanel
export default function Sidepanel(props) {
	const { publish, subscribe } = usePubSub();
	const [ sidepanelContent, setSidepanelContent ] = useState(undefined);
	const [mode, setMode] = useState('dock');

	useEffect(() => {
		const handleEvent = (message) => {
			if (message.mode === 'close') {
				setSidepanelContent(undefined);
			} else {
				setSidepanelContent(message.mode);
			}

			setMode((message?.layout === 'overlay') ? 'overlay' : 'dock');
		}
		// Subscription to Application.panel!
		const subscriptionSidepanel = subscribe('Application.panel!', handleEvent);
		// Clean up subscription on component unmount
		return () => {
			subscriptionSidepanel();
		};
	}, []);

	// TODO: think of how to automatically close the sidepanel on screen leave
	return (
		<Collapse
			id="app-sidepanel"
			isOpen={((sidepanelContent != undefined) && (mode === 'dock')) ? true : false}
			horizontal
			className={mode === 'overlay' ? 'app-sidepanel-overlay' : ''}
		>
			<Card className='app-sidepanel-card h-100'>
				<CardBody className='w-100 h-100 app-sidepanel-card-body'>
					{sidepanelContent}
				</CardBody>
				<div className='app-sidepanel-chevron-wrapper'>
					<i className='app-sidepanel-chevron bi bi-chevron-right' onClick={() => publish('Application.panel!', { mode: 'close' })}/>
				</div>
			</Card>
		</Collapse>
	)
}
