const StatCard = ({ label, value, color = "indigo" }) => {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    gray: "text-gray-500 bg-gray-100",
    red: "text-red-500 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };

  const [textColor, bgColor] = colors[color].split(" ");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div
        className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}
      >
        <span className={`text-sm font-bold ${textColor}`}>#</span>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <p className={`text-3xl font-bold ${textColor}`}>{value ?? 0}</p>
      </div>
    </div>
  );
};

export default StatCard;
