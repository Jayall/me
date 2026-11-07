import { identity } from "../portfolioData";
import PixelMosaic from "./PixelMosaic";

const Footer = () => (
	<footer className="site-footer">
		<div className="footer-inner">
			<PixelMosaic />
			<div className="footer-bottom">
				<p>
					{identity.legacyName} · {identity.role}
				</p>
				<p>{identity.location}</p>
				<p>
					© {new Date().getFullYear()} ·{" "}
					<a href="#top">back to top ↑</a>
				</p>
			</div>
		</div>
	</footer>
);

export default Footer;
