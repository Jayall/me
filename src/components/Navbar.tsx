import { WiAlien } from "react-icons/wi";

const Navbar = () => {
  return (
    <div className="flex top-0 p-4 w-full bg-slate-100 justify-between items-center">
      <div className="flex gap-2 justify-center items-center">
        <WiAlien />
        Portfolio
      </div>
      <div>
        <a href="#">blogs</a>
      </div>
    </div>
  );
};

export default Navbar;
