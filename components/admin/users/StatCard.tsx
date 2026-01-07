interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "gray" | "purple" | "orange";
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-all ${
        colorClasses[color] || colorClasses.blue
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xs font-medium uppercase tracking-wide opacity-75">
          {title}
        </h3>
      </div>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
