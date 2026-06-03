"use client";

import React, { useState } from "react";
import DatePicker from "@/components/form/date-picker";

interface FilterPeriodeProps {
  onFilter: (startDate: string, endDate: string) => void;
}

export default function FilterPeriode({
  onFilter,
}: FilterPeriodeProps) {
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

  const firstDayIso = `${year}-${String(
    month + 1
  ).padStart(2, "0")}-01`;

  const lastDayIso = `${year}-${String(
    month + 1
  ).padStart(2, "0")}-${String(lastDate).padStart(
    2,
    "0"
  )}`;

  const [inputRange, setInputRange] = useState(
    `${firstDay} s/d ${lastDay}`
  );

  const toIso = (date: string) => {
    const [dd, mm, yyyy] = date.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleFilter = () => {
    const [start, end] = inputRange.split(" s/d ");

    onFilter(
      toIso(start),
      toIso(end)
    );
  };

  return (
    <div className="inline-flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="w-[280px]">
        <DatePicker
          id="periode"
          mode="range"
          label="Periode"
          defaultDate={[
            firstDayIso,
            lastDayIso,
          ]}
          onChange={(
            _selectedDates,
            dateStr
          ) => {
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
  );
}