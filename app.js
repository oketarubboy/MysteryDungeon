/* Simple Mystery Dungeon v0.1.0
   - オリジナルのシンプルなローグライクPWA
   - GAS URLを設定すると共有ランキングが使えます
*/
const APP_VERSION = "0.1.0";

// Google Apps ScriptのWebアプリURLを入れると共有ランキングになります。
// 未設定の場合は端末内ローカルランキングのみで動きます。
// 例: const GAS_URL = "https://script.google.com/macros/s/xxxxxxxx/exec";
const GAS_URL = ".https://script.google.com/macros/s/AKfycbzUJb7b8I7w5HG7h7OeR-43vawtbcBiudTLO2qzOhOrt4O9IYxIRnhObWn9-n3Io5dUoA/exec";

const SIZE = 13;
const MAX_FLOOR = 10;
const TILE = {
  WALL: 0,
  FLOOR: 1,
};

const DIRS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  "up-left": [-1, -1],
  "up-right": [1, -1],
  "down-left": [-1, 1],
  "down-right": [1, 1],
};

const els = {
  playerName: document.getElementById("playerName"),
  board: document.getElementById("board"),
  log: document.getElementById("log"),
  inventory: document.getElementById("inventory"),
  rankingList: document.getElementById("rankingList"),
  rankingNote: document.getElementById("rankingNote"),
  resultDialog: document.getElementById("resultDialog"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  btnSubmitScore: document.getElementById("btnSubmitScore"),
  btnCloseResult: document.getElementById("btnCloseResult"),
  btnNewGame: document.getElementById("btnNewGame"),
  btnRanking: document.getElementById("btnRanking"),
  btnUpdate: document.getElementById("btnUpdate"),
  btnWait: document.getElementById("btnWait"),
  btnUseHerb: document.getElementById("btnUseHerb"),
  btnGiveUp: document.getElementById("btnGiveUp"),
  stFloor: document.getElementById("stFloor"),
  stLevel: document.getElementById("stLevel"),
  stHp: document.getElementById("stHp"),
  stFood: document.getElementById("stFood"),
  stGold: document.getElementById("stGold"),
  stScore: document.getElementById("stScore"),
};

let state = null;
let lastResult = null;

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(arr) {
  return arr[rnd(0, arr.length - 1)];
}

function keyOf(x, y) {
  return `${x},${y}`;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function safeName(name) {
  const n = String(name || "").trim().replace(/[<>]/g, "");
  return n || "名無し";
}

function init() {
  els.playerName.value = localStorage.getItem("md_player_name") || "";
  bindEvents();
  loadRanking();
  renderEmpty();
  registerServiceWorker();
}

function bindEvents() {
  els.btnNewGame.addEventListener("click", startGame);
  els.btnRanking.addEventListener("click", loadRanking);
  els.btnUpdate.addEventListener("click", hardUpdate);
  els.btnWait.addEventListener("click", () => takeTurn(0, 0));
  els.btnUseHerb.addEventListener("click", useHerb);
  els.btnGiveUp.addEventListener("click", () => {
    if (state && !state.ended) finishGame("冒険を終了しました。", false);
  });
  els.btnSubmitScore.addEventListener("click", submitLastScore);
  els.btnCloseResult.addEventListener("click", () => els.resultDialog.close());

  document.querySelectorAll("[data-dir]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [dx, dy] = DIRS[btn.dataset.dir];
      takeTurn(dx, dy);
    });
  });

  window.addEventListener("keydown", (ev) => {
    if (!state || state.ended || els.resultDialog.open) return;

    const map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
      q: "up-left",
      e: "up-right",
      z: "down-left",
      c: "down-right",
      ".": "wait",
      " ": "wait",
    };

    const dir = map[ev.key] || map[ev.key.toLowerCase()];
    if (!dir) return;

    ev.preventDefault();
    if (dir === "wait") takeTurn(0, 0);
    else {
      const [dx, dy] = DIRS[dir];
      takeTurn(dx, dy);
    }
  });
}

function startGame() {
  const name = safeName(els.playerName.value);
  localStorage.setItem("md_player_name", name);

  state = {
    name,
    floor: 1,
    turn: 0,
    map: [],
    player: {
      x: 1,
      y: 1,
      hp: 30,
      maxHp: 30,
      atk: 6,
      def: 1,
      level: 1,
      exp: 0,
      food: 100,
      herbs: 1,
      scrolls: 0,
      gold: 0,
    },
    enemies: [],
    items: [],
    stairs: { x: SIZE - 2, y: SIZE - 2 },
    defeated: 0,
    ended: false,
    log: [],
  };

  makeFloor(true);
  addLog("冒険を開始しました。");
  addLog("敵を倒して強くなり、階段を探してください。");
  render();
}

function makeFloor(isFirst = false) {
  const oldHp = state.player.hp;
  const oldMax = state.player.maxHp;

  state.map = generateMap();
  state.enemies = [];
  state.items = [];

  const floors = listFloorTiles();
  const start = isFirst ? { x: 1, y: 1 } : choice(floors);
  state.player.x = start.x;
  state.player.y = start.y;

  state.stairs = farTileFrom(start, floors);

  const enemyCount = clamp(3 + Math.floor(state.floor / 2), 3, 8);
  for (let i = 0; i < enemyCount; i++) {
    const p = randomEmptyTile();
    const kind = makeEnemyKind(state.floor);
    state.enemies.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      x: p.x,
      y: p.y,
      name: kind.name,
      icon: kind.icon,
      hp: kind.hp,
      maxHp: kind.hp,
      atk: kind.atk,
      exp: kind.exp,
    });
  }

  const itemCount = 4;
  for (let i = 0; i < itemCount; i++) {
    const p = randomEmptyTile();
    const kind = choice([
      { type: "herb", icon: "薬", name: "薬草" },
      { type: "gold", icon: "金", name: "ゴールド", amount: rnd(15, 45) + state.floor * 4 },
      { type: "scroll", icon: "巻", name: "いかずちの巻物" },
    ]);
    state.items.push({ ...kind, x: p.x, y: p.y });
  }

  // フロア移動時の小回復
  if (!isFirst) {
    state.player.hp = clamp(oldHp + 6, 1, oldMax);
    state.player.food = clamp(state.player.food + 8, 0, 100);
  }
}

function generateMap() {
  const map = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => TILE.WALL));

  // 部屋を複数作り、中心同士を通路で接続する簡易生成
  const rooms = [];
  const attempts = 22;
  for (let i = 0; i < attempts; i++) {
    const w = rnd(3, 5);
    const h = rnd(3, 5);
    const x = rnd(1, SIZE - w - 1);
    const y = rnd(1, SIZE - h - 1);
    const room = { x, y, w, h, cx: Math.floor(x + w / 2), cy: Math.floor(y + h / 2) };

    const overlap = rooms.some(r =>
      x <= r.x + r.w && x + w >= r.x && y <= r.y + r.h && y + h >= r.y
    );
    if (overlap) continue;

    rooms.push(room);
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        map[yy][xx] = TILE.FLOOR;
      }
    }
  }

  if (rooms.length < 2) {
    for (let y = 1; y < SIZE - 1; y++) {
      for (let x = 1; x < SIZE - 1; x++) {
        map[y][x] = TILE.FLOOR;
      }
    }
    return map;
  }

  rooms.sort((a, b) => a.cx - b.cx);
  for (let i = 1; i < rooms.length; i++) {
    carveCorridor(map, rooms[i - 1].cx, rooms[i - 1].cy, rooms[i].cx, rooms[i].cy);
  }

  // 開始地点を必ず床にする
  map[1][1] = TILE.FLOOR;

  return map;
}

function carveCorridor(map, x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  while (x !== x2) {
    map[y][x] = TILE.FLOOR;
    x += x < x2 ? 1 : -1;
  }
  while (y !== y2) {
    map[y][x] = TILE.FLOOR;
    y += y < y2 ? 1 : -1;
  }
  map[y][x] = TILE.FLOOR;
}

function listFloorTiles() {
  const tiles = [];
  for (let y = 1; y < SIZE - 1; y++) {
    for (let x = 1; x < SIZE - 1; x++) {
      if (state.map[y][x] === TILE.FLOOR) tiles.push({ x, y });
    }
  }
  return tiles;
}

function farTileFrom(start, floors) {
  const sorted = [...floors].sort((a, b) => {
    const da = Math.abs(a.x - start.x) + Math.abs(a.y - start.y);
    const db = Math.abs(b.x - start.x) + Math.abs(b.y - start.y);
    return db - da;
  });
  return sorted.find(p => !isBlockedByEnemy(p.x, p.y) && !(p.x === start.x && p.y === start.y)) || sorted[0];
}

function randomEmptyTile() {
  const floors = listFloorTiles();
  for (let i = 0; i < 200; i++) {
    const p = choice(floors);
    if (p.x === state.player.x && p.y === state.player.y) continue;
    if (p.x === state.stairs.x && p.y === state.stairs.y) continue;
    if (isBlockedByEnemy(p.x, p.y)) continue;
    if (state.items.some(it => it.x === p.x && it.y === p.y)) continue;
    return p;
  }
  return choice(floors);
}

function makeEnemyKind(floor) {
  const table = [
    { name: "スライム", icon: "ぷ", hp: 9 + floor, atk: 3 + Math.floor(floor / 3), exp: 5 },
    { name: "コウモリ", icon: "こ", hp: 7 + floor, atk: 4 + Math.floor(floor / 2), exp: 7 },
    { name: "ゴブリン", icon: "ご", hp: 12 + floor * 2, atk: 5 + Math.floor(floor / 2), exp: 10 },
    { name: "まどうし", icon: "魔", hp: 10 + floor * 2, atk: 6 + Math.floor(floor / 2), exp: 12 },
  ];
  if (floor <= 2) return table[0];
  if (floor <= 4) return choice(table.slice(0, 2));
  if (floor <= 7) return choice(table.slice(1, 3));
  return choice(table.slice(2, 4));
}

function takeTurn(dx, dy) {
  if (!state || state.ended) return;

  let acted = false;

  if (dx === 0 && dy === 0) {
    addLog("その場で様子を見ました。");
    acted = true;
  } else {
    const nx = state.player.x + dx;
    const ny = state.player.y + dy;

    if (!isInside(nx, ny) || state.map[ny][nx] === TILE.WALL) {
      addLog("壁にぶつかりました。");
      acted = false;
    } else {
      const enemy = enemyAt(nx, ny);
      if (enemy) {
        playerAttack(enemy);
        acted = true;
      } else {
        state.player.x = nx;
        state.player.y = ny;
        acted = true;
        pickupItem();
        checkStairs();
      }
    }
  }

  if (!acted || state.ended) {
    render();
    return;
  }

  state.turn++;
  processHunger();
  if (state.ended) {
    render();
    return;
  }

  enemiesTurn();
  if (state.ended) {
    render();
    return;
  }

  if (state.turn % 8 === 0 && state.player.hp < state.player.maxHp && state.player.food > 0) {
    state.player.hp++;
  }

  render();
}

function playerAttack(enemy) {
  const damage = Math.max(1, state.player.atk + rnd(-2, 3));
  enemy.hp -= damage;
  addLog(`${enemy.name}に${damage}ダメージ。`);

  if (enemy.hp <= 0) {
    addLog(`${enemy.name}を倒しました。`);
    state.enemies = state.enemies.filter(e => e.id !== enemy.id);
    state.defeated++;
    state.player.exp += enemy.exp;
    state.player.gold += rnd(3, 12) + state.floor;
    checkLevelUp();
  }
}

function checkLevelUp() {
  const need = state.player.level * 18;
  if (state.player.exp >= need) {
    state.player.exp -= need;
    state.player.level++;
    state.player.maxHp += 5;
    state.player.hp = state.player.maxHp;
    state.player.atk += 2;
    state.player.def += 1;
    addLog(`レベル${state.player.level}に上がりました。HP全回復！`);
  }
}

function processHunger() {
  state.player.food = clamp(state.player.food - 1, 0, 100);
  if (state.player.food === 20) addLog("お腹が空いてきました。");
  if (state.player.food === 0) {
    state.player.hp -= 2;
    addLog("空腹で2ダメージ。");
    if (state.player.hp <= 0) finishGame("空腹で倒れました。", false);
  }
}

function enemiesTurn() {
  for (const enemy of [...state.enemies]) {
    if (state.ended) return;

    const dist = Math.max(Math.abs(enemy.x - state.player.x), Math.abs(enemy.y - state.player.y));
    if (dist <= 1) {
      const damage = Math.max(1, enemy.atk - state.player.def + rnd(-1, 2));
      state.player.hp -= damage;
      addLog(`${enemy.name}の攻撃。${damage}ダメージ。`);
      if (state.player.hp <= 0) {
        finishGame(`${enemy.name}に倒されました。`, false);
        return;
      }
    } else if (dist <= 6) {
      const dx = Math.sign(state.player.x - enemy.x);
      const dy = Math.sign(state.player.y - enemy.y);
      tryEnemyMove(enemy, dx, dy) || tryEnemyMove(enemy, dx, 0) || tryEnemyMove(enemy, 0, dy);
    } else if (Math.random() < 0.4) {
      const dirs = Object.values(DIRS);
      const [dx, dy] = choice(dirs);
      tryEnemyMove(enemy, dx, dy);
    }
  }
}

function tryEnemyMove(enemy, dx, dy) {
  const nx = enemy.x + dx;
  const ny = enemy.y + dy;
  if (!isInside(nx, ny)) return false;
  if (state.map[ny][nx] === TILE.WALL) return false;
  if (state.player.x === nx && state.player.y === ny) return false;
  if (state.enemies.some(e => e.id !== enemy.id && e.x === nx && e.y === ny)) return false;
  enemy.x = nx;
  enemy.y = ny;
  return true;
}

function pickupItem() {
  const idx = state.items.findIndex(it => it.x === state.player.x && it.y === state.player.y);
  if (idx < 0) return;

  const item = state.items[idx];
  state.items.splice(idx, 1);

  if (item.type === "herb") {
    state.player.herbs++;
    addLog("薬草を拾いました。");
  } else if (item.type === "gold") {
    state.player.gold += item.amount;
    addLog(`${item.amount}Gを拾いました。`);
  } else if (item.type === "scroll") {
    state.player.scrolls++;
    addLog("いかずちの巻物を拾いました。");
  }
}

function checkStairs() {
  if (state.player.x !== state.stairs.x || state.player.y !== state.stairs.y) return;

  if (state.floor >= MAX_FLOOR) {
    finishGame("最深部に到達しました。ダンジョンクリア！", true);
    return;
  }

  state.floor++;
  addLog(`${state.floor}階へ進みました。`);
  makeFloor(false);
}

function useHerb() {
  if (!state || state.ended) return;

  if (state.player.herbs <= 0) {
    addLog("薬草を持っていません。");
    render();
    return;
  }

  state.player.herbs--;
  const heal = 18;
  state.player.hp = clamp(state.player.hp + heal, 1, state.player.maxHp);
  addLog(`薬草を使い、HPが${heal}回復しました。`);
  enemiesTurn();
  render();
}

function useScrollAuto() {
  if (!state || state.player.scrolls <= 0) return false;
  const targets = state.enemies.filter(e => {
    const d = Math.max(Math.abs(e.x - state.player.x), Math.abs(e.y - state.player.y));
    return d <= 3;
  });
  if (targets.length === 0) return false;

  state.player.scrolls--;
  for (const enemy of targets) enemy.hp -= 18;
  addLog("いかずちの巻物が周囲の敵を攻撃しました。");

  const defeated = targets.filter(e => e.hp <= 0);
  for (const enemy of defeated) {
    addLog(`${enemy.name}を倒しました。`);
    state.player.exp += enemy.exp;
    state.player.gold += rnd(3, 12) + state.floor;
    state.defeated++;
  }
  state.enemies = state.enemies.filter(e => e.hp > 0);
  checkLevelUp();
  return true;
}

function finishGame(message, cleared) {
  if (!state || state.ended) return;

  state.ended = true;
  const score = calcScore(cleared);
  lastResult = {
    name: state.name,
    score,
    floor: state.floor,
    level: state.player.level,
    gold: state.player.gold,
    defeated: state.defeated,
    turn: state.turn,
    cleared,
    version: APP_VERSION,
    createdAt: new Date().toISOString(),
  };

  saveLocalRanking(lastResult);
  render();

  els.resultTitle.textContent = cleared ? "ダンジョンクリア！" : "冒険終了";
  els.resultText.innerHTML =
    `${escapeHtml(message)}<br>` +
    `スコア：<b>${score}</b><br>` +
    `到達階：${state.floor}階 / Lv：${state.player.level} / 討伐：${state.defeated}体 / G：${state.player.gold}`;
  els.btnSubmitScore.disabled = false;
  els.resultDialog.showModal();
  loadRanking();
}

function calcScore(cleared = false) {
  if (!state) return 0;
  return (
    state.floor * 120 +
    state.player.level * 80 +
    state.player.gold +
    state.defeated * 25 +
    Math.max(0, state.player.hp) * 3 +
    (cleared ? 1000 : 0)
  );
}

function renderEmpty() {
  els.board.innerHTML = "";
  for (let i = 0; i < SIZE * SIZE; i++) {
    const div = document.createElement("div");
    div.className = "cell wall";
    div.textContent = "";
    els.board.appendChild(div);
  }
  updateStatus();
}

function render() {
  if (!state) {
    renderEmpty();
    return;
  }

  const itemMap = new Map(state.items.map(it => [keyOf(it.x, it.y), it]));
  const enemyMap = new Map(state.enemies.map(e => [keyOf(e.x, e.y), e]));

  els.board.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const div = document.createElement("div");
      div.className = "cell " + (state.map[y][x] === TILE.WALL ? "wall" : "floor");

      const k = keyOf(x, y);
      if (state.player.x === x && state.player.y === y) {
        div.className = "cell player";
        div.textContent = "主";
      } else if (enemyMap.has(k)) {
        const e = enemyMap.get(k);
        div.className = "cell enemy";
        div.textContent = e.icon;
        div.title = `${e.name} HP:${e.hp}/${e.maxHp}`;
      } else if (state.stairs.x === x && state.stairs.y === y) {
        div.className = "cell stairs";
        div.textContent = "▽";
      } else if (itemMap.has(k)) {
        const it = itemMap.get(k);
        div.className = "cell item";
        div.textContent = it.icon;
        div.title = it.name;
      } else if (state.map[y][x] === TILE.FLOOR) {
        div.textContent = "·";
      }
      els.board.appendChild(div);
    }
  }

  updateStatus();
  updateInventory();
  updateLog();
}

function updateStatus() {
  els.stFloor.textContent = state ? `${state.floor}/${MAX_FLOOR}` : "-";
  els.stLevel.textContent = state ? state.player.level : "-";
  els.stHp.textContent = state ? `${state.player.hp}/${state.player.maxHp}` : "-";
  els.stFood.textContent = state ? state.player.food : "-";
  els.stGold.textContent = state ? state.player.gold : "-";
  els.stScore.textContent = state ? calcScore(false) : "-";
}

function updateInventory() {
  if (!state) {
    els.inventory.textContent = "-";
    return;
  }
  els.inventory.innerHTML = `
    薬草：<b>${state.player.herbs}</b><br>
    いかずちの巻物：<b>${state.player.scrolls}</b><br>
    経験値：<b>${state.player.exp}</b> / 次Lv <b>${state.player.level * 18}</b><br>
    攻撃：<b>${state.player.atk}</b>　防御：<b>${state.player.def}</b>
  `;
}

function updateLog() {
  els.log.innerHTML = "";
  const recent = state ? state.log.slice(-80) : [];
  for (const line of recent.slice().reverse()) {
    const div = document.createElement("div");
    div.textContent = line;
    els.log.appendChild(div);
  }
}

function addLog(msg) {
  if (!state) return;
  state.log.push(msg);
}

function isInside(x, y) {
  return x >= 0 && y >= 0 && x < SIZE && y < SIZE;
}

function enemyAt(x, y) {
  return state.enemies.find(e => e.x === x && e.y === y);
}

function isBlockedByEnemy(x, y) {
  return state.enemies.some(e => e.x === x && e.y === y);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[m]);
}

/* ---------- ranking ---------- */

function localRankingKey() {
  return "md_local_ranking_v1";
}

function saveLocalRanking(record) {
  const list = JSON.parse(localStorage.getItem(localRankingKey()) || "[]");
  list.push(record);
  list.sort((a, b) => Number(b.score) - Number(a.score));
  localStorage.setItem(localRankingKey(), JSON.stringify(list.slice(0, 20)));
}

function getLocalRanking() {
  const list = JSON.parse(localStorage.getItem(localRankingKey()) || "[]");
  return list.sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10);
}

async function submitLastScore() {
  if (!lastResult) return;
  els.btnSubmitScore.disabled = true;

  if (!GAS_URL) {
    els.rankingNote.textContent = "GAS_URL未設定のため、ローカルランキングに保存しました。";
    loadRanking();
    return;
  }

  try {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(lastResult)) {
      params.append(k, String(v));
    }

    // GASは環境によってCORS制限が出るため、登録はno-corsで送信します。
    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
    });

    els.rankingNote.textContent = "共有ランキングへ送信しました。反映に数秒かかる場合があります。";
    setTimeout(loadRanking, 1500);
  } catch (e) {
    console.error(e);
    els.rankingNote.textContent = "共有ランキング送信に失敗しました。ローカルランキングには保存済みです。";
    loadRanking();
  }
}

async function loadRanking() {
  let list = getLocalRanking();
  let note = GAS_URL ? "共有ランキングを取得中..." : "GAS_URL未設定：ローカルランキングを表示中です。";

  renderRanking(list, note);

  if (!GAS_URL) return;

  try {
    const remote = await jsonp(`${GAS_URL}?action=ranking&limit=10`);
    if (remote && Array.isArray(remote.ranking)) {
      list = remote.ranking;
      note = "共有ランキングを表示中です。";
    } else {
      note = "共有ランキングの形式が正しくありません。";
    }
  } catch (e) {
    console.error(e);
    note = "共有ランキングを取得できませんでした。ローカルランキングを表示中です。";
  }

  renderRanking(list, note);
}

function renderRanking(list, note) {
  els.rankingList.innerHTML = "";
  if (!list.length) {
    const li = document.createElement("li");
    li.textContent = "まだ記録がありません";
    els.rankingList.appendChild(li);
  } else {
    for (const r of list.slice(0, 10)) {
      const li = document.createElement("li");
      const cleared = String(r.cleared) === "true" || r.cleared === true ? "★" : "";
      li.textContent = `${cleared}${r.name || "名無し"}：${r.score || 0}点（${r.floor || "-"}F / Lv${r.level || "-"}）`;
      els.rankingList.appendChild(li);
    }
  }
  els.rankingNote.textContent = note;
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "mdJsonp_" + Date.now() + "_" + Math.floor(Math.random() * 99999);
    const sep = url.includes("?") ? "&" : "?";
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, 10000);

    function cleanup() {
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("JSONP failed"));
    };

    script.src = `${url}${sep}callback=${encodeURIComponent(callbackName)}&_=${Date.now()}`;
    document.body.appendChild(script);
  });
}

/* ---------- PWA update ---------- */

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register("./sw.js?v=" + APP_VERSION);
    reg.update();
  } catch (e) {
    console.warn("Service Worker registration failed", e);
  }
}

async function hardUpdate() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) {
    console.warn(e);
  }

  const url = new URL(location.href);
  url.searchParams.set("reload", Date.now());
  location.replace(url.toString());
}

init();
