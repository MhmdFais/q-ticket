import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const adminLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "All Tickets", path: "/tickets" },
  { label: "User Management", path: "/users" },
];

const agentLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Assigned Tickets", path: "/tickets" },
];

const userLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Tickets", path: "/tickets" },
  { label: "Create Ticket", path: "/tickets/create" },
];

const roleLinks = {
  admin: adminLinks,
  agent: agentLinks,
  user: userLinks,
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = roleLinks[user?.role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">QTicket</h1>
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {user?.role} Panel
        </p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-gray-400">{user?.email}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
