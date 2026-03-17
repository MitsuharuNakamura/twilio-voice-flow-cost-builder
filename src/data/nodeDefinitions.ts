export type BillingType = 'per_minute' | 'per_call' | 'free' | 'custom';

export interface NodeDefinition {
  id: string;
  label: string;
  labelEn?: string;
  category: string;
  billing: BillingType;
  unitPrice: number;
  note?: string;
  twilioUrl?: string;
}

// unitPrice is in USD
export const DEFAULT_NODE_DEFINITIONS: NodeDefinition[] = [
  // ネットワーク
  { id: 'caller',   label: '架電者',           labelEn: 'Caller',                    category: 'ネットワーク',    billing: 'free',       unitPrice: 0 },
  { id: 'nttcom',   label: 'PSTN / NTTCOM',    labelEn: 'PSTN / NTTCOM',             category: 'ネットワーク',    billing: 'free', unitPrice: 0, note: '参考値' },
  // Twilio 着信
  { id: 'tw050',    label: '着信(日本 050番号)',   labelEn: 'Inbound Japan 050 Number',          category: 'Twilio着信',     billing: 'per_minute', unitPrice: 0.0100, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp' },
  { id: 'twlocal',  label: '着信(日本 市外局番)',  labelEn: 'Inbound Japan Area Code',           category: 'Twilio着信',     billing: 'per_minute', unitPrice: 0.0100, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp' },
  { id: 'twlocal',  label: '着信(日本 Toll-Free)', labelEn: 'Inbound Japan Toll-Free',           category: 'Twilio着信',     billing: 'per_minute', unitPrice: 0.2780, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp' },

  // Twilio 発信
  { id: 'twout_fx', label: '発信 (日本-固定宛)',    labelEn: 'Outbound (Japan Landline)',        category: 'Twilio発信',     billing: 'per_minute', unitPrice: 0.0746, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp' },
  { id: 'twout_mb', label: '発信 (日本-携帯宛)',    labelEn: 'Outbound (Japan Mobile)',          category: 'Twilio発信',     billing: 'per_minute', unitPrice: 0.1850, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp' },
  { id: 'twout_voip', label: '発信 (日本-VOIP)',    labelEn: 'Outbound (Japan VoIP)',            category: 'Twilio発信',     billing: 'per_minute', unitPrice: 0.0746, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp', note: '宛先国により異なる' },
  { id: 'twout_appcall', label: '発信 (AppCall)', labelEn: 'Outbound (AppCall)',      category: 'Twilio発信',     billing: 'per_minute', unitPrice: 0.0040, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp', note: '宛先国により異なる' },
  { id: 'twout_sipi', label: '発信 (SIP Interface)', labelEn: 'Outbound (SIP Interface)', category: 'Twilio発信', billing: 'per_minute', unitPrice: 0.0040, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing/jp', note: '宛先国により異なる' },

  // Twilio サービス
  { id: 'studio',   label: 'Twilio Studio',    labelEn: 'Twilio Studio',              category: 'Twilioサービス', billing: 'per_call',   unitPrice: 0.01,   twilioUrl: 'https://www.twilio.com/ja-jp/studio/pricing' },
  { id: 'crelay',   label: 'ConversationRelay', labelEn: 'ConversationRelay',         category: 'Twilioサービス', billing: 'per_minute', unitPrice: 0.07,  twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing' },
  { id: 'mstream',  label: 'Media Streams',    labelEn: 'Media Streams',              category: 'Twilioサービス', billing: 'per_call',   unitPrice: 0.0040, twilioUrl: 'https://www.twilio.com/ja-jp/voice/pricing' },
  { id: 'verify',   label: 'Twilio Verify',    labelEn: 'Twilio Verify',              category: 'Twilioサービス', billing: 'per_call',   unitPrice: 0.05,   twilioUrl: 'https://www.twilio.com/ja-jp/user-authentication-identity/verify/pricing' },
  { id: 'taskr',    label: 'TaskRouter',       labelEn: 'TaskRouter',                 category: 'Twilioサービス', billing: 'per_call',   unitPrice: 0.01,   twilioUrl: 'https://www.twilio.com/ja-jp/taskrouter/pricing' },
  { id: 'flex',     label: 'Twilio Flex',      labelEn: 'Twilio Flex',                category: 'Twilioサービス', billing: 'custom',     unitPrice: 0,      twilioUrl: 'https://www.twilio.com/ja-jp/flex/pricing' },
  // 転送
  { id: 'fwdfx',    label: '転送先 (固定)',    labelEn: 'Forward To (Landline)',      category: '転送',           billing: 'free', unitPrice: 0 },
  { id: 'fwdmb',    label: '転送先 (携帯)',    labelEn: 'Forward To (Mobile)',        category: '転送',           billing: 'free', unitPrice: 0 },
  // 外部連携
  { id: 'extapi',   label: '外部API / LLM',   labelEn: 'External API / LLM',         category: '外部連携',       billing: 'free',     unitPrice: 0 },
  { id: 'server',   label: 'server',           labelEn: 'server',                     category: '外部連携',       billing: 'free',       unitPrice: 0 },
  { id: 'webhook',  label: 'Webhook Server',   labelEn: 'Webhook Server',             category: '外部連携',       billing: 'free',       unitPrice: 0 },
  { id: 'operator', label: 'オペレーター',     labelEn: 'Operator',                   category: '外部連携',       billing: 'free',       unitPrice: 0 },
  { id: 'sales',    label: '営業スタッフ',     labelEn: 'Sales Staff',                category: '外部連携',       billing: 'free',       unitPrice: 0 },
  { id: 'callee',   label: '着信先',           labelEn: 'Callee',                     category: '外部連携',       billing: 'free',       unitPrice: 0 },
];

export const CATEGORY_COLORS: Record<string, string> = {
  'ネットワーク':    '#6366f1', // indigo
  'Twilio着信':     '#ef4444', // red
  'Twilio発信':     '#f97316', // orange
  'Twilioサービス': '#f59e0b', // amber
  '転送':           '#10b981', // emerald
  '外部連携':       '#8b5cf6', // violet
};

export const DEFAULT_CATEGORY_COLOR = '#6b7280';

export const BILLING_LABELS: Record<BillingType, string> = {
  per_minute: '/min',
  per_call: '/call',
  free: 'Free',
  custom: 'Custom',
};

export const BILLING_OPTIONS: { value: BillingType; label: string }[] = [
  { value: 'per_minute', label: '/分 (per minute)' },
  { value: 'per_call',   label: '/通話 (per call)' },
  { value: 'free',       label: '無料 (free)' },
  { value: 'custom',     label: 'カスタム (custom)' },
];

import type { Language } from '../i18n/translations';
export function getBillingOptions(lang: Language): { value: BillingType; label: string }[] {
  if (lang === 'en') {
    return [
      { value: 'per_minute', label: '/min (per minute)' },
      { value: 'per_call',   label: '/call (per call)' },
      { value: 'free',       label: 'Free' },
      { value: 'custom',     label: 'Custom' },
    ];
  }
  return BILLING_OPTIONS;
}
