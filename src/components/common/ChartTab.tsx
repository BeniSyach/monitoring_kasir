import React from "react";

interface Props {
  selected: "Harian" | "Bulanan";

  onChange: (
    value: "Harian" | "Bulanan"
  ) => void;
}

export default function ChartTab({
  selected,
  onChange,
}: Props) {

  const getButtonClass = (
    option: "Harian" | "Bulanan"
  ) =>

    selected === option

      ? "shadow-theme-xs text-gray-900 bg-white"

      : "text-gray-500";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">

      <button
        onClick={() =>
          onChange("Harian")
        }
        className={`px-3 py-2 font-medium rounded-md text-sm ${getButtonClass(
          "Harian"
        )}`}
      >
        Harian
      </button>

      <button
        onClick={() =>
          onChange("Bulanan")
        }
        className={`px-3 py-2 font-medium rounded-md text-sm ${getButtonClass(
          "Bulanan"
        )}`}
      >
        Bulanan
      </button>

    </div>
  );
}