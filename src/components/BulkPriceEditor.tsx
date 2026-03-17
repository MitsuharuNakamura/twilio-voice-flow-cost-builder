import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  getBillingOptions,
  type BillingType,
} from '../data/nodeDefinitions';
import { useI18n } from '../i18n';

export function BulkPriceEditor({ onClose }: { onClose: () => void }) {
  const nodeDefinitions = useFlowStore((s) => s.nodeDefinitions);
  const updateNodeDefinition = useFlowStore((s) => s.updateNodeDefinition);

  const { t, lang, tCat } = useI18n();
  const billingOptions = getBillingOptions(lang);

  // Local editable state: array of { id, label, billing, priceStr }
  const [rows, setRows] = useState<
    { id: string; label: string; category: string; billing: BillingType; priceStr: string }[]
  >([]);

  useEffect(() => {
    setRows(
      nodeDefinitions.map((d) => ({
        id: d.id,
        label: d.label,
        category: d.category,
        billing: d.billing,
        priceStr: String(d.unitPrice),
      })),
    );
  }, [nodeDefinitions]);

  const updateRow = (index: number, field: string, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleSaveAll = () => {
    rows.forEach((row) => {
      updateNodeDefinition(row.id, {
        label: row.label,
        billing: row.billing,
        unitPrice: parseFloat(row.priceStr) || 0,
      });
    });
    onClose();
  };

  const categories = [...new Set(rows.map((r) => r.category))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">{t('bulkPriceEditor')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
            &times;
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] || DEFAULT_CATEGORY_COLOR }}
                />
                <span className="text-xs font-semibold text-gray-500">{tCat(cat)}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-1 font-medium w-[35%]">{t('name')}</th>
                    <th className="pb-1 font-medium w-[25%]">{t('billingType')}</th>
                    <th className="pb-1 font-medium w-[25%]">{t('unitPriceUsd')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows
                    .map((row, idx) => ({ row, idx }))
                    .filter(({ row }) => row.category === cat)
                    .map(({ row, idx }) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="py-1.5 pr-2">
                          <input
                            value={row.label}
                            onChange={(e) => updateRow(idx, 'label', e.target.value)}
                            className="w-full px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </td>
                        <td className="py-1.5 pr-2">
                          <select
                            value={row.billing}
                            onChange={(e) => updateRow(idx, 'billing', e.target.value)}
                            className="w-full px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                          >
                            {billingOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-1.5">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={row.priceStr}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v))
                                updateRow(idx, 'priceStr', v);
                            }}
                            className="w-full px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSaveAll}
            className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('saveAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
