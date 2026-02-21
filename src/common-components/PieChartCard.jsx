import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#14b8a6", "#0ea5e9", "#f97316", "#ef4444", "#6366f1", "#22c55e"];

const PieChartCard = ({ data = [] }) => {
  const hasData = data.length > 0;

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
      <div className="mb-2 text-sm font-semibold text-base-content">Category Split</div>
      <div className="h-64 rounded-xl border border-base-300 bg-base-100 p-1 md:h-72">
        {!hasData ? (
          <div className="grid h-full place-items-center text-sm text-base-content/60">
            No category data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="categoryName"
                cx="50%"
                cy="46%"
                outerRadius={78}
                innerRadius={42}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.categoryId}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default PieChartCard;
