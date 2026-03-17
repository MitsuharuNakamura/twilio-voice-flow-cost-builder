import { useState, type DragEvent } from 'react';
import { useFlowStore } from '../store/flowStore';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  BILLING_LABELS,
  getBillingOptions,
  type BillingType,
  type NodeDefinition,
} from '../data/nodeDefinitions';
import { useI18n } from '../i18n';

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
  const { t, lang, tCat } = useI18n();
  const [label, setLabel] = useState(initial?.label ?? '');
  const [labelEn, setLabelEn] = useState(initial?.labelEn ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? '');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [billing, setBilling] = useState<BillingType>(initial?.billing ?? 'per_minute');
  const [unitPriceUsdStr, setUnitPriceUsdStr] = useState(
    initial ? String(initial.unitPrice) : '0',
  );
  const [twilioUrl, setTwilioUrl] = useState(initial?.twilioUrl ?? '');

  const billingOptions = getBillingOptions(lang);

  const handleSave = () => {
    if (!label.trim()) return;
    const finalCategory = useNewCategory ? newCategory.trim() : category;
    if (!finalCategory) return;
    const id = initial?.id ?? `custom_${Date.now()}`;
    onSave({
      id,
      label: label.trim(),
      labelEn: labelEn.trim() || undefined,
      category: finalCategory,
      billing,
      unitPrice: parseFloat(unitPriceUsdStr) || 0,
      twilioUrl: twilioUrl.trim() || undefined,
    });
  };

  return (
    <div className="p-3 space-y-2 bg-white border border-gray-300 rounded-lg mx-2 my-2 shadow-sm">
      <div className="text-xs font-bold text-gray-700">
        {initial ? t('editNode') : t('createNode')}
      </div>
      <div>
        <label className="text-[10px] text-gray-500">{t('name')} (JA)</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder={t('nodeName')}
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500">{t('name')} (EN)</label>
        <input
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Node name (EN)"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500">{t('category')}</label>
        {!useNewCategory ? (
          <div className="flex gap-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{tCat(c)}</option>
              ))}
            </select>
            <button
              onClick={() => setUseNewCategory(true)}
              className="px-1.5 text-[10px] text-blue-500 hover:text-blue-700 shrink-0"
              title={t('category')}
            >
              {t('newCategoryBtn')}
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder={t('newCategoryPlaceholder')}
            />
            <button
              onClick={() => setUseNewCategory(false)}
              className="px-1.5 text-[10px] text-gray-400 hover:text-gray-600 shrink-0"
            >
              {t('existing')}
            </button>
          </div>
        )}
      </div>
      <div>
        <label className="text-[10px] text-gray-500">{t('billingType')}</label>
        <select
          value={billing}
          onChange={(e) => setBilling(e.target.value as BillingType)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {billingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] text-gray-500">{t('unitPriceUsd')}</label>
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
        <label className="text-[10px] text-gray-500">{t('pricingUrlOptional')}</label>
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
          {t('save')}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          {t('cancel')}
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

  const { t, lang, tCat, tNode } = useI18n();

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = [...new Set(nodeDefinitions.map((n) => n.category))];

  // Default all collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    () => new Set(allCategories),
  );

  const categories = allCategories;

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
      labelEn: def.labelEn,
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
          <h2 className="text-sm font-bold text-gray-700">{t('nodePalette')}</h2>
          <button
            onClick={() => { setShowCreate(true); setEditingId(null); }}
            className="px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('newNode')}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={onOpenBulkEdit}
            className="px-1.5 py-0.5 text-[10px] text-blue-500 hover:text-blue-700 hover:underline"
          >
            {t('bulkEdit')}
          </button>
          <button
            onClick={() => {
              if (confirm(t('confirmResetDefs')))
                resetNodeDefinitions();
            }}
            className="px-1.5 py-0.5 text-[10px] text-gray-400 hover:text-red-500 hover:underline"
          >
            {t('resetToDefaults')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-200">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ja' ? '🔍 ノードを検索...' : '🔍 Search nodes...'}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
        />
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
          const allCatNodes = nodeDefinitions.filter((n) => n.category === cat);
          const query = searchQuery.trim().toLowerCase();
          const catNodes = query
            ? allCatNodes.filter((def) =>
                def.label.toLowerCase().includes(query) ||
                (def.labelEn?.toLowerCase().includes(query)) ||
                tCat(cat).toLowerCase().includes(query)
              )
            : allCatNodes;
          if (query && catNodes.length === 0) return null;
          const isCollapsed = query ? false : collapsedCategories.has(cat);
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
                <span>{tCat(cat)}</span>
                <span className="text-[10px] text-gray-300 ml-auto">{query ? `${catNodes.length}/${allCatNodes.length}` : catNodes.length}</span>
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
                        <div className="text-xs font-medium text-gray-800 truncate">{tNode(def.id, def.label, def.labelEn)}</div>
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
                          title={t('edit')}
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(t('confirmDelete', def.label))) handleDelete(def.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-0.5 text-[10px] text-gray-400 hover:text-red-500"
                          title={t('delete')}
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
