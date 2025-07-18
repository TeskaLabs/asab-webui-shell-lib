import React from 'react';
import { InformationalCard } from "asab_webui_components";
import {Container} from "reactstrap";


export default function InvalidRouteScreen() {
	return(
		<Container className="h-100 container" fluid>
			<InformationalCard type="invalid" title="InvalidRouteScreen|Nothing here"
							   text="InvalidRouteScreen|Sorry, we can't find the page you are looking for." />
		</Container>
	)
}
