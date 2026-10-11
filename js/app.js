const SRC="기준 2026.10.10 · 사진·자료: 국회 열린국회정보(공공누리 제1유형) · 정당 로고: 위키미디어 공용(공식 자료 아님)";
const reduceM=matchMedia("(prefers-reduced-motion: reduce)").matches;

const AVG={rep:62,co:744,vote:75,cross:13,pass:24};


const elecBox=c=>{
  if(c.dist==="비례대표")return `<span class="relec"><small>당선 방식</small><b>정당 명부</b></span>`;
  const e=ELE[c.code];
  if(!e)return `<span class="relec"><small>당선 방식</small><b>보궐선거</b></span>`;
  const f=n=>(+n).toFixed(1)+"%";
  return `<span class="relec" title="${e[3]||"22대 총선(2024.4.10)"} 당선 득표율${e[1]!=null?" · 2위 "+e[2]+" "+f(e[1]):""}"><small>당선 득표율</small><span class="rv"><b>${f(e[0])}</b>${e[1]!=null?`<i>2위 ${f(e[1])}</i>`:""}</span></span>`;
};

const TIPS={
  "대표발의":"이 의원이 대표로 직접 발의한 법안의 건수예요. 많고 적음이 법안의 질을 뜻하진 않아요.",
  "공동발의":"다른 의원이 대표로 낸 법안에 이름을 올려 함께 발의한 건수예요.",
  "표결참여":"본회의 표결 중 찬성·반대·기권으로 직접 참여한 비율이에요. 불참 사유는 구분하지 않아요.",
  "타당공동":"공동발의에 함께 이름을 올린 의원 중 다른 정당 소속의 비율이에요.",
  "법안반영":"대표발의한 법안 전체(아직 심사 중인 법안 포함) 중 가결되거나, 다른 법안(대안·수정안)에 합쳐져 반영된 비율이에요."
};
const CARDS=[
  {nm:"이가상",party:"개혁신당",color:"#FF7210",terms:1,sido:"경기",dist:"화성시을",s:[12,188,97,31,25],cmit:"과학기술정보방송통신위원회",bills:["전자금융거래법 일부개정법률안","청년기본법 일부개정법률안","소프트웨어 진흥법 일부개정법률안"],v:[1702,96,31,82]},
  {nm:"박예시",party:"국민의힘",color:"#E61E2B",terms:2,sido:"",dist:"비례대표",s:[38,412,95,9,41],cmit:"국토교통위원회 · 예산결산특별위원회",bills:["도로교통법 일부개정법률안","항만법 일부개정법률안","주택법 일부개정법률안"],v:[1655,120,44,92]},
  {nm:"김가상",party:"더불어민주당",color:"#152484",terms:3,sido:"강원",dist:"춘천시철원군화천군양구군갑",s:[45,312,94,18,22],cmit:"농림축산식품해양수산위원회",bills:["농어업재해보험법 일부개정법률안","접경지역 지원 특별법 일부개정법률안","산림자원법 일부개정법률안"],v:[1620,85,40,166]},
  {nm:"최샘플",party:"무소속",color:"#6B6F76",terms:5,sido:"대구",dist:"동구군위군을",s:[27,236,89,44,30],cmit:"행정안전위원회",bills:["지방자치법 일부개정법률안","재난안전법 일부개정법률안","공공기록물법 일부개정법률안"],v:[1488,140,62,221]}
];
function localText(c){
  if(c.dist==="비례대표")return "<b>비례대표</b>";
  const units=c.dist.replace(/[갑을병정무]$/,"").match(/[^시군구]+?[시군구]/g)||[];
  if(units.length<=1)return `<i>${c.sido}</i><b>${units[0]||c.dist}</b>`;
  return `<i>${c.sido}</i><b>${units[0]} 외 ${units.length-1}</b>`;
}
function localName(c){
  if(c.dist==="비례대표")return "국회";
  const units=c.dist.replace(/[갑을병정무]$/,"").match(/[^시군구]+?[시군구]/g)||[];
  return units.length===1?units[0]:c.sido;
}
function lum(h){const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
/* 정당색 위 흰 글씨 대비가 3:1(큰 글씨 기준) 아래면 검정 글씨 */
const mixTop=h=>{const n=parseInt(h.slice(1),16);return "#"+[n>>16,n>>8&255,n&255].map(v=>Math.round(v*.78+255*.22).toString(16).padStart(2,"0")).join("")};
const inkDark=h=>1.05/(lum(mixTop(h))+.05)<3.5; /* 카드 윗부분은 정당색에 흰색이 섞여 밝아지므로 그 색 기준으로 판단 */
const sidoOr=c=>c.sido||"비례대표";
const tierClass=t=>t>=4?"t4":"t"+t;
const tierName=t=>t===1?"초선":t===2?"재선":t+"선";
const fmt=n=>n.toLocaleString("ko-KR");

function silhouette(){
  return `<svg viewBox="0 0 100 94" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <path d="M50 10c11 0 19 9 19 21s-8 23-19 23-19-11-19-23 8-21 19-21z" fill="rgba(255,255,255,.26)"/>
    <path d="M8 94c2-20 16-30 30-33l12 10 12-10c14 3 28 13 30 33z" fill="rgba(255,255,255,.2)"/>
    <path d="M44 63l6 16 6-16-6 5z" fill="rgba(255,255,255,.32)"/>
  </svg><span class="ph-note">공식 사진 자리</span>`;
}
function front(c){
  const S=c.s||[0,0,0,0,0];const st=[["대표발의",S[0],"",AVG.rep],["공동발의",S[1],"",AVG.co],["법안반영",S[4],"%",AVG.pass],["표결참여",S[2],"%",AVG.vote]];
  return `<div class="shield frame"></div><div class="shield bevel"></div><div class="shield rim"></div><div class="shield hair"></div><div class="shield inner" style="--pc:${c.color}"><div class="chev a"></div><div class="chev b"></div><div class="grain"></div></div><div class="shield gloss"></div><div class="shield holo"></div><div class="shield glare"></div>
  <div class="content${inkDark(c.color)?" ink-dark":""}">
    <div class="tier"><b>${tierName(c.terms)}</b><small>당선 횟수</small><div class="badges">${LOGOS[c.party]?`<span class="logo has" title="${c.party}"><img src="${LOGOS[c.party]}" alt="${c.party} 로고"></span>`:`<span class="logo" title="${c.party}">${c.party==="무소속"?"무소속":c.party}</span>`}</div></div>
    <div class="photo${c.photo?" real":""}">${c.photo?`<img src="${c.photo}" alt="${c.nm} 의원 공식 사진" loading="lazy">`:silhouette()}</div>
    <div class="nameline"><span class="nm">${c.nm}</span><span class="pt">${c.party}</span></div>
    <div class="region"><span class="rloc"><span class="sido">${c.sido}</span><span class="dist">${c.dist}</span></span>${elecBox(c)}</div>
    <div class="panel"></div>
    <div class="stats">${st.map(([k,v,u,a])=>`<span class="stat" role="button" tabindex="0" data-k="${k}"><span class="k">${k}</span><span class="v">${c.s&&v!=null?fmt(v)+u:"–"}</span><span class="avg">${c.s?`22대 평균 ${fmt(a)}${u}`:"수치 연결 전"}</span></span>`).join("")}</div>
  </div>`;
}
function back(c){
  const tot=c.v.reduce((a,b)=>a+b,0);
  return `<div class="shield frame"></div><div class="shield bevel"></div><div class="shield rim"></div><div class="shield hair"></div><div class="shield inner"><div class="grain"></div></div><div class="shield glare"></div>
  <div class="content bk">
    <div class="bk-title"><b>${c.nm}</b><span>${c.party} · ${tierName(c.terms)}</span></div>
    <div><h4>소속 위원회</h4><p>${c.cmit}</p></div>
    <div><h4>최근 대표발의</h4><ol>${c.bills.map(b=>`<li>${b}</li>`).join("")}</ol></div>
    <div><h4>본회의 표결 ${fmt(tot)}건</h4><div class="votes"><div><b>${fmt(c.v[0])}</b><span>찬성</span></div><div><b>${fmt(c.v[1])}</b><span>반대</span></div><div><b>${fmt(c.v[2])}</b><span>기권</span></div><div><b>${fmt(c.v[3])}</b><span>불참</span></div></div></div>
    <a class="bk-link" href="https://likms.assembly.go.kr/bill/main.do" target="_blank" rel="noopener">의안정보시스템에서 전체 보기 ↗</a>
  </div>`;
}
function tiltable(el){
  if(reduceM)return;
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.setProperty("--ry",((x-.5)*22)+"deg");el.style.setProperty("--rx",((.5-y)*18)+"deg");
    el.style.setProperty("--mx",(x*100)+"%");el.style.setProperty("--my",(y*100)+"%");el.classList.add("hover");
  });
  el.addEventListener("pointerleave",()=>{el.style.removeProperty("--rx");el.style.removeProperty("--ry");el.style.removeProperty("--mx");el.style.removeProperty("--my");el.classList.remove("hover")});
}
function cardEl(c,{flip=true}={}){
  const el=document.createElement("div");
  el.className="card "+tierClass(c.terms);
  el.tabIndex=0;el.setAttribute("role","button");
  el.setAttribute("aria-label",`${c.nm} 카드, 눌러서 뒷면 보기`);
  el.innerHTML=`<div class="tilt"><div class="face front-face">${front(c)}</div><div class="face back-face">${back(c)}</div></div>`;
  tiltable(el);
  if(flip){
    const toggle=e=>{if(e.target.closest(".stat")||e.target.closest("a"))return;el.querySelector(".tip")?.remove();el.classList.toggle("flipped")};
    el.addEventListener("click",toggle);
    el.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target===el){e.preventDefault();toggle(e)}});
  }
  wireStats(el);
  return el;
}
function wireStats(el){
  el.querySelectorAll(".stat").forEach(s=>{
    const show=e=>{e.stopPropagation();const box=el.querySelector(".front-face .content");const old=box.querySelector(".tip");const k=s.dataset.k;old?.remove();if(old&&old.dataset.k===k)return;
      const t=document.createElement("div");t.className="tip";t.dataset.k=k;t.innerHTML=`<b>${k}</b>${TIPS[k]}`;box.appendChild(t)};
    s.addEventListener("click",show);
    s.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();show(e)}});
  });
}
function fitRegion(root){
  root.querySelectorAll(".region .dist").forEach(d=>{
    const box=d.parentElement;const cw=box.clientWidth;if(!cw)return;
    d.style.whiteSpace="nowrap";d.style.fontSize="";d.style.display="inline-block";
    let size=parseFloat(getComputedStyle(d).fontSize);const min=size*.7;
    while(d.scrollWidth>cw&&size>min){size-=.5;d.style.fontSize=size+"px"}
    if(d.scrollWidth>cw){d.style.whiteSpace="normal";d.style.display="block"}
  });
}

/* 모음 */
const gal=document.getElementById("gallery");
CARDS.forEach(c=>{const w=document.createElement("div");w.className="gal-item";w.appendChild(cardEl(c));const p=document.createElement("p");p.textContent=`${c.terms>=4?"4선 이상(특수)":tierName(c.terms)} · ${c.party}`;w.appendChild(p);const sr=document.createElement("p");sr.className="src";sr.textContent=SRC;w.appendChild(sr);gal.appendChild(w)});
/* 무대 */
const $=id=>document.getElementById(id);
const reduce=reduceM;
const stage=$("stage"),slots=$("slots"),hint=$("hint"),skipBtn=$("skipBtn"),exitP=$("exit");
let PACK=[],opened=0,busy=false,spBusy=false,skipNow=false,pending=null;
const narrow=()=>true;
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2400)}

const wait=ms=>new Promise(r=>{if(reduce||skipNow)return r();const t0=performance.now();(function f(){if(skipNow||performance.now()-t0>=ms)r();else setTimeout(f,30)})()});
const sw=()=>(document.getElementById("stage").clientWidth||390)/100;
const call=document.getElementById("bigcall"),wash=document.getElementById("wash"),fx=document.getElementById("fx");
async function shout(label,text,cls,ms){
  if(skipNow)return;
  call.className="bigcall";call.innerHTML=`<small>${label}</small><b class="${cls||""}"${cls!=="party"?` style="white-space:nowrap;font-size:${Math.max(40,Math.min(22*sw(),88/Math.max(text.length,1)*sw(),150))}px"`:""}>${text}</b>`;
  void call.offsetWidth;call.classList.add("show");await wait(ms);call.classList.remove("show");call.classList.add("out");await wait(320);call.className="bigcall";
}
function burst(el,color){
  if(reduce||skipNow)return;
  const sr=stage.getBoundingClientRect(),r=el.getBoundingClientRect();
  const cx=r.left-sr.left+r.width/2,cy=r.top-sr.top+r.height/2;
  fx.innerHTML="";
  const flash=document.createElement("div");flash.className="flash";flash.style.left=cx+"px";flash.style.top=cy+"px";fx.appendChild(flash);
  const rays=document.createElement("div");rays.className="rays";rays.style.left=cx+"px";rays.style.top=cy+"px";fx.appendChild(rays);
  const ring=document.createElement("div");ring.className="ring";ring.style.left=cx+"px";ring.style.top=cy+"px";fx.appendChild(ring);
  for(let i=0;i<46;i++){
    const d=document.createElement("i");d.className="spark";
    const ang=Math.random()*Math.PI*2,dist=90+Math.random()*Math.max(sr.width,sr.height)*.45;
    d.style.left=cx+"px";d.style.top=cy+"px";
    d.style.setProperty("--dx",Math.cos(ang)*dist+"px");d.style.setProperty("--dy",Math.sin(ang)*dist+"px");
    d.style.setProperty("--rot",(Math.random()*720-360)+"deg");
    d.style.animationDelay=(Math.random()*120)+"ms";
    d.style.background=i%3===0?"#ffffff":i%3===1?"#f4dc9a":"#d9b25c";
    if(i%4===0){d.style.width="10px";d.style.height="4px"}
    fx.appendChild(d);
  }
  setTimeout(()=>{fx.innerHTML=""},2200);
}
async function reveal(el,c,fast=false){
  el.dataset.started="1";busy=!fast;
  const chips=el.querySelectorAll(".chip"),q=el.querySelector(".q");
  if(!fast){
    hint.textContent="화면을 누르면 바로 결과를 봐요";stage.classList.add("focus");el.classList.add("picked");
    if(narrow())el.scrollIntoView({behavior:reduce?"auto":"smooth",inline:"center",block:"nearest"});
    await wait(250);
    q.style.opacity=0;chips[0].classList.add("on");
    await shout(c.sido?"지역":"지역 · 시도 없음",sidoOr(c),"",750);
    el.classList.remove("facedown");el.classList.add("step2",tierClass(c.terms));chips[1].classList.add("on");
    call.style.setProperty("--metal",getComputedStyle(el).getPropertyValue("--metal"));
    await shout("선수 · 당선 횟수",tierName(c.terms),"metal",750);
    wash.style.setProperty("--pc",c.color);wash.classList.add("show");
    await wait(160);el.classList.add("colored");
    call.style.setProperty("--pc",c.color);
    call.style.setProperty("--fs",(84/Math.max(c.party.length,3)*sw())+"px");
    await shout("정당",c.party,"party",850);wash.classList.remove("show");
    await wait(150);
    burst(el,c.color);
  }else{el.classList.remove("facedown");el.classList.add(tierClass(c.terms),"colored")}
  el.classList.add("revealed","colored");wireStats(el);requestAnimationFrame(()=>fitRegion(el));
  el.setAttribute("aria-label",`${c.nm} 카드, 눌러서 크게 보기`);
  opened++;busy=false;onCardRevealed(+el.dataset.i);
  if(!fast){
    if(skipNow){call.className="bigcall";fx.innerHTML=""}
    hint.textContent=`${c.nm} · ${c.party}`;
    await wait(900);skipNow=false;el.classList.remove("picked");stage.classList.remove("focus");
    afterCard();
  }
  if(opened===PACK.length)finish();
  if(pending&&!fast){const nx=pending;pending=null;if(!nx.dataset.started)revealAny(nx,PACK[+nx.dataset.i])}
}
/* 팩 안의 카드: 일반 카드(m)와 스페셜(sp) */
function buildSlots(){
  slots.innerHTML="";opened=0;
  const dots=$("dots");dots.innerHTML=PACK.map((_,i)=>`<i${i?"":' class="on"'}></i>`).join("");
  PACK.forEach((c,i)=>{
    const el=document.createElement("div");
    el.dataset.i=i;el.tabIndex=0;el.setAttribute("role","button");el.setAttribute("aria-label",`${i+1}번째 카드 열기`);
    if(c.sp){
      el.className="card slot sp facedown";el.dataset.m="closed";
      el.innerHTML=`<div class="tilt"><div class="face front-face">${spFront(c)}</div></div>`;
    }else{
      el.className="card slot facedown";
      el.innerHTML=`<div class="tilt"><div class="face front-face">${front(c)}<div class="cover"><span class="q">?</span><span class="chip">${sidoOr(c)}</span><span class="chip tierchip">${tierName(c.terms)}</span></div></div></div>`;
    }
    tiltable(el);
    const go=()=>{
      if(el.classList.contains("revealed")){if(!busy&&!spBusy)(c.sp?zoomSp:zoom)(c);return}
      if(el.dataset.started||spBusy)return;
      if(busy){skipNow=true;pending=el;return}
      revealAny(el,c);
    };
    el.addEventListener("click",go);
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}});
    slots.appendChild(el);
  });
}
function revealAny(el,c,fast=false){c.sp?revealSp(el,c,fast):reveal(el,c,fast)}
function afterCard(){
  hint.textContent=opened<PACK.length?`${PACK.length-opened}장 남았어요. 다음 카드를 골라 보세요.`:"";
}
function revealSp(el,p,fast=false){
  el.dataset.started="1";
  const done=()=>{
    el.dataset.m="face";el.classList.remove("facedown");el.classList.add("t5","revealed","colored");
    el.setAttribute("aria-label",`${p.nm} 스페셜 카드, 눌러서 크게 보기`);
    spBusy=false;opened++;onCardRevealed(+el.dataset.i);afterCard();
    if(opened===PACK.length)finish();
    if(pending&&!fast){const nx=pending;pending=null;if(!nx.dataset.started)revealAny(nx,PACK[+nx.dataset.i])}
  };
  if(fast){done();return}
  spBusy=true;hint.textContent="";
  if(narrow())el.scrollIntoView({behavior:reduce?"auto":"smooth",inline:"center",block:"nearest"});
  thOpen(p,{label:"카드 받기",onClose:done});
}
function finish(){
  hint.textContent="3장을 모두 열었어요.".replace("3",PACK.length);skipBtn.hidden=true;
  const first=!S.noteShown;S.noteShown=true;
  const fin={cards:PACK.slice(),first,sets:pk.newSets.slice()};pk.newSets=[];
  S.pack=null;saveS();
  pk.mode="result";pk.last=fin;
  renderAll();
  setTimeout(()=>exitP.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"}),350);
}
skipBtn.addEventListener("click",()=>{if(busy)skipNow=true;pending=null;slots.querySelectorAll(".slot:not([data-started])").forEach(el=>revealAny(el,PACK[+el.dataset.i],true))});
stage.addEventListener("click",e=>{if(busy&&!e.target.closest(".slot,button"))skipNow=true});
slots.addEventListener("scroll",()=>{const w=slots.firstElementChild?slots.firstElementChild.offsetWidth+14:1;const k=Math.round(slots.scrollLeft/w);[...$("dots").children].forEach((d,i)=>d.classList.toggle("on",i===k))},{passive:true});

/* 이 의원 소식: 실제 구글 뉴스·유튜브 결과(2026.10.10 받음). 영상은 하루 호출 한도 때문에 일부 의원만 */
const esc=s=>String(s).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
function newsBox(c){
  const N=NEWS[c.code]||[],V=VIDS[c.code]||[];
  const d=document.createElement("section");d.className="news";d.setAttribute("aria-label",`${c.nm} 의원 소식`);
  const cnt=[V.length?`영상 ${V.length}`:"",N.length?`뉴스 ${N.length}`:""].filter(Boolean).join(" · ");
  d.innerHTML=`<h2 class="news-head">이 의원 소식 <span>${cnt}</span></h2>
  <div class="news-body">
    ${V.length?`<h3 class="nsub">영상</h3><div class="vrow">${V.map(([t,s,dt,id])=>`<div class="vcard"><button class="vth" data-id="${id}" aria-label="${esc(t)} 재생"><img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="play" aria-hidden="true">▶</span></button><b>${esc(t)}</b><small>${esc(s)} · ${dt}</small></div>`).join("")}</div>`:`<p class="nnone">영상: 아직 이 의원의 영상을 모으지 못했어요. 유튜브 하루 조회 한도 때문에 의원을 나눠서 순서대로 채워 가고 있어요.</p>`}
    ${N.length?`<h3 class="nsub">뉴스</h3><ul class="nlist">${N.map(([t,s,dt,u])=>`<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer"><b>${esc(t)}</b><small>${esc(s)} · ${dt}</small></a></li>`).join("")}</ul>`:""}
    <p class="news-foot">"${c.nm} 국회의원"으로 찾은 결과 중 제목에 이름이 들어간 것을 날짜순으로 자동으로 보여 줘요. 저희가 고르거나 평가하지 않아요. 뉴스는 원문으로 이동하고, 영상은 이 화면에서 재생돼요(재생을 누르면 유튜브가 쿠키를 쓸 수 있어요).</p>
  </div>`;
  d.querySelectorAll(".vth").forEach(v=>v.addEventListener("click",()=>{const id=v.dataset.id;v.classList.add("playing");v.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="영상 재생" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;const a=document.createElement("a");a.className="ytopen";a.target="_blank";a.rel="noopener noreferrer";a.href="https://www.youtube.com/watch?v="+id;a.textContent="재생이 안 되면 유튜브에서 보기";v.parentNode.appendChild(a)},{once:true}));
  return d;
}

function zoom(c){
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-label",`${c.nm} 카드 크게 보기`);
  const box=document.createElement("div");box.className="box";const card=cardEl(c);box.appendChild(card);
  const sr=document.createElement("p");sr.className="src";sr.textContent=SRC;box.appendChild(sr);const p=document.createElement("p");p.textContent="카드를 누르면 뒷면, 능력치를 누르면 설명. 바깥을 누르면 닫혀요.";box.appendChild(p);
  box.appendChild(newsBox(c));
  m.appendChild(box);document.body.appendChild(m);requestAnimationFrame(()=>fitRegion(m));card.focus();
  m.addEventListener("click",e=>{if(e.target===m)m.remove()});
  m.addEventListener("keydown",e=>{if(e.key==="Escape")m.remove()});
}


/* ── 바탕 조각무늬 ── */
(function(){
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const cols=7,rows=10,pts=[];
  for(let j=0;j<=rows;j++){pts[j]=[];for(let i=0;i<=cols;i++){const x=i/cols*100+(i&&i<cols?(rnd()-.5)*10:0),y=j/rows*148+(j&&j<rows?(rnd()-.5)*10:0);pts[j][i]=[x.toFixed(1),y.toFixed(1)]}}
  let polys="";
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const a=pts[j][i],b=pts[j][i+1],c=pts[j+1][i],d=pts[j+1][i+1];
    const t1=rnd()<.5?[a,b,d]:[a,b,c],t2=t1.includes(c)?[b,d,c]:[a,d,c];
    for(const t of [t1,t2]){const w=rnd()<.55;const o=(w?.02+rnd()*.09:.03+rnd()*.12).toFixed(3);polys+=`<polygon points='${t.map(q=>q.join(",")).join(" ")}' fill='${w?"#fff":"#000"}' fill-opacity='${o}'/>`}
  }
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 148' preserveAspectRatio='none'>${polys}</svg>`;
  document.documentElement.style.setProperty("--shards",`url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") center/100% 100% no-repeat`);
})();

/* ── 캔버스 공통 ── */
function sizeCv(cv){const r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.max(1,Math.round(r.width*dpr));cv.height=Math.max(1,Math.round(r.height*dpr));const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);return [r.width,r.height,dpr]}
function rng(seed){return()=>(seed=(seed*16807)%2147483647)/2147483647}
const noiseCv=(()=>{const c=document.createElement("canvas");c.width=c.height=200;const x=c.getContext("2d");const d=x.createImageData(200,200);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);return c})();

/* ── 밤 의사당 배경 ── */
const hallCv=document.getElementById("hallCv");
function drawHall(){
  const [W,H,dpr]=sizeCv(hallCv);const g=hallCv.getContext("2d");const R=rng(11);
  const hz=H*.8;
  let sg=g.createLinearGradient(0,0,0,H);
  sg.addColorStop(0,"#02040b");sg.addColorStop(.42,"#0a1230");sg.addColorStop(.66,"#1a1d3f");sg.addColorStop(.78,"#3b2a3c");sg.addColorStop(.8,"#20182a");sg.addColorStop(1,"#07070d");
  g.fillStyle=sg;g.fillRect(0,0,W,H);
  for(let i=0;i<160;i++){const x=R()*W,y=R()*hz*.6,a=R()*.6+.1,s=R()<.08?1.4:.7;g.fillStyle=`rgba(220,228,255,${a})`;g.beginPath();g.arc(x,y,s,0,7);g.fill()}
  g.save();g.filter="blur(28px)";for(let i=0;i<7;i++){g.fillStyle=`rgba(110,120,190,${.05+R()*.05})`;g.beginPath();g.ellipse(R()*W,H*(.15+R()*.4),120+R()*220,22+R()*30,0,0,7);g.fill()}g.restore();
  let cg=g.createRadialGradient(W/2,hz,10,W/2,hz,W*.7);cg.addColorStop(0,"rgba(255,170,90,.28)");cg.addColorStop(.4,"rgba(200,110,90,.10)");cg.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=cg;g.fillRect(0,0,W,H);
  // 먼 도시
  for(let x=0;x<W;){const w=14+R()*40,h=8+R()*(R()<.15?70:34);g.fillStyle="#090b17";g.fillRect(x,hz-h,w,h);
    for(let wy=hz-h+4;wy<hz-3;wy+=5)for(let wx=x+3;wx<x+w-3;wx+=5)if(R()<.18){g.fillStyle=`rgba(255,${190+R()*40|0},120,${.25+R()*.5})`;g.fillRect(wx,wy,1.6,1.6)}
    x+=w+R()*6}
  // 의사당
  const bw=Math.min(W*.82,H*1.55),bx=(W-bw)/2,cx=W/2;
  const stepH=bw*.009,steps=5,stepsH=stepH*steps,ch=bw*.17,eh=bw*.036,ah=bw*.022;
  const colTop=hz-stepsH-ch,entTop=colTop-eh,atTop=entTop-ah;
  // 계단
  for(let i=0;i<steps;i++){const y=hz-stepH*(i+1),ex=bw*.03*(steps-i)/steps;let gg=g.createLinearGradient(0,y,0,y+stepH);gg.addColorStop(0,"#d9cdb5");gg.addColorStop(1,"#6f6656");g.fillStyle=gg;g.fillRect(bx-ex,y,bw+ex*2,stepH);g.fillStyle="rgba(0,0,0,.35)";g.fillRect(bx-ex,y+stepH-1,bw+ex*2,1)}
  // 뒷벽과 창
  let wg=g.createLinearGradient(0,colTop,0,hz-stepsH);wg.addColorStop(0,"#1a1712");wg.addColorStop(1,"#2e281f");g.fillStyle=wg;g.fillRect(bx+bw*.02,colTop,bw*.96,ch);
  for(let row=0;row<4;row++)for(let i=0;i<46;i++){const x=bx+bw*.035+i*(bw*.93/46),y=colTop+ch*.12+row*ch*.21;const lit=R()<.72;g.fillStyle=lit?`rgba(255,${200+R()*30|0},${120+R()*40|0},${.55+R()*.4})`:"rgba(40,36,30,.9)";g.fillRect(x,y,bw*.011,ch*.12)}
  g.save();g.globalCompositeOperation="lighter";g.filter="blur(6px)";g.fillStyle="rgba(255,180,90,.18)";g.fillRect(bx+bw*.03,colTop+ch*.08,bw*.94,ch*.84);g.restore();
  // 기둥 24개
  const n=24,cw=bw*.017,span=bw*.94,gap=span/(n-1);
  for(let i=0;i<n;i++){const x=bx+bw*.03+i*gap-cw/2;
    let vg=g.createLinearGradient(0,colTop,0,hz-stepsH);vg.addColorStop(0,"#8f8673");vg.addColorStop(.55,"#d8ccb2");vg.addColorStop(1,"#fff0d0");
    g.fillStyle=vg;g.fillRect(x,colTop,cw,ch);
    let hgr=g.createLinearGradient(x,0,x+cw,0);hgr.addColorStop(0,"rgba(255,255,255,.18)");hgr.addColorStop(.45,"rgba(0,0,0,0)");hgr.addColorStop(1,"rgba(0,0,0,.45)");g.fillStyle=hgr;g.fillRect(x,colTop,cw,ch);
    g.fillStyle="rgba(255,240,210,.7)";g.fillRect(x-cw*.25,colTop,cw*1.5,ch*.025);g.fillRect(x-cw*.2,hz-stepsH-ch*.025,cw*1.4,ch*.025);
  }
  // 엔타블러처·다락
  let eg=g.createLinearGradient(0,entTop,0,colTop);eg.addColorStop(0,"#8c836f");eg.addColorStop(1,"#e2d6bc");g.fillStyle=eg;g.fillRect(bx-bw*.005,entTop,bw*1.01,eh);
  g.fillStyle="rgba(0,0,0,.25)";for(let k=1;k<4;k++)g.fillRect(bx-bw*.005,entTop+eh*k/4,bw*1.01,1);
  let ag=g.createLinearGradient(0,atTop,0,entTop);ag.addColorStop(0,"#4a453b");ag.addColorStop(1,"#77705f");g.fillStyle=ag;g.fillRect(bx+bw*.04,atTop,bw*.92,ah);
  // 돔
  const dw=bw*.44,dh=dw*.27,drH=bw*.03,drTop=atTop-drH;
  let dg2=g.createLinearGradient(0,drTop,0,atTop);dg2.addColorStop(0,"#5e594d");dg2.addColorStop(1,"#a49a83");g.fillStyle=dg2;g.fillRect(cx-dw*.46,drTop,dw*.92,drH);
  g.save();g.beginPath();g.ellipse(cx,drTop,dw/2,dh,0,Math.PI,2*Math.PI);g.closePath();g.clip();
  let dom=g.createRadialGradient(cx-dw*.18,drTop-dh*.75,dw*.02,cx,drTop,dw*.62);dom.addColorStop(0,"#b9cfc5");dom.addColorStop(.35,"#7e9b90");dom.addColorStop(.75,"#3f564f");dom.addColorStop(1,"#1d2926");
  g.fillStyle=dom;g.fillRect(cx-dw/2,drTop-dh,dw,dh);
  g.strokeStyle="rgba(10,20,18,.35)";g.lineWidth=1;for(let k=-8;k<=8;k++){g.beginPath();g.moveTo(cx+k*dw/17,drTop);g.quadraticCurveTo(cx+k*dw/40,drTop-dh*.9,cx,drTop-dh);g.stroke()}
  for(let k=1;k<4;k++){g.beginPath();g.ellipse(cx,drTop,dw/2*(1-k*.2),dh*(1-k*.2),0,Math.PI,2*Math.PI);g.strokeStyle="rgba(200,230,220,.08)";g.stroke()}
  let up=g.createLinearGradient(0,drTop,0,drTop-dh);up.addColorStop(0,"rgba(255,200,140,.35)");up.addColorStop(.6,"rgba(255,200,140,0)");g.globalCompositeOperation="lighter";g.fillStyle=up;g.fillRect(cx-dw/2,drTop-dh,dw,dh);g.globalCompositeOperation="source-over";
  g.restore();
  g.fillStyle="#c9d9cf";g.fillRect(cx-dw*.02,drTop-dh-dw*.035,dw*.04,dw*.035);
  // 투광 조명
  g.save();g.globalCompositeOperation="lighter";
  for(let i=0;i<9;i++){const x=bx+bw*(.06+i*.11);let lg=g.createRadialGradient(x,hz-stepsH,2,x,hz-stepsH-ch*.5,ch*1.1);lg.addColorStop(0,"rgba(255,215,160,.28)");lg.addColorStop(1,"rgba(255,215,160,0)");g.fillStyle=lg;g.fillRect(x-ch,colTop-ch*.6,ch*2,ch*1.8)}
  let dl=g.createRadialGradient(cx,drTop,4,cx,drTop-dh*.4,dw*.7);dl.addColorStop(0,"rgba(255,220,170,.16)");dl.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=dl;g.fillRect(cx-dw,drTop-dh*2,dw*2,dh*3);
  g.restore();
  // 나무
  const tree=(x0,x1,base,ht)=>{for(let i=0;i<70;i++){const x=x0+R()*(x1-x0),y=base-R()*ht,rr=8+R()*22;g.fillStyle=`rgba(${4+R()*6|0},${7+R()*8|0},${12+R()*10|0},.96)`;g.beginPath();g.arc(x,y,rr,0,7);g.fill()}};
  g.save();g.filter="blur(2px)";for(const [a,b2] of [[-20,bx+bw*.02],[bx+bw*.98,W+20]]){for(let i=0;i<40;i++){const x=a+R()*(b2-a),y=hz-R()*ch*.35,rr=6+R()*12;g.fillStyle="rgba(6,9,16,.9)";g.beginPath();g.arc(x,y,rr,0,7);g.fill()}}g.restore();
  // 젖은 바닥 반사
  const tmp=document.createElement("canvas");tmp.width=hallCv.width;tmp.height=Math.round(hz*dpr);tmp.getContext("2d").drawImage(hallCv,0,0);
  g.fillStyle="#06070d";g.fillRect(0,hz,W,H-hz);
  g.save();g.translate(0,hz*2);g.scale(1,-1);g.globalAlpha=.32;g.filter="blur(3px)";g.drawImage(tmp,0,0,tmp.width,tmp.height,0,0,W,hz);g.restore();
  let fg=g.createLinearGradient(0,hz,0,H);fg.addColorStop(0,"rgba(6,7,13,.25)");fg.addColorStop(1,"rgba(6,7,13,.95)");g.fillStyle=fg;g.fillRect(0,hz,W,H-hz);
  g.globalAlpha=.05;g.globalCompositeOperation="overlay";g.fillStyle=g.createPattern(noiseCv,"repeat");g.fillRect(0,0,W,H);g.globalAlpha=1;g.globalCompositeOperation="source-over";
}

/* ── 벨벳 커튼 ── */
const curCv=document.getElementById("curtainCv");let CW=0,CH=0,cP=0,cRaf=0,cOpening=false;
const noisePat=curCv.getContext("2d").createPattern(noiseCv,"repeat");
function tassel(g,x,y,s){
  g.save();g.translate(x,y);g.scale(s,s);
  g.strokeStyle="#c79a3c";g.lineWidth=3;g.beginPath();g.moveTo(0,-34);g.bezierCurveTo(-10,-20,10,-12,0,0);g.stroke();
  for(let i=-9;i<=9;i++){const t=i/9;g.strokeStyle=i%3===0?"#fff0b8":i%2?"#b8892e":"#e7c066";g.lineWidth=1.3;g.beginPath();g.moveTo(t*5,10);g.quadraticCurveTo(t*9,28,t*11,46);g.stroke()}
  let hg=g.createRadialGradient(-3,2,1,0,4,11);hg.addColorStop(0,"#fff3c4");hg.addColorStop(.5,"#d8ab4b");hg.addColorStop(1,"#6a4a12");g.fillStyle=hg;g.beginPath();g.ellipse(0,5,7,9,0,0,7);g.fill();
  g.fillStyle="#9b7424";g.fillRect(-6,12,12,2.5);
  g.restore();
}
/* 커튼에 은은하게 새긴 타이틀: 화면 크기마다 한 번 그려 두고, 커튼 반쪽마다 접히는 폭에 맞춰 붙임 */
const titleCv=document.createElement("canvas");let titleDpr=1;
function buildTitle(){
  const dpr=Math.min(devicePixelRatio||1,2);titleDpr=dpr;titleCv.width=Math.max(1,Math.round(CW*dpr));titleCv.height=Math.max(1,Math.round(CH*dpr));
  const g=titleCv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,CW,CH);
  const fam=getComputedStyle(document.documentElement).getPropertyValue("--display");
  const fs=Math.min(88,CW*.085,CH*.13),ss0=Math.max(11,fs*.2),cy=Math.min(CH*.3,CH/2-40-fs*.9-ss0*1.8);
  g.textAlign="center";g.textBaseline="middle";
  g.font=`900 ${fs}px ${fam}`;
  /* 글자 사이를 띄워서 커튼 가운데 이음새가 "국회의원"과 "카드뽑기" 사이에 오게 */
  const L="국회의원",R="카드뽑기",gap=fs*.45;
  const gold=g.createLinearGradient(0,cy-fs/2,0,cy+fs/2);gold.addColorStop(0,"#fff1c2");gold.addColorStop(.45,"#d9b25c");gold.addColorStop(1,"#8a6620");
  for(const [txt,x] of [[L,CW/2-gap/2-g.measureText(L).width/2],[R,CW/2+gap/2+g.measureText(R).width/2]]){
    g.lineWidth=Math.max(1,fs*.035);g.strokeStyle="rgba(255,236,180,.55)";g.strokeText(txt,x,cy);
    g.fillStyle=gold;g.fillText(txt,x,cy);
  }
  /* 위아래 가는 금줄과 작은 글씨 */
  const lw=Math.min(CW*.7,(g.measureText(L).width+g.measureText(R).width+gap)*1.08);
  g.fillStyle="rgba(217,178,92,.9)";
  g.fillRect(CW/2-lw/2,cy-fs*.82,lw,Math.max(1,fs*.025));g.fillRect(CW/2-lw/2,cy+fs*.78,lw,Math.max(1,fs*.025));
  const ss=Math.max(11,fs*.2);g.font=`700 ${ss}px ${fam}`;g.fillStyle="#e7c97a";
  g.fillText("제22대 국회 · 의원 299명",CW/2,cy+fs*.78+ss*1.3);
}
function drawCurtain(p,t){
  const g=curCv.getContext("2d");g.clearRect(0,0,CW,CH);
  const half=CW/2,rest=Math.min(half*.15,Math.max(26,CW*.07)),valH=Math.max(50,Math.min(84,CH*.13));
  const folds=Math.max(6,Math.round(half/52));
  for(const side of [0,1]){
    const w=half-(half-rest)*p+(p<.01?1:0),x0=side===0?0:CW-w;
    for(let i=0;i<Math.ceil(w);i++){
      const u=i/w,ph=u*folds*Math.PI*2+(side?1.7:.2)+Math.sin(t*.0006+u*4)*.18*(1-p);
      const light=.5+.5*Math.cos(ph-.7),sheen=Math.pow(Math.abs(Math.sin(ph)),12)*.6;
      const inner=side===0?u:1-u,pool=.7+.45*Math.pow(inner,3)*(1-p*.6),comp=1-p*.25;
      const k=light*pool*comp;
      g.fillStyle=`rgb(${10+44*k+60*sheen|0},${9+34*k+50*sheen|0},${14+44*k+64*sheen|0})`;
      g.fillRect(x0+i,0,1.3,CH);
    }
    let vg=g.createLinearGradient(0,0,0,CH);vg.addColorStop(0,"rgba(0,0,0,.75)");vg.addColorStop(.2,"rgba(0,0,0,.1)");vg.addColorStop(.55,"rgba(0,0,0,.05)");vg.addColorStop(1,"rgba(0,0,0,.72)");g.fillStyle=vg;g.fillRect(x0,0,w,CH);
    if(titleCv.width>1){g.save();g.globalCompositeOperation="screen";g.globalAlpha=.36;
      g.drawImage(titleCv,side*half*titleDpr,0,half*titleDpr,CH*titleDpr,x0,0,w,CH);g.restore()}
    g.save();g.globalAlpha=.035;g.globalCompositeOperation="overlay";g.fillStyle=noisePat;g.fillRect(x0,0,w,CH);g.restore();
    const ex=side===0?x0+w:x0;
    let sh=g.createLinearGradient(ex,0,ex+(side===0?1:-1)*40,0);sh.addColorStop(0,"rgba(0,0,0,.55)");sh.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=sh;g.fillRect(side===0?ex:ex-40,0,40,CH);
    g.fillStyle="rgba(255,225,170,.18)";g.fillRect(side===0?ex-1.5:ex,0,1.5,CH);
    const hemY=CH-24;
    let hg=g.createLinearGradient(0,hemY,0,hemY+8);hg.addColorStop(0,"#5c4111");hg.addColorStop(.45,"#f8de92");hg.addColorStop(1,"#6e4f15");g.fillStyle=hg;g.fillRect(x0,hemY,w,8);
    for(let x=x0;x<x0+w;x+=2.3){const sw=Math.sin(t*.003+x*.07)*(cOpening?2.5:.8);g.strokeStyle=(Math.round(x/2.3)%3===0)?"rgba(255,236,170,.95)":"rgba(176,128,44,.95)";g.lineWidth=1.1;g.beginPath();g.moveTo(x,hemY+8);g.lineTo(x+sw,CH);g.stroke()}
    if(p>.2)tassel(g,ex+(side===0?-6:6),CH*.56,Math.min(1,(p-.2)*2)*(CW<500?.7:1));
  }
  // 상단 장식 커튼
  const sw=Math.max(110,Math.min(170,CW/7)),cnt=Math.ceil(CW/sw);
  g.fillStyle="#0b0a0f";g.fillRect(0,0,CW,valH*.35);
  for(let k=0;k<cnt;k++){
    const xa=k*sw,xb=xa+sw,m=(xa+xb)/2,dip=valH*1.15,side=valH*.42;
    g.save();g.beginPath();g.moveTo(xa,0);g.lineTo(xb,0);g.lineTo(xb,side);g.quadraticCurveTo(m,dip,xa,side);g.closePath();
    let rg=g.createRadialGradient(m,valH*.25,4,m,valH*.5,sw*.75);rg.addColorStop(0,"#3a3442");rg.addColorStop(.5,"#1b1820");rg.addColorStop(1,"#08070b");g.fillStyle=rg;g.fill();g.clip();
    for(let j=1;j<6;j++){g.strokeStyle=`rgba(255,255,255,${.035+j*.006})`;g.lineWidth=2;g.beginPath();g.moveTo(xa,side*j/6);g.quadraticCurveTo(m,dip*j/6.2+valH*.1,xb,side*j/6);g.stroke();g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=3;g.beginPath();g.moveTo(xa,side*j/6+3);g.quadraticCurveTo(m,dip*j/6.2+valH*.1+3,xb,side*j/6+3);g.stroke()}
    g.restore();
    let tg=g.createLinearGradient(0,side,0,dip*.6);tg.addColorStop(0,"#f6d98a");tg.addColorStop(1,"#8a6620");g.strokeStyle=tg;g.lineWidth=3.5;g.beginPath();g.moveTo(xa,side);g.quadraticCurveTo(m,dip,xb,side);g.stroke();
    for(let q=0;q<=1;q+=.02){const x=(1-q)*(1-q)*xa+2*(1-q)*q*m+q*q*xb,y=(1-q)*(1-q)*side+2*(1-q)*q*dip+q*q*side;g.strokeStyle=Math.round(q*50)%2?"rgba(196,150,60,.9)":"rgba(255,232,160,.9)";g.lineWidth=1;g.beginPath();g.moveTo(x,y+1);g.lineTo(x+Math.sin(t*.003+q*9)*.6,y+9);g.stroke()}
    if(k>0)tassel(g,xa,side+18,CW<500?.45:.6);
  }
  let rod=g.createLinearGradient(0,0,0,7);rod.addColorStop(0,"#fff0b8");rod.addColorStop(.5,"#c3962f");rod.addColorStop(1,"#5c4111");g.fillStyle=rod;g.fillRect(0,0,CW,6);
}
function curtainLoop(){
  const now=performance.now();
  if(cOpening){const k=Math.min(1,(now-cStart)/1700);cP=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;if(k>=1)cOpening=false}
  drawCurtain(cP,now);
  if(cOpening||(cP<1&&!reduce))cRaf=requestAnimationFrame(curtainLoop);
}
let cStart=0;
function resizeCurtain(){[CW,CH]=sizeCv(curCv);buildTitle();drawCurtain(cP,performance.now())}
document.fonts&&document.fonts.ready.then(()=>{buildTitle();drawCurtain(cP,performance.now())});
function openCurtain(){cancelAnimationFrame(cRaf);if(reduce){cP=1;drawCurtain(1,0);return}cOpening=true;cStart=performance.now();curtainLoop()}
function closeCurtain(){cancelAnimationFrame(cRaf);cOpening=false;cP=0;drawCurtain(0,performance.now());if(!reduce)curtainLoop()}


const PARTIES=[["더불어민주당","#152484",.52],["국민의힘","#E61E2B",.33],["조국혁신당","#0A2F78",.05],["개혁신당","#FF7210",.04],["진보당","#D6001C",.03],["기본소득당","#00B8A9",.01],["사회민주당","#F58220",.01],["무소속","#6B6F76",.03]];
const SIDO_ORDER=["서울","부산","대구","인천","대전","울산","세종특별자치시","경기","강원","충북","충남","전북","전남광주통합특별시","경북","경남","제주"];
const sidoShort=s=>({"전남광주통합특별시":"전남광주","세종특별자치시":"세종"})[s]||s;
const COMMITTEES=["법제사법위원회","행정안전위원회","보건복지위원회","교육위원회","국토교통위원회","산업통상자원중소벤처기업위원회","환경노동위원회","기획재정위원회"];
const BILLS=["도로교통법 일부개정법률안","지방자치법 일부개정법률안","청년기본법 일부개정법률안","주택법 일부개정법률안","재난안전법 일부개정법률안","소프트웨어 진흥법 일부개정법률안","농어업재해보험법 일부개정법률안","항만법 일부개정법률안"];
const MEM=MD.map((r,i)=>({id:i,code:r.c,nm:r.nm,party:r.party,color:(PARTIES.find(p=>p[0]===r.party)||PARTIES[PARTIES.length-1])[1],terms:r.terms,sido:r.sido,dist:r.dist,units:r.units,cmit:r.cmit,bills:r.bills.length?r.bills:["대표발의한 법안이 없어요"],s:r.s,v:r.v,photo:r.photo}));
const byName=n=>MEM.find(m=>m.nm===n).id;
const SORTED=MEM.slice().sort((a,b)=>a.nm.localeCompare(b.nm,"ko"));
const NUM={};SORTED.forEach((m,i)=>NUM[m.id]=i+1);
const FIRST=["우원식","김병기","이소희","손솔","김남국","강경숙"].map(byName),LAST=["이춘석","윤용근"].map(byName);
const ORDER=(()=>{const R=rng(77);const mid=MEM.map(m=>m.id).filter(i=>!FIRST.includes(i)&&!LAST.includes(i));
  for(let i=mid.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[mid[i],mid[j]]=[mid[j],mid[i]]}
  return [...FIRST,...mid,...LAST]})();
const STATES={A:{n:0,seen:[]},B:{n:24,seen:[byName("윤용근"),...ORDER.slice(24,29)]},C:{n:290,seen:[byName("윤용근"),ORDER[290],ORDER[291]]}};
const SIL='<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="18" fill="rgba(255,255,255,.3)"/><path d="M12 100c2-24 18-34 38-34s36 10 38 34z" fill="rgba(255,255,255,.22)"/></svg>';
const dx={st:"B",col:new Set(),seen:new Set(),f:"all",party:"",tier:"",sido:""};
const statusOf=m=>dx.col.has(m.id)?"own":dx.seen.has(m.id)?"seen":"none";
function tile(m){
  const s=statusOf(m),no=String(NUM[m.id]).padStart(3,"0");
  if(s==="none")return `<button class="mt empty" data-id="${m.id}" aria-label="도감 ${no}번, ${m.sido||"비례대표"}, 아직 못 뽑은 칸"><span class="fr"></span><span class="bd"></span><span class="rg">${m.sido?sidoShort(m.sido):"비례"}</span><span class="q" aria-hidden="true">?</span><span class="no">No.${no}</span></button>`;
  return `<button class="mt ct ${s}" data-id="${m.id}" aria-label="${m.nm}, ${m.party}, ${tierName(m.terms)}, ${s==="own"?"도감에 있음":"열람"}"><span class="card ${tierClass(m.terms)}" aria-hidden="true"><span class="tilt"><span class="face front-face">${front(m)}</span></span></span><span class="no">No.${no}</span>${s==="seen"?'<span class="sn">열람</span>':""}</button>`;
  return `<button class="mt ${tierClass(m.terms)} ${s}${inkDark(m.color)?" ink-dark":""}" style="--pc:${m.color}" data-id="${m.id}" aria-label="${m.nm}, ${m.party}, ${tierName(m.terms)}, ${s==="own"?"도감에 있음":"열람"}"><span class="fr"></span><span class="bd"></span><span class="tr">${tierName(m.terms)}</span><span class="rg">${m.sido?sidoShort(m.sido):"비례"}</span><span class="ph">${m.photo?`<img src="${m.photo}" alt="">`:SIL}</span><span class="nm">${m.nm}</span><span class="pt">${m.party}</span><span class="no">No.${no}</span>${s==="seen"?'<span class="sn">열람</span>':""}</button>`;
}
function renderDex(){
  const n=dx.col.size,sn=[...dx.seen].filter(i=>!dx.col.has(i)).length,none=299-n-sn;
  $("dexN").textContent=n;if($("spDexN"))$("spDexN").textContent=n;$("dexBar").style.width=(n/299*100)+"%";
  const tc=[0,0,0,0];dx.col.forEach(i=>tc[Math.min(MEM[i].terms,4)-1]++);
  $("dexTiers").textContent=n?`초선 ${tc[0]} · 재선 ${tc[1]} · 3선 ${tc[2]} · 4선 이상 ${tc[3]}`:"첫 팩을 열면 여기에 카드가 쌓여요.";
  $("dexLeft").textContent=n?`${299-n}명 남음`:"";
  const cnt={all:299,own:n,seen:sn,none};
  document.querySelectorAll("#dexChips .chip").forEach(b=>{b.setAttribute("aria-pressed",String(b.dataset.f===dx.f));b.querySelector("small").textContent=cnt[b.dataset.f]});
  [["dexParty","party"],["dexTier","tier"],["dexSido","sido"]].forEach(([id,k])=>$(id).classList.toggle("on",!!dx[k]));
  const attr=dx.party||dx.tier||dx.sido;
  const list=SORTED.filter(m=>{
    const s=statusOf(m);
    if(dx.f!=="all"&&s!==dx.f)return false;
    if(attr){
      if(s==="none"&&(dx.party||dx.tier))return false;
      if(dx.party&&m.party!==dx.party)return false;
      if(dx.tier&&(dx.tier==="4"?m.terms<4:m.terms!==+dx.tier))return false;
      if(dx.sido&&(dx.sido==="비례대표"?m.sido!=="":m.sido!==dx.sido))return false;
    }
    return true;
  });
  $("dexCnt").textContent=attr?`조건에 맞는 칸 ${list.length}개${dx.party||dx.tier?" · 못 뽑은 칸은 정당·선수를 몰라 빠져요":""}`:`보이는 칸 ${list.length}`;
  let msg="";
  if(!list.length){
    msg=dx.f==="none"&&(dx.party||dx.tier)?"못 뽑은 칸은 정당·선수를 몰라서 거를 수 없어요. 지역으로만 거를 수 있어요.":
      attr?"조건에 맞는 카드가 아직 없어요.":
      dx.f==="own"?"아직 모은 카드가 없어요. 오늘의 팩을 열어 보세요.":
      dx.f==="seen"?"국회의원 찾기로 본 카드가 여기에 모여요.":"모든 칸을 채웠어요.";
  }
  $("dexGrid").innerHTML=msg?`<p class="empty-msg" style="grid-column:1/-1">${msg}</p>`:list.map(tile).join("");
}
/* 내 의원 찾기 */
const fd={mode:"region",sido:"서울",unit:"강남구",q:""};
const unitsOf=s=>[...new Set(MEM.filter(m=>m.sido===s).flatMap(m=>m.units))].sort((a,b)=>a.localeCompare(b,"ko"));
function rowHtml(m){
  const s=statusOf(m);
  return `<li><button class="row" data-id="${m.id}"><span class="av ${tierClass(m.terms)}" style="--pc:${m.color}"><i>${m.photo?`<img src="${m.photo}" alt="">`:SIL}</i></span><span class="rm"><span class="l1"><b>${m.nm}</b>${s==="own"?'<span class="badge own">내 도감에 있음</span>':s==="seen"?'<span class="badge seen">열람</span>':""}</span><span class="meta">${m.party} · ${tierName(m.terms)}</span><span class="meta">${m.sido?(m.dist.startsWith(m.sido)?m.dist:sidoShort(m.sido)+" "+m.dist):"비례대표"}</span></span><span class="go" aria-hidden="true">›</span></button></li>`;
}
function renderFind(){
  $("fdSeg").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.m===fd.mode)));
  $("fdRegion").hidden=fd.mode!=="region";$("fdNameBox").hidden=fd.mode!=="name";
  let list=[],head="",foot="";const LIM=20;
  if(fd.mode==="region"){
    const bi=fd.sido==="비례대표";
    $("fdUnit").disabled=bi;
    if(!bi)$("fdUnit").innerHTML=unitsOf(fd.sido).map(u=>`<option${u===fd.unit?" selected":""}>${u}</option>`).join("");
    else $("fdUnit").innerHTML="<option>해당 없음</option>";
    list=bi?SORTED.filter(m=>!m.sido):MEM.filter(m=>m.sido===fd.sido&&m.units.includes(fd.unit)).sort((a,b)=>a.dist.localeCompare(b.dist,"ko"));
    head=bi?`비례대표 의원 ${list.length}명 · 지역이 없어서 이름으로 찾는 게 빨라요`:`${sidoShort(fd.sido)}${fd.unit&&fd.unit!==fd.sido?" "+fd.unit:""} · 선거구 ${list.length}곳`;
    if(!bi&&list.some(m=>m.units.length>1))foot="여러 지역이 한 선거구로 묶인 곳은 묶음 이름 그대로 보여요.";
  }else{
    const q=fd.q.trim();
    if(!q){$("fdList").innerHTML='<li class="hintbox">이름 한 글자만 써도 찾아요. 예: ‘우원’, ‘김’<br>22대 국회의원 299명 안에서 찾아요.</li>';$("fdHead").textContent="";$("fdFoot").textContent="";return}
    list=SORTED.filter(m=>m.nm.includes(q));head=`‘${q}’ 검색 결과 ${list.length}명`;
  }
  const shown=list.slice(0,LIM);
  if(list.length>LIM)foot=`${list.length-LIM}명은 아직 안 보여요. ${fd.mode==="region"?"위의 ‘이름으로’ 탭에서 이름을 써서 찾아 주세요.":"이름을 더 써 주세요."}`;
  $("fdHead").textContent=head;
  $("fdList").innerHTML=shown.length?shown.map(rowHtml).join(""):'<li class="hintbox">찾는 의원이 없어요. 22대 국회의원(299명)만 찾을 수 있어요. 글자를 다시 확인해 주세요.</li>';
  $("fdFoot").textContent=foot;
}
function initFind(){
  const sidos=[...SIDO_ORDER,"비례대표"];
  $("fdSido").innerHTML=sidos.map(s=>`<option value="${s}"${s===fd.sido?" selected":""}>${sidoShort(s)}</option>`).join("");
  $("fdSido").addEventListener("change",e=>{fd.sido=e.target.value;fd.unit=fd.sido==="비례대표"?"":unitsOf(fd.sido)[0];renderFind()});
  $("fdUnit").addEventListener("change",e=>{fd.unit=e.target.value;renderFind()});
  $("fdName").addEventListener("input",e=>{fd.q=e.target.value;renderFind()});
  $("fdSeg").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{fd.mode=b.dataset.m;renderFind()}));
  $("fdList").addEventListener("click",e=>{const t=e.target.closest(".row");if(!t)return;const m=MEM[+t.dataset.id];
    if(!dx.col.has(m.id)&&!dx.seen.has(m.id)){addSeen(m.id);toast("열람했어요. 도감 숫자에는 세지 않아요.")}
    renderAll();zoom(m)});
}

/* ═══ 저장 상태 · 팩 규칙 ═══ */
const KEY="gukhoe-cardpack-v1";
const curSlot=()=>Math.floor((Date.now()+9*36e5)/(6*36e5)); /* 한국 시간 6시간 단위 번호 */
function freshS(){return {v:1,col:[],seen:[],sp:[],welcome:3,charged:0,slot:curSlot(),opens:0,noteShown:false,setsDone:[],spHigh:false,pack:null}}
let S=null;try{S=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
if(!S||S.v!==1)S=freshS();
function saveS(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function syncDx(){dx.col=new Set(S.col);dx.seen=new Set(S.seen.filter(i=>!dx.col.has(i)))}
function addSeen(id){if(!S.col.includes(id)&&!S.seen.includes(id)){S.seen.push(id);saveS();syncDx()}}
const packsLeft=()=>S.inf?99:S.welcome+S.charged+(S.bonus||0);
function updateCharge(){const c=curSlot();if(S.slot<c){if(S.charged<1)S.charged=1;S.slot=c;saveS();return true}return false}
const pk={mode:"ready",last:null,newSets:[]};
const rate=()=>S.spHigh?1:.1;
const itemCard=it=>it.k==="s"?PRES[it.i]:MEM[it.id];
function drawPack(){
  const have=new Set(S.col);
  const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const pool=shuf(MEM.map(m=>m.id).filter(i=>!have.has(i)));
  const spLeft=shuf(PRES.map(p=>p.i).filter(i=>!S.sp.includes(i)));
  const n=Math.min(3,pool.length+spLeft.length);
  const kinds=[];for(let i=0;i<n;i++)kinds.push(Math.random()<rate()?"s":"m");
  if(S.opens===0&&n&&spLeft.length&&!kinds.includes("s"))kinds[Math.floor(Math.random()*n)]="s"; /* 처음 여는 팩에는 스페셜 1장 */
  let ns=kinds.filter(k=>k==="s").length,nm=n-ns;
  while(ns>spLeft.length){kinds[kinds.indexOf("s")]="m";ns--;nm++}
  while(nm>pool.length){kinds[kinds.indexOf("m")]="s";nm--;ns++}
  const items=kinds.map(k=>k==="s"?{k:"s",i:spLeft.pop()}:{k:"m",id:pool.pop()});
  S.opens++;
  return {items,done:items.map(()=>false)};
}

/* ═══ 시·도 세트 ═══ */
const setKey=m=>m.sido||"비례대표";
const SET_TOT={};MEM.forEach(m=>{const k=setKey(m);SET_TOT[k]=(SET_TOT[k]||0)+1});
const SET_KEYS=[...SIDO_ORDER,"비례대표"].filter(k=>SET_TOT[k]);
const setHave=k=>S.col.filter(i=>setKey(MEM[i])===k).length;
function renderSets(){
  let done=0;
  $("setGrid").innerHTML=SET_KEYS.map(k=>{const t=SET_TOT[k],h=setHave(k),d=h===t;if(d)done++;
    return `<button class="setbtn${d?" done":""}" data-k="${k}"><b>${sidoShort(k)}</b><small>${d?"완성 ★ ":""}${h} / ${t}</small><span class="bar"><i style="width:${h/t*100}%"></i></span></button>`}).join("");
  $("setSum").textContent=`${done} / ${SET_KEYS.length} 완성`;
}

/* ═══ 스페셜 카드 ═══ */
const ELEC=[["1948 국회 간선","91.8%","김구 6.6%",1],["1960.8 국회 간선","79.1%","김창숙 11.0%",1],["1963 대선","46.6%","윤보선 45.1%"],["1979 통일주체국민회의 간선","96.3%","",1],["1980 통일주체국민회의 간선","99.4%","",1],["1987 대선","36.6%","김영삼 28.0%"],["1992 대선","42.0%","김대중 33.8%"],["1997 대선","40.3%","이회창 38.7%"],["2002 대선","48.9%","이회창 46.6%"],["2007 대선","48.7%","정동영 26.1%"],["2012 대선","51.6%","문재인 48.0%"],["2017 대선","41.1%","홍준표 24.0%"],["2022 대선","48.6%","이재명 47.8%"],["2025 대선","49.4%","김문수 41.2%"]];
const elecHtml=p=>{const e=ELEC[p.i];return `<div class="sp-elec" title="${e[0]}"><span>당선 득표율${e[3]?"(간선)":""}</span><b>${e[1]}</b><i>${e[2]?"· 2위 "+e[2]:"· 단독 후보"}</i></div>`};
function spFront(p,shown){
  if(shown===undefined)shown=p.q;
  const len=p.q.length,cls=len>34?"q3":len>20?"q2":"q1";
  const ap=p.ap?`<div class="sp-appr"><span>임기 평균 지지율</span><b>${p.ap}</b><i>${p.i===13?"한국갤럽 · 현재까지":"한국갤럽 분기 평균"}</i></div>`:"";
  const img=`<img src="${p.photo}" alt="${p.nm} 사진">`;
  return `<div class="shield frame"></div><div class="shield bevel"></div><div class="shield rim"></div><div class="shield hair"></div><div class="shield inner"><div class="sunburst"></div><div class="chev a"></div><div class="chev b"></div><div class="grain"></div></div><div class="shield gloss"></div><div class="shield holo"></div><div class="shield glare"></div>
  <div class="content sp-c">
    <div class="tier"><b>대통령</b><small>스페셜</small><i class="sp-emb" aria-hidden="true"></i></div>
    <div class="photo"><span class="sil">${img}</span><span class="face-ph">${img}</span></div>
    <div class="nameline sp-name"><span class="nm">${p.nm}</span><span class="pt">재임 ${p.yr}</span></div>
    <div class="region sp-region"><span class="dist">${p.dae}</span></div>
    <div class="panel"></div>
    <div class="sp-foot">${elecHtml(p)}${ap}</div>
    <div class="sp-quote ${cls}${p.ap?"":" noap"}"><q>“<span class="q-on">${shown}</span><span class="q-off">${p.q.slice(shown.length)}</span>”</q><small>${p.when} · ${p.kind}</small></div>
  </div>
  <div class="cover"><div class="q" aria-hidden="true">?</div></div>`;
}
function spCardEl(p,mode){
  const el=document.createElement("div");el.className="card t5 sp";el.dataset.m=mode;
  el.setAttribute("aria-label",`${p.nm} 스페셜 카드`);
  el.innerHTML=`<div class="tilt"><div class="face front-face">${spFront(p,mode==="face"?p.q:"")}</div></div>`;
  tiltable(el);return el;
}
function spTile(p,own){
  if(!own)return `<button class="mt empty sp" data-sp="${p.i}" aria-label="스페셜 ${p.no}번, 아직 못 모은 칸"><span class="fr"></span><span class="bd"></span><span class="q" aria-hidden="true">?</span><span class="sq l${p.q.length<=12?1:p.q.length<=24?2:p.q.length<=34?3:4}">“${p.q.split(p.nm).join("○○○")}”</span></button>`;
  return `<button class="mt ct spc t5 sp own" data-yr="재임 ${p.yr}" data-sp="${p.i}" aria-label="${p.nm} 스페셜 카드, 도감에 있음"><span class="sprays" aria-hidden="true"></span><span class="aura" aria-hidden="true"></span><span class="card t5 sp" data-m="face" aria-hidden="true"><span class="tilt"><span class="face front-face">${spFront(p,"").replace(`<span class="dist">${p.dae}</span>`,`<span class="dist">${p.dae} <small class="yr">(${p.yr})</small></span>`)}</span></span></span><span class="spv" aria-hidden="true"><b>${ELEC[p.i][1]}</b><small>당선 득표율${ELEC[p.i][3]?"(간선)":""}</small><i>${ELEC[p.i][2]?"2위 "+ELEC[p.i][2]:"단독 후보"}</i><u class="bars"><em class="b1" style="width:${parseFloat(ELEC[p.i][1])}%"></em>${ELEC[p.i][2]?`<em class="b2" style="width:${parseFloat(ELEC[p.i][2].split(" ").pop())}%"></em>`:""}</u></span><span class="spk s1" aria-hidden="true">✦</span><span class="spk s2" aria-hidden="true">✦</span><span class="spk s3" aria-hidden="true">✧</span></button>`;
}
function renderSp(){
  const n=S.sp.length;$("spN").textContent=n;$("spBar").style.width=(n/14*100)+"%";$("segSp").textContent=`${n} / 14`;
  $("spTiles").innerHTML=PRES.map(p=>spTile(p,S.sp.includes(p.i))).join("");
}
function zoomSp(p){
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-label",`${p.nm} 스페셜 카드 크게 보기`);
  const box=document.createElement("div");box.className="box";box.appendChild(spCardEl(p,"face"));
  const info=document.createElement("p");info.className="sp-info2";
  info.innerHTML=`<b>“${p.q}”</b><br>${p.when} · ${p.kind}<br>${p.ver?"위키백과에서 확인한 말":"널리 알려진 말 · 원문 확인 전"}<br>당선 선거: ${ELEC[p.i][0]} · 득표율 자료: 위키백과(중앙선거관리위원회 자료 기준)<br>${p.cred}${p.ap?"<br>임기 평균 지지율은 한국갤럽 분기별 직무 긍정률의 단순 평균":""}`;
  box.appendChild(info);
  const b=document.createElement("button");b.className="btn ghost";b.textContent="연출 다시 보기";
  b.addEventListener("click",()=>{m.remove();thOpen(p,{label:"닫기"})});box.appendChild(b);
  m.appendChild(box);document.body.appendChild(m);
  m.addEventListener("click",e=>{if(e.target===m)m.remove()});m.addEventListener("keydown",e=>{if(e.key==="Escape")m.remove()});
}
/* 연출 (약 5.6초, 탭하면 건너뛰기): 어두워짐 → 대사가 크게 한 글자씩 → 금빛 광선과 함께 카드 등장 → 번쩍임 한 번 + SPECIAL → 얼굴 공개 */
const thEl=$("theater"),thWrap=$("thWrap"),thHint=$("thHint"),thBtn=$("thBtn"),thGold=$("thGold"),thCredit=$("thCredit"),thQuote=$("thQuote"),thTitle=$("thTitle"),thRays=$("thRays"),thFx=$("thFx"),thCv=$("thCv");
const th={tm:[],iv:0,running:false,p:null,onClose:null,em:0};
function emStart(){
  if(reduceM)return;cancelAnimationFrame(th.em);
  const r=thCv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),W=r.width,H=r.height;
  thCv.width=Math.round(W*dpr);thCv.height=Math.round(H*dpr);const g=thCv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);
  const P=[];
  const loop=()=>{g.clearRect(0,0,W,H);
    if(P.length<80&&Math.random()<.7)P.push({x:Math.random()*W,y:H+8,vy:-(.5+Math.random()*1.4),vx:(Math.random()-.5)*.4,r:.8+Math.random()*2.2,a:.35+Math.random()*.6,ph:Math.random()*6});
    for(let i=P.length-1;i>=0;i--){const q=P[i];q.y+=q.vy;q.x+=q.vx+Math.sin(q.y/30+q.ph)*.3;if(q.y<-10){P.splice(i,1);continue}
      g.globalAlpha=q.a*Math.min(1,q.y/H*1.8);g.fillStyle="#ffd98a";g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill()}
    th.em=requestAnimationFrame(loop)};
  loop();
}
function thBurst(){
  if(reduceM)return;
  const r=thWrap.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.42;
  thFx.innerHTML="";
  [["flash"],["rays"],["ring"]].forEach(([c])=>{const d=document.createElement("div");d.className=c;d.style.left=cx+"px";d.style.top=cy+"px";thFx.appendChild(d)});
  const ring2=document.createElement("div");ring2.className="ring";ring2.style.left=cx+"px";ring2.style.top=cy+"px";ring2.style.animationDelay=".18s";thFx.appendChild(ring2);
  for(let i=0;i<70;i++){
    const d=document.createElement("i");d.className="spark";
    const ang=Math.random()*Math.PI*2,dist=100+Math.random()*Math.max(innerWidth,innerHeight)*.5;
    d.style.left=cx+"px";d.style.top=cy+"px";
    d.style.setProperty("--dx",Math.cos(ang)*dist+"px");d.style.setProperty("--dy",Math.sin(ang)*dist+"px");d.style.setProperty("--rot",(Math.random()*720-360)+"deg");
    d.style.animationDelay=(Math.random()*160)+"ms";d.style.background=i%3===0?"#ffffff":i%3===1?"#f4dc9a":"#d9b25c";
    if(i%4===0){d.style.width="11px";d.style.height="4px"}
    thFx.appendChild(d);
  }
  setTimeout(()=>{thFx.innerHTML=""},2400);
}
function thStop(){th.tm.forEach(clearTimeout);th.tm=[];clearInterval(th.iv);th.running=false}
function thCardQuote(n){const c=thWrap.firstElementChild;if(!c)return;c.querySelector(".q-on").textContent=th.p.q.slice(0,n);c.querySelector(".q-off").textContent=th.p.q.slice(n)}
function thFinish(){
  thStop();const c=thWrap.firstElementChild;if(!c)return;
  thQuote.classList.remove("on");thQuote.classList.add("out");
  thRays.classList.add("on");thWrap.classList.add("on");thTitle.classList.add("on");
  c.dataset.m="face";thCardQuote(th.p.q.length);
  thHint.textContent=`${th.p.nm} 스페셜 카드`;thBtn.hidden=false;thBtn.focus({preventScroll:true});
}
function thOpen(p,{label,onClose}={}){
  thStop();th.p=p;th.onClose=onClose||null;
  thWrap.innerHTML="";thWrap.appendChild(spCardEl(p,"closed"));thWrap.classList.remove("on");
  thQuote.className="th-quote";thQuote.innerHTML=`<span class="tq"></span><small>${p.when} · ${p.kind}</small>`;
  thTitle.classList.remove("on");thRays.classList.remove("on");thFx.innerHTML="";
  thCredit.textContent=p.cred;thBtn.hidden=true;thBtn.textContent=label||"닫기";
  thEl.hidden=false;thEl.classList.remove("on");void thEl.offsetWidth;thEl.classList.add("on");
  emStart();
  if(reduceM){thFinish();return}
  thHint.textContent="화면을 누르면 바로 보여요";th.running=true;
  const at=(ms,f)=>th.tm.push(setTimeout(f,ms));
  const tq=thQuote.querySelector(".tq");
  at(400,()=>{thQuote.classList.add("on");let n=0;const len=p.q.length;th.iv=setInterval(()=>{n++;tq.textContent=p.q.slice(0,n);if(n>=len)clearInterval(th.iv)},Math.max(32,Math.min(85,1800/len)))});
  at(2700,()=>thQuote.classList.add("src-on"));
  at(3500,()=>{thQuote.classList.remove("on");thQuote.classList.add("out");thRays.classList.add("on");thGold.classList.remove("go");void thGold.offsetWidth;thGold.classList.add("go")});
  at(3800,()=>{const c=thWrap.firstElementChild;c.dataset.m="sil";thWrap.classList.add("on")});
  at(4700,()=>{const c=thWrap.firstElementChild;thBurst();thTitle.classList.add("on");c.dataset.m="face";thCardQuote(p.q.length);c.classList.add("glint")});
  at(5800,thFinish);
}
thEl.addEventListener("click",e=>{if(th.running&&!e.target.closest("button"))thFinish()});
thBtn.addEventListener("click",()=>{thStop();cancelAnimationFrame(th.em);thEl.classList.remove("on");thEl.hidden=true;const f=th.onClose;th.onClose=null;spBusy=false;f&&f()});
addEventListener("keydown",e=>{if(e.key==="Escape"&&!thEl.hidden&&!thBtn.hidden)thBtn.click()});

/* ═══ 도감 · 찾기 · 오늘의 의원 ═══ */
function initDex(){
  $("dexParty").innerHTML='<option value="">정당 전체</option>'+PARTIES.map(p=>`<option>${p[0]}</option>`).join("");
  $("dexTier").innerHTML='<option value="">선수 전체</option><option value="1">초선</option><option value="2">재선</option><option value="3">3선</option><option value="4">4선 이상</option>';
  $("dexSido").innerHTML='<option value="">지역 전체</option>'+SIDO_ORDER.map(s=>`<option value="${s}">${sidoShort(s)}</option>`).join("")+'<option value="비례대표">비례대표</option>';
  document.querySelectorAll("#dexChips .chip").forEach(b=>b.addEventListener("click",()=>{dx.f=b.dataset.f;renderDex()}));
  [["dexParty","party"],["dexTier","tier"],["dexSido","sido"]].forEach(([id,k])=>$(id).addEventListener("change",e=>{dx[k]=e.target.value;renderDex()}));
  $("dexGrid").addEventListener("click",e=>{const t=e.target.closest(".mt");if(!t)return;const m=MEM[+t.dataset.id];
    if(statusOf(m)==="none")toast("아직 못 모은 카드예요. 팩을 열면 만날 수 있어요.");else zoom(m)});
  $("dexSeg").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    $("dexSeg").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    $("dexGen").hidden=b.dataset.v!=="gen";$("dexSp").hidden=b.dataset.v!=="sp"}));
  $("setGrid").addEventListener("click",e=>{const b=e.target.closest(".setbtn");if(!b)return;
    dx.sido=b.dataset.k;dx.f="all";dx.party="";dx.tier="";$("dexSido").value=dx.sido;$("dexParty").value="";$("dexTier").value="";renderDex();
    $("dexChips").scrollIntoView({behavior:reduceM?"auto":"smooth",block:"start"})});
  const spClick=e=>{const t=e.target.closest(".mt");if(!t)return;const p=PRES[+t.dataset.sp];
    if(t.classList.contains("own"))zoomSp(p);else toast("아직 못 모은 스페셜 카드예요. 팩에서 카드 한 장마다 10% 확률로 나와요.")};
  $("spTiles").addEventListener("click",spClick);$("spPreview").addEventListener("click",spClick);
  $("spPreview").innerHTML=PRES.map(p=>spTile(p,true)).join("");
}


/* 오늘의 의원: 날짜(한국 시간)로 정해지는 한 바퀴 돌기, 서버 없음 */
const TODAY_ORDER=(()=>{const R=rng(4242);const a=MEM.map(m=>m.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})();
const kstDay=()=>Math.floor((Date.now()+9*36e5)/864e5);
const todayM=()=>MEM[TODAY_ORDER[((kstDay()-Math.floor(Date.UTC(2026,0,1)/864e5))%299+299)%299]];
const regionOf=m=>m.sido?(m.dist.startsWith(m.sido)?m.dist:sidoShort(m.sido)+" "+m.dist):"비례대표";
function renderToday(){
  const m=todayM(),d=new Date(Date.now()+9*36e5);
  $("todayBtn").innerHTML=`<span class="av ${tierClass(m.terms)}" style="--pc:${m.color}"><i>${m.photo?`<img src="${m.photo}" alt="">`:SIL}</i></span><span><small>오늘의 의원 · ${d.getUTCMonth()+1}월 ${d.getUTCDate()}일</small><b>${m.nm}</b><em>${m.party} · ${tierName(m.terms)} · ${regionOf(m)}</em></span><span class="go" aria-hidden="true">›</span>`;
}
$("todayBtn").addEventListener("click",()=>{const m=todayM();
  if(!S.col.includes(m.id)&&!S.seen.includes(m.id)){addSeen(m.id);toast("열람했어요. 도감 숫자에는 세지 않아요.");renderDex();renderFind()}
  zoom(m)});

/* 임기 게이지: 2024.05.30 ~ 2028.05.29 */
function termFill(root){
  const A=new Date(2024,4,30),E=new Date(2028,4,30),T=new Date(),t0=new Date(T.getFullYear(),T.getMonth(),T.getDate());
  const tot=Math.round((E-A)/864e5),left=Math.max(0,Math.min(tot,Math.round((E-t0)/864e5))),pct=Math.round(left/tot*100);
  root.querySelectorAll("[data-term]").forEach(el=>{const k=el.dataset.term;
    if(k==="bar")el.style.width=pct+"%";
    else if(k==="days")el.textContent=`${fmt(left)}일 남음`;
    else if(k==="sub")el.textContent=`전체 ${fmt(tot)}일 중 ${pct}% · 2028.05.29까지`;
    else if(k==="line")el.textContent=`22대 국회 임기 ${fmt(left)}일 남음 (${pct}%)`;});
}

/* ═══ 오늘의 팩 화면 ═══ */
function nextInfo(){
  const KST=9*36e5,nowMs=Date.now(),k=new Date(nowMs+KST);const h=k.getUTCHours();const nh=[6,12,18,24].find(x=>x>h);
  const nextMs=Date.UTC(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),nh)-KST;
  return {at:(nh===24?"00":String(nh).padStart(2,"0"))+":00",left:nextMs-nowMs};
}
function tickText(){
  const n=nextInfo(),hh=Math.floor(n.left/36e5),mm=Math.floor(n.left%36e5/6e4),ss=Math.floor(n.left%6e4/1e3);
  const p2=x=>String(x).padStart(2,"0");
  document.querySelectorAll('[data-nx="at"]').forEach(e=>e.textContent=`${p2(hh)}:${p2(mm)}:${p2(ss)}`);
  document.querySelectorAll('[data-nx="left"]').forEach(e=>e.textContent=`한국 시간 ${n.at}에 충전돼요`);
}
function renderExit(){
  const L=pk.last,res=pk.mode==="result"&&L,left=packsLeft(),nSp=S.sp.length;
  let h="";
  if(res){
    h+=`<h3>방금 뽑은 카드</h3><div class="sp-tiles">${L.cards.map(c=>c.sp?spTile(c,true):tile(MEM[c.id])).join("")}</div>`;
    if(L.sets.length)h+=`<div class="setdone">★ ${L.sets.map(sidoShort).join(", ")} 세트를 완성했어요!</div>`;
    if(L.first)h+=`<div class="note"><b>기록 안내</b><br>모은 카드는 이 기기·브라우저에만 저장돼요. 기기를 바꾸거나 브라우저 기록을 지우면 사라져요.</div>`;
  }else h+=`<h3>오늘의 팩을 모두 열었어요</h3>`;
  h+=`<div class="two"><div><div class="lab">남은 팩</div><div class="big">${S.inf?"무한":left+"개"}</div></div><div><div class="lab">다음 충전</div><div class="big" data-nx="at"></div><div class="lab" data-nx="left"></div></div></div>
  <div class="two"><div><div class="lab">도감</div><div class="big">${S.col.length} / 299</div><div class="bar"><i style="width:${S.col.length/299*100}%"></i></div></div><div><div class="lab">스페셜</div><div class="big">${nSp} / 14</div><div class="bar"><i style="width:${nSp/14*100}%"></i></div></div></div>
  <div><div class="lab">22대 국회 임기</div><div class="big" data-term="days"></div><div class="bar term"><i data-term="bar"></i></div><div class="lab" data-term="sub"></div></div>
  <div class="btns">${left>0&&res?`<button class="btn" data-act="next">다음 팩 열기 (${left})</button>`:""}<button class="btn ghost" data-tab="dex">도감 보기</button><button class="btn ghost" data-tab="find">국회의원 찾기</button></div>
  <div class="tip2"><b>다시 오는 법</b> · 충전은 한국 시간 00·06·12·18시예요(충전된 팩은 최대 1개). 홈 화면에 추가하면 앱처럼 바로 열려요(브라우저 메뉴의 ‘홈 화면에 추가’). 알림은 캘린더에 넣어 두면 돼요.</div>
  <div class="btns"><button class="btn ghost" data-share="cal">캘린더에 충전 알림 넣기 (12시·18시)</button><button class="btn ghost" data-share="link">친구에게 링크 공유</button></div>`;
  exitP.innerHTML=h;termFill(exitP);tickText();
}
function refreshPack(){
  const left=packsLeft();
  if(pk.mode==="ready"||pk.mode==="wait")pk.mode=(left>0||S.pack)?"ready":"wait";
  const showStage=pk.mode!=="wait",wasHidden=stage.hidden;
  stage.hidden=!showStage;exitP.hidden=!(pk.mode==="result"||pk.mode==="wait");
  if(pk.mode==="ready"){
    $("openBtn").textContent=S.pack?"이어서 열기":"팩 열기";
    $("openSub").textContent=S.pack?"열던 팩이 있어요":`남은 팩 ${S.inf?"무한":left+"개"} · 카드 3장${S.opens===0?" · 첫 팩에는 스페셜 1장":""}`;
  }
  if(!exitP.hidden)renderExit();
  $("packDot").hidden=!(left>0&&pk.mode!=="playing"&&pk.mode!=="result");
  if(wasHidden&&showStage)requestAnimationFrame(()=>{drawHall();resizeCurtain()});
}
function resetStage(){
  stage.classList.remove("open","focus");closeCurtain();slots.innerHTML="";skipBtn.hidden=true;hint.textContent="";
  PACK=[];opened=0;busy=false;spBusy=false;skipNow=false;pending=null;pk.mode="ready";pk.last=null;pk.newSets=[];
}
$("openBtn").addEventListener("click",()=>{
  updateCharge();
  if(!S.pack){
    if(packsLeft()<=0){refreshPack();return}
    if(S.col.length>=299&&S.sp.length>=14){toast("도감을 모두 채웠어요!");return}
    if(S.inf){}else if(S.charged>0)S.charged--;else if((S.bonus||0)>0)S.bonus--;else S.welcome--;
    S.pack=drawPack();saveS();
  }
  PACK=S.pack.items.map(itemCard);pk.mode="playing";
  buildSlots();
  stage.classList.add("open");openCurtain();skipBtn.hidden=false;hint.textContent="카드 한 장을 골라 보세요.";
  S.pack.done.forEach((d,i)=>{if(d)revealAny(slots.children[i],PACK[i],true)});
  refreshPack();renderTop();
});

/* ═══ 전체 다시 그리기 · 테스트 도구 ═══ */
function renderTop(){$("segGen").textContent=`${S.col.length} / 299`;$("segSp").textContent=`${S.sp.length} / 14`;toolInfo()}
function toolInfo(){
  $("toolInfo").textContent=`지금: 모은 카드 ${S.col.length}장 · 열람 ${S.seen.filter(i=>!S.col.includes(i)).length}장 · 스페셜 ${S.sp.length}장 · 남은 팩 ${S.inf?"무한":packsLeft()+"개"} · 스페셜 확률 ${S.spHigh?"100%(테스트)":"10%"}`;
  $("infBtn").textContent=S.inf?"팩 무한 끄기":"팩 무한으로 (관리자 테스트)";
  $("rateBtn").textContent=S.spHigh?"스페셜 확률 10%로 되돌리기":"스페셜 확률 100%로 (테스트)";
}
function renderAll(){syncDx();renderDex();renderSets();renderSp();renderFind();renderToday();refreshPack();renderTop()}
function setsDoneNow(){return SET_KEYS.filter(k=>setHave(k)===SET_TOT[k])}
function onCardRevealed(i){
  const c=PACK[i];if(!c)return;
  if(c.sp){if(!S.sp.includes(c.i))S.sp.push(c.i)}
  else{
    if(!S.col.includes(c.id))S.col.push(c.id);
    S.seen=S.seen.filter(x=>x!==c.id);
    const k=setKey(c);
    if(setHave(k)===SET_TOT[k]&&!S.setsDone.includes(k)){S.setsDone.push(k);pk.newSets.push(k);setTimeout(()=>toast(`★ ${sidoShort(k)} 세트 완성!`),700)}
  }
  if(S.pack)S.pack.done[i]=true;
  saveS();syncDx();renderDex();renderSets();renderSp();renderTop();
}
function preset(kind){
  if(th&&!thEl.hidden){thStop();thEl.hidden=true}
  const keepHigh=S.spHigh;
  S=freshS();S.spHigh=keepHigh;
  if(kind==="mid"){S.welcome=0;S.charged=1;S.col=ORDER.slice(0,24);S.seen=[byName("윤용근"),...ORDER.slice(24,29)];S.sp=[2,6,11];S.opens=8;S.noteShown=true}
  if(kind==="late"){S.welcome=0;S.charged=1;S.col=ORDER.slice(0,290);S.seen=[byName("윤용근"),ORDER[290],ORDER[291]];S.sp=[0,1,2,3,4,5,6,7,8,9,10,11];S.opens=100;S.noteShown=true}
  S.setsDone=setsDoneNow();
  saveS();resetStage();renderAll();showTab("pack");
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-act]");
  if(a){const k=a.dataset.act;
    if(k==="next"){resetStage();refreshPack();window.scrollTo({top:0,behavior:reduceM?"auto":"smooth"})}
    else if(k==="reset"){preset("reset");toast("처음 온 날로 되돌렸어요.")}
    else if(k==="mid"){preset("mid");toast("모으는 중 상태로 바꿨어요.")}
    else if(k==="late"){preset("late");toast("거의 완성 상태로 바꿨어요.")}
    else if(k==="charge"){S.charged=1;saveS();if(pk.mode==="wait")pk.mode="ready";refreshPack();renderTop();toast("팩 1개를 충전했어요.")}
    else if(k==="inf"){S.inf=!S.inf;saveS();if(S.inf&&pk.mode==="wait")pk.mode="ready";refreshPack();renderTop();toast(S.inf?"팩이 무한으로 나와요(테스트).":"팩 무한을 껐어요.")}
    else if(k==="rate"){S.spHigh=!S.spHigh;saveS();renderTop();toast(S.spHigh?"스페셜이 항상 나와요(테스트).":"스페셜 확률 10%로 되돌렸어요.")}
    return}
  const t=e.target.closest("[data-tab]");
  if(t){showTab(t.dataset.tab);return}
  const sh=e.target.closest("[data-share]");
  if(sh){shareAct(sh.dataset.share);return}
  const mt=e.target.closest("#exit .mt");
  if(mt){if(mt.dataset.sp!==undefined)zoomSp(PRES[+mt.dataset.sp]);else{const m=MEM[+mt.dataset.id];if(statusOf(m)!=="none")zoom(m)}}
});
function showTab(t){
  document.querySelectorAll(".tab").forEach(s=>s.hidden=s.dataset.pane!==t);
  document.querySelectorAll(".app-tabs button").forEach(b=>{if(b.dataset.tab===t)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  window.scrollTo(0,0);
  if(t==="pack")requestAnimationFrame(()=>{drawHall();resizeCurtain();fitRegion(slots)});
  if(t==="dex")renderDex();
  if(t==="find")renderFind();
  if(t==="info")toolInfo();
  if(t==="game")renderGame();else gameLeave();
}
$("galBox").addEventListener("toggle",()=>{if($("galBox").open){fitRegion(gal)}});

/* ═══ 오락실 (게임 탭) ═══ */
(function(){
const host=document.getElementById("gameHost");
const R=host.attachShadow({mode:"open"});
R.innerHTML='<style>'+":host{display:block;--night:#0a0d1a;--panel:#141a30;--panel2:#1b2340;--ink:#eef0f6;--dim:#a3a9bd;--gold:#d9b25c;--gold-hi:#f4dc9a;--line:rgba(217,178,92,.28);--ok:#58c98a;--bad:#e8806f;color:var(--ink);font-family:var(--display);line-height:1.45;font-size:15px}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\n#main{padding:2px 0 24px}\n.star{z-index:99} .tile.card .fr{padding:3px;border:0;background:var(--mt)} .tile.card .ci{flex:1;display:flex;flex-direction:column;border-radius:6px;overflow:hidden;min-height:0} .tile.card .ph{flex:1;position:relative} .tile.card .tr{position:absolute;left:2px;top:2px;z-index:2;font-size:9px;font-weight:900;line-height:1;padding:2px 4px;border-radius:4px;background:var(--mt);color:#1a1405;text-shadow:none} .tile.card.match .fr{box-shadow:0 0 14px rgba(244,220,154,.9)} .tile.card.wrong .fr{box-shadow:0 0 14px rgba(232,128,111,.9)} .tile.card .bk{background:repeating-linear-gradient(45deg,rgba(217,178,92,.07) 0 3px,transparent 3px 8px),radial-gradient(circle at 50% 42%,#2a2150,#0b0818 75%);border:2px solid var(--gold)} .tile.card .bk::after{content:none} .tile.card .bk::before{content:'';position:absolute;inset:3px;border:1px solid rgba(217,178,92,.45);border-radius:6px} .tile.card .bk svg{width:56%;height:auto;opacity:.5} .seg{display:flex;gap:8px;margin:0 0 12px} .seg button{flex:1;min-height:44px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);font-weight:700;font-size:14px} .seg button[aria-pressed=true]{background:var(--gold);color:#1a1405;border-color:var(--gold)}\n\n/* \ub808\uc774\uc544\uc6c3: \ubc24 \uc758\uc0ac\ub2f9 \ud1a4 \ub2e8\uc77c \ud654\uba74. \uc704\uc5d0\uc11c \uc544\ub798\ub85c \uc9c0\uac11 \u2192 \ub2e8\uacc4\ubcc4 \uac8c\uc784 \ubaa9\ub85d \u2192 \uac8c\uc784 \ud654\uba74. */\nbutton{font:inherit;color:inherit;cursor:pointer}\nh1{font-family:inherit;font-size:20px;margin:4px 0 12px;color:var(--gold-hi)}\n.sub{color:var(--dim);font-size:13px}\n.wallet{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}\n.box{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px}\n.box b{display:block;font-size:22px;color:var(--gold-hi)}\n.box small{color:var(--dim);font-size:12px}\n.lvl{font-size:13px;letter-spacing:.04em;color:var(--gold);margin:18px 0 8px;font-weight:800}\n.game{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;margin-bottom:10px;width:100%;text-align:left}\n.game.open{border-color:var(--gold)}\n.game.soon{opacity:.6;cursor:default}\n.game .t{font-weight:800;font-size:16px}\n.game .d{color:var(--dim);font-size:13px;margin-top:2px}\n.badge{flex:none;font-size:12px;border-radius:999px;padding:4px 10px;border:1px solid var(--line);color:var(--dim)}\n.badge.on{background:var(--gold);color:#1a1405;border-color:var(--gold);font-weight:800}\n.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:12px;border:1px solid var(--gold);background:var(--gold);color:#1a1405;font-weight:800;font-size:16px}\n.btn.ghost{background:none;color:var(--gold-hi)}\n.btn:disabled{opacity:.45}\n.btn.block{width:100%}\n.row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}\n.back{background:none;border:0;color:var(--dim);padding:8px 0;font-size:14px;margin-bottom:4px}\n.gi{flex:none;width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--acbg);border:1px solid var(--ac);color:var(--ac)}\n.gi svg{width:34px;height:34px}\n.game .tx{flex:1;min-width:0}\n.game.soon .gi{--ac:#7b8197;--acbg:rgba(123,129,151,.12)}\n.hero{position:relative;overflow:hidden;border-radius:20px;padding:18px 18px 16px;margin:6px 0 14px;border:1px solid var(--ac);background:linear-gradient(140deg,var(--acbg),var(--panel) 72%)}\n.hero .bg{position:absolute;right:-14px;top:-10px;width:190px;height:190px;opacity:.3;color:var(--ac);pointer-events:none}\n.hero .bg svg{width:100%;height:100%}\n.hero>*:not(.bg){position:relative}\n.hero h1{margin:2px 0 0;font-size:25px;color:var(--ink);max-width:80%;word-break:keep-all}\n.hero .rules{word-break:keep-all}\n.hero .lvc{display:inline-block;font-size:12px;letter-spacing:.04em;font-weight:800;color:#10131f;background:var(--ac);border-radius:999px;padding:3px 10px}\n.wk{display:flex;align-items:center;gap:12px}\n.tk{flex:none;display:inline-block;vertical-align:-.28em;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}\n.tk.big{transform:rotate(-8deg)}\n.cost{display:flex;align-items:center;gap:4px;margin-top:6px;font-size:12px;color:var(--dim);justify-content:center}\n.pk{flex:none;display:inline-block;vertical-align:-.3em;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}\n.pk.big{transform:rotate(8deg)}\n.packs .pk{animation:pop .5s both}\n.packs .pk:nth-child(2){animation-delay:.12s}.packs .pk:nth-child(3){animation-delay:.24s}\n.rules{margin:10px 0;padding-left:20px;color:var(--ink);font-size:15px}\n.rules li{margin:4px 0}\n.dots{display:flex;gap:8px;justify-content:center;margin:6px 0 10px}\n.dots i{width:12px;height:12px;border-radius:50%;background:var(--panel2);border:1px solid var(--line)}\n.dots i.on{border-color:var(--gold-hi);box-shadow:0 0 0 2px rgba(244,220,154,.35)}\n.dots i.ok{background:var(--ok);border-color:var(--ok)}\n.dots i.no{background:var(--bad);border-color:var(--bad)}\n.tbar{height:8px;border-radius:8px;background:var(--panel2);overflow:hidden}\n.tbar i{display:block;height:100%;width:100%;background:var(--gold);transform-origin:left}\n.tbar.hot i{background:var(--bad)}\n.q{display:flex;gap:14px;align-items:center;border-radius:16px;padding:14px;margin:12px 0;border:2px solid var(--line);background:var(--panel);transition:background .35s,border-color .35s}\n.q.ok{border-color:var(--ok)}.q.no{border-color:var(--bad)}\n.q .nm{font-weight:900;font-size:22px}\n.q .vt{margin-top:2px}\n.q .vt b{color:var(--gold-hi)}\n.q .pt{margin-top:6px;font-weight:800;font-size:17px;min-height:26px}\n.face{width:96px;height:124px;border-radius:10px;background:#2a3358 center/cover no-repeat;flex:none;position:relative;overflow:hidden}\n.face svg{position:absolute;inset:0;width:100%;height:100%}\n.opts{display:grid;gap:8px}\n.opt{min-height:54px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);font-size:17px;font-weight:700;text-align:left;padding:0 16px}\n.opt.ok{background:#1d5b3a;border-color:var(--ok)}\n.opt.no{background:#6a2a22;border-color:var(--bad)}\n.opt:disabled{opacity:1}\n.msg{min-height:26px;text-align:center;font-weight:800;margin:10px 0 0}\n.msg.ok{color:var(--ok)}.msg.no{color:var(--bad)}\n.combo{color:var(--gold-hi)}\n.lockbar{height:6px;border-radius:6px;background:var(--panel2);overflow:hidden;margin-top:8px}\n.lockbar i{display:block;height:100%;width:100%;background:var(--gold);transform-origin:left}\n.res{text-align:center}\n.res .big{font-size:28px;font-weight:900;margin:6px 0}\n.res .win{color:var(--ok)}.res .lose{color:var(--bad)}\n.reward{background:linear-gradient(135deg,#3b2f10,#6b5421);border:1px solid var(--gold);border-radius:14px;padding:14px;font-weight:800;margin-top:12px}\n.packs{display:flex;gap:8px;justify-content:center;margin-top:8px}\n.packs span{width:34px;height:46px;border-radius:6px;background:linear-gradient(160deg,#f4dc9a,#a8812f);color:#1a1405;display:flex;align-items:center;justify-content:center;font-weight:900;animation:pop .5s both}\n.packs span:nth-child(2){animation-delay:.12s}.packs span:nth-child(3){animation-delay:.24s}\n@keyframes pop{from{transform:scale(.2) rotate(-12deg);opacity:0}to{transform:none;opacity:1}}\n.note{color:var(--dim);font-size:12px;margin-top:10px}\n.cnt{font-size:56px;font-weight:900;text-align:center;color:var(--gold-hi);min-height:70px}\n.top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:2px 0 8px;font-size:14px}\n.top b{color:var(--gold-hi)}\n.board{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}\n.tile{aspect-ratio:3/4;perspective:700px;border:0;background:none;padding:0;min-width:0}\n.tile .in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .45s}\n.tile.open .in{transform:rotateY(180deg)}\n.tile .bk,.tile .fr{position:absolute;inset:0;border-radius:9px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}\n.tile .bk{background:radial-gradient(circle at 50% 38%,#2b1b3a,#0d0713 70%);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:18px}\n.tile .bk::after{content:\"\u2726\"}\n.tile .fr{transform:rotateY(180deg);border:2px solid transparent;display:flex;flex-direction:column}\n.tile .fr .ph{flex:1;background:#2a3358 center/cover no-repeat;position:relative}\n.tile .fr .ph svg{position:absolute;inset:0;width:100%;height:100%}\n.tile .fr .nm{font-size:11px;font-weight:800;text-align:center;padding:3px 0;white-space:nowrap}\n.tile.match .fr{border-color:var(--gold-hi);box-shadow:0 0 14px rgba(244,220,154,.8)}\n.tile.wrong .fr{border-color:var(--bad);box-shadow:0 0 14px rgba(232,128,111,.8)}\n.tile.wrong{animation:shake .4s}\n@keyframes shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}\n.star{position:absolute;pointer-events:none;color:var(--gold-hi);font-size:16px;animation:fly .7s forwards}\n@keyframes fly{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.4)}}\n.banner{text-align:center;font-weight:900;font-size:18px;min-height:30px;margin-top:12px}\ndetails{margin-top:22px;border-top:1px dashed var(--line);padding-top:10px}\nsummary{color:var(--dim);font-size:13px}\n.tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}\n.tools button{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:13px}\n[hidden]{display:none!important}\n:focus-visible{outline:3px solid #8fc1ff;outline-offset:2px}\n@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}\n"+'</style><main id="main" aria-live="polite"></main>';
const SRC="기준 2026.10.09 · 사진·자료: 국회 열린국회정보(공공누리 제1유형)";
const MAXT=30,DAILY=10,STEP=10*60*1000,WAIT=2000,REWARD=3,QTIME=15000,PEEK=5,MAXMISS=5; /* MAXMISS: 짝 맞추기 틀려도 되는 횟수(넘으면 실패) */ /* PEEK: 짝 맞추기 앞면 공개 초 */
const KST=9*3600*1000,DAY=86400000;
const T=()=>S.g||(S.g={tickets:DAILY,last:null,daily:null,off:0,bm:null});
const Q={};
["tickets","last","daily","off","bm"].forEach(k=>Object.defineProperty(Q,k,{get(){return T()[k]},set(v){T()[k]=v}}));
Object.defineProperties(Q,{packs:{get(){return S.bonus||0}},done:{get(){return S.col.length>=299}},owned:{get(){return S.col}}});
const save=saveS;
const snd=n=>{try{SND[n]&&SND[n]()}catch(e){}};
const PCOL={};PARTIES.forEach(p=>PCOL[p[0]]=p[1]);
const GPARTIES=PARTIES.map(p=>p[0]);
const gapOf=c=>{const e=ELE[c];if(!e)return null;const g=e[0]-e[1];return g<5?"접전":g<20?"여유":"압승"};
const GM=MEM.map(m=>[m.code,m.nm,m.party,regionOf(m),tierName(m.terms),m.photo,ELE[m.code]?ELE[m.code][0]:null,(m.cmit||"").split(" · ").filter(x=>x&&x.indexOf("특별")<0),gapOf(m.code)]);
const rnd=n=>Math.floor(Math.random()*n);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const now=()=>Date.now()+(Q.off||0);
const dayKey=t=>{const d=new Date(t+KST);return d.getUTCFullYear()+"-"+(d.getUTCMonth()+1)+"-"+d.getUTCDate()};

/* 투표용지: 매일 10장 + 10분마다 1장, 최대 30장 */
function sync(){
  const t=now(),k=dayKey(t);
  if(Q.last==null){Q.last=t;Q.daily=k;Q.tickets=DAILY}
  if(Q.daily!==k){Q.tickets=Math.min(MAXT,Q.tickets+DAILY);Q.daily=k}
  if(Q.tickets>=MAXT){Q.last=t}
  else{const g=Math.floor((t-Q.last)/STEP);if(g>0){Q.tickets=Math.min(MAXT,Q.tickets+g);Q.last=Q.tickets>=MAXT?t:Q.last+g*STEP}}
  save();
}
const nextIn=()=>Q.tickets>=MAXT?0:Math.max(0,STEP-(now()-Q.last));
const mmss=ms=>{const s=Math.ceil(ms/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
function grant(){if(Q.done)return 0;S.bonus=(S.bonus||0)+REWARD;saveS();if(pk.mode==="wait")pk.mode="ready";refreshPack();renderTop();return REWARD}

let view="list",G=null,tick=null,timers=[];
const $=s=>R.querySelector(s);
const el=h=>{const d=document.createElement("div");d.innerHTML=h.trim();return d.firstChild};
const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
function stopAll(){timers.forEach(clearTimeout);timers=[];clearInterval(tick);G&&G.raf&&cancelAnimationFrame(G.raf)}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
const onCol=h=>lum(h)>.35?"#10131f":"#fff";

const TK=(h=26,cls="")=>`<svg class="tk ${cls}" viewBox="0 0 40 48" height="${h}" width="${h*40/48}" aria-hidden="true"><path d="M6 3h20l11 11v30a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#f6f3ea"/><path d="M26 3v9a2 2 0 0 0 2 2h9z" fill="#cfc9b6"/><circle cx="20" cy="30" r="9" fill="none" stroke="#e8502f" stroke-width="3.2"/><path d="M20 22.5v6.5M20 29l-4.5 7M20 29l4.5 7" fill="none" stroke="#e8502f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PK=(h=34,cls="")=>`<svg class="pk ${cls}" viewBox="0 0 42 58" height="${h}" width="${h*42/58}" aria-hidden="true"><defs><linearGradient id="pkg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a52d6"/><stop offset="1" stop-color="#2a1f78"/></linearGradient></defs><path d="M5 8 L7 4 L9 8 L11 4 L13 8 L15 4 L17 8 L19 4 L21 8 L23 4 L25 8 L27 4 L29 8 L31 4 L33 8 L35 4 L37 8 L37 50 L35 54 L33 50 L31 54 L29 50 L27 54 L25 50 L23 54 L21 50 L19 54 L17 50 L15 54 L13 50 L11 54 L9 50 L7 54 L5 50 Z" fill="url(#pkg)" stroke="#f4dc9a" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 11v38" stroke="#fff" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="29" r="9.5" fill="#d9b25c" stroke="#f4dc9a" stroke-width="1.2"/><path d="M21 22.5l2 4.3 4.7.6-3.4 3.2.9 4.6-4.2-2.3-4.2 2.3.9-4.6-3.4-3.2 4.7-.6z" fill="#2a1f78"/><path d="M12 15l.8 1.7 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3zM31 40l.8 1.7 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3z" fill="#f4dc9a"/></svg>`;
const GAMES={
 party:{ac:"#3fc1b0",acbg:"rgba(63,193,176,.16)",svg:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="8" width="34" height="46" rx="6"/><circle cx="26" cy="25" r="7"/><path d="M14 46c1-8 6-12 12-12s11 4 12 12"/><circle cx="46" cy="42" r="12" fill="#0a0d1a"/><path d="M41.5 38.5a4.8 4.8 0 1 1 6.5 4.4c-1.3.6-2 1.5-2 3"/><path d="M46 49.5h.01"/></svg>'},
 pairs:{ac:"#b88cff",acbg:"rgba(184,140,255,.16)",svg:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="26" height="36" rx="5" transform="rotate(-8 19 32)"/><rect x="32" y="14" width="26" height="36" rx="5" transform="rotate(8 45 32)"/><circle cx="19" cy="30" r="5"/><circle cx="45" cy="30" r="5"/><path d="M32 8l2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.8-.7z" fill="currentColor"/></svg>'},
 battle:{ac:"#ff8a5c",acbg:"rgba(255,138,92,.16)",svg:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="12" width="24" height="34" rx="5" transform="rotate(-12 18 29)"/><rect x="34" y="18" width="24" height="34" rx="5" transform="rotate(12 46 35)"/><path d="M35 8l-8 16h9l-5 15 13-19h-9z" fill="currentColor"/></svg>'}};
const gStyle=k=>`style="--ac:${GAMES[k].ac};--acbg:${GAMES[k].acbg}"`;
const SIL='<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="18" fill="rgba(255,255,255,.3)"/><path d="M12 100c2-26 20-38 38-38s36 12 38 38z" fill="rgba(255,255,255,.3)"/></svg>';
function loadPhoto(node,m){const im=new Image();im.referrerPolicy="no-referrer";im.onload=()=>{node.style.backgroundImage=`url("${m[5]}")`;const s=node.querySelector("svg");s&&s.remove()};im.src=m[5]}
function faceEl(m){const f=el(`<div class="face">${SIL}</div>`);loadPhoto(f,m);return f}

/* ---------- 게임 목록 ---------- */
function renderList(){
  sync();
  $("#main").innerHTML=`<h1>오락실</h1>
  <div class="wallet">
    <div class="box"><div class="wk">${TK(40,"big")}<div><small>투표용지</small><b id="tk"></b></div></div><small id="tkn"></small></div>
    <div class="box"><div class="wk">${PK(46,"big")}<div><small>보너스 팩</small><b>${Q.packs}팩</b></div></div><small>${Q.done?'도감 완성 후에는 보상이 없어요':'게임에 성공하면 3팩 획득'}</small></div>
  </div>
  <div class="lvl">쉬움</div>
  <button class="game open" data-g="party" ${gStyle("party")}><span class="gi">${GAMES.party.svg}</span><div class="tx"><div class="t">소속 정당을 맞춰라!</div><div class="d">얼굴과 힌트로 정당 고르기 · 5문제 중 4문제</div></div><div style="text-align:center;padding-top:8px"><span class="badge on">플레이 가능</span><div class="cost">${TK(16)} 1장 소모</div></div></button>
  <div class="lvl">보통</div>
  <button class="game open" data-g="pairs" ${gStyle("pairs")}><span class="gi">${GAMES.pairs.svg}</span><div class="tx"><div class="t">금배지 짝꿍 찾기</div><div class="d">5초 외우고 같은 카드 5쌍 찾기 · 내 카드 ${Q.owned.length}장</div></div><div style="text-align:center;padding-top:8px"><span class="badge on">플레이 가능</span><div class="cost">${TK(16)} 1장 소모</div></div></button>
  <div class="lvl">어려움</div>
  <div class="game soon" aria-disabled="true" ${gStyle("battle")}><span class="gi">${GAMES.battle.svg}</span><div class="tx"><div class="t">정치인 카드 배틀</div></div><span class="badge">곧 열려요</span></div>
  <p class="note">${SRC}<br>특정 정당·의원을 평가하는 게임이 아니에요.</p>
  <details ${location.hash==="#dev"?"":"hidden"}><summary>시연 도구 (테스트 전용 · 카드 수는 ‘안내’ 탭에서 바꿔요)</summary><div class="tools">
   <button data-x="t10">용지 +10</button><button data-x="day">하루 넘기기</button></div></details>`;
  $("#main").querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{view="intro-"+b.dataset.g;render()});
  $("#main").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const x=b.dataset.x;
    if(x==="t10")Q.tickets=Math.min(MAXT,Q.tickets+10);
    if(x==="day")Q.off+=DAY;
    save();render()});
  const upd=()=>{if(view!=="list"||!$("#tkn"))return;sync();$("#tk").textContent=Q.tickets+" / "+MAXT;$("#tkn").textContent=Q.tickets>=MAXT?"가득 찼어요":"다음 1장 획득까지 "+mmss(nextIn())};upd();tick=setInterval(upd,1000);
}

/* ---------- 소개 화면 ---------- */
const INTRO={
 party:{t:"소속 정당을 맞춰라!",lv:"쉬움",rules:["얼굴·이름·지역·득표율·상임위를 보고 소속 정당을 골라요","보기는 4개, 한 문제에 15초예요","5문제 중 4문제를 맞히면 성공이에요","틀리면 정답을 보여 주고 2초 뒤 바로 다음 문제로 넘어가요"]},
 pairs:{t:"금배지 짝꿍 찾기",lv:"보통",rules:["내 카드 5장이 2장씩, 10장이 앞면으로 열려요","5초 동안 위치를 외워요 (처음 한 번만)","뒤집힌 카드에서 같은 카드 짝을 찾아요","틀리면 방금 연 카드 두 장만 다시 뒤집혀요","틀려도 되는 횟수는 "+MAXMISS+"번이에요"]}};
function renderIntro(k){
  sync();const I=INTRO[k],short=k==="pairs"&&Q.owned.length<5;
  $("#main").innerHTML=`<button class="back" id="bk">← 게임 목록</button>
  <div class="hero" ${gStyle(k)}><div class="bg" aria-hidden="true">${GAMES[k].svg}</div><span class="lvc">${I.lv}</span><h1>${I.t}</h1>
  <ul class="rules">${I.rules.map(r=>`<li>${r}</li>`).join("")}</ul></div>
  <div class="box"><div class="wk">${TK(40,"big")}<div><small>가진 투표용지</small><b>${Q.tickets} / ${MAXT}</b></div></div></div>
  <div class="row"><button class="btn block" id="go" ${Q.tickets<1||short?'disabled':''}>${TK(22)}&nbsp;투표용지 1장 쓰고 시작</button></div>
  <p class="note">${short?'내 카드가 5장 이상이어야 열려요. (지금 '+Q.owned.length+'장)':''}${Q.tickets<1?'투표용지가 없어요. 10분마다 1장이 채워져요.':''}<br>성공하면 보너스 ${REWARD}팩${Q.done?' (도감 완성 후에는 보상 없음)':''}.</p>`;
  $("#bk").onclick=()=>{view="list";render()};
  $("#go").onclick=()=>{sync();if(Q.tickets<1)return;Q.tickets--;save();k==="party"?startParty():startPairs()};
}

/* ---------- Easy: 정당 맞추기 ---------- */
function startParty(){
  const ids=shuffle(GM.map((_,i)=>i)).slice(0,5);
  G={kind:"party",ids,q:0,res:[],combo:0,best:0,locked:false};
  view="party";render();
}
function voteLine(m){
  const v=m[6]!=null?"당선 득표율 <b>"+m[6].toFixed(1)+"%</b>"+(m[8]?" · 2위와 격차 <b>"+m[8]+"</b>":""):(m[3]==="비례대표"?"비례대표 · 지역 득표율 없음":"득표율 자료 없음");
  return v+(m[7]&&m[7].length?"<br>상임위 "+esc(m[7].join(", ")):"")}
function renderParty(){
  stopAll();const n=G.res.length;
  if(n>=5){return finishParty()}
  const m=GM[G.ids[n]];
  const wrong=shuffle(GPARTIES.filter(p=>p!==m[2])).slice(0,3);
  const opts=shuffle([m[2],...wrong]);
  G.locked=false;
  $("#main").innerHTML=`<div class="top"><span>${n+1} / 5</span><span class="combo" id="cb">${G.combo>=2?G.combo+'연속!':''}</span></div>
  <div class="dots">${[0,1,2,3,4].map(i=>`<i class="${G.res[i]===1?'ok':G.res[i]===0?'no':i===n?'on':''}"></i>`).join("")}</div>
  <div class="tbar" id="tb"><i></i></div>
  <div class="q" id="qc"><div id="qf"></div><div><div class="nm">${esc(m[1])}</div><div class="sub">${esc(m[3])} · ${esc(m[4])}</div><div class="sub vt">${voteLine(m)}</div><div class="pt" id="pt">소속 정당은?</div></div></div>
  <div class="opts" id="op">${opts.map(o=>`<button class="opt" data-p="${esc(o)}">${esc(o)}</button>`).join("")}</div>
  <div class="msg" id="mg"></div><div class="lockbar" id="lb" hidden><i></i></div>`;
  $("#qf").appendChild(faceEl(m));
  $("#op").querySelectorAll(".opt").forEach(b=>b.onclick=()=>answer(b.dataset.p,m));
  const t0=performance.now(),bar=$("#tb"),fill=bar.firstElementChild;
  const loop=t=>{const left=Math.max(0,QTIME-(t-t0));fill.style.transform=`scaleX(${left/QTIME})`;bar.classList.toggle("hot",left<5000);
    if(left<=0&&!G.locked){answer(null,m);return}G.raf=requestAnimationFrame(loop)};G.raf=requestAnimationFrame(loop);
}
function answer(p,m){
  if(G.locked)return;G.locked=true;cancelAnimationFrame(G.raf);
  const ok=p===m[2];G.res.push(ok?1:0);
  if(ok){G.combo++;G.best=Math.max(G.best,G.combo);snd("gOk")}else{G.combo=0;snd(p===null?"gTime":"gNo")}
  const c=PCOL[m[2]];
  const qc=$("#qc");qc.classList.add(ok?"ok":"no");qc.style.background=c;qc.style.color=onCol(c);
  $("#pt").textContent=m[2];
  $("#op").querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.p===m[2])b.classList.add("ok");else if(b.dataset.p===p)b.classList.add("no")});
  const mg=$("#mg");
  if(ok){mg.className="msg ok";mg.textContent=G.combo>=2?`정답! ${G.combo}연속!`:"정답!";buzz(30);later(renderParty,1000)}
  else{mg.className="msg no";mg.textContent=p===null?"시간이 지났어요":"아쉬워요";buzz([40,60,40]);
    const lb=$("#lb");lb.hidden=false;const i=lb.firstElementChild;i.style.transition="none";i.style.transform="scaleX(1)";
    requestAnimationFrame(()=>requestAnimationFrame(()=>{i.style.transition=`transform ${WAIT}ms linear`;i.style.transform="scaleX(0)"}));later(renderParty,WAIT)}
  const dots=$(".dots");dots.innerHTML=[0,1,2,3,4].map(i=>`<i class="${G.res[i]===1?'ok':G.res[i]===0?'no':''}"></i>`).join("");
}
function finishParty(){
  const ok=G.res.filter(x=>x).length,win=ok>=4,got=win?grant():0;snd(win?"gWin":"gLose");
  const share=`국회의원 카드뽑기 · 소속 정당을 맞춰라!\n${G.res.map(x=>x?"🟩":"⬜").join("")}  ${ok}/5`;
  view="result";
  $("#main").innerHTML=`<div class="res"><div class="big ${win?'win':'lose'}">${win?'성공!':'아쉬워요'}</div>
  <div class="sub">5문제 중 ${ok}문제 맞힘${G.best>=3?' · 최고 '+G.best+'연속':''}</div>
  <div class="dots" style="margin-top:12px">${G.res.map(x=>`<i class="${x?'ok':'no'}"></i>`).join("")}</div>
  ${got?`<div class="reward">🎁 보너스 팩 ${got}팩이 도착했어요 · 오늘의 팩에서 열 수 있어요<div class="packs">${PK(54)}${PK(54)}${PK(54)}</div></div>`:(win&&Q.done?'<p class="note">도감을 완성해서 보상은 없어요</p>':(win?'':'<p class="note">4문제 이상 맞히면 성공이에요</p>'))}
  <div class="row"><button class="btn block" id="sh">결과 공유하기</button>
  <button class="btn ghost block" id="again" ${Q.tickets<1?'disabled':''}>한 번 더 (용지 1장 · 남은 ${Q.tickets}장)</button>
  <button class="btn ghost block" id="ls">게임 목록</button></div>
  <p class="note">공유 글에는 정당이나 의원 이름이 들어가지 않아요. 평가가 아니에요.</p></div>`;
  if(win)buzz([30,50,30,50,80]);
  $("#sh").onclick=async()=>{try{await navigator.clipboard.writeText(share+"\n(링크)");toast("복사했어요")}catch(e){toast(share.replace(/\n/g," "))}};
  $("#again").onclick=()=>{sync();if(Q.tickets<1)return;Q.tickets--;save();startParty()};
  $("#ls").onclick=()=>{view="list";render()};
}

/* ---------- Medium: 카드 짝 맞추기 ---------- */
function startPairs(){
  const cards=shuffle(Q.owned).slice(0,5);
  G={kind:"pairs",cards,miss:0,matched:0,first:null,busy:true,phase:"peek",t:0};
  view="pairs";render();
}
const EMB='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="none" stroke="#d9b25c" stroke-width="2.5"/><circle cx="24" cy="24" r="16.5" fill="#d9b25c"/><circle cx="24" cy="24" r="16.5" fill="none" stroke="#f4dc9a" stroke-width="1"/><path d="M24 11.5l3.6 7.6 8.3 1-6.1 5.7 1.6 8.2-7.4-4.1-7.4 4.1 1.6-8.2-6.1-5.7 8.3-1z" fill="#2a1f78"/></svg>';
const METAL={"초선":"linear-gradient(135deg,#4a2a12,#b8783f 22%,#f6cf9c 38%,#8a5328 52%,#e0a96e 72%,#7a4620 88%,#4a2a12)","재선":"linear-gradient(135deg,#4b5056,#c6ccd2 22%,#ffffff 36%,#8d939a 52%,#e9edf0 72%,#7d838a 88%,#4b5056)","3선":"linear-gradient(135deg,#5e430b,#d7ac3c 22%,#fff3b8 36%,#a8801f 52%,#f0cf66 72%,#94701a 88%,#5e430b)"};
const METAL4="linear-gradient(135deg,#120f1a,#3a2f5c 18%,#d5b3ff 32%,#86ecdf 42%,#ffe08a 52%,#ff9ed2 62%,#3a2f5c 80%,#120f1a)";
function tileHtml(i,m){const c=PCOL[m[2]]||"#444";
  return `<button class="tile card" data-i="${i}" aria-label="카드"><div class="in"><div class="bk">${EMB}</div><div class="fr" style="--mt:${METAL[m[4]]||METAL4}"><div class="ci" style="background:${c};color:${onCol(c)}"><div class="ph">${SIL}<span class="tr">${esc(m[4])}</span></div><div class="nm">${esc(m[1])}</div></div></div></div></button>`}
function renderPairs(){
  stopAll();
  G.deck=shuffle([...G.cards,...G.cards]);G.matched=0;G.first=null;G.busy=true;G.phase="peek";
  $("#main").innerHTML=`<div class="top"><span>틀린 횟수 <b id="ms">0</b>/${MAXMISS}</span><span>맞춘 짝 <b id="mc">0</b>/5</span></div>
  <div class="sub" style="margin-bottom:8px">${Q.bm!=null?'내 최고 기록: 틀린 횟수 '+Q.bm+'번':'아직 기록이 없어요'}</div>
  <div class="cnt" id="cn"></div>
  <div class="board" id="bd">${G.deck.map((c,i)=>tileHtml(i,GM[c])).join("")}</div>
  <div class="banner" id="bn"></div>
  <div class="row"><button class="btn ghost block" id="rd">준비됐어요</button></div>
  <p class="note">같은 카드를 2장씩 맞추면 돼요. 틀리면 그 두 장만 다시 가려져요.</p>`;
  const tiles=[...R.querySelectorAll(".tile")];
  tiles.forEach((t,i)=>{loadPhoto(t.querySelector(".ph"),GM[G.deck[i]]);t.classList.add("open");t.onclick=()=>pick(i)});
  let left=PEEK;const cn=$("#cn");cn.textContent=left;
  const endPeek=()=>{if(G.phase!=="peek")return;G.phase="play";clearInterval(G.iv);cn.textContent="";$("#rd").hidden=true;tiles.forEach(t=>t.classList.remove("open"));later(()=>{G.busy=false;$("#bn").textContent="짝을 찾아보세요"},500)};
  G.iv=setInterval(()=>{left--;if(left<=0)endPeek();else cn.textContent=left},1000);
  $("#rd").onclick=endPeek;
}
function star(t){const r=t.getBoundingClientRect();for(let k=0;k<5;k++){const s=el(`<span class="star">✦</span>`);s.style.left=(r.left+r.width/2)+"px";s.style.top=(r.top+r.height/2)+"px";s.style.position="fixed";s.style.setProperty("--dx",(rnd(80)-40)+"px");s.style.setProperty("--dy",(rnd(80)-50)+"px");R.appendChild(s);setTimeout(()=>s.remove(),750)}}
function pick(i){
  if(G.busy||G.phase!=="play")return;
  const t=R.querySelectorAll(".tile")[i];if(t.classList.contains("open"))return;
  t.classList.add("open");snd("flip");
  if(G.first===null){G.first=i;return}
  const a=G.first,b=i;G.first=null;const ts=R.querySelectorAll(".tile");
  if(G.deck[a]===G.deck[b]){
    G.matched++;snd("gMatch");$("#mc").textContent=G.matched;[ts[a],ts[b]].forEach(x=>{x.classList.add("match");star(x)});buzz(25);
    $("#bn").textContent=G.matched<5?"짝!":"";
    if(G.matched===5){G.busy=true;later(finishPairs,900)}
  }else{
    G.busy=true;G.miss++;snd("gMiss");$("#ms").textContent=G.miss;[ts[a],ts[b]].forEach(x=>x.classList.add("wrong"));buzz([40,60,40]);
    if(G.miss>MAXMISS){$("#bn").textContent="기회를 모두 썼어요";later(failPairs,1200);return}
    $("#bn").textContent="아쉬워요! 두 장이 다시 가려져요";
    later(()=>{[ts[a],ts[b]].forEach(x=>x.classList.remove("open","wrong"));later(()=>{G.busy=false;$("#bn").textContent="짝을 찾아보세요"},450)},1100);
  }
}
function pairsResult(win){
  const n=G.miss,got=win?grant():0;snd(win?"gWin":"gLose");
  const newBest=win&&(Q.bm==null||n<Q.bm);if(newBest){Q.bm=n;save()}
  const share=`국회의원 카드뽑기 · 금배지 짝꿍 찾기\n${"🟥".repeat(Math.min(n,MAXMISS))}${win?"🟩":""}  ${win?(n===0?"한 번도 안 틀리고 성공":"틀린 횟수 "+n+"번으로 성공"):"아쉽게 실패"}`;
  view="result";
  $("#main").innerHTML=`<div class="res"><div class="big ${win?'win':'lose'}">${win?(n===0?'한 번도 안 틀렸어요!':'성공!'):'아쉬워요'}</div>
  <div class="sub">${win?'틀린 횟수 '+n+'번'+(newBest?' · 내 최고 기록이에요':(Q.bm!=null?' · 내 최고 '+Q.bm+'번':'')):'맞춘 짝 '+G.matched+'/5'}</div>
  ${got?`<div class="reward">🎁 보너스 팩 ${got}팩이 도착했어요 · 오늘의 팩에서 열 수 있어요<div class="packs">${PK(54)}${PK(54)}${PK(54)}</div></div>`:(win&&Q.done?'<p class="note">도감을 완성해서 보상은 없어요</p>':'')}
  <div class="row">${win?'<button class="btn block" id="sh">결과 공유하기</button>':''}
  <button class="btn ${win?'ghost ':''}block" id="again" ${Q.tickets<1||Q.owned.length<5?'disabled':''}>한 번 더 (용지 1장 · 남은 ${Q.tickets}장)</button>
  <button class="btn ghost block" id="ls">게임 목록</button></div>
  <p class="note">공유 글에는 의원 이름이 들어가지 않아요.</p></div>`;
  if(win)buzz([30,50,30,50,80]);
  const sh=$("#sh");if(sh)sh.onclick=async()=>{try{await navigator.clipboard.writeText(share+"\n(링크)");toast("복사했어요")}catch(e){toast(share.replace(/\n/g," "))}};
  $("#again").onclick=()=>{sync();if(Q.tickets<1)return;Q.tickets--;save();startPairs()};
  $("#ls").onclick=()=>{view="list";render()};
}
const finishPairs=()=>pairsResult(true),failPairs=()=>pairsResult(false);

function render(){
  if(view!=="party"&&view!=="pairs")stopAll();
  if(view==="list")renderList();
  else if(view.startsWith("intro-"))renderIntro(view.slice(6));
  else if(view==="party")renderParty();
  else if(view==="pairs")renderPairs();
  window.scrollTo(0,0);
}

window.renderGame=()=>{stopAll();view="list";render()};
window.gameLeave=()=>stopAll();
})();

/* ═══ 시작 ═══ */
initDex();initFind();
syncDx();updateCharge();
renderAll();
drawHall();resizeCurtain();if(!reduce)curtainLoop();
setInterval(()=>{if(updateCharge()){refreshPack();renderTop()}tickText()},1000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&updateCharge()){refreshPack();renderTop()}tickText()});
let rzT;addEventListener("resize",()=>{fitRegion(slots);clearTimeout(rzT);rzT=setTimeout(()=>{if(!$("tab-pack").hidden&&!stage.hidden){drawHall();resizeCurtain()}},150)});

/* 작은 카드(도감·방금 뽑은 카드)의 지역 한 줄 맞추기 */
(function(){
  let q=false;
  function fit(){
    q=false;
    document.querySelectorAll(".mt.ct .region:not([data-f])").forEach(r=>{
      r.dataset.f="1";
      const s=r.querySelector(".sido"),d=r.querySelector(".dist");
      if(s&&typeof sidoShort==="function")s.textContent=sidoShort(s.textContent);
      let fs=parseFloat(getComputedStyle(r).fontSize),n=0;
      while(r.scrollWidth>r.clientWidth+1&&fs>7&&n++<20){fs-=.5;r.style.fontSize=fs+"px"}
      if(r.scrollWidth>r.clientWidth+1&&s)s.remove();
    });
  }
  new MutationObserver(()=>{if(!q){q=true;requestAnimationFrame(fit)}}).observe(document.body,{childList:true,subtree:true});
  requestAnimationFrame(fit);
})();

/* ═══ 소리: 파일 없이 코드로 만든 배경음·효과음 (첫 터치 뒤 시작, 켜기/끄기 버튼) ═══
   v2: 소리가 작아서 안 들리던 문제를 고침(압축기로 크기 균형, 휴대폰 스피커에서 안 들리는 저음 보강),
       아이폰 무음 스위치 우회, 팩 열기·지역·선수·정당·공개·스페셜 단계마다 소리, 선수가 높을수록 화려하게 */
const SND=(()=>{
  let ctx=null,comp,master,sfx,amb,verb,ambTimer=null,spGain=null,spT0=0,spDone=true,on=true,keepEl=null,cur=0,lastFast=0,spRest=null;
  try{on=localStorage.getItem("sndOn")!=="0"}catch(e){}
  const N=n=>440*Math.pow(2,(n-69)/12);
  const CH=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]];   // Am F C G
  const PENT=[69,72,74,76,79,81,84];
  const R=(a,b)=>a+Math.random()*(b-a);
  const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  function irBuf(){   // 넓은 홀 울림(코드로 만든 잔향)
    const sr=ctx.sampleRate,len=Math.floor(sr*2.4),b=ctx.createBuffer(2,len,sr);
    for(let c=0;c<2;c++){const x=b.getChannelData(c);let lp=0;for(let i=0;i<len;i++){const k=1-i/len;lp+=((Math.random()*2-1)-lp)*(.2+.5*k);x[i]=lp*Math.pow(k,2.6)*1.8}}
    return b;
  }
  function init(){
    if(ctx)return true;
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    try{ctx=new AC()}catch(e){return false}
    comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=14;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.3;
    master=ctx.createGain();master.gain.value=on?1:0;comp.connect(master);master.connect(ctx.destination);
    verb=ctx.createConvolver();verb.buffer=irBuf();const vg=ctx.createGain();vg.gain.value=.8;verb.connect(vg);vg.connect(comp);
    sfx=ctx.createGain();sfx.connect(comp);const sv=ctx.createGain();sv.gain.value=.3;sfx.connect(sv);sv.connect(verb);
    amb=ctx.createGain();amb.gain.value=.0001;amb.connect(comp);const av=ctx.createGain();av.gain.value=.5;amb.connect(av);av.connect(verb);
    return true;
  }
  function tone(f,t,d,{type="sine",vol=.1,a=.01,dest=sfx,det=0}={}){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;o.detune.value=det;
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.05);
  }
  function bell(f,t,d,{vol=.1,dest=sfx,ratio=3.5,idx=2.2}={}){   // 맑은 종소리
    const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();
    c.frequency.value=f;m.frequency.value=f*ratio;
    mg.gain.setValueAtTime(f*idx,t);mg.gain.exponentialRampToValueAtTime(f*.02,t+d*.7);m.connect(mg);mg.connect(c.frequency);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.005);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    c.connect(g);g.connect(dest);c.start(t);m.start(t);c.stop(t+d+.05);m.stop(t+d+.05);
  }
  function noise(t,d,{vol=.1,f0=400,f1=4000,q=1,type="bandpass",dest=sfx}={}){
    const len=Math.floor(ctx.sampleRate*d),b=ctx.createBuffer(1,len,ctx.sampleRate),x=b.getChannelData(0);
    for(let i=0;i<len;i++)x[i]=Math.random()*2-1;
    const s=ctx.createBufferSource();s.buffer=b;const fl=ctx.createBiquadFilter();fl.type=type;fl.Q.value=q;
    fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+d);
    const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+d*.35);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    s.connect(fl);fl.connect(g);g.connect(dest);s.start(t);s.stop(t+d+.05);
  }
  function thump(t,f0,f1,d,vol,dest=sfx){   // 쿵: 휴대폰 스피커에서도 들리도록 딱 소리를 같이 섞음
    const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d*.6);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.05);
    noise(t,.05,{vol:vol*.5,f0:1800,f1:900,q:.8,dest});
  }
  function swell(notes,t,a,d,vol,{type="sawtooth",cut=1800,dest=sfx}={}){   // 서서히 커지는 화음
    notes.forEach(n=>[-6,6].forEach(dt=>{
      const o=ctx.createOscillator(),g=ctx.createGain(),fl=ctx.createBiquadFilter();
      o.type=type;o.frequency.value=N(n);o.detune.value=dt;fl.type="lowpass";fl.frequency.value=cut;
      g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      o.connect(fl);fl.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.05);
    }));
  }
  /* 배경음: 밤 의사당. 느린 화음 + 가끔 맑은 종소리 */
  let ci=0;
  function pad(){
    if(!ctx||ctx.state!=="running")return;
    const t=ctx.currentTime,ch=CH[ci++%CH.length],len=9;
    ch.forEach((n,i)=>{
      [-7,7].forEach(dt=>{
        const o=ctx.createOscillator(),g=ctx.createGain(),fl=ctx.createBiquadFilter();
        o.type=i<2?"sawtooth":"triangle";o.frequency.value=N(n);o.detune.value=dt;
        fl.type="lowpass";fl.frequency.setValueAtTime(500,t);fl.frequency.linearRampToValueAtTime(1500,t+4.5);fl.frequency.linearRampToValueAtTime(600,t+len+2);
        g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(.016,t+3);g.gain.linearRampToValueAtTime(.0001,t+len+2);
        o.connect(fl);fl.connect(g);g.connect(amb);o.start(t);o.stop(t+len+2.2);
      });
    });
    tone(N(ch[0]-12),t,len+1,{vol:.035,a:2.5,type:"triangle",dest:amb});          // 낮은 받침
    tone(N(ch[0]),t,len+1,{vol:.03,a:2.5,type:"sine",dest:amb});                  // 휴대폰에서도 들리는 중저음
    for(let k=0;k<3;k++)bell(N(PENT[Math.floor(Math.random()*PENT.length)]),t+1.5+k*2.6+R(0,1.2),3,{vol:.028,dest:amb});
  }
  function ambStart(){
    if(ambTimer||!ctx)return;
    amb.gain.cancelScheduledValues(ctx.currentTime);amb.gain.setTargetAtTime(.85,ctx.currentTime,1.2);
    pad();ambTimer=setInterval(pad,8000);
  }
  /* 아이폰: 무음 스위치가 켜져 있어도 소리가 나도록 오디오 세션을 '재생'으로 */
  function keepAlive(){
    try{if(navigator.audioSession)navigator.audioSession.type="playback"}catch(e){}
    if(!IOS)return;
    try{
      if(!keepEl){
        const sr=8000,n=sr,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
        w(0,"RIFF");v.setUint32(4,36+n*2,true);w(8,"WAVEfmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,"data");v.setUint32(40,n*2,true);
        for(let i=0;i<n;i++)v.setInt16(44+i*2,i%2?1:-1,true);
        keepEl=new Audio(URL.createObjectURL(new Blob([buf],{type:"audio/wav"})));keepEl.loop=true;keepEl.setAttribute("playsinline","");
      }
      if(on)keepEl.play().catch(()=>{});
    }catch(e){}
  }
  function hintOnce(){
    try{if(localStorage.getItem("sndHint"))return;localStorage.setItem("sndHint","1")}catch(e){}
    if(typeof toast==="function")toast("🔊 소리가 켜져 있어요. 오른쪽 위 버튼으로 끌 수 있어요");
  }
  function resume(){
    if(!init())return;
    keepAlive();
    if(ctx.state!=="running"){try{const bf=ctx.createBuffer(1,1,22050),sr=ctx.createBufferSource();sr.buffer=bf;sr.connect(ctx.destination);sr.start(0)}catch(e){}}
    const go=()=>{if(on){ambStart();hintOnce()}};
    if(ctx.state==="suspended")ctx.resume().then(go).catch(()=>{});else go();
  }
  function set(v){
    on=v;try{localStorage.setItem("sndOn",v?"1":"0")}catch(e){}
    if(!ctx){if(v)resume();return}
    master.gain.setTargetAtTime(v?1:0,ctx.currentTime,.08);
    if(v)resume();else if(keepEl)keepEl.pause();
  }
  let an=null,buf=null;
  function peak(){if(!ctx)return -1;if(!an){an=ctx.createAnalyser();an.fftSize=1024;master.connect(an);buf=new Float32Array(1024)}an.getFloatTimeDomainData(buf);let m=0;for(const v of buf)m=Math.max(m,Math.abs(v));return m}
  const ok=()=>{if(!ctx||!on)return false;if(ctx.state==="suspended")ctx.resume().catch(()=>{});return true};   // 풀리는 중이어도 소리를 예약해 둠
  /* 스페셜 공개 순간 */
  function spHit(h,dest){
    thump(h,90,34,1.8,.9,dest);thump(h,180,70,.5,.45,dest);
    noise(h,2.6,{vol:.4,f0:8000,f1:1800,q:.5,dest});
    swell([48,60,64,67,72,76],h,.05,4,.09,{cut:2400,dest});
    [84,88,91,95,100,103].forEach((n,i)=>bell(N(n),h+.15+i*.1,2.4,{vol:.06,dest}));
    for(let i=0;i<10;i++)bell(N(PENT[Math.floor(Math.random()*PENT.length)]+24),h+.5+R(0,1.4),1.2,{vol:.03,dest});
  }
  const api={
    get on(){return on},get state(){return ctx&&ctx.state},get peak(){return peak()},set,resume,
    set cur(v){cur=v},get cur(){return cur},
    tap(){if(!ok())return;const t=ctx.currentTime;tone(1100,t,.09,{type:"triangle",vol:.09});tone(1650,t+.02,.1,{type:"sine",vol:.04})},
    /* 오락실(게임) 효과음 */
    gOk(){if(!ok())return;const t=ctx.currentTime;bell(N(79),t,.6,{vol:.11});bell(N(86),t+.1,.9,{vol:.1})},
    gNo(){if(!ok())return;const t=ctx.currentTime;tone(196,t,.25,{type:"sawtooth",vol:.06});tone(147,t+.14,.4,{type:"sawtooth",vol:.06})},
    gTime(){if(!ok())return;const t=ctx.currentTime;[660,523,392].forEach((f,i)=>tone(f,t+i*.12,.22,{type:"triangle",vol:.08}))},
    flip(){if(!ok())return;const t=ctx.currentTime;noise(t,.08,{vol:.1,f0:2500,f1:1200,q:1});tone(900,t,.06,{type:"triangle",vol:.05})},
    gMatch(){if(!ok())return;const t=ctx.currentTime;bell(N(84),t,.6,{vol:.1});bell(N(91),t+.09,.9,{vol:.09});bell(N(96),t+.18,1,{vol:.07})},
    gMiss(){if(!ok())return;const t=ctx.currentTime;tone(170,t,.3,{type:"triangle",vol:.12});tone(130,t+.1,.3,{type:"triangle",vol:.08})},
    gWin(){if(!ok())return;const t=ctx.currentTime;[72,76,79,84,88,91].forEach((n,i)=>bell(N(n),t+i*.1,1.2,{vol:.09}));thump(t,140,60,.4,.25)},
    gLose(){if(!ok())return;const t=ctx.currentTime;[67,64,60].forEach((n,i)=>tone(N(n),t+i*.22,.6,{type:"triangle",vol:.08}))},
    /* 팩 열기: 쿵 → 포일 뜯는 소리 → 커튼 스르륵 → 반짝 */
    pack(){if(!ok())return;const t=ctx.currentTime;
      thump(t,160,50,.4,.42);
      noise(t+.05,.6,{vol:.2,f0:1500,f1:7500,q:1.5});
      for(let i=0;i<7;i++)noise(t+.08+R(0,.45),.03,{vol:.1,f0:R(2500,6000),f1:R(1500,3000),q:3});
      noise(t+.25,1.3,{vol:.12,f0:300,f1:2400,q:.7,type:"lowpass"});
      [79,83,86,91,95].forEach((n,i)=>bell(N(n),t+.55+i*.09,1.3,{vol:.07}));
    },
    /* 카드 한 장을 고름: 종이 넘기는 소리 */
    card(){if(!ok())return;const t=ctx.currentTime;noise(t,.2,{vol:.14,f0:1800,f1:5500,q:1});tone(N(84),t+.03,.12,{type:"triangle",vol:.05})},
    /* 건너뛰기로 한꺼번에 열 때(겹치지 않게 간격 둠) */
    fast(){if(!ok())return;const t=ctx.currentTime;if(t-lastFast<.35)return;lastFast=t;noise(t,.18,{vol:.12,f0:2000,f1:6000,q:1});bell(N(88),t+.04,.9,{vol:.06});bell(N(95),t+.1,.9,{vol:.04})},
    /* 단계 공개: 지역 → 선수(당선 횟수에 따라 화려해짐) → 정당 */
    step(label,rank){if(!ok())return;const t=ctx.currentTime,r=Math.max(0,Math.min(3,rank|0));
      if(/^지역/.test(label)){thump(t,420,200,.16,.14);bell(N(79),t+.02,.6,{vol:.04})}
      else if(/^선수/.test(label)){
        thump(t,200,70,.28,.14+.07*r);
        const seq=[[60],[64,67],[67,72,76,79],[72,76,79,84,88,91,96]][r];
        seq.forEach((n,i)=>bell(N(n),t+.03+i*(r>=2?.065:.07),1+.2*r,{vol:.06+.03*r}));
        if(r>=2)noise(t,.55,{vol:.07+.02*(r-2),f0:5000,f1:10000,q:1.5});
        if(r>=3)swell([48,60,72],t,.3,1.6,.04,{type:"triangle",cut:1600});
      }else{   // 정당
        noise(t,.5,{vol:.12,f0:400,f1:5000,q:1.2});
        thump(t+.3,130,50,.4,.2);
        swell([55,60,64,67],t+.28,.06,1.3,.05,{cut:1800});
      }
    },
    /* 카드 완성 순간: 선수가 높을수록 별가루가 많고 화음이 두꺼워짐 */
    burst(rank,quick){if(!ok())return;const t=ctx.currentTime,r=Math.max(0,Math.min(3,rank|0));
      thump(t,110,45,.55,.14+.08*r);
      if(!quick)noise(t,1.1,{vol:.04+.04*r,f0:7000,f1:2500,q:.5});
      const ch=[[72,76,79],[72,76,79],[72,76,79,84],[72,76,79,84,88,91]][r];
      ch.forEach((n,i)=>bell(N(n),t+.03+i*.03,1.8,{vol:.04+.015*r}));
      const sp=quick?2:3+3*r;
      for(let i=0;i<sp;i++)bell(N(PENT[Math.floor(Math.random()*PENT.length)]+12),t+.06+i*.07+R(0,.05),1.4,{vol:.03});
    },
    done(){if(!ok())return;const t=ctx.currentTime;[72,79,84].forEach((n,i)=>bell(N(n),t+i*.11,1.6,{vol:.06}))},
    setDone(){if(!ok())return;const t=ctx.currentTime;[72,76,79,84,88].forEach((n,i)=>bell(N(n),t+i*.12,2,{vol:.08}));swell([60,64,67,72],t+.4,.1,2.4,.05,{type:"triangle"});noise(t+.5,1,{vol:.1,f0:7000,f1:3000,q:.6})},
    /* 스페셜: 어두워짐 → 낮은 울림·타자 소리·점점 커지는 긴장 → 금빛 → 공개(4.7초) */
    spStart(len){
      if(!ok())return;const t=ctx.currentTime;api.spStop(true);
      spGain=ctx.createGain();spGain.connect(sfx);spT0=t;spDone=false;
      clearTimeout(spRest);amb.gain.setTargetAtTime(.1,t,.3);
      // 낮은 울림(높은 배음을 같이 쌓아 휴대폰 스피커에서도 들림)
      [33,40,45,52].forEach((n,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),fl=ctx.createBiquadFilter();o.type="sawtooth";o.frequency.value=N(n+(i>1?12:0));
        fl.type="lowpass";fl.frequency.setValueAtTime(200,t);fl.frequency.exponentialRampToValueAtTime(1800,t+4.5);
        g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+4.5);g.gain.exponentialRampToValueAtTime(.0001,t+5.4);
        o.connect(fl);fl.connect(g);g.connect(spGain);o.start(t);o.stop(t+5.6)});
      swell([57,60,64,69],t+.8,2.4,4.2,.03,{type:"triangle",cut:1500,dest:spGain});
      // 대사 글자가 나오는 동안 타자 소리
      const n=Math.max(8,len|0),iv=Math.max(32,Math.min(85,1800/n))/1000;
      for(let i=0;i<Math.min(n,70);i++)noise(t+.4+i*iv,.03,{vol:.06,f0:R(2500,4200),f1:R(1500,2500),q:4,dest:spGain});
      // 금빛이 번질 때 맑은 종소리
      [84,88,91,96].forEach((x,i)=>bell(N(x),t+3.5+i*.12,2,{vol:.05,dest:spGain}));
      // 올라가는 긴장
      noise(t+3,1.7,{vol:.22,f0:400,f1:9000,q:1.2,dest:spGain});
      const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(200,t+3);o.frequency.exponentialRampToValueAtTime(2200,t+4.7);
      g.gain.setValueAtTime(.0001,t+3);g.gain.exponentialRampToValueAtTime(.08,t+4.6);g.gain.exponentialRampToValueAtTime(.0001,t+4.75);o.connect(g);g.connect(spGain);o.start(t+3);o.stop(t+4.8);
      spHit(t+4.7,spGain);
    },
    /* 화면을 눌러 건너뛰면: 예약된 소리를 끊고 공개 소리를 바로. 끝까지 봤으면 울림이 끝까지 남게 둠 */
    spFinish(){
      if(!ctx||spDone)return;spDone=true;const t=ctx.currentTime;
      if(spGain&&t<spT0+4.6&&on){api.spStop(true);spGain=ctx.createGain();spGain.connect(sfx);spHit(t+.05,spGain)}
      clearTimeout(spRest);spRest=setTimeout(()=>{if(ctx&&amb)amb.gain.setTargetAtTime(.85,ctx.currentTime,1.5)},2200);
    },
    spStop(quick){
      if(spGain){const g=spGain;spGain=null;try{g.gain.cancelScheduledValues(ctx.currentTime);g.gain.setTargetAtTime(0,ctx.currentTime,quick?.02:.3);setTimeout(()=>{try{g.disconnect()}catch(e){}},2500)}catch(e){}}
      if(ctx&&amb&&!quick){clearTimeout(spRest);amb.gain.setTargetAtTime(.85,ctx.currentTime+.4,1)}
    }
  };
  function unlock(){
    if(!on)return;
    if(!init())return;
    keepAlive();
    if(ctx.state!=="running"){
      try{const bf=ctx.createBuffer(1,1,22050),sr=ctx.createBufferSource();sr.buffer=bf;sr.connect(ctx.destination);sr.start(0)}catch(e){}   // iOS: 무음 한 번 재생해야 소리가 풀려요
      ctx.resume().then(()=>{if(on){ambStart();hintOnce()}}).catch(()=>{});
    }else{ambStart();hintOnce()}
  }
  ["pointerdown","pointerup","touchstart","touchend","click","keydown"].forEach(ev=>addEventListener(ev,unlock,{passive:true,capture:true}));
  document.addEventListener("visibilitychange",()=>{if(!ctx)return;if(document.hidden){ctx.suspend();if(keepEl)keepEl.pause()}else if(on){ctx.resume().catch(()=>{});if(keepEl)keepEl.play().catch(()=>{})}});
  return api;
})();
(function(){
  const bar=document.querySelector(".appbar"),b=document.createElement("button");
  b.className="snd-btn";b.type="button";
  const paint=()=>{b.textContent=SND.on?"🔊":"🔇";b.setAttribute("aria-pressed",String(SND.on));b.setAttribute("aria-label",SND.on?"소리 끄기":"소리 켜기")};
  paint();b.addEventListener("click",e=>{e.stopPropagation();SND.set(!SND.on);paint();if(SND.on)setTimeout(()=>SND.tap(),150)});
  bar.appendChild(b);
  // 효과음 연결(함수를 감싸서, 원래 동작은 그대로 두고 소리만 얹음)
  const rk=c=>c&&c.terms?Math.min(c.terms,4)-1:0;      // 초선0 · 재선1 · 3선2 · 4선 이상3
  if(typeof reveal==="function"){const o=reveal;reveal=function(el,c,fast){SND.cur=rk(c);if(fast)SND.fast();else SND.card();return o.apply(this,arguments)}}
  if(typeof shout==="function"){const o=shout;shout=function(label){if(!skipNow)SND.step(label,SND.cur);return o.apply(this,arguments)}}
  if(typeof burst==="function"){const o=burst;burst=function(){SND.burst(SND.cur,!!skipNow);return o.apply(this,arguments)}}
  if(typeof thOpen==="function"){const o=thOpen;thOpen=function(p){SND.spStart(p&&p.q?p.q.length:20);return o.apply(this,arguments)}}
  if(typeof thFinish==="function"){const o=thFinish;thFinish=function(){SND.spFinish();return o.apply(this,arguments)}}
  if(typeof finish==="function"){const o=finish;finish=function(){const r=o.apply(this,arguments);try{(pk.last&&pk.last.sets&&pk.last.sets.length)?SND.setDone():SND.done()}catch(e){}return r}}
  const tb=document.getElementById("thBtn");if(tb)tb.addEventListener("click",()=>SND.spStop(false));
  const ob=document.getElementById("openBtn");if(ob)ob.addEventListener("click",()=>SND.pack());
  document.addEventListener("click",e=>{if(e.target.closest(".tabbar [data-tab]"))SND.tap()},true);
})();

/* ═══ PC: 팩 카드 넘기기 (양옆 화살표 · 점 눌러 이동 · 방향키) ═══ */
(function(){
  const sl=document.getElementById("slots"),st=sl&&sl.parentElement;if(!sl||!st)return;
  const mk=(cls,txt,label)=>{const b=document.createElement("button");b.type="button";b.className="sw-nav "+cls;b.textContent=txt;b.setAttribute("aria-label",label);st.appendChild(b);return b};
  const prev=mk("prev","‹","이전 카드"),next=mk("next","›","다음 카드");
  const tip=document.createElement("p");tip.className="sw-tip";tip.textContent="◀ ▶ 버튼이나 키보드 ← → 로 카드를 넘겨요";st.insertBefore(tip,sl);
  const step=()=>{const f=sl.firstElementChild;if(!f)return 300;const g=parseFloat(getComputedStyle(sl).columnGap)||14;return f.offsetWidth+g};
  const idx=()=>Math.round(sl.scrollLeft/step());
  const go=i=>{const n=sl.children.length;i=Math.max(0,Math.min(n-1,i));sl.scrollTo({left:i*step(),behavior:"smooth"})};
  const sync=()=>{const n=sl.children.length,k=idx();prev.disabled=k<=0;next.disabled=k>=n-1;prev.hidden=next.hidden=n<2};
  prev.addEventListener("click",()=>go(idx()-1));next.addEventListener("click",()=>go(idx()+1));
  sl.addEventListener("scroll",sync,{passive:true});
  new MutationObserver(sync).observe(sl,{childList:true});sync();
  const dots=document.getElementById("dots");
  dots.addEventListener("click",e=>{const i=[...dots.children].indexOf(e.target.closest("i"));if(i>=0)go(i)});
  addEventListener("keydown",e=>{
    if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;
    if(document.getElementById("tab-pack").hidden||document.querySelector(".modal")||!document.getElementById("theater").hidden)return;
    if(/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||""))return;
    e.preventDefault();go(idx()+(e.key==="ArrowRight"?1:-1));
  });
})();


/* ═══ 카드 크게 보기: PC 좌우 이동(화살표 버튼·방향키) + 효과음 ═══ */
(function(){
  const NAV={list:null};
  const snd=n=>{try{SND[n]&&SND[n].apply(SND,[].slice.call(arguments,1))}catch(e){}};
  const itemOf=t=>t.dataset.sp!==undefined?["sp",+t.dataset.sp]:["m",+t.dataset.id];
  const okItem=([k,i])=>k==="sp"?S.sp.includes(i):statusOf(MEM[i])!=="none";
  document.addEventListener("click",e=>{
    if(e.target.closest(".modal,.zm-nav"))return;
    const t=e.target.closest("#dexGrid .mt,#spTiles .mt,#exit .mt");
    if(!t){NAV.list=null;return}
    const root=t.closest("#dexGrid,#spTiles,#exit");
    NAV.list=[...root.querySelectorAll(".mt")].map(itemOf).filter(okItem);
  },true);
  const nav=document.createElement("div");nav.className="zm-nav";nav.hidden=true;
  nav.innerHTML='<button type="button" class="zm-btn prev" aria-label="이전 카드">‹</button><button type="button" class="zm-btn next" aria-label="다음 카드">›</button><span class="zm-tip">◀ ▶ 버튼이나 키보드 ← → 로 다음 카드를 봐요</span>';
  document.body.appendChild(nav);
  const prev=nav.querySelector(".prev"),next=nav.querySelector(".next");
  let cur=null;
  const idx=()=>NAV.list&&cur?NAV.list.findIndex(x=>x[0]===cur[0]&&x[1]===cur[1]):-1;
  const paint=()=>{const k=idx(),n=NAV.list?NAV.list.length:0;nav.hidden=!(k>=0&&n>1&&document.querySelector(".modal"));prev.disabled=k<=0;next.disabled=k<0||k>=n-1};
  const closeModal=()=>{document.querySelectorAll(".modal").forEach(m=>m.remove())};
  const open=it=>it[0]==="sp"?zoomSp(PRES[it[1]]):zoom(MEM[it[1]]);
  const go=d=>{const k=idx();if(k<0)return;const j=k+d;if(j<0||j>=NAV.list.length)return;closeModal();open(NAV.list[j])};
  prev.addEventListener("click",()=>go(-1));next.addEventListener("click",()=>go(1));
  addEventListener("keydown",e=>{
    if((e.key!=="ArrowLeft"&&e.key!=="ArrowRight")||!document.querySelector(".modal"))return;
    e.preventDefault();go(e.key==="ArrowRight"?1:-1);
  });
  const watch=m=>{
    const mo=new MutationObserver(()=>{if(!document.querySelector('.modal')){mo.disconnect();cur=null;nav.hidden=true}});
    mo.observe(document.body,{childList:true});
  };
  const zo=zoom,zs=zoomSp;
  zoom=function(c){cur=["m",MEM.indexOf(c)];snd("tap");const r=zo.apply(this,arguments);paint();watch(document.querySelector(".modal"));return r};
  zoomSp=function(p){cur=["sp",p.i];snd("card",4);const r=zs.apply(this,arguments);paint();watch(document.querySelector(".modal"));return r};
  // 탭·버튼 눌렀을 때 짧은 효과음
  document.addEventListener("click",e=>{if(e.target.closest("[data-tab],#dexSeg button,.chip,.zm-btn"))snd("tap")},true);
})();


/* ═══ 공유 · 캘린더 알림 ═══ */
function shareAct(k){
  const url=location.origin+location.pathname;
  if(k==="cal"){
    const ev=(h,n)=>["BEGIN:VEVENT","UID:cardpack-"+h+"@gukhoe-card","DTSTAMP:20261011T000000Z","DTSTART:20261012T"+String(h-9).padStart(2,"0")+"0000Z","DURATION:PT15M","RRULE:FREQ=DAILY","SUMMARY:국회의원 카드뽑기 · "+n,"DESCRIPTION:"+url,"BEGIN:VALARM","TRIGGER:PT0S","ACTION:DISPLAY","DESCRIPTION:새 팩이 충전됐어요","END:VALARM","END:VEVENT"].join("\r\n");
    const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//gukhoe-cardpack//KO","CALSCALE:GREGORIAN",ev(12,"점심 팩 충전"),ev(18,"퇴근길 팩 충전"),"END:VCALENDAR"].join("\r\n");
    const u=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"}));
    const a=document.createElement("a");a.href=u;a.download="카드뽑기_충전알림.ics";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);
    toast("캘린더 파일을 받았어요. 열어서 추가해 주세요.");return;
  }
  const text="국회의원 카드뽑기 · 22대 국회의원 299명을 카드 팩으로 모아 보세요 (비공식 서비스)";
  if(navigator.share){navigator.share({title:"국회의원 카드뽑기",text,url}).catch(()=>{});return}
  try{navigator.clipboard.writeText(url).then(()=>toast("링크를 복사했어요."),()=>toast(url))}catch(e){toast(url)}
}
if(location.hash==="#dev")document.querySelectorAll(".devonly").forEach(e=>e.hidden=false);
