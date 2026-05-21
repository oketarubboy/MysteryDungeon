# Simple Mystery Dungeon PWA v0.1.0

## 内容
トルネコ系の「不思議なダンジョン」風の遊び方を参考にした、オリジナルのシンプルなPWAサンプルです。
固有名詞・キャラクター・画像・詳細データは流用していません。

## ファイル
- index.html
- style.css
- app.js
- sw.js
- manifest.json
- icon.svg
- gas/Code.gs

## 遊び方
1. index.html をHTTPS環境、またはローカルサーバーで開きます。
2. プレイヤー名を入力します。
3. 「冒険を開始」を押します。
4. 方向キー、WASD、または画面下の十字キーで移動します。
5. 敵に向かって移動すると攻撃します。
6. 階段「▽」に乗ると次の階へ進みます。
7. 10階到達でクリアです。

## ランキング
app.js の先頭付近にある下記へGoogle Apps ScriptのWebアプリURLを設定してください。

const GAS_URL = "";

例:
const GAS_URL = "https://script.google.com/macros/s/xxxxxxxx/exec";

GAS_URLが空の場合は、端末内のローカルランキングだけで動作します。

## Google Apps Script設定
1. Googleスプレッドシートを新規作成
2. 拡張機能 → Apps Script
3. gas/Code.gs の内容を貼り付け
4. デプロイ → 新しいデプロイ → ウェブアプリ
   - 実行ユーザー: 自分
   - アクセスできるユーザー: 全員
5. 発行された /exec URL を app.js の GAS_URL に貼り付け

## PWA更新
画面右上の「最新版に更新」ボタンで、
- Service Worker登録解除
- Cache Storage削除
- キャッシュ回避パラメータ付き再読み込み
を行います。

## 次に追加しやすい機能
- アイテム欄と装備
- 未識別アイテム
- 合成
- モンスターごとの特殊能力
- 店
- 倉庫
- ダンジョン別ランキング
- 日替わりダンジョン
