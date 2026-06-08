import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersThunk,
  updateUserStatusThunk,
  updateUserRoleThunk,
} from "../features/users/userSlice";
import Layout from "../components/layout/Layout";
import Spinner from "../components/common/Spinner";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import Modal from "../components/common/Modal";

const ROLES = ["user", "agent", "admin"];

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, pagination, loading } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    page: 1,
    limit: 10,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllUsersThunk(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleStatusToggle = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const confirmStatusToggle = async () => {
    setActionLoading(true);
    await dispatch(
      updateUserStatusThunk({
        id: selectedUser._id,
        data: { isActive: !selectedUser.isActive },
      }),
    );
    setActionLoading(false);
    setShowStatusModal(false);
    setSelectedUser(null);
  };

  const confirmRoleChange = async () => {
    setActionLoading(true);
    await dispatch(
      updateUserRoleThunk({
        id: selectedUser._id,
        data: { role: selectedRole },
      }),
    );
    setActionLoading(false);
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  return (
    <Layout title="User Management">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {/* User Management */}
            </h2>
            <p className="text-m text-gray-600 mt-0.5">
              {pagination?.total ?? 0} total users
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={handleSearch}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-600"
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Joined
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-gray-400 text-sm"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-700 font-medium">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {u.email}
                      </td>
                      <td className="px-5 py-3">
                        <Badge label={u.role} />
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium
                          ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-red-50 text-red-500 border border-red-100"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {/* Role change */}
                          {u._id !== currentUser._id && (
                            <button
                              onClick={() => handleRoleChange(u)}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 hover:border-indigo-300 px-2 py-1 rounded-lg transition-colors"
                            >
                              Change Role
                            </button>
                          )}
                          {/* Status toggle */}
                          {u._id !== currentUser._id && (
                            <button
                              onClick={() => handleStatusToggle(u)}
                              className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors border
                                ${
                                  u.isActive
                                    ? "text-red-500 border-red-200 hover:border-red-300 hover:text-red-600"
                                    : "text-emerald-600 border-emerald-200 hover:border-emerald-300 hover:text-emerald-700"
                                }`}
                            >
                              {u.isActive ? "Deactivate" : "Activate"}
                            </button>
                          )}
                          {u._id === currentUser._id && (
                            <span className="text-xs text-gray-400">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 text-xs border rounded-lg ${
                        page === pagination.page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Toggle Modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmStatusToggle}
        title={selectedUser?.isActive ? "Deactivate User" : "Activate User"}
        message={`Are you sure you want to ${selectedUser?.isActive ? "deactivate" : "activate"} ${selectedUser?.name}?`}
        confirmLabel={selectedUser?.isActive ? "Deactivate" : "Activate"}
        variant={selectedUser?.isActive ? "danger" : "success"}
        loading={actionLoading}
      />

      {/* Role Change Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
        }}
        title={`Change Role — ${selectedUser?.name}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Select New Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-gray-700"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              loading={actionLoading}
              disabled={selectedRole === selectedUser?.role}
            >
              Save Role
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
