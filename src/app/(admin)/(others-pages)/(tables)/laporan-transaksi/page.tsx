import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTableOne from "@/components/tables/DataTables/TableOne/DataTableOne";
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
      <div className="space-y-6">
        <ComponentCard title="Laporan Transaksi">
          <DataTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
