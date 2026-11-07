const urlMap = {
	"codeforces": "https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3628695-3029920.png",
	"leetcode": "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
	"codechef": "https://cdn.simpleicons.org/codechef/orange",
};

const AchievementCard = ({rating, site, color, title, profileUrl, handle}) => {
	const textColor = `text-${color}-700`;
	const bgColor = `bg-${color}-100`;
	const img = urlMap[site];

	console.log(`loaded ${textColor}, ${bgColor}`)

	return (
		<div className={`relative group w-80 h-44 ${bgColor} rounded-2xl p-6 border border-gray-700 shadow-lg transition-all hover:scale-105 cursor-pointer`}
			onClick={() => {
				window.open(profileUrl, '_blank');
			}}>
			<div className="absolute bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition"></div>
			<div className="relative flex flex-col h-full justify-between">
			<div className="flex justify-between items-start">
				<div>
				<p className={`${textColor} text-xs font-bold uppercase tracking-widest`} >{site}</p>
				<p className={`${textColor} text-2xl font-bold`}>{handle}</p>
				</div>
				<img src={img} className="w-8 h-8 filter"/>
			</div>
			<div className="flex items-end justify-between">
				<div>
				<p className={`${textColor} font-medium text-xl`}>{title}</p>
				</div>
				<div className="text-right">
				<p className="text-gray-400 text-sm">Rating</p>
				<p className={`${textColor} text-3xl font-black`}>{rating}</p>
				</div>
			</div>
			</div>
		</div>
	);
};

export default AchievementCard;