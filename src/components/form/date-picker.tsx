import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
   defaultDate?: DateOption | string[];
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const onChangeRef = useRef(onChange);

  // Selalu update onChangeRef tanpa re-init flatpickr
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Init flatpickr HANYA SEKALI
  useEffect(() => {
    const isRange = mode === "range";

    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",

      // Format TAMPILAN: dd-mm-yyyy
      dateFormat: "d-m-Y",

      // parseDate: selalu parsing ISO yyyy-mm-dd dari defaultDate
      // sehingga tidak bentrok dengan dateFormat display
      parseDate: (dateStr, format): Date => {
        // Jika string berformat ISO yyyy-mm-dd, parse manual
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [yyyy, mm, dd] = dateStr.split("-").map(Number);
          return new Date(yyyy, mm - 1, dd);
        }
        // Fallback ke parser bawaan flatpickr
        return flatpickr.parseDate(dateStr, format) ?? new Date();
      },

      defaultDate,
      closeOnSelect: !isRange,

      onChange: (selectedDates, dateStr, instance) => {
        // Tutup picker setelah tanggal akhir dipilih (mode range)
        if (isRange && selectedDates.length === 2) {
          instance.close();
        }

        // Ganti separator "to" flatpickr menjadi "s/d"
        const formattedStr = dateStr.replace(" to ", " s/d ");

        // Panggil onChange terbaru via ref
        const handler = onChangeRef.current;
        if (handler) {
          if (Array.isArray(handler)) {
            handler.forEach((hook) =>
              hook(selectedDates, formattedStr as unknown as string, instance)
            );
          } else {
            (handler as (dates: Date[], str: string, instance: flatpickr.Instance) => void)(
              selectedDates,
              formattedStr,
              instance
            );
          }
        }
      },
    });

    if (!Array.isArray(flatPickr)) {
      fpRef.current = flatPickr;
    }

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty: init hanya sekali saat mount

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}