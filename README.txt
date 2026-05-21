Simple Mystery Dungeon PWA v0.2.1

概要:
不思議なダンジョン風の遊び方を参考にした、オリジナルのシンプルPWAです。
固有名詞・キャラクター・画像・詳細データは流用していません。

GAS URLは組み込み済みです:
https://script.google.com/macros/s/AKfycbzUJb7b8I7w5HG7h7OeR-43vawtbcBiudTLO2qzOhOrt4O9IYxIRnhObWn9-n3Io5dUoA/exec

追加機能:
- 装備: 武器、盾、指輪
- 壺: 回復の壺、識別の壺、保存の壺
- 杖: 火ばしら、鈍足、ふきとばし、場所替え
- 巻物: 識別、いかずち、ワープ、帰還
- 未識別アイテム: 草、巻物、杖、壺、指輪
- モンスター特殊能力: 分裂、2回行動、遠距離攻撃、盗み、壁抜け、毒
- 倉庫: 帰還・クリア時に持ち物と装備を保存。冒険前に最大8個まで持ち出し可能
- 店: 店マスに乗ると商品を購入可能
- ダンジョン別ランキング
- 最新版に更新ボタン

ローカル確認:
ZIPを展開して start_local_server_v0_2_1.bat を実行してください。
ブラウザで http://localhost:8000/mysterious_dungeon_pwa_v0_2_1/ を開きます。

Google Apps Script:
gas/Code.gs はダンジョン別ランキング対応版です。既存GASへ上書きしてください。
旧ランキングシートがある場合、不足列は自動追加します。
