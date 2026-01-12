import React, { lazy } from 'react';
import { Module } from 'asab_webui_components';

const InvitationScreen = lazy(() => import('./InvitationScreen'));

export default class InviteModule extends Module {

	constructor(app, name) {
		super(app, 'InviteModule');
		// Invitation screen
		app.Router.addRoute({
			path: '/auth/invite',
			end: true,
			name: 'Invite',
			component: InvitationScreen,
			resource: 'seacat:tenant:assign'
		});
	}
}
