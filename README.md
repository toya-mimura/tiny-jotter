# Tiny Jotter

NW-A306 (3.6インチ Walkman) 等でも使える超軽量メモ投稿ツール。  
（普通にスマホやPCブラウザからも使えます）  
ブラウザでHTMLを開く → メモを書く → Discord に飛ぶ。  
認証は Cloudflare Access (Zero Trust) のメール認証で保護。

## 構成

```
index.html              ← フロントエンド（テキストエリア＋POSTボタンだけ）
functions/api/post.js   ← Cloudflare Pages Function（Discord Webhook 中継）
```

## セットアップ

### 1. GitHub にリポジトリを作成

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/<YOUR_USER>/tiny-jotter.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare Pages でデプロイ

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. **Pages** タブ → **Connect to Git**
3. GitHub を連携し、`digital-jotter` リポジトリを選択
4. ビルド設定:
   - **Framework preset**: `None`
   - **Build command**: （空欄）
   - **Build output directory**: `/`
5. **Save and Deploy**

### 3. 環境変数を設定

Pages プロジェクトの **Settings** → **Environment variables**:

| 変数名 | 値 |
|---|---|
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/xxxxx/yyyyy` |

> Production と Preview の両方に設定すること。  
> 設定後 **Deployments** → **Retry deployment** で反映。

### 4. Cloudflare Access でメール認証を設定

1. [Zero Trust Dashboard](https://one.dash.cloudflare.com/) を開く
2. **Access** → **Applications** → **Add an application**
3. **Self-hosted** を選択
4. 設定:
   - **Application name**: `Digital Jotter`
   - **Session duration**: `24 hours`（もしくはお好みで）
   - **Application domain**: `<your-project>.pages.dev`
     - サブドメインを使っている場合はそちらを指定
5. **Add policy**:
   - **Policy name**: `Allow me`
   - **Action**: `Allow`
   - **Include** → **Emails**: 自分のメールアドレスを入力
6. **Save**

これで、アクセスするとまずメール認証画面が出て、ワンタイムコードで本人確認されます。一度認証すればセッション期間中は再入力不要です。

### 5. Walkman で使う

1. NW-A306 のブラウザで `https://<your-project>.pages.dev` を開く
2. メールアドレスを入力 → ワンタイムコードで認証
3. メモを書いて POST！

## 機能

- **Cloudflare Access 認証**: メールOTPで保護、URL漏洩しても安全
- **タグ**: 任意でタグを付けてDiscordで検索しやすく
- **Ctrl+Enter**: ショートカットで即送信
- **文字数カウント**: 右上にリアルタイム表示
- **ダークUI**: 有機ELでバッテリーにやさしい

## Discord での見え方

```
`#ブログネタ`
散歩中に思いついたけど、AIが自動で音楽のBPMを
検出してプレイリスト作る機能あったら面白くない？
2026/06/05 14:32:10
```

## カスタマイズ

- **フォントサイズ**: `textarea` の `font-size` を変更
- **配色**: `:root` の CSS 変数を調整
- **Discord Embed**: `post.js` で `embeds` を使えばリッチ表示も可能
- **タグのプリセット**: タグ欄をドロップダウンにすれば定型タグも選べる
