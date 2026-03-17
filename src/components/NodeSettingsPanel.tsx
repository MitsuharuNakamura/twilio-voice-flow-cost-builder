import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import { BILLING_LABELS, TTS_TYPE_LABELS, getTtsRatePerBlock, type TtsVoiceType } from '../data/nodeDefinitions';
import type { ShapeNodeData } from './nodes/ShapeNode';
import { SHAPE_DEFAULTS } from './nodes/ShapeNode';
import { useI18n } from '../i18n';

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
  const { t } = useI18n();

  const update = (patch: Partial<ShapeNodeData>) => {
    updateNodeData(nodeId, patch);
  };

  const defaults = SHAPE_DEFAULTS[data.shape];

  return (
    <div className="border-t border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">{t('shapeSettings')}</h3>
      <div className="text-xs text-gray-400 mb-3">
        {data.shape === 'rect' ? t('shapeRect2') : data.shape === 'circle' ? t('shapeCircle2') : t('shapeText2')}
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-600 block mb-1">{t('text')}</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder={t('label')}
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">{t('fontSize')}</label>
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

        <ColorInput label={t('textColor')} value={data.textColor} onChange={(v) => update({ textColor: v })} />
        <ColorInput label={t('bgColor')} value={data.bgColor} onChange={(v) => update({ bgColor: v })} />
        <ColorInput label={t('borderColor')} value={data.borderColor} onChange={(v) => update({ borderColor: v })} />

        <div>
          <label className="text-xs text-gray-600 block mb-1">{t('borderWidth')}</label>
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
          {t('resetToDefault')}
        </button>
      </div>
    </div>
  );
}

function TwilioSettingsPanel({ nodeId }: { nodeId: string }) {
  const nodes = useFlowStore((s) => s.nodes);
  const customPrices = useFlowStore((s) => s.customPrices);
  const customDurations = useFlowStore((s) => s.customDurations);
  const ttsConfigs = useFlowStore((s) => s.ttsConfigs);
  const avgCallMinutes = useFlowStore((s) => s.avgCallMinutes);
  const monthlyCallCount = useFlowStore((s) => s.monthlyCallCount);
  const getNodeDefinition = useFlowStore((s) => s.getNodeDefinition);
  const setCustomPrice = useFlowStore((s) => s.setCustomPrice);
  const removeCustomPrice = useFlowStore((s) => s.removeCustomPrice);
  const setCustomDuration = useFlowStore((s) => s.setCustomDuration);
  const removeCustomDuration = useFlowStore((s) => s.removeCustomDuration);
  const setTtsConfig = useFlowStore((s) => s.setTtsConfig);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);

  const { t, tNode } = useI18n();

  const node = nodes.find((n) => n.id === nodeId);
  const defId = node?.data?.defId as string | undefined;
  const def = defId ? getNodeDefinition(defId) : undefined;

  const hasCustomPrice = node ? customPrices[node.id] !== undefined : false;
  const currentPriceUsd = node ? (customPrices[node.id] ?? (def?.unitPrice ?? 0)) : 0;
  const hasCustomDuration = node ? customDurations[node.id] !== undefined : false;
  const currentDuration = node ? (customDurations[node.id] ?? avgCallMinutes) : avgCallMinutes;
  const ttsConfig = node ? ttsConfigs[node.id] : undefined;

  const [priceStr, setPriceStr] = useState('');
  const [durationStr, setDurationStr] = useState('');
  const [ttsCharsStr, setTtsCharsStr] = useState('');

  useEffect(() => {
    setPriceStr(String(currentPriceUsd));
  }, [nodeId, hasCustomPrice, def?.unitPrice]);

  useEffect(() => {
    setDurationStr(String(currentDuration));
  }, [nodeId, hasCustomDuration, avgCallMinutes]);

  useEffect(() => {
    setTtsCharsStr(String(ttsConfig?.chars ?? 200));
  }, [nodeId, ttsConfig?.chars]);

  if (!node || !def) return null;

  const displayLabel = tNode(def.id, def.label, def.labelEn);
  const isTts = def.billing === 'tts';

  // TTS calculated info
  const currentTtsType = ttsConfig?.ttsType ?? 'standard';
  const currentTtsChars = ttsConfig?.chars ?? 200;
  const ttsBlocks = Math.ceil(currentTtsChars / 100);
  const ttsTotalMonthlyChars = currentTtsChars * monthlyCallCount;
  const ttsRate = getTtsRatePerBlock(currentTtsType, ttsTotalMonthlyChars);

  return (
    <div className="border-t border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">{t('nodeSettings')}</h3>
      <div className="text-xs text-gray-400 mb-2">
        {t('definitionInfo', displayLabel, BILLING_LABELS[def.billing])}
      </div>
      <div className="mb-2">
        <label className="text-xs text-gray-600 block mb-1">{t('displayLabel')}</label>
        <input
          type="text"
          value={(node.data?.customLabel as string) ?? ''}
          onChange={(e) => updateNodeData(node.id, { customLabel: e.target.value || undefined })}
          placeholder={displayLabel}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        {(node.data?.customLabel as string) && (
          <button
            onClick={() => updateNodeData(node.id, { customLabel: undefined })}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            {t('resetToDefaultWithLabel', displayLabel)}
          </button>
        )}
      </div>

      {isTts ? (
        <>
          {/* TTS Voice Type */}
          <div className="mb-2">
            <label className="text-xs text-gray-600 block mb-1">
              {t('ttsType')}
            </label>
            <select
              value={currentTtsType}
              onChange={(e) => setTtsConfig(node.id, { ttsType: e.target.value as TtsVoiceType, chars: currentTtsChars })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {(Object.keys(TTS_TYPE_LABELS) as TtsVoiceType[]).map((type) => (
                <option key={type} value={type}>{TTS_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>

          {/* TTS Characters per call */}
          <div className="mb-2">
            <label className="text-xs text-gray-600 block mb-1">
              {t('ttsCharsPerCall')}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={ttsCharsStr}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || /^[0-9]*$/.test(v)) {
                  setTtsCharsStr(v);
                  const val = parseInt(v);
                  if (!isNaN(val) && val >= 0) {
                    setTtsConfig(node.id, { ttsType: currentTtsType, chars: val });
                  }
                }
              }}
              onBlur={() => {
                const val = parseInt(ttsCharsStr);
                if (isNaN(val) || ttsCharsStr === '') {
                  setTtsCharsStr(String(currentTtsChars));
                }
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* TTS Price Summary */}
          <div className="mb-2 p-2 bg-purple-50 rounded text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>{t('ttsBlocks')} (100chars)</span>
              <span>{ttsBlocks}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('ttsMonthlyChars')}</span>
              <span>{ttsTotalMonthlyChars.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('ttsRatePerBlock')}</span>
              <span>${ttsRate.toFixed(4)}</span>
            </div>
            <div className="flex justify-between font-medium text-purple-700">
              <span>{t('ttsPerCall')}</span>
              <span>${(ttsBlocks * ttsRate).toFixed(4)}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {def.billing !== 'free' && (
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">{t('unitPriceUsd')}</label>
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
                  {t('resetToDefaultWithPrice', def.unitPrice.toFixed(4))}
                </button>
              )}
            </div>
          )}

          {def.billing === 'per_minute' && (
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">
                {t('nodeDuration')}
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                {t('nodeDurationHelp')}
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
                  {t('resetToDefaultDuration', avgCallMinutes)}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {def.twilioUrl && (
        <a
          href={def.twilioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
        >
          {t('checkTwilioPricing')}
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
