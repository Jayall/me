import Navbar from "./components/Navbar";
import MajorInfo from "./components/MajorInfo";
import Competitions from "./components/Competition";
import SkillProgress from "./components/SkillProgress";
import ContactInfo from "./components/ContactInfo";
import ContactMe from "./components/ContactMe";


const Homepage = () => {
	return (
		<div className="w-full h-full inset-0">
			<Navbar />
			<MajorInfo />
			<Competitions />
			<ContactInfo />
			<ContactMe />
		</div>
	)
};

export default Homepage;