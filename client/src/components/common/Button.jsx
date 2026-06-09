const variants = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
};

const Button = ({
  children,
  variant = "primary",
  loading,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
