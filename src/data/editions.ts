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

export interface EditionConfig {
  edition: EditionType;
  addons: string[];
}

export function calculateEditionCost(config: EditionConfig, usageTotal: number): {
  editionCost: number;
  editionMinFee: number;
  editionUsageFee: number;
  addonCost: number;
  totalEditionCost: number;
} {
  const editionDef = EDITIONS.find((e) => e.id === config.edition);
  let editionMinFee = 0;
  let editionUsageFee = 0;
  let editionCost = 0;

  if (editionDef && editionDef.id !== 'none') {
    editionMinFee = editionDef.minFee;
    editionUsageFee = Math.round(usageTotal * editionDef.usagePercent) / 100;
    editionCost = Math.max(editionMinFee, editionUsageFee);
  }

  let addonCost = 0;
  for (const addonId of config.addons) {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (addon) addonCost += addon.fee;
  }

  return {
    editionCost,
    editionMinFee,
    editionUsageFee,
    addonCost,
    totalEditionCost: editionCost + addonCost,
  };
}
