import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'reactstrap';
import { CHANGE_THEME } from "./actions";
import { useAppStore, useAppSelector } from 'asab_webui_components';

const ThemeButton = () => {
	const { t } = useTranslation();
	const { dispatch } = useAppStore();
	const theme = useAppSelector(state => state.theme);

	const changeTheme = () => {
		const newTheme = (theme == "light") ? "dark" : "light";
		dispatch({
			type: CHANGE_THEME,
			theme: newTheme
		});
	}

	return (
		<NavLink
			onClick={changeTheme}
			title={t("General|Change theme")}
			href="#"
		>
			<i className="bi bi-circle-half"></i>
		</NavLink>
	);
}

export default ThemeButton;
