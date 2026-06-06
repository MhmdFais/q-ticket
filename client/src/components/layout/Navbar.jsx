import { useSelector } from "react-redux";
import Badge from "../common/Badge";

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-3">
        <Badge label={user?.role} />
        <span className="text-sm text-gray-600">{user?.name}</span>
      </div>
    </div>
  );
};

export default Navbar;
