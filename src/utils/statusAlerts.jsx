/*
	Status-specific alerts shown instead of the generic exception alert
	Extend for other response statuses
*/
export const STATUS_ALERTS = {
	413: {
		level: 'warning',
		message: 'General|The file is too large to upload. Please choose a smaller file and try again.',
	},
	// TODO: add more response statuses
};
