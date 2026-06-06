const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all bg-white
          ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
