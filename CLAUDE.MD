# Twilio 通話コスト計算フロービルダー

## 概要

Twilioを使った電話システムの構成をGUIで組み立て、月額コストを自動計算するWebアプリ。

## 技術スタック

- React + Vite (TypeScript)
- スタイリング: Tailwind CSS (@tailwindcss/vite)
- ドラッグ&ドロップ: @xyflow/react (React Flow v12+)
- 状態管理: Zustand (persist middleware でlocalStorage永続化)

---

## 主な機能

### 1. フロービルダー（メイン画面）

React Flowを使ったノードベースのフローエディタ。

- 左サイドバーにノードパレット（カテゴリ別）
- パレットのノードをドラッグ&ドロップでキャンバスに配置（`screenToFlowPosition`でズーム・パン対応）
- ノード同士をエッジ（矢印）で接続
- ノードを選択してDelete/Backspaceキーで削除
- エッジをクリックで削除

---

### 2. ノードの種類と料金データ

18種類のデフォルトノード定義。各ノードはカテゴリ・ラベル・単価(JPY内部保持)・課金タイプを持つ。
ノード定義はZustandストアで管理され、ユーザーが追加・編集・削除可能。localStorageで永続化。

```typescript
type BillingType = 'per_minute' | 'per_call' | 'free' | 'custom';
```

デフォルト定義: `src/data/nodeDefinitions.ts` の `DEFAULT_NODE_DEFINITIONS`

**カテゴリ:**
- ネットワーク (indigo): 架電者, PSTN/NTTCOM
- Twilio着信 (red): 050番号, 市外局番
- Twilio発信 (orange): 発信(固定宛), 発信(携帯宛), 発信(国際)
- Twilioサービス (amber): Studio, ConversationRelay, Media Streams, Verify, TaskRouter, Flex
- 転送 (emerald): 固定, 携帯
- 外部連携 (violet): 外部API/LLM, オペレーター, 着信先

**ノードパレット機能:**
- カテゴリセクションは折りたたみ/展開可能（▼アイコン、ノード数表示）
- ドラッグ&ドロップでキャンバスに配置
- 「+ 新規」でノード定義を新規作成（名前・カテゴリ・課金タイプ・単価USD・URL）
- ホバーで編集(✎)・削除(×)ボタン表示
- 「一括編集」で全ノードの名前・課金タイプ・単価をモーダルで一括編集
- 「初期値に戻す」でデフォルト18種類にリセット
- 単価表示はUSD基準

---

### 3. 右サイドバー（コスト計算パネル）

**入力パラメータ:**

- 月間通話数（デフォルト: 500件）
- 平均通話時間（デフォルト: 3分）
- 通貨切り替えトグル: JPY / USD（1USD = 150円をデフォルト値。為替レートは手動入力可能）

**コスト内訳テーブル:**

- キャンバス上のノードを集計して表示
- 各ノードの [ノード名] [課金タイプバッジ] [カスタム通話時間バッジ] [月額] を一覧表示
- 課金タイプバッジ: 「/min」「/call」「Free」「Custom」
- Twilio公式料金ページへのリンクアイコン（twilioUrlがある場合）
- 合計金額を太字で表示
- 1通話あたりコストも表示

**ノード設定パネル（右サイドバー下部）:**

- ノードクリックで表示
- 単価をUSDで手動上書き可能（内部JPY変換）
- per_minuteノード: 個別の通話時間(分)を設定可能（区間別コスト計算用）
- 「デフォルトに戻す」ボタン
- 「Twilio公式料金ページで確認する →」リンク

---

### 4. ツールバー（キャンバス上部）

- 「選択削除」ボタン
- 「クリア」ボタン
- 「保存」ボタン: 現在のフロー（ノード・エッジ・カスタム単価・通話時間）に名前を付けてlocalStorageに保存
- 「読込 (N)」ボタン: 保存済みフロー一覧をドロップダウン表示。読込・削除可能
- 図形ボタン: 「▭ 四角」「○ 丸」「T テキスト」— クリックでキャンバス中央に配置
- テンプレートボタン:
  - **「受電: 基本転送」**: 架電者 → NTTCOM → Twilio050 → Studio → 固定転送 / 携帯転送
  - **「受電: AI通話」**: 架電者 → NTTCOM → Twilio050 → MediaStreams → ConversationRelay → 外部API
  - **「架電: 基本発信」**: Studio → 発信(固定宛) → 着信先
  - **「受電→架電転送」**: 架電者 → NTTCOM → Twilio050 → ConversationRelay → 外部API / 発信(携帯宛) → 着信先

---

### 5. ノードのデザイン

**TwilioNode** — React Flowのカスタムノード:

- 左側にカテゴリカラーのアクセントバー（4px幅）
- ノード名（太字）
- 単価テキスト（USD表示、小さめ、グレー）
- 入力ハンドル（左）・出力ハンドル（右）
- カスタム単価設定済み: ✎アイコン
- カスタム通話時間設定済み: 「Nmin/call」ラベル

**ShapeNode** — 自由配置の図形/アノテーション:

- 四角形 / 円 / テキストの3種類
- NodeResizerでリサイズ可能
- 背景色・枠線色・枠線太さ・文字色・文字サイズをカスタマイズ可能
- 選択時に右サイドバーに図形設定パネルを表示
- 四角/円にはハンドル付き、テキストはハンドルなし

---

### 6. 区間別通話時間

per_minute課金ノードは個別に通話時間を設定可能。

例: 3分通話でAI 2分 → 転送 1分の場合
- ConversationRelay: 2分に設定
- 転送先(固定): 1分に設定
- 各区間の正確なコストが計算される

設定しない場合はグローバルの「平均通話時間」が適用。

---

### 7. 永続化

- **zustand/persist**: ノード定義・月間通話数・平均通話時間・通貨・為替レートをlocalStorage (`twilio-cost-calc`) に保存
- **フロー保存**: 保存済みフローはlocalStorage (`twilio-cost-calc-flows`) に配列で保存

---

### 8. その他

- レスポンシブ対応（最小幅 1024px想定）
- ノードのパラメータと接続情報はZustandで管理
- 為替レートは設定パネルで変更可能
- 数値入力は `type="text" inputMode="decimal"` + 文字列state管理（キーボード直接入力対応）
- 免責文: 「※ 表示金額は概算です。最新の正確な料金はTwilio公式サイトをご確認ください。」

---

## ファイル構成

```
src/
  components/
    FlowBuilder.tsx         # React Flowメインキャンバス + ツールバー + フロー保存/読込
    NodePalette.tsx         # 左パレット（ノード定義CRUD・ドラッグ&ドロップ）
    CostPanel.tsx           # 右コスト計算パネル
    NodeSettingsPanel.tsx   # ノード設定（TwilioNode: 単価・通話時間 / ShapeNode: 色・テキスト）
    BulkPriceEditor.tsx     # 一括単価編集モーダル
    nodes/
      TwilioNode.tsx        # Twilioノードコンポーネント
      ShapeNode.tsx         # 図形ノードコンポーネント（四角・丸・テキスト）
  store/
    flowStore.ts            # Zustand store（ノード・エッジ・設定・永続化・フロー保存）
  data/
    nodeDefinitions.ts      # デフォルトノード定義・カテゴリカラー・課金タイプラベル
  utils/
    costCalculator.ts       # コスト計算ロジック（区間別通話時間対応）
  App.tsx                   # ReactFlowProvider + レイアウト + モーダル管理
  main.tsx
  index.css                 # Tailwind + React Flow CSS
```

---

## 注意点

- `@xyflow/react` の最新版を使うこと（v12以降）
- React FlowのカスタムノードはNodeTypesとして登録する
- コスト計算はノードのIDではなく「同一種類のノードが複数ある場合は合算」する
- 金額表示は常に `toLocaleString()` で3桁カンマ区切り
- float演算誤差に注意して `Math.round()` を適切に使う
- 単価は内部的にJPYで保持し、UIではUSD表示・入力（exchangeRateで変換）
- 数値入力フィールドは `type="text" inputMode="decimal"` + 文字列stateで管理すること（`type="number"` + 計算値バインドだとキーボード入力が壊れる）
