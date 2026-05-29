
import AnalyticsBarChart from "@/components/analytics/AnalyticsBarChart";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import DataTableOne from "@/components/tables/DataTables/TableOne/DataTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Objek Pajak | Bapenda DS",
  description: "Ini adalah Menu Objek Pajak Bapenda DS",
};
export default function Analytics() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <AnalyticsMetrics />
      </div>
      <div className="col-span-12">
        <AnalyticsBarChart />
      </div>
      <div className="col-span-12">
        <DataTableOne />
      </div>
      {/* <div className="col-span-12 xl:col-span-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TopChannel />
          <TopPages />
        </div>
      </div> */}
      {/* <div className="col-span-12 xl:col-span-5">
        <ActiveUsersChart />
      </div>
      <div className="col-span-12 xl:col-span-7">
        <AcquisitionChannelChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <SessionChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrderAnalytics />
      </div> */}
    </div>
  );
}
