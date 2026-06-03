"use client";

import React, { useState } from "react";

import AnalyticsBarChart from "@/components/analytics/AnalyticsBarChart";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import DaftarObjekPajak from "@/components/tables/DataTables/TableOne/DaftarObjekPajak";
import FilterPeriode from "@/components/analytics/FilterPeriode";

export default function AnalyticsClient() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  const lastDate = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = `01-${String(month + 1).padStart(
    2,
    "0"
  )}-${year}`;

  const lastDay = `${String(lastDate).padStart(
    2,
    "0"
  )}-${String(month + 1).padStart(
    2,
    "0"
  )}-${year}`;

  const [dateRange, setDateRange] = useState(
    `${firstDay} s/d ${lastDay}`
  );

  const toIso = (ddmmyyyy: string) => {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [startDisplay, endDisplay] =
    dateRange.split(" s/d ");

  const startDate = startDisplay
    ? toIso(startDisplay)
    : "";

  const endDate = endDisplay
    ? toIso(endDisplay)
    : "";

  return (
    <div className="space-y-4">
      <FilterPeriode
        onFilter={(startDate, endDate) => {
          setDateRange(
            `${startDate.split("-").reverse().join("-")} s/d ${endDate
              .split("-")
              .reverse()
              .join("-")}`
          );
        }}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <AnalyticsMetrics
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="col-span-12">
          <AnalyticsBarChart
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="col-span-12">
          <DaftarObjekPajak
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
}