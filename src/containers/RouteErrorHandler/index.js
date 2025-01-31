import React from 'react';

import ErrorContainer from './ErrorContainer';

class RouteErrorHandler extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null, datetime: null, locationHash: null };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
			datetime: new Date(),
			locationHash: window.location?.hash
		})
	}

	// Acknowledge error
	ackError = () => {
		// TODO: send error to Sentry
		/*
			If location hash differs from the one stored in state,
			use the location hash of the route, else use the default
			location
		*/
		if (this.state.locationHash != window.location?.hash) {
			window.location.hash;
		} else {
			// Default location
			window.location.hash = "#/";
		}
		this.setState({
			error: null,
			errorInfo: null,
			datetime: null,
			locationHash: null
		});
	};

	render() {
		if (this.state.errorInfo) {
			return (
				<ErrorContainer
					error={this.state.error}
					errorInfo={this.state.errorInfo}
					datetime={this.state.datetime}
					ackError={this.ackError}
				/>
			);
		}

		return this.props.children;
	}
}

export default RouteErrorHandler;
