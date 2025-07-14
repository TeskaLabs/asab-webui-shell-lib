import React from 'react';
import { useTranslation } from "react-i18next";

import {
    Container, Row, Col,
    Card, CardBody
} from 'reactstrap';

import './InformationalCard.scss';

const illustrations = {
    invalid: "/media/illustrations/invalid-route.svg",
    unauthorized: "/media/illustrations/unauthorized-access.svg"
}

export default function InformationalCard(props) {
    const {type, title, text, resource} = props;
    const { t } = useTranslation();

    return(
        <Container className="h-100 container" fluid>
            <Card className="status-card">
                <CardBody className="status-card-body">
                    <Row className="status-row">
                        <Col>
                            <img src={ illustrations[type] } alt={ t(title) }/>
                            { type === "unauthorized" && resource ? (
                                <>
                                    <p className="status-card-text">{t(text)}:</p>
                                    <h5 className="card-title">{resource}</h5>
                                </>
                            ) : <h6 className="status-card-text">{t(text)}</h6> }
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    )
}