/**
 * Simple Mystery Dungeon Ranking API
 *
 * 使い方:
 * 1. Googleスプレッドシートを作成
 * 2. 拡張機能 → Apps Script
 * 3. このコードを貼り付け
 * 4. deploy → 新しいデプロイ → ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 5. 発行された /exec URL を app.js の GAS_URL に貼り付け
 */

const SHEET_NAME = 'ranking';

function doGet(e) {
  const action = (e.parameter.action || 'ranking').toLowerCase();
  const callback = e.parameter.callback || '';

  let result;
  if (action === 'ranking') {
    result = {
      ok: true,
      ranking: getRanking_(Number(e.parameter.limit || 10))
    };
  } else {
    result = { ok: false, error: 'unknown action' };
  }

  const json = JSON.stringify(result);
  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const p = e.parameter || {};
  const sheet = getSheet_();

  sheet.appendRow([
    new Date(),
    sanitize_(p.name || '名無し'),
    toNumber_(p.score),
    toNumber_(p.floor),
    toNumber_(p.level),
    toNumber_(p.gold),
    toNumber_(p.defeated),
    toNumber_(p.turn),
    String(p.cleared) === 'true',
    sanitize_(p.version || '')
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRanking_(limit) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  return values.slice(1)
    .map(row => ({
      createdAt: row[0],
      name: row[1],
      score: Number(row[2] || 0),
      floor: Number(row[3] || 0),
      level: Number(row[4] || 0),
      gold: Number(row[5] || 0),
      defeated: Number(row[6] || 0),
      turn: Number(row[7] || 0),
      cleared: row[8] === true,
      version: row[9] || ''
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(limit || 10, 50)));
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'created_at',
      'name',
      'score',
      'floor',
      'level',
      'gold',
      'defeated',
      'turn',
      'cleared',
      'version'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function sanitize_(value) {
  return String(value || '')
    .replace(/[<>"'&]/g, '')
    .slice(0, 40);
}

function toNumber_(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
