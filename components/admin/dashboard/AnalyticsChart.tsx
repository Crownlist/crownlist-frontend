import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardData } from "@/types/admin-dashboard";

// Empty chart data for initial state
const emptyChartData = Array(12)
  .fill(0)
  .map((_, i) => ({
    name: new Date(0, i).toLocaleString("default", { month: "short" }),
    value: 0,
  }));

interface AnalyticsChartProps {
  dashboardData: DashboardData | null;
}

const AnalyticsChart = ({ dashboardData }: AnalyticsChartProps) => {
  // Prepare chart data
  const chartData = dashboardData?.analytics?.monthlyListings?.length
    ? dashboardData.analytics.monthlyListings.map(
        (item: { monthName: string; count: number }) => ({
          name: item.monthName.slice(0, 3),
          value: item.count,
        })
      )
    : emptyChartData;

  return (
    <div className="mb-12 bg-white p-2 md:p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Monthly Listings</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a0066" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1a0066" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              formatter={(value: number) => [`${value} listings`, "Listings"]}
              labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1a0066"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
