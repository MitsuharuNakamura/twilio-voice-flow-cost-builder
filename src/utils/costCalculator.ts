import type { Node } from '@xyflow/react';
import type { NodeDefinition } from '../data/nodeDefinitions';

export interface CostLineItem {
  nodeId: string;
  instanceId: string;
  label: string;
  billing: string;
  unitPrice: number;
  minutes: number;
  monthlyCost: number;
  twilioUrl?: string;
  customPrice?: number;
  customDuration?: number;
}

export function calculateCosts(
  nodes: Node[],
  monthlyCallCount: number,
  avgCallMinutes: number,
  customPrices: Record<string, number>,
  customDurations: Record<string, number>,
  getNodeDefinition: (defId: string) => NodeDefinition | undefined,
): { items: CostLineItem[]; total: number; perCall: number } {
  const items: CostLineItem[] = [];

  for (const node of nodes) {
    const defId = node.data?.defId as string | undefined;
    if (!defId) continue;

    const def = getNodeDefinition(defId);
    if (!def) continue;

    const unitPrice = customPrices[node.id] ?? def.unitPrice;
    const minutes = customDurations[node.id] ?? avgCallMinutes;
    let monthlyCost = 0;

    switch (def.billing) {
      case 'per_minute':
        monthlyCost = unitPrice * minutes * monthlyCallCount;
        break;
      case 'per_call':
        monthlyCost = unitPrice * monthlyCallCount;
        break;
      case 'custom':
        monthlyCost = unitPrice * monthlyCallCount;
        break;
      case 'free':
      default:
        monthlyCost = 0;
        break;
    }

    items.push({
      nodeId: defId,
      instanceId: node.id,
      label: (node.data?.label as string) || def.label,
      billing: def.billing,
      unitPrice,
      minutes,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      twilioUrl: def.twilioUrl,
      customPrice: customPrices[node.id] !== undefined ? customPrices[node.id] : undefined,
      customDuration: customDurations[node.id] !== undefined ? customDurations[node.id] : undefined,
    });
  }

  const total = Math.round(items.reduce((sum, i) => sum + i.monthlyCost, 0) * 100) / 100;
  const perCall = monthlyCallCount > 0 ? Math.round((total / monthlyCallCount) * 100) / 100 : 0;

  return { items, total, perCall };
}
