/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";

import { AngleDownIcon, AngleUpIcon } from "@/icons";
import PaginationWithIcon from "./PaginationWithIcon";

type SortKey =
  | "npwpd"
  | "nama"
  | "tipe"
  | "wilayah"
  | "perangkat"
  | "trxTerakhir"
  | "total"
  | "status";

type SortOrder = "asc" | "desc";

interface RowData {
  npwpd: string;
  nama: string;
  tipe: string;
  wilayah: string;
  perangkat: string;
  trxTerakhir: string;
  total: number;
  status: string;
}

interface Props {
  startDate: string;
  endDate: string;
}

export default function DaftarObjekPajak({ startDate, endDate }: Props) {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortKey, setSortKey] = useState<SortKey>("npwpd");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "npwpd",      label: "NPWPD"       },
    { key: "nama",       label: "Objek Pajak"  },
    { key: "tipe",       label: "Tipe"         },
    { key: "wilayah",    label: "Wilayah"      },
    { key: "perangkat",  label: "Perangkat"    },
    { key: "trxTerakhir",label: "Trx Terakhir" },
    { key: "total",      label: "Total"        },
    { key: "status",     label: "Status"       },
  ];

  // ─── Skeleton rows ───────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.key} className="px-4 py-3">
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        </TableCell>
      ))}
    </TableRow>
  );

  // ─── Status badge ─────────────────────────────────────────────────────────
  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
      ACTIVE:   { bg: "bg-green-50 dark:bg-green-500/10",  text: "text-green-700 dark:text-green-400",  dot: "bg-green-500",  label: "Aktif"    },
      INACTIVE: { bg: "bg-red-50 dark:bg-red-500/10",    text: "text-red-700 dark:text-red-400",      dot: "bg-red-500",    label: "Nonaktif" },
    };
    const s = map[status?.toUpperCase()] ?? {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-600 dark:text-gray-300",
      dot: "bg-gray-400",
      label: status,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    );
  };

  // ─── Perangkat badge ──────────────────────────────────────────────────────
  const PerangkatBadge = ({ value }: { value: string }) => {
    const isOnline = value?.toUpperCase() === "ONLINE";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isOnline
          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      }`}>
        {value}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">

      {/* ── Header toolbar ─────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Show entries */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Tampilkan</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="appearance-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg pl-3 pr-7 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              {[5, 10, 25, 50].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span>entri</span>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04 9.37a6.33 6.33 0 1 1 12.67 0 6.33 6.33 0 0 1-12.67 0ZM9.375 1.54a7.83 7.83 0 1 0 4.98 13.88l2.82 2.82a.75.75 0 1 0 1.06-1.06l-2.82-2.82A7.83 7.83 0 0 0 9.376 1.54Z" fill="currentColor" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari objek pajak..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/60">
              <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8 text-center">
                No
              </TableCell>
              {columns.map(({ key, label }) => (
                <TableCell
                  key={key}
                  isHeader
                  className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer select-none group"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    <div className="flex flex-col gap-px opacity-50 group-hover:opacity-100 transition-opacity">
                      <AngleUpIcon
                        className={`w-3 h-3 ${sortKey === key && sortOrder === "asc" ? "text-blue-500 opacity-100" : "text-gray-400"}`}
                      />
                      <AngleDownIcon
                        className={`w-3 h-3 ${sortKey === key && sortOrder === "desc" ? "text-blue-500 opacity-100" : "text-gray-400"}`}
                      />
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-12 text-center text-gray-400 dark:text-gray-500" >
                  <div className="flex flex-col items-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-gray-600">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm">Tidak ada data ditemukan</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.npwpd + idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-sm text-center text-gray-400 dark:text-gray-500 w-8">
                    {startIndex + idx + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {item.npwpd}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap max-w-[200px] truncate">
                    {item.nama}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded">
                      {item.tipe}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {item.wilayah}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <PerangkatBadge value={item.perangkat} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(item.trxTerakhir)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap text-right">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {totalItems === 0
            ? "Tidak ada data"
            : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} entri`}
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