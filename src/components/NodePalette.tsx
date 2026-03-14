import { useState, type DragEvent } from 'react';
import { useFlowStore } from '../store/flowStore';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  BILLING_LABELS,
  BILLING_OPTIONS,
  type BillingType,
  type NodeDefinition,
} from '../data/nodeDefinitions';

function NodeDefEditor({
  initial,
  categories,
  onSave,
  onCancel,
}: {
  initial?: NodeDefinition;
  categories: string[];
  onSave: (def: NodeDefinition) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? '');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [billing, setBilling] = useState<BillingType>(initial?.billing ?? 'per_minute');
  const [unitPriceUsdStr, setUnitPriceUsdStr] = useState(
    initial ? String(initial.unitPrice) : '0',
  );
  const [twilioUrl, setTwilioUrl] = useState(initial?.twilioUrl ?? '');

  const handleSave = () => {
    if (!label.trim()) return;
    const finalCategory = useNewCategory ? newCategory.trim() : category;
    if (!finalCategory) return;
    const id = initial?.id ?? `custom_${Date.now()}`;
    onSave({
      id,
      label: label.trim(),
      category: finalCategory,
      billing,
      unitPrice: parseFloat(unitPriceUsdStr) || 0,
      twilioUrl: twilioUrl.trim() || undefined,
    });
  };

  return (
    <div className="p-3 space-y-2 bg-white border border-gray-300 rounded-lg mx-2 my-2 shadow-sm">
      <div className="text-xs font-bold text-gray-700">
        {initial ? 'ノード編集' : '新規ノード作成'}
      </div>
      <div>
        <label className="text-[10px] text-gray-500">名前</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="ノード名"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500">カテゴリ</label>
        {!useNewCategory ? (
          <div className="flex gap-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => setUseNewCategory(true)}
              className="px-1.5 text-[10px] text-blue-500 hover:text-blue-700 shrink-0"
              title="新規カテゴリ"
            >
              +新規
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="新しいカテゴリ名"
            />
            <button
              onClick={() => setUseNewCategory(false)}
              className="px-1.5 text-[10px] text-gray-400 hover:text-gray-600 shrink-0"
            >
              既存
            </button>
          </div>
        )}
      </div>
      <div>
        <label className="text-[10px] text-gray-500">課金タイプ</label>
        <select
          value={billing}
          onChange={(e) => setBilling(e.target.value as BillingType)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {BILLING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] text-gray-500">単価 (USD)</label>
        <input
          type="text"
          inputMode="decimal"
          value={unitPriceUsdStr}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) setUnitPriceUsdStr(v);
          }}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500">料金ページURL (任意)</label>
        <input
          value={twilioUrl}
          onChange={(e) => setTwilioUrl(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!label.trim()}
          className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-40"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

export function NodePalette({ onOpenBulkEdit }: { onOpenBulkEdit: () => void }) {
  const nodeDefinitions = useFlowStore((s) => s.nodeDefinitions);
  const addNodeDefinition = useFlowStore((s) => s.addNodeDefinition);
  const updateNodeDefinition = useFlowStore((s) => s.updateNodeDefinition);
  const deleteNodeDefinition = useFlowStore((s) => s.deleteNodeDefinition);
  const resetNodeDefinitions = useFlowStore((s) => s.resetNodeDefinitions);

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const categories = [...new Set(nodeDefinitions.map((n) => n.category))];

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const onDragStart = (event: DragEvent, defId: string) => {
    event.dataTransfer.setData('application/twilionode', defId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const formatUsd = (usd: number) => {
    if (usd === 0) return '$0';
    return `$${usd.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`;
  };

  const handleCreate = (def: NodeDefinition) => {
    addNodeDefinition(def);
    setShowCreate(false);
  };

  const handleUpdate = (def: NodeDefinition) => {
    updateNodeDefinition(def.id, {
      label: def.label,
      category: def.category,
      billing: def.billing,
      unitPrice: def.unitPrice,
      twilioUrl: def.twilioUrl,
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteNodeDefinition(id);
    setEditingId(null);
  };

  return (
    <div className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto shrink-0 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">ノードパレット</h2>
          <button
            onClick={() => { setShowCreate(true); setEditingId(null); }}
            className="px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + 新規
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={onOpenBulkEdit}
            className="px-1.5 py-0.5 text-[10px] text-blue-500 hover:text-blue-700 hover:underline"
          >
            一括編集
          </button>
          <button
            onClick={() => {
              if (confirm('ノード定義を初期値に戻しますか？追加・編集した内容はすべてリセットされます。'))
                resetNodeDefinitions();
            }}
            className="px-1.5 py-0.5 text-[10px] text-gray-400 hover:text-red-500 hover:underline"
          >
            初期値に戻す
          </button>
        </div>
      </div>

      {showCreate && (
        <NodeDefEditor
          categories={categories}

          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {categories.map((cat) => {
          const isCollapsed = collapsedCategories.has(cat);
          const catNodes = nodeDefinitions.filter((n) => n.category === cat);
          return (
            <div key={cat} className="px-2 pt-2 pb-1">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-1 text-xs font-semibold text-gray-500 tracking-wider mb-1 hover:text-gray-700 transition-colors"
              >
                <span
                  className="text-[10px] text-gray-400 w-3 text-center transition-transform"
                  style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                >
                  ▼
                </span>
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] || DEFAULT_CATEGORY_COLOR }}
                />
                <span>{cat}</span>
                <span className="text-[10px] text-gray-300 ml-auto">{catNodes.length}</span>
              </button>
              {!isCollapsed &&
                catNodes.map((def) =>
                  editingId === def.id ? (
                    <NodeDefEditor
                      key={def.id}
                      initial={def}
                      categories={categories}
            
                      onSave={handleUpdate}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div
                      key={def.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, def.id)}
                      className="group flex items-center gap-2 px-2 py-1.5 mb-1 bg-white rounded border border-gray-200 cursor-grab hover:shadow-sm hover:border-gray-300 transition-all text-left"
                    >
                      <div
                        className="w-1 self-stretch rounded-sm shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] || DEFAULT_CATEGORY_COLOR }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-800 truncate">{def.label}</div>
                        <div className="text-[10px] text-gray-400">
                          {def.billing === 'free'
                            ? 'Free'
                            : `${formatUsd(def.unitPrice)} ${BILLING_LABELS[def.billing]}`}
                        </div>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingId(def.id); setShowCreate(false); }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-0.5 text-[10px] text-gray-400 hover:text-blue-500"
                          title="編集"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`「${def.label}」を削除しますか？`)) handleDelete(def.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-0.5 text-[10px] text-gray-400 hover:text-red-500"
                          title="削除"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ),
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
