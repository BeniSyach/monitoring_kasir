import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTableTwo from "@/components/tables/DataTables/TableTwo/DataTableTwo";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "User Management | Bapenda DS",
  description: "Ini adalah Menu User Management Bapenda DS",
};

export default function DataTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="User Management">
          <DataTableTwo />
        </ComponentCard>

      </div>
    </div>
  );
}
