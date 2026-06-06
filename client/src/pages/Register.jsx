import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk, clearError } from "../features/auth/authSlice";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">Q</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">QTicket</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-base font-semibold text-gray-800 mb-1">
            Create account
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">
            Fill in the details to get started
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg px-3 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white text-gray-700"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
              <p className="text-xs text-gray-400">
                Admin accounts are assigned manually
              </p>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          QTicket — Ticket Management System
        </p>
      </div>
    </div>
  );
};

export default Register;
