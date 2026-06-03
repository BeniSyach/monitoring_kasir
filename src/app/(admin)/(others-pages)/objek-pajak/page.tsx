import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objek Pajak | Bapenda DS",
  description: "Ini adalah Menu Objek Pajak Bapenda DS",
};

export default function Analytics() {
  return <AnalyticsClient />;
}