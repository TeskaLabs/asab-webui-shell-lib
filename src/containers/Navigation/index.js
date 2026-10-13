import React, { Component } from 'react';
import { SET_NAVIGATION_ITEMS } from '../../actions';

export default class Navigation extends Component {

	constructor(app) {
		super(app);
		this.App = app;
		this.Items = [];
	}

	addItem(item) {
		/* Example item:
			{
				path: '/some/path',	// Url path
				end: true,		// Whether path must be matched exactly
				name: 'Some Name',	// Route name
				openFor: ['/some/path/*'], // Optional array of routes to keep the item open
				icon: 'bi bi-folder', // Icon
				resource: 'some:resource:access', // Resource to check access for
				order: 100, // Order of the item
				children: [ // Optional array of children
					{
						path: '/some/path/child',
						end: true,
						name: 'Child Name',
						openFor: ['/some/path/child'], // Optional array of routes to keep the child highlighted
						icon: 'bi bi-file', // Icon
						resource: 'some:resource:access', // Resource to check access for
						order: 100, // Order of the child
					}
				],
			}
		*/

		// Find an existing item with the same name
		const existingItem = this.Items.find(existing => existing.name === item.name);

		if (existingItem) {
			// If found, merge the children (concatenate arrays while avoiding duplicates based on a name)
			const existingChildrenNames = new Set(existingItem.children.map(child => child.name));
			item.children.forEach(child => {
				if (!existingChildrenNames.has(child.name)) {
					existingItem.children.push(child);
				}
			});
		} else {
			// If no existing item, push the new item
			this.Items.push(item);
		}
		if (this.App.AppStore) {
			this.App.AppStore.dispatch?.({ type: SET_NAVIGATION_ITEMS, navItems: this.Items });
		}
	}

}
