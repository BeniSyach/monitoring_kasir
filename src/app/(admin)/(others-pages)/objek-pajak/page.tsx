"use client";

import AnalyticsBarChart from "@/components/analytics/AnalyticsBarChart";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";

import DatePicker from "@/components/form/date-picker";

import React, { useState } from "react";
import DaftarObjekPajak from "@/components/tables/DataTables/TableOne/DaftarObjekPajak";

export default function Analytics() {

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    now.getMonth();

  // =========================
  // DEFAULT RANGE BULAN INI
  // =========================

  const lastDate =
    new Date(year, month + 1, 0).getDate();

  // Format dd-mm-yyyy untuk display & state
  const firstDay =
    `01-${String(month + 1).padStart(2, "0")}-${year}`;

  const lastDay =
    `${String(lastDate).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;

  // Format yyyy-mm-dd untuk defaultDate flatpickr
  const firstDayIso =
    `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const lastDayIso =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDate).padStart(2, "0")}`;

  // =========================
  // INPUT RANGE
  // =========================
  const [inputRange, setInputRange] =
    useState(`${firstDay} s/d ${lastDay}`);

  // =========================
  // APPLIED RANGE
  // =========================
  const [dateRange, setDateRange] =
    useState(`${firstDay} s/d ${lastDay}`);

  // =========================
  // HANDLE FILTER
  // =========================
  const handleFilter = () => {
    setDateRange(inputRange);
  };

  // =========================
  // SPLIT RANGE
  // Konversi dd-mm-yyyy ke yyyy-mm-dd untuk dikirim ke komponen chart
  // =========================
  const toIso = (ddmmyyyy: string) => {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [startDisplay, endDisplay] =
    dateRange.split(" s/d ");

  const startDate = startDisplay ? toIso(startDisplay) : "";
  const endDate   = endDisplay   ? toIso(endDisplay)   : "";

  return (
    <div className="space-y-4">

      {/* FILTER */}
      <div className="inline-flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="w-[280px]">

          <DatePicker
            id="periode"
            mode="range"
            label="Periode"
            defaultDate={[firstDayIso, lastDayIso]}
            onChange={(
              _selectedDates,
              dateStr
            ) => {
              // dateStr sudah berformat "dd-mm-yyyy s/d dd-mm-yyyy" dari DatePicker
              setInputRange(dateStr);
            }}
          />

        </div>

        <button
          onClick={handleFilter}
          className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Filter
        </button>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12">

          <AnalyticsMetrics  
            startDate={startDate}
            endDate={endDate} />

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