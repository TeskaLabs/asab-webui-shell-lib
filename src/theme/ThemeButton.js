import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NavLink } from 'reactstrap';

import { CHANGE_THEME } from "./actions";

const ThemeButton = ({theme}) => {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();

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


function mapStateToProps(state) {
	return {
		theme: state.theme,
	}
}

export default connect(mapStateToProps)(ThemeButton);
