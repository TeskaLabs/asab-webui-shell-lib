import React from 'react';
import { useTranslation } from "react-i18next";
import { useAppSelector } from '../../../components/store/AppStore.jsx';
import { Badge } from 'reactstrap';

export default function PreviewFlag() {
	const { t } = useTranslation();
	let name = useAppSelector(state => state?.header?.flag);
	const lowercasedName = name?.toLowerCase();

	if(lowercasedName === "preview") {
		name = t("General|Feature preview")
	} else if(lowercasedName === "alpha") {
		name = t("Alpha");
	} else if(lowercasedName === "beta") {
		name = t("Beta");
	} else {
		return null;
	}

	return (
		<Badge className="mx-2" color="primary">
			{ name }
		</Badge>
	);
}
