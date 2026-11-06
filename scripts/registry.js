/* LNGVTY Builder — section/component registry. Extracted from index.html.
   Loaded before scripts/app.js. */
/* ─── SAFE STORAGE SHIM ───
   Some environments make localStorage throw on ANY access — Safari Private mode,
   storage disabled by policy, or over-quota. That would break the whole app since
   dozens of functions read/write it. This wraps it so it can NEVER throw: if the
   real localStorage is unavailable we transparently fall back to an in-memory
   store for the session. Everything downstream keeps working; only cross-reload
   persistence is lost (with a one-time heads-up). */
(function(){
  var mem={};
  var safe={
    getItem:function(k){try{return window.__realLS.getItem(k);}catch(e){return (k in mem)?mem[k]:null;}},
    setItem:function(k,v){try{window.__realLS.setItem(k,String(v));}catch(e){mem[k]=String(v);}},
    removeItem:function(k){try{window.__realLS.removeItem(k);}catch(e){delete mem[k];}},
    clear:function(){try{window.__realLS.clear();}catch(e){mem={};}}
  };
  var ok=false;
  try{
    window.__realLS=window.localStorage;
    var t='__ls_test__'+Math.random();
    window.__realLS.setItem(t,'1');window.__realLS.removeItem(t);
    ok=true;
  }catch(e){ok=false;}
  if(!ok){
    // real storage is unusable — replace it with the memory-backed shim
    try{Object.defineProperty(window,'localStorage',{configurable:true,get:function(){return safe;}});}
    catch(e){try{window.localStorage=safe;}catch(e2){}}
    window.__lsMemoryOnly=true;
  }
})();
/* ─── helpers ─── */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');}
function ph(text,style,tag){tag=tag||'div';return `<${tag} contenteditable="true" data-ph="${esc(text)}" style="${style}"></${tag}>`;}
/* link-aware button: renders an editable label that is itself the link target.
   data-href holds the destination; an edit pill lets the user change it. */
function btn(text,style,href,block){
  href=href||'#';
  const wrap=block?'display:block;position:relative;':'display:inline-block;position:relative;';
  return `<span class="editable-link" data-href="${esc(href)}" style="${wrap}">`
    + ph(text,style,'a')
    + `<button class="link-edit" type="button" onclick="openLinkModal(this)">&#128279; link</button>`
    + `<button class="btn-del" type="button" onclick="removeBtn(this)" title="Remove this button">&times;</button>`
    + `</span>`;
}
/* nav-style link: editable label + link, with a style toggle (filled vs plain).
   The edit pill sits at the BOTTOM so it never collides with the section controls
   in the top-right corner. filled=true => orange button; filled=false => plain text. */
const NAV_FILLED="display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:11px 22px;border-radius:4px;";
const NAV_PLAIN="display:inline-block;background:transparent;color:#d6d6d6;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:0;";
function navLink(text,filled,href,accentText){
  href=href||'#';
  let style=filled?NAV_FILLED:NAV_PLAIN;
  if(!filled&&accentText)style=style.replace('color:#d6d6d6','color:var(--accent)');
  return `<span class="editable-link nav-link" data-href="${esc(href)}" data-filled="${filled?'1':'0'}" style="display:inline-block;position:relative;">`
    + ph(text,style,'a')
    + `<button class="link-edit link-edit-btm" type="button" onclick="openLinkModal(this)">&#128279; link</button>`
    + `<button class="btn-del btn-del-btm" type="button" onclick="removeBtn(this)" title="Remove this link">&times;</button>`
    + `</span>`;
}
/* like btn() but the label is real (persisted) content, not ghost text —
   use where the label must survive export even if untouched (e.g. footer). */
function realBtn(text,style,href){
  href=href||'#';
  return `<span class="editable-link" data-href="${esc(href)}" style="display:inline-block;position:relative;">`
    + `<a contenteditable="true" href="${esc(href)}" style="${style}">${text}</a>`
    + `<button class="link-edit" type="button" onclick="openLinkModal(this)">&#128279; link</button>`
    + `</span>`;
}
function listBlock(items,proto,addLabel,containerStyle){
  return `<div class="li-list" data-proto="${esc(proto)}" style="${containerStyle||''}">${items.join('')}</div>
    <button class="li-add" onclick="addLi(this)">+ ${addLabel||'Add item'}</button>`;
}
/* reorder buttons to drop inside a .li-wrap (call alongside the li-del button) */
function liMoves(){return `<button class="li-move up" onclick="moveLi(this,-1)" title="Move up">▲</button><button class="li-move dn" onclick="moveLi(this,1)" title="Move down">▼</button>`;}
/* A drag handle for reordering list items by dragging (nicer than clicking the
   arrows many times). Used by the schedule sections. The handle sets draggable
   on its .li-wrap on mousedown; global handlers (wired once) do the reordering. */
function liDrag(){return `<button class="li-drag" title="Drag to reorder" onmousedown="startLiDrag(this)" onclick="return false;">⠿</button>`;}
/* calendar-pick button (SVG icon renders everywhere, unlike an emoji) */
function schedCalBtn(){return `<button class="sched-cal" onclick="openSchedCal(this)" title="Pick a date from the calendar"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" style="vertical-align:middle;"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="6.5" x2="14" y2="6.5"/><line x1="5.5" y1="1.5" x2="5.5" y2="4"/><line x1="10.5" y1="1.5" x2="10.5" y2="4"/></svg></button>`;}
let liDragSrc=null;
function startLiDrag(btn){
  const wrap=btn.closest('.li-wrap');if(!wrap)return;
  wrap.setAttribute('draggable','true');
  liDragSrc=wrap;
}
/* a single editable tag pill (translucent orange) */
function tagPill(text,style){
  const s=style||"display:inline-block;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:rgba(224,90,27,.12);color:var(--accent);padding:3px 10px;";
  // The gap between pills in the editor comes from .tag-wrap's flex `gap`, which is a
  // builder-only class that gets stripped on export — leaving the pills flush against
  // each other so they render as one connected orange blob in email. Carrying the
  // spacing as an inline margin on each pill makes it survive the export.
  return `<span class="tag-pill" style="display:inline-block;margin:0 6px 6px 0;">${ph(text,s,'span')}<button class="li-del" onclick="delTag(this)">×</button></span>`;
}
/* a wrap of addable tag pills */
function tagBlock(tags,pillStyle,wrapStyle){
  const proto=tagPill('New tag',pillStyle);
  return `<span class="tag-wrap" data-proto="${esc(proto)}" style="${wrapStyle||''}">${tags.map(t=>tagPill(t,pillStyle)).join('')}<button class="tag-add" onclick="addTag(this)" title="Add tag">+ tag</button></span>`;
}
/* a single stat cell (big number + label) */
function statCell(num,label){
  return `<div class="stat-cell" style="text-align:center;position:relative;padding:0 12px;">${ph(num,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;color:var(--accent);line-height:1;")}${ph(label,"font-size:9px;color:#aaa;letter-spacing:1px;text-transform:uppercase;margin-top:3px;")}<button class="li-del" onclick="delStat(this)" style="top:-6px;right:-2px;">×</button></div>`;
}
/* a centered, auto-formatting row of add/removable stat cells */
function statRow(cells){
  const proto=statCell('00','Label');
  return `<div class="stat-row" data-proto="${esc(proto)}" style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:8px 12px;">${cells.map(c=>statCell(c[0],c[1])).join('')}<button class="stat-add" onclick="addStat(this)" title="Add stat">+ stat</button></div>`;
}
/* the LNGVTY heartbeat / EKG line — a decorative SVG motif.
   stroke = line color, op = opacity. Sits absolutely inside a positioned parent. */
function ekg(stroke,op,pos){
  stroke=stroke||'var(--accent)';op=(op==null?0.1:op);
  pos=pos||'left:0;right:0;bottom:30px;';
  return `<svg viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;${pos}width:100%;height:80px;opacity:${op};pointer-events:none;">`
    +`<path d="M0 45 H300 L330 45 L350 12 L375 78 L400 30 L420 45 H560 L585 45 L605 20 L628 70 L650 45 H900 L925 45 L945 16 L968 74 L990 38 L1010 45 H1200" stroke="${stroke}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
/* a small inline heartbeat glyph (for logos / dividers) */
function ekgGlyph(stroke,w){
  stroke=stroke||'var(--accent)';w=w||34;
  return `<svg width="${w}" height="${Math.round(w*0.6)}" viewBox="0 0 34 20" fill="none" aria-hidden="true" style="vertical-align:middle;display:inline-block;"><path d="M1 10 H8 L11 3 L15 17 L19 7 L22 10 H33" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
/* an add/removable blog tip card (icon + heading + text), 2-up via flex-basis 45% */
function blogTipCard(icon,title,text){
  return `<div class="li-wrap" style="flex:1 1 45%;min-width:200px;border:1px solid rgba(127,127,127,.22);border-top:3px solid var(--accent);border-radius:8px;padding:22px 22px 24px;background:rgba(127,127,127,.06);">`
    +`<div style="font-size:24px;margin-bottom:10px;">${icon}</div>`
    +ph(title,"font-family:'Montserrat',sans-serif;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;line-height:1.3;")
    +ph(text,"font-size:15px;line-height:1.6;color:var(--secmuted);font-weight:300;",'p')
    +liMoves()
    +`<button class="li-del" onclick="delLi(this)">×</button></div>`;
}

/* ═══════════ SECTION LIBRARY ═══════════ */
const SECTIONS = {

  topbar:{group:'Structure',icon:'▬',name:'Top Bar',theme:'white',
    html:()=>`<div style="background:var(--accent);padding:10px 24px;text-align:center;">
      ${ph('LNGVTY Hub — Your Check-In',"font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;",'span')}
    </div>`},

  footer:{group:'Structure',icon:'▭',name:'Footer',theme:'white',mode:'both',
    html:()=>`<div style="padding:28px 48px;text-align:center;background:var(--secbg);">
      <div contenteditable="true" style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;letter-spacing:2px;color:var(--secmuted);margin-bottom:10px;">LNGVTY HUB · CARRBORO</div>
      <div style="text-align:center;margin:12px 0;">
        ${[['Facebook','https://www.facebook.com/LNGVTYHubNC'],['Instagram','https://www.instagram.com/lngvtyhub/'],['Website','https://lngvtyhub.com/']].map(([s,u])=>realBtn(s,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--secmuted);text-decoration:none;border:1px solid #ddd;padding:5px 12px;display:inline-block;margin:0 4px;",u)).join('')}
      </div>
      <p contenteditable="true" style="font-size:11px;color:var(--secmuted);line-height:1.8;">You're receiving this as a member of LNGVTY Hub. Unsubscribe.</p>
    </div>`},

  hero:{group:'Hero',icon:'★',name:'Hero (big number)',theme:'dark',
    html:()=>`<div style="background:var(--secbg);padding:48px 48px 44px;position:relative;overflow:hidden;">
      ${ph('30',"position:absolute;right:-10px;top:-10px;font-family:'Montserrat',sans-serif;font-weight:900;font-size:220px;color:rgba(127,127,127,0.10);line-height:1;z-index:0;")}
      ${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:30px;letter-spacing:2px;color:var(--sectext);margin-bottom:2px;position:relative;z-index:2;")}
      ${ph('Longevity Hub · Carrboro',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:var(--accent);margin-bottom:36px;position:relative;")}
      ${ph('30 Days In',"font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:10px;position:relative;")}
      ${ph('YOU SHOWED UP.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:56px;line-height:0.95;color:var(--sectext);text-transform:uppercase;margin-bottom:6px;position:relative;")}
      ${ph("That's not nothing — that's everything. 30 days of consistency is where most people quit. You didn't.","font-size:14px;color:var(--secmuted);font-weight:300;margin-top:20px;line-height:1.7;max-width:400px;position:relative;",'p')}
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--accent);"></div>
    </div>`},

  herochallenge:{group:'Hero',icon:'✦',name:'Hero (challenge badge)',theme:'dark',
    html:()=>`<div style="background:var(--secbg);padding:48px 48px 0;position:relative;overflow:hidden;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
        <div>${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:36px;letter-spacing:2px;color:var(--sectext);line-height:1;margin-bottom:2px;")}
        ${ph('Longevity Hub',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:var(--accent);")}</div>
        <div style="text-align:right;">${ph('Starts Jan 1',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--secmuted);")}
        ${ph('Keto 30-Day Challenge',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;color:var(--accent);margin-top:3px;")}</div>
      </div>
      <div style="padding-bottom:40px;">
        ${ph('Before you begin',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--secmuted);margin-bottom:10px;")}
        ${ph('Get Ready.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:68px;line-height:0.92;letter-spacing:2px;text-transform:uppercase;color:var(--sectext);margin-bottom:10px;")}
        ${ph('Everything you need to know before Day 1.',"font-family:'Montserrat',sans-serif;font-weight:300;font-size:14px;color:var(--secmuted);margin-top:16px;letter-spacing:1px;")}
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--accent);"></div>
    </div>`},

  statsbar:{group:'Stats',icon:'▦',name:'Stats Bar (orange)',theme:'white',
    html:()=>{
      const mk=(n,l)=>`<div class="li-wrap" style="flex:1;text-align:center;padding:20px 6px;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:#fff;line-height:1;margin-bottom:3px;")}${ph(l,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.78);")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--accent);padding:0 24px;">
        ${listBlock([mk('30','Days Strong'),mk('60','Seconds to Scan'),mk('1','Click to Book')],mk('0','Label'),'Add stat',"display:flex;justify-content:space-between;")}
      </div>`;}},

  statstrip:{group:'Stats',icon:'▤',name:'Stat Strip (dark)',theme:'gray',
    html:()=>{
      const mk=(n,l)=>`<div class="li-wrap" style="flex:1;text-align:center;padding:0 8px;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:36px;color:var(--accent);line-height:1;margin-bottom:4px;")}${ph(l,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--secmuted);")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:28px 40px;border-top:3px solid var(--accent);">
        ${listBlock([mk('30','Days Completed'),mk('20','Coaching Emails'),mk('18','Check-In Texts'),mk('1','Tougher You')],mk('0','New stat'),'Add stat',"display:flex;justify-content:space-around;")}
      </div>`;}},

  proofstrip:{group:'Stats',icon:'▣',name:'Proof Strip (3 stat)',theme:'dark',
    html:()=>{
      const mk=(n,l)=>`<div class="li-wrap" style="flex:1;text-align:center;padding:0 12px;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;color:var(--accent);line-height:1;margin-bottom:3px;")}${ph(l,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--secmuted);")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:20px 24px;">
        ${listBlock([mk('87%','See Results by Day 30'),mk('+6','Avg Score Gain'),mk('3.2lbs','Avg Fat Lost')],mk('0','New stat'),'Add stat',"display:flex;")}
      </div>`;}},

  greeting:{group:'Body',icon:'✎',name:'Greeting + Body',theme:'white',
    html:()=>{
      const para=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td valign="top">${ph(txt,"font-size:14px;color:var(--body-text);line-height:1.85;font-weight:300;margin-bottom:14px;",'p')}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:44px 48px 32px;border-bottom:1px solid #eee;">
        ${ph('Hey {{contact.first_name}},',"font-family:'Montserrat',sans-serif;font-size:18px;font-weight:700;color:var(--heading);margin-bottom:16px;",'p')}
        ${listBlock([para("You've been a member for 30 days — your first real milestone. We want to celebrate it the right way. Not with a certificate. With data.")],para('New paragraph'),'Add paragraph')}
      </div>`;}},

  introbox:{group:'Body',ngroup:'Newsletter',norder:1,icon:'❝',name:'Intro Box',theme:'white',mode:'both',
    html:()=>{
      const para=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td valign="top">${ph(txt,"font-size:14px;color:var(--body-text);line-height:1.85;font-weight:300;margin-bottom:10px;",'p')}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Pre-Start',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Before Day 1 Hits, Read This.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        <div style="background:#fafafa;border-left:3px solid var(--accent);padding:20px 24px;margin-top:14px;">
          ${listBlock([para("Hey {{contact.first_name}} — the challenge kicks off soon and we want you prepared, not winging it. This covers the four things that make or break week one.")],para('New paragraph'),'Add paragraph')}
        </div>
      </div>`;}},

  scancard:{group:'Body',icon:'☑',name:'Checklist Card (dots)',theme:'white',
    html:()=>{
      const mk=(b,t)=>`<div class="li-wrap" style="display:flex;gap:14px;align-items:flex-start;margin-bottom:12px;"><div style="width:10px;height:10px;background:var(--accent);flex-shrink:0;margin-top:5px;"></div>${ph('<strong>'+b+'</strong> — '+t,"font-size:13px;color:var(--body-text);font-weight:300;line-height:1.6;flex:1;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:44px 48px;">
        <div style="background:#fafafa;border:1px solid #e8e8e8;border-top:3px solid var(--accent);padding:24px;">
          ${ph('What Your 30-Day Scan Shows',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;text-transform:uppercase;color:var(--heading);margin-bottom:12px;")}
          ${listBlock([mk('Muscle vs. Fat shift','see how your composition changed since day one.'),mk('Hydration status','are you fueling your workouts properly?'),mk('InBody Health Score','one number tracking overall composition health.'),mk('Progress vs. baseline','side-by-side against your first scan.')],mk('New item','description here.'),'Add checklist item')}
        </div>
      </div>`;}},

  infocards:{group:'Body',icon:'❘',name:'Info Cards (stacked)',theme:'white',
    html:()=>{
      const mk=(t,d)=>`<div class="li-wrap" style="background:#fff;border:1px solid #e8e8e8;border-left:3px solid var(--accent);padding:18px 20px;margin-bottom:10px;">${ph(t,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:var(--heading);margin-bottom:5px;")}${ph(d,"font-size:13px;color:#777;font-weight:300;line-height:1.6;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${listBlock([mk('📈 Track Your Rate of Progress','Gaining muscle faster than losing fat? Your scan tells us what to push next.'),mk('🎯 Adjust Your Plan if Needed',"If something isn't moving right, now is the time to fix it."),mk('💊 Product Recommendations','Based on your scan, we may recommend supplements to support your goals.')],mk('🔹 Card Title','Card description goes here.'),'Add info card')}
      </div>`;}},

  progresscard:{group:'Body',icon:'◳',name:'Progress Card',theme:'dark',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      <div style="background:rgba(0,0,0,0.18);padding:28px;position:relative;overflow:hidden;">
        ${ph('60',"position:absolute;right:-8px;bottom:-16px;font-family:'Montserrat',sans-serif;font-weight:900;font-size:100px;color:rgba(127,127,127,0.12);line-height:1;pointer-events:none;")}
        ${ph('Why This Scan Matters',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;position:relative;")}
        ${ph('60 Days Is When The Data Gets Interesting',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;color:var(--sectext);text-transform:uppercase;line-height:1.1;margin-bottom:10px;position:relative;")}
        ${ph('Your first scan was a baseline. Your 30-day was a check-in. Your 60-day is the first real trend line.',"font-size:13px;color:var(--secmuted);font-weight:300;line-height:1.6;position:relative;",'p')}
      </div>
    </div>`},

  explainer:{group:'Body',icon:'◉',name:'Explainer + Macro Bar',theme:'gray',
    html:()=>{
      const mk=(p,l)=>`<div class="li-wrap" style="flex:1;background:rgba(0,0,0,0.2);border:1px solid #555;padding:12px 10px;text-align:center;">${ph(p,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:24px;line-height:1;margin-bottom:4px;color:var(--accent);")}${ph(l,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--secmuted);")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--bg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('The Basics',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('So What Is Keto, Actually?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph('Plain English. No biology degree required.',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        <div style="background:var(--secbg);border-top:3px solid var(--accent);padding:24px 28px;">
          ${ph('✦ The Simple Version',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:12px;")}
          ${ph('Your Body Has Two Fuel Sources. We Switch Which One You Use.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:18px;color:var(--sectext);text-transform:uppercase;margin-bottom:14px;line-height:1.2;")}
          ${ph('Normally your body runs on carbs. Keto cuts them low enough that you burn fat instead — a state called ketosis.',"font-size:13px;color:var(--secmuted);line-height:1.85;font-weight:300;",'p')}
          ${listBlock([mk('70%','Fat'),mk('25%','Protein'),mk('5%','Carbs')],mk('0%','Macro'),'Add macro',"display:flex;gap:8px;margin-top:18px;")}
          ${ph('Target: under 30g net carbs per day. About one medium banana.',"font-size:11px;color:var(--secmuted);margin-top:8px;text-align:center;font-style:italic;")}
        </div>
      </div>`;}},

  stockpurge:{group:'Lists',icon:'⇄',name:'Stock / Purge Columns',theme:'white',
    html:()=>{
      const row=(ic,t,d)=>`<div class="li-wrap" style="display:flex;align-items:flex-start;gap:10px;padding:9px 16px;border-bottom:1px solid #eee;font-size:12px;color:var(--body-text);font-weight:300;line-height:1.4;">${ph(ic,"font-size:13px;flex-shrink:0;padding-top:1px;",'span')}${ph('<strong style="color:var(--heading);font-weight:700;display:block;font-size:12px;">'+t+'</strong>'+d,"flex:1;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      const protoRow=row('🔹','Item Name','Short description.');
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Kitchen Setup',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Stock This. Toss That.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph('Do this before the challenge starts.',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr>
          <td style="width:50%;vertical-align:top;padding:0;">
            ${ph('✓ Stock Up',"padding:12px 16px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:#2d3d2d;color:#7bbf7b;")}
            <div style="background:#fafafa;padding:6px 0;">
              ${listBlock([row('🥩','Meat & Eggs','Beef, chicken, pork, eggs. Fatty cuts encouraged.'),row('🥑','Avocados','Eat them daily. A perfect keto food.'),row('🥦','Low-Carb Veg','Spinach, broccoli, zucchini, cauliflower.'),row('🫒','Oils & Fats','Olive oil, coconut oil, avocado oil.')],protoRow,'Add to stock list')}
            </div>
          </td>
          <td style="width:50%;vertical-align:top;padding:0;padding-left:8px;">
            ${ph('✕ Clear Out',"padding:12px 16px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;background:#3d2d2d;color:#c97070;")}
            <div style="background:#fafafa;padding:6px 0;">
              ${listBlock([row('🍞','Bread & Grains','Bread, pasta, rice, oats, cereal.'),row('🍬','Sugar — All Forms','Candy, soda, juice, honey, syrup.'),row('🥔','Starchy Veg','Potatoes, corn, peas, carrots.'),row('🍺','Beer & Sweet Drinks','Beer is liquid bread. Sugary mixers.')],protoRow,'Add to purge list')}
            </div>
          </td>
        </tr></table>
      </div>`;}},

  fludays:{group:'Lists',icon:'☷',name:'Day Cards',theme:'white',
    html:()=>{
      const mk=(d,t,f,desc,tip)=>`<div class="li-wrap" style="display:flex;background:#fafafa;border-left:3px solid var(--accent);margin-bottom:10px;">${ph(d,"background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;letter-spacing:1px;text-transform:uppercase;writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);padding:14px 10px;min-width:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;")}<div style="padding:14px 16px;flex:1;">${ph(t,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:var(--heading);margin-bottom:4px;text-transform:uppercase;")}${ph(f,"font-size:11px;color:var(--accent);font-family:'Montserrat',sans-serif;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;")}${ph(desc,"font-size:12px;color:#666;line-height:1.6;font-weight:300;")}${ph('<strong style="color:var(--heading);font-weight:700;">Do this:</strong> '+tip,"margin-top:8px;background:#fff;border:1px solid #eee;padding:8px 12px;font-size:11px;color:#888;line-height:1.5;")}</div><button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Days 1–3',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('The Keto Flu Is Real.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([mk('Day 1','Feeling Fine — For Now','Normal to slightly sluggish','Your body still has glucose stores. Day 1 is usually fine.','Drink more water than you think. Add a pinch of salt.'),mk('Day 2','The Wall','Headache · Tired · Foggy','Glucose is low and your body has not switched to fat yet.','Salt food aggressively. Magnesium 200–400mg. Eat enough fat.'),mk('Day 3','The Turn','Better by evening','Most people feel the shift by Day 3. Energy stabilizes.','Keep fat high. If cravings hit, eat fat — not carbs.')],mk('Day X','Title','How you will feel','Description.','Tip text.'),'Add day card')}
      </div>`;}},

  recaplist:{group:'Lists',icon:'≣',name:'Recap List',theme:'white',
    html:()=>{
      const mk=(ic,t,d)=>`<div class="li-wrap" style="display:flex;align-items:flex-start;border-left:3px solid var(--accent);background:#fafafa;padding:14px 18px;margin-bottom:10px;">${ph(ic,"font-size:18px;min-width:34px;padding-top:1px;")}<div style="flex:1;">${ph(t,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:var(--heading);margin-bottom:3px;text-transform:uppercase;")}${ph(d,"font-size:12px;color:#888;font-weight:300;line-height:1.5;")}</div><button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Challenge Recap',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('What You Survived.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([mk('🥑','30 Days of Ketogenic Eating','You rewired your metabolism. High fat, low carb.'),mk('📬','Daily Coaching','Thirty emails. Thirty texts. A whole team in your corner.'),mk('💪','Workouts & Recovery','You trained while fueling differently — and adapted.'),mk('📊','Measurable Results',"Body composition doesn't lie. Your scan shows what changed.")],mk('🔹','Recap Title','Description goes here.'),'Add recap item')}
      </div>`;}},

  numsteps:{group:'Lists',icon:'❶',name:'Numbered Steps',theme:'white',
    html:()=>{
      const mk=(n,t,d)=>`<div class="li-wrap" style="display:flex;align-items:flex-start;border-left:3px solid var(--accent);background:#fafafa;padding:14px 18px;margin-bottom:10px;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);min-width:30px;padding-top:2px;")}<div style="flex:1;">${ph(t,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:var(--heading);margin-bottom:3px;")}${ph(d,"font-size:12px;color:#888;font-weight:300;line-height:1.5;")}</div><button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Your Next Steps',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Three Things to Do This Week.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([mk('01','Book Your Final Scan — Today','Your 7-day window is open. Slots fill fast.'),mk('02','Claim Your Graduate Discount','7 days to lock in 50% off your next challenge.'),mk('03','Keep Eating Well This Week','One more consistent week so results reflect your work.')],mk('0X','Step Title','Step description.'),'Add step')}
      </div>`;}},

  stepsbig:{group:'Lists',icon:'➊',name:'Big Numbered Steps',theme:'white',
    html:()=>{
      const mk=(n,t,d)=>`<div class="li-wrap" style="display:flex;gap:18px;align-items:flex-start;margin-bottom:18px;">${ph(n,"background:var(--gray);color:#fff;font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-top:3px solid var(--accent);")}<div style="flex:1;">${ph(t,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:var(--heading);margin-bottom:4px;")}${ph(d,"font-size:13px;color:#777;font-weight:300;line-height:1.6;")}</div><button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('What to Expect',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Your Assessment, Step by Step',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([mk('1','Come In & Scan','Step on the InBody machine. 60 seconds, same as always.'),mk('2','Review Your Results','Sit with a coach through baseline vs 30 vs 60 vs 90.'),mk('3','Set Your Next Goals','Leave with a plan — training, nutrition, supplements.')],mk('N','Step Title','Step description.'),'Add step')}
      </div>`;}},

  testimonials:{group:'Social Proof',icon:'❞',name:'Testimonial Cards',theme:'white',
    html:()=>{
      const mk=(q,av,nm,rs)=>`<div class="li-wrap" style="background:#fff;border:1px solid #e8e8e8;border-left:4px solid var(--accent);padding:22px 24px;margin-bottom:12px;">${ph(q,"font-size:14px;color:#444;line-height:1.8;font-weight:300;font-style:italic;margin-bottom:14px;")}<div style="display:flex;align-items:center;gap:12px;">${ph(av,"width:40px;height:40px;background:var(--gray);border-top:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-weight:900;font-size:14px;color:#fff;flex-shrink:0;")}<div style="flex:1;">${ph(nm,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;text-transform:uppercase;color:var(--heading);letter-spacing:0.5px;")}${ph(rs,"font-size:11px;color:var(--accent);font-weight:700;margin-top:2px;letter-spacing:0.5px;")}</div></div><button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Member Results',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Real People. Real 30 Days.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([mk('"I didn\'t think I\'d see much in 30 days — score up 8 points, 4 lbs of fat gone."','JM','[Member Name]','↓ 4 lbs fat · ↑ score +8'),mk('"The scan showed me things I couldn\'t see in the mirror. That\'s when I committed."','SR','[Member Name]','↓ 2.3% body fat')],mk('"Quote goes here."','XX','[Member Name]','Result stat'),'Add testimonial')}
      </div>`;}},

  feedback:{group:'Social Proof',icon:'⊞',name:'Feedback Grid',theme:'white',
    html:()=>{
      const mk=(ic,t,d)=>`<div class="li-wrap" style="background:#fafafa;border:1px solid #e8e8e8;padding:14px 16px;text-align:center;">${ph(ic,"font-size:20px;margin-bottom:6px;")}${ph(t,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--heading);margin-bottom:3px;")}${ph(d,"font-size:11px;color:#999;font-weight:300;line-height:1.4;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Help Us Get Better',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Tell Us How It Went',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        <div style="background:#fff;border:1px solid #e8e8e8;border-top:3px solid var(--accent);padding:28px;">
          ${ph('Your Experience Matters',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:18px;text-transform:uppercase;color:var(--heading);margin-bottom:8px;")}
          ${ph("We'd love to hear what worked and what didn't. Takes 2 minutes.","font-size:13px;color:#666;font-weight:300;line-height:1.7;margin-bottom:20px;",'p')}
          ${listBlock([mk('⭐','Leave a Review','Google or Facebook'),mk('📋','Quick Survey','3 questions, 2 minutes'),mk('📸','Share Your Story',"Before/after — we'll feature you"),mk('💬','Just Reply','Tell us what worked')],mk('🔹','Option','Short detail.'),'Add feedback option',"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;")}
          ${btn('» Share Your Feedback',"display:block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 24px;text-align:center;border-radius:4px;",'#',true)}
        </div>
      </div>`;}},

  assessment:{group:'Highlight',icon:'◆',name:'Assessment Card',theme:'dark',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      <div style="background:rgba(0,0,0,0.18);padding:32px;position:relative;overflow:hidden;">
        <div style="position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:120px;color:rgba(127,127,127,0.10);pointer-events:none;">★</div>
        ${ph('Your 90-Day Assessment Includes',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;position:relative;")}
        ${ph('Full InBody Scan + Coach Review',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:var(--sectext);text-transform:uppercase;line-height:1.1;margin-bottom:12px;position:relative;")}
        ${ph('A complete scan compared against every previous data point, plus a 1-on-1 with a coach to set goals.',"font-size:13px;color:var(--secmuted);font-weight:300;line-height:1.7;position:relative;",'p')}
      </div>
    </div>`},

  offercode:{group:'Offers',icon:'%',name:'Offer Card (with code)',theme:'dark',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('60-Day Member Reward',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--secmuted);margin-bottom:6px;")}
      ${ph("You've Earned This.","font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
      <div style="background:rgba(0,0,0,0.18);padding:32px;text-align:center;">
        ${ph('Exclusive Member Discount',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:10px;")}
        ${ph('15% off',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:52px;color:var(--sectext);line-height:1;margin-bottom:4px;")}
        ${ph('Your Entire Next Shop Order',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;")}
        ${ph("You've put in the work. Use the code below for 15% off anything in the shop.","font-size:13px;color:var(--secmuted);font-weight:300;line-height:1.65;max-width:380px;margin:0 auto 20px;",'p')}
        <div style="display:inline-block;background:rgba(224,90,27,0.15);border:2px dashed var(--accent);padding:12px 28px;margin-bottom:6px;">
          ${ph('LNGVTY60',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;color:var(--accent);letter-spacing:4px;text-transform:uppercase;")}
        </div>
        ${ph('Valid 14 days · One use per member · Apply at checkout',"font-size:11px;color:var(--secmuted);margin-top:10px;font-weight:300;")}
      </div>
    </div>`},

  offerprice:{group:'Offers',icon:'$',name:'Offer Card (price drop)',theme:'white',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('Challenge Graduate Offer',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
      ${ph('You Earned This.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
      ${ph('An exclusive offer for people who finished.',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
      <div style="background:#fff8f4;border:2px solid var(--accent);padding:28px;text-align:center;">
        ${ph('✦ Graduates Only',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:10px;")}
        ${ph('Lock In Your Next Challenge at Half Price',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:24px;color:var(--heading);text-transform:uppercase;margin-bottom:6px;line-height:1.1;")}
        ${ph('You proved you can do it. Keep the momentum going.',"font-size:12px;color:#888;font-weight:300;margin-bottom:20px;")}
        <div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:20px;">
          ${ph('$199',"font-family:'Montserrat',sans-serif;font-size:22px;font-weight:700;color:#bbb;text-decoration:line-through;")}
          <div style="font-family:'Montserrat',sans-serif;font-size:18px;color:#ccc;">→</div>
          ${ph('$99',"font-family:'Montserrat',sans-serif;font-size:40px;font-weight:900;color:var(--accent);line-height:1;")}
        </div>
        ${ph('50% off any future challenge — valid 7 days · No code needed',"font-size:11px;color:#aaa;margin-bottom:20px;font-weight:300;")}
        <div style="margin-bottom:12px;">${btn('» Claim My Graduate Discount',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 36px;border-radius:4px;")}</div>
        ${ph('⏱ Offer Expires in 7 Days',"display:inline-block;background:var(--gray);color:var(--accent);font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;")}
      </div>
    </div>`},

  scanurgency:{group:'Highlight',icon:'⏱',name:'Scan Urgency + Countdown',theme:'white',
    html:()=>{
      const mk=(n,l)=>`<div class="li-wrap" style="flex:1;background:rgba(0,0,0,0.2);border:1px solid #444;padding:14px 10px;text-align:center;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:var(--accent);line-height:1;margin-bottom:4px;")}${ph(l,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaaaaa;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('⚠ Action Required',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Book Your Final Scan.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        <div style="background:var(--dark);border-top:3px solid var(--accent);padding:28px;">
          ${ph('⏱ 7-Day Window',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:4px 12px;margin-bottom:14px;")}
          ${ph('Your Results Lock In 7 Days From Today.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;color:#ffffff;text-transform:uppercase;margin-bottom:12px;line-height:1.15;")}
          ${ph("The leaderboard drops in 7 days. No scan before it closes means your results aren't included.","font-size:13px;color:#aaaaaa;line-height:1.8;font-weight:300;margin-bottom:20px;",'p')}
          ${listBlock([mk('7','Days Left'),mk('12','Slots Open'),mk('Jan 30','Results Drop')],mk('0','Label'),'Add counter',"display:flex;gap:10px;margin-bottom:20px;")}
          ${btn('» Book My Final Scan',"display:block;background:var(--accent);color:#fff;text-decoration:none;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;text-align:center;border-radius:4px;",'#',true)}
        </div>
      </div>`;}},

  timeline:{group:'Highlight',icon:'⟶',name:'Results Timeline',theme:'white',
    html:()=>{
      const mk=(icon,lbl,done)=>`<div class="li-wrap" style="flex:1;text-align:center;position:relative;"><div class="tl-dot" data-done="${done?1:0}" contenteditable="true" data-ph="${esc(icon)}" style="width:28px;height:28px;border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;color:#fff;background:${done?'var(--accent)':'#ccc'};"></div>${ph(lbl,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999;line-height:1.3;")}<button class="tl-toggle" type="button" onclick="toggleTlDot(this)" title="Toggle complete">${done?'✓':'○'}</button><button class="li-del" onclick="delLi(this)" style="top:-4px;">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Coming Soon',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('The Leaderboard Drops in 7 Days.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        <div style="background:#fafafa;border-top:3px solid var(--gray);padding:24px;">
          ${ph('📋 Results Timeline',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#888;margin-bottom:10px;")}
          ${ph('Complete Your Scan → Lock Your Rank → Win.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:17px;color:var(--heading);text-transform:uppercase;margin-bottom:16px;line-height:1.2;")}
          ${listBlock([mk('✓','Day 1 Baseline Scan',true),mk('✓','Challenge Complete',true),mk('→','Final Scan Window',false),mk('🏆','Leaderboard Live',false)],mk('•','New step',false),'Add timeline step',"display:flex;gap:0;margin-top:16px;")}
        </div>
      </div>`;}},

  reassurance:{group:'Highlight',icon:'📌',name:'Reassurance Note',theme:'white',
    html:()=>`<div style="background:var(--secbg);padding:0 48px 36px;">
      <div style="background:#fafafa;border-top:3px solid var(--gray);padding:20px 24px;">
        ${ph('📌 Important',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#bbb;margin-bottom:8px;")}
        ${ph('If you cheat — even once — your body re-stocks glucose and you restart the flu from Day 1. Straight through is fastest.',"font-size:13px;color:#666;line-height:1.8;font-weight:300;",'p')}
      </div>
    </div>`},

  urgencystrip:{group:'Strips',icon:'▮',name:'Urgency Strip',theme:'white',
    html:()=>`<div style="background:var(--accent);padding:22px 48px;">
      ${ph("Don't skip this scan — it's your proof of work.","font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:#fff;line-height:1.5;")}
      ${ph("Without a scan there's a gap in your data. Your future results are only as good as the checkpoints you complete.","font-size:12px;color:rgba(255,255,255,0.78);margin-top:6px;font-weight:300;line-height:1.6;")}
    </div>`},

  openerstrip:{group:'Strips',icon:'▬',name:'Opener Strip',theme:'white',
    html:()=>`<div style="background:var(--accent);padding:18px 48px 20px;">
      ${ph("The challenge hasn't started yet — but your prep starts right now. Read this end to end.","font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;color:#fff;line-height:1.4;letter-spacing:0.3px;")}
    </div>`},

  quotestrip:{group:'Strips',icon:'❛',name:'Quote Strip',theme:'white',
    html:()=>`<div style="background:var(--accent);padding:28px 48px;text-align:center;">
      ${ph('"Preparation isn\'t extra credit. It\'s the difference between quitting on Day 2 and finishing on Day 30."',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:17px;color:#fff;line-height:1.5;letter-spacing:0.3px;",'p')}
      ${ph('— The Longevity Hub Team',"display:block;margin-top:8px;font-family:'Montserrat',sans-serif;font-style:normal;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65);",'cite')}
    </div>`},

  cta:{group:'CTA',icon:'▶',name:'CTA Section',theme:'gray',
    html:()=>`<div style="background:var(--secbg);padding:44px 48px;text-align:center;">
      ${ph('Book Your Scan',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:var(--sectext);text-transform:uppercase;margin-bottom:8px;line-height:1.1;")}
      ${ph('Takes 60 seconds. Shows you everything. Book it now before the window passes.',"font-size:13px;color:var(--secmuted);margin-bottom:28px;font-weight:300;line-height:1.7;",'p')}
      ${btn('» Schedule My Scan',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:18px 44px;border-radius:4px;margin-bottom:16px;")}
      ${ph('Questions? Reply to this email — a real person will respond.',"font-size:12px;color:var(--secmuted);font-weight:300;",'p')}
    </div>`},

  embed:{group:'Embed',icon:'⧉',name:'Embed / GHL Form',theme:'white',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('Weekly Check-In',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
      ${ph('How Did This Week Go?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:16px;line-height:1.1;")}
      <div class="embed-host" data-embed="" style="border:2px dashed var(--accent);background:#fff8f4;padding:0;min-height:120px;">
        <div class="embed-empty" style="padding:36px 24px;text-align:center;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;">&#9881; Embed Slot</div>
          <div style="font-size:12px;color:#888;line-height:1.6;font-weight:300;">Paste your GoHighLevel form embed code (iframe / script).<br>Use the &ldquo;Edit Embed&rdquo; button on this block.</div>
        </div>
      </div>
      <button class="embed-edit-btn" type="button" onclick="openEmbedEditor(this)" style="margin-top:10px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">&#9998; Edit Embed Code</button>
    </div>`},

  video:{group:'Embed',icon:'▷',name:'Video (MP4)',theme:'white',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('Watch This',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
      ${ph('A Quick Word From Your Coach',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:16px;line-height:1.1;")}
      <div class="media-host" data-media-kind="video" data-src="" style="background:#000;border:1px solid #e8e8e8;">
        <video class="media-el" controls preload="metadata" style="width:100%;display:block;background:#000;">
          <source src="" type="video/mp4"/>
        </video>
        <div class="media-empty" style="padding:48px 24px;text-align:center;color:#888;">
          <div style="font-size:34px;margin-bottom:8px;">&#9654;</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#fff;margin-bottom:4px;">No video yet</div>
          <div style="font-size:11px;color:#aaa;line-height:1.5;">Set a public MP4 URL with &ldquo;Set Media URL&rdquo; below.</div>
        </div>
      </div>
      ${ph('Caption or short description of the video goes here.',"font-size:12px;color:#999;font-weight:300;margin-top:10px;text-align:center;font-style:italic;")}
      <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin-top:10px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">&#128279; Set Media URL (MP4)</button>
    </div>`},

  audio:{group:'Embed',icon:'♪',name:'Audio (MP3)',theme:'white',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('Listen In',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
      ${ph('This Week&rsquo;s Audio Coaching',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:16px;line-height:1.1;")}
      <div class="media-host" data-media-kind="audio" data-src="" style="background:#fafafa;border:1px solid #e8e8e8;border-top:3px solid var(--accent);padding:20px 24px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:44px;height:44px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;flex-shrink:0;">&#9835;</div>
          <div style="flex:1;">
            ${ph('Episode Title — Week 1 Recap',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;color:var(--heading);margin-bottom:2px;")}
            ${ph('LNGVTY Hub Coaching · 4 min',"font-size:11px;color:#999;font-weight:300;")}
          </div>
        </div>
        <audio class="media-el" controls preload="metadata" style="width:100%;margin-top:14px;display:block;">
          <source src="" type="audio/mpeg"/>
        </audio>
        <div class="media-empty" style="font-size:11px;color:#aaa;margin-top:8px;font-style:italic;">No audio set yet — use &ldquo;Set Media URL&rdquo; below to add a public MP3.</div>
      </div>
      <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin-top:10px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">&#128279; Set Media URL (MP3)</button>
    </div>`},

  /* ═══════════ NEWSLETTER SECTIONS ═══════════ */
  nlheader:{group:'Newsletter',norder:0,icon:'▦',name:'Newsletter Header + Quote',theme:'dark',mode:'newsletter',
    html:()=>`<div style="background:var(--accent);padding:10px 24px;text-align:center;">
        ${ph('LNGVTY Hub — Weekly Member Newsletter',"font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;")}
      </div>
      <div style="background:var(--dark);padding:40px 48px 0;border-bottom:4px solid var(--accent);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:30px;">
          <div>
            ${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:36px;letter-spacing:2px;color:#fff;line-height:1;margin-bottom:2px;")}
            ${ph('Longevity Hub',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:var(--accent);")}
          </div>
          <div style="text-align:right;">
            ${ph('Weekly Newsletter',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#888;")}
            ${ph('June 16, 2026',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;color:var(--accent);margin-top:3px;")}
          </div>
        </div>
      </div>
      <div style="background:var(--accent);padding:18px 48px 20px;">
        ${ph("Insert this week's quote here.","font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;color:#fff;line-height:1.4;")}
      </div>`},

  nlheaderlogo:{group:'Newsletter',norder:0.5,icon:'▦',name:'Newsletter Header + Logo',theme:'dark',mode:'newsletter',
    html:()=>`<div style="background:var(--accent);padding:10px 24px;text-align:center;">
        ${ph('LNGVTY Hub — Weekly Member Newsletter',"font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;")}
      </div>
      <div style="background:var(--dark);padding:40px 48px 0;border-bottom:4px solid var(--accent);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:30px;">
          <div style="flex:0 0 auto;">
            <img src="https://assets.cdn.filesafe.space/1Dpeq2oOH76aQnRKVqwT/media/6abb2e60b4d207ff9d2d236c.jpeg" alt="LNGVTY Longevity Hub" width="220" style="display:block;width:220px;max-width:60%;height:auto;border:0;"/>
          </div>
          <div style="text-align:right;">
            ${ph('Weekly Newsletter',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#888;")}
            ${ph('June 16, 2026',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;color:var(--accent);margin-top:3px;")}
          </div>
        </div>
      </div>
      <div style="background:var(--accent);padding:18px 48px 20px;">
        ${ph("Insert this week's quote here.","font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;color:#fff;line-height:1.4;")}
      </div>`},


  nlschedule:{group:'Newsletter',norder:2,icon:'☷',name:'Weekly Schedule',theme:'white',mode:'newsletter',
    html:()=>{
      // Each sub-event (a day can hold more than one). Plain block layout — no flex.
      const sub=(name,time)=>`<div class="sched-sub" style="position:relative;padding:4px 0;">
          ${ph(name,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:var(--heading);margin-bottom:2px;")}${ph(time,"font-size:11px;color:#999;font-weight:300;line-height:1.5;")}
          <button class="li-del hint-late" data-hint="Delete just this event" onclick="delSchedSub(this)" title="Remove this event">×</button></div>`;
      // A day row built as a TABLE so the orange bar + white card always fill the
      // full row height/width identically in every email client (no flex→table
      // guessing). Outer table = li-wrap; cell 1 = 5px accent bar, cell 2 = white
      // card holding an inner 2-col table (day/date | events).
      const mk=(day,date,name,time)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:10px;position:relative;">
        <tr>
          <td class="sched-lctrls" valign="top">
            <span class="sched-lwrap">
              ${liDrag()}
              <button class="li-del hint-late" data-hint="Delete this whole day" onclick="delLi(this)">×</button>
              ${schedCalBtn()}
            </span>
          </td>
          <td width="5" valign="top" style="width:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</td>
          <td valign="top" style="background:#fff;padding:10px 14px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>
              <td width="80" valign="top" style="width:80px;">${ph(day,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);")}${ph(date,"font-size:9px;color:#bbb;font-weight:300;margin-top:2px;")}</td>
              <td valign="top" class="sched-subs">${sub(name,time)}</td>
            </tr></table>
          </td>
          <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">
            <button class="sched-addsub" onclick="addSchedSub(this)" title="Add another event on this day">＋ event</button>
            ${liMoves()}
          </td>
        </tr>
      </table>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Every Week at LNGVTY',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Upcoming Schedule',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph('Same time, every week — no excuses.',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        <div style="background:#fafafa;padding:24px;">
          ${ph('Recurring Weekly Events',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:#bbb;text-transform:uppercase;margin-bottom:16px;")}
          <div class="sched-list">${listBlock([mk('Sunday','Date','Event Name','Time & details'),mk('Monday','Date','Event Name','Time & details'),mk('Tuesday','Date','Event Name','Time & details'),mk('Wednesday','Date','Event Name','Time & details'),mk('Thursday','Date','Event Name','Time & details'),mk('Friday','Date','Event Name','Time & details'),mk('Saturday','Date','Event Name','Time & details')],mk('Day','Date','Event Name','Time & details'),'Add day')}</div>
        </div>
      </div>`;}},

  nlmembers:{group:'Members',icon:'☺',name:'Welcome New Members',theme:'white',mode:'newsletter',
    html:()=>{
      const mk=(name)=>`<div class="li-wrap" style="flex:1;min-width:140px;text-align:center;padding:8px;">
        <div class="nl-pic" data-media-kind="image" data-src="" style="width:44px;height:44px;border-radius:50%;background:#eee;border:2px solid #e8e8e8;margin:0 auto 6px;display:none;overflow:hidden;"><img class="nl-pic-img" src="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
        ${ph(name,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;color:var(--heading);")}
        <button class="nl-pic-btn" type="button" onclick="openMemberPic(this)" style="display:none;margin:6px auto 0;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 8px;border-radius:4px;cursor:pointer;">Set Photo</button>
        <button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('New Faces',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Welcome New Members',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph('Give a warm welcome to everyone who joined this week.',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        <div style="background:#fafafa;padding:24px;">
          ${ph("We're so glad you're here. Say hi and make them feel at home.","font-size:13px;color:#777;line-height:1.65;font-weight:300;margin-bottom:18px;",'p')}
          <button class="nl-pictoggle" type="button" onclick="toggleMemberPics(this)" data-on="0" style="margin-bottom:14px;border:1px solid var(--accent);background:#fff;color:var(--accent);font-family:'Montserrat';font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:5px;cursor:pointer;">○ Member Photos: Off</button>
          ${listBlock([mk('Jordan M.'),mk('Sasha R.'),mk('Chris P.')],mk('First Last'),'Add member',"display:flex;flex-wrap:wrap;gap:6px;")}
        </div>
      </div>`;}},

  nlrecipe:{group:'Recipe',icon:'🍳',name:'Featured Recipe',theme:'white',mode:'newsletter',
    html:()=>{
      const ing=(v)=>`<div class="li-wrap" style="flex:1 1 45%;min-width:160px;color:#ccc;font-size:12px;font-weight:300;padding:2px 0;position:relative;"><span style="color:var(--accent);">—</span> ${ph(v,"display:inline;color:#ccc;",'span')}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      // Step number is auto-managed (non-editable) — renumbered on add/delete/reorder.
      const step=(n,v)=>`<div class="li-wrap" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;"><div class="step-num" style="background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:900;font-size:12px;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${n}</div>${ph(v,"font-size:13px;color:#666;line-height:1.6;font-weight:300;flex:1;padding-top:3px;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Recipe Corner',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph("This Week's Featured Recipe","font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph('High protein · Easy prep',"font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        <div class="nl-rpic" data-on="0" style="display:none;margin-bottom:14px;">
          <img class="nl-rpic-img" src="" alt="" style="display:block;width:100%;max-width:100%;height:auto;border:1px solid #e8e8e8;"/>
          <button class="nl-rpic-btn" type="button" onclick="openRecipePic(this)" style="margin-top:6px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;border-radius:4px;cursor:pointer;">Set Recipe Photo</button>
        </div>
        <button class="nl-rpictoggle" type="button" onclick="toggleRecipePic(this)" data-on="0" style="margin-bottom:14px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">+ Show Recipe Photo</button>
        <div style="border:1px solid #e8e8e8;border-top:3px solid var(--accent);margin-bottom:14px;padding:20px;">
          <div style="margin-bottom:4px;">${tagBlock(['High Protein','Prep: 35 min'],"display:inline-block;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:#fff3ef;color:var(--accent);padding:3px 8px;")}</div>
          ${ph('Sheet Pan Chicken & Veggies',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:18px;color:var(--heading);text-transform:uppercase;margin:10px 0 6px;")}
          ${ph('A simple, high-protein dinner that comes together on one pan in about 35 minutes.',"font-size:13px;color:#777;line-height:1.65;font-weight:300;margin-bottom:14px;",'p')}
          ${statRow([['42g','Protein'],['520','Calories'],['$3.50','Per Serving'],['48g','Total Carbs'],['32g','Net Carbs'],['6g','Sugar']])}
        </div>
        <div style="background:var(--gray);padding:18px 20px;margin-bottom:14px;">
          ${ph('Grocery List',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:var(--accent);text-transform:uppercase;margin-bottom:12px;")}
          ${listBlock([ing('Chicken thighs'),ing('Broccoli'),ing('Olive oil'),ing('Sweet potato')],ing('Ingredient'),'Add ingredient',"display:flex;flex-wrap:wrap;gap:0 16px;")}
        </div>
        <div class="nl-steps" data-on="0" style="display:none;background:#fafafa;border-top:3px solid var(--accent);padding:18px 20px;">
          ${ph('Instructions',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:var(--accent);text-transform:uppercase;margin-bottom:12px;")}
          <div class="steps-list">${listBlock([step('1','Preheat oven to 425°F and line a sheet pan.'),step('2','Toss chicken and veggies with olive oil and seasoning.'),step('3','Roast 30–35 minutes until cooked through.')],step('','New step'),'Add step')}</div>
        </div>
        <button class="nl-steptoggle" type="button" onclick="toggleRecipeSteps(this)" style="margin-top:10px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">+ Show Instructions Steps</button>
      </div>`;}},


  nlproduct:{group:'Recipe',icon:'🛍',name:'Featured Product',theme:'white',mode:'newsletter',
    html:()=>{
      // one detail chip: an editable label + value, add/removable. Kept roomy in a
      // 2-up flex so a product can carry price, size, calories, etc. without crowding.
      const field=(label,val)=>`<div class="li-wrap" style="flex:0 1 200px;min-width:150px;position:relative;padding:2px 0;">
        <button class="li-del" onclick="delLi(this)">\u00d7</button>
        ${ph(label,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--secmuted);margin-bottom:2px;")}
        ${ph(val,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;color:var(--sectext);")}
      </div>`;
      return `<div class="nl-prod" style="background:var(--secbg);padding:34px 40px 38px;border:1px solid rgba(127,127,127,.18);">
      ${ph('FEATURED PRODUCT',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:14px;")}
      <div class="nl-ppic" data-on="0" style="display:none;margin-bottom:16px;">
        <img class="nl-ppic-img" src="" alt="" style="display:block;width:100%;max-width:100%;height:auto;border:1px solid #e8e8e8;"/>
        <button class="nl-ppic-btn" type="button" onclick="openProductPic(this)" style="margin-top:6px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;border-radius:4px;cursor:pointer;">Set product photo</button>
      </div>
      <button class="nl-pptoggle" type="button" onclick="toggleProductPic(this)" data-on="0" style="margin-bottom:16px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:5px;cursor:pointer;">+ Show product photo</button>
      ${ph('Product Name',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:24px;line-height:1.15;color:var(--sectext);margin-bottom:6px;")}
      ${ph('One or two sentences on what it is and why a member would want it.',"font-size:14px;line-height:1.6;color:var(--secmuted);margin-bottom:18px;max-width:56ch;")}
      ${listBlock(
        [field('Price','$0.00'),field('Size','12 oz'),field('Best for','Post-workout')],
        field('Label','Value'),
        'field',
        'display:flex;flex-wrap:wrap;gap:14px 22px;margin-bottom:18px;')}
      <div class="editable-link nav-link" data-href="#" data-filled="1" style="display:inline-block;">
        <a href="#" contenteditable="true" style="display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:.5px;text-decoration:none;padding:12px 26px;border-radius:6px;">Shop Now \u203a</a>
        <button class="link-edit" type="button" onclick="openLinkModal(this)" title="Edit link">\ud83d\udd17</button>
      </div>
    </div>`;},
    desc:'A featured product with a toggleable photo, name, blurb, add/removable detail fields (price, size, etc.), and a linkable Shop button.'},

  nlproductgrid:{group:'Recipe',icon:'🛒',name:'Featured Products (grid)',theme:'white',mode:'newsletter',
    html:()=>{
      // one detail chip inside a card: compact label+value, add/removable.
      const field=(label,val)=>`<div class="li-wrap" style="flex:0 1 auto;min-width:0;position:relative;padding:1px 0;">
        <button class="li-del" onclick="delLi(this)">\u00d7</button>
        ${ph(label,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:8px;letter-spacing:1.2px;text-transform:uppercase;color:var(--secmuted);margin-bottom:1px;")}
        ${ph(val,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:14px;color:var(--sectext);")}
      </div>`;
      // one product card. Image is height-capped so it never balloons.
      const cardProto=`<div class="li-wrap nl-prod" style="flex:0 1 calc(50% - 9px);min-width:210px;position:relative;border:1px solid rgba(127,127,127,.18);background:var(--secbg);padding:0;display:flex;flex-direction:column;">
        <button class="li-del" onclick="delLi(this)" style="top:6px;right:6px;z-index:5;">\u00d7</button>
        <div class="nl-ppic" data-on="0" style="display:none;">
          <img class="nl-ppic-img" src="" alt="" style="display:block;width:100%;height:170px;object-fit:cover;background:#f0eee9;border-bottom:1px solid rgba(127,127,127,.15);"/>
          <button class="nl-ppic-btn" type="button" onclick="openProductPic(this)" style="display:block;width:100%;border:0;border-bottom:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;cursor:pointer;">Set photo</button>
        </div>
        <button class="nl-pptoggle" type="button" onclick="toggleProductPic(this)" data-on="0" style="margin:10px 12px 0;width:calc(100% - 24px);border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px;border-radius:4px;cursor:pointer;">+ Photo</button>
        <div style="padding:16px 18px 18px;display:flex;flex-direction:column;flex:1;">
          ${ph('Product Name',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:17px;line-height:1.15;color:var(--sectext);margin-bottom:5px;")}
          ${ph('A short line on why members want it.',"font-size:12.5px;line-height:1.5;color:var(--secmuted);margin-bottom:12px;flex:1;")}
          ${listBlock(
            [field('Price','$0.00'),field('Size','12 oz')],
            field('Label','Value'),
            'field',
            'display:flex;flex-wrap:wrap;gap:6px 16px;margin-bottom:14px;')}
          <div class="editable-link nav-link" data-href="#" data-filled="1" style="display:block;margin-top:auto;">
            <a href="#" contenteditable="true" style="display:block;text-align:center;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:.5px;text-decoration:none;padding:10px 14px;border-radius:5px;">Shop Now \u203a</a>
            <button class="link-edit" type="button" onclick="openLinkModal(this)" title="Edit link">\ud83d\udd17</button>
          </div>
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:34px 40px 38px;">
      ${ph('FEATURED PRODUCTS',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('Member picks this month',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.15;color:var(--sectext);margin-bottom:20px;")}
      ${listBlock(
        [cardProto,cardProto],
        cardProto,
        'product',
        'display:flex;flex-wrap:wrap;gap:18px;align-items:stretch;')}
    </div>`;},
    desc:'A grid of featured products, two per row, each with a fixed-size photo, name, blurb, add/removable detail fields, and a Shop button. Add or remove whole product cards.'},

  nlbigpic:{group:'Images',ngroup:'Images',icon:'▦',name:'Big Picture',theme:'white',mode:'newsletter',
    html:()=>`<div style="background:var(--secbg);padding:0;">
      <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
        <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;max-height:460px;"/>
        <div class="media-empty" style="padding:80px 24px;text-align:center;color:#999;">
          <div style="font-size:40px;margin-bottom:10px;">&#128247;</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#777;margin-bottom:4px;">Big Picture</div>
          <div style="font-size:12px;color:#aaa;line-height:1.5;">Set a public image URL with &ldquo;Set Image URL&rdquo; below.</div>
        </div>
      </div>
      <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:10px 40px 0;width:auto;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px 16px;border-radius:5px;cursor:pointer;">&#128247; Set Image URL</button>
      ${ph('Caption — add a short line about this photo (optional).',"margin:12px 40px 0;font-size:12px;color:var(--secmuted);font-style:italic;",'p')}
    </div>`,
    desc:'A single full-width featured image with an optional caption. Set the image with a public URL.'},

  nlimagerow:{group:'Images',ngroup:'Images',icon:'▤',name:'Image Row (columns)',theme:'white',mode:'newsletter',
    html:()=>{
      // one image column. Flex-basis of ~30% => the email export tableizes it to
      // a 3-across row; add/remove columns re-flows automatically.
      const colProto=`<div class="li-wrap" style="flex:1 1 30%;min-width:150px;position:relative;">
        <button class="li-del" onclick="delLi(this)" style="top:6px;right:6px;z-index:5;">×</button>
        <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
          <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;height:150px;"/>
          <div class="media-empty" style="padding:44px 10px;text-align:center;color:#999;">
            <div style="font-size:26px;margin-bottom:4px;">&#128247;</div>
            <div style="font-size:9px;color:#aaa;font-family:'Montserrat';letter-spacing:.5px;text-transform:uppercase;">Image</div>
          </div>
        </div>
        <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:8px 0 0;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px;border-radius:4px;cursor:pointer;">Set image</button>
      </div>`;
      return `<div style="background:var(--secbg);padding:30px 40px;">
      ${ph('Gallery',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('A few moments from this week',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.15;color:var(--sectext);margin-bottom:18px;")}
      ${listBlock([colProto,colProto,colProto],colProto,'column','display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;')}
    </div>`;},
    desc:'A row of side-by-side images (three by default). Click “+ column” to add another image or the × on a column to remove one — the row re-flows and exports as an email-safe table.'},

  nlimagetext:{group:'Images',ngroup:'Images',icon:'◧',name:'Image + Text',theme:'white',mode:'newsletter',
    html:()=>`<div style="background:var(--secbg);padding:30px 40px;">
      <div class="nl-it-row" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;">
        <div class="nl-it-pane" style="flex:1 1 44%;min-width:180px;">
          <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
            <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;max-height:260px;"/>
            <div class="media-empty" style="padding:60px 12px;text-align:center;color:#999;">
              <div style="font-size:32px;margin-bottom:6px;">&#128247;</div>
              <div style="font-size:9px;color:#aaa;font-family:'Montserrat';letter-spacing:.5px;text-transform:uppercase;">Image</div>
            </div>
          </div>
          <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:8px 0 0;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px;border-radius:4px;cursor:pointer;">Set image</button>
        </div>
        <div class="nl-it-pane" style="flex:1 1 44%;min-width:200px;">
          ${ph('Headline goes here',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;line-height:1.2;color:var(--sectext);margin-bottom:8px;")}
          ${ph('Write a short paragraph next to the image. Great for spotlighting a member, a new piece of equipment, or a story from the week.',"font-size:13.5px;line-height:1.7;color:var(--secmuted);font-weight:300;",'p')}
        </div>
      </div>
    </div>`,
    desc:'An image beside a headline and paragraph — good for a member spotlight or a story. Use “Flip sides” to swap which side the image is on. Stacks on mobile / narrow email clients.'},

  nlimagecard:{group:'Images',ngroup:'Images',icon:'▣',name:'Image Card + Button',theme:'white',mode:'newsletter',
    html:()=>`<div style="background:var(--secbg);padding:30px 40px;">
      <div style="border:1px solid rgba(127,127,127,.18);background:var(--secbg);">
        <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
          <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;max-height:300px;"/>
          <div class="media-empty" style="padding:70px 20px;text-align:center;color:#999;">
            <div style="font-size:36px;margin-bottom:8px;">&#128247;</div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#777;">Card Image</div>
          </div>
        </div>
        <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="display:block;width:100%;border:0;border-bottom:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:7px;cursor:pointer;">&#128247; Set image</button>
        <div style="padding:22px 24px 24px;text-align:center;">
          ${ph('Card Title',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:21px;line-height:1.15;color:var(--sectext);margin-bottom:8px;")}
          ${ph('One or two sentences describing what this is and why it matters.',"font-size:13.5px;line-height:1.7;color:var(--secmuted);font-weight:300;margin-bottom:16px;",'p')}
          ${btn('Learn More ›',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:12px 30px;border-radius:5px;",'https://lngvtyhub.com/')}
        </div>
      </div>
    </div>`,
    desc:'A framed image with a title, description, and a linkable button below it — like the “Learn More” / “See Event Details” cards. Set the button link with the \u{1f517} control.'},


  nlimagegrid:{group:'Images',ngroup:'Images',icon:'▦',name:'Image Grid (2×2)',theme:'white',mode:'newsletter',
    html:()=>{
      // one tile; ~48% basis => two across, wrapping to a 2x2 on export.
      const tileProto=`<div class="li-wrap" style="flex:1 1 46%;min-width:150px;position:relative;">
        <button class="li-del" onclick="delLi(this)" style="top:6px;right:6px;z-index:5;">×</button>
        <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
          <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;height:150px;"/>
          <div class="media-empty" style="padding:44px 10px;text-align:center;color:#999;">
            <div style="font-size:26px;margin-bottom:4px;">&#128247;</div>
            <div style="font-size:9px;color:#aaa;font-family:'Montserrat';letter-spacing:.5px;text-transform:uppercase;">Image</div>
          </div>
        </div>
        <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:8px 0 0;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px;border-radius:4px;cursor:pointer;">Set image</button>
      </div>`;
      return `<div style="background:var(--secbg);padding:30px 40px;">
      ${ph('Gallery',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('This month in photos',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.15;color:var(--sectext);margin-bottom:18px;")}
      ${listBlock([tileProto,tileProto,tileProto,tileProto],tileProto,'photo','display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;')}
    </div>`;},
    desc:'A 2×2 grid of photos (four by default). Add or remove tiles with “+ photo” / the × on a tile; exports as an email-safe table.'},

  nlphotobanner:{group:'Images',ngroup:'Images',icon:'▰',name:'Photo Banner (text overlay)',theme:'dark',mode:'newsletter',
    html:()=>`<div style="background:var(--secbg);padding:0;">
      <div class="media-host" data-media-kind="image" data-src="" style="position:relative;background:#2a2a2a;background-size:cover;background-position:center;min-height:220px;">
        <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;max-height:340px;"/>
        <div class="media-empty" style="padding:60px 20px;text-align:center;color:#bbb;">
          <div style="font-size:34px;margin-bottom:6px;">&#128247;</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#bbb;">Banner Image — set a wide photo below</div>
        </div>
      </div>
      <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="display:block;width:100%;border:0;background:rgba(224,90,27,0.10);color:var(--accent);font-family:'Montserrat';font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:7px;cursor:pointer;">&#128247; Set banner image</button>
      <div style="background:#1a1a1a;padding:22px 28px;text-align:center;">
        ${ph('Announcement Headline',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.15;color:#fff;text-transform:uppercase;margin-bottom:6px;")}
        ${ph('A short supporting line under the headline.',"font-size:13px;line-height:1.6;color:#cfcfcf;font-weight:300;",'p')}
      </div>
    </div>`,
    desc:'A wide photo banner with a headline and subtext on a dark bar beneath it — good for a big announcement. The caption bar keeps text readable in every email client.'},

  nlbeforeafter:{group:'Images',ngroup:'Images',icon:'◑',name:'Before / After',theme:'white',mode:'newsletter',
    html:()=>{
      const pane=(label)=>`<div style="flex:1 1 46%;min-width:150px;">
        <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);text-align:center;margin-bottom:8px;">${label}</div>
        <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;">
          <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;height:220px;"/>
          <div class="media-empty" style="padding:70px 10px;text-align:center;color:#999;">
            <div style="font-size:28px;margin-bottom:4px;">&#128247;</div>
            <div style="font-size:9px;color:#aaa;font-family:'Montserrat';letter-spacing:.5px;text-transform:uppercase;">Image</div>
          </div>
        </div>
        <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:8px 0 0;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:8.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px;border-radius:4px;cursor:pointer;">Set image</button>
      </div>`;
      return `<div style="background:var(--secbg);padding:30px 40px;">
      ${ph('Transformation',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('Member progress',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;line-height:1.15;color:var(--sectext);margin-bottom:18px;")}
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;">${pane('Before')}${pane('After')}</div>
      ${ph('A line of context about this transformation (optional).',"margin-top:12px;font-size:12px;color:var(--secmuted);font-style:italic;text-align:center;",'p')}
    </div>`;},
    desc:'Two labeled images side by side — Before and After — for member transformations or progress. Stacks on mobile.'},


  nlquicktip:{group:'Tips',ngroup:'Newsletter',icon:'✦',name:'Quick Tip',theme:'white',mode:'newsletter',
    html:()=>{
      const para=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td valign="top" style="text-align:center;">${ph(txt,"font-size:14px;color:var(--body-text);line-height:1.85;font-weight:300;margin-bottom:14px;text-align:center;",'p')}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:40px 48px 34px;border-bottom:1px solid #eee;text-align:center;">
        ${ph('QUICK TIP',"font-family:'Montserrat',sans-serif;font-size:20px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px;text-align:center;")}
        ${listBlock([para("A short, punchy tip goes here — one or two sentences the reader can act on this week.")],para('New paragraph'),'Add paragraph')}
      </div>`;}},

  nltip:{group:'Tips',icon:'💡',name:'Tip Tuesday',theme:'gray',mode:'newsletter',
    html:()=>{
      const mini=(icon,label,text)=>`<div class="li-wrap" style="flex:1 1 45%;min-width:150px;background:rgba(255,255,255,0.05);border-top:2px solid var(--accent);padding:14px;position:relative;">${ph(icon,"font-size:16px;margin-bottom:6px;")}${ph(label,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;")}${ph(text,"font-size:12px;color:#aaa;line-height:1.5;font-weight:300;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Tip Tuesday',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph("This Week's Focus","font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:16px;line-height:1.1;")}
        <div style="background:var(--dark);padding:28px;">
          ${ph('Tip Tuesday',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;")}
          <div style="margin-bottom:12px;">${tagBlock(['Recovery'],"display:inline-block;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:1px solid var(--accent);color:var(--accent);padding:3px 10px;")}</div>
          ${ph('Recovery Is Where Results Happen',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:#fff;text-transform:uppercase;line-height:1.2;margin-bottom:10px;")}
          ${ph("You don't get stronger in the gym — you get stronger when you recover from it. Prioritize these four this week.","font-size:13px;color:#aaa;line-height:1.7;font-weight:300;",'p')}
          <div style="margin-top:16px;">
          ${listBlock([mini('💧','Hydration','Half your bodyweight in ounces, daily.'),mini('🥩','Protein','Aim for 0.8–1g per lb of bodyweight.'),mini('😴','Sleep','7–9 hours. Non-negotiable for recovery.'),mini('🧘','Mobility','10 minutes of stretching after training.')],mini('⭐','New Tip','Short detail here.'),'Add tip',"display:flex;flex-wrap:wrap;gap:10px;")}
          </div>
        </div>
      </div>`;}},

  nlswaps:{group:'Nutrition',icon:'⇄',name:'Smarter Swaps',theme:'white',mode:'newsletter',
    html:()=>{
      const swap=(from,fromNote,to,toNote)=>`<div class="li-wrap" style="border:1px solid #eee;margin-bottom:10px;display:flex;align-items:stretch;position:relative;">
        <div style="width:45%;padding:14px 16px;background:#fff3ef;">${ph('Instead of',"font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:4px;font-weight:700;")}${ph(from,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;color:var(--heading);")}${ph(fromNote,"font-size:11px;color:#999;margin-top:2px;font-weight:300;")}</div>
        <div style="width:10%;display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:18px;font-weight:900;background:#fff;">→</div>
        <div style="width:45%;padding:14px 16px;background:#fafafa;">${ph('Try this',"font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-bottom:4px;font-weight:700;")}${ph(to,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;color:var(--heading);")}${ph(toNote,"font-size:11px;color:#999;margin-top:2px;font-weight:300;")}</div>
        <button class="li-del" onclick="delLi(this)">×</button></div>`;
      const prot=(name,cost)=>`<div class="li-wrap" style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eee;position:relative;">${ph(name,"font-size:13px;color:#555;font-weight:300;flex:1;")}${ph(cost,"font-size:13px;font-weight:700;color:var(--accent);")}<button class="li-del" onclick="delLi(this)" style="position:static;margin-left:8px;">×</button></div>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Nutrition Tips',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Smarter Swaps',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
        ${ph("Eating healthier doesn't have to mean eating boring.","font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
        ${listBlock([swap('Frappuccino','~400 cal','Iced espresso + oat milk','~60 cal'),swap('Potato chips','~300 cal','Roasted chickpeas','~120 cal')],swap('Instead of this','note','Try this','note'),'Add swap')}
        <div style="background:#fafafa;border:1px solid #e8e8e8;border-top:3px solid var(--accent);margin-top:16px;padding:18px 20px;">
          ${ph('💰 Budget-Friendly Proteins This Week',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--heading);margin-bottom:12px;")}
          ${listBlock([prot('Canned tuna','~$1.29'),prot('Eggs (dozen)','~$2.50'),prot('Chicken thighs','~$1.99/lb')],prot('Protein','~$0.00'),'Add protein')}
        </div>
      </div>`;}},

  nlevents:{group:'Events',icon:'📅',name:'Upcoming Events',theme:'white',mode:'newsletter',
    html:()=>{
      // One event within a day (a day can hold several). Stacks name+time, desc, tag.
      const evsub=(name,time,desc,tag)=>`<div class="evt-sub" style="position:relative;padding:10px 0;border-top:1px solid #f0f0f0;">
          <div style="margin-bottom:4px;">${ph(name,"font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:var(--heading);text-transform:uppercase;display:inline;")} <span class="evt-time" contenteditable="true" data-ph="${esc(time)}"></span></div>
          ${ph(desc,"font-size:12px;color:#888;line-height:1.6;font-weight:300;")}
          <div style="margin-top:6px;">${tagBlock(tag?[tag]:[],"display:inline-block;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;background:rgba(224,90,27,.12);color:var(--accent);")}</div>
          <button class="li-del hint-late" data-hint="Delete just this event" onclick="delEvtSub(this)" title="Remove this event">×</button>
        </div>`;
      // A day row: gray date box (left, fills full row height so it grows with the
      // sub-events) + content cell holding one or more events. Left controls
      // (drag / delete-day / calendar) and right controls (add-event / arrows)
      // mirror the Weekly Schedule. Built as a table for email safety.
      const ev=(month,day,weekday,name,time,desc,tag)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border-bottom:1px solid #f0f0f0;margin-bottom:2px;position:relative;">
        <tr>
          <td class="sched-lctrls" valign="top">
            <span class="sched-lwrap">
              ${liDrag()}
              <button class="li-del hint-late" data-hint="Delete this whole day" onclick="delLi(this)">×</button>
              ${schedCalBtn()}
            </span>
          </td>
          <td width="64" valign="middle" align="center" style="width:64px;background:var(--gray);padding:10px 8px;text-align:center;">${ph(month,"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;opacity:.7;")}${ph(day,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;color:#fff;line-height:1.1;")}${ph(weekday,"font-size:9px;color:#fff;opacity:.6;font-weight:300;text-transform:capitalize;margin-top:2px;")}</td>
          <td valign="top" style="padding:4px 16px;"><div class="evt-subs">${evsub(name,time,desc,tag)}</div></td>
          <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">
            <button class="sched-addsub" onclick="addEvtSub(this)" title="Add another event on this day">＋ event</button>
            ${liMoves()}
          </td>
        </tr>
      </table>`;
      return `<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
        ${ph('Special Events',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
        ${ph('Mark Your Calendar',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:20px;line-height:1.1;")}
        ${listBlock([ev('MON','00','Sunday','Event Name','Time','Short description.','Tag'),ev('MON','00','Monday','Event Name','Time','Short description.','Tag'),ev('MON','00','Tuesday','Event Name','Time','Short description.','Tag'),ev('MON','00','Wednesday','Event Name','Time','Short description.','Tag'),ev('MON','00','Thursday','Event Name','Time','Short description.','Tag'),ev('MON','00','Friday','Event Name','Time','Short description.','Tag'),ev('MON','00','Saturday','Event Name','Time','Short description.','Tag')],ev('MON','00','Weekday','Event Name','Time','Short description.','Tag'),'Add day')}
      </div>`;}},

  nl90:{group:'CTA',icon:'◷',name:'Coming Up on 90 Days?',theme:'white',mode:'both',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px;border-bottom:1px solid #eee;">
      ${ph('Your Progress',"font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:6px;")}
      ${ph('Coming Up on 90 Days?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--heading);text-transform:uppercase;margin-bottom:4px;line-height:1.1;")}
      ${ph("Don't let the milestone pass without making it count.","font-size:12px;color:#aaa;font-weight:300;margin-bottom:20px;")}
      ${ph("If you're approaching your 90-day mark — or you've already hit it — it's time to sit down with a coach. We'll pull up your FitManager data, review what's changed, and map out your next 90 days with fresh goals.","font-size:14px;color:#555;line-height:1.85;font-weight:300;margin-bottom:14px;",'p')}
      ${ph("Not sure where you're at? Check in with us — we'll look it up. Haven't scanned in a while? Come in before your review so your data is fresh.","font-size:14px;color:#555;line-height:1.85;font-weight:300;margin-bottom:20px;",'p')}
      ${btn('» Book Your 90-Day Review',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:4px;",'https://lngvtyhub.com/schedule/')}
    </div>`},

  nlcta:{group:'CTA',icon:'▶',name:'Newsletter Footer CTA',theme:'gray',mode:'newsletter',
    html:()=>`<div style="background:var(--secbg);padding:44px 48px;text-align:center;border-bottom:1px solid #eee;">
      ${ph('Ready for This Week?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;color:#fff;text-transform:uppercase;margin-bottom:8px;")}
      ${ph('Show up. Stay consistent. The results take care of themselves.',"font-size:13px;color:#aaa;margin-bottom:28px;font-weight:300;")}
      ${btn('» Book Your Session',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:18px 44px;border-radius:4px;",'https://app.chalkitpro.com/classschedulepublic/894')}
      <div style="margin-top:16px;">${ph('Questions? Reply to this email — a real person will respond.',"font-size:12px;color:#888;font-weight:300;")}</div>
    </div>`},

  /* ═══════════ BLOG / WEBPAGE SECTIONS (mode:'blog') ═══════════ */

  blognav:{group:'Header',icon:'▤',name:'Site Nav Bar',theme:'dark',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:18px 7%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
      <span style="display:flex;align-items:center;gap:10px;">${ekgGlyph('var(--accent)',32)}${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:24px;letter-spacing:1.5px;color:var(--sectext);",'span')}</span>
      <div style="display:flex;align-items:center;gap:26px;flex-wrap:wrap;">
        ${navLink('Get Started',false,'#')}
        ${navLink('Pricing',false,'#')}
        ${navLink('Schedule',false,'#')}
        ${navLink('Blog',false,'#',true)}
        ${navLink('Get Started »',true,'#')}
      </div>
    </div>`},

  bloghero:{group:'Header',icon:'★',name:'Blog Hero (EKG)',theme:'dark',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:84px 7% 92px;text-align:center;position:relative;overflow:hidden;">
      ${ekg('var(--accent)',0.10,'left:0;right:0;bottom:34px;')}
      <div style="position:relative;z-index:1;">
        ${tagBlock(['Recovery'],"display:inline-flex;align-items:center;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;background:rgba(224,90,27,.12);color:var(--accent);padding:7px 15px;border-radius:3px;","display:inline-block;margin-bottom:26px;")}
        ${ph("The One Habit That's Wrecking Your Results","font-family:'Montserrat',sans-serif;font-weight:900;font-size:56px;line-height:1.04;letter-spacing:-.5px;color:var(--sectext);text-transform:uppercase;max-width:880px;margin:0 auto 22px;")}
        ${ph("It's not your diet. It's not your program. It's the eight hours you keep treating as optional.","font-size:20px;line-height:1.6;color:var(--secmuted);font-weight:300;max-width:600px;margin:0 auto;",'p')}
        <div style="margin-top:30px;display:flex;align-items:center;justify-content:center;gap:13px;flex-wrap:wrap;">
          ${ph('By the LNGVTY Team',"font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--sectext);",'span')}
          <span style="color:var(--accent);">|</span>
          ${ph('June 2026',"font-size:13px;color:var(--secmuted);",'span')}
          <span style="color:var(--accent);">|</span>
          ${ph('5 min read',"font-size:13px;color:var(--secmuted);",'span')}
        </div>
      </div>
    </div>`},

  blogimage:{group:'Header',icon:'▦',name:'Featured Image',theme:'white',mode:'blog',
    html:()=>`<div style="background:#fff;padding:0;">
      <div class="media-host" data-media-kind="image" data-src="" style="background:#f0f0f0;border-bottom:3px solid var(--accent);">
        <img class="media-el" src="" alt="" style="width:100%;display:none;object-fit:cover;max-height:520px;"/>
        <div class="media-empty" style="padding:90px 24px;text-align:center;color:#999;">
          <div style="font-size:40px;margin-bottom:10px;">&#128247;</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#777;margin-bottom:4px;">Featured Image</div>
          <div style="font-size:12px;color:#aaa;line-height:1.5;">Set a public image URL with &ldquo;Set Image URL&rdquo; below.</div>
        </div>
      </div>
      <button class="media-edit-btn" type="button" onclick="openMediaEditor(this)" style="margin:10px 7% 0;width:auto;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px 16px;border-radius:5px;cursor:pointer;">&#128247; Set Image URL</button>
      ${ph('Caption — where and when this photo was taken.',"max-width:760px;margin:14px auto 0;padding:0 7%;font-size:13px;color:#7a7a7e;font-style:italic;text-align:center;",'p')}
    </div>`},

  blogintro:{group:'Content',icon:'¶',name:'Lead Paragraph (Drop Cap)',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:46px 7% 6px;">
      <div style="max-width:760px;margin:0 auto;">
        <p class="dropcap" contenteditable="true" data-ph="Showing up fully — for your training, your work, your family, and yourself — starts the night before. Good sleep isn't about feeling rested. It's the single biggest lever most people never pull, and it quietly decides how every other habit pays off." style="font-size:21px;line-height:1.7;color:var(--sectext);font-weight:400;margin:0;"></p>
      </div>
    </div>`},

  blogbody:{group:'Content',icon:'¶',name:'Article Text',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:18px 7%;">
      <div style="max-width:760px;margin:0 auto;">
        ${ph('Why It Hits Harder Than You Think',"font-family:'Montserrat',sans-serif;font-weight:800;font-size:31px;line-height:1.18;color:var(--sectext);text-transform:uppercase;letter-spacing:.3px;margin:28px 0 18px;")}
        ${ph("Write your article here. This is a full paragraph of body text — click to edit it. You can select any words to color them or turn them into a link using the floating bar. Keep paragraphs readable and let the content breathe.","font-size:18px;line-height:1.8;color:var(--secmuted);margin-bottom:24px;font-weight:300;",'p')}
        ${ph("Add a second paragraph to keep developing the idea. Short, clear sentences land best. When you want to emphasize something, select it and color it your brand orange.","font-size:18px;line-height:1.8;color:var(--secmuted);font-weight:300;",'p')}
      </div>
    </div>`},

  blogquote:{group:'Content',icon:'❝',name:'Pull Quote',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:30px 7%;">
      <div style="max-width:760px;margin:0 auto;border-left:5px solid var(--accent);padding:6px 0 6px 30px;">
        ${ph('"You don’t get stronger in the gym. You get stronger when you recover from it."',"font-family:'Montserrat',sans-serif;font-weight:700;font-style:italic;font-size:28px;line-height:1.38;color:var(--sectext);margin-bottom:12px;",'p')}
        ${ph('— Coach Tim, LNGVTY Hub',"font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent);",'span')}
      </div>
    </div>`},

  blogtips:{group:'Content',icon:'▥',name:'Tip Card Grid',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:24px 7%;">
      <div style="max-width:760px;margin:0 auto;">
        ${listBlock([
          blogTipCard('🧊','Keep Your Bedroom Cool','66–68°F is the sweet spot for deep sleep — a cooler room helps your core temperature drop.'),
          blogTipCard('☀️','Get Morning Sunlight','Even 10 minutes outside early sets your circadian rhythm for the night ahead.'),
          blogTipCard('☕','Cut Caffeine After 2PM','Caffeine has a six-hour half-life; that 3pm coffee is still half-active at 9pm.'),
          blogTipCard('📵','Screens Off an Hour Before','Blue light suppresses melatonin and tells your brain to stay alert.')
        ],blogTipCard('⭐','New Tip','Short detail here.'),'Add tip card',"display:flex;flex-wrap:wrap;gap:16px;")}
      </div>
    </div>`},

  blogtakeaway:{group:'Content',icon:'◆',name:'Takeaway Box',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:24px 7%;">
      <div style="max-width:760px;margin:0 auto;background:var(--dark);border-radius:12px;padding:34px 38px;position:relative;overflow:hidden;border-left:5px solid var(--accent);">
        ${ph('The Takeaway',"font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:12px;")}
        ${ph('Treat sleep like a training variable, not an afterthought. Protect it the way you’d protect a hard session — and watch everything else you’re already doing finally pay off.',"font-size:18px;line-height:1.7;color:#e7e7e7;font-weight:300;",'p')}
      </div>
    </div>`},

  blogdivider:{group:'Content',icon:'—',name:'Divider Rule',theme:'white',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:14px 7%;"><div style="max-width:760px;margin:0 auto;height:1px;background:rgba(127,127,127,.25);"></div></div>`},

  blognewsletter:{group:'Embed',icon:'✉',name:'Newsletter Embed',theme:'gray',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:60px 7%;border-top:1px solid rgba(127,127,127,.2);border-bottom:1px solid rgba(127,127,127,.2);">
      <div style="max-width:880px;margin:0 auto;">
        ${ph('This Week at LNGVTY',"font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--secmuted);margin-bottom:8px;text-align:center;")}
        ${ph('The Weekly Newsletter',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:32px;color:var(--sectext);text-transform:uppercase;margin-bottom:6px;text-align:center;")}
        ${ph('Everything happening at the Hub — schedule, events, recipes, and tips.',"font-size:15px;color:var(--secmuted);font-weight:300;text-align:center;margin-bottom:26px;",'p')}
        <div class="embed-host" data-embed="" style="border:2px dashed var(--accent);background:#fff;padding:0;min-height:140px;border-radius:12px;">
          <div class="embed-empty" style="padding:56px 24px;text-align:center;">
            <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;">&#9993; Newsletter Embed Slot</div>
            <div style="font-size:13px;color:#888;line-height:1.6;font-weight:300;">Paste the <strong>exported newsletter HTML</strong> (or an iframe) here to embed this week&rsquo;s newsletter right in the blog post.<br>Use the &ldquo;Edit Embed&rdquo; button below.</div>
          </div>
        </div>
        <button class="embed-edit-btn" type="button" onclick="openEmbedEditor(this)" style="margin-top:12px;width:100%;border:1px dashed var(--accent);background:rgba(224,90,27,0.06);color:var(--accent);font-family:'Montserrat';font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:11px;border-radius:5px;cursor:pointer;">&#9998; Edit Newsletter Embed</button>
      </div>
    </div>`},

  blogcta:{group:'CTA',icon:'▶',name:'Blog CTA Banner (EKG)',theme:'orange',mode:'blog',
    html:()=>`<div style="background:var(--secbg);padding:66px 7%;text-align:center;position:relative;overflow:hidden;">
      ${ekg('#1a1a1a',0.16,'left:0;right:0;top:50%;transform:translateY(-50%);')}
      <div style="position:relative;z-index:1;max-width:640px;margin:0 auto;">
        ${ph('Ready to Start Your Journey?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:38px;color:var(--sectext);text-transform:uppercase;margin-bottom:14px;line-height:1.08;")}
        ${ph("Join Carrboro's longevity & performance hub — diagnostics, fitness, recovery.","font-size:18px;color:var(--secmuted);margin-bottom:30px;font-weight:300;",'p')}
        ${btn('Get Started »',"display:inline-block;background:#1a1a1a;color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;letter-spacing:1.6px;text-transform:uppercase;text-decoration:none;padding:18px 46px;border-radius:5px;",'#')}
      </div>
    </div>`},

  blogfooter:{group:'CTA',icon:'▭',name:'Site Footer',theme:'dark',mode:'blog',
    html:()=>`<div style="background:var(--dark);padding:54px 7% 40px;text-align:center;">
      <span style="display:inline-flex;align-items:center;gap:11px;margin-bottom:8px;">
        ${ekgGlyph('var(--accent)',30)}
        ${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:24px;letter-spacing:1.5px;color:#fff;",'span')}
        <span style="color:var(--accent);font-weight:300;font-size:22px;">|</span>
        ${ph('Carrboro',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px;letter-spacing:2px;text-transform:uppercase;color:#cfcfcf;",'span')}
      </span>
      <div style="max-width:360px;height:1px;background:#3a3a3c;margin:14px auto 16px;"></div>
      ${ph('601-A W Main St, Carrboro · 919-914-0249',"font-size:13px;color:#888;margin-bottom:22px;font-weight:300;")}
      <div style="display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;">
        ${realBtn('Facebook',"display:inline-block;color:#cfcfcf;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:6px 18px;",'https://www.facebook.com/LNGVTYHubNC')}
        <span style="color:#3a3a3c;">|</span>
        ${realBtn('Instagram',"display:inline-block;color:#cfcfcf;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:6px 18px;",'https://www.instagram.com/lngvtyhub/')}
        <span style="color:#3a3a3c;">|</span>
        ${realBtn('Website',"display:inline-block;color:#cfcfcf;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:6px 18px;",'https://lngvtyhub.com/')}
      </div>
      <div style="margin-top:22px;">${ph('© 2026 LNGVTY Hub. All rights reserved.',"font-size:11px;color:#666;",'span')}</div>
    </div>`},


  /* ═══════════ WHOLE30: THE INVESTIGATION ═══════════
     A full case-file kit for the Whole30 challenge. The conceit: the participant
     is the investigator, the suspects are food groups, and the evidence is how
     they feel. Everything lives in the Graphics tab under its own sub-tab so a
     graphic can be built for every day of the 30, not just week boundaries.
     Shared visual language: manila/case-file cream, redacted bars, stencil
     stamps, evidence tape, monospace "typewriter" case data. */

  invCaseFile:{group:'Investigation',norder:0,icon:'🗂',name:'Case File Cover',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);position:relative;">
      <div style="height:6px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
      <div style="padding:38px 48px 10px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
        ${ph('LNGVTY HUB','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:20px;letter-spacing:2px;color:var(--sectext);line-height:1;')}
        ${ph('EVIDENCE LAB','font-family:\'JetBrains Mono\',monospace;font-size:9px;font-weight:700;letter-spacing:3px;color:var(--accent);text-align:right;')}
      </div>
      <div style="padding:10px 48px 6px;">
        <div style="display:inline-block;border:2px solid var(--accent);padding:5px 14px;transform:rotate(-2deg);">
          ${ph('CONFIDENTIAL','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:13px;letter-spacing:5px;color:var(--accent);')}
        </div>
      </div>
      <div style="padding:22px 48px 12px;">
        ${ph('CASE #W30-001','font-family:\'JetBrains Mono\',monospace;font-size:12px;letter-spacing:2px;color:var(--secmuted);margin-bottom:14px;')}
        ${ph('THE CASE OF THE MISSING HEALTH','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:44px;line-height:.98;letter-spacing:-.5px;color:var(--sectext);text-transform:uppercase;')}
      </div>
      <div style="padding:14px 48px 40px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tbody><tr>
            <td valign="top" style="padding-right:28px;">
              ${ph('SUBJECT','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:var(--secmuted);margin-bottom:4px;')}
              ${ph('You','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;color:var(--accent);')}
            </td>
            <td valign="top" style="padding-right:28px;">
              ${ph('DURATION','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:var(--secmuted);margin-bottom:4px;')}
              ${ph('30 Days','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);')}
            </td>
            <td valign="top">
              ${ph('STATUS','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:var(--secmuted);margin-bottom:4px;')}
              ${ph('OPEN','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);')}
            </td>
          </tr></tbody>
        </table>
      </div>
      <div style="height:6px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
    </div>`},

  invBriefing:{group:'Investigation',norder:1,icon:'📋',name:'Investigator Briefing',theme:'cream',mode:'graphics',
    html:()=>{
      const sym=(t)=>`<div class="li-wrap" style="position:relative;padding:6px 0 6px 26px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--sectext);"><span style="position:absolute;left:0;top:6px;width:13px;height:13px;border:2px solid var(--accent);"></span>${ph(t,'display:block;min-height:17px;')}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:40px 48px 44px;border:1px solid rgba(0,0,0,.10);">
      ${ph('INVESTIGATOR BRIEFING','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('The subject has reported the following:','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:24px;line-height:1.15;color:var(--sectext);text-transform:uppercase;margin-bottom:6px;')}
      ${ph('Over the past several years, one or more of these has gone unexplained. The culprit remains unknown.','font-size:14px;line-height:1.65;color:var(--secmuted);max-width:52ch;margin-bottom:20px;')}
      ${listBlock([sym('Afternoon crashes'),sym('Poor sleep'),sym('Digestive issues'),sym('Low energy'),sym('Brain fog'),sym('Joint pain'),sym('Cravings'),sym('Mood swings')],sym('New symptom'),'symptom','display:flex;flex-wrap:wrap;gap:0 34px;')}
      <div style="margin-top:24px;padding-top:18px;border-top:1px dashed rgba(0,0,0,.18);">
        ${ph('YOUR ASSIGNMENT','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:3px;color:var(--accent);margin-bottom:6px;')}
        ${ph('Gather enough evidence over the next 30 days to identify the offenders.','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:16px;line-height:1.5;color:var(--sectext);max-width:48ch;')}
      </div>
    </div>`;}},

  invSuspects:{group:'Investigation',norder:2,icon:'🔍',name:'Suspect Board (click to flip)',theme:'dark',mode:'graphics',
    html:()=>{
      const card=(name,aliases,motives)=>`<div class="li-wrap sus-card" data-flipped="0" style="flex:0 1 210px;min-width:180px;position:relative;" onclick="flipSuspect(this,event)">
        <button class="li-del" onclick="event.stopPropagation();delLi(this)">×</button>
        <button class="sus-flip" onclick="event.stopPropagation();flipSuspect(this.closest('.sus-card'))" title="Flip card">⟳</button>
        <div class="sus-front" style="display:block;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.18);border-top:3px solid var(--accent);padding:20px 18px 18px;text-align:center;min-height:150px;">
          ${ph('SUSPECT','font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:3px;color:var(--secmuted);margin-bottom:12px;')}
          <div style="width:52px;height:52px;margin:0 auto 12px;border:2px dashed rgba(255,255,255,.3);border-radius:50%;line-height:48px;font-size:22px;">${ph('?','display:inline;font-size:22px;color:var(--accent);','span')}</div>
          ${ph(name,'font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:19px;letter-spacing:1px;text-transform:uppercase;color:#fff;')}
          ${ph('Flip to open file','font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:1.5px;color:var(--secmuted);margin-top:10px;')}
        </div>
        <div class="sus-back" style="display:none;background:rgba(224,90,27,.10);border:1px solid var(--accent);border-top:3px solid var(--accent);padding:16px 16px 18px;min-height:150px;">
          ${ph('KNOWN ALIASES','font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:2px;color:var(--accent);margin-bottom:4px;')}
          ${ph(aliases,'font-size:11.5px;line-height:1.5;color:#e8e5e0;margin-bottom:10px;')}
          ${ph('POTENTIAL MOTIVES','font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:2px;color:var(--accent);margin-bottom:4px;')}
          ${ph(motives,'font-size:11.5px;line-height:1.5;color:#e8e5e0;margin-bottom:12px;')}
          <button class="sus-verdict" data-v="0" onclick="event.stopPropagation();cycleVerdict(this)" style="width:100%;background:transparent;border:1.5px dashed #8a8781;color:#8a8781;font-family:'Montserrat',sans-serif;font-weight:900;font-size:9px;letter-spacing:2px;padding:6px 4px;cursor:pointer;">UNDER INVESTIGATION</button>
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:40px 48px 44px;">
      ${ph('THE SUSPECT BOARD','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('Five persons of interest.','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:28px;color:var(--sectext);text-transform:uppercase;margin-bottom:6px;')}
      ${ph('Click any suspect to open their file. Set a verdict as the evidence comes in.','font-size:13.5px;color:var(--secmuted);margin-bottom:22px;max-width:52ch;')}
      ${listBlock([
        card('Dairy','Milk · cheese · butter · cream · yogurt','Inflammation · bloating · skin issues · congestion'),
        card('Sugar','Cane · syrup · dextrose · \u201cnatural flavours\u201d','Energy crashes · cravings · mood swings · poor sleep'),
        card('Grains','Wheat · corn · rice · oats · barley','Digestive issues · bloating · brain fog'),
        card('Legumes','Beans · peanuts · soy · lentils','Gas · bloating · discomfort'),
        card('Alcohol','Beer · wine · spirits · mixers','Sleep disruption · inflammation · next-day fog')
      ],card('New Suspect','Known aliases here','Potential motives here'),'suspect','display:flex;flex-wrap:wrap;justify-content:center;gap:10px;')}
    </div>`;}},

  invEvidence:{group:'Investigation',norder:3,icon:'▓',name:'Evidence Collected (progress)',theme:'cream',mode:'graphics',
    html:()=>{
      const cell=(n,label,filled)=>`<div class="li-wrap" style="flex:0 1 92px;min-width:78px;text-align:center;position:relative;">
        <button class="li-del" onclick="delLi(this)">×</button>
        <div class="ev-box" data-filled="${filled?'1':'0'}" onclick="toggleEvidence(this)" title="Click: solid = collected, outline = pending" style="height:56px;border:2px solid var(--accent);background:${filled?'var(--accent)':'transparent'};margin-bottom:7px;cursor:pointer;"></div>
        ${ph(n,'font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:15px;color:var(--sectext);')}
        ${ph(label,'font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:1.4px;color:var(--secmuted);margin-top:2px;')}
      </div>`;
      return `<div style="background:var(--secbg);padding:36px 48px 40px;border:1px solid rgba(0,0,0,.10);">
      ${ph('EVIDENCE COLLECTED','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:14px;')}
      ${listBlock([cell('W1','LOGGED',true),cell('W2','LOGGED',true),cell('W3','PENDING',false),cell('W4','PENDING',false),cell('\u2713','VERDICT',false)],cell('W5','PENDING',false),'marker','display:flex;flex-wrap:wrap;justify-content:center;gap:10px;')}
      ${ph('Every symptom you log is a data point. Every data point narrows the field.','font-size:13px;color:var(--secmuted);text-align:center;margin-top:18px;max-width:46ch;margin-left:auto;margin-right:auto;')}
    </div>`;}},

  invClue:{group:'Investigation',norder:4,icon:'🔎',name:'Clue Card',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:40px 48px 44px;">
      <div style="border:2px solid var(--accent);padding:28px 30px;position:relative;">
        <div style="position:absolute;top:-11px;left:26px;background:var(--secbg);padding:0 10px;">
          ${ph('CLUE #3','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:3px;color:var(--accent);','span')}
        </div>
        ${ph('WITNESS STATEMENT','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:3px;color:var(--secmuted);margin:4px 0 12px;')}
        ${ph('\u201cI stopped crashing after lunch.\u201d','font-family:\'Montserrat\',sans-serif;font-weight:900;font-style:italic;font-size:26px;line-height:1.25;color:var(--sectext);margin-bottom:16px;')}
        ${ph('Who does this eliminate?','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:14px;color:var(--accent);letter-spacing:.5px;margin-bottom:10px;')}
        ${tagBlock(['Sugar','Alcohol','Dairy','Stress'],'display:inline-block;font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border:1px solid var(--accent);color:var(--accent);padding:5px 12px;','display:flex;flex-wrap:wrap;gap:7px;')}
      </div>
    </div>`},

  invMission:{group:'Investigation',norder:5,icon:'◎',name:'Daily Mission',theme:'orange',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:40px 48px 44px;text-align:center;">
      ${ph('TODAY\u2019S ASSIGNMENT','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:rgba(255,255,255,.8);margin-bottom:10px;')}
      ${ph('DAY 07','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:52px;line-height:1;color:#fff;letter-spacing:1px;margin-bottom:14px;')}
      ${ph('Collect Physical Evidence','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:26px;text-transform:uppercase;color:#fff;line-height:1.15;margin-bottom:12px;')}
      ${ph('Photograph today\u2019s breakfast before you eat it. File it with the group.','font-size:15px;line-height:1.6;color:rgba(255,255,255,.92);max-width:42ch;margin:0 auto 18px;')}
      <div style="display:inline-block;border:2px dashed rgba(255,255,255,.55);padding:8px 18px;">
        ${ph('EVIDENCE TYPE: PHOTOGRAPHIC','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:#fff;')}
      </div>
    </div>`},

  invSymptomBoard:{group:'Investigation',norder:6,icon:'☑',name:'Symptom Log',theme:'white',mode:'graphics',
    html:()=>{
      const row=(name)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;margin-bottom:2px;"><tbody><tr>
        <td valign="middle" style="background:#fff;border:1px solid #e2ded6;padding:11px 14px;">${ph(name,'font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:14px;color:var(--heading);')}</td>
        <td valign="middle" width="34%" style="width:34%;background:#fff;border:1px solid #e2ded6;border-left:0;padding:11px 14px;text-align:center;">
          ${ph('\u2014  \u2014  \u2014  \u2014','font-family:\'JetBrains Mono\',monospace;font-size:14px;letter-spacing:6px;color:var(--accent);')}
        </td>
        <td valign="middle" class="li-ctrls" style="width:26px;padding:0 0 0 4px;position:relative;"><button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></tbody></table>`;
      return `<div style="background:var(--secbg);padding:36px 48px 40px;">
      ${ph('EVIDENCE LOG','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('Symptom Log','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:26px;text-transform:uppercase;color:var(--heading);margin-bottom:6px;')}
      ${ph('Mark each week. Four marks and you have a pattern, not a coincidence.','font-size:13.5px;color:#8a8781;margin-bottom:18px;max-width:50ch;')}
      ${listBlock([row('Brain fog'),row('Sleep quality'),row('Mood'),row('Energy'),row('Digestion'),row('Skin')],row('New symptom'),'symptom')}
    </div>`;}},

  invTimeline:{group:'Investigation',norder:7,icon:'⇣',name:'Case Timeline',theme:'dark',mode:'graphics',
    html:()=>{
      const stop=(d,t,b)=>`<div class="li-wrap" style="position:relative;padding:0 0 22px 46px;">
        <button class="li-del" onclick="delLi(this)">×</button>
        <div style="position:absolute;left:0;top:2px;width:30px;height:30px;border:2px solid var(--accent);border-radius:50%;text-align:center;line-height:27px;">
          ${ph(d,'font-family:\'JetBrains Mono\',monospace;font-size:9px;font-weight:700;color:var(--accent);display:inline;','span')}
        </div>
        ${ph(t,'font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:16px;color:var(--sectext);text-transform:uppercase;margin-bottom:3px;')}
        ${ph(b,'font-size:13px;line-height:1.55;color:var(--secmuted);max-width:52ch;')}
      </div>`;
      return `<div style="background:var(--secbg);padding:40px 48px 44px;">
      ${ph('CASE TIMELINE','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:16px;')}
      ${listBlock([
        stop('D1','Case Opened','Pantry cleared, baseline symptoms logged, suspects identified.'),
        stop('D5','First Withdrawal','The hardest stretch. Expect resistance from the suspects.'),
        stop('D10','Early Evidence','Energy and sleep begin to shift. Log everything.'),
        stop('D20','Pattern Emerges','The field narrows. Some suspects start looking innocent.'),
        stop('D30','Verdict','Reintroduction begins. You name the guilty party yourself.')
      ],stop('D0','New stage','What happens here.'),'stage')}
    </div>`;}},

  invStakeout:{group:'Investigation',norder:8,icon:'👁',name:'Stakeout Notes (from Tim)',theme:'cream',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:38px 48px 42px;border-left:5px solid var(--accent);">
      ${ph('FROM THE CHIEF INVESTIGATOR','font-family:\'JetBrains Mono\',monospace;font-size:9.5px;font-weight:700;letter-spacing:3.5px;color:var(--accent);margin-bottom:10px;')}
      ${ph('Stakeout Notes','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:28px;text-transform:uppercase;color:var(--sectext);margin-bottom:14px;')}
      ${listBlock(
        [`<div class="li-wrap" style="position:relative;margin-bottom:12px;">${ph('Here\u2019s what I want you watching for this week. Most people miss it because they\u2019re looking at the scale instead of the evidence.','font-size:15px;line-height:1.8;color:var(--sectext);')}<button class="li-del" onclick="delLi(this)">×</button></div>`],
        `<div class="li-wrap" style="position:relative;margin-bottom:12px;">${ph('New paragraph','font-size:15px;line-height:1.8;color:var(--sectext);')}<button class="li-del" onclick="delLi(this)">×</button></div>`,
        'paragraph')}
      <div style="margin-top:18px;padding-top:14px;border-top:1px dashed rgba(0,0,0,.2);">
        ${ph('\u2014 Tim, Chief Investigator','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:13px;letter-spacing:.5px;color:var(--accent);')}
      </div>
    </div>`},

  invBriefingWeeks:{group:'Investigation',norder:1.5,icon:'🗂',name:'Briefing — Week by Week',theme:'cream',mode:'graphics',
    html:()=>{
      const wk=(tag,title,desc)=>`<div class="li-wrap" style="position:relative;display:flex;gap:14px;align-items:flex-start;padding:11px 0;border-bottom:1px dashed rgba(0,0,0,.14);">
        <button class="li-del" onclick="delLi(this)">×</button>
        ${ph(tag,'font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--accent);white-space:nowrap;min-width:58px;padding-top:2px;')}
        <div style="flex:1;">
          ${ph(title,'font-family:\'Montserrat\',sans-serif;font-weight:800;font-size:15px;color:var(--sectext);margin-bottom:2px;')}
          ${ph(desc,'font-size:13px;color:var(--secmuted);line-height:1.5;')}
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:40px 48px 44px;border:1px solid rgba(0,0,0,.10);">
      ${ph('INVESTIGATOR BRIEFING','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('A new case opens this month.','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:24px;line-height:1.15;color:var(--sectext);text-transform:uppercase;margin-bottom:8px;')}
      ${ph('Over the next four weeks you\u2019ll build the case yourself: cut the usual suspects, gather the evidence, and finally find out what\u2019s been working against you.','font-size:14px;line-height:1.65;color:var(--secmuted);max-width:52ch;margin-bottom:20px;')}
      ${listBlock([
        wk('WEEK 1','Arrive at the Crime Scene','Gather baseline evidence. Observe \u2014 don\u2019t accuse anyone yet.'),
        wk('WEEK 2','Interview the Suspects','One food group in the spotlight each day. Investigating, not convicting.'),
        wk('WEEK 3','Build the Case','Watch the trends connect. Your own evidence starts telling the story.'),
        wk('WEEK 4','Close the Case','Name the culprit, plan reintroduction, and get your final report.')
      ],wk('WEEK 5','New phase','What happens in this stretch.'),'week','')}
      <div style="margin-top:22px;padding-top:18px;border-top:2px solid var(--accent);">
        ${ph('THE GOAL','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:3px;color:var(--accent);margin-bottom:6px;')}
        ${ph('By Day 30 you\u2019ll have a complete case file \u2014 and finally know which foods have been holding you back.','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:16px;line-height:1.5;color:var(--sectext);max-width:48ch;')}
      </div>
    </div>`;}},

  invCaseDetails:{group:'Investigation',norder:1.7,icon:'📑',name:'Case Details (table)',theme:'white',mode:'graphics',
    html:()=>{
      const row=(k,v)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tbody><tr>
        <td valign="top" width="34%" style="width:34%;border-bottom:1px solid #e2ded6;padding:10px 12px 10px 0;">${ph(k,'font-family:\'Montserrat\',sans-serif;font-weight:800;font-size:13px;color:var(--heading);')}</td>
        <td valign="top" style="border-bottom:1px solid #e2ded6;padding:10px 0;">${ph(v,'font-size:13.5px;color:#54524e;line-height:1.5;')}</td>
        <td valign="middle" class="li-ctrls" style="width:26px;padding:0 0 0 4px;position:relative;"><button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></tbody></table>`;
      return `<div style="background:var(--secbg);padding:36px 48px 40px;border-bottom:1px solid #e2ded6;">
      ${ph('CASE DETAILS','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:14px;')}
      ${listBlock([
        row('Starts','Monday, [DATE] \u2014 enroll any time before Day 1'),
        row('Duration','30 days \u00b7 4 weeks of investigation + reintroduction'),
        row('What you get','Daily case briefings, a suspect board, evidence tracking, and a personalized Final Investigation Report'),
        row('The rule','Miss a day? It\u2019s an \u201cincomplete report,\u201d never a failure. The case keeps building.'),
        row('Cost','Free for members \u00b7 [price] for non-members')
      ],row('New row','Detail goes here'),'row')}
    </div>`;}},

  invFileChecklist:{group:'Investigation',norder:6.5,icon:'🗒',name:'File Checklist (opening report)',theme:'white',mode:'graphics',
    html:()=>{
      const item=(t,d)=>`<div class="li-wrap" style="position:relative;display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #e2ded6;">
        <button class="li-del" onclick="delLi(this)">×</button>
        <div style="width:15px;height:15px;border:2px solid var(--accent);flex-shrink:0;margin-top:2px;"></div>
        <div style="flex:1;">
          ${ph(t,'font-family:\'Montserrat\',sans-serif;font-weight:800;font-size:14px;color:var(--heading);margin-bottom:1px;')}
          ${ph(d,'font-size:12.5px;color:#8a8781;line-height:1.5;')}
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:36px 48px 40px;">
      ${ph('OPENING REPORT','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('File Your First Evidence','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;text-transform:uppercase;color:var(--heading);margin-bottom:6px;')}
      ${ph('Takes two minutes. Log it in the form linked below.','font-size:13.5px;color:#8a8781;margin-bottom:18px;')}
      ${listBlock([
        item('Starting stats','Weight or measurements \u2014 optional and private.'),
        item('Symptom checklist','Afternoon crashes, poor sleep, brain fog, cravings, low energy, joint pain, mood swings.'),
        item('Baseline ratings','Energy, sleep, and mood \u2014 each on a scale of 1 to 5.'),
        item('Case notes','One line: what made you open this case?')
      ],item('New item','What to record.'),'item')}
    </div>`;}},

  invLogButton:{group:'Investigation',norder:8.3,icon:'▬',name:'Log Evidence Bar',theme:'orange',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:32px 44px;text-align:center;">
      ${ph('Log today\u2019s evidence','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:8px;')}
      ${ph('One photo, one rating, one note. Under a minute.','font-size:13px;color:rgba(255,255,255,.9);margin-bottom:18px;')}
      ${realBtn('Log Evidence \u203a',"display:inline-block;background:#fff;color:var(--accent);font-family:'Montserrat',sans-serif;font-weight:800;font-size:13px;letter-spacing:.5px;text-decoration:none;padding:13px 30px;border-radius:6px;",'#')}
    </div>`,
    desc:'A call-to-action bar with a headline, subline, and a linkable button. Works on any theme \u2014 use orange or dark (black) shade.'},

  invLogButtonTop:{group:'Investigation',norder:8.4,icon:'▤',name:'Log Evidence Bar (with kicker)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:32px 44px;text-align:center;">
      ${ph('COMING UP \u00b7 WEEK 2','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:10px;')}
      ${ph('Interview the Suspects','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:20px;color:#fff;text-transform:uppercase;margin-bottom:8px;')}
      ${ph('Sugar. Dairy. Grains. Alcohol. Each one gets its day in the interrogation room.','font-size:13px;color:var(--secmuted);max-width:46ch;margin:0 auto 18px;line-height:1.6;')}
      ${realBtn('File Your Week 1 Summary \u203a',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:13px;letter-spacing:.5px;text-decoration:none;padding:13px 30px;border-radius:6px;",'#')}
    </div>`,
    desc:'A CTA bar with an orange kicker line above the headline, subline, and linkable button. Works on orange or dark shade.'},

  invWeekLog:{group:'Investigation',norder:3.5,icon:'▪',name:'Weekly Evidence Log (7 days)',theme:'white',mode:'graphics',
    html:()=>{
      const sq=(n,on)=>`<div style="text-align:center;">
        <div class="ev-box" data-filled="${on?'1':'0'}" onclick="toggleEvidence(this)" title="Click: solid = logged, outline = pending" style="width:32px;height:32px;border:2px solid var(--accent);background:${on?'var(--accent)':'transparent'};cursor:pointer;margin:0 auto 5px;"></div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--secmuted);">${n}</div>
      </div>`;
      return `<div style="background:var(--secbg);padding:30px 48px 34px;border:1px solid rgba(0,0,0,.10);">
      ${ph('WEEK 1 EVIDENCE \u2014 DAYS LOGGED','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:var(--secmuted);margin-bottom:14px;text-align:center;')}
      <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
        ${sq('1',true)}${sq('2',true)}${sq('3',true)}${sq('4',false)}${sq('5',false)}${sq('6',false)}${sq('7',false)}
      </div>
    </div>`;},
    desc:'A compact 7-day evidence strip. Click any square to toggle solid (logged) or outline (pending). Fixed at 7 days.'},

  invDebrief:{group:'Investigation',norder:6.8,icon:'📰',name:'Debrief Header',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:34px 48px 40px;">
      ${ph('WEEK 1 DEBRIEF','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:10px;')}
      ${ph('Week One: Evidence Filed','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:34px;line-height:1.02;text-transform:uppercase;color:#fff;margin-bottom:12px;')}
      ${ph('Seven days of surveillance complete. Here\u2019s what your case file looks like so far, Detective.','font-size:14px;line-height:1.6;color:var(--secmuted);max-width:50ch;')}
    </div>`,
    desc:'A bold debrief header with a kicker, large title, and intro line. Use the dark shade for the classic look.'},

  invSuspectFile:{group:'Investigation',norder:2.5,icon:'🗃',name:'Suspect File (single)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:36px 48px 40px;">
      ${ph('SUSPECT FILE','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:16px;')}
      <div style="border:1px solid rgba(255,255,255,.2);border-top:3px solid var(--accent);padding:24px 26px;">
        ${ph('NOW INTERVIEWING','font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:2px;color:var(--secmuted);margin-bottom:6px;')}
        ${ph('Sugar','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:26px;text-transform:uppercase;color:#fff;letter-spacing:1px;margin-bottom:16px;')}
        <div style="display:flex;flex-wrap:wrap;gap:18px;margin-bottom:14px;">
          <div style="flex:1;min-width:150px;">
            ${ph('KNOWN ALIASES','font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:1.5px;color:var(--accent);margin-bottom:4px;')}
            ${ph('Cane, syrup, dextrose, maltose, \u201cevaporated cane juice,\u201d and 50+ more.','font-size:12.5px;line-height:1.5;color:#c9c5bd;')}
          </div>
          <div style="flex:1;min-width:150px;">
            ${ph('POTENTIAL MOTIVES','font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:1.5px;color:var(--accent);margin-bottom:4px;')}
            ${ph('Afternoon crashes, relentless cravings, mood swings, poor sleep.','font-size:12.5px;line-height:1.5;color:#c9c5bd;')}
          </div>
        </div>
        <button class="sus-verdict" data-v="0" onclick="cycleVerdict(this)" style="width:100%;background:transparent;border:1.5px dashed #8a8781;color:#8a8781;font-family:'Montserrat',sans-serif;font-weight:900;font-size:10px;letter-spacing:2px;padding:8px;cursor:pointer;margin-top:8px;">UNDER INVESTIGATION</button>
      </div>
    </div>`,
    desc:'A single suspect dossier \u2014 name, aliases, motives, and a click-to-cycle verdict stamp. Best on the dark shade.'},

  invLockerBar:{group:'Investigation',norder:13.5,icon:'🥇',name:'Reward / Status Bar',theme:'cream',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:24px 44px;display:flex;align-items:center;gap:18px;">
      <div style="width:46px;height:46px;border:2px solid var(--accent);border-radius:50%;flex-shrink:0;text-align:center;line-height:42px;">${ph('🗄','display:inline;font-size:22px;','span')}</div>
      <div style="flex:1;">
        ${ph('EVIDENCE UNLOCKED','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:2px;color:var(--secmuted);margin-bottom:3px;')}
        ${ph('Evidence Locker','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:16px;color:var(--sectext);margin-bottom:2px;')}
        ${ph('Suspect interviews are now open. One culprit per day this week.','font-size:12.5px;color:var(--secmuted);line-height:1.5;')}
      </div>
    </div>`,
    desc:'A horizontal bar with a circular emoji badge and text \u2014 use for reward unlocks (Evidence Locker, Magnifying Glass) or a full-board status note. Change the emoji and copy to suit.'},

  invClueDark:{group:'Investigation',norder:4.5,icon:'🖤',name:'Clue Card (data / dark)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:40px 48px 44px;">
      <div style="border:2px solid var(--accent);padding:28px 30px;position:relative;">
        <div style="position:absolute;top:-11px;left:26px;background:var(--secbg);padding:0 10px;">
          ${ph('CLUE #15','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:3px;color:var(--accent);','span')}
        </div>
        ${ph('PATTERN DETECTED \u00b7 FROM YOUR LOGS','font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:3px;color:var(--secmuted);margin:4px 0 12px;')}
        ${ph('\u201cYou\u2019ve reported afternoon fatigue 8 times \u2014 and every one was before Day 12.\u201d','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;line-height:1.3;color:#fff;margin-bottom:14px;')}
        ${ph('So what changed on Day 12?','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:13.5px;color:var(--accent);letter-spacing:.5px;')}
      </div>
    </div>`,
    desc:'A dark clue card for surfacing a data pattern from member logs \u2014 clue number, source line, the finding, and a follow-up question.'},

  invRedacted:{group:'Investigation',norder:9,icon:'▬',name:'Redacted Teaser',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:44px 48px 48px;">
      ${ph('CLASSIFIED','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:5px;color:var(--accent);margin-bottom:16px;')}
      <div style="margin-bottom:9px;">${ph('Tomorrow you find out which suspect','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:24px;line-height:1.3;color:var(--sectext);')}</div>
      <div style="display:inline-block;background:var(--sectext);height:26px;width:62%;margin-bottom:9px;"></div>
      <div style="display:inline-block;background:var(--sectext);height:26px;width:38%;margin-bottom:16px;"></div>
      ${ph('EVIDENCE LOCKED \u00b7 COMPLETE TODAY\u2019S MISSION TO REVEAL','font-family:\'JetBrains Mono\',monospace;font-size:9.5px;letter-spacing:2px;color:var(--accent);')}
    </div>`},

  invPantryRaid:{group:'Investigation',norder:10,icon:'🧹',name:'The Raid (pantry clean-out)',theme:'white',mode:'graphics',
    html:()=>{
      const item=(t)=>`<div class="li-wrap" style="position:relative;padding:7px 0 7px 28px;font-size:14px;color:var(--heading);"><span style="position:absolute;left:0;top:7px;width:14px;height:14px;border:2px solid var(--accent);"></span>${ph(t,'display:block;min-height:18px;')}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      return `<div style="background:var(--secbg);padding:38px 48px 42px;">
      ${ph('OPERATION: CLEAN SWEEP','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('The Raid','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:34px;text-transform:uppercase;color:var(--heading);margin-bottom:6px;')}
      ${ph('Before the investigation begins, the scene has to be cleared. Remove every suspect from the premises.','font-size:14px;line-height:1.6;color:#8a8781;max-width:52ch;margin-bottom:20px;')}
      ${listBlock([item('Anything with added sugar'),item('Bread, pasta, cereal, crackers'),item('Milk, cheese, yogurt, cream'),item('Beans, peanut butter, soy sauce'),item('Beer, wine, spirits'),item('\u201cJust in case\u201d snacks at the back')],item('New item'),'item','display:flex;flex-wrap:wrap;gap:0 40px;')}
    </div>`;}},

  invInterrogation:{group:'Investigation',norder:11,icon:'❓',name:'Interrogation (Q&A)',theme:'cream',mode:'graphics',
    html:()=>{
      const q=(a,b)=>`<div class="li-wrap" style="position:relative;border-left:3px solid var(--accent);padding:2px 0 2px 16px;margin-bottom:18px;">
        <button class="li-del" onclick="delLi(this)">×</button>
        ${ph(a,'font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:16px;color:var(--sectext);margin-bottom:5px;')}
        ${ph(b,'font-size:13.5px;line-height:1.65;color:var(--secmuted);')}
      </div>`;
      return `<div style="background:var(--secbg);padding:38px 48px 42px;">
      ${ph('INTERROGATION','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);margin-bottom:8px;')}
      ${ph('Questions for the subject','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:26px;text-transform:uppercase;color:var(--sectext);margin-bottom:18px;')}
      ${listBlock([
        q('What surprised you this week?','There is usually one thing nobody expects.'),
        q('What was hardest?','Name it. Naming it takes its power away.'),
        q('What clues have appeared?','Anything you noticed but dismissed.')
      ],q('New question','Prompt text.'),'question')}
    </div>`;}},

  invTipOff:{group:'Investigation',norder:12,icon:'💡',name:'Anonymous Tip (tip of the day)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:38px 48px 42px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        ${ph('ANONYMOUS TIP','font-family:\'JetBrains Mono\',monospace;font-size:10px;font-weight:700;letter-spacing:4px;color:var(--accent);white-space:nowrap;','span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.4;"></span>
        ${ph('#014','font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--secmuted);','span')}
      </div>
      ${ph('Read the label before you read the front of the box.','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:28px;line-height:1.2;color:var(--sectext);margin-bottom:12px;')}
      ${ph('The front is marketing. The back is evidence. Sugar has more than fifty aliases and most of them live in the last three lines of the ingredient list.','font-size:14.5px;line-height:1.7;color:var(--secmuted);max-width:54ch;')}
    </div>`},

  invBadge:{group:'Investigation',norder:13,icon:'🛡',name:'Investigator Badge',theme:'cream',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:46px 48px 50px;text-align:center;">
      <div style="display:inline-block;border:3px solid var(--accent);border-radius:10px;padding:26px 34px;background:rgba(224,90,27,.05);">
        ${ph('LNGVTY HUB \u00b7 WHOLE30 DIVISION','font-family:\'JetBrains Mono\',monospace;font-size:8.5px;font-weight:700;letter-spacing:2.5px;color:var(--accent);margin-bottom:14px;')}
        <div style="width:56px;height:56px;margin:0 auto 14px;border:3px solid var(--accent);border-radius:50%;line-height:52px;">
          ${ph('\u2605','font-size:24px;color:var(--accent);display:inline;','span')}
        </div>
        ${ph('CERTIFIED','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:11px;letter-spacing:4px;color:var(--secmuted);margin-bottom:4px;')}
        ${ph('NUTRITIONAL INVESTIGATOR','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:21px;letter-spacing:.5px;color:var(--sectext);text-transform:uppercase;margin-bottom:12px;')}
        <div style="height:1px;background:var(--accent);opacity:.4;margin:0 auto 12px;width:70%;"></div>
        ${ph('Special Agent {{contact.first_name}}','font-family:\'Montserrat\',sans-serif;font-weight:700;font-size:15px;color:var(--accent);')}
      </div>
    </div>`},

  invCaseClosed:{group:'Investigation',norder:14,icon:'✔',name:'Case Closed (finale)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);position:relative;">
      <div style="height:6px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
      <div style="padding:46px 48px 20px;text-align:center;">
        ${ph('CASE #W30-001','font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:3px;color:var(--secmuted);margin-bottom:20px;')}
        <div style="display:inline-block;border:4px solid var(--accent);padding:12px 30px;transform:rotate(-3deg);margin-bottom:24px;">
          ${ph('CASE CLOSED','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:38px;letter-spacing:3px;color:var(--accent);line-height:1;')}
        </div>
        ${ph('30 days. Evidence gathered. Verdict reached.','font-family:\'Montserrat\',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);text-transform:uppercase;margin-bottom:10px;')}
        ${ph('You did what most people never do \u2014 you stopped guessing and found out.','font-size:14.5px;line-height:1.65;color:var(--secmuted);max-width:46ch;margin:0 auto;')}
      </div>
      <div style="padding:14px 48px 44px;text-align:center;">
        ${statRow([['30','Days'],['5','Suspects'],['1','Verdict']])}
      </div>
      <div style="height:6px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
    </div>`},

  /* ═══════════ DOCUMENTATION SECTIONS (mode:'docs') ═══════════
     Building blocks for plan / proposal / strategy documents. Designed for the
     Webpage page-format (wide canvas). Every list, table row and timeline stop is
     add/removable, and the accent-bar sections carry an editable color chip so a
     document can run two or more color-coded tracks (e.g. two challenges). */

  docMast:{group:'Doc Structure',norder:0,icon:'▤',name:'Document Masthead',theme:'dark',mode:'docs',
    html:()=>`<div style="background:var(--dark);border-bottom:5px solid var(--accent);">
      <div style="background:var(--accent);padding:9px 7%;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        ${ph('LNGVTY Hub · Carrboro',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.6px;text-transform:uppercase;color:#fff;",'span')}
        ${ph('Program Plan · Q3 2026',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.6px;text-transform:uppercase;color:#fff;",'span')}
      </div>
      <div style="padding:46px 7% 54px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap;">
          <div>
            ${ph('LNGVTY',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;letter-spacing:2px;color:#fff;line-height:1;")}
            ${ph('LONGEVITY HUB',"font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:5px;font-weight:700;color:var(--accent);margin-top:5px;")}
          </div>
          <div style="text-align:right;">
            ${ph('Prepared for Tim Pedersen',"font-size:11px;color:#8d8b86;line-height:1.9;")}
            ${ph('Two challenges · 30 days each',"font-size:11px;color:#8d8b86;line-height:1.9;")}
            ${ph('Status: Draft for review',"font-size:11px;color:#8d8b86;line-height:1.9;")}
          </div>
        </div>
        ${ph('Two challenges that shouldn\u2019t feel like the same challenge.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:48px;line-height:.97;letter-spacing:-1.4px;color:#fff;margin:38px 0 0;max-width:15ch;")}
        ${ph('One-paragraph standfirst. Set up the problem, name the two things being compared, and say what the reader will get out of this document.',"font-size:17px;line-height:1.7;color:#c9c5bd;font-weight:300;margin:22px 0 0;max-width:60ch;")}
      </div>
    </div>`},

  docThesis:{group:'Doc Structure',norder:1,icon:'❖',name:'The Bet / Thesis',theme:'white',mode:'docs',
    html:()=>`<div style="background:var(--secbg);border-bottom:1px solid #e2ded6;padding:44px 7%;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        <tbody><tr>
          <td valign="top" style="width:150px;padding-right:28px;">
            ${ph('The bet',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);padding-top:6px;")}
          </td>
          <td valign="top">
            ${listBlock(
              [`<div class="li-wrap" style="position:relative;margin-bottom:14px;">${ph('State the single big idea in one sentence. Make it a claim someone could disagree with.',"font-size:19px;line-height:1.65;color:var(--heading);")}<button class="li-del" onclick="delLi(this)">×</button></div>`,
               `<div class="li-wrap" style="position:relative;margin-bottom:14px;">${ph('Then one supporting paragraph explaining what follows from it.',"font-size:16px;line-height:1.7;color:var(--body-text);")}<button class="li-del" onclick="delLi(this)">×</button></div>`],
              `<div class="li-wrap" style="position:relative;margin-bottom:14px;">${ph('New paragraph',"font-size:16px;line-height:1.7;color:var(--body-text);")}<button class="li-del" onclick="delLi(this)">×</button></div>`,
              'Add paragraph')}
          </td>
        </tr></tbody>
      </table>
    </div>`},

  docSectionHead:{group:'Doc Structure',norder:2,icon:'—',name:'Section Header (rule)',theme:'white',mode:'docs',
    html:()=>`<div style="background:var(--secbg);padding:56px 7% 0;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('Challenge One',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('Section title',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:var(--heading);margin-bottom:12px;")}
      ${ph('A one- or two-sentence lede that frames what this section covers.',"font-size:17px;line-height:1.7;color:var(--body-text);max-width:66ch;")}
    </div>`},

  docTrackHead:{group:'Doc Content',norder:0,icon:'▰',name:'Color Track Header',theme:'white',mode:'docs',
    html:()=>`<div style="background:var(--secbg);padding:28px 7% 0;">
      <div class="doc-track" data-accent="#3f7d4f" style="background:#2b5837;padding:40px 44px;position:relative;overflow:hidden;">
        <button class="doc-hue" onclick="cycleDocHue(this)" title="Change track color">◐ color</button>
        ${ph('Positioning',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:rgba(255,255,255,.72);")}
        ${ph('Reset Your Body',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:46px;line-height:1;letter-spacing:-1px;color:#fff;margin:8px 0 6px;")}
        ${ph('The one-line promise for this track.',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;letter-spacing:.4px;color:rgba(255,255,255,.75);")}
        ${ph('A short paragraph explaining the angle \u2014 why this is positioned the way it is, and what makes it different from the other track.',"font-size:15px;line-height:1.7;color:rgba(255,255,255,.82);font-weight:300;margin:16px 0 0;max-width:56ch;")}
      </div>
    </div>`},

  docPromise:{group:'Doc Content',norder:1,icon:'▥',name:'Promise Grid',theme:'white',mode:'docs',
    html:()=>{
      const cell=(t,d)=>`<div class="li-wrap" style="flex:0 1 260px;min-width:210px;background:#fff;border:1px solid #e2ded6;padding:15px 17px;position:relative;">
        <button class="li-del" onclick="delLi(this)">×</button>
        ${ph(t,"font-family:'Montserrat',sans-serif;font-weight:800;font-size:12.5px;color:var(--heading);margin-bottom:2px;")}
        ${ph(d,"font-size:14px;line-height:1.5;color:var(--body-text);")}
      </div>`;
      return `<div style="background:var(--secbg);padding:28px 7% 0;">
      ${ph('What we promise',"font-family:'Montserrat',sans-serif;font-weight:800;font-size:19px;color:var(--heading);margin-bottom:8px;")}
      ${listBlock(
        [cell('Benefit one','What the participant actually gets.'),
         cell('Benefit two','Keep each of these concrete.'),
         cell('Benefit three','Avoid vague outcome language.')],
        cell('Benefit','Description.'),
        'benefit',
        'display:flex;flex-wrap:wrap;justify-content:center;gap:2px;')}
    </div>`;}},

  docPhases:{group:'Doc Content',norder:2,icon:'☷',name:'Phase / Week Columns',theme:'white',mode:'docs',
    html:()=>{
      const bullet=(t)=>`<div class="li-wrap" style="font-size:13.2px;line-height:1.5;padding:3.5px 0 3.5px 13px;position:relative;color:var(--body-text);min-height:20px;"><span style="position:absolute;left:0;top:10px;width:5px;height:2px;background:var(--accent);"></span>${ph(t,"display:block;min-height:19px;")}<button class="li-del" onclick="delLi(this)">×</button></div>`;
      const col=(n,title,items)=>`<div class="li-wrap" style="flex:0 1 240px;min-width:200px;background:#fff;border:1px solid #e2ded6;padding:20px 18px 22px;position:relative;">
        <div style="height:3px;background:var(--accent);position:absolute;top:0;left:0;right:0;"></div>
        <button class="li-del" onclick="delLi(this)" title="Remove this column">×</button>
        ${ph(n,"font-size:10.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent);margin-bottom:9px;")}
        ${ph(title,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:15.5px;line-height:1.15;color:var(--heading);margin-bottom:10px;")}
        ${listBlock(items.map(bullet),bullet('New point'),'point')}
      </div>`;
      return `<div style="background:var(--secbg);padding:22px 7% 0;">
      ${ph('The four-week arc',"font-family:'Montserrat',sans-serif;font-weight:800;font-size:19px;color:var(--heading);margin-bottom:8px;")}
      ${listBlock(
        [col('Week 01','Phase name',['First point','Second point','Third point']),
         col('Week 02','Phase name',['First point','Second point','Third point']),
         col('Week 03','Phase name',['First point','Second point','Third point']),
         col('Week 04','Phase name',['First point','Second point','Third point'])],
        col('Week 05','Phase name',['First point']),
        'column',
        'display:flex;flex-wrap:wrap;justify-content:center;gap:2px;')}
      ${ph('An optional note under the columns \u2014 use it to flag the phase that matters most.',"font-size:13.6px;color:#8a8781;margin-top:10px;")}
    </div>`;}},

  docMechanics:{group:'Doc Content',norder:3,icon:'⚙',name:'Mechanics Cards',theme:'white',mode:'docs',
    html:()=>{
      const card=(t,d)=>`<div class="li-wrap" style="flex:0 1 300px;min-width:250px;padding:2px 0 18px 0;position:relative;">
        <button class="li-del" onclick="delLi(this)">×</button>
        <div style="border-left:3px solid var(--accent);padding:2px 0 2px 15px;">
          ${ph(t,"font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;color:var(--heading);margin-bottom:5px;")}
          ${ph(d,"font-size:13.6px;line-height:1.6;color:var(--body-text);")}
          ${ph('Runs on: where this actually happens.',"font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.55;color:#8a8781;margin-top:7px;")}
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:22px 7% 0;">
      ${ph('Engagement mechanics',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gray);margin:20px 0 14px;padding-top:22px;border-top:1px solid #e2ded6;")}
      ${listBlock(
        [card('Mechanic name','What it is and why it works, in one or two sentences.'),
         card('Mechanic name','What it is and why it works, in one or two sentences.')],
        card('Mechanic name','Description.'),
        'mechanic',
        'display:flex;flex-wrap:wrap;justify-content:center;gap:0 22px;')}
    </div>`;}},

  docExample:{group:'Doc Content',norder:4,icon:'❝',name:'Example / Sample Box',theme:'white',mode:'docs',
    html:()=>`<div style="background:var(--secbg);padding:14px 7% 0;">
      <div style="padding:13px 15px;border:1px dashed #e2ded6;background:var(--bg);">
        ${ph('Sample copy',"font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#96938c;margin-bottom:6px;")}
        ${ph('Drop the actual wording here so the reader can hear the voice, not just read about it.',"font-size:13.4px;line-height:1.62;color:var(--body-text);")}
      </div>
    </div>`},

  docTimeline:{group:'Doc Planning',norder:0,icon:'⇅',name:'Route / Timeline (dark)',theme:'dark',mode:'docs',
    html:()=>{
      const stop=(pin,day,title,body)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;margin-bottom:26px;"><tbody><tr>
        <td valign="top" width="70" style="width:70px;">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--accent);text-align:center;line-height:48px;">
            ${ph(pin,"font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#fff;display:inline;",'span')}
          </div>
        </td>
        <td valign="top" style="padding-top:6px;">
          ${ph(day,"font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:var(--accent);margin-bottom:5px;")}
          ${ph(title,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:17px;color:#fff;margin-bottom:4px;letter-spacing:-.2px;")}
          ${ph(body,"font-size:14.4px;line-height:1.65;color:#a7a39c;max-width:62ch;")}
        </td>
      <td valign="top" class="li-ctrls" style="width:26px;padding:0 0 0 4px;position:relative;white-space:nowrap;"><button class="li-del" onclick="delLi(this)">×</button>${liMoves()}</td></tr></tbody></table>`;
      return `<div style="background:var(--dark);padding:70px 7% 76px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('The spine of the plan',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('Stop counting days. Give them a route.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:#fff;margin-bottom:12px;")}
      ${ph('Explain what the timeline represents and how to read it.',"font-size:17px;line-height:1.7;color:#b3afa7;max-width:66ch;margin-bottom:40px;")}
      ${listBlock(
        [stop('D1','Day 1','Start','What happens at this stage, and why it matters.'),
         stop('D15','Day 15','Halfway','Momentum peak \u2014 the best moment for a check-in.'),
         stop('D30','Day 30','Finish','The payoff, and the hand-off into whatever comes next.')],
        stop('D0','Day 0','Stop name','What happens at this stage.'),
        'Add stop')}
    </div>`;}},

  docPillars:{group:'Doc Planning',norder:1,icon:'▦',name:'Numbered Pillars',theme:'white',mode:'docs',
    html:()=>{
      const cell=(n,t,d)=>`<div class="li-wrap" style="flex:0 1 340px;min-width:270px;background:#fff;border:1px solid #e2ded6;padding:26px 24px 28px;position:relative;">
        <button class="li-del" onclick="delLi(this)">×</button>
        ${ph(n,"font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:1.6px;color:var(--accent);margin-bottom:9px;")}
        ${ph(t,"font-family:'Montserrat',sans-serif;font-weight:800;font-size:17px;color:var(--heading);margin-bottom:7px;")}
        ${ph(d,"font-size:14px;line-height:1.65;color:var(--body-text);")}
        <div class="doc-ex" data-on="0" style="display:none;margin-top:12px;padding:13px 15px;border:1px dashed #e2ded6;background:var(--paper);">
          ${ph('Examples',"font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#96938c;margin-bottom:6px;")}
          ${ph('Concrete examples, separated by a mid-dot.',"font-size:13.4px;line-height:1.62;color:var(--body-text);")}
        </div>
        <div class="doc-badges" data-on="0" style="display:none;margin-top:12px;">
          ${tagBlock(['Badge name'],"display:inline-block;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:.3px;background:var(--paper);border:1px solid #e2ded6;border-radius:20px;padding:5px 11px;color:var(--gray);","display:flex;flex-wrap:wrap;gap:6px;")}
        </div>
        <div class="doc-extra-btns" style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">
          <button class="doc-extra" type="button" data-target="doc-ex" data-label="example box" onclick="toggleDocExtra(this)">+ Add example box</button>
          <button class="doc-extra" type="button" data-target="doc-badges" data-label="badges" onclick="toggleDocExtra(this)">+ Add badges</button>
        </div>
      </div>`;
      return `<div style="background:var(--secbg);padding:56px 7%;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('Applies to everything',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('The shared layer',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:var(--heading);margin-bottom:12px;")}
      ${ph('What these have in common and why they are grouped together.',"font-size:17px;line-height:1.7;color:var(--body-text);max-width:66ch;margin-bottom:30px;")}
      ${listBlock(
        [cell('01','Pillar name','What it is, in plain terms.'),
         cell('02','Pillar name','What it is, in plain terms.')],
        cell('03','Pillar name','Description.'),
        'pillar',
        'display:flex;flex-wrap:wrap;justify-content:center;gap:2px;')}
    </div>`;}},

  docTable:{group:'Doc Data',norder:0,icon:'▤',name:'Production Table',theme:'white',mode:'docs',
    html:()=>{
      const row=(a,b,c)=>`<tr class="li-wrap" style="position:relative;">
        <td valign="top" style="border-bottom:1px solid #e2ded6;padding:13px 15px;width:22%;">${ph(a,"font-family:'Montserrat',sans-serif;font-weight:700;color:var(--heading);font-size:14px;")}</td>
        <td valign="top" style="border-bottom:1px solid #e2ded6;padding:13px 15px;width:48%;">${ph(b,"font-size:14px;line-height:1.6;color:var(--body-text);")}</td>
        <td valign="top" style="border-bottom:1px solid #e2ded6;padding:13px 15px;width:30%;">${ph(c,"font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);")}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr>`;
      return `<div style="background:var(--bg);padding:56px 7%;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('Production',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('What we would actually build',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:var(--heading);margin-bottom:12px;")}
      ${ph('A line about what already exists versus what is new work.',"font-size:17px;line-height:1.7;color:var(--body-text);max-width:66ch;margin-bottom:26px;")}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2ded6;">
        <tbody>
          <tr>
            <th style="background:var(--dark);color:#fff;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;text-align:left;padding:12px 15px;">${ph('Asset',"color:#fff;display:inline;",'span')}</th>
            <th style="background:var(--dark);color:#fff;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;text-align:left;padding:12px 15px;">${ph('What it is',"color:#fff;display:inline;",'span')}</th>
            <th style="background:var(--dark);color:#fff;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;text-align:left;padding:12px 15px;">${ph('Status',"color:#fff;display:inline;",'span')}</th>
          </tr>
          <tr><td colspan="3" style="padding:0;">${listBlock(
            [`<table class="li-list-inner" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tbody>${row('Asset name','What this deliverable is.','Already exists')}</tbody></table>`],
            `<table class="li-list-inner" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tbody>${row('Asset name','Description.','New work')}</tbody></table>`,
            'Add row')}</td></tr>
        </tbody>
      </table>
    </div>`;}},

  docMetrics:{group:'Doc Data',norder:1,icon:'◉',name:'Metric Strip',theme:'dark',mode:'docs',
    html:()=>`<div style="background:var(--gray);padding:30px 7%;">
      ${statRow([['30','Days'],['4','Weeks'],['2','Tracks'],['6','Milestones']])}
    </div>`},

  docRisk:{group:'Doc Planning',norder:2,icon:'⚠',name:'Risks & Mitigations',theme:'white',mode:'docs',
    html:()=>{
      const row=(r,m)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;margin-bottom:2px;"><tbody><tr>
        <td valign="top" width="6" style="width:6px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</td>
        <td valign="top" width="42%" style="width:42%;background:#fff;border:1px solid #e2ded6;border-left:0;padding:14px 16px;">
          ${ph(r,"font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;color:var(--heading);")}
        </td>
        <td valign="top" style="background:#fff;border:1px solid #e2ded6;border-left:0;padding:14px 16px;">
          ${ph(m,"font-size:13.8px;line-height:1.6;color:var(--body-text);")}
          <button class="li-del" onclick="delLi(this)">×</button>
        </td>
      </tr></tbody></table>`;
      return `<div style="background:var(--secbg);padding:56px 7%;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('Known risks',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('What could go wrong',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:var(--heading);margin-bottom:24px;")}
      ${listBlock([row('The risk, stated plainly.','How we plan to handle it.')],row('Risk','Mitigation.'),'Add risk')}
    </div>`;}},

  docOwners:{group:'Doc Planning',norder:3,icon:'☑',name:'Owners & Dates',theme:'white',mode:'docs',
    html:()=>{
      const row=(task,who,when)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;margin-bottom:2px;"><tbody><tr>
        <td valign="top" style="background:#fff;border:1px solid #e2ded6;padding:13px 16px;">${ph(task,"font-size:14px;color:var(--heading);font-weight:600;")}</td>
        <td valign="top" width="22%" style="width:22%;background:#fff;border:1px solid #e2ded6;border-left:0;padding:13px 16px;">${ph(who,"font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.4px;")}</td>
        <td valign="top" width="22%" style="width:22%;background:#fff;border:1px solid #e2ded6;border-left:0;padding:13px 16px;">${ph(when,"font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--body-text);")}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></tbody></table>`;
      return `<div style="background:var(--bg);padding:56px 7%;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${ph('Who does what',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:var(--accent);white-space:nowrap;",'span')}
        <span style="flex:1;height:1px;background:var(--accent);opacity:.28;"></span>
      </div>
      ${ph('Owners and dates',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:var(--heading);margin-bottom:24px;")}
      ${listBlock([row('The task or deliverable.','Owner','Target date')],row('Task','Owner','Date'),'Add line')}
    </div>`;}},

  docQuote:{group:'Doc Content',norder:5,icon:'❞',name:'Pull Quote',theme:'white',mode:'docs',
    html:()=>`<div style="background:var(--secbg);padding:44px 7%;">
      <div style="border-left:4px solid var(--accent);padding-left:26px;max-width:70ch;">
        ${ph('A line worth setting apart \u2014 a customer quote, a stat, or the sentence you want them to remember.',"font-family:'Montserrat',sans-serif;font-weight:300;font-size:24px;line-height:1.5;color:var(--heading);font-style:italic;")}
        ${ph('Attribution',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-top:14px;")}
      </div>
    </div>`},

  docRecommend:{group:'Doc Close',norder:0,icon:'▶',name:'Recommendation (accent)',theme:'orange',mode:'docs',
    html:()=>{
      const card=(t,d)=>`<div class="li-wrap" style="flex:0 1 230px;min-width:190px;background:rgba(0,0,0,.10);border:1px solid rgba(255,255,255,.3);padding:16px 18px;position:relative;">
        <button class="li-del" onclick="delLi(this)">×</button>
        ${ph(t,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;letter-spacing:.4px;color:#fff;margin-bottom:3px;")}
        ${ph(d,"font-size:13.4px;line-height:1.55;color:#fff;")}
      </div>`;
      return `<div style="background:var(--secbg);padding:56px 7% 60px;">
      ${ph('Recommendation',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3.4px;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:10px;")}
      ${ph('Lead with the recommendation.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;line-height:1.06;letter-spacing:-.6px;color:#fff;margin-bottom:12px;max-width:20ch;")}
      ${ph('Two or three sentences justifying it \u2014 why this one, why now, and what it de-risks.',"font-size:16px;line-height:1.7;color:#fff;max-width:62ch;margin-bottom:26px;")}
      ${listBlock(
        [card('Next step','What happens first.'),
         card('Next step','What happens second.'),
         card('Next step','Then this.'),
         card('Next step','And this.')],
        card('Next step','Description.'),
        'step',
        'display:flex;flex-wrap:wrap;justify-content:center;gap:2px;')}
    </div>`;}},

  docFooterBar:{group:'Doc Close',norder:1,icon:'▬',name:'Document Footer Bar',theme:'dark',mode:'docs',
    html:()=>`<div style="background:var(--dark);padding:22px 7%;text-align:center;">
      ${ph('LNGVTY Hub · Challenge program plan · Draft for review',"font-family:'JetBrains Mono',monospace;font-size:12px;color:#7d7a74;")}
    </div>`},

  /* ══════════════ KETO CHALLENGE SECTIONS (from the Day 7/14/21/30 emails) ══════════════ */

  chHeader:{group:'Challenge',icon:'▰',name:'Challenge Header (black)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);">
      <div style="padding:44px 48px 0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
          ${ph('LNGVTY HUB',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;letter-spacing:2px;color:var(--sectext);line-height:1;")}
          ${ph('Keto 30-Day Challenge',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);text-align:right;")}
        </div>
      </div>
      <div style="padding:34px 48px 44px;">
        ${ph('Day 7 · Sunday',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#888888;margin-bottom:14px;")}
        ${ph('One Week Down.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:56px;line-height:0.92;letter-spacing:1px;text-transform:uppercase;color:var(--sectext);")}
        ${ph('Your subheadline goes here.',"font-family:'Montserrat',sans-serif;font-weight:300;font-size:15px;color:var(--secmuted);margin-top:18px;letter-spacing:.5px;")}
      </div>
      <div style="height:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
    </div>`},

  chHeaderFinale:{group:'Challenge',icon:'✦',name:'Challenge Header — Finale (30/30)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);">
      <div style="padding:44px 48px 0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
          ${ph('LNGVTY HUB',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;letter-spacing:2px;color:var(--sectext);line-height:1;")}
          ${ph('Keto 30-Day Challenge',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);text-align:right;")}
        </div>
      </div>
      <div style="padding:36px 48px 8px;text-align:center;">
        ${ph('You Finished. Day 30.',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:var(--accent);margin-bottom:16px;")}
        <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:84px;line-height:0.9;letter-spacing:1px;color:var(--sectext);">${ph('30',"font-family:'Montserrat',sans-serif;font-weight:900;color:var(--sectext);display:inline;",'span')}<span style="color:var(--accent);">/</span>${ph('30',"font-family:'Montserrat',sans-serif;font-weight:900;color:var(--sectext);display:inline;",'span')}</div>
        ${ph('You Did It.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;letter-spacing:1px;text-transform:uppercase;color:var(--sectext);margin-top:14px;")}
        ${ph('Thirty days of showing up. Let\u2019s read your results.',"font-family:'Montserrat',sans-serif;font-weight:300;font-size:15px;color:var(--secmuted);margin-top:14px;letter-spacing:.5px;max-width:400px;margin-left:auto;margin-right:auto;")}
      </div>
      <div style="padding:24px 48px 40px;text-align:center;">
        ${ph('★ ★ ★ ★ ★',"font-size:18px;letter-spacing:8px;color:var(--accent);")}
      </div>
      <div style="height:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
    </div>`},

  chStrip:{group:'Strips',icon:'▭',name:'Milestone Strip',theme:'orange',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:15px 48px;text-align:center;">
      ${ph('★  Two weeks down — you\u2019re at the halfway mark  ★',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--sectext);")}
    </div>`},

  chBody:{group:'Body',icon:'¶',name:'Letter / Body Text',theme:'white',mode:'graphics',
    html:()=>{
      const para=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td valign="top">${ph(txt,"font-size:15px;line-height:1.75;color:var(--secmuted);font-weight:300;margin-bottom:18px;",'p')}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:44px 48px;">
        ${ph('The good news',"font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:18px;")}
        ${listBlock([para('Your paragraph goes here. Write as much as you like — this block is for the letter or intro copy.')],para('New paragraph'),'Add paragraph')}
        <div style="margin-top:14px;">${ph('— Tim',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;color:var(--sectext);",'span')}</div>
      </div>`;}},

  chList:{group:'Lists',icon:'☰',name:'Bulleted List (orange ›)',theme:'white',mode:'graphics',
    html:()=>{
      const li=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td width="20" valign="top" style="width:20px;font-size:16px;color:var(--accent);line-height:1.6;font-weight:700;">›</td>
        <td valign="top" style="padding:0 0 14px 4px;">${ph(txt,"font-size:14px;line-height:1.65;color:var(--secmuted);font-weight:300;")}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:40px 48px;">
        ${ph('List heading',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:20px;")}
        ${listBlock([li('First list item — click to edit.'),li('Second item with a longer description that wraps to show how it flows.'),li('Third item.')],li('New list item'),'Add item')}
      </div>`;}},

  chNumbered:{group:'Lists',icon:'①',name:'Numbered List (circles)',theme:'white',mode:'graphics',
    html:()=>{
      const step=(n,txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td width="34" valign="top" style="width:34px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:26px;height:26px;background:var(--accent);border-radius:50%;"><tr><td align="center" valign="middle" style="width:26px;height:26px;line-height:26px;">${ph(n,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:12px;color:#ffffff;")}</td></tr></table></td>
        <td valign="top" style="padding:0 0 18px 4px;">${ph(txt,"font-size:14px;line-height:1.65;color:var(--secmuted);font-weight:300;")}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:40px 48px;">
        ${ph('How it works',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:22px;")}
        ${listBlock([step('1','First step — click to edit the number or the text.'),step('2','Second step.'),step('3','Third step.')],step('4','New step'),'Add step')}
      </div>`;}},

  chChips:{group:'Lists',icon:'◧',name:'Chip List (tinted)',theme:'white',mode:'graphics',
    html:()=>{
      const chip=(txt)=>`<span class="li-wrap" style="display:inline-block;position:relative;margin:0 8px 8px 0;"><span style="display:inline-block;background:#ffffff;border:1px solid #ead9d0;padding:9px 14px;">${ph(txt,"font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--heading);display:inline;",'span')}</span><button class="li-del" onclick="delLi(this)" style="top:-6px;right:-6px;">×</button></span>`;
      const note=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr>
        <td width="16" valign="top" style="width:16px;font-size:13px;color:var(--accent);line-height:1.6;">›</td>
        <td valign="top" style="padding:0 0 2px 4px;">${ph(txt,"font-size:13px;line-height:1.6;color:#777777;font-weight:300;")}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:#faf7f5;padding:34px 48px;">
        ${ph('Sweeteners that won\u2019t spike your insulin',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
        ${ph('Short supporting line under the heading.',"font-size:13px;line-height:1.6;color:#888888;font-weight:300;margin-bottom:18px;")}
        <div style="margin-bottom:6px;">${listBlock([chip('Stevia'),chip('Monk Fruit'),chip('Erythritol'),chip('Allulose'),chip('Swerve')],chip('New chip'),'Add chip')}</div>
        <div style="margin-top:14px;">${listBlock([note('First note about the options above.'),note('Second note.')],note('New note'),'Add note')}</div>
      </div>`;}},

  chCallout:{group:'Highlight',icon:'❝',name:'Accent-Bar Callout',theme:'white',mode:'graphics',
    html:()=>`<div style="background:#faf7f5;padding:32px 48px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>
        <td width="5" valign="top" style="width:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</td>
        <td valign="middle" style="padding-left:20px;">
          ${ph('The big takeaway goes here — one strong sentence.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:20px;line-height:1.35;color:var(--heading);")}
          ${ph('An optional supporting line underneath.',"font-size:13px;line-height:1.6;color:#888888;font-weight:300;margin-top:8px;")}
        </td>
      </tr></table>
    </div>`},

  chQuestions:{group:'Lists',icon:'▤',name:'Question Cards',theme:'white',mode:'graphics',
    html:()=>{
      const q=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:14px;position:relative;"><tr>
        <td width="5" valign="top" style="width:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</td>
        <td valign="middle" style="background:#ffffff;padding:16px 20px;">${ph(txt,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;line-height:1.35;color:var(--heading);")}</td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:#faf7f5;padding:36px 48px;">
        ${ph('As you head into the final week, ask yourself',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:16px;")}
        ${listBlock([q('What habits do I want to keep?'),q('What changes have improved my life?'),q('What do I want my Day 30 results to look like?')],q('New question'),'Add question')}
      </div>`;}},

  chMetrics:{group:'Challenge',icon:'▥',name:'Scan Reader (metrics)',theme:'white',mode:'graphics',
    html:()=>{
      const m=(title,desc)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:10px;position:relative;"><tr>
        <td width="5" valign="top" style="width:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</td>
        <td valign="middle" style="background:#faf7f5;padding:16px 20px;">
          ${ph(title,"font-family:'Montserrat',sans-serif;font-weight:900;font-size:15px;color:var(--heading);text-transform:uppercase;")}
          ${ph(desc,"font-size:13px;line-height:1.55;color:#888888;font-weight:300;margin-top:3px;")}
        </td>
        <td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td>
      </tr></table>`;
      return `<div style="background:var(--secbg);padding:44px 48px;">
        ${ph('Your final results',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:18px;")}
        ${ph('Your FitManager scan report is attached. Compare these numbers to your Day 0 scan.',"font-size:15px;line-height:1.75;color:var(--secmuted);font-weight:300;margin-bottom:20px;",'p')}
        ${listBlock([m('Body Fat Percentage','The share of your weight that\u2019s fat — the number that actually moved.'),m('Skeletal Muscle Mass','The muscle you kept (or built) while losing fat — that\u2019s the goal.'),m('Visceral Fat Level','The deep belly fat around your organs — the one that matters most for health.')],m('New Metric','What this number means.'),'Add metric')}
      </div>`;}},

  chAttach:{group:'Highlight',icon:'📎',name:'Attachment Callout',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:28px 48px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>
        <td width="52" valign="middle" style="width:52px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:42px;height:42px;background:var(--accent);"><tr><td align="center" valign="middle" style="width:42px;height:42px;line-height:42px;font-size:20px;color:#ffffff;">${ph('📎',"font-size:20px;color:#ffffff;display:inline;",'span')}</td></tr></table></td>
        <td valign="middle" style="padding-left:8px;">
          ${ph('Attached: Your File Name',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:15px;color:var(--sectext);text-transform:uppercase;line-height:1.2;")}
          ${ph('A short line about what the attachment is.',"font-size:12px;line-height:1.5;color:var(--secmuted);font-weight:300;margin-top:4px;")}
        </td>
      </tr></table>
    </div>`},

  chVideo:{group:'Embed',icon:'▶',name:'Video Embed (poster link)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:40px 48px;">
      ${ph('Watch this week\u2019s video',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('Video Title Goes Here',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);text-transform:uppercase;line-height:1.1;margin-bottom:20px;")}
      <span class="editable-link" data-href="#" style="display:block;position:relative;">
        <a contenteditable="false" href="#" style="display:block;text-decoration:none;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#3a3a3a;border:1px solid #4a4a4a;">
            <tr><td align="center" valign="middle" style="padding:60px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:66px;height:66px;background:var(--accent);border-radius:50%;margin:0 auto;"><tr><td align="center" valign="middle" style="width:66px;height:66px;line-height:66px;font-size:24px;color:#ffffff;">&#9654;</td></tr></table>
              <div style="margin-top:16px;">${ph('Tap to play  ·  4 min',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#cccccc;")}</div>
            </td></tr>
          </table>
        </a>
        <button class="link-edit" type="button" onclick="openLinkModal(this)">&#128279; link</button>
      </span>
      <div style="margin-top:10px;font-size:11px;line-height:1.5;color:var(--secmuted);font-weight:300;">Can\u2019t see it? ${realBtn('Watch on the web →',"color:var(--accent);text-decoration:none;font-weight:700;display:inline;",'#')}</div>
    </div>`},

  chCall:{group:'CTA',icon:'📅',name:'Check-In Call Box',theme:'white',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:44px 48px 20px;">
      ${ph('This is happening today',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbbbbb;margin-bottom:6px;")}
      ${ph('Weekly Check-In Call',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;color:var(--sectext);text-transform:uppercase;line-height:1.1;margin-bottom:20px;")}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #f0f0f0;margin-bottom:20px;"><tr>
        <td width="80" valign="middle" align="center" style="width:80px;background:var(--gray);padding:16px 8px;text-align:center;">
          ${ph('Week 1',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffffff;opacity:.7;")}
          ${ph('07',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:30px;color:#ffffff;line-height:1.1;")}
          ${ph('Sunday',"font-size:9px;color:#ffffff;opacity:.6;font-weight:300;text-transform:capitalize;margin-top:2px;")}
        </td>
        <td valign="top" style="padding:16px 18px;">
          <div style="margin-bottom:6px;">${ph('Sunday at [TIME]',"font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:var(--heading);text-transform:uppercase;display:inline;",'span')} ${ph('· LNGVTY Hub',"font-size:12px;color:#999999;font-weight:300;display:inline;",'span')}</div>
          ${ph('One line about the call — bring your questions.',"font-size:13px;line-height:1.65;color:#888888;font-weight:300;")}
          <div style="margin-top:10px;">${ph('In person + Zoom',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 9px;background:rgba(224,90,27,.12);color:var(--accent);display:inline-block;",'span')}</div>
        </td>
      </tr></table>
      ${ph('On the agenda',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#bbbbbb;margin-bottom:12px;")}
      ${(()=>{const a=(txt)=>`<table class="li-wrap" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;position:relative;"><tr><td width="16" valign="top" style="width:16px;font-size:14px;color:var(--accent);line-height:1.7;">›</td><td valign="top" style="padding-bottom:4px;">${ph(txt,"font-size:14px;line-height:1.7;color:var(--secmuted);font-weight:300;")}</td><td class="li-ctrls" valign="top" style="width:0;font-size:0;line-height:0;white-space:nowrap;">${liMoves()}<button class="li-del" onclick="delLi(this)">×</button></td></tr></table>`;
        return listBlock([a('First agenda item.'),a('Second agenda item.'),a('Third agenda item.')],a('New agenda item'),'Add agenda item');})()}
      <div style="margin-top:24px;">${realBtn('Join the Zoom call →',"display:inline-block;background:var(--accent);padding:15px 34px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;",'#')}</div>
      ${ph('The link also lives in the WhatsApp group. Can\u2019t make it in person? Hop on Zoom.',"font-size:11px;line-height:1.5;color:#999999;font-weight:300;margin-top:10px;")}
    </div>`},

  chWhatsapp:{group:'CTA',icon:'💬',name:'Join Group (WhatsApp)',theme:'white',mode:'graphics',
    html:()=>`<div style="background:#faf7f5;padding:32px 48px;">
      ${ph('The group chat',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;")}
      ${ph('Not in the WhatsApp group yet?',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:18px;color:var(--heading);line-height:1.2;")}
      ${ph('That\u2019s where the call link, daily check-ins, and everyone\u2019s wins live.',"font-size:13px;line-height:1.6;color:#888888;font-weight:300;margin-top:6px;")}
      <div style="margin-top:16px;">${realBtn('Join the WhatsApp group →',"display:inline-block;border:2px solid var(--accent);padding:13px 30px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);text-decoration:none;",'#')}</div>
    </div>`},

  chOffer:{group:'Offers',icon:'★',name:'Special Offer / Discount',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);">
      <div style="height:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>
      <div style="padding:44px 48px 10px;text-align:center;">
        ${ph('Completer Reward — Limited',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:var(--accent);margin-bottom:14px;")}
        ${ph('3 Months of 1:1 Coaching',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:34px;line-height:1.05;letter-spacing:.5px;text-transform:uppercase;color:var(--sectext);")}
        <div style="margin:20px auto 0;display:inline-block;background:var(--accent);padding:12px 26px;">${ph('50% OFF',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;letter-spacing:1px;color:#ffffff;display:inline;",'span')}</div>
        ${ph('You proved you\u2019ll show up. Now let\u2019s build on it — personalized coaching to lock in your results.',"font-size:14px;line-height:1.65;color:var(--secmuted);font-weight:300;margin-top:20px;max-width:420px;margin-left:auto;margin-right:auto;")}
      </div>
      <div style="padding:24px 48px 46px;text-align:center;">
        ${realBtn('Claim 50% off coaching →',"display:inline-block;background:var(--accent);padding:16px 40px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;",'#')}
        ${ph('Offer for 30-Day Challenge completers only.',"font-size:11px;line-height:1.5;color:#888888;font-weight:300;margin-top:12px;")}
      </div>
    </div>`},

  chSignoff:{group:'Strips',icon:'✧',name:'Signoff Strip',theme:'white',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:40px 48px;text-align:center;">
      ${ph('See You There.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:26px;color:var(--sectext);text-transform:uppercase;line-height:1.05;")}
      ${ph('One motivating closing line goes right here.',"font-size:13px;line-height:1.6;color:#888888;font-weight:300;margin-top:10px;max-width:400px;margin-left:auto;margin-right:auto;")}
    </div>
    <div style="height:5px;background:var(--accent);font-size:0;line-height:0;">&nbsp;</div>`},

  chQuote:{group:'Strips',icon:'❞',name:'Quote + Signature',theme:'white',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:46px 48px;text-align:center;">
      ${ph('\u201cDon\u2019t cry because it\u2019s over, smile because it happened.\u201d',"font-family:'Montserrat',sans-serif;font-weight:300;font-size:22px;line-height:1.5;color:var(--heading);font-style:italic;max-width:440px;margin:0 auto;")}
      ${ph('And then do it again.',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:14px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-top:18px;")}
      <div style="border-top:1px solid #eeeeee;padding-top:24px;margin-top:30px;text-align:left;">
        ${ph('Yours in health,',"font-size:14px;line-height:1.6;color:#888888;font-weight:300;")}
        ${ph('Tim Pedersen',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;color:var(--heading);margin-top:6px;")}
        ${ph('LNGVTY Hub',"font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-top:2px;")}
      </div>
    </div>`},

  chFooter:{group:'Challenge',icon:'▂',name:'Challenge Footer (black)',theme:'dark',mode:'graphics',
    html:()=>`<div style="background:var(--secbg);padding:34px 48px;text-align:center;">
      ${ph('LNGVTY HUB',"font-family:'Montserrat',sans-serif;font-weight:900;font-size:16px;letter-spacing:2px;color:var(--sectext);")}
      ${ph('Keto 30-Day Challenge · Day 7 of 30',"font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#777777;margin-top:8px;")}
      <div style="margin-top:16px;">${ph('Carrboro, NC · ',"font-size:11px;line-height:1.6;color:#666666;font-weight:300;display:inline;",'span')}${realBtn('Unsubscribe',"color:#888888;text-decoration:underline;display:inline;",'#')}</div>
    </div>`},

};
