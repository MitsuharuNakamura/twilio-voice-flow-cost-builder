export type EditionType = 'none' | 'administration' | 'security' | 'enterprise';

export interface EditionDef {
  id: EditionType;
  label: string;
  labelEn: string;
  minFee: number;       // USD/month minimum
  usagePercent: number;  // percentage of usage
}

export const EDITIONS: EditionDef[] = [
  { id: 'none',           label: 'なし',                  labelEn: 'None',                  minFee: 0,     usagePercent: 0 },
  { id: 'administration', label: 'Administration Edition', labelEn: 'Administration Edition', minFee: 10,    usagePercent: 10 },
  { id: 'security',       label: 'Security Edition',      labelEn: 'Security Edition',      minFee: 7500,  usagePercent: 16 },
  { id: 'enterprise',     label: 'Enterprise Edition',    labelEn: 'Enterprise Edition',    minFee: 15000, usagePercent: 20 },
];

export interface AddonDef {
  id: string;
  label: string;
  labelEn: string;
  fee: number; // USD/month
}

export const ADDONS: AddonDef[] = [
  { id: 'sso',            label: 'SSO',                        labelEn: 'SSO',                        fee: 1500 },
  { id: 'hipaa',          label: 'HIPAA Accounts',             labelEn: 'HIPAA Accounts',             fee: 2000 },
  { id: 'redaction',      label: 'Message Redaction',          labelEn: 'Message Redaction',          fee: 1500 },
  { id: 'static_proxy',   label: 'Static Proxy',               labelEn: 'Static Proxy',               fee: 1000 },
  { id: 'rec_encryption', label: 'Voice Recording Encryption', labelEn: 'Voice Recording Encryption', fee: 1500 },
];

// ===== Support Plans =====

export type SupportPlanType = 'developer' | 'production' | 'business' | 'personalized';

export interface SupportPlanDef {
  id: SupportPlanType;
  label: string;
  labelEn: string;
  minFee: number;
  usagePercent: number;
}

export const SUPPORT_PLANS: SupportPlanDef[] = [
  { id: 'developer',     label: 'デベロッパー (Free)',          labelEn: 'Developer (Free)',       minFee: 0,    usagePercent: 0 },
  { id: 'production',    label: 'プロダクション サポート',       labelEn: 'Production Support',     minFee: 250,  usagePercent: 4 },
  { id: 'business',      label: 'ビジネス サポート',            labelEn: 'Business Support',       minFee: 1500, usagePercent: 6 },
  { id: 'personalized',  label: 'パーソナライズド サポート',     labelEn: 'Personalized Support',   minFee: 5000, usagePercent: 8 },
];

// ===== Config & Calculation =====

export interface EditionConfig {
  edition: EditionType;
  addons: string[];
  supportPlan: SupportPlanType;
}

function calcMaxFee(minFee: number, usagePercent: number, usageTotal: number): { minFee: number; usageFee: number; cost: number } {
  if (usagePercent === 0 && minFee === 0) return { minFee: 0, usageFee: 0, cost: 0 };
  const usageFee = Math.round(usageTotal * usagePercent) / 100;
  return { minFee, usageFee, cost: Math.max(minFee, usageFee) };
}

export function calculateEditionCost(config: EditionConfig, usageTotal: number): {
  editionCost: number;
  editionMinFee: number;
  editionUsageFee: number;
  addonCost: number;
  supportCost: number;
  supportMinFee: number;
  supportUsageFee: number;
  totalEditionCost: number;
} {
  const editionDef = EDITIONS.find((e) => e.id === config.edition);
  let editionResult = { minFee: 0, usageFee: 0, cost: 0 };
  if (editionDef && editionDef.id !== 'none') {
    editionResult = calcMaxFee(editionDef.minFee, editionDef.usagePercent, usageTotal);
  }

  let addonCost = 0;
  for (const addonId of config.addons) {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (addon) addonCost += addon.fee;
  }

  const supportDef = SUPPORT_PLANS.find((s) => s.id === config.supportPlan);
  let supportResult = { minFee: 0, usageFee: 0, cost: 0 };
  if (supportDef) {
    supportResult = calcMaxFee(supportDef.minFee, supportDef.usagePercent, usageTotal);
  }

  return {
    editionCost: editionResult.cost,
    editionMinFee: editionResult.minFee,
    editionUsageFee: editionResult.usageFee,
    addonCost,
    supportCost: supportResult.cost,
    supportMinFee: supportResult.minFee,
    supportUsageFee: supportResult.usageFee,
    totalEditionCost: editionResult.cost + addonCost + supportResult.cost,
  };
}
