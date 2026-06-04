/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

type ChartItem = {
  name: string;
  total: number;
};

type TransactionItem = {
  outlet: string;
  pajak: number;
  total: number;
};

export default function MonthlySalesChart() {

  const [activeTab, setActiveTab] =
    useState("transaksi");

  const [loading, setLoading] =
    useState(true);

  const [transaksiData, setTransaksiData] =
    useState<ChartItem[]>([]);

  const [pajakData, setPajakData] =
    useState<ChartItem[]>([]);

  const [transactions, setTransactions] =
    useState<TransactionItem[]>([]);

  const [search, setSearch] =
    useState("");

  // =========================
  // PAGINATION
  // =========================
  const [pageSize, setPageSize] =
    useState(5);

  const [currentPage, setCurrentPage] =
    useState(1);

  // =====================================
  // LOAD API
  // =====================================
  useEffect(() => {

    const loadData = async () => {

      try {

        // =========================
        // TOP TRANSAKSI
        // =========================
        const transaksiRes = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/dashboard/top-transaksi`,
          {
            cache: "no-store",
             credentials: "include",
          }
        );

        const transaksiJson =
          await transaksiRes.json();

        setTransaksiData(transaksiJson);

        // =========================
        // TOP PAJAK
        // =========================
        const pajakRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/top-pajak`,
          {
            cache: "no-store",
             credentials: "include",
          }
        );

        const pajakJson =
          await pajakRes.json();

        setPajakData(pajakJson);

        // =========================
        // LAST TRANSACTIONS
        // =========================
        const lastRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/last-transactions`,
          {
            cache: "no-store",
             credentials: "include",
          }
        );

        const lastJson =
          await lastRes.json();

        setTransactions(lastJson);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    loadData();

  }, []);

  // =====================================
  // CURRENT DATA
  // =====================================
  const currentData =
    activeTab === "transaksi"
      ? transaksiData
      : pajakData;

  // =====================================
  // MAX VALUE
  // =====================================
  const maxValue =
    currentData.length > 0
      ? Math.max(
          ...currentData.map(
            (item) => item.total
          )
        )
      : 0;

  // =====================================
  // FORMAT NUMBER
  // =====================================
  const formatNumber = (
    number: number
  ) => {

    return new Intl.NumberFormat(
      "id-ID"
    ).format(number);
  };

  // =====================================
  // FILTERED TRANSACTIONS
  // =====================================
  const filteredTransactions =
    useMemo(() => {

      return transactions.filter(
        (item) =>
          item.outlet
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [transactions, search]);

  // =====================================
  // TOTAL PAGE
  // =====================================
  const totalPages =
    Math.ceil(
      filteredTransactions.length /
        pageSize
    );

  // =====================================
  // PAGINATED DATA
  // =====================================
  const paginatedTransactions =
    useMemo(() => {

      const start =
        (currentPage - 1) *
        pageSize;

      const end =
        start + pageSize;

      return filteredTransactions.slice(
        start,
        end
      );

    }, [
      filteredTransactions,
      currentPage,
      pageSize,
    ]);

  // =====================================
  // RESET PAGE SAAT SEARCH
  // =====================================
  useEffect(() => {

    setCurrentPage(1);

  }, [search, pageSize]);

if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* CARD 1 */}
      {/* ========================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <h2 className="text-base font-medium text-gray-700 dark:text-gray-300">
          5 Besar Retribusi Objek Pajak
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-gray-200 dark:border-gray-700">

          <button
            onClick={() => setActiveTab("transaksi")}
            className={`px-3 pb-3 text-sm font-semibold transition ${
              activeTab === "transaksi"
                ? "border-b-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            TRANSAKSI
          </button>

          <button
            onClick={() => setActiveTab("pajak")}
            className={`ml-4 px-3 pb-3 text-sm font-semibold transition ${
              activeTab === "pajak"
                ? "border-b-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            PAJAK
          </button>

        </div>

        {/* Content */}
        <div className="mt-4 border border-gray-200 p-4 dark:border-gray-700">

          {currentData.map((item, index) => {

            const percentage = maxValue > 0 ? (item.total / maxValue) * 100 : 0;

            return (
              <div key={index} className="mb-5 last:mb-0">

                <div className="mb-2 flex items-center justify-between gap-3">

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {index + 1}. {item.name}
                  </p>

                  <p className="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatNumber(item.total)}
                  </p>

                </div>

                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">

                  <div
                    className="h-2 rounded-full bg-purple-400 transition-all duration-500 dark:bg-purple-500"
                    style={{ width: `${percentage}%` }}
                  />

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ========================= */}
      {/* CARD 2 */}
      {/* ========================= */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
            100 Transaksi Terakhir
          </h3>

          <div className="relative w-full md:w-80">

            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-blue-400"
            />

          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-200 text-left dark:border-gray-700">

                <th className="pb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Outlet
                </th>

                <th className="pb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pajak
                </th>

                <th className="pb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedTransactions.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800"
                >

                  <td className="py-4 text-sm text-gray-800 dark:text-gray-200">
                    {item.outlet}
                  </td>

                  <td className="py-4 text-sm text-gray-800 dark:text-gray-200">
                    {formatNumber(item.pajak)}
                  </td>

                  <td className="py-4 text-sm text-gray-800 dark:text-gray-200">
                    {formatNumber(item.total)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between dark:text-gray-400">

          {/* Left */}
          <div className="flex items-center gap-2">

            <span>Baris per halaman</span>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded border border-gray-200 bg-white px-2 py-1 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>

          </div>

          {/* Center */}
          <div>
            {filteredTransactions.length === 0
              ? "0"
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  filteredTransactions.length
                )}`}{" "}
            of {filteredTransactions.length}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`rounded px-3 py-1 ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              ‹
            </button>

            <div className="px-2">
              Page {currentPage} / {totalPages || 1}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`rounded px-3 py-1 ${
                currentPage >= totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              ›
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}