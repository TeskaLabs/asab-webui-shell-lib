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
	const [sidepanelContent, setSidepanelContent] = useState(undefined);
	const [mode, setMode] = useState('dock');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleEvent = (message) => {
			if (message.mode === 'close') {
				setIsOpen(false);
				return;
			}

			if (isOpen === false) {
				setMode((message?.layout === 'overlay') ? 'overlay' : 'dock');
				setSidepanelContent(message.mode);
				setIsOpen(true);
			}
		};

		// Subscription to Application.panel!
		const subscriptionSidepanel = subscribe('Application.panel!', handleEvent);
		// Clean up subscription on component unmount
		return () => {
			subscriptionSidepanel();
		};
	}, []);

	// TODO: think of how to automatically close the sidepanel on screen leave
	return (
		<div id="app-sidepanel" className={(mode === 'overlay') ? 'app-sidepanel-overlay' : ''}>
			<Collapse
				className='h-100'
				isOpen={isOpen}
				horizontal
				onExited={() => setSidepanelContent(undefined)}
			>
				<Card className="app-sidepanel-card h-100">
					<CardBody className="w-100 h-100 app-sidepanel-card-body">
						{sidepanelContent}
					</CardBody>
					<div className="app-sidepanel-chevron-wrapper">
						<i
							className="app-sidepanel-chevron bi bi-chevron-right"
							onClick={() => publish('Application.panel!', { mode: 'close' })}
						/>
					</div>
				</Card>
			</Collapse>
		</div>
	);
}
