import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import { BILLING_LABELS } from '../data/nodeDefinitions';
import type { ShapeNodeData } from './nodes/ShapeNode';
import { SHAPE_DEFAULTS } from './nodes/ShapeNode';

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-600 w-16 shrink-0">{label}</label>
      <input
        type="color"
        value={value === 'transparent' ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
}

function ShapeSettingsPanel({ nodeId, data }: { nodeId: string; data: ShapeNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);

  const update = (patch: Partial<ShapeNodeData>) => {
    updateNodeData(nodeId, patch);
  };

  const defaults = SHAPE_DEFAULTS[data.shape];

  return (
    <div className="border-t border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">図形設定</h3>
      <div className="text-xs text-gray-400 mb-3">
        {data.shape === 'rect' ? '四角形' : data.shape === 'circle' ? '円' : 'テキスト'}
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-600 block mb-1">テキスト</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="ラベル"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">文字サイズ</label>
          <input
            type="range"
            min={8}
            max={32}
            value={data.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-[10px] text-gray-400">{data.fontSize}px</span>
        </div>

        <ColorInput label="文字色" value={data.textColor} onChange={(v) => update({ textColor: v })} />
        <ColorInput label="背景色" value={data.bgColor} onChange={(v) => update({ bgColor: v })} />
        <ColorInput label="枠線色" value={data.borderColor} onChange={(v) => update({ borderColor: v })} />

        <div>
          <label className="text-xs text-gray-600 block mb-1">枠線の太さ</label>
          <input
            type="range"
            min={0}
            max={8}
            value={data.borderWidth}
            onChange={(e) => update({ borderWidth: Number(e.target.value) })}
            className="w-full"
          />
          <span className="text-[10px] text-gray-400">{data.borderWidth}px</span>
        </div>

        <button
          onClick={() => update({ ...defaults })}
          className="text-xs text-blue-500 hover:underline mt-1"
        >
          デフォルトに戻す
        </button>
      </div>
    </div>
  );
}

function TwilioSettingsPanel({ nodeId }: { nodeId: string }) {
  const nodes = useFlowStore((s) => s.nodes);
  const customPrices = useFlowStore((s) => s.customPrices);
  const customDurations = useFlowStore((s) => s.customDurations);
  const avgCallMinutes = useFlowStore((s) => s.avgCallMinutes);
  const getNodeDefinition = useFlowStore((s) => s.getNodeDefinition);
  const setCustomPrice = useFlowStore((s) => s.setCustomPrice);
  const removeCustomPrice = useFlowStore((s) => s.removeCustomPrice);
  const setCustomDuration = useFlowStore((s) => s.setCustomDuration);
  const removeCustomDuration = useFlowStore((s) => s.removeCustomDuration);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);

  const node = nodes.find((n) => n.id === nodeId);
  const defId = node?.data?.defId as string | undefined;
  const def = defId ? getNodeDefinition(defId) : undefined;

  const hasCustomPrice = node ? customPrices[node.id] !== undefined : false;
  const currentPriceUsd = node ? (customPrices[node.id] ?? (def?.unitPrice ?? 0)) : 0;
  const hasCustomDuration = node ? customDurations[node.id] !== undefined : false;
  const currentDuration = node ? (customDurations[node.id] ?? avgCallMinutes) : avgCallMinutes;

  const [priceStr, setPriceStr] = useState('');
  const [durationStr, setDurationStr] = useState('');

  useEffect(() => {
    setPriceStr(String(currentPriceUsd));
  }, [nodeId, hasCustomPrice, def?.unitPrice]);

  useEffect(() => {
    setDurationStr(String(currentDuration));
  }, [nodeId, hasCustomDuration, avgCallMinutes]);

  if (!node || !def) return null;

  return (
    <div className="border-t border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">ノード設定</h3>
      <div className="text-xs text-gray-400 mb-2">
        定義: {def.label} / 課金タイプ: {BILLING_LABELS[def.billing]}
      </div>
      <div className="mb-2">
        <label className="text-xs text-gray-600 block mb-1">表示ラベル</label>
        <input
          type="text"
          value={(node.data?.customLabel as string) ?? ''}
          onChange={(e) => updateNodeData(node.id, { customLabel: e.target.value || undefined })}
          placeholder={def.label}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        {(node.data?.customLabel as string) && (
          <button
            onClick={() => updateNodeData(node.id, { customLabel: undefined })}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            デフォルトに戻す ({def.label})
          </button>
        )}
      </div>

      {def.billing !== 'free' && (
        <div className="mb-2">
          <label className="text-xs text-gray-600 block mb-1">単価 (USD)</label>
          <input
            type="text"
            inputMode="decimal"
            value={priceStr}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) {
                setPriceStr(v);
                const usd = parseFloat(v);
                if (!isNaN(usd)) {
                  setCustomPrice(node.id, usd);
                }
              }
            }}
            onBlur={() => {
              const usd = parseFloat(priceStr);
              if (isNaN(usd) || priceStr === '') {
                setPriceStr(String(currentPriceUsd));
              }
            }}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          {hasCustomPrice && (
            <button
              onClick={() => {
                removeCustomPrice(node.id);
                setPriceStr(String(def.unitPrice));
              }}
              className="text-xs text-blue-500 hover:underline mt-1"
            >
              デフォルトに戻す (${def.unitPrice.toFixed(4)})
            </button>
          )}
        </div>
      )}

      {def.billing === 'per_minute' && (
        <div className="mb-2">
          <label className="text-xs text-gray-600 block mb-1">
            このノードの通話時間 (分)
          </label>
          <p className="text-[10px] text-gray-400 mb-1">
            転送などで区間が分かれる場合、このノードが使われる時間を設定
          </p>
          <input
            type="text"
            inputMode="decimal"
            value={durationStr}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) {
                setDurationStr(v);
                const val = parseFloat(v);
                if (!isNaN(val)) setCustomDuration(node.id, val);
              }
            }}
            onBlur={() => {
              const val = parseFloat(durationStr);
              if (isNaN(val) || durationStr === '') {
                setDurationStr(String(currentDuration));
              }
            }}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          {hasCustomDuration && (
            <button
              onClick={() => {
                removeCustomDuration(node.id);
                setDurationStr(String(avgCallMinutes));
              }}
              className="text-xs text-blue-500 hover:underline mt-1"
            >
              デフォルトに戻す (全体: {avgCallMinutes}分)
            </button>
          )}
        </div>
      )}

      {def.twilioUrl && (
        <a
          href={def.twilioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
        >
          Twilio公式料金ページで確認する →
        </a>
      )}
    </div>
  );
}

export function NodeSettingsPanel() {
  const nodes = useFlowStore((s) => s.nodes);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const isShape = node.data?.nodeType === 'shape';

  if (isShape) {
    return <ShapeSettingsPanel nodeId={node.id} data={node.data as unknown as ShapeNodeData} />;
  }

  return <TwilioSettingsPanel nodeId={node.id} />;
}
