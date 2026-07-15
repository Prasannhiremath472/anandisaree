import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/admin/components/ui/Card";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { TagInput } from "@/admin/components/ui/TagInput";

export interface VariantOption {
  id: string;
  name: string; // e.g. "Size", "Color", or any custom label
  values: string[];
}

export interface VariantRow {
  key: string; // combination key, e.g. "Red / Medium"
  color?: string;
  size?: string;
  sku: string;
  priceDelta: string;
  stockQuantity: string;
}

interface VariantsCardProps {
  options: VariantOption[];
  onOptionsChange: (options: VariantOption[]) => void;
  variants: VariantRow[];
  onVariantsChange: (variants: VariantRow[]) => void;
  baseSku: string;
}

function cartesian(options: VariantOption[]): Record<string, string>[] {
  return options.reduce<Record<string, string>[]>(
    (acc, option) => {
      const next: Record<string, string>[] = [];
      for (const combo of acc) {
        for (const value of option.values) {
          next.push({ ...combo, [option.name]: value });
        }
      }
      return next;
    },
    [{}]
  );
}

export function VariantsCard({ options, onOptionsChange, variants, onVariantsChange, baseSku }: VariantsCardProps) {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftValues, setDraftValues] = useState<string[]>([]);

  function startAddOption() {
    const id = crypto.randomUUID();
    setEditingOptionId(id);
    setDraftName("");
    setDraftValues([]);
  }

  function regenerateVariants(nextOptions: VariantOption[]) {
    if (nextOptions.length === 0 || nextOptions.some((o) => o.values.length === 0)) {
      onVariantsChange([]);
      return;
    }

    const combos = cartesian(nextOptions);
    const nextVariants: VariantRow[] = combos.map((combo, i) => {
      const key = Object.values(combo).join(" / ");
      const existing = variants.find((v) => v.key === key);
      return (
        existing ?? {
          key,
          color: combo["Color"],
          size: combo["Size"],
          sku: `${baseSku || "SKU"}-${i + 1}`,
          priceDelta: "0",
          stockQuantity: "0",
        }
      );
    });
    onVariantsChange(nextVariants);
  }

  function saveOption() {
    if (!draftName.trim() || draftValues.length === 0) return;

    const nextOptions = [
      ...options.filter((o) => o.id !== editingOptionId),
      { id: editingOptionId!, name: draftName.trim(), values: draftValues },
    ];
    onOptionsChange(nextOptions);
    regenerateVariants(nextOptions);
    setEditingOptionId(null);
  }

  function deleteOption(id: string) {
    const nextOptions = options.filter((o) => o.id !== id);
    onOptionsChange(nextOptions);
    regenerateVariants(nextOptions);
    setEditingOptionId(null);
  }

  function updateVariantField(key: string, field: "sku" | "priceDelta" | "stockQuantity", value: string) {
    onVariantsChange(variants.map((v) => (v.key === key ? { ...v, [field]: value } : v)));
  }

  return (
    <Card title="Variants">
      <div className="space-y-3">
        {options.map((option) =>
          editingOptionId === option.id ? null : (
            <div key={option.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-neutral-800">{option.name}</p>
                <p className="text-xs text-neutral-500">{option.values.join(", ")}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingOptionId(option.id);
                    setDraftName(option.name);
                    setDraftValues(option.values);
                  }}
                  className="text-xs font-medium text-royal-600 hover:text-royal-700"
                >
                  Edit
                </button>
                <button type="button" onClick={() => deleteOption(option.id)} aria-label="Delete option" className="text-neutral-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        )}

        {editingOptionId && (
          <div className="space-y-3 rounded-lg border border-royal-200 bg-royal-50/30 p-4">
            <Field label="Option name" required>
              <input
                required
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Size, Color, or anything custom"
                className={inputClass}
              />
            </Field>
            <Field label="Option values" required>
              <TagInput values={draftValues} onChange={setDraftValues} placeholder="Type a value and press Enter" />
            </Field>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingOptionId(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveOption}
                disabled={!draftName.trim() || draftValues.length === 0}
                className="rounded-lg bg-royal-gradient px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {!editingOptionId && (
          <button
            type="button"
            onClick={startAddOption}
            className="flex items-center gap-1.5 text-sm font-medium text-royal-600 hover:text-royal-700"
          >
            <Plus className="h-4 w-4" /> {options.length === 0 ? "Add options like size or color" : "Add another option"}
          </button>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2 font-medium text-neutral-600">Variant</th>
                <th className="px-3 py-2 font-medium text-neutral-600">SKU</th>
                <th className="px-3 py-2 font-medium text-neutral-600">Price Adjustment (₹)</th>
                <th className="px-3 py-2 font-medium text-neutral-600">Stock</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.key} className="border-t border-neutral-100">
                  <td className="px-3 py-2 text-neutral-700">{v.key}</td>
                  <td className="px-3 py-2">
                    <input
                      value={v.sku}
                      onChange={(e) => updateVariantField(v.key, "sku", e.target.value)}
                      className="w-32 rounded border border-neutral-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.priceDelta}
                      onChange={(e) => updateVariantField(v.key, "priceDelta", e.target.value)}
                      className="w-24 rounded border border-neutral-300 px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.stockQuantity}
                      onChange={(e) => updateVariantField(v.key, "stockQuantity", e.target.value)}
                      className="w-20 rounded border border-neutral-300 px-2 py-1 text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
