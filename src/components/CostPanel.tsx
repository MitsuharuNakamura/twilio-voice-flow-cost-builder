import { MarkerType } from '@xyflow/react';
import { useFlowStore } from '../store/flowStore';
import { calculateCosts } from '../utils/costCalculator';
import { BILLING_LABELS, type BillingType } from '../data/nodeDefinitions';
import { NodeSettingsPanel } from './NodeSettingsPanel';
import { useI18n } from '../i18n';

const BILLING_BADGE_COLORS: Record<BillingType, string> = {
  per_minute: 'bg-blue-100 text-blue-700',
  per_call: 'bg-green-100 text-green-700',
  free: 'bg-gray-100 text-gray-500',
  custom: 'bg-orange-100 text-orange-700',
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

  const { t } = useI18n();

  const { items, total, perCall } = calculateCosts(nodes, monthlyCallCount, avgCallMinutes, customPrices, customDurations, getNodeDef);

  const formatPrice = (usd: number) => {
    if (currency === 'JPY') {
      const jpy = usd * exchangeRate;
      return `¥${Math.round(jpy).toLocaleString()}`;
    }
    return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

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

        {items.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm font-bold text-gray-800">
              <span>{t('totalMonthly')}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
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
