# Twilio 通話コスト計算フロービルダー

Twilioを使った電話システムの構成をGUIで組み立て、月額コストを自動計算するWebアプリです。

## 主な機能

- **フロービルダー** — ノードをドラッグ&ドロップで配置し、エッジで接続してコールフローを構築
- **コスト自動計算** — 月間通話数・平均通話時間から月額コストを自動算出（USD/JPY対応）
- **区間別通話時間** — 転送前後など、ノードごとに通話時間を個別設定可能
- **ノード定義のカスタマイズ** — ノードの追加・編集・削除・一括編集
- **テンプレート** — 受電転送、AI通話、架電など典型的なフローをワンクリックで生成
- **図形・アノテーション** — 四角・丸・テキストを自由配置（色・サイズ変更可）
- **フロー保存/読込** — 作成したフローをlocalStorageに保存・復元
- **エッジ矢印設定** — 接続線の始点・終点に矢印のON/OFF設定

## 技術スタック

- [React](https://react.dev/) + [Vite](https://vite.dev/) (TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) (@tailwindcss/vite)
- [@xyflow/react](https://reactflow.dev/) (React Flow v12+) — ノードベースフローエディタ
- [Zustand](https://zustand-demo.pmnd.rs/) — 状態管理 + localStorage永続化

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:5173 で開きます。

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが生成されます。任意のホスティングサービスでそのまま配信可能です。

## デプロイ（Cloudflare Pages）

1. GitHubにpush
2. Cloudflareダッシュボード → Workers & Pages → Create → Pages
3. リポジトリを選択し、以下を設定:
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
   - 環境変数: `NODE_VERSION` = `20`
4. 以降はpushで自動デプロイ

## 免責事項

表示金額は概算です。最新の正確な料金は[Twilio公式サイト](https://www.twilio.com/ja-jp/pricing)をご確認ください。
