import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTicketThunk } from "../../features/tickets/ticketSlice";
import Button from "../common/Button";
import Input from "../common/Input";

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

const EditTicketForm = ({ ticket, users, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: ticket.title || "",
    description: ticket.description || "",
    category: ticket.category || "",
    priority: ticket.priority || "",
    assignedTo: ticket.assignedTo?._id || "",
  });

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
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
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
    setSaveLoading(true);
    const result = await dispatch(updateTicketThunk({ id, data: payload }));
    setSaveLoading(false);
    if (updateTicketThunk.fulfilled.match(result)) {
      navigate(`/tickets/${id}`, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" loading={saveLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditTicketForm;
