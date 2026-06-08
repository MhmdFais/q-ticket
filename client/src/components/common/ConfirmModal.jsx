import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 z-10 border border-gray-100">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-4
          ${variant === "danger" ? "bg-red-50" : "bg-indigo-50"}`}
        >
          <span
            className={`text-xl ${variant === "danger" ? "text-red-500" : "text-indigo-500"}`}
          >
            {variant === "danger" ? "!" : "?"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
