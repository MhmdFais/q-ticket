import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getTicketByIdThunk,
  updateTicketThunk,
} from "../features/tickets/ticketSlice";
import { getAllUsersThunk } from "../features/users/userSlice";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";

const CATEGORIES = [
  "Bug",
  "Feature Request",
  "Technical Issue",
  "Payment Issue",
  "Account Issue",
  "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all bg-white text-gray-700
        ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        }`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const EditTicket = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTicket, loading, error } = useSelector(
    (state) => state.tickets,
  );
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const [errors, setErrors] = useState({});

  const initialForm = useMemo(
    () => ({
      title: currentTicket?.title || "",
      description: currentTicket?.description || "",
      category: currentTicket?.category || "",
      priority: currentTicket?.priority || "",
      assignedTo: currentTicket?.assignedTo?._id || "",
    }),
    [currentTicket],
  );

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(getTicketByIdThunk(id));
    if (user?.role === "admin") {
      dispatch(getAllUsersThunk({ role: "agent", limit: 100 }));
    }
  }, [dispatch, id, user]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.priority) newErrors.priority = "Priority is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const payload = { ...form };
    if (!payload.assignedTo) delete payload.assignedTo;
    const result = await dispatch(updateTicketThunk({ id, data: payload }));
    if (updateTicketThunk.fulfilled.match(result)) {
      navigate(`/tickets/${id}`, { replace: true });
    }
  };

  if (loading && !currentTicket)
    return (
      <Layout title="Edit Ticket">
        <Spinner />
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Ticket
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Edit Ticket</h2>
            {currentTicket && (
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {currentTicket.ticketNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Fields marked with <span className="text-red-400">*</span> are
            required
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <Input
              label="Title"
              isRequired
              type="text"
              name="title"
              placeholder="Brief summary of the issue"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all bg-white resize-none
                  ${
                    errors.description
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                  }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Category */}
            <SelectField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={errors.category}
              required
              placeholder="Select a category"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            {/* Priority */}
            <SelectField
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              error={errors.priority}
              required
              placeholder="Select a priority level"
              options={PRIORITIES.map((p) => ({ value: p, label: p }))}
            />

            {/* Assign To - Admin only */}
            {user?.role === "admin" && (
              <SelectField
                label="Assign To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                error={errors.assignedTo}
                required={false}
                placeholder="Select an agent (optional)"
                options={users.map((agent) => ({
                  value: agent._id,
                  label: `${agent.name} — ${agent.email}`,
                }))}
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(`/tickets/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditTicket;
