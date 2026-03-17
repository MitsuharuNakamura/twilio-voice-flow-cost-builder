# Changelog

## 2026-03-18 - 機能追加 (第4弾)

### Enterprise Editions & サポートプラン

- 右サイドバーに「Enterprise Editions」折りたたみセクションを追加
- エディション選択（ラジオボタン）: なし / Administration ($10/10%) / Security ($7,500/16%) / Enterprise ($15,000/20%)
- `max(最低月額, 利用料×%)` の自動計算、適用額をハイライト表示
- 個別機能アドオン（チェックボックス）: SSO / HIPAA / Message Redaction / Static Proxy / Voice Recording Encryption
- 「サポートプラン」折りたたみセクションを追加
- プラン選択: Developer(Free) / Production($250/4%) / Business($1,500/6%) / Personalized($5,000/8%)
- 合計表示: 利用料合計 → エディション費用 → アドオン費用 → サポート費用 → 総合計

### TTS (Text-to-Speech) ノード

- 新しい課金タイプ `tts` を追加
- TTSタイプ選択: Basic(無料) / Standard / Neural / Generative
- 1通話あたりの文字数入力、100文字ブロック単位で課金計算
- ボリュームディスカウント対応（Standard/Neural/Generative、月間総文字数に基づく4段階料金ティア）
- ノード設定パネルにTTS専用UI（タイプ選択・文字数入力・料金サマリ）
- キャンバス上のノードにTTSタイプ＋文字数バッジを表示

### per_kchar課金タイプ（1k文字単位課金）

- 新しい課金タイプ `per_kchar` を追加
- Generative Operator (Input/Output) で使用
- ノード設定パネルに文字数入力UI＋料金サマリを追加
- キャンバスノードに文字数バッジ表示

### 新規デフォルトノード追加

- **Twilioサービス**: Conference Calls ($0.0018/participant per min), 留守番電話検出/AMD ($0.0075/call), Voice Insights ($0.0024/min), TTS, Call Recording (Recording $0.0025/min, Storage $0.0005/min, Transcription $0.0500/min)
- **Conversational Intelligence** (新カテゴリ・ピンク): Transcription Batch/Streaming, Language Operator Standard/Text Analysis, Generative Operator Input/Output

### Toll-Free ID重複修正

- `twlocal` (重複) → `twtollfree` にIDを修正
- persist mergeロジックを改善: 常にDEFAULT_NODE_DEFINITIONS順に再構築し、新デフォルトノードが自動追加されるように

---

## 2026-03-17 - 機能追加 (第3弾)

### 日英言語切替 (i18n)

- ツールバーにJA/EN切替トグルを追加
- 全UIテキストを翻訳辞書で管理 (`src/i18n/translations.ts`)
- `useI18n()` フック: `t(key)`, `tCat(category)`, `tNode(id, label, labelEn)` を提供
- カテゴリ名・ノードラベル・ボタン・フォームラベル・メッセージ等すべて対応
- コスト内訳のラベル表示も言語切替に対応
- 言語設定はlocalStorageに永続化

### ノード定義のJA/EN対応

- `NodeDefinition` に `labelEn?: string` フィールドを追加
- 全デフォルトノードに英語ラベルを設定
- 新規作成・編集フォームに「名前(JA)」「名前(EN)」の2フィールドを追加
- 一括編集モーダルにEN名前列を追加
- persist mergeでlabelEnをデフォルトからバックフィル

### ノードラベル表示の改善

- ハードコードされた翻訳マップ (NODE_LABEL_DISPLAY) を廃止
- NodeDefinitionの `label`(JA) / `labelEn`(EN) を直接使用
- デフォルトラベル変更時に即座に反映されるように

### デフォルトノードラベル更新

- 着信ノードに国名を追加: 「Twilio 050番号」→「着信(日本 050番号)」等
- 発信ノードに国名を追加: 「発信(固定宛)」→「発信(日本-固定宛)」等

---

## 2026-03-13 - 機能追加 (第2弾)

### パレットの折りたたみ

- ノードパレットのカテゴリセクションをクリックで折りたたみ/展開可能に
- ▼アイコンの回転アニメーション付き、カテゴリごとのノード数表示

### Twilio発信カテゴリの追加

- 「Twilio発信」カテゴリ（orange）を新設: 発信(固定宛) / 発信(携帯宛) / 発信(国際)
- テンプレートに「架電: 基本発信」「受電→架電転送」を追加
- persist mergeロジックを改善し、新しいデフォルトノードがパレットの正しい位置に表示されるよう修正

### 図形・アノテーション機能

- ツールバーに「▭ 四角」「○ 丸」「T テキスト」ボタンを追加
- ShapeNodeコンポーネント: リサイズ可能な図形ノード（NodeResizer対応）
- 図形設定パネル: テキスト・文字サイズ・文字色・背景色・枠線色・枠線太さを自由にカスタマイズ
- ストアに `updateNodeData` アクションを追加

### Backspaceキーで削除

- Backspaceキーでも選択中のノード・エッジを削除可能に（Deleteキーに加えて）

---

## 2026-03-13 - 初回リリース + 機能拡張

### 初回実装

- React + Vite (TypeScript) + Tailwind CSS + @xyflow/react + Zustand でプロジェクト構築
- 14種類のノード定義（ネットワーク / Twilio着信 / Twilioサービス / 転送 / 外部連携）
- ドラッグ&ドロップによるフロービルダー
- カテゴリ別カラーアクセント付きカスタムノード
- 右サイドバーのコスト計算パネル（月間通話数・平均通話時間・JPY/USD切替・為替レート設定）
- コスト内訳テーブル（課金タイプバッジ・Twilio料金ページリンク付き）
- ノードクリックによる単価カスタマイズ
- テンプレート機能（基本転送フロー / AI通話フロー）
- 免責文表示

### 区間別通話時間の計算

- per_minute課金ノードごとに個別の通話時間を設定可能に
- 例: AI 2分 + 転送先 1分 のように区間を分けてコスト計算
- ノード設定パネルに「このノードの通話時間」入力を追加
- キャンバス上のノードにカスタム通話時間バッジを表示

### ノードパレットの編集機能

- パレットから新規ノード定義を作成可能（名前・カテゴリ・課金タイプ・単価・URL）
- 既存ノード定義の編集・削除（ホバーで編集/削除ボタン表示）
- 新規カテゴリの追加にも対応

### USD基準の単価表示

- パレット・キャンバス上ノード・ノード設定パネルの単価表示をすべてUSD基準に統一
- 新規作成・編集フォームの単価入力もUSD
- 内部的にはJPYで保持し、為替レートで変換

### 永続化 (localStorage)

- zustand/persist でノード定義・月間通話数・平均通話時間・通貨・為替レートを永続保存
- 「初期値に戻す」ボタンでノード定義をデフォルトにリセット

### ドロップ位置の修正

- `screenToFlowPosition` を使用し、ズーム・パン状態を考慮した正確なドロップ位置にノードを配置

### 数値入力の修正

- 単価・通話時間の入力を `type="text" inputMode="decimal"` + 文字列state管理に変更
- キーボードから直接数字を入力可能に（再計算による入力値上書き問題を修正）

### フロー保存/読込

- ツールバーに「保存」「読込」ボタンを追加
- 現在のフロー（ノード配置・接続・カスタム単価・通話時間）に名前を付けてlocalStorageに保存
- 保存済みフロー一覧から読込・削除が可能（保存日時・ノード数表示）

### 一括単価編集

- パレットヘッダーの「一括編集」からモーダルを開く
- カテゴリ別テーブルで全ノードの名前・課金タイプ・単価(USD)を一画面で編集
- 「すべて保存」で一括反映
