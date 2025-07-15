// Header syncer
import { useEffect } from "react";
import { useAppStore } from '../components/store/AppStore.jsx';
import { SET_HEADER_NAVIGATION_ITEMS } from '../actions';
import HeaderService from "./HeaderService";

export default function HeaderSyncer() {
	const { dispatch } = useAppStore();

	useEffect(() => {
		if (!HeaderService?.instance) return;

		const handleChange = (items) => {
			dispatch({ type: SET_HEADER_NAVIGATION_ITEMS, headerNavItems: items });
		};

		HeaderService.instance.addChangeListener(handleChange);

		return () => {
			HeaderService.instance.removeChangeListener(handleChange);
		};
	}, [dispatch]);

	return null;
}
