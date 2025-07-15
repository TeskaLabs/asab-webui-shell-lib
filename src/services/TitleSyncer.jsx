// Title syncer
import { useEffect } from "react";
import { useAppStore } from '../components/store/AppStore.jsx';
import { SET_SUBTITLE } from '../actions';
import TitleService from "./TitleService";

export default function TitleSyncer() {
	const { dispatch } = useAppStore();

	useEffect(() => {
		if (!TitleService?.instance) return;

		const handleSubtitleChange = (subtitle) => {
			dispatch({ type: SET_SUBTITLE, subtitle: subtitle });
		};

		TitleService.instance.addChangeListener(handleSubtitleChange);

		return () => {
			TitleService.instance.removeChangeListener(handleSubtitleChange);
		};
	}, [dispatch]);

	return null;
}
