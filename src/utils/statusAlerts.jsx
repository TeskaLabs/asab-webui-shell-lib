/*
	Status-specific alerts shown instead of the generic exception alert.
	This is a extension to the addAlertFromException function in the Application.js file.
	
	The 502, 503 and 504 errors are handled directly in the Application.js file, since it does not render an alert at all.
*/
export const STATUS_ALERTS = {
	408: {
		level: 'warning',
		message: 'General|The request timed out. Please try again.',
	},
	413: {
		level: 'warning',
		message: 'General|The request is too large for the server to process. If you are uploading a file, please choose a smaller one.',
	},
	429: {
		level: 'warning',
		message: 'General|Too many requests. Please wait a moment and try again.',
	},
	// TODO: add more response statuses if needed
};
