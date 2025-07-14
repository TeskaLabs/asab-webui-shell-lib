import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../components/store/AppStore.jsx';
import { Spinner } from 'asab_webui_components';

import {
	Container, Row, Col
} from 'reactstrap';

import { getBrandImage } from '../components/branding/BrandImage';

import './SuspenseScreen.scss';

export default function SuspenseScreen(props) {
	const [ brandImage, setBrandImage ] = useState(undefined);
	const theme = useAppSelector(state => state.theme);

	useEffect(() => {
		setBrandImage(getBrandImage(props, theme));
	}, [theme]);

	return(
		<Container className="h-100" fluid>
			<div className="h-100 suspense-content-wrapper">
				<Col>
					<Row className="justify-content-center mb-4">
						{brandImage ?
							<img
								className="suspense-img"
								src={brandImage?.full}
								alt="Loading..."
							/>
						:
							<h2 className="text-center text-primary">Loading...</h2>
						}
					</Row>
					<Spinner />
				</Col>
			</div>
		</Container>
	)
}
