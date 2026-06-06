const variants = {
  // status
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",

  // priority
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",

  // role
  admin: "bg-purple-100 text-purple-700",
  agent: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-700",
};

const Badge = ({ label }) => {
  const style = variants[label] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
};

export default Badge;
