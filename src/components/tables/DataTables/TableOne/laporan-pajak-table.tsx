/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { AngleDownIcon, AngleUpIcon } from "@/icons";
import Image from "next/image";
import PaginationWithIcon from "./PaginationWithIcon";

interface ApiRow {
  npwpd: string;
  nama: string;
  tipe: string;
  wilayah: string;
  perangkat: string;
  trxTerakhir: string;
  total: number;
  status: string;
}

interface PivotRow {
  npwpd: string;
  nama: string;
  wilayah: string;
  perangkat: string;
  status: string;
  transaksiHarian: Record<number, number>;
}


interface Props {
  startDate: string;
  endDate: string;
}

type SortOrder = "asc" | "desc";

export default function LaporanTransaksiTable({
  startDate,
  endDate,
}: Props) {
    const [data, setData] = useState<ApiRow[]>([]);
     const [loading, setLoading] = useState(true);
       const [sortKey, setSortKey] = useState("npwpd");
       const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

    const loadData = async () => {
      try {
        setLoading(true);
  
        const params = new URLSearchParams({
          startDate,
          endDate,
          page: String(currentPage - 1),
          size: String(itemsPerPage),
          search: searchTerm,
          sortKey,
          sortOrder,
        });
  
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/objek-pajak?${params}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );
  
        const result = await res.json();
  
        setData(result.data ?? []);
        setTotalPages(result.totalPages ?? 0);
        setTotalItems(result.totalItems ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      setCurrentPage(1);
    }, [startDate, endDate, searchTerm, itemsPerPage]);
  
    useEffect(() => {
      loadData();
    }, [startDate, endDate, currentPage, sortKey, sortOrder, itemsPerPage, searchTerm]);

  const daysInMonth = useMemo(() => {
  if (!startDate) return 31;

  const date = new Date(startDate);

  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
}, [startDate]);

const days = Array.from(
  { length: daysInMonth },
  (_, i) => i + 1
);

const pivotData = useMemo<PivotRow[]>(() => {
  const map = new Map<string, PivotRow>();

  data.forEach((item) => {
    const key = item.npwpd;

    if (!map.has(key)) {
      map.set(key, {
        npwpd: item.npwpd,
        nama: item.nama,
        wilayah: item.wilayah,
        perangkat: item.perangkat,
        status: item.status,
        transaksiHarian: {},
      });
    }

    const day = new Date(
      item.trxTerakhir
    ).getDate();

    map.get(key)!.transaksiHarian[day] =
      Number(item.total);
  });

  return Array.from(map.values());
}, [data]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  
const endIndex = Math.min(
  startIndex + itemsPerPage,
  totalItems
);

return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-800/40">

        {/* Show entries */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Tampilkan
          </span>

          <div className="relative">
            <select
              className="h-8 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-7 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option key={value} value={value} className="dark:bg-gray-800">
                  {value}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>

          <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            entri
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="currentColor"/>
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari data..."
            className="h-9 w-full rounded-lg border border-gray-200 bg-white py-0 pl-9 pr-4 text-sm text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-blue-500 xl:w-[280px]"
          />
        </div>

      </div>

      {/* ── Table ── */}
      <div className="max-w-full overflow-x-auto">
        <Table>

          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/60">

              <TableCell
                isHeader
                className="whitespace-nowrap border-b border-gray-100 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 min-w-[180px] dark:border-gray-800 dark:text-gray-400"
              >
                NPWPD
              </TableCell>

              <TableCell
                isHeader
                className="whitespace-nowrap border-b border-gray-100 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 min-w-[350px] dark:border-gray-800 dark:text-gray-400"
              >
                Nama Objek Pajak
              </TableCell>

              <TableCell
                isHeader
                className="whitespace-nowrap border-b border-gray-100 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 min-w-[180px] dark:border-gray-800 dark:text-gray-400"
              >
                Wilayah
              </TableCell>

              {days.map((day) => (
                <TableCell
                  key={day}
                  isHeader
                  className="whitespace-nowrap border-b border-gray-100 px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 min-w-[110px] dark:border-gray-800 dark:text-gray-400"
                >
                  {day}
                </TableCell>
              ))}

            </TableRow>
          </TableHeader>

          <TableBody>
            {pivotData.map((item, index) => (
              <TableRow
                key={index}
                className="group border-b border-gray-50 transition-colors last:border-0 hover:bg-blue-50/50 dark:border-gray-800/60 dark:hover:bg-blue-950/20"
              >

                <TableCell className="px-5 py-3.5 text-sm font-mono font-medium text-gray-600 dark:text-gray-400">
                  {item.npwpd}
                </TableCell>

                <TableCell className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item.nama}
                </TableCell>

                <TableCell className="px-5 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {item.wilayah}
                  </span>
                </TableCell>

                {days.map((day) => {
                  const val = item.transaksiHarian[day] || 0;
                  return (
                    <TableCell
                      key={day}
                      className={`px-5 py-3.5 text-right text-sm tabular-nums transition-colors ${
                        val > 0
                          ? "font-medium text-gray-800 dark:text-gray-200"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                    >
                      {val > 0 ? val.toLocaleString("id-ID") : "—"}
                    </TableCell>
                  );
                })}

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/60 px-5 py-4 xl:flex-row dark:border-gray-800 dark:bg-gray-800/40">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {startIndex + 1}–{endIndex}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {totalItems}
          </span>{" "}
          entri
        </p>

        <PaginationWithIcon
          totalPages={totalPages}
          initialPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </div>
    </div>
  );
}
