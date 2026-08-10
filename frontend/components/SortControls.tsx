import { useState } from "react";

export type SortRule = {
  field: string;
  order: "asc" | "desc";
};

interface SortControlsProps {
  sortFields: SortRule[];
  onAddSort: (field: string) => void;
  onRemoveSort: (index: number) => void;
  onToggleSort: (index: number) => void;
}

export default function SortControls({
  sortFields,
  onAddSort,
  onRemoveSort,
  onToggleSort
}: SortControlsProps) {

  const [selected, setSelected] = useState("");

  const options = [
    { value: "L_SystemPrice", label: "Price" },
    { value: "ListingContractDate", label: "Date Listed" },
    { value: "LM_Int2_3", label: "Square Footage" },
    { value: "L_Keyword2", label: "Beds" },
  ];

  const labelMap: Record<string, string> = {
    L_SystemPrice: "Price",
    ListingContractDate: "Date Listed",
    LM_Int2_3: "Square Footage",
    L_Keyword2: "Beds",
  };

  return (
    <div className="flex items-center gap-3 ml-6">

      <select
        value={selected}
        onChange={(e) => {
          onAddSort(e.target.value);
          setSelected("");
        }}
        className="animated-dropdown bg-element rounded-full"
      >
        <option value="" disabled hidden>Sort By</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        {sortFields.map((s, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 bg-element rounded-full flex items-center gap-2"
          >
            <span>{labelMap[s.field]}</span>

            <button
              onClick={() => onToggleSort(idx)}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              {s.order === "asc" ? "↑" : "↓"}
            </button>

            <button
              onClick={() => onRemoveSort(idx)}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
