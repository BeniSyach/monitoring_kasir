import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LaporanTransaksiTable from "@/components/tables/DataTables/TableOne/laporan-pajak-table";
import LaporanTransaksiComponent from "@/components/tables/DataTables/TableOne/LaporanTransaksiComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Laporan Transaksi | Bapenda DS",
  description: "Ini adalah Menu Laporan Transaksi Bapenda DS",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Transaksi" />
      <LaporanTransaksiComponent />
    </div>
  );
}
