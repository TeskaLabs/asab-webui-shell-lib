/*
	Status-specific alerts shown instead of the generic exception alert
	Extend for other response statuses
*/
export const STATUS_ALERTS = {
	408: {
		level: 'warning',
		message: 'General|The request timed out. Please try again.',
	},
	413: {
		level: 'warning',
		message: 'General|The file is too large to upload. Please choose a smaller file and try again.',
	},
	414: {
		level: 'warning',
		message: 'General|The request is too long for the server to process. Try simplifying your query or clearing filters. If the problem continues, contact your administrator.',
	},
	429: {
		level: 'warning',
		message: 'General|Too many requests. Please wait a moment and try again.',
	},
	431: {
		level: 'warning',
		message: 'General|Your browser sent more data than the server allows. Try signing out and back in. If the problem continues, contact your administrator.',
	},
	502: {
		level: 'danger',
		message: 'General|The server is temporarily unreachable. Please try again later.',
	},
	503: {
		level: 'danger',
		message: 'General|The service is temporarily unavailable. Please try again later.',
	},
	507: {
		level: 'danger',
		message: 'General|The server does not have enough storage to complete this request. Please try again later or contact your administrator.',
	},
	// TODO: add more response statuses
};
