import React from "react";
import Badge from "../ui/badge/Badge";

const mockData = [
  {
    id: 1,
    title: "Dasar Pengenaan Pajak",
    value: "24.7M",
    change: "+20%",
    direction: "up",
    comparisonText: "Vs last month",
  },
  {
    id: 2,
    title: "Pajak",
    value: "55.9M",
    change: "+4%",
    direction: "up",
    comparisonText: "Vs last month",
  },
  {
    id: 3,
    title: "Total Transaksi",
    value: "54M",
    change: "-1.59%",
    direction: "down",
    comparisonText: "Vs last month",
  },

];

const AnalyticsMetrics: React.FC = () => {
return (
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
    {mockData.map((item) => (
      <div
        key={item.id}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          {item.title}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {item.value}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              color={
                item.direction === "up"
                  ? "success"
                  : item.direction === "down"
                  ? "error"
                  : "warning"
              }
            >
              <span className="text-xs">{item.change}</span>
            </Badge>

            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              {item.comparisonText}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
};

export default AnalyticsMetrics;
