const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-lg px-4 py-3">
      {message}
    </div>
  );
};

export default ErrorMessage;
