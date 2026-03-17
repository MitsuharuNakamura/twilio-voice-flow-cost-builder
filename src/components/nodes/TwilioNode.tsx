import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR, BILLING_LABELS, type BillingType } from '../../data/nodeDefinitions';
import { useI18n } from '../../i18n';

function TwilioNodeComponent({ data, selected }: NodeProps) {
  const label = data.label as string;
  const category = data.category as string;
  const billing = data.billing as BillingType;
  const unitPrice = data.unitPrice as number;
  const hasCustomPrice = data.hasCustomPrice as boolean;
  const hasCustomDuration = data.hasCustomDuration as boolean;
  const customDurationMinutes = data.customDurationMinutes as number | undefined;
  const defId = data.defId as string;
  const customLabel = data.customLabel as string | undefined;
  const color = CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
  const { t, tNode } = useI18n();

  const formatUsd = (usd: number) => {
    if (usd === 0) return '$0';
    return `$${usd.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`;
  };

  return (
    <div
      className={`flex bg-white rounded-lg shadow-md min-w-[160px] border-2 transition-colors ${
        selected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <div className="w-1 rounded-l-lg shrink-0" style={{ backgroundColor: color }} />
      <div className="px-3 py-2 flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <div className="font-bold text-sm text-gray-800 truncate">{customLabel || tNode(defId, label)}</div>
          {hasCustomPrice && (
            <span className="text-xs text-orange-500" title={t('customPriceSet')}>
              ✎
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {billing === 'free'
            ? 'Free'
            : `${formatUsd(unitPrice)} ${BILLING_LABELS[billing]}`}
        </div>
        {hasCustomDuration && billing === 'per_minute' && (
          <div className="text-[10px] text-indigo-500 mt-0.5 font-medium">
            {customDurationMinutes}min/call
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !-translate-x-1/2" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !translate-x-1/2" />
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !-translate-y-1/2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-gray-300 !border-0 !opacity-0 hover:!opacity-100 !translate-y-1/2" />
    </div>
  );
}

export const TwilioNode = memo(TwilioNodeComponent);
