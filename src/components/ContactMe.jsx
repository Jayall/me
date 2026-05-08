import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const ContactMe = () => {
	return (
		<div className="p-10">
			<p className="text-left font-medium">Let's work together</p>
			<div className="grid grid-cols-1 md:grid-cols-3 p-5 gap-5">
				<div className="border rounded-lg flex items-center justify-start px-5 h-fit py-2">
					<div className="h-10 w-10 flex justify-center items-center rounded-md bg-slate-100"><MdEmail /></div>
					<div className="flex flex-col items-start px-2">
						<strong>Email</strong>
						<p>rktandoscoud@gmail.com</p>
					</div>
				</div>
				<div className="border rounded-lg flex items-center justify-start px-5 h-fit py-2">
					<div className="h-10 w-10 flex justify-center items-center rounded-md bg-slate-100"><FaGithub /></div>
					<div className="flex flex-col items-start px-2">
						<strong>Github</strong>
						<p>jayall</p>
					</div>
				</div>
				<div className="border rounded-lg flex items-center justify-start px-5 h-fit py-2">
					<div className="h-10 w-10 flex justify-center items-center rounded-md bg-slate-100"><FaLinkedin /></div>
					<div className="flex flex-col items-start px-2">
						<strong>Linkedin</strong>
						<p>Ando Tiana Rakotoarisoa</p>
					</div>
				</div>
			</div>
		</div>
	)
};

export default ContactMe;