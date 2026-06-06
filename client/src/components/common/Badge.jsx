const variants = {
  // status
  Open: "bg-blue-50 text-blue-600 border border-blue-100",
  "In Progress": "bg-amber-50 text-amber-600 border border-amber-100",
  Resolved: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Closed: "bg-gray-100 text-gray-500 border border-gray-200",

  // priority
  Low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Medium: "bg-amber-50 text-amber-600 border border-amber-100",
  High: "bg-orange-50 text-orange-600 border border-orange-100",
  Urgent: "bg-red-50 text-red-600 border border-red-100",

  // role
  admin: "bg-purple-50 text-purple-600 border border-purple-100",
  agent: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  user: "bg-gray-100 text-gray-500 border border-gray-200",
};

const Badge = ({ label }) => {
  const style =
    variants[label] || "bg-gray-100 text-gray-500 border border-gray-200";
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${style}`}>
      {label}
    </span>
  );
};

export default Badge;
