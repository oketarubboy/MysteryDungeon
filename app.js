const APP_VERSION="0.4.0";
const GAS_URL="https://script.google.com/macros/s/AKfycbzUJb7b8I7w5HG7h7OeR-43vawtbcBiudTLO2qzOhOrt4O9IYxIRnhObWn9-n3Io5dUoA/exec";
const SIZE=15,WALL=0,FLOOR=1;
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0],"up-left":[-1,-1],"up-right":[1,-1],"down-left":[-1,1],"down-right":[1,1]};
const DUN={beginner:{id:"beginner",name:"初心者の洞窟",max:10,dif:1,startG:80},herb:{id:"herb",name:"薬草の迷宮",max:15,dif:1.25,startG:60},deep:{id:"deep",name:"もっと不思議な迷宮",max:30,dif:1.6,startG:30,resetLevel:true}};
const EFF={slimeBane:"スライム特効",tri:"前方3方向",reach2:"2マス攻撃",sleep:"眠り",poisonGuard:"毒無効",flameGuard:"炎軽減",antiSteal:"盗み防止"};
const ITEMS={
 h1:{cat:"herb",ic:"草",n:"薬草",u:"未識別の草",p:40,d:"HPを25回復"},h2:{cat:"herb",ic:"草",n:"大きな薬草",u:"未識別の草",p:90,d:"HPを60回復"},hp:{cat:"herb",ic:"草",n:"ちからの草",u:"未識別の草",p:120,d:"攻撃+1"},po:{cat:"herb",ic:"草",n:"どくけし草",u:"未識別の草",p:55,d:"毒を治す"},bread:{cat:"food",ic:"食",n:"パン",u:"パン",p:50,d:"満腹度+50"},
 sw1:{cat:"weapon",ic:"剣",n:"木の剣",u:"木の剣",pow:2,p:120,d:"攻撃+2"},sw2:{cat:"weapon",ic:"剣",n:"鉄の剣",u:"鉄の剣",pow:4,p:260,d:"攻撃+4"},sws:{cat:"weapon",ic:"剣",n:"ねむりの剣",u:"ねむりの剣",pow:3,p:420,d:"たまに眠り",ef:["sleep"]},swsl:{cat:"weapon",ic:"剣",n:"スライムキラー",u:"スライムキラー",pow:3,p:460,d:"スライム族に1.5倍",ef:["slimeBane"]},swtri:{cat:"weapon",ic:"剣",n:"三方向の剣",u:"三方向の剣",pow:2,p:520,d:"前方3方向を攻撃",ef:["tri"]},swr:{cat:"weapon",ic:"槍",n:"長槍",u:"長槍",pow:3,p:480,d:"2マス先まで攻撃",ef:["reach2"]},
 sh1:{cat:"shield",ic:"盾",n:"木の盾",u:"木の盾",pow:2,p:120,d:"防御+2"},sh2:{cat:"shield",ic:"盾",n:"鉄の盾",u:"鉄の盾",pow:4,p:260,d:"防御+4"},shp:{cat:"shield",ic:"盾",n:"毒よけの盾",u:"毒よけの盾",pow:3,p:400,d:"毒を防ぐ",ef:["poisonGuard"]},shf:{cat:"shield",ic:"盾",n:"火除けの盾",u:"火除けの盾",pow:3,p:420,d:"炎ダメージを軽減",ef:["flameGuard"]},sht:{cat:"shield",ic:"盾",n:"盗みよけの盾",u:"盗みよけの盾",pow:2,p:380,d:"盗みを防ぐ",ef:["antiSteal"]},
 rp:{cat:"ring",ic:"指",n:"ちからの指輪",u:"未識別の指輪",p:350,d:"攻撃+2"},rf:{cat:"ring",ic:"指",n:"腹もちの指輪",u:"未識別の指輪",p:330,d:"満腹度の減り半減"},rg:{cat:"ring",ic:"指",n:"毒よけの指輪",u:"未識別の指輪",p:300,d:"毒を防ぐ",ef:["poisonGuard"]},
 ar1:{cat:"arrow",ic:"矢",n:"木の矢",u:"木の矢",p:8,d:"正面に8ダメージ",qty:[8,14],dmg:8},ar2:{cat:"arrow",ic:"矢",n:"鉄の矢",u:"鉄の矢",p:15,d:"正面に14ダメージ",qty:[5,10],dmg:14},
 si:{cat:"scroll",ic:"巻",n:"識別の巻物",u:"未識別の巻物",p:120,d:"持ち物をすべて識別"},st:{cat:"scroll",ic:"巻",n:"いかずちの巻物",u:"未識別の巻物",p:180,d:"周囲の敵に25ダメージ"},ww:{cat:"scroll",ic:"巻",n:"ワープの巻物",u:"未識別の巻物",p:100,d:"ワープ"},sr:{cat:"scroll",ic:"巻",n:"帰還の巻物",u:"未識別の巻物",p:280,d:"持ち物を持って帰還"},sa:{cat:"scroll",ic:"巻",n:"攻撃強化の巻物",u:"未識別の巻物",p:260,d:"装備中の武器の+を1〜3強化"},sd:{cat:"scroll",ic:"巻",n:"防御強化の巻物",u:"未識別の巻物",p:260,d:"装備中の盾の+を1〜3強化"},
 wf:{cat:"wand",ic:"杖",n:"火ばしらの杖",u:"未識別の杖",p:260,d:"近い敵に20ダメージ",ch:[3,6]},ws:{cat:"wand",ic:"杖",n:"鈍足の杖",u:"未識別の杖",p:220,d:"近い敵を鈍足",ch:[3,6]},wb:{cat:"wand",ic:"杖",n:"ふきとばしの杖",u:"未識別の杖",p:180,d:"近い敵を吹き飛ばす",ch:[3,6]},wx:{cat:"wand",ic:"杖",n:"場所替えの杖",u:"未識別の杖",p:240,d:"敵と場所替え",ch:[2,5]},
 ph:{cat:"pot",ic:"壺",n:"回復の壺",u:"未識別の壺",p:260,d:"HPを40回復",ch:[2,4]},pi:{cat:"pot",ic:"壺",n:"識別の壺",u:"未識別の壺",p:340,d:"持ち物をすべて識別",ch:[1,3]},ps:{cat:"pot",ic:"壺",n:"保存の壺",u:"未識別の壺",p:380,d:"今回は所持上限20個固定",ch:[1,1]},pc:{cat:"pot",ic:"壺",n:"合成の壺",u:"未識別の壺",p:520,d:"同種装備の+値と特殊効果を合成",ch:[1,2]}
};
const DROP={beginner:["h1","bread","ar1","sw1","sh1","si","st","wf","ph","rp"],herb:["h1","h2","hp","po","bread","ar1","ar2","sw2","sh2","si","st","ww","sa","sd","wf","ws","wb","ph","pi","ps","pc","rf","rg"],deep:Object.keys(ITEMS)};
const EN=[{id:"sl",tribe:"slime",n:"分裂スライム",ic:"ぷ",hp:10,a:3,ex:6,ab:"split"},{id:"bt",tribe:"beast",n:"はやてコウモリ",ic:"こ",hp:9,a:4,ex:8,ab:"fast"},{id:"mg",tribe:"mage",n:"火吹きまどうし",ic:"魔",hp:12,a:5,ex:13,ab:"range"},{id:"th",tribe:"human",n:"ぬすっと小僧",ic:"盗",hp:11,a:4,ex:12,ab:"steal"},{id:"gh",tribe:"ghost",n:"かべぬけゴースト",ic:"霊",hp:16,a:6,ex:16,ab:"ghost"},{id:"po",tribe:"insect",n:"どくサソリ",ic:"毒",hp:15,a:7,ex:18,ab:"poison"}];
const CAT_ORDER={weapon:1,shield:2,ring:3,arrow:4,herb:5,food:6,wand:7,scroll:8,pot:9};
const $=id=>document.getElementById(id),E={name:$("playerName"),ds:$("dungeonSelect"),b:$("board"),log:$("log"),inv:$("inventory"),wh:$("warehouse"),shop:$("shop"),bag:$("bagInfo"),rank:$("ranking"),rn:$("rankingNote"),res:$("result"),rt:$("resultTitle"),rx:$("resultText"),sub:$("btnSubmit"),sf:$("stFloor"),sl:$("stLevel"),hp:$("stHp"),fo:$("stFood"),go:$("stGold"),sa:$("stAtk"),sd:$("stDef"),ew:$("eqWeapon"),es:$("eqShield"),err:$("eqRingR"),erl:$("eqRingL"),ear:$("eqArrow")};
let S=null,last=null,sel="",selWh="",held=new Set(),faceMode=false;
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,C=a=>a[R(0,a.length-1)],uid=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function init(){E.name.value=localStorage.md_player_name||"";E.ds.value=localStorage.md_dungeon_id||"beginner";bind();empty();renderWh();loadRank();sw()}
function bind(){
 $("btnNewGame").onclick=start;$("btnRanking").onclick=loadRank;$("btnUpdate").onclick=hardUpdate;$("btnWait").onclick=()=>turn(0,0);$("btnAttack").onclick=attackButton;$("btnShoot").onclick=shootSelected;$("btnLook").onclick=lookFloor;$("btnPickup").onclick=pickFloor;$("btnFaceMode").onclick=toggleFaceMode;$("btnUse").onclick=use;$("btnEquip").onclick=()=>equip();$("btnDrop").onclick=dropSelected;$("btnSwapFloor").onclick=swapFloor;$("btnSortInv").onclick=sortInvButton;$("btnReturn").onclick=ret;$("btnGiveUp").onclick=giveup;$("btnTakeWh").onclick=takeWh;$("btnSortWh").onclick=sortWh;E.sub.onclick=submit;$("btnClose").onclick=()=>E.res.close();E.inv.onclick=inventoryClick;E.ds.onchange=()=>{localStorage.md_dungeon_id=E.ds.value;loadRank()};
 document.querySelectorAll("[data-dir]").forEach(x=>x.onclick=()=>{let [dx,dy]=DIRS[x.dataset.dir];if(faceMode){setFace(dx,dy);faceMode=false;updateFaceButton();return}S&&(S.face={dx,dy});turn(dx,dy)});
 window.addEventListener("keydown",ev=>handleKey(ev));window.addEventListener("keyup",ev=>{held.delete(normKey(ev.key))});
}
function normKey(k){k=String(k).toLowerCase();return {arrowup:"up",arrowdown:"down",arrowleft:"left",arrowright:"right",w:"up",s:"down",a:"left",d:"right",q:"q",e:"e",z:"z",c:"c",shift:"shift"}[k]||k}
function handleKey(ev){if(!S||S.end||E.res.open)return;let k=normKey(ev.key);let direct={q:"up-left",e:"up-right",z:"down-left",c:"down-right"};if(k==="shift"){held.add(k);return}if(["up","down","left","right"].includes(k))held.add(k);if(k===" "||k==="."){ev.preventDefault();turn(0,0);return}if(direct[k]){ev.preventDefault();let [dx,dy]=DIRS[direct[k]];if(ev.ctrlKey||faceMode){setFace(dx,dy);faceMode=false;updateFaceButton();return}S.face={dx,dy};turn(dx,dy);return}if(!["up","down","left","right"].includes(k))return;ev.preventDefault();let v=held.has("up")?"up":held.has("down")?"down":null;let h=held.has("left")?"left":held.has("right")?"right":null;if(ev.ctrlKey||faceMode){if(v&&h){let [dx,dy]=DIRS[v+"-"+h];setFace(dx,dy)}else{let [dx,dy]=DIRS[k];setFace(dx,dy)}faceMode=false;updateFaceButton();return}if(ev.shiftKey||held.has("shift")){if(v&&h){let [dx,dy]=DIRS[v+"-"+h];S.face={dx,dy};held.clear();turn(dx,dy)}else logRender("Shift中は縦＋横キー同時押しで斜め移動します。");return}let [dx,dy]=DIRS[k];S.face={dx,dy};turn(dx,dy)}
function setFace(dx,dy){if(!S||S.end)return;S.face={dx,dy};log("向きを変えました。ターンは経過しません。");render()}
function toggleFaceMode(){faceMode=!faceMode;updateFaceButton();logRender(faceMode?"次の方向入力で向きだけ変更します。":"向き変更モードを解除しました。")}
function updateFaceButton(){let b=$("btnFaceMode");if(!b)return;b.classList.toggle("faceModeOn",faceMode);b.textContent=faceMode?"向き変更中":"向き変更"}
function faceClass(){let f=S?.face||{dx:0,dy:1};return({"0,-1":"face-up","1,-1":"face-up-right","1,0":"face-right","1,1":"face-down-right","0,1":"face-down","-1,1":"face-down-left","-1,0":"face-left","-1,-1":"face-up-left"}[`${f.dx},${f.dy}`]||"face-down")}
function defaultKnown(k,duId){duId=duId||S?.du?.id||E.ds?.value||"beginner";let cat=ITEMS[k]?.cat;if(duId==="beginner")return true;if(duId==="herb")return cat!=="scroll";return false}
function initialKnown(du){let o={bread:true,sw1:true,sw2:true,sws:true,swsl:true,swtri:true,swr:true,sh1:true,sh2:true,shp:true,shf:true,sht:true,ar1:true,ar2:true};if(du.id==="beginner")Object.keys(ITEMS).forEach(k=>o[k]=true);else if(du.id==="herb")Object.keys(ITEMS).forEach(k=>{if(ITEMS[k].cat!=="scroll")o[k]=true});return o}
function randPlus(cat){if(!["weapon","shield","ring"].includes(cat))return 0;let r=Math.random();return r<.50?0:r<.75?1:r<.90?2:3}
function item(k,known=false,fromDrop=true){const d=ITEMS[k];known=known||defaultKnown(k);let it={id:uid(),k,cat:d.cat,ic:d.ic,n:d.n,u:d.u,p:d.p,d:d.d,pow:d.pow||0,known,plus:fromDrop?randPlus(d.cat):0,ef:[...(d.ef||[])]};if(d.ch)it.ch=R(d.ch[0],d.ch[1]);if(d.qty)it.qty=R(d.qty[0],d.qty[1]);if(d.dmg)it.dmg=d.dmg;return it}
function isEq(it){return S&&it&&Object.values(S.p.eq).includes(it.id)}
function eqSlotOf(it){if(!S||!it)return"";for(const [k,v] of Object.entries(S.p.eq))if(v===it.id)return k;return""}
function plusText(it){return it&&["weapon","shield","ring"].includes(it.cat)&&it.plus>0?`+${it.plus}`:""}
function effectText(it){return it?.ef?.length?` / 効果:${it.ef.map(e=>EFF[e]||e).join("・")}`:""}
function dn(it,mark=true){if(!it)return"なし";let name=(it.known||S?.known[it.k]?it.n:it.u)+plusText(it);if(it.qty!=null)name+=`×${it.qty}`;if(it.ch!=null&&(it.known||S?.known[it.k]))name+=`［${it.ch}］`;if(mark&&isEq(it))name+=":E";return name}
function dd(it){let s=(it.known||S?.known[it.k])?it.d:"正体不明。使う・装備・識別で判明";if(["weapon","shield","ring"].includes(it.cat))s+=` / +値:${it.plus||0}${effectText(it)}`;return s}

function normalizeOneItem(it){
 if(!it||typeof it!=="object")it={};
 if(!it.id)it.id=uid();
 if(!it.k){
   const found=Object.keys(ITEMS).find(k=>ITEMS[k].n===it.n||ITEMS[k].n===it.name||ITEMS[k].u===it.u||ITEMS[k].u===it.unknown);
   it.k=found||"h1";
 }
 const d=ITEMS[it.k]||ITEMS.h1;
 if(!it.cat)it.cat=d.cat||"herb";
 if(!it.ic)it.ic=d.ic||"?";
 if(!it.n)it.n=it.name||d.n||"不明アイテム";
 if(!it.u)it.u=d.u||it.n;
 if(!it.d)it.d=it.desc||d.d||"";
 if(it.p==null)it.p=d.p||0;
 if(it.pow==null)it.pow=d.pow||0;
 if(!Array.isArray(it.ef))it.ef=d.ef?[...d.ef]:[];
 if(d.dmg&&it.dmg==null)it.dmg=d.dmg;
 if(d.qty&&it.qty==null)it.qty=it.qty||1;
 if(it.known==null)it.known=!!defaultKnown(it.k);
 return it;
}
function normalizeInventory(){
 if(!S||!S.p)return;
 if(!Array.isArray(S.p.inv))S.p.inv=[];
 S.p.inv=S.p.inv.filter(Boolean).map(normalizeOneItem);
 if(!S.p.eq)S.p.eq={weapon:null,shield:null,ringR:null,ringL:null,arrow:null};
 for(const k of ["weapon","shield","ringR","ringL","arrow"]){
   if(S.p.eq[k]&&!S.p.inv.some(it=>it.id===S.p.eq[k]))S.p.eq[k]=null;
 }
}
function safeDn(it,mark=true){try{return dn(normalizeOneItem(it),mark)}catch(e){return String(it?.n||it?.name||it?.k||"不明アイテム")}}
function safeDd(it){try{return dd(normalizeOneItem(it))}catch(e){return String(it?.d||it?.desc||"")}}

function know(k){S.known[k]=true;S.p.inv.forEach(x=>{if(x.k===k)x.known=true})}
function bagMax(){return 20}
function progressKey(){return"md_player_progress_v031"}
function loadProgress(du){if(du.resetLevel)return{lv:1,ex:0,mhp:36,atk:6,def:1};let p=JSON.parse(localStorage.getItem(progressKey())||"{}");return{lv:p.lv||1,ex:p.ex||0,mhp:p.mhp||36,atk:p.atk||6,def:p.def||1}}
function saveProgress(){if(!S||S.du.resetLevel)return;let cur=loadProgress({});let p={lv:Math.max(cur.lv||1,S.p.lv||1),ex:S.p.ex||0,mhp:Math.max(cur.mhp||36,S.p.mhp||36),atk:Math.max(cur.atk||6,S.p.atk||6),def:Math.max(cur.def||1,S.p.def||1)};localStorage.setItem(progressKey(),JSON.stringify(p))}
function start(){let name=(E.name.value||"名無し").replace(/[<>]/g,"").trim()||"名無し",du=DUN[E.ds.value]||DUN.beginner;localStorage.md_player_name=name;localStorage.md_dungeon_id=du.id;let carry=JSON.parse(localStorage.md_pending_items_v030||"[]").slice(0,8);localStorage.removeItem("md_pending_items_v030");let prog=loadProgress(du);S={name,du,f:1,t:0,map:[],items:[],en:[],shop:null,st:{x:13,y:13},def:0,end:false,log:[],known:initialKnown(du),canReturn:false,fx:null,face:{dx:0,dy:1},p:{x:1,y:1,hp:prog.mhp,mhp:prog.mhp,lv:prog.lv,ex:prog.ex||0,atk:prog.atk,def:prog.def,food:100,g:du.startG,poison:false,eq:{weapon:null,shield:null,ringR:null,ringL:null,arrow:null},inv:[item("h1",true,false),item("bread",true,false),...carry]}};sel="";floor(true);sortInv();log(`${du.name}に挑戦します。${du.resetLevel?"このダンジョンはレベル1から開始します。":"レベルは前回までの成長を引き継ぎます。"}`);log("装備中アイテムは緑色で :E が付き、整頓時は一番上に並びます。");faceMode=false;updateFaceButton();render();renderWh();loadRank()}
function floor(first=false){S.map=genMap();S.en=[];S.items=[];S.shop=null;let fs=floors();let p=first?{x:1,y:1}:C(fs);S.p.x=p.x;S.p.y=p.y;S.st=far(p,fs);for(let i=0;i<cl(3+Math.floor(S.f/2),3,11);i++)spawn();for(let i=0;i<cl(4+Math.floor(S.f/4),4,8);i++){let q=emptyTile();S.items.push({...randItem(),x:q.x,y:q.y})}if(S.f>=2&&(S.f%3===0||Math.random()<.18))mkShop();if(!first){S.p.hp=cl(S.p.hp+8,1,S.p.mhp);S.p.food=cl(S.p.food+5,0,100)}}
function genMap(){let m=Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>FLOOR));for(let y=0;y<SIZE;y++){m[y][0]=m[y][SIZE-1]=WALL}for(let x=0;x<SIZE;x++){m[0][x]=m[SIZE-1][x]=WALL}for(let i=0;i<36;i++){let x=R(1,13),y=R(1,13);if(!(x<=2&&y<=2)&&Math.random()<.36)m[y][x]=WALL}m[1][1]=FLOOR;return m}
function floors(){let a=[];for(let y=1;y<14;y++)for(let x=1;x<14;x++)if(S.map[y][x]===FLOOR)a.push({x,y});return a}
function far(p,a){return[...a].sort((u,v)=>Math.abs(v.x-p.x)+Math.abs(v.y-p.y)-Math.abs(u.x-p.x)-Math.abs(u.y-p.y))[0]||{x:13,y:13}}
function emptyTile(){let a=floors();for(let i=0;i<300;i++){let p=C(a);if(p.x===S.p.x&&p.y===S.p.y)continue;if(p.x===S.st.x&&p.y===S.st.y)continue;if(S.en.some(e=>e.x===p.x&&e.y===p.y))continue;if(S.items.some(e=>e.x===p.x&&e.y===p.y))continue;if(S.shop&&S.shop.x===p.x&&S.shop.y===p.y)continue;return p}return C(a)}
function randItem(){let table=DROP[S.du.id]||DROP.beginner,k=C(table);if(S.f>=8&&Math.random()<.28)k=C(["sw2","sh2","swsl","swtri","swr","shp","shf","sht","rf","rg","ps","pc","ws","sr","sa","sd","ar2"]);return item(k,false,true)}
function spawn(){let p=emptyTile(),base=S.f<=2?EN[0]:S.f<=4?C(EN.slice(0,2)):S.f<=7?C(EN.slice(0,4)):S.f<=12?C(EN.slice(1,5)):C(EN),d=S.du.dif;S.en.push({id:uid(),x:p.x,y:p.y,defId:base.id,tribe:base.tribe,n:base.n,ic:base.ic,ab:base.ab,hp:Math.floor((base.hp+S.f*2)*d),mhp:Math.floor((base.hp+S.f*2)*d),atk:Math.floor((base.a+Math.floor(S.f/2))*d),ex:Math.floor((base.ex+S.f)*d),slow:0,sleep:0,stole:false})}
function mkShop(){let p=emptyTile(),goods=[];for(let i=0;i<R(3,5);i++){let it=randItem();it.p=Math.floor(it.p*1.2);goods.push(it)}S.shop={x:p.x,y:p.y,goods}}
function findItem(id){return S.p.inv.find(x=>x.id===id)}
function equipItem(slot){return findItem(S.p.eq[slot])}
function hasEff(e){return [equipItem("weapon"),equipItem("shield"),equipItem("ringR"),equipItem("ringL")].some(it=>it?.ef?.includes(e))}
function atk(){let v=S.p.atk;let w=equipItem("weapon");if(w)v+=w.pow+(w.plus||0);for(const r of [equipItem("ringR"),equipItem("ringL")])if(r?.k==="rp")v+=2+(r.plus||0);return S.p.poison?Math.max(1,v-2):v}
function def(){let v=S.p.def;let s=equipItem("shield");if(s)v+=s.pow+(s.plus||0);return v}
function turn(dx,dy){if(!S||S.end)return;normalizeItems();let acted=false;if(dx===0&&dy===0){log("その場で様子を見ました。");acted=true}else{S.face={dx,dy};let nx=Number(S.p.x)+dx,ny=Number(S.p.y)+dy;if(!inside(nx,ny)||S.map[ny][nx]===WALL)log("壁にぶつかりました。");else{let e=S.en.find(e=>Number(e.x)===nx&&Number(e.y)===ny);if(e){meleeAttack(dx,dy);acted=true}else{S.p.x=nx;S.p.y=ny;acted=true;pickupAt(nx,ny,false);pickupAt(S.p.x,S.p.y,true);refreshPanels();stairs()}}}if(!acted||S.end){render();return}after()}
function attackButton(){if(!S||S.end)return;let {dx,dy}=S.face;if(dx===0&&dy===0){dx=0;dy=1}let hit=meleeAttack(dx,dy);if(!hit){let near=S.en.find(e=>Math.max(Math.abs(e.x-S.p.x),Math.abs(e.y-S.p.y))<=1);if(near){S.face={dx:Math.sign(near.x-S.p.x),dy:Math.sign(near.y-S.p.y)};hit=meleeAttack(S.face.dx,S.face.dy)}}if(hit)after();else{log("攻撃しましたが敵に当たりませんでした。");effect(S.p.x+dx,S.p.y+dy);after()}}
function meleeTargets(dx,dy){let w=equipItem("weapon"),range=w?.ef?.includes("reach2")?2:1;let dirs=[[dx,dy]];if(w?.ef?.includes("tri")){if(dx===0)dirs=[[dx,dy],[-1,dy],[1,dy]];else if(dy===0)dirs=[[dx,dy],[dx,-1],[dx,1]];else dirs=[[dx,dy],[dx,0],[0,dy]]}let out=[];for(const [ax,ay] of dirs){for(let r=1;r<=range;r++){let x=S.p.x+ax*r,y=S.p.y+ay*r;if(!inside(x,y)||S.map[y][x]===WALL)break;let e=S.en.find(en=>en.x===x&&en.y===y);if(e){out.push(e);break}}}return [...new Map(out.map(e=>[e.id,e])).values()]}
function meleeAttack(dx,dy){let targets=meleeTargets(dx,dy);if(!targets.length)return false;targets.forEach(e=>attackOne(e));return true}
function damageTo(e){let dm=Math.max(1,atk()+R(-2,3));let w=equipItem("weapon");if(w?.ef?.includes("slimeBane")&&e.tribe==="slime")dm=Math.floor(dm*1.5);return dm}
function attackOne(e){let dm=damageTo(e);e.hp-=dm;effect(e.x,e.y);log(`${e.n}に${dm}ダメージ。`);if(hasEff("sleep")&&Math.random()<.18&&e.hp>0){e.sleep=3;log(`${e.n}は眠った。`)}if(e.ab==="split"&&e.hp>0&&Math.random()<.12){let p=adj(e.x,e.y);if(p){S.en.push({...e,id:uid(),x:p.x,y:p.y,hp:Math.max(4,Math.floor(e.hp/2))});log(`${e.n}が分裂しました。`)}}if(e.hp<=0)kill(e)}
function kill(e){S.en=S.en.filter(x=>x.id!==e.id);S.def++;S.p.ex+=e.ex;S.p.g+=R(4,14)+S.f;log(`${e.n}を倒しました。`);if(Math.random()<.22){let p=dropTile(e.x,e.y);S.items.push({...randItem(),x:p.x,y:p.y});log("アイテムを落としました。")}while(S.p.ex>=S.p.lv*20){S.p.ex-=S.p.lv*20;S.p.lv++;S.p.mhp+=6;S.p.hp=S.p.mhp;S.p.atk+=2;S.p.def++;log(`レベル${S.p.lv}に上がりました。`)}}
function shootSelected(idv=sel){if(!S||S.end)return;let it=equipItem("arrow")||findItem(idv)||S.p.inv.find(x=>x.cat==="arrow");if(!it||it.cat!=="arrow"){log("撃つ矢を装備または所持していません。");render();return}let {dx,dy}=S.face;if(dx===0&&dy===0){dx=0;dy=1}let hit=null,lastFloor={x:S.p.x,y:S.p.y};for(let r=1;r<=10;r++){let x=S.p.x+dx*r,y=S.p.y+dy*r;if(!inside(x,y)||S.map[y][x]===WALL)break;lastFloor={x,y};hit=S.en.find(e=>e.x===x&&e.y===y);if(hit)break}it.qty--;if(it.qty<=0)removeIt(it.id);if(hit){let dm=it.dmg||8;hit.hp-=dm;effect(hit.x,hit.y);log(`${dn(it,false)}を撃ち、${hit.n}に${dm}ダメージ。`);if(hit.hp<=0)kill(hit)}else{dropArrowAt(it,lastFloor.x,lastFloor.y);effect(lastFloor.x,lastFloor.y);log(`${dn(it,false)}を撃ちましたが外れ、${lastFloor.x},${lastFloor.y}に落ちました。`)}after()}
function dropArrowAt(src,x,y){let p=dropTile(x,y);let on=S.items.find(it=>Number(it.x)===p.x&&Number(it.y)===p.y&&it.k===src.k&&it.cat==="arrow");if(on){on.qty=(on.qty||0)+1;return}let a=item(src.k,true,false);a.qty=1;a.x=p.x;a.y=p.y;S.items.push(a)}
function lookFloor(){if(!S||S.end)return;let it=floorItem();if(it)logRender(`足元には ${dn(it)} があります。${dd(it)}`);else logRender("足元にアイテムはありません。")}
function effect(x,y){S.fx={x,y,t:Date.now()};setTimeout(()=>{if(S&&S.fx&&S.fx.x===x&&S.fx.y===y){S.fx=null;render()}},420)}
function after(){S.t++;hunger();if(!S||S.end){render();return}enemyTurn();if(!S||S.end){render();return}if(S.p.hp<=0){finish("HPが0になりました。",false,false);return}if(S.t%8===0&&S.p.hp<S.p.mhp&&S.p.food>0)S.p.hp++;normalizeItems();pickupAt(S.p.x,S.p.y,true);render()}
function hunger(){let rings=[equipItem("ringR"),equipItem("ringL")];let use=rings.some(r=>r?.k==="rf")?(S.t%2===0?1:0):1;S.p.food=cl(S.p.food-use,0,100);if(S.p.food===20)log("お腹が空いてきました。");if(S.p.food===0){S.p.hp-=2;log("空腹で2ダメージ。");if(S.p.hp<=0)finish("空腹で倒れました。",false,false)}}
function enemyTurn(){for(const e of [...S.en]){if(S.end)return;if(e.sleep>0){e.sleep--;continue}let n=e.ab==="fast"&&Math.random()<.55?2:1;for(let i=0;i<n;i++){if(!S.en.includes(e)||S.end)break;if(e.slow>0){e.slow--;if(i===0)continue}enemyAct(e)}}}
function enemyAct(e){let dist=Math.max(Math.abs(e.x-S.p.x),Math.abs(e.y-S.p.y));if(e.ab==="range"&&dist>1&&dist<=4&&Math.random()<.6){let dmg=Math.max(1,e.atk+R(1,4)-Math.floor(def()/2));if(hasEff("flameGuard"))dmg=Math.max(1,Math.floor(dmg*.55));S.p.hp-=dmg;effect(S.p.x,S.p.y);log(`${e.n}の炎。${dmg}ダメージ。`);if(S.p.hp<=0)finish(`${e.n}に倒されました。`,false,false);return}if(dist<=1)enemyAttack(e);else if(dist<=7){let dx=Math.sign(S.p.x-e.x),dy=Math.sign(S.p.y-e.y);moveE(e,dx,dy)||moveE(e,dx,0)||moveE(e,0,dy)}else if(Math.random()<.35){let [dx,dy]=C(Object.values(DIRS));moveE(e,dx,dy)}}
function enemyAttack(e){if(e.ab==="steal"&&!e.stole&&Math.random()<.45){if(hasEff("antiSteal")){log("盗みよけの効果で盗みを防ぎました。");e.stole=true}else{e.stole=true;if(S.p.g>=20){let g=Math.min(S.p.g,R(20,70));S.p.g-=g;log(`${e.n}に${g}G盗まれました。`)}else{let pool=S.p.inv.filter(it=>!isEq(it));if(pool.length){let it=C(pool);removeIt(it.id);log(`${e.n}に${dn(it,false)}を盗まれました。`)}}moveE(e,Math.sign(e.x-S.p.x),Math.sign(e.y-S.p.y));return}}let dmg=Math.max(1,e.atk-def()+R(-1,3));S.p.hp-=dmg;effect(S.p.x,S.p.y);log(`${e.n}の攻撃。${dmg}ダメージ。`);if(e.ab==="poison"&&Math.random()<.25){if(hasEff("poisonGuard"))log("毒よけの効果で毒を防ぎました。");else{S.p.poison=true;log("毒を受けました。攻撃力が下がっています。")}}if(S.p.hp<=0)finish(`${e.n}に倒されました。`,false,false)}
function moveE(e,dx,dy){let nx=e.x+dx,ny=e.y+dy;if(!inside(nx,ny))return false;if(e.ab!=="ghost"&&S.map[ny][nx]===WALL)return false;if(S.p.x===nx&&S.p.y===ny)return false;if(S.en.some(x=>x.id!==e.id&&x.x===nx&&x.y===ny))return false;e.x=nx;e.y=ny;return true}
function adj(x,y){for(const [dx,dy] of Object.values(DIRS)){let nx=x+dx,ny=y+dy;if(inside(nx,ny)&&S.map[ny][nx]===FLOOR&&!S.en.some(e=>e.x===nx&&e.y===ny)&&!(S.p.x===nx&&S.p.y===ny))return{x:nx,y:ny}}return null}
function posKey(x,y){return `${Number(x)},${Number(y)}`}
function samePos(a,b){return Number(a?.x)===Number(b?.x)&&Number(a?.y)===Number(b?.y)}
function isFloorCell(x,y){x=Number(x);y=Number(y);return inside(x,y)&&S.map[y]&&S.map[y][x]===FLOOR}
function normalizeItems(){if(!S||!S.items)return;for(const it of S.items){it.x=Number(it.x);it.y=Number(it.y);if(!isFloorCell(it.x,it.y)){let p=dropTile(it.x,it.y);it.x=p.x;it.y=p.y}}}
function dropTile(x,y){x=Number(x);y=Number(y);if(isFloorCell(x,y))return{x,y};let best=null,bestD=999;for(let yy=1;yy<SIZE-1;yy++){for(let xx=1;xx<SIZE-1;xx++){if(!isFloorCell(xx,yy))continue;if(S.en?.some(e=>Number(e.x)===xx&&Number(e.y)===yy))continue;let d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bestD){best={x:xx,y:yy};bestD=d}}}return best||{x:1,y:1}}
function itemAt(x,y){if(!S)return null;normalizeItems();return S.items.find(it=>Number(it.x)===Number(x)&&Number(it.y)===Number(y))||null}
function itemAtPlayer(){return itemAt(S?.p?.x,S?.p?.y)}
function canStackOnPickup(it){return it&&it.cat==="arrow"&&S.p.inv.some(x=>x.k===it.k&&x.cat==="arrow"&&!isEq(x))}
function pickupAt(x,y,silentFull=false){if(!S||S.end)return false;normalizeItems();x=Math.round(Number(x));y=Math.round(Number(y));let picked=false;for(let guard=0;guard<20;guard++){let idx=S.items.findIndex(it=>Math.round(Number(it.x))===x&&Math.round(Number(it.y))===y);if(idx<0)break;let it=S.items[idx];if(S.p.inv.length>=bagMax()&&!canStackOnPickup(it)){if(!silentFull){log("持ち物がいっぱいです。不要アイテムを床に置くか、床と交換してください。")}refreshPanels();break}S.items.splice(idx,1);delete it.x;delete it.y;let got=addInv(it);sel=got.id;log(`${dn(got)}を拾いました。`);picked=true}if(picked)refreshPanels();return picked}
function pickup(silentFull=false){return pickupAt(S?.p?.x,S?.p?.y,silentFull)}
function pickFloor(){if(!S||S.end)return;let ok=pickupAt(S.p.x,S.p.y,false);if(!ok){log("足元に拾えるアイテムはありません。")}render()}
function nearestGroundItem(range=1){return floorItem()}
function addInv(it){it=normalizeOneItem(it);if(it.cat==="arrow"){let same=S.p.inv.find(x=>x&&x.k===it.k&&x.cat==="arrow"&&!isEq(x));if(same){same.qty=(same.qty||0)+(it.qty||1);normalizeInventory();return same}}S.p.inv.push(it);normalizeInventory();return it}
function floorItem(){return itemAtPlayer()}
function dropSelected(idv=sel){if(!S||S.end)return;let it=findItem(idv);if(!it){log("置くアイテムを選択してください。");render();return}if(isEq(it)){log("装備中のアイテムは外してから置いてください。");render();return}if(floorItem()){log("足元にアイテムがあります。床と交換を使ってください。");render();return}removeIt(it.id);it.x=S.p.x;it.y=S.p.y;S.items.push(it);log(`${dn(it,false)}を床に置きました。`);render()}
function swapFloor(idv=sel){if(!S||S.end)return;let ground=floorItem(),it=findItem(idv);if(!ground){log("足元に交換するアイテムがありません。");render();return}if(!it){log("交換する手持ちアイテムを選択してください。");render();return}if(isEq(it)){log("装備中のアイテムは交換できません。外してから交換してください。");render();return}S.items=S.items.filter(x=>x.id!==ground.id);removeIt(it.id);it.x=S.p.x;it.y=S.p.y;S.items.push(it);delete ground.x;delete ground.y;addInv(ground);sel=ground.id;log(`${dn(it,false)}と${dn(ground,false)}を交換しました。`);render()}
function stairs(){if(S.p.x!==S.st.x||S.p.y!==S.st.y)return;if(S.f>=S.du.max){finish("最深部に到達しました。ダンジョンクリア！",true,true);return}S.f++;S.canReturn=S.f%5===0;log(`${S.f}階へ進みました。`);if(S.canReturn)log("帰還ポイントです。帰還ボタンで持ち帰れます。");floor(false)}
function use(idv=sel){if(!S||S.end)return;let it=findItem(idv);if(!it){log("使うアイテムを選択してください。");render();return}know(it.k);if(["weapon","shield","ring"].includes(it.cat)){log("装備品です。装備ボタンを使用してください。");render();return}if(it.cat==="arrow"){shootSelected(it.id);return}if(it.k==="h1")heal(25);else if(it.k==="h2")heal(60);else if(it.k==="hp"){S.p.atk++;log("ちからが上がりました。")}else if(it.k==="po"){S.p.poison=false;log("毒が消えました。")}else if(it.k==="bread"){S.p.food=cl(S.p.food+50,0,100);log("パンを食べました。満腹度が回復しました。")}else if(it.k==="si"){S.p.inv.forEach(x=>know(x.k));log("持ち物をすべて識別しました。")}else if(it.k==="st")thunder();else if(it.k==="ww")warp();else if(it.k==="sr"){removeIt(it.id);finish("帰還の巻物で無事に帰りました。",false,true);return}else if(it.k==="sa")enhance("weapon");else if(it.k==="sd")enhance("shield");else if(it.cat==="wand")wand(it);else if(it.cat==="pot")pot(it);else log("何も起きませんでした。");consume(it);after()}
function consume(it){if(!findItem(it.id))return;if(it.ch!=null){it.ch--;if(it.ch<=0){log(`${it.n}は空になりました。`);removeIt(it.id)}}else removeIt(it.id)}
function heal(n){S.p.hp=cl(S.p.hp+n,1,S.p.mhp);log(`HPが${n}回復しました。`)}
function thunder(){let a=S.en.filter(e=>Math.max(Math.abs(e.x-S.p.x),Math.abs(e.y-S.p.y))<=4);if(!a.length){log("近くに敵がいません。");return}log("雷が周囲の敵を打ちました。");a.forEach(e=>{e.hp-=25;effect(e.x,e.y)});[...a].forEach(e=>{if(e.hp<=0)kill(e)})}
function warp(){let p=emptyTile();S.p.x=p.x;S.p.y=p.y;log("ワープしました。")}
function nearEnemy(){let best=null,bd=99;S.en.forEach(e=>{let d=Math.max(Math.abs(e.x-S.p.x),Math.abs(e.y-S.p.y));if(d<bd&&d<=7){best=e;bd=d}});return best}
function wand(it){let e=nearEnemy();if(!e){log("近くに敵がいません。");return}if(it.k==="wf"){e.hp-=20;effect(e.x,e.y);log(`${e.n}に20ダメージ。`);if(e.hp<=0)kill(e)}else if(it.k==="ws"){e.slow=4;log(`${e.n}を鈍足にしました。`)}else if(it.k==="wb"){let dx=Math.sign(e.x-S.p.x),dy=Math.sign(e.y-S.p.y);for(let i=0;i<4;i++)if(!moveE(e,dx,dy))break;log(`${e.n}を吹き飛ばしました。`)}else if(it.k==="wx"){let x=S.p.x,y=S.p.y;S.p.x=e.x;S.p.y=e.y;e.x=x;e.y=y;log(`${e.n}と場所替えしました。`)}}
function pot(it){if(it.k==="ph")heal(40);else if(it.k==="pi"){S.p.inv.forEach(x=>know(x.k));log("識別の壺で識別しました。")}else if(it.k==="ps"){log("保存の壺を使いました。所持上限は20個固定です。")}else if(it.k==="pc"){synth();}}
function enhance(slot){let it=equipItem(slot);if(!it){log(slot==="weapon"?"武器を装備していません。":"盾を装備していません。");return}let n=R(1,3);it.plus=(it.plus||0)+n;log(`${dn(it,false)}の+値が${n}上がりました。`) }
function synth(){let equips=S.p.inv.filter(it=>["weapon","shield","ring"].includes(it.cat));if(equips.length<2){log("合成できる装備が2つ以上ありません。口は閉じました。仕方ない。\n");return}let text="合成する番号を入力してください。例: 1,2\n同じ種類の装備だけ合成できます。\n\n"+equips.map((it,i)=>`${i+1}: ${dn(it,false)} / ${it.cat} / +${it.plus||0}${effectText(it)}`).join("\n");let ans=prompt(text,"1,2");if(!ans)return;let [a,b]=ans.split(/[，,\s]+/).map(x=>Number(x)-1);let base=equips[a],mat=equips[b];if(!base||!mat||base.id===mat.id){log("合成を中止しました。");return}if(base.cat!==mat.cat){log("違う種類の装備は合成できません。武器同士、盾同士、指輪同士で合成してください。");return}base.plus=(base.plus||0)+(mat.plus||0);base.ef=[...new Set([...(base.ef||[]),...(mat.ef||[])])];removeIt(mat.id);log(`${dn(mat,false)}を合成し、${dn(base,false)}になりました。`) }
function equip(idv=sel,slot=null){if(!S||S.end)return;let it=findItem(idv);if(!it){log("装備するアイテムを選択してください。");render();return}if(!["weapon","shield","ring","arrow"].includes(it.cat)){log(`${dn(it)}は装備できません。`);render();return}know(it.k);if(it.cat==="weapon")slot="weapon";else if(it.cat==="shield")slot="shield";else if(it.cat==="arrow")slot="arrow";else slot=slot||(!S.p.eq.ringR?"ringR":!S.p.eq.ringL?"ringL":"ringR");S.p.eq[slot]=it.id;sortInv();log(`${dn(it,false)}を${slotName(slot)}に装備しました。`);refreshPanels();after()}
function unequip(idv){if(!S||S.end)return;let it=findItem(idv);if(!it)return;let slot=eqSlotOf(it);if(!slot)return;S.p.eq[slot]=null;sortInv();log(`${dn(it,false)}を外しました。`);refreshPanels();after()}
function slotName(s){return({weapon:"武器",shield:"盾",ringR:"右手の指輪",ringL:"左手の指輪",arrow:"矢"}[s]||s)}
function removeIt(i){S.p.inv=S.p.inv.filter(x=>x.id!==i);for(const k of Object.keys(S.p.eq))if(S.p.eq[k]===i)S.p.eq[k]=null;if(sel===i)sel=""}
function sortKey(it){let eq=isEq(it)?0:1,slot=eqSlotOf(it),slotOrd={weapon:1,shield:2,ringR:3,ringL:4,arrow:5}[slot]||9;return [eq,eq?0:slotOrd,CAT_ORDER[it.cat]||99,it.k,it.plus?-(it.plus):0,it.n]}
function sortInv(){S.p.inv.sort((a,b)=>{let A=sortKey(a),B=sortKey(b);for(let i=0;i<A.length;i++){if(A[i]<B[i])return-1;if(A[i]>B[i])return 1}return 0})}
function sortInvButton(){if(!S)return;sortInv();log("手持ちを整頓しました。装備中→武器→防具→指輪→矢→回復→食料→杖→巻物→壺の順に並べました。");render()}
function buy(i){if(!S||!S.shop)return;let it=S.shop.goods[i];if(!it)return;if(S.p.g<it.p){log("ゴールドが足りません。");render();return}if(S.p.inv.length>=bagMax()){log("持ち物がいっぱいです。不要アイテムを売るか床に置いてください。");render();return}S.p.g-=it.p;S.shop.goods.splice(i,1);addInv(it);sel=it.id;sortInv();log(`${dn(it)}を購入しました。`);render()}
function inShop(){return S&&S.shop&&S.p.x===S.shop.x&&S.p.y===S.shop.y}
function sellItem(idv){if(!S||S.end)return;if(!inShop()){log("売却は店の上で行えます。");render();return}let it=findItem(idv);if(!it){log("売るアイテムを選択してください。");render();return}if(isEq(it)){log("装備中のアイテムは外してから売ってください。");render();return}removeIt(it.id);let price=Math.max(1,Math.floor((it.p||10)*0.5)+(it.plus||0)*30);S.p.g+=price;log(`${dn(it,false)}を${price}Gで売りました。`);render()}
function ret(){if(!S||S.end)return;if(!S.canReturn){log("今は帰還できません。5階ごとの帰還ポイント、帰還の巻物、クリア時のみ帰還できます。");render();return}finish("帰還ポイントから無事に帰りました。",false,true)}
function giveup(){if(S&&!S.end)finish("冒険をあきらめました。手持ちと装備は全ロストしました。",false,false)}
function finish(msg,clear,keep){if(!S||S.end)return;let death=!clear&&!keep&&S.p.hp<=0;S.end=true;last={name:S.name,score:score(clear),floor:S.f,level:S.p.lv,gold:S.p.g,defeated:S.def,turn:S.t,cleared:clear,dungeonId:S.du.id,dungeonName:S.du.name,version:APP_VERSION,createdAt:new Date().toISOString()};saveLocal(last);saveProgress();let resultInfo={name:S.name,duName:S.du.name,f:S.f,lv:S.p.lv,def:S.def,g:S.p.g,msg,clear,keep,death};if(keep)depositAll();else{S.p.inv=[];S.p.eq={weapon:null,shield:null,ringR:null,ringL:null,arrow:null};sel=""}render();renderWh();E.rt.textContent=clear?"ダンジョンクリア！":death?"冒険失敗":"冒険終了";E.rx.innerHTML=`${death?"死因":"理由"}：${esc(msg)}<br>ダンジョン：${esc(resultInfo.duName)}<br>スコア：<b>${last.score}</b><br>到達階：${resultInfo.f}階 / Lv：${resultInfo.lv} / 討伐：${resultInfo.def}体 / G：${resultInfo.g}`;E.sub.disabled=false;E.res.showModal();loadRank();setTimeout(()=>{S=null;faceMode=false;updateFaceButton();empty();renderWh()},0)}
function score(clear=false){return Math.floor(S.f*140*S.du.dif+S.p.lv*90+S.p.g+S.def*28+Math.max(0,S.p.hp)*3+S.p.inv.length*15+(clear?S.du.max*180:0))}
function empty(){E.b.innerHTML="";for(let i=0;i<SIZE*SIZE;i++){let d=document.createElement("div");d.className="cell wall";E.b.appendChild(d)}update();renderInv();renderShop()}
function render(){if(!S){empty();return}normalizeItems();pickupAt(S.p.x,S.p.y,true);let im=new Map(S.items.map(x=>[`${x.x},${x.y}`,x])),em=new Map(S.en.map(x=>[`${x.x},${x.y}`,x]));E.b.innerHTML="";for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){let d=document.createElement("div"),k=`${x},${y}`;d.className="cell "+(S.map[y][x]===WALL?"wall":"floor");if(S.p.x===x&&S.p.y===y){d.className="cell player "+faceClass();d.textContent="主"}else if(em.has(k)){let e=em.get(k);d.className="cell enemy";d.textContent=e.ic;d.title=`${e.n} HP:${e.hp}/${e.mhp}`}else if(S.st.x===x&&S.st.y===y){d.className="cell stairs";d.textContent="▽"}else if(S.shop&&S.shop.x===x&&S.shop.y===y){d.className="cell shopTile";d.textContent="店"}else if(im.has(k)){let it=im.get(k);d.className="cell item";d.textContent=it.ic;d.title=dn(it);d.onclick=()=>{if(S&&Number(it.x)===Number(S.p.x)&&Number(it.y)===Number(S.p.y)){pickupAt(it.x,it.y,false);render()}else logRender("アイテムの上に乗ってから拾ってください。")}}else if(S.map[y][x]===FLOOR)d.textContent="·";if(S.fx&&S.fx.x===x&&S.fx.y===y)d.className+=" hitEffect";E.b.appendChild(d)}update();renderInv();renderShop();renderLog()}
function update(){if(S)normalizeInventory();let d=S?.du||DUN[E.ds.value]||DUN.beginner;E.sf.textContent=S?String(`${S.f}/${d.max}`):"-";E.sl.textContent=S?String(S.p.lv):"-";E.hp.textContent=S?String(`${S.p.hp}/${S.p.mhp}`):"-";E.fo.textContent=S?String(S.p.food):"-";E.go.textContent=S?String(S.p.g):"-";if(E.sa)E.sa.textContent=S?String(atk()):"-";if(E.sd)E.sd.textContent=S?String(def()):"-";E.ew.textContent=S?String(safeDn(equipItem("weapon"))):"なし";E.es.textContent=S?String(safeDn(equipItem("shield"))):"なし";E.err.textContent=S?String(safeDn(equipItem("ringR"))):"なし";E.erl.textContent=S?String(safeDn(equipItem("ringL"))):"なし";if(E.ear)E.ear.textContent=S?String(safeDn(equipItem("arrow"))):"なし"}
function renderInv(){
 try{
   if(!S){E.inv.textContent="冒険前です。倉庫から持ち出して開始できます。";E.bag.textContent="-";return}
   normalizeInventory();
   let fi=floorItem();
   E.bag.innerHTML=`持ち物 ${S.p.inv.length}/${bagMax()} / 攻撃 ${atk()} / 防御 ${def()}${S.p.poison?" / 毒":""}${S.canReturn?"<div class='floorHint'>帰還ポイント：帰還可能</div>":""}${fi?`<div class='floorHint'>足元：${esc(safeDn(fi))}（拾うボタンで取得）</div>`:""}`;
   if(!S.p.inv.length){E.inv.innerHTML="<div class='emptyItem'>持ち物なし</div>";return}
   const rows=[];
   for(const raw of S.p.inv){
     const it=normalizeOneItem(raw);
     const eq=isEq(it);
     const id=esc(it.id);
     let actions="";
     if(eq){
       actions+=`<button data-act="unequip" data-id="${id}" class="safeMini">外す</button>`;
     }else if(it.cat==="weapon"||it.cat==="shield"){
       actions+=`<button data-act="equip" data-id="${id}" class="mainMini">装備</button>`;
     }else if(it.cat==="ring"){
       actions+=`<button data-act="equipR" data-id="${id}" class="mainMini">右装備</button>`;
       actions+=`<button data-act="equipL" data-id="${id}" class="mainMini">左装備</button>`;
     }else if(it.cat==="arrow"){
       actions+=`<button data-act="equipArrow" data-id="${id}" class="mainMini">装備</button>`;
       actions+=`<button data-act="shoot" data-id="${id}" class="mainMini">撃つ</button>`;
     }else{
       actions+=`<button data-act="use" data-id="${id}" class="mainMini">使う</button>`;
     }
     if(!eq){
       actions+=`<button data-act="drop" data-id="${id}" class="dangerMini">置く</button>`;
       if(fi)actions+=`<button data-act="swap" data-id="${id}">床と交換</button>`;
       if(inShop())actions+=`<button data-act="sell" data-id="${id}" class="safeMini">売る</button>`;
     }
     rows.push(`<div class="row${sel===it.id?" sel":""}${eq?" equipped":""}" data-id="${id}">
       <button class="itemLine" data-act="select" data-id="${id}">${esc(it.ic)} ${esc(safeDn(it))}${eq?" <span class='eqMark'>装備中</span>":""}<span class="desc">${esc(safeDd(it))}</span></button>
       <div class="rowActions">${actions}</div>
     </div>`);
   }
   E.inv.innerHTML=rows.join("");
 }catch(e){
   console.error(e);
   const list=(S&&S.p&&Array.isArray(S.p.inv)?S.p.inv:[]).map(it=>`<div class="row"><button class="itemLine">${esc(safeDn(it))}</button></div>`).join("");
   E.inv.innerHTML=list||"<div class='emptyItem'>持ち物なし</div>";
   if(S&&S.p)E.bag.innerHTML=`持ち物 ${S.p.inv?.length||0}/${bagMax()} 件`;
 }
}
function inventoryClick(ev){
 if(!S||S.end)return;
 const btn=ev.target.closest?ev.target.closest("[data-act]"):null;
 if(!btn)return;
 const id=btn.getAttribute("data-id");
 const act=btn.getAttribute("data-act");
 if(id)sel=id;
 if(act==="select"){renderInv();return}
 if(act==="use")use(id);
 else if(act==="equip")equip(id);
 else if(act==="equipR")equip(id,"ringR");
 else if(act==="equipL")equip(id,"ringL");
 else if(act==="equipArrow")equip(id,"arrow");
 else if(act==="shoot")shootSelected(id);
 else if(act==="unequip")unequip(id);
 else if(act==="drop")dropSelected(id);
 else if(act==="swap")swapFloor(id);
 else if(act==="sell")sellItem(id);
}
function renderShop(){E.shop.innerHTML="";if(!S||!S.shop||S.p.x!==S.shop.x||S.p.y!==S.shop.y){E.shop.className="list muted";E.shop.textContent="店に乗ると商品が表示されます。手持ちアイテムの「売る」ボタンで売却できます。";return}E.shop.className="list";if(!S.shop.goods.length){E.shop.textContent="売り切れです。";return}S.shop.goods.forEach((it,i)=>{let r=document.createElement("div");r.className="shopItem";r.innerHTML=`<div>${esc(it.ic)} ${esc(dn(it))}<span class="desc">${it.p}G / ${esc(dd(it))}</span></div>`;let b=document.createElement("button");b.textContent="購入";b.onclick=()=>buy(i);r.appendChild(b);E.shop.appendChild(r)})}
function renderLog(){E.log.innerHTML=(S?S.log.slice(-90):[]).slice().reverse().map(x=>`<div>${esc(x)}</div>`).join("")}
function log(x){if(!S)return;S.log.push(x);if(E&&E.log)renderLog()}
function refreshPanels(){update();renderInv();renderLog()}
function logRender(x){log(x);renderLog()}function inside(x,y){return x>=0&&y>=0&&x<SIZE&&y<SIZE}
function wh(){return JSON.parse(localStorage.md_warehouse_v030||"[]")}function writeWh(a){localStorage.md_warehouse_v030=JSON.stringify(a.slice(0,100))}function sortItems(a){a.sort((x,y)=>{let A=[CAT_ORDER[x.cat]||99,x.k,-(x.plus||0),x.n],B=[CAT_ORDER[y.cat]||99,y.k,-(y.plus||0),y.n];for(let i=0;i<A.length;i++){if(A[i]<B[i])return-1;if(A[i]>B[i])return 1}return 0});return a}
function renderWh(){let a=wh();E.wh.innerHTML="";if(!a.length){E.wh.textContent="倉庫は空です。";return}a.forEach(it=>{let b=document.createElement("button");b.className="row"+(selWh===it.id?" sel":"");b.innerHTML=`${esc(it.ic)} ${esc((it.n||dn(it,false))+plusText(it)+(it.qty?`×${it.qty}`:"")+(it.ch!=null?`［${it.ch}］`:""))}<span class="desc">${esc((it.d||"")+effectText(it))}</span>`;b.onclick=()=>{selWh=it.id;renderWh()};E.wh.appendChild(b)})}
function takeWh(){if(S&&!S.end){log("冒険中は倉庫から持ち出せません。");render();return}let a=wh(),i=a.findIndex(x=>x.id===selWh);if(i<0)return;let p=JSON.parse(localStorage.md_pending_items_v030||"[]");if(p.length>=8){alert("持ち出しは最大8個です。");return}p.push(a.splice(i,1)[0]);writeWh(a);localStorage.md_pending_items_v030=JSON.stringify(p);selWh="";renderWh();alert("次回冒険の持ち物に入れました。")}
function sortWh(){let a=sortItems(wh());writeWh(a);renderWh()}
function depositAll(){let a=wh();S.p.inv.forEach(it=>{it.known=true;a.push(it)});S.p.inv=[];S.p.eq={weapon:null,shield:null,ringR:null,ringL:null,arrow:null};writeWh(sortItems(a))}
function rkey(){return`md_rank_v030_${E.ds.value||"beginner"}`}function saveLocal(r){let a=JSON.parse(localStorage.getItem(`md_rank_v030_${r.dungeonId}`)||"[]");a.push(r);a.sort((x,y)=>y.score-x.score);localStorage.setItem(`md_rank_v030_${r.dungeonId}`,JSON.stringify(a.slice(0,20)))}function localRank(){return JSON.parse(localStorage.getItem(rkey())||"[]").sort((x,y)=>y.score-x.score).slice(0,10)}
async function submit(){if(!last)return;E.sub.disabled=true;try{let p=new URLSearchParams();Object.entries(last).forEach(([k,v])=>p.append(k,String(v)));await fetch(GAS_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:p.toString()});E.rn.textContent="共有ランキングへ送信しました。";setTimeout(loadRank,1500)}catch(e){E.rn.textContent="共有ランキング送信に失敗。ローカルランキングを表示します。";loadRank()}}
async function loadRank(){let did=E.ds.value||"beginner",du=DUN[did]||DUN.beginner,a=localRank();showRank(a,`${du.name}：共有ランキングを取得中...`);try{let r=await jsonp(`${GAS_URL}?action=ranking&dungeonId=${encodeURIComponent(did)}&limit=10`);showRank(Array.isArray(r.ranking)?r.ranking:a,`${du.name}：共有ランキングを表示中です。`)}catch(e){showRank(a,"共有ランキングを取得できませんでした。ローカルランキングを表示中です。")}}
function showRank(a,note){E.rank.innerHTML="";if(!a.length){let li=document.createElement("li");li.textContent="まだ記録がありません";E.rank.appendChild(li)}else a.slice(0,10).forEach(r=>{let li=document.createElement("li");li.textContent=`${r.cleared===true||r.cleared==="true"?"★":""}${r.name||"名無し"}：${r.score||0}点（${r.floor||"-"}F / Lv${r.level||"-"}）`;E.rank.appendChild(li)});E.rn.textContent=note}
function jsonp(url){return new Promise((ok,ng)=>{let cb="mdcb"+Date.now()+R(1,99999),s=document.createElement("script"),t=setTimeout(()=>{clean();ng(new Error("timeout"))},10000);function clean(){clearTimeout(t);delete window[cb];s.remove()}window[cb]=d=>{clean();ok(d)};s.onerror=()=>{clean();ng(new Error("jsonp"))};s.src=url+(url.includes("?")?"&":"?")+`callback=${cb}&_=${Date.now()}`;document.body.appendChild(s)})}
async function sw(){if(!("serviceWorker"in navigator))return;try{let r=await navigator.serviceWorker.register("./sw.js?v="+APP_VERSION);r.update()}catch(e){}}
async function hardUpdate(){try{if("serviceWorker"in navigator){let r=await navigator.serviceWorker.getRegistrations();await Promise.all(r.map(x=>x.unregister()))}if("caches"in window){let k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)))}}catch(e){}let u=new URL(location.href);u.searchParams.set("reload",Date.now());location.replace(u.toString())}
init();
