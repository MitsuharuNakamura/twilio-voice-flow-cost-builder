export type Language = 'ja' | 'en';

const translations = {
  // ===== Toolbar (FlowBuilder) =====
  toolbar: { ja: 'ツールバー', en: 'Toolbar' },
  deleteSelected: { ja: '選択削除', en: 'Delete Selected' },
  clear: { ja: 'クリア', en: 'Clear' },
  save: { ja: '保存', en: 'Save' },
  load: { ja: '読込', en: 'Load' },
  noSavedFlows: { ja: '保存されたフローはありません', en: 'No saved flows' },
  nodes: { ja: 'ノード', en: 'nodes' },
  shapes: { ja: '図形:', en: 'Shapes:' },
  shapeRect: { ja: '▭ 四角', en: '▭ Rect' },
  shapeCircle: { ja: '○ 丸', en: '○ Circle' },
  shapeText: { ja: 'T テキスト', en: 'T Text' },
  templates: { ja: 'テンプレート:', en: 'Templates:' },
  saveFlow: { ja: 'フローを保存', en: 'Save Flow' },
  enterFlowName: { ja: 'フロー名を入力', en: 'Enter flow name' },
  cancel: { ja: 'キャンセル', en: 'Cancel' },
  confirmDelete: { ja: (name: string) => `「${name}」を削除しますか？`, en: (name: string) => `Delete "${name}"?` },

  // ===== Templates =====
  tplBasicForward: { ja: '受電: 基本転送', en: 'Inbound: Basic Forward' },
  tplAiInbound: { ja: '受電: AI通話', en: 'Inbound: AI Call' },
  tplOutboundCall: { ja: '架電: 基本発信', en: 'Outbound: Basic Call' },
  tplAiInboundToOutbound: { ja: '受電→架電転送', en: 'Inbound→Outbound Transfer' },

  // ===== Node Palette =====
  nodePalette: { ja: 'ノードパレット', en: 'Node Palette' },
  newNode: { ja: '+ 新規', en: '+ New' },
  bulkEdit: { ja: '一括編集', en: 'Bulk Edit' },
  resetToDefaults: { ja: '初期値に戻す', en: 'Reset to Defaults' },
  confirmResetDefs: {
    ja: 'ノード定義を初期値に戻しますか？追加・編集した内容はすべてリセットされます。',
    en: 'Reset node definitions to defaults? All customizations will be lost.',
  },
  editNode: { ja: 'ノード編集', en: 'Edit Node' },
  createNode: { ja: '新規ノード作成', en: 'Create New Node' },
  name: { ja: '名前', en: 'Name' },
  nodeName: { ja: 'ノード名', en: 'Node name' },
  category: { ja: 'カテゴリ', en: 'Category' },
  newCategoryBtn: { ja: '+新規', en: '+New' },
  newCategoryPlaceholder: { ja: '新しいカテゴリ名', en: 'New category name' },
  existing: { ja: '既存', en: 'Existing' },
  billingType: { ja: '課金タイプ', en: 'Billing Type' },
  unitPriceUsd: { ja: '単価 (USD)', en: 'Unit Price (USD)' },
  pricingUrlOptional: { ja: '料金ページURL (任意)', en: 'Pricing URL (optional)' },
  edit: { ja: '編集', en: 'Edit' },
  delete: { ja: '削除', en: 'Delete' },

  // ===== Cost Panel =====
  costCalculation: { ja: 'コスト計算', en: 'Cost Calculation' },
  monthlyCallCount: { ja: '月間通話数', en: 'Monthly Calls' },
  avgCallDuration: { ja: '平均通話時間 (分)', en: 'Avg Call Duration (min)' },
  currency: { ja: '通貨', en: 'Currency' },
  exchangeRate: { ja: '為替レート (1USD = ¥)', en: 'Exchange Rate (1USD = ¥)' },
  costBreakdown: { ja: 'コスト内訳', en: 'Cost Breakdown' },
  placeNodes: { ja: 'ノードをキャンバスに配置してください', en: 'Place nodes on the canvas' },
  min: { ja: '分', en: 'min' },
  twilioPricingPage: { ja: 'Twilio公式料金ページ', en: 'Twilio Pricing Page' },
  totalMonthly: { ja: '合計 (月額)', en: 'Total (Monthly)' },
  perCall: { ja: '1通話あたり', en: 'Per Call' },
  disclaimer: {
    ja: '※ 表示金額は概算です。最新の正確な料金はTwilio公式サイトをご確認ください。',
    en: '* Displayed amounts are estimates. Please check the official Twilio website for the latest pricing.',
  },

  // ===== Edge Settings =====
  edgeSettings: { ja: 'エッジ設定', en: 'Edge Settings' },
  arrowAtStart: { ja: '始点に矢印', en: 'Arrow at start' },
  arrowAtEnd: { ja: '終点に矢印', en: 'Arrow at end' },

  // ===== Node Settings =====
  nodeSettings: { ja: 'ノード設定', en: 'Node Settings' },
  definitionInfo: {
    ja: (label: string, billing: string) => `定義: ${label} / 課金タイプ: ${billing}`,
    en: (label: string, billing: string) => `Def: ${label} / Billing: ${billing}`,
  },
  displayLabel: { ja: '表示ラベル', en: 'Display Label' },
  resetToDefault: { ja: 'デフォルトに戻す', en: 'Reset to Default' },
  resetToDefaultWithLabel: {
    ja: (label: string) => `デフォルトに戻す (${label})`,
    en: (label: string) => `Reset to Default (${label})`,
  },
  resetToDefaultWithPrice: {
    ja: (price: string) => `デフォルトに戻す ($${price})`,
    en: (price: string) => `Reset to Default ($${price})`,
  },
  nodeDuration: { ja: 'このノードの通話時間 (分)', en: 'Call Duration for This Node (min)' },
  nodeDurationHelp: {
    ja: '転送などで区間が分かれる場合、このノードが使われる時間を設定',
    en: 'If the call is split into segments, set the duration this node is used',
  },
  resetToDefaultDuration: {
    ja: (min: number) => `デフォルトに戻す (全体: ${min}分)`,
    en: (min: number) => `Reset to Default (Overall: ${min}min)`,
  },
  checkTwilioPricing: { ja: 'Twilio公式料金ページで確認する →', en: 'Check Twilio Pricing Page →' },
  customPriceSet: { ja: 'カスタム単価設定済み', en: 'Custom price set' },

  // ===== Shape Settings =====
  shapeSettings: { ja: '図形設定', en: 'Shape Settings' },
  shapeRect2: { ja: '四角形', en: 'Rectangle' },
  shapeCircle2: { ja: '円', en: 'Circle' },
  shapeText2: { ja: 'テキスト', en: 'Text' },
  text: { ja: 'テキスト', en: 'Text' },
  label: { ja: 'ラベル', en: 'Label' },
  fontSize: { ja: '文字サイズ', en: 'Font Size' },
  textColor: { ja: '文字色', en: 'Text Color' },
  bgColor: { ja: '背景色', en: 'Background' },
  borderColor: { ja: '枠線色', en: 'Border Color' },
  borderWidth: { ja: '枠線の太さ', en: 'Border Width' },

  // ===== Bulk Price Editor =====
  bulkPriceEditor: { ja: '一括単価編集', en: 'Bulk Price Editor' },
  saveAll: { ja: 'すべて保存', en: 'Save All' },

  // ===== Billing Options =====
  billingPerMinute: { ja: '/分 (per minute)', en: '/min (per minute)' },
  billingPerCall: { ja: '/通話 (per call)', en: '/call (per call)' },
  billingFree: { ja: '無料 (free)', en: 'Free' },
  billingCustom: { ja: 'カスタム (custom)', en: 'Custom' },
  billingTts: { ja: 'TTS', en: 'TTS' },

  // ===== TTS =====
  ttsType: { ja: 'TTSタイプ', en: 'TTS Voice Type' },
  ttsCharsPerCall: { ja: '1通話あたりの文字数', en: 'Characters per call' },
  ttsBlocks: { ja: 'ブロック数', en: 'Blocks' },
  ttsMonthlyChars: { ja: '月間総文字数', en: 'Monthly total chars' },
  ttsRatePerBlock: { ja: '単価/ブロック', en: 'Rate/block' },
  ttsPerCall: { ja: '1通話あたり', en: 'Per call' },

  // ===== Categories =====
  catNetwork: { ja: 'ネットワーク', en: 'Network' },
  catTwilioInbound: { ja: 'Twilio着信', en: 'Twilio Inbound' },
  catTwilioOutbound: { ja: 'Twilio発信', en: 'Twilio Outbound' },
  catTwilioServices: { ja: 'Twilioサービス', en: 'Twilio Services' },
  catConvIntel: { ja: 'Conversational Intelligence', en: 'Conversational Intelligence' },
  catForwarding: { ja: '転送', en: 'Forwarding' },
  catExternal: { ja: '外部連携', en: 'External Integration' },

  // ===== Enterprise Editions =====
  enterpriseEditions: { ja: 'Enterprise Editions', en: 'Enterprise Editions' },
  edition: { ja: 'エディション', en: 'Edition' },
  addons: { ja: '個別機能（アドオン）', en: 'Add-ons' },
  usageTotal: { ja: '利用料合計', en: 'Usage Total' },
  editionFee: { ja: 'エディション費用', en: 'Edition Fee' },
  editionMinFee: { ja: '最低月額', en: 'Min. Monthly' },
  editionUsageFee: { ja: '利用料率', en: 'Usage Rate' },
  addonFee: { ja: 'アドオン費用', en: 'Add-on Fee' },
  grandTotal: { ja: '総合計 (月額)', en: 'Grand Total (Monthly)' },
  applied: { ja: '適用', en: 'Applied' },
  supportPlan: { ja: 'サポートプラン', en: 'Support Plan' },
  supportFee: { ja: 'サポート費用', en: 'Support Fee' },

  // ===== Language toggle =====
  language: { ja: '言語', en: 'Language' },
} as const;

export type TranslationKey = keyof typeof translations;

// Simple translation value type (string or function)
type TranslationValue = string | ((...args: never[]) => string);

export function getTranslation(key: TranslationKey, lang: Language): TranslationValue {
  return translations[key][lang];
}

// Category display name mapping (stored key -> display name)
const CATEGORY_DISPLAY: Record<string, Record<Language, string>> = {
  'ネットワーク': { ja: 'ネットワーク', en: 'Network' },
  'Twilio着信': { ja: 'Twilio着信', en: 'Twilio Inbound' },
  'Twilio発信': { ja: 'Twilio発信', en: 'Twilio Outbound' },
  'Twilioサービス': { ja: 'Twilioサービス', en: 'Twilio Services' },
  'Conversational Intelligence': { ja: 'Conversational Intelligence', en: 'Conversational Intelligence' },
  '転送': { ja: '転送', en: 'Forwarding' },
  '外部連携': { ja: '外部連携', en: 'External Integration' },
};

export function translateCategory(category: string, lang: Language): string {
  return CATEGORY_DISPLAY[category]?.[lang] ?? category;
}

// label = JA label (source of truth), labelEn = EN label from definition
export function translateNodeLabel(_nodeId: string, label: string, lang: Language, labelEn?: string): string {
  if (lang === 'en') {
    return labelEn || label;
  }
  return label;
}

export default translations;
