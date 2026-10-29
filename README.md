# 旅のしおり — GitHub Pages用

旅行のしおりをiPhone・iPadのSafariで開くための静的ビューアーです。
このリポジトリには、本人の旅程、予約番号、料金、メールへのリンク、ノート、写真を含めません。

## GitHub Pagesへの配置

1. このフォルダー内のファイルだけを、配置先リポジトリのルートに置きます。
2. リポジトリの **Settings → Pages → Build and deployment** を開きます。
3. **Deploy from a branch** を選び、`main` / `/ (root)` を指定して保存します。
4. GitHubが表示する公開URLをSafariで開きます。

GitHub FreeのPagesでは公開リポジトリが必要です。Pro等で非公開リポジトリを使う場合も、通常のPagesサイトはインターネットに公開されます。サイト自体のアクセス制限は、対応するEnterprise Cloud組織の機能です。

## 本人用しおりの読み込み

1. 既存の本人用Web版で記録している場合は、**その他 → 記録付きしおりを保存（HTML）** を使います。ノート・写真を持ち込めます。
2. 保存したHTMLを、iPhone・iPadの「ファイル」等で使える場所に置きます。
3. GitHub Pages版で **しおりを読み込む** を押し、そのHTMLを選びます。
4. Safariの共有メニューから **ホーム画面に追加** します。

最初のHTMLは端末内のIndexedDBに保存し、次回から同じ端末・ブラウザで自動表示します。しおり自体の予約・ノート等の保存機能も、同じブラウザの保存領域を使います。ブラウザのデータ削除、保存制限、端末の空き容量等により保存できない場合があります。

ファイル読み込みはブラウザ内で完結し、サーバーやGitHubへアップロードしません。読み込んだしおりの外部サイトをタップしたときは、そのサイトへの通信が発生します。

## 更新・記録の扱い

- 旅程の新版に入れ替える場合は、画面上の **ファイルを変更** から新版HTMLを選びます。
- 現在の非公開Web版から、入力済みの記録が自動転送されることはありません。移行には記録付きHTMLを使います。
- iPhone・iPad・Mac間の自動同期はありません。記録付きHTMLまたはJSONバックアップで引き継ぎます。
- 通信がない状態での起動は保証しません。HTMLと記録のバックアップも別途保管してください。
- HTMLを読み込むためのアプリであり、読み込んだHTMLの提供元を検証する機能ではありません。自分が保存したしおりを使ってください。
- 個人ファイルをリポジトリへコミットしないでください。`.gitignore`は誤操作を減らす補助であり、強制アップロードを防ぐものではありません。

## 構成

ビルドや外部CDN、APIキーは不要です。ルート直下とプロジェクト配下のPagesの両方で使える相対パスにしています。

## 確認状況

JavaScriptの構文、読み込み対象の検証、端末保存・再読み込み・失敗時の分岐、配布ファイルに個人データを含めないことをコード上で確認済みです。iPhone・iPad実機の表示・ダウンロード操作は未検証です。

## 公式情報

- [GitHub Pagesサイトの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Pagesサイト自体の公開範囲](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
