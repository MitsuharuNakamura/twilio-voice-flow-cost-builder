import { useState } from 'react';
import { MarkerType } from '@xyflow/react';
import { useFlowStore } from '../store/flowStore';
import { calculateCosts } from '../utils/costCalculator';
import { BILLING_LABELS, TTS_TYPE_LABELS, type BillingType } from '../data/nodeDefinitions';
import { EDITIONS, ADDONS, SUPPORT_PLANS, calculateEditionCost } from '../data/editions';
import { NodeSettingsPanel } from './NodeSettingsPanel';
import { useI18n } from '../i18n';

const BILLING_BADGE_COLORS: Record<BillingType, string> = {
  per_minute: 'bg-blue-100 text-blue-700',
  per_call: 'bg-green-100 text-green-700',
  free: 'bg-gray-100 text-gray-500',
  custom: 'bg-orange-100 text-orange-700',
  tts: 'bg-purple-100 text-purple-700',
  per_kchar: 'bg-pink-100 text-pink-700',
};

const ARROW_MARKER = { type: MarkerType.ArrowClosed as const, width: 16, height: 16 };

function EdgeSettingsPanel() {
  const edges = useFlowStore((s) => s.edges);
  const selectedEdgeId = useFlowStore((s) => s.selectedEdgeId);
  const updateEdge = useFlowStore((s) => s.updateEdge);
  const { t } = useI18n();

  const edge = edges.find((e) => e.id === selectedEdgeId);
  if (!edge) return null;

  const hasMarkerStart = !!edge.markerStart;
  const hasMarkerEnd = !!edge.markerEnd;

  return (
    <div className="border-t border-gray-200 p-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">{t('edgeSettings')}</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={hasMarkerStart}
            onChange={(e) =>
              updateEdge(edge.id, {
                markerStart: e.target.checked ? ARROW_MARKER : undefined,
              })
            }
            className="rounded"
          />
          {t('arrowAtStart')}
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={hasMarkerEnd}
            onChange={(e) =>
              updateEdge(edge.id, {
                markerEnd: e.target.checked ? ARROW_MARKER : undefined,
              })
            }
            className="rounded"
          />
          {t('arrowAtEnd')}
        </label>
      </div>
    </div>
  );
}

export function CostPanel() {
  const nodes = useFlowStore((s) => s.nodes);
  const monthlyCallCount = useFlowStore((s) => s.monthlyCallCount);
  const avgCallMinutes = useFlowStore((s) => s.avgCallMinutes);
  const currency = useFlowStore((s) => s.currency);
  const exchangeRate = useFlowStore((s) => s.exchangeRate);
  const customPrices = useFlowStore((s) => s.customPrices);
  const customDurations = useFlowStore((s) => s.customDurations);
  const getNodeDef = useFlowStore((s) => s.getNodeDefinition);
  const setMonthlyCallCount = useFlowStore((s) => s.setMonthlyCallCount);
  const setAvgCallMinutes = useFlowStore((s) => s.setAvgCallMinutes);
  const setCurrency = useFlowStore((s) => s.setCurrency);
  const setExchangeRate = useFlowStore((s) => s.setExchangeRate);
  const setSelectedNodeId = useFlowStore((s) => s.setSelectedNodeId);
  const ttsConfigs = useFlowStore((s) => s.ttsConfigs);
  const customChars = useFlowStore((s) => s.customChars);
  const editionConfig = useFlowStore((s) => s.editionConfig);
  const setEdition = useFlowStore((s) => s.setEdition);
  const toggleAddon = useFlowStore((s) => s.toggleAddon);
  const setSupportPlan = useFlowStore((s) => s.setSupportPlan);

  const { t, lang } = useI18n();

  const [editionOpen, setEditionOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const { items, total, perCall } = calculateCosts(nodes, monthlyCallCount, avgCallMinutes, customPrices, customDurations, getNodeDef, ttsConfigs, customChars);

  const editionResult = calculateEditionCost(editionConfig, total);
  const hasEdition = editionConfig.edition !== 'none' || editionConfig.addons.length > 0;
  const hasSupportPlan = editionConfig.supportPlan !== 'developer';
  const hasExtras = hasEdition || hasSupportPlan;
  const grandTotal = total + editionResult.totalEditionCost;

  const formatPrice = (usd: number) => {
    if (currency === 'JPY') {
      const jpy = usd * exchangeRate;
      return `¥${Math.round(jpy).toLocaleString()}`;
    }
    return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const selectedEditionDef = EDITIONS.find((e) => e.id === editionConfig.edition);
  const selectedSupportDef = SUPPORT_PLANS.find((s) => s.id === editionConfig.supportPlan);

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-700">{t('costCalculation')}</h2>
      </div>

      {/* Input parameters */}
      <div className="p-3 border-b border-gray-200 space-y-2">
        <div>
          <label className="text-xs text-gray-500 block">{t('monthlyCallCount')}</label>
          <input
            type="number"
            min="0"
            value={monthlyCallCount}
            onChange={(e) => setMonthlyCallCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block">{t('avgCallDuration')}</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={avgCallMinutes}
            onChange={(e) => setAvgCallMinutes(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('currency')}</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency('JPY')}
              className={`px-2 py-0.5 text-xs rounded ${
                currency === 'JPY' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              JPY
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 text-xs rounded ${
                currency === 'USD' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              USD
            </button>
          </div>
        </div>
        {currency === 'JPY' && (
          <div>
            <label className="text-xs text-gray-500 block">{t('exchangeRate')}</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Math.max(1, parseFloat(e.target.value) || 150))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        )}
      </div>

      {/* Enterprise Editions */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setEditionOpen(!editionOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="flex items-center gap-1">
            <span
              className="text-[10px] text-gray-400 w-3 text-center transition-transform"
              style={{ transform: editionOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            >
              ▼
            </span>
            {t('enterpriseEditions')}
          </span>
          {hasEdition && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
              {formatPrice(editionResult.totalEditionCost)}
            </span>
          )}
        </button>

        {editionOpen && (
          <div className="px-3 pb-3 space-y-3">
            {/* Edition radio */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">{t('edition')}</label>
              <div className="space-y-1">
                {EDITIONS.map((ed) => (
                  <label
                    key={ed.id}
                    className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                  >
                    <input
                      type="radio"
                      name="edition"
                      checked={editionConfig.edition === ed.id}
                      onChange={() => setEdition(ed.id)}
                      className="text-blue-500"
                    />
                    <span className="flex-1">
                      {lang === 'ja' ? ed.label : ed.labelEn}
                    </span>
                    {ed.id !== 'none' && (
                      <span className="text-[10px] text-gray-400 shrink-0">
                        ${ed.minFee.toLocaleString()}/{ed.usagePercent}%
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Edition cost detail */}
            {editionConfig.edition !== 'none' && selectedEditionDef && (
              <div className="p-2 bg-amber-50 rounded text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>{t('editionMinFee')}</span>
                  <span>${selectedEditionDef.minFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('editionUsageFee')} ({selectedEditionDef.usagePercent}%)</span>
                  <span>{formatPrice(editionResult.editionUsageFee)}</span>
                </div>
                <div className="flex justify-between font-medium text-amber-700">
                  <span>→ {t('applied')}</span>
                  <span>{formatPrice(editionResult.editionCost)}</span>
                </div>
              </div>
            )}

            {/* Addons */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">{t('addons')}</label>
              <div className="space-y-1">
                {ADDONS.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={editionConfig.addons.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="rounded text-blue-500"
                    />
                    <span className="flex-1 truncate">
                      {lang === 'ja' ? addon.label : addon.labelEn}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      ${addon.fee.toLocaleString()}/mo
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Plan */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="flex items-center gap-1">
            <span
              className="text-[10px] text-gray-400 w-3 text-center transition-transform"
              style={{ transform: supportOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            >
              ▼
            </span>
            {t('supportPlan')}
          </span>
          {hasSupportPlan && (
            <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">
              {formatPrice(editionResult.supportCost)}
            </span>
          )}
        </button>

        {supportOpen && (
          <div className="px-3 pb-3 space-y-3">
            <div className="space-y-1">
              {SUPPORT_PLANS.map((plan) => (
                <label
                  key={plan.id}
                  className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                >
                  <input
                    type="radio"
                    name="supportPlan"
                    checked={editionConfig.supportPlan === plan.id}
                    onChange={() => setSupportPlan(plan.id)}
                    className="text-blue-500"
                  />
                  <span className="flex-1">
                    {lang === 'ja' ? plan.label : plan.labelEn}
                  </span>
                  {plan.usagePercent > 0 && (
                    <span className="text-[10px] text-gray-400 shrink-0">
                      ${plan.minFee.toLocaleString()}/{plan.usagePercent}%
                    </span>
                  )}
                </label>
              ))}
            </div>

            {hasSupportPlan && selectedSupportDef && (
              <div className="p-2 bg-teal-50 rounded text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>{t('editionMinFee')}</span>
                  <span>${selectedSupportDef.minFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('editionUsageFee')} ({selectedSupportDef.usagePercent}%)</span>
                  <span>{formatPrice(editionResult.supportUsageFee)}</span>
                </div>
                <div className="flex justify-between font-medium text-teal-700">
                  <span>→ {t('applied')}</span>
                  <span>{formatPrice(editionResult.supportCost)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cost breakdown */}
      <div className="p-3 flex-1">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">{t('costBreakdown')}</h3>
        {items.length === 0 ? (
          <p className="text-xs text-gray-400">{t('placeNodes')}</p>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.instanceId}
                onClick={() => setSelectedNodeId(item.instanceId)}
                className="flex items-center justify-between px-2 py-1.5 bg-white rounded border border-gray-100 hover:border-gray-300 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="truncate font-medium text-gray-700">{item.label}</span>
                  <span
                    className={`px-1 py-0.5 rounded text-[10px] shrink-0 ${
                      BILLING_BADGE_COLORS[item.billing as BillingType]
                    }`}
                  >
                    {BILLING_LABELS[item.billing as BillingType]}
                  </span>
                  {item.customDuration !== undefined && item.billing === 'per_minute' && (
                    <span className="px-1 py-0.5 rounded text-[10px] shrink-0 bg-indigo-50 text-indigo-600">
                      {item.customDuration}{t('min')}
                    </span>
                  )}
                  {item.ttsConfig && item.billing === 'tts' && (
                    <span className="px-1 py-0.5 rounded text-[10px] shrink-0 bg-purple-50 text-purple-600">
                      {TTS_TYPE_LABELS[item.ttsConfig.ttsType]} / {item.ttsConfig.chars.toLocaleString()}chars
                    </span>
                  )}
                  {item.billing === 'per_kchar' && item.customChars !== undefined && (
                    <span className="px-1 py-0.5 rounded text-[10px] shrink-0 bg-pink-50 text-pink-600">
                      {item.customChars.toLocaleString()} chars
                    </span>
                  )}
                  {item.twilioUrl && (
                    <a
                      href={item.twilioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-600 shrink-0"
                      title={t('twilioPricingPage')}
                    >
                      ↗
                    </a>
                  )}
                </div>
                <span className="text-gray-600 shrink-0 ml-2">{formatPrice(item.monthlyCost)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {items.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200 space-y-1">
            {hasExtras ? (
              <>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{t('usageTotal')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {editionConfig.edition !== 'none' && (
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>{t('editionFee')}</span>
                    <span>{formatPrice(editionResult.editionCost)}</span>
                  </div>
                )}
                {editionResult.addonCost > 0 && (
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>{t('addonFee')}</span>
                    <span>{formatPrice(editionResult.addonCost)}</span>
                  </div>
                )}
                {hasSupportPlan && (
                  <div className="flex justify-between text-xs text-teal-600">
                    <span>{t('supportFee')}</span>
                    <span>{formatPrice(editionResult.supportCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-800 pt-1 border-t border-gray-100">
                  <span>{t('grandTotal')}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm font-bold text-gray-800">
                <span>{t('totalMonthly')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('perCall')}</span>
              <span>{formatPrice(perCall)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Node / Edge settings */}
      <NodeSettingsPanel />
      <EdgeSettingsPanel />

      {/* Disclaimer */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}
