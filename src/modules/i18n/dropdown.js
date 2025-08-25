import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CHANGE_LANGUAGE } from './actions';
import { useAppStore } from 'asab_webui_components';


import {
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu, 
	DropdownToggle,
} from 'reactstrap';


export default function LanguageDropdown(props) {

	const { t, i18n } = useTranslation();

	const changeLanguage = (language) => {
		i18n.changeLanguage(language).then(() => {
			// if the hard refresh is needed: window.location.reload(false);
		});
	}

	const { dispatch } = useAppStore();

	useEffect(() => {
		dispatch({ type: CHANGE_LANGUAGE, language: i18n?.language ?? window.navigator.language })
	},[i18n.language])

	// This means that we basically don't know what languages are supported
	if ((i18n.options.supportedLngs == null) || (i18n.options.supportedLngs == false)) {
		return null;
	}

	return (
		<UncontrolledDropdown direction="down">
			<DropdownToggle nav caret>
				<LanguageFlag language={i18n.language} style={{width: '24px'}}/>
			</DropdownToggle>
			<DropdownMenu className="shadow">
				<DropdownItem header>{t('i18n|Language')}</DropdownItem>

				{i18n.options.supportedLngs.map((language, i) => {
					if (language == 'cimode') return null;
					return (
						<DropdownItem key={language} title={language} onClick={() => {changeLanguage(language)}}>
							<LanguageFlag language={language} className="pe-2" style={{width: '32px'}}/>
							{t('i18n|language|'+language)}
						</DropdownItem>
					);
				})}

			</DropdownMenu>
		</UncontrolledDropdown>
	);
}

function LanguageFlag({language, className, style}) {
	return (<img className={className} src={`media/locale/${language}.svg`} style={style}/>)
}
