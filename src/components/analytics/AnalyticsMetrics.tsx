/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Props {
  startDate: string;
  endDate: string;
}

interface MetricsResponse {
  dasarPengenaanPajak: number;
  pajak: number;
  totalTransaksi: number;
}

export default function AnalyticsMetrics({
  startDate,
  endDate,
}: Props) {

  const [metrics, setMetrics] =
    useState<MetricsResponse>({
      dasarPengenaanPajak: 0,
      pajak: 0,
      totalTransaksi: 0,
    });

  const [loading, setLoading] =
    useState(false);

  // FORMAT ANGKA PENDEK
const formatCurrencyShort = (
  value: number
) => {

  if (value >= 1_000_000_000_000) {

    return (
      (value / 1_000_000_000_000)
        .toFixed(1)
        .replace(".0", "") + "T"
    );
  }

  if (value >= 1_000_000_000) {

    return (
      (value / 1_000_000_000)
        .toFixed(1)
        .replace(".0", "") + "M"
    );
  }

  if (value >= 1_000_000) {

    return (
      (value / 1_000_000)
        .toFixed(1)
        .replace(".0", "") + "Jt"
    );
  }

  return new Intl.NumberFormat(
    "id-ID"
  ).format(value);
};

const formatFullNumber = (
  value: number
) => {

  return new Intl.NumberFormat(
    "id-ID"
  ).format(value);
};

const items = [

  {
    title: "Dasar Pengenaan Pajak",

    shortValue:
      formatCurrencyShort(
        metrics.dasarPengenaanPajak
      ),

    fullValue:
      formatFullNumber(
        metrics.dasarPengenaanPajak
      ),
  },

  {
    title: "Pajak",

    shortValue:
      formatCurrencyShort(
        metrics.pajak
      ),

    fullValue:
      formatFullNumber(
        metrics.pajak
      ),
  },

  {
    title: "Total Transaksi",

    shortValue:
      formatCurrencyShort(
        metrics.totalTransaksi
      ),

    fullValue:
      formatFullNumber(
        metrics.totalTransaksi
      ),
  },

];

  // LOAD API
  const loadMetrics = useCallback(async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/metrics?startDate=${startDate}&endDate=${endDate}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data metrics"
        );
      }

      const data: MetricsResponse =
        await response.json();

      setMetrics(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }

  }, [startDate, endDate]);

  // EFFECT
  useEffect(() => {

    loadMetrics();

  }, [loadMetrics]);


  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">

      {items.map((item, index) => (

        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >

          <p className="text-sm text-gray-500">
            {item.title}
          </p>

        <div className="mt-3">

          <h4 className="text-2xl font-bold text-gray-800">
            {item.shortValue}
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            {item.fullValue}
          </p>

        </div>

        </div>
      ))}

    </div>
  );
}