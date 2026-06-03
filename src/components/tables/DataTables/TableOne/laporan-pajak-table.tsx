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
    <div className="overflow-hidden bg-white dark:bg-white/[0.03] rounded-xl">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 8, 10].map((value) => (
                <option
                  key={value}
                  value={value}
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  {value}
                </option>
              ))}
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>
        </div>

        <div className="relative">
          <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill=""
              />
            </svg>
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
            <TableRow>

                <TableCell
                isHeader
                className="px-4 py-3 border border-gray-100 min-w-[180px]"
                >
                NPWPD
                </TableCell>

                <TableCell
                isHeader
                className="px-4 py-3 border border-gray-100 min-w-[350px]"
                >
                Nama Objek Pajak
                </TableCell>

                <TableCell
                isHeader
                className="px-4 py-3 border border-gray-100 min-w-[180px]"
                >
                Wilayah
                </TableCell>

                {days.map((day) => (
                <TableCell
                    key={day}
                    isHeader
                    className="px-4 py-3 text-center border border-gray-100 min-w-[100px]"
                >
                    {day}
                </TableCell>
                ))}

            </TableRow>
            </TableHeader>
            <TableBody>
            {pivotData.map((item, index) => (
                <TableRow key={index}>

                <TableCell className="px-4 py-3 border border-gray-100">
                     {item.npwpd}
                </TableCell>

                <TableCell className="px-4 py-3 border border-gray-100">
                   {item.nama}
                </TableCell>

                <TableCell className="px-4 py-3 border border-gray-100">
                   {item.wilayah}
                </TableCell>

                {days.map((day) => (
                    <TableCell
                    key={day}
                    className="px-4 py-3 text-right border border-gray-100"
                    >
                    {(
            item.transaksiHarian[day] || 0
          ).toLocaleString("id-ID")}
                    </TableCell>
                ))}

                </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          {/* Left side: Showing entries */}
          <div className="pb-3 xl:pb-0">
            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
              Showing {startIndex + 1} to {endIndex} of {totalItems} entries
            </p>
          </div>
         <PaginationWithIcon
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
        </div>
      </div>
    </div>
  );
}
