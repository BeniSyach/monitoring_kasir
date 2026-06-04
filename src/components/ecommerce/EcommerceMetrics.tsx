"use client";

import React, { useEffect, useState } from "react";

type StatItem = {
  label: string;
  value: number;
  color: string;
};

type OfflineItem = {
  name: string;
  date: string;
};

type DashboardState = {
  loading: boolean;
  total: number;
  stats: StatItem[];
  offlineData: OfflineItem[];
};

export const EcommerceMetrics = () => {

  const [dashboard, setDashboard] =
    useState<DashboardState>({
      loading: true,

      total: 0,

      stats: [
        {
          label: "Active",
          value: 0,
          color: "bg-cyan-400",
        },
        {
          label: "Inactive",
          value: 0,
          color: "bg-orange-400",
        },
        {
          label: "Offline",
          value: 0,
          color: "bg-pink-500",
        },
        {
          label: "Closed",
          value: 0,
          color: "bg-green-500",
        },
      ],

      offlineData: [],
    });

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        // =========================
        // LOAD STATS
        // =========================
        const statsRes = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/stores/stats`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (!statsRes.ok) {
          throw new Error("Gagal load stats");
        }

        const statsJson = await statsRes.json();

        // =========================
        // LOAD OFFLINE DATA
        // =========================
        const offlineRes = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/stores/offline/latest`,
          {
            cache: "no-store",
             credentials: "include",
          }
        );

        if (!offlineRes.ok) {
          throw new Error("Gagal load offline data");
        }

        const offlineJson = await offlineRes.json();

        // =========================
        // SET STATE SEKALI SAJA
        // =========================
        setDashboard({
          loading: false,

          total: statsJson.totalStore ?? 0,

          stats: [
            {
              label: "Active",
              value: statsJson.storeAktif ?? 0,
              color: "bg-cyan-400",
            },
            {
              label: "Inactive",
              value: statsJson.storeTidakAktif ?? 0,
              color: "bg-orange-400",
            },
            {
              label: "Offline",
              value: statsJson.offline ?? 0,
              color: "bg-pink-500",
            },
            {
              label: "Closed",
              value: statsJson.tutup ?? 0,
              color: "bg-green-500",
            },
          ],

          offlineData: offlineJson ?? [],
        });

      } catch (error) {

        console.error(error);

        setDashboard((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    loadDashboard();

  }, []);

if (dashboard.loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ========================= */}
      {/* CARD TOTAL */}
      {/* ========================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        {/* Header */}
        <div className="flex items-center gap-1">

          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Pemasangan
          </h3>

          <svg
            className="h-3 w-3 text-sky-500 dark:text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>

        </div>

        {/* Total */}
        <div className="flex items-center justify-center py-6">

          <h1 className="text-4xl font-light text-gray-700 dark:text-gray-100">
            {dashboard.total}
          </h1>

        </div>

        {/* Bottom */}
        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">

          {/* Color Bar */}
          <div className="flex h-1.5 w-full">

            {dashboard.stats.map((item, index) => (
              <div
                key={index}
                className={`${item.color} flex-1`}
              />
            ))}

          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 text-center">

            {dashboard.stats.map((item, index) => (

              <div
                key={index}
                className="py-3"
              >

                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>

                <h4 className="mt-1 text-xl font-light text-sky-900 dark:text-sky-300">
                  {item.value}
                </h4>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* CARD OFFLINE */}
      {/* ========================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          5 Besar Wajib Pajak Offline Terkini
        </h3>

        {/* Header Table */}
        <div className="mt-6 grid grid-cols-12 border-b border-gray-200 pb-3 text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">

          <div className="col-span-1">
            No.
          </div>

          <div className="col-span-7">
            Nama
          </div>

          <div className="col-span-4">
            Tanggal
          </div>

        </div>

        {/* Body Table */}
        <div>

          {dashboard.offlineData.length === 0 && (

            <div className="py-5 text-center text-sm text-gray-400 dark:text-gray-500">
              Tidak ada data offline
            </div>

          )}

          {dashboard.offlineData.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-12 items-center border-b border-gray-100 py-4 last:border-0 dark:border-gray-800"
            >

              <div className="col-span-1 text-sm text-gray-700 dark:text-gray-300">
                {index + 1}.
              </div>

              <div className="col-span-7 text-sm text-gray-800 dark:text-gray-200">
                {item.name}
              </div>

              <div className="col-span-4 text-sm font-medium text-red-500 dark:text-red-400">
                {item.date}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};