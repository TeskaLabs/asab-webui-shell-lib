import React from 'react';

const Icon = ({ icon, className }) => {
	if (typeof icon === "string") {
		return <i className={`${icon} ${className} sidebar-item-icon`}></i>
	}

	return <span className='sidebar-item-icon'>{icon}</span>;
}

export default Icon;