import { TbBinaryTreeFilled } from "react-icons/tb";
import { IoHardwareChipSharp } from "react-icons/io5";
import { FaHammer } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import pfp from "../assets/sarySelfie.jpg"

const AboutMe = () => {
	return (
		<div className="flex flex-col gap-4 items-start py-4 px-8 w-full">
			<div className="w-40 h-40 rounded-full">
				<img src={pfp}  alt="Me" className="object-cover w-full h-full rounded-full" />
			</div>
			<div className="flex flex-col items-start">
				<p className="font-bold">RAKOTOARISOA Ando Tiana</p>
				<p>Antananarivo, Madagascar</p>
			</div>
			<div>
				<ul className="flex flex-col gap-2">
					<li className="text-left">I love maths and it helps me to improve at engineering and problem solving. </li>
					<li className="text-left">My electronics background shapes how I think about systems: from the hardware layer up.</li>
					<li className="text-left">I'm obsessed with algorithms and system design and I believe that obsession can overtake talent and sometimes experiences.</li>
				</ul>
			</div>
		</div>
	)
}

const Difference = () => {
	return (
		<div className="w-full">
			<strong>what I bring to the table ?</strong>
			<div className="flex justify-center items-center">
				<ul className="flex flex-col gap-4 items-start p-10">
					<li className="flex gap-2 items-center"><IoHardwareChipSharp />Hardware - Software bridge</li>
					<li className="flex gap-2 items-center"><TbBinaryTreeFilled />Strong DSA fundamentals</li>
					<li className="flex gap-2 items-center"><BsStack />Fullstack + low-level depth</li>
					<li className="flex gap-2 items-center"><FaHammer />Engineer mindset - build things</li>
				</ul>
			</div>
		</div>
	)
}

const ContactInfo = () => {
	console.log('Contact info loaded');
	return (
		<div className="w-full py-10 grid grid-cols-1 md:grid-cols-2">
			<div class="w-full h-full">
				<AboutMe />
			</div>
			<div className="w-full h-full pt-5">
				<Difference />
			</div>
		</div>
	);
}

export default ContactInfo;