
const SkillProgressCard = ({skillProgressList, cardName}) => {
	return (
		<div className="border relative w-full">
			<p>{cardName}</p>
			<div className="flex flex-col gap-2">
			{
				skillProgressList.map((item, index) => (
					<div key={index} className="flex flex-col w-full items-start gap-4">
						<p>item.name</p>
						<div className="relative">
							<div className="progress" aria-valuemin={0} aria-valuemax={100}></div>
							<p className="absolute bottom-0 right-0">{item.progression} %</p>
						</div>
					</div>
				))
			}
			</div>
		</div>
	)
};

export default SkillProgressCard;