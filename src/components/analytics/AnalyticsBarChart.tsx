/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React,
{
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import { ApexOptions }
from "apexcharts";

import ChartTab
from "../common/ChartTab";

import { formatDate }
from "@/hooks/useModal";

const ReactApexChart =
  dynamic(
    () => import("react-apexcharts"),
    {
      ssr: false,
    }
  );

interface Props {
  startDate: string;
  endDate: string;
}

export default function AnalyticsBarChart({
  startDate,
  endDate,
}: Props) {

  const [tab, setTab] =
    useState<"Harian" | "Bulanan">(
      "Harian"
    );

  const [categories, setCategories] =
    useState<string[]>([]);

  const [seriesData, setSeriesData] =
    useState<number[]>([]);

  const loadChart = async () => {

    try {

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/chart?startDate=${startDate}&endDate=${endDate}&type=${tab.toLowerCase()}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      setCategories(
        data.categories
      );

      setSeriesData(
        data.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    loadChart();

  }, [startDate, endDate, tab]);

  const formatShortNumber = (
  value: number
) => {

  if (value >= 1_000_000_000) {
    return (
      (value / 1_000_000_000)
        .toFixed(1)
        .replace(".0", "") + " M"
    );
  }

  if (value >= 1_000_000) {
    return (
      (value / 1_000_000)
        .toFixed(1)
        .replace(".0", "") + " Jt"
    );
  }

  if (value >= 1_000) {
    return (
      (value / 1_000)
        .toFixed(0) + " Rb"
    );
  }

  return value.toString();
};

const options: ApexOptions = {
  colors: ["#465fff"],

  chart: {
    fontFamily: "Outfit, sans-serif",
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
  },

  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "45%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },

  dataLabels: {
    enabled: false,
  },

  stroke: {
    show: true,
    width: 4,
    colors: ["transparent"],
  },

  xaxis: {
    categories: categories,

    axisBorder: {
      show: false,
    },

    axisTicks: {
      show: false,
    },
  },

  yaxis: {
    labels: {
      formatter: (value) =>
        formatShortNumber(value),
    },
  },

  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Outfit",
  },

  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },

  fill: {
    opacity: 1,
  },

  tooltip: {
    x: {
      show: false,
    },

    y: {
      formatter: (val: number) =>
        new Intl.NumberFormat(
          "id-ID"
        ).format(val),
    },
  },
};

  const series = [
    {
      name: "Transaksi",
      data: seriesData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">

      <div className="flex flex-wrap items-start justify-between gap-5">

        <div>

          <h3 className="mb-1 text-lg font-semibold text-gray-800">
            Transaksi Periode {formatDate(startDate)} s/d {formatDate(endDate)}
          </h3>

          <span className="block text-sm text-gray-500">
            Statistik transaksi objek pajak
          </span>

        </div>

        <ChartTab
          selected={tab}
          onChange={setTab}
        />

      </div>

      <div className="max-w-full overflow-x-auto">

        <div className="-ml-5 min-w-[1000px] xl:min-w-full pl-2">

          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />

        </div>

      </div>

    </div>
  );
}