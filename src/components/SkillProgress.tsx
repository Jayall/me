import SkillProgressCard from "./SkillProgressCard";

const SkillProgress = () => {
	const data = {
		'frontend & backend': [
			{'name': 'React', 'progression': 60}
		]
	}

	return (
		<div className="flex flex-col p-5 gap-5 items-start">
			<p className="text-5xl font-bold">Skills & Progression</p>
			<SkillProgressCard skillProgressList={data['frontend & backend']} cardName={'frontend & backend'} />
		</div>
	);
};

export default SkillProgress;