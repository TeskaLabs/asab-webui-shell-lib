import React from 'react';

// IMPORTANT: This is intentionally low-depenency container!

const ErrorContainer = (props) => {

	const acknowledgeError = (e) => {
		e.preventDefault();
		props.ackError();
	}

	return (
		<div className="container">
			<div className="row mt-5">
				<div className="col">
					<div className="card shadow border-danger">
						<div className="card-header card-header-flex">
							<div className="flex-fill">
								<h3 className="text-danger">
									<i className="bi bi-emoji-frown pe-2" />
									Ooops. We are sorry. Something went wrong.
								</h3>
							</div>
							<button className="btn btn-primary" onClick={(e) => acknowledgeError(e)}>
								Acknowledge
							</button>
						</div>
						<div className="card-body">
							<h6 className="pe-5">{props.error?.toString()}</h6>
							<div>
								<pre><code>
									{props.errorInfo.componentStack}
								</code></pre>
							</div>
						</div>
						<div className="card-footer">
							{props.datetime?.toString() /*This is intentionaly not using DateTime to reduce internal dependency*/}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ErrorContainer;