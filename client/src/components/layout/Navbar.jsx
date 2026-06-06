import { useSelector } from "react-redux";
import Badge from "../common/Badge";

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <Badge label={user?.role} />
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
