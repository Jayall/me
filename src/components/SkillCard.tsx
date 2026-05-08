import { useState } from "react";

const SkillCard = ({skillName, category}) => {
	const colors = {
		"web": {"text": "text-blue-800", "bg": "bg-blue-100"},
		"ee": {"text": "text-green-800", "bg": "bg-green-100"},
		"dsa": {"text": "text-purple-800", "bg": "bg-purple-100"},
		"other": {"text": "text-teal-800", "bg": "bg-teal-100"}
	};

	const color = colors[category];
	if (color === undefined)
		return (<></>);

	return (
		<div className={`${color.bg} inline-flex p-2 rounded-full items-center justify-center text-center overflow-hidden`}>
			<p className={`${color.text} font-semibold`}>{skillName}</p>
		</div>
	);
};

export default SkillCard;