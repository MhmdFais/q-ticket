import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import ConfirmModal from "../common/ConfirmModal";

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
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-60 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
          <span className="text-base font-semibold text-gray-800">QTicket</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 px-3 mb-2">
          Menu
        </p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/tickets"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 shrink-0">
        <button
          onClick={() => setShowLogout(true)}
          className="w-full px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors duration-150 text-left"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirm Modal */}
      <ConfirmModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        variant="danger"
      />
    </div>
  );
};

export default Sidebar;
