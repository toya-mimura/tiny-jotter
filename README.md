# Tiny Jotter

NW-A306 (3.6インチ Walkman) 等でも使える超軽量メモ投稿ツール。  
ブラウザでHTMLを開く → メモを書く → Discord に飛ぶ。  
認証は Cloudflare Access (Zero Trust) のメール認証で保護。

## フォルダ構成

```
tiny-jotter/
├── public/             ← 静的ファイル（Build output directory）
│   └── index.html
├── functions/          ← Pages Functions（ルート直下に置くこと！）
│   └── api/
│       └── post.js
└── README.md
```

> ⚠️ **重要**: `functions/` は `public/` の中ではなく、リポジトリのルート直下に置く。
> Cloudflare Pages は Build output directory の外にある `functions/` を
> サーバーレス関数として認識する。

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
3. GitHub を連携し、`tiny-jotter` リポジトリを選択
4. ビルド設定:
   - **Framework preset**: `None`
   - **Build command**: `exit 0`
   - **Build output directory**: `public`
5. **Save and Deploy**

### 3. 環境変数を設定

Pages プロジェクトの **Settings** → **Environment variables**:

| 変数名 | 値 |
|---|---|
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/xxxxx/yyyyy` |

> Production と Preview の両方に設定すること。
> 設定後、Deployments → Retry deployment で反映。

### 4. Cloudflare Access でメール認証を設定

1. [Zero Trust Dashboard](https://one.dash.cloudflare.com/) を開く
2. **Access** → **Applications** → **Add an application**
3. **Self-hosted** を選択
4. 設定:
   - **Application name**: `Tiny Jotter`
   - **Session duration**: `24 hours`
   - **Application domain**: カスタム入力で `tiny-jotter.pages.dev`
5. **Add policy**:
   - **Policy name**: `Allow me`
   - **Action**: `Allow`
   - **Include** → **Emails**: 自分のメールアドレスを入力
6. **Save**

### 5. Walkman で使う

1. NW-A306 のブラウザで `https://tiny-jotter.pages.dev` を開く
2. メールアドレスを入力 → ワンタイムコードで認証
3. メモを書いて POST！
