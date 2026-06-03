"use client";

import ComponentCard from "@/components/common/ComponentCard";
import LaporanTransaksiTable from "./laporan-pajak-table";
import { useState } from "react";
import FilterPeriode from "@/components/analytics/FilterPeriode";

export default function LaporanTransaksiComponent() {
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
    <div className="space-y-6">
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
        <ComponentCard title="Laporan Transaksi">
          <LaporanTransaksiTable 
           startDate={startDate}
            endDate={endDate}
            />
        </ComponentCard>
    </div>
  )
}