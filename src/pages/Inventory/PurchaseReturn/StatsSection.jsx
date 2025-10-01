/* eslint-disable react/prop-types */
import { SummaryCard } from "./SummaryCard";

 const StatsSection = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 mb-6">
    {stats.map((stat) => (
      <SummaryCard key={stat.id} {...stat} />
    ))}
  </div>
);
export  default StatsSection