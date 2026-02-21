import { BarChartCard, PieChartCard } from "../../common-components";

const ChartsSection = ({ categorySummary = [], trendSummary = [] }) => {
  return (
    <section>
      <h2 className="text-base font-semibold text-base-content md:text-lg">Charts</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <PieChartCard data={categorySummary} />
        <BarChartCard data={trendSummary} />
      </div>
    </section>
  );
};

export default ChartsSection;
