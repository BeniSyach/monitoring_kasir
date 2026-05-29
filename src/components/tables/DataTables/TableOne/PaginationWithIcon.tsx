/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PaginationWithIcon({
  totalPages,
  initialPage = 1,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync internal state ketika parent mengubah halaman (misal reset ke 1)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];

    if (totalPages <= 7) {
      // Tampilkan semua halaman jika <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(<li key={i}>{renderPageButton(i)}</li>);
      }
      return pages;
    }

    // Selalu tampilkan halaman pertama
    pages.push(<li key={1}>{renderPageButton(1)}</li>);

    if (currentPage > 3) {
      pages.push(<li key="ellipsis-start">{renderEllipsis("start")}</li>);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(<li key={i}>{renderPageButton(i)}</li>);
    }

    if (currentPage < totalPages - 2) {
      pages.push(<li key="ellipsis-end">{renderEllipsis("end")}</li>);
    }

    // Selalu tampilkan halaman terakhir
    pages.push(<li key={totalPages}>{renderPageButton(totalPages)}</li>);

    return pages;
  };

  const renderPageButton = (page: number) => (
    <button
      onClick={() => handlePageChange(page)}
      className={`flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium transition-colors ${
        currentPage === page
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-700 dark:text-gray-400 hover:bg-blue-500/[0.08] hover:text-blue-600 dark:hover:text-blue-400"
      }`}
    >
      {page}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="flex items-center justify-center w-10 h-10 text-sm text-gray-400 dark:text-gray-500"
    >
      …
    </span>
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 xl:justify-end">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <ul className="flex items-center gap-0.5">{renderPageNumbers()}</ul>

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}