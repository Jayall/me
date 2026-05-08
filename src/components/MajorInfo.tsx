import { useState } from "react";
import SkillCard from "./SkillCard";

const MajorInfo = ({openToOp = true}) => {
	const name = "RAKOTOARISOA Ando Tiana"
	const stacks = "Electronic Engineer x Fullstack developper x DSA"
	const description = "I'm passionate about engineering, web developpement and embedded system"
	const webSkills = ["React", "Nodejs", "FastAPI", "Tailwind", "Postgresql"];
	const eeSkills = ["Embedded", "FPGA", "IoT", "Network"];
	const dsaSkills = ["Algorithms", "Optimization", "Number theory", "Data Structure", "Matrices"];
	const otherSkills = ["Data Science", "DevOps", "cybersecurity"];

	return (
		<div className="w-full h-full py-10 px-5">
			{openToOp && (
				<div className="flex items-center py-4 text-green-700 gap-3">
					<div className="h-3 w-3 rounded-xl bg-green-700"></div>
					<p> open to opportunities</p>
				</div>)
			}
			<div className="flex flex-col justify-center items-start gap-10">
			<p className="font-bold text-4xl">{ name }</p>
			<div className="flex flex-col items-start gap-2">
				<p className="font-semibold text-xl">{ stacks }</p>
				<p className="text-xl">{ description }</p>
			</div>
			<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
				{webSkills.map((skill) => <SkillCard skillName={skill} category="web" />)}
				{eeSkills.map((skill) => <SkillCard skillName={skill} category="ee" />)}
				{dsaSkills.map((skill) => <SkillCard skillName={skill} category="dsa" />)}
				{otherSkills.map((skill) => <SkillCard skillName={skill} category="other" />)}
			</div>
			</div>
		</div>
	)
};

export default MajorInfo;