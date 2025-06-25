# Google Custom Search API MCP サーバー仕様書

## 概要

Google の Custom Search API を呼び出す Model Context Protocol (MCP) サーバーの実装仕様。

## 技術仕様

### 開発環境
- **言語**: TypeScript
- **ランタイム**: Node.js (v18.0.0以上)
- **パッケージマネージャー**: bun
- **ビルドツール**: TypeScript Compiler (tsc)

### 依存関係
- `@modelcontextprotocol/sdk`: MCP SDK
- `zod`: スキーマバリデーション
- `@types/node`: Node.js型定義
- `bun-types`: Bun型定義

## 機能仕様

### 環境変数設定
以下の環境変数が必須：

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `GOOGLE_API_KEY` | Google Cloud Console で取得したAPIキー | ✓ |
| `GOOGLE_SEARCH_ENGINE_ID` | Google Custom Search Engine ID | ✓ |

### 提供ツール

#### `google_search`
Google Custom Search API を使用してウェブ検索を実行。

**パラメータ:**
- `query` (string, 必須): 検索クエリ
- `limit` (number, オプション): 取得する結果の最大数
  - 範囲: 1-10
  - デフォルト: 10

**レスポンス形式:**
```json
{
  "query": "検索クエリ",
  "totalResults": "総結果数",
  "searchTime": 0.123,
  "results": [
    {
      "title": "結果のタイトル",
      "link": "https://example.com",
      "snippet": "結果の要約",
      "displayLink": "example.com"
    }
  ]
}
```

## プロジェクト構成

```
open-custom-search-api-mcp-server/
├── src/
│   └── index.ts              # MCPサーバーメイン実装
├── tests/
│   └── index.test.ts         # テストスイート
├── dist/                     # ビルド出力
├── package.json              # パッケージ設定
├── tsconfig.json             # TypeScript設定
├── README.md                 # ドキュメント
└── .gitignore               # Git除外設定
```

## 実装詳細

### MCPサーバークラス (`CustomSearchMCPServer`)

**主要メソッド:**
- `constructor()`: 環境変数の検証とサーバー初期化
- `setupToolHandlers()`: ツールハンドラーの設定
- `performSearch(query, limit)`: Google Custom Search API呼び出し
- `run()`: サーバー起動

**エラーハンドリング:**
- 環境変数未設定時の例外
- API呼び出しエラーの捕捉
- 不正なパラメータのバリデーション

### API統合

**エンドポイント:** `https://www.googleapis.com/customsearch/v1`

**パラメータマッピング:**
- `key`: Google API キー
- `cx`: Custom Search Engine ID
- `q`: 検索クエリ
- `num`: 結果数制限

## テスト仕様

### テストカバレッジ
- サーバー初期化テスト
- 環境変数バリデーションテスト  
- パラメータバリデーションテスト
- API URL構築テスト
- レスポンス処理テスト

### テスト実行
```bash
bun test
```

## ビルド・実行手順

### 依存関係インストール
```bash
bun install
```

### ビルド
```bash
bun run build
```

### 実行
```bash
# 環境変数設定
export GOOGLE_API_KEY="your-api-key"
export GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"

# サーバー起動
bun run start
```

### 開発モード
```bash
bun run dev
```

## セキュリティ考慮事項

- API キーは環境変数で管理
- `.gitignore` で機密情報を除外
- 入力パラメータのバリデーション
- API レスポンスの適切な処理

## 制限事項

- Google Custom Search API の利用制限に準拠
- 検索結果数は最大10件まで
- 環境変数の設定が必須