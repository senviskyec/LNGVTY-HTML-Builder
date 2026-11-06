/* LNGVTY Builder — app engine. Extracted from index.html.
   Depends on scripts/registry.js being loaded first. */
/* ═══════════ PER-SECTION THEME ═══════════
   Each theme sets three vars the sections read: --secbg (background),
   --sectext (headings / strong text) and --secmuted (secondary text).
   Sections that paint with these vars flip cleanly when you cycle the theme. */
const SEC_THEMES={
  white :{'--secbg':'#ffffff','--sectext':'var(--heading)','--secmuted':'#888888'},
  cream :{'--secbg':'var(--paper)','--sectext':'var(--heading)','--secmuted':'#8a8781'},
  gray  :{'--secbg':'var(--gray)','--sectext':'#ffffff','--secmuted':'#b8b8b8'},
  dark  :{'--secbg':'var(--dark)','--sectext':'#ffffff','--secmuted':'#aaaaaa'},
  orange:{'--secbg':'var(--accent)','--sectext':'#ffffff','--secmuted':'rgba(255,255,255,0.85)'}
};
const THEME_CYCLE=['white','cream','gray','dark','orange'];
const THEME_GLYPH={white:'○ White',cream:'◍ Cream',gray:'◐ Gray',dark:'● Black',orange:'◆ Accent'};

/* ═══════════ SECTION DESCRIPTIONS (hover preview) ═══════════ */
const DEFAULT_DESC={
  // challenge (from the Day 7/14/21/30 emails)
  chHeader:'Black challenge header — brand row, day label, big headline, subheadline, orange accent bar. Used on Weeks 1–3.',
  chHeaderFinale:'The Day 30 finale header — giant 30/30, "You Did It", stars. The distinct Week 4 version.',
  chStrip:'A thin orange one-line strip — milestone, announcement, or tagline.',
  chBody:'Plain letter / intro copy block with a small orange eyebrow heading and a signature line.',
  chList:'A bulleted list with orange › markers. Add, remove, and reorder items.',
  chNumbered:'A numbered list with orange number circles. Add, remove, and reorder steps.',
  chChips:'An orange-tinted block with add-removable chips plus a notes list. Good for lists of options, tags, or ingredients.',
  chCallout:'An orange accent-bar callout for one strong takeaway sentence.',
  chQuestions:'Reflection questions, each in its own orange accent-bar card. Add or remove questions.',
  chMetrics:'Scan reader — add-removable metric cards (body fat, muscle, visceral fat) with plain-language notes.',
  chAttach:'"Attached file" callout with a paperclip icon, title, and one supporting line.',
  chVideo:'Video embed — a play-button poster whose link you set, plus a "watch on the web" link. Reusable for any graphic.',
  chCall:'The check-in call box — gray date box, editable details, an add-removable agenda list, and a Zoom button.',
  chWhatsapp:'Join-a-group block (WhatsApp/Discord/etc.) — editable heading, blurb, and an outlined join button.',
  chOffer:'Special-offer / discount block — big headline, a percent-off badge, and a claim button.',
  chSignoff:'A centered signoff strip with a big line, one supporting line, and an orange accent bar.',
  chQuote:'Closing quote with a signature block (name + role).',
  chFooter:'Black challenge footer — brand, "Day X of 30" line, location, and an unsubscribe link.',
  // graphics
  topbar:'A thin top banner bar — good for a tagline or "View in browser" line.',
  footer:'The closing footer with logo, social links, and an unsubscribe line.',
  hero:'Bold hero with a giant faint background number, headline, and intro line. The background number is editable.',
  herochallenge:'Hero with a challenge badge layout — logo on the left, challenge name and start date on the right.',
  statbar:'A row of big orange stats on a colored bar — great for highlighting numbers.',
  statstrip:'A compact dark strip of stats with labels.',
  proofstrip:'A three-stat social-proof strip.',
  greeting:'A friendly greeting plus a body paragraph.',
  introbox:'A quote-style intro box with an accent left border.',
  checklist:'A checklist card with dot bullets.',
  infocards:'Stacked info cards, each with a title and text.',
  progress:'A progress card showing a goal and how far along it is.',
  explainer:'An explainer block paired with a macro stat bar.',
  cta:'A call-to-action block with a headline and a button.',
  feedback:'A feedback request grid with a button. The button stretches full width.',
  offerprice:'An offer / price-drop card with a button and an expiry tag.',
  scanurgency:'An urgency block with a countdown and a full-width booking button.',
  timeline:'A results timeline with steps you can flip between complete (orange) and incomplete (gray).',
  embed:'A slot to paste a GoHighLevel form embed (iframe or script).',
  video:'An MP4 video block — set the file URL.',
  audio:'An MP3 audio block — set the file URL.',
  // newsletter
  nlheader:'The newsletter top: orange bar, black logo/date hero, and the orange weekly-quote band — all in one block.',
  nlschedule:'Recurring weekly schedule. Reorder days, and add multiple events to the same day with one connected bar.',
  nlmembers:'Welcome new members. Toggle member photos on or off and upload a picture for each.',
  nlrecipe:'Featured recipe with addable tags, add/removable macro stats, a grocery list, an optional photo, and an optional steps list.',
  nlquicktip:'A centered quick tip with an orange kicker and add/removable paragraphs.',
  nltip:'Tip Tuesday — a featured tip plus add/removable mini-tip cards and addable focus tags.',
  nlswaps:'Smarter swaps (instead of / try this) plus a budget-protein list, both add/removable.',
  nlevents:'Upcoming events as date boxes (month / day / weekday). Reorder them, add tags, and add an optional time chip by the title.',
  nl90:'The 90-day review reminder. Available in both the Graphics and Newsletter palettes.',
  nlcta:'The closing newsletter call-to-action ("Ready for This Week?").',
  // blog / webpage
  blognav:'Full-width site nav with the heartbeat logo, menu links, and a Get Started button.',
  bloghero:'Big blog hero with the LNGVTY heartbeat line behind it — category tag, headline, subtitle, author | date | read-time.',
  blogimage:'A full-width featured image with a caption. Set the image URL with the button on the block.',
  blogintro:'The opening paragraph with a large orange drop-cap first letter.',
  blogbody:'An article text block — uppercase heading plus paragraphs. Select words to color or link them.',
  blogquote:'A pull quote with an accent left border to break up the article.',
  blogtips:'A 2-up grid of add/removable tip cards (icon + heading + text).',
  blogtakeaway:'A dark "takeaway" box with an accent edge for the single key point.',
  blogdivider:'A thin horizontal rule to separate article sections.',
  blognewsletter:'Embed slot for this week\u2019s newsletter — paste the exported newsletter HTML or an iframe.',
  blogcta:'A bold full-width call-to-action banner in brand orange, with the heartbeat line.',
  blogfooter:'Site footer with the heartbeat logo, "LNGVTY | Carrboro" divider, address, and social links.'
};
function getDescMap(){try{return Object.assign({},DEFAULT_DESC,JSON.parse(localStorage.getItem('lngvty_secdesc')||'{}'));}catch(e){return Object.assign({},DEFAULT_DESC);}}
function getDesc(key){const m=getDescMap();return m[key]||'A reusable section block. Click to add it to your canvas.';}
function setDesc(key,text){let m={};try{m=JSON.parse(localStorage.getItem('lngvty_secdesc')||'{}');}catch(e){}m[key]=text;try{localStorage.setItem('lngvty_secdesc',JSON.stringify(m));}catch(e){}}

function applySecTheme(sec,theme){
  if(!SEC_THEMES[theme])theme='white';
  sec.dataset.theme=theme;
  Object.entries(SEC_THEMES[theme]).forEach(([k,v])=>sec.style.setProperty(k,v));
  const btn=sec.querySelector('.sc-theme');if(btn)btn.innerHTML=THEME_GLYPH[theme];
}
function cycleTheme(btn){const sec=btn.closest('.sec');const cur=sec.dataset.theme||'white';const next=THEME_CYCLE[(THEME_CYCLE.indexOf(cur)+1)%THEME_CYCLE.length];applySecTheme(sec,next);}

/* ═══════════ PER-SECTION COLOR ═══════════
   The global theme sets --accent for the whole document. A section can override
   it locally, which is what lets one plan run a green track and a purple track
   side by side. The override is just an inline custom property on the .sec, so
   everything inside (rules, bullets, borders, eyebrows) follows automatically and
   the export's variable resolver already walks it. */
const SEC_PALETTE=[
  ['Brand',  '#e05a1b'], ['Green',  '#3f7d4f'], ['Plum',   '#6b2d5c'],
  ['Blue',   '#2f6b96'], ['Amber',  '#a8622a'], ['Rust',   '#9c3a3a'],
  ['Teal',   '#2f7d76'], ['Ink',    '#3a3a3a']
];
let colorTargetSec=null;
function openSecColor(btn){
  colorTargetSec=btn.closest('.sec');
  const cur=(colorTargetSec.style.getPropertyValue('--accent')||'').trim();
  const host=document.getElementById('secColorSwatches');
  host.innerHTML=SEC_PALETTE.map(([n,hex])=>
    `<button class="sw${cur.toLowerCase()===hex.toLowerCase()?' on':''}" style="background:${hex}" title="${n}" onclick="setSecColor('${hex}')"></button>`
  ).join('')+`<button class="sw sw-clear" title="Use global color" onclick="setSecColor('')">\u2715</button>`;
  const hx=document.getElementById('secColorHex');
  if(hx)hx.value=cur||'';
  document.getElementById('secColorBg').classList.add('show');
}
function closeSecColor(){document.getElementById('secColorBg').classList.remove('show');colorTargetSec=null;}
function setSecColor(hex){
  if(!colorTargetSec)return;
  if(hex){colorTargetSec.style.setProperty('--accent',hex);colorTargetSec.dataset.accent=hex;}
  else{colorTargetSec.style.removeProperty('--accent');delete colorTargetSec.dataset.accent;}
  const chip=colorTargetSec.querySelector('.sc-color .sc-dot');
  if(chip)chip.style.background=hex||'var(--accent)';
  markDirty&&markDirty();
  closeSecColor();
  toast(hex?('Section color set '+hex):'Using global color');
}
function applySecColorHex(){
  const v=(document.getElementById('secColorHex').value||'').trim();
  if(v && !/^#?[0-9a-f]{6}$/i.test(v)){toast('Enter a 6-digit hex, e.g. #3f7d4f');return;}
  setSecColor(v?(v.charAt(0)==='#'?v:'#'+v):'');
}

/* ═══════════ CUSTOM SECTIONS + TABS ═══════════
   Built-in sections live in SECTIONS. Custom (user-pasted) sections are
   stored in CUSTOM and merged in. Each section has a .group (tab name).
   TABS is the ordered list of tab names shown on the left rail. */
let CUSTOM={};               // key -> {group,icon,name,theme,raw}
let TABS=[];                 // ordered tab names for the sections rail
const DEFAULT_GROUP_ORDER=['Structure','Challenge','Investigation','Hero','Stats','Body','Lists','Social Proof','Highlight','Offers','Strips','CTA','Embed'];

function allSections(){
  const all=Object.assign({},SECTIONS,builtCustomMap(),builtDuplicateMap());
  Object.keys(all).forEach(k=>{if(all[k]&&typeof all[k]==='object')all[k].__key=k;});
  return all;
}

/* ═══════════ LOCAL SECTION ORGANIZATION (no GitHub) ═══════════
   Operators can locally re-home sections into different tabs/modes, rename them,
   duplicate a section into several tabs, and create/rename/reorder tabs. All of
   this is a thin override layer over the built-in registry, saved to
   localStorage — it never touches the section HTML or the saved newsletters. */
const ORG_KEY='lngvty_section_org';
let SECTION_ORG=loadOrg();
function loadOrg(){
  try{const o=JSON.parse(localStorage.getItem(ORG_KEY)||'{}');
    return {over:o.over||{}, dupes:o.dupes||{}, tabOrder:o.tabOrder||{}, tabNames:o.tabNames||{}, newTabs:o.newTabs||{}};
  }catch(e){return {over:{},dupes:{},tabOrder:{},tabNames:{},newTabs:{}};}
}
function saveOrg(){try{localStorage.setItem(ORG_KEY,JSON.stringify(SECTION_ORG));}catch(e){}}
/* per-section override: {group, ngroup, mode, name} — any subset */
function orgOver(key){return SECTION_ORG.over[key]||null;}
/* duplicate sections: {dupKey:{base, group, mode, name, ngroup}} — clones a base
   section into another tab. Rendered via allSections through builtDuplicateMap. */
function builtDuplicateMap(){
  const m={};
  Object.entries(SECTION_ORG.dupes||{}).forEach(([k,d])=>{
    const base=(SECTIONS[d.base]||builtCustomMap()[d.base]);
    if(!base)return;
    m[k]=Object.assign({},base,{group:d.group||base.group,mode:d.mode||base.mode,name:d.name||base.name,ngroup:d.ngroup,__dupBase:d.base});
  });
  return m;
}
function builtCustomMap(){
  const m={};
  Object.entries(CUSTOM).forEach(([k,c])=>{
    m[k]={group:c.group,icon:c.icon||'◧',name:c.name,theme:c.theme||'white',mode:c.mode||'graphics',custom:true,html:()=>c.raw};
  });
  return m;
}
/* does a section belong in the currently-shown rail tab? */
function secMode(s){const ov=s&&s.__key&&orgOver(s.__key);return (ov&&ov.mode)||s.mode||'graphics';}
/* A shared section can sit in a different rail group depending on the mode —
   e.g. the Intro Box is "Body" in Graphics but belongs with the Newsletter blocks. */
function secGroup(s){
  const ov=s&&s.__key&&orgOver(s.__key);
  if(ov){
    if(railMode==='newsletter'&&ov.ngroup)return ov.ngroup;
    if(ov.group)return ov.group;
  }
  if(railMode==='newsletter'&&s.ngroup)return s.ngroup;
  return s.group;
}
/* display name honoring a local rename */
function secName(key,s){const ov=orgOver(key);return (ov&&ov.name)||(s&&s.name)||key;}
function inCurrentMode(s){
  const m=secMode(s);
  if(railMode==='docs')return m==='docs';            // docs tab: only documentation sections
  if(m==='docs')return false;                        // docs sections never show elsewhere
  if(railMode==='blog')return m==='blog';            // blog tab: only blog sections
  if(m==='blog')return false;                        // blog sections never show in email tabs
  return m==='both'||m===railMode;                   // 'both' = graphics + newsletter
}
const NEWSLETTER_GROUP_ORDER=['Newsletter','Images','Members','Recipe','Tips','Nutrition','Events','CTA'];
const BLOG_GROUP_ORDER=['Header','Content','Embed','CTA'];
const DOCS_GROUP_ORDER=['Doc Structure','Doc Content','Doc Data','Doc Planning','Doc Close'];
function computeTabs(){
  const groups=new Set();
  Object.values(allSections()).forEach(s=>{if(inCurrentMode(s))groups.add(secGroup(s));});
  // include any empty tabs the operator created for this mode (so you can make a
  // tab first, then drag sections into it)
  (SECTION_ORG.newTabs[railMode]||[]).forEach(g=>groups.add(g));
  const ordered=[];
  // a saved per-mode order takes precedence when present
  const savedOrder=SECTION_ORG.tabOrder[railMode];
  const orderList=savedOrder&&savedOrder.length?savedOrder
    :(railMode==='newsletter')?NEWSLETTER_GROUP_ORDER:(railMode==='blog')?BLOG_GROUP_ORDER:(railMode==='docs')?DOCS_GROUP_ORDER:DEFAULT_GROUP_ORDER;
  orderList.forEach(g=>{if(groups.has(g)){ordered.push(g);groups.delete(g);}});
  TABS.forEach(g=>{if(groups.has(g)){ordered.push(g);groups.delete(g);}});
  groups.forEach(g=>ordered.push(g));
  TABS=ordered;
  return ordered;
}
/* display label for a tab (honoring a local rename) */
function tabLabel(g){const nm=SECTION_ORG.tabNames&&SECTION_ORG.tabNames[g];return nm||g;}

/* ═══════════ RAIL: MODE TOGGLE + ACCORDION PALETTE ═══════════ */
let railMode='newsletter';                // default tab | 'graphics' | 'newsletter' | 'blog' | 'hotkeys'
let builderMode='email';                  // 'email' | 'webpage'
let openGroups=null;                      // Set of expanded group names (null = init to all)

/* ═══════════ PAGE FORMAT ═══════════
   The canvas width + export style. Built-in presets cover the common cases; users
   can add their own (width, side padding, export mode) and they persist locally.
   `kind` drives the export pipeline: 'email' → table-based email-safe HTML,
   'web' → modern full-width HTML. */
const PF_BUILTIN=[
  {id:'email',   name:'Email / Graphic', dim:620,  pad:null, kind:'email', desc:'Narrow, table-based. Survives Outlook and Gmail.'},
  {id:'webpage', name:'Webpage',         dim:1100, pad:7,    kind:'web',   desc:'Full-width browser layout for blog and landing pages.'},
  {id:'document',name:'Document',        dim:1080, pad:7,    kind:'web',   desc:'Wide reading measure for plans, proposals and reports.'}
];
let pageFormat=PF_BUILTIN[0];
function pfCustomList(){try{return JSON.parse(localStorage.getItem('lngvty_pf_presets')||'[]');}catch(e){return [];}}
function pfSaveList(l){try{localStorage.setItem('lngvty_pf_presets',JSON.stringify(l));}catch(e){}}
function pfAll(){return PF_BUILTIN.concat(pfCustomList());}
function pfFind(id){return pfAll().find(p=>p.id===id)||PF_BUILTIN[0];}

/* Apply a format to the canvas. Kept backwards-compatible: setBuilderMode('email'
   |'webpage') still works, so older saved docs and any existing calls behave. */
function setBuilderMode(mode){
  const pf = (typeof mode==='object' && mode) ? mode : pfFind(mode==='webpage'?'webpage':(mode==='email'?'email':mode));
  pageFormat=pf;
  builderMode=(pf.kind==='email')?'email':'webpage';
  const frameEl=document.getElementById('frame');
  const isWide=(pf.kind!=='email');
  frameEl.classList.toggle('webpage-mode',isWide);
  document.body.classList.toggle('webpage-builder',isWide);
  // width is driven by the preset so custom sizes work
  frameEl.style.maxWidth = isWide ? (pf.dim+'px') : '';
  frameEl.style.width    = isWide ? '100%' : '';
  document.documentElement.style.setProperty('--doc-pad', (pf.pad!=null?pf.pad:7)+'%');
  const n=document.getElementById('pfName'), dm=document.getElementById('pfDim');
  if(n)n.textContent=pf.name;
  if(dm)dm.textContent=pf.dim+'px wide'+(pf.kind==='email'?' · email-safe':'');
  renderPagePresets();
  refreshState&&refreshState();
  try{localStorage.setItem('lngvty_pf_active',pf.id);}catch(e){}
}
function openPageFormat(){openSettings('pageformat');}
function renderPagePresets(){
  const host=document.getElementById('pfPresets');if(!host)return;
  const custom=pfCustomList();
  host.innerHTML=pfAll().map(p=>{
    const on=(p.id===pageFormat.id);
    const isCustom=custom.some(c=>c.id===p.id);
    return `<div class="pf-card${on?' on':''}" onclick="setBuilderMode(pfFind('${p.id}'))">
      ${isCustom?`<button class="pf-del" onclick="event.stopPropagation();deletePagePreset('${p.id}')" title="Delete preset">×</button>`:''}
      <div class="pf-card-name">${escapeHtml(p.name)}</div>
      <div class="pf-card-dim">${p.dim}px${p.pad!=null?' · '+p.pad+'% pad':''}</div>
      <div class="pf-card-desc">${escapeHtml(p.desc||(p.kind==='email'?'Email-safe export.':'Web export.'))}</div>
      <div class="pf-card-kind">${p.kind==='email'?'Email-safe tables':'Modern web HTML'}</div>
    </div>`;
  }).join('');
}
function readCustomForm(){
  const w=Math.max(320,Math.min(2000,parseInt(document.getElementById('pfW').value,10)||620));
  const pad=Math.max(0,Math.min(20,parseInt(document.getElementById('pfPad').value,10)||0));
  const kind=document.getElementById('pfExport').value==='email'?'email':'web';
  return {dim:w,pad:pad,kind:kind};
}
function applyCustomFormat(){
  const c=readCustomForm();
  setBuilderMode({id:'__custom',name:'Custom',dim:c.dim,pad:c.pad,kind:c.kind,desc:'Unsaved custom size.'});
  toast('Custom format applied');
}
function savePagePreset(){
  const c=readCustomForm();
  const name=(document.getElementById('pfNewName').value||'').trim();
  if(!name){toast('Give the preset a name first');return;}
  const list=pfCustomList();
  const id='pf-'+Date.now().toString(36);
  list.push({id,name,dim:c.dim,pad:c.pad,kind:c.kind,desc:'Custom preset.'});
  pfSaveList(list);
  document.getElementById('pfNewName').value='';
  setBuilderMode(pfFind(id));
  toast('Preset saved');
}
function deletePagePreset(id){
  if(!confirm('Delete this preset?'))return;
  pfSaveList(pfCustomList().filter(p=>p.id!==id));
  if(pageFormat.id===id)setBuilderMode(pfFind('email'));else renderPagePresets();
  toast('Preset deleted');
}

function setRailMode(m){
  railMode=m;
  const isSections=(m==='graphics'||m==='newsletter'||m==='blog'||m==='docs');
  // keep the dropdown showing the active content mode (Tags/Widgets are separate pins)
  const sel=document.getElementById('railModeSelect');
  if(sel&&isSections)sel.value=m;
  document.getElementById('mode-hotkeys').classList.toggle('active',m==='hotkeys');
  document.getElementById('mode-widgets')?.classList.toggle('active',m==='widgets');
  // dim the dropdown's underline when a pinned pane (Tags/Widgets) is active
  document.getElementById('railModeSelect')?.parentElement?.classList.toggle('muted',m==='hotkeys'||m==='widgets');
  document.getElementById('railSections').classList.toggle('active',isSections);
  document.getElementById('pane-hotkeys').classList.toggle('active',m==='hotkeys');
  document.getElementById('pane-widgets')?.classList.toggle('active',m==='widgets');
  if(m==='widgets')renderWidgets();
  const sl=document.getElementById('railSubLabel');
  if(sl&&isSections){
    sl.textContent=(m==='newsletter')?'Newsletter Sections':(m==='blog')?'Webpage / Blog Sections':(m==='docs')?'Documentation Sections':'Graphics Sections';
  }
  const st=document.getElementById('railStarter');
  if(st)st.style.display=(m==='newsletter')?'flex':'none';
  if(isSections){openGroups=null;renderRail(document.getElementById('palSearch')?.value||'');}
}
/* Touching the mode dropdown while the Tags pane is open should return to the
   sections list — a <select> onchange won't fire if the same value is re-picked,
   so this gives the user a reliable way back out of Tags. */
function exitTagsPane(){
  if(railMode!=='hotkeys'&&railMode!=='widgets')return;
  const sel=document.getElementById('railModeSelect');
  setRailMode((sel&&sel.value)||'graphics');
}

function toggleGroup(g){
  if(openGroups.has(g))openGroups.delete(g);else openGroups.add(g);
  renderRail(document.getElementById('palSearch')?.value||'');
}

function renderRail(filter=''){
  computeTabs();
  const listEl=document.getElementById('accList');
  if(!listEl)return;
  listEl.innerHTML='';
  const sections=allSections();
  const f=(filter||'').trim().toLowerCase();

  // group sections by tab, preserving TABS order (only sections for the current tab)
  const grouped={};
  Object.entries(sections).forEach(([k,s])=>{if(inCurrentMode(s)){const g=secGroup(s);(grouped[g]=grouped[g]||[]).push([k,s]);}});
  // sections may declare a norder hint to pin their position within a group
  Object.values(grouped).forEach(list=>{
    list.forEach((it,i)=>{it._i=i;});
    list.sort((a,b)=>{
      const ao=(a[1].norder!==undefined)?a[1].norder:999+a._i;
      const bo=(b[1].norder!==undefined)?b[1].norder:999+b._i;
      return ao-bo;
    });
  });

  // init open-state: all groups open by default
  if(openGroups===null){openGroups=new Set(TABS);}

  TABS.forEach((g)=>{
    const all=grouped[g]||[];
    const items=all.filter(([k,s])=>!f||secName(k,s).toLowerCase().includes(f)||tabLabel(g).toLowerCase().includes(f));
    if(f && !items.length)return;                 // hide empty groups while searching
    // while filtering, force-open any group with matches
    const isOpen = f ? true : openGroups.has(g);

    const group=document.createElement('div');
    group.className='acc-group'+(isOpen?' open':'');

    const head=document.createElement('button');
    head.className='acc-head';
    head.innerHTML=`<span class="chev">▶</span><span class="lbl">${esc(tabLabel(g))}</span><span class="cnt">${all.length}</span>`;
    head.onclick=()=>{ if(f){document.getElementById('palSearch').value='';openGroups=new Set([g]);renderRail('');} else toggleGroup(g); };
    group.appendChild(head);

    const body=document.createElement('div');body.className='acc-body';
    const pal=document.createElement('div');pal.className='palette';pal.style.padding='2px 0 4px';
    items.forEach(([k,s])=>{
      const el=document.createElement('div');el.className='pal-item';
      const delBtn=s.custom?`<span class="pal-del" title="Delete custom section" onclick="event.stopPropagation();deleteCustom('${k}')">×</span>`:'';
      el.innerHTML=`<span class="ic">${s.icon}</span><span class="nm">${esc(secName(k,s))}</span>${delBtn}<span class="plus">+</span>`;
      armPaletteDrag(el,k);   // click = append; click-and-hold = drag into place
      el.addEventListener('mouseenter',()=>showSecPreview(k,s,el));
      el.addEventListener('mouseleave',hideSecPreview);
      pal.appendChild(el);
    });
    body.appendChild(pal);
    group.appendChild(body);
    listEl.appendChild(group);
  });

  if(!listEl.children.length){
    const e=document.createElement('div');e.style.cssText='padding:24px 14px;color:#666;font-size:12px;';
    e.textContent='No sections match your search.';listEl.appendChild(e);
  }
}

/* ═══════════ SECTION HOVER PREVIEW ═══════════ */
let spKey=null,spHideTimer=null;
function showSecPreview(key,s,anchor){
  clearTimeout(spHideTimer);
  spKey=key;
  const pop=document.getElementById('secPreview');
  const scale=document.getElementById('spScale');
  document.getElementById('spName').textContent=s.name;
  document.getElementById('spText').textContent=getDesc(key);
  document.getElementById('spEditArea').style.display='none';
  document.getElementById('spText').style.display='block';
  // render the section html into a scaled preview (email is ~620px wide -> scale to 340)
  let html='';try{html=(typeof s.html==='function')?s.html():(s.raw||'');}catch(e){html='';}
  scale.innerHTML=`<div style="width:620px;background:#fff;">${html}</div>`;
  // make the preview legible: fill empty ghost text with its placeholder, drop editor-only controls
  const previewRoot=scale.firstElementChild;
  previewRoot.querySelectorAll('.li-add,.li-del,.li-move,.li-drag,.tag-add,.stat-add,.sched-addsub,.sched-cal,.link-edit,.nl-flip,.btn-del,.tl-toggle,.nl-pic-btn,.nl-pictoggle,.nl-steptoggle,.nl-rpic-btn,.nl-rpictoggle,.nl-ppic-btn,.nl-pptoggle,.sec-controls,.sec-tag,.fill-bar,.doc-hue,.doc-extra,.doc-extra-btns').forEach(e=>e.remove());
  previewRoot.querySelectorAll('[data-ph]').forEach(e=>{
    if(e.textContent.trim().length===0 && !e.querySelector('img,iframe,video,audio')){e.textContent=e.getAttribute('data-ph')||'';}
    e.classList.remove('is-empty');
  });
  // show any toggled-off newsletter steps so the preview isn't oddly empty
  previewRoot.querySelectorAll('.nl-steps').forEach(e=>{e.style.display='';});
  const W=340, srcW=620, sc=W/srcW;
  scale.style.transform=`scale(${sc})`;
  // height of wrap = scaled content height (capped by CSS max-height)
  requestAnimationFrame(()=>{
    const inner=scale.firstElementChild;
    const h=inner?inner.getBoundingClientRect().height:0;
    const wrap=pop.querySelector('.sp-prevwrap');
    wrap.style.height=Math.min(300,h)+'px';
  });
  pop.style.display='block';
  // position next to the anchor, to its right, clamped to viewport
  const r=anchor.getBoundingClientRect();
  let left=r.right+10, top=r.top-20;
  const pw=340, ph=420;
  if(left+pw>window.innerWidth-8)left=r.left-pw-10;
  if(left<8)left=8;
  if(top+ph>window.innerHeight-8)top=Math.max(8,window.innerHeight-ph-8);
  if(top<8)top=8;
  pop.style.left=left+'px';pop.style.top=top+'px';
}
function hideSecPreview(){
  spHideTimer=setTimeout(()=>{
    const pop=document.getElementById('secPreview');
    if(!pop.classList.contains('interactive'))pop.style.display='none';
  },120);
}
// keep open while hovering the popup (so the Edit button is usable)
(function(){
  const pop=document.getElementById('secPreview');
  if(!pop)return;
  pop.addEventListener('mouseenter',()=>{clearTimeout(spHideTimer);pop.classList.add('interactive');});
  pop.addEventListener('mouseleave',()=>{pop.classList.remove('interactive');pop.style.display='none';document.getElementById('spEditArea').style.display='none';document.getElementById('spText').style.display='block';});
})();
function spEditDesc(){
  document.getElementById('spTa').value=getDesc(spKey);
  document.getElementById('spText').style.display='none';
  document.getElementById('spEditArea').style.display='flex';
  document.getElementById('spTa').focus();
}
function spSaveDesc(){
  const v=document.getElementById('spTa').value.trim();
  if(spKey){setDesc(spKey,v);}
  document.getElementById('spText').textContent=getDesc(spKey);
  document.getElementById('spText').style.display='block';
  document.getElementById('spEditArea').style.display='none';
  toast('Description saved');
}
const frame=document.getElementById('frame');
let dragSrc=null;
function refreshState(){
  if(typeof dirty!=='undefined')dirty=true;   // any structural change dirties the doc
document.getElementById('emptyHint').style.display=frame.querySelector('.sec')?'none':'block';const c=frame.querySelectorAll('.sec').length;document.getElementById('secCount').textContent=c+(c===1?' section':' sections');refreshPlaceholders();}
function controlsHTML(){
  return `<div class="sec-tag"></div>
    <div class="sec-controls">
      <button class="sc-btn sc-theme" title="Cycle block shade: white / cream / gray / black / accent" onclick="cycleTheme(this)">○ White</button>
      <button class="sc-btn sc-color" title="Set this section's color" onclick="openSecColor(this)"><span class="sc-dot"></span></button>
      <button class="sc-btn sc-sync" title="Update this block to the latest version (keeps your text)" onclick="rebuildSec(this)"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;"><path d="M13.5 7a5.5 5.5 0 1 0-1.6 3.9"/><path d="M13.5 3.5V7H10"/></svg></button>
      <button class="sc-btn sc-flip" title="Flip horizontally: mirror the left/right layout of this block" onclick="flipSec(this)"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;"><line x1="8" y1="2" x2="8" y2="14"/><path d="M6 5 2.5 8 6 11z"/><path d="M10 5l3.5 3-3.5 3z"/></svg></button>
      <button class="sc-btn drag" title="Drag to move">⠿</button>
      <button class="sc-btn" title="Up" onclick="moveSec(this,-1)">↑</button>
      <button class="sc-btn" title="Down" onclick="moveSec(this,1)">↓</button>
      <button class="sc-btn" title="Duplicate" onclick="dupSec(this)">⧉</button>
      <button class="sc-btn" title="Delete" onclick="delSec(this)">×</button>
    </div>`;
}
function wireSec(sec){
  // Purge legacy per-block flip buttons from newsletters saved before the flip
  // control moved into the section toolbar (v22.9). Harmless if none present.
  sec.querySelectorAll('.nl-flip').forEach(e=>e.remove());
  const handle=sec.querySelector('.sc-btn.drag');
  if(handle){
    handle.addEventListener('mousedown',()=>sec.setAttribute('draggable','true'));
    sec.addEventListener('dragstart',e=>{if(liDragSrc){return;}dragSrc=sec;sec.style.opacity='.4';});
    sec.addEventListener('dragend',()=>{sec.style.opacity='';sec.setAttribute('draggable','false');clearDrop();});
    sec.addEventListener('dragover',e=>{e.preventDefault();const r=sec.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;clearDrop();sec.classList.add(after?'dragover-bot':'dragover-top');});
    sec.addEventListener('dragleave',()=>clearDrop());
    sec.addEventListener('drop',e=>{e.preventDefault();if(!dragSrc||dragSrc===sec)return;const r=sec.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;clearDrop();if(after)sec.after(dragSrc);else sec.before(dragSrc);refreshState();});
  }
  // restore any saved media/embed in this section
  hydrateMedia(sec);
  // Re-assert contenteditable on every editable. Some browsers don't fully
  // activate editing on elements injected via innerHTML (especially inside
  // table cells), which left Intro Box / Letter Body text uneditable after a
  // reload. Setting the IDL property forces the editing host to initialise.
  sec.querySelectorAll('[contenteditable]').forEach(el=>{
    const v=(el.getAttribute('contenteditable')||'').toLowerCase();
    el.contentEditable = (v==='false') ? 'false' : 'true';
  });
  wireParagraphKeys(sec);
  injectFillBar(sec);
}

/* ═══════════ CONTENT-LIBRARY FILL BAR ═══════════
   A small in-editor toolbar added to the content sections that can pull from the
   Content Library. "Generate" reserves + drops in an item; "Next" swaps it. Tip
   Tuesday additionally gets per-field cycle buttons so you can reroll just the
   hydration/protein/sleep/mobility line without changing the rest. The bar is
   builder-only chrome (class fill-bar) and is stripped on export. */
const SEC_FILL={
  nltip   :{type:'tips',   label:'Tip'},
  nlheader:{type:'quotes', label:'Quote'},
  nlrecipe:{type:'recipes',label:'Recipe'}
};
function injectFillBar(sec){
  const key=sec.dataset.key;
  const cfg=SEC_FILL[key];
  if(!cfg)return;
  if(sec.querySelector(':scope > .fill-bar'))return;   // once
  const bar=document.createElement('div');
  bar.className='fill-bar';
  bar.setAttribute('contenteditable','false');
  let html=`<span class="fb-label">📚 ${cfg.label}</span>
    <button class="fb-btn primary" type="button" onclick="libGenerate('${cfg.type}')">🎲 Generate</button>
    <button class="fb-btn" type="button" onclick="libNext('${cfg.type}')">🔄 Next</button>`;
  // Recipes are chosen deliberately, not at random — the Generate button opens a
  // picker of every recipe in the library instead of pulling one blindly.
  if(cfg.type==='recipes'){
    html=`<span class="fb-label">📚 ${cfg.label}</span>
      <button class="fb-btn primary" type="button" onclick="openLibPicker('recipes')">📖 Choose recipe…</button>`;
  }
  if(key==='nltip'){
    html+=`<span class="fb-sep"></span><span class="fb-mini-label">reroll one:</span>`+
      ['hydration','protein','sleep','mobility'].map(f=>`<button class="fb-btn mini" type="button" onclick="libNextTipField('${f}')">${f}</button>`).join('');
  }
  bar.innerHTML=html;
  sec.insertBefore(bar,sec.firstChild);
}

/* ═══════════ PARAGRAPH ENTER BEHAVIOR ═══════════
   Inside multi-line paragraph fields (the "Note from Tim" intro, and any other
   paragraph list), a single Enter should continue the SAME line style (a plain
   <br>, not a browser-default <div> that resets font/size/color). Pressing Enter
   on an already-empty line spawns a fresh paragraph block via the list's own
   +Add, so two Enters = new paragraph. This keeps every line identical to the
   first and removes the need to add paragraph blocks by hand. */
function wireParagraphKeys(sec){
  sec.querySelectorAll('.li-list').forEach(list=>{
    const proto=list.getAttribute('data-proto')||'';
    if(!/<p\b/i.test(proto))return;                 // only paragraph-style lists
    if(list.dataset.pkeys==='1')return;             // wire once
    list.dataset.pkeys='1';
    list.addEventListener('keydown',e=>{
      if(e.key!=='Enter'||e.shiftKey)return;
      const p=e.target.closest('p[contenteditable]');
      if(!p||!list.contains(p))return;
      e.preventDefault();
      const txt=p.textContent.replace(/\u200b/g,'');
      const caretAtEmptyLine=isCaretOnEmptyTrailingLine(p);
      if(caretAtEmptyLine){
        // second Enter on a blank line → strip that trailing break, make a new paragraph
        stripTrailingBreak(p);
        const addBtn=list.nextElementSibling;
        if(addBtn&&addBtn.classList.contains('li-add')){addLi(addBtn);}
        return;
      }
      // single Enter → same-style line break
      insertBreakAtCaret();
    });
  });
}
/* true when the caret sits on a final, empty visual line (i.e. the char before it is a <br>) */
function isCaretOnEmptyTrailingLine(p){
  const sel=window.getSelection();if(!sel||!sel.rangeCount)return false;
  const r=sel.getRangeAt(0);
  if(!r.collapsed)return false;
  // caret must be at the very end of the paragraph's content
  const end=document.createRange();end.selectNodeContents(p);end.setStart(r.endContainer,r.endOffset);
  if(end.toString().replace(/\u200b/g,'').length!==0)return false;
  // and the paragraph must already end in a <br> (a line we just made)
  const html=p.innerHTML.replace(/\u200b/g,'');
  return /<br\s*\/?>\s*$/i.test(html);
}
function stripTrailingBreak(p){
  p.innerHTML=p.innerHTML.replace(/(<br\s*\/?>\s*)+$/i,'');
  markEmpty(p);
}
function insertBreakAtCaret(){
  const sel=window.getSelection();if(!sel||!sel.rangeCount)return;
  const r=sel.getRangeAt(0);r.deleteContents();
  const br=document.createElement('br');
  r.insertNode(br);
  // a trailing zero-width space keeps the caret visible on the new empty line
  const zwsp=document.createTextNode('\u200b');
  br.after(zwsp);
  r.setStartAfter(zwsp);r.setEndAfter(zwsp);
  sel.removeAllRanges();sel.addRange(r);
}
/* ═══════════ GLOBAL CLEAN-PARAGRAPH GUARD ═══════════
   Every contenteditable in the canvas (headings, standalone ph() blocks, note
   boxes — anything NOT already handled by wireParagraphKeys' li-list logic)
   used to let the browser run its default "insertParagraph" on Enter, which
   wraps the new line in a <div> (and nests <div> in <div> on each further
   Enter). That stray block carries none of the field's inline style, so the
   font/size/color silently changes. We intercept insertParagraph at the
   beforeinput stage and insert a plain <br> on the SAME line instead, so every
   line keeps the field's own styling. li-list paragraph fields cancel their
   Enter at keydown (which also cancels this beforeinput), so their two-Enters-
   makes-a-new-paragraph behavior is untouched. Runs once, capturing on the
   canvas so it covers sections added later too. */
function wireCleanParagraphGuard(){
  if(frame.dataset.cpguard==='1')return;
  frame.dataset.cpguard='1';
  frame.addEventListener('beforeinput',e=>{
    if(e.inputType!=='insertParagraph')return;
    const host=e.target&&e.target.closest&&e.target.closest('[contenteditable="true"]');
    if(!host||!frame.contains(host))return;
    // never override an explicitly multi-block editor if one is ever added
    if(host.dataset.allowBlocks==='1')return;
    e.preventDefault();
    insertBreakAtCaret();
  });
}
function clearDrop(){frame.querySelectorAll('.sec').forEach(s=>s.classList.remove('dragover-top','dragover-bot'));}
function addSection(key,before){
  const S=allSections();
  if(!S[key]){toast('Unknown section');return null;}
  const sec=document.createElement('div');sec.className='sec';sec.dataset.key=key;
  sec.innerHTML=S[key].html()+controlsHTML();
  const tag=sec.querySelector('.sec-tag');if(tag)tag.textContent=S[key].name;
  if(before&&before.parentElement===frame)frame.insertBefore(sec,before);
  else frame.appendChild(sec);
  applySecTheme(sec,S[key].theme||'white');
  wireSec(sec);refreshState();
  if(!before)sec.scrollIntoView({behavior:'smooth',block:'center'});
  return sec;
}

/* ═══════════ WIDGETS ═══════════
   Small drop-in blocks the operator can add to any layout. Each is a standalone
   .sec so it exports, themes, and reorders like everything else. The flagship
   widget is a brand-orange, fully linkable button (same primitive as the CTA
   sections' button — editable label + href via the link modal). */
const WIDGETS={
  button:{icon:'▶',name:'Button',desc:'Orange, linkable call-to-action button.',
    html:()=>`<div style="background:var(--secbg);padding:28px 48px;text-align:center;border-bottom:1px solid #eee;">
      ${btn('» Button Label',"display:inline-block;background:var(--accent);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:4px;",'https://lngvtyhub.com/')}
    </div>`}
};
function renderWidgets(){
  const host=document.getElementById('wgList');if(!host)return;
  host.innerHTML='';
  Object.entries(WIDGETS).forEach(([key,w])=>{
    const b=document.createElement('button');
    b.type='button';b.className='wg-item';b.onclick=()=>insertWidget(key);
    b.innerHTML=`<span class="wg-ic">${w.icon}</span><span class="wg-tx"><span class="wg-nm">${w.name}</span><span class="wg-ds">${w.desc}</span></span>`;
    host.appendChild(b);
  });
}
/* append a widget to the canvas as its own themed, exportable section */
function insertWidget(key){
  const w=WIDGETS[key];if(!w)return;
  const sec=document.createElement('div');sec.className='sec';sec.dataset.key='widget-'+key;
  sec.innerHTML=w.html()+controlsHTML();
  const tag=sec.querySelector('.sec-tag');if(tag)tag.textContent=w.name+' (widget)';
  frame.appendChild(sec);
  applySecTheme(sec,'white');
  wireSec(sec);refreshState();saveStateLocal();
  sec.scrollIntoView({behavior:'smooth',block:'center'});
  toast('\u2713 '+w.name+' added — set its label and link');
}

/* ═══════════ NEWSLETTER STARTER ═══════════
   Drops in the standard weekly-newsletter skeleton in reading order. The starter
   first asks for the send date, then snaps to that week's Sunday and auto-fills
   the header date, the seven schedule day-dates, and next week's Mark-Your-Calendar
   dates — so the only things left to fill are the quote and the week's content. */
const NEWSLETTER_TEMPLATE=['nlheader','introbox','nlschedule','nlquicktip','nltip','nlproductgrid','nlrecipe','nlevents','footer'];

/* Entry point from the "Start a newsletter" button — asks for the date first. */
function buildNewsletterTemplate(){
  const existing=frame.querySelectorAll('.sec').length;
  if(existing && !confirm('Replace the '+existing+' section(s) on the canvas with a fresh newsletter?'))return;
  openNlDate();
}
function openNlDate(){
  clearPullCalendar();
  const inp=document.getElementById('nlDateInput');
  if(inp && !inp.value){
    // default to the upcoming Sunday
    const t=new Date();const d=new Date(t.getFullYear(),t.getMonth(),t.getDate());
    d.setDate(d.getDate()+((7-d.getDay())%7));
    inp.value=isoDate(d);
  }
  document.getElementById('nlDateBg').classList.add('show');
  setTimeout(()=>inp&&inp.focus(),50);
}
function closeNlDate(){document.getElementById('nlDateBg').classList.remove('show');}
function confirmNlDate(){
  const v=document.getElementById('nlDateInput').value;
  closeNlDate();
  buildNewsletterSkeleton(v||null);
}
function startNewsletterNoDate(){closeNlDate();buildNewsletterSkeleton(null);}

/* ═══════════ REUSE CALENDAR FROM A PAST NEWSLETTER ═══════════
   Lets the operator bring the Weekly Schedule + Upcoming Events sections over
   from a previously-saved newsletter so they don't rewrite every event each
   week. The event names/times carry over; applyNewsletterDates() re-stamps the
   dates for the newly chosen week. Stored as raw serialized sections. */
let pulledCalendar=null;   // {schedule:{...section}, events:{...section}, name:''}
let nlPullItems=[];        // cached list metadata
let nlPullTag='All';

function clearPullCalendar(){
  pulledCalendar=null;
  const chosen=document.getElementById('nlPullChosen');if(chosen)chosen.textContent='';
  const clr=document.getElementById('nlPullClear');if(clr)clr.style.display='none';
  const pick=document.getElementById('nlPullPicker');if(pick)pick.style.display='none';
}

async function openPullCalendar(){
  const picker=document.getElementById('nlPullPicker');
  const status=document.getElementById('nlPullStatus');
  if(!ghReady()){toast('Connect a GitHub repo first (\u2699 GitHub).');openGithubSettings();return;}
  picker.style.display='block';
  document.getElementById('nlPullList').innerHTML='<div style="color:#aaa;font-size:12px;padding:8px;">Loading saved newsletters\u2026</div>';
  try{
    const files=await ghList();
    const items=[];
    for(const f of files){
      try{
        const nl=await ghLoadFile(f);
        const hasCal=(nl.sections||[]).some(s=>s.key==='nlschedule'||s.key==='nlevents');
        if(hasCal)items.push({id:nl.id||f.name.replace(/\.json$/i,''),name:nl.name||f.name.replace(/\.json$/i,''),tag:nl.tag||'',updated:nl.updatedAt||'',file:f});
      }catch(e){}
    }
    nlPullItems=items;
    renderPullFilters();renderPullList();
    if(!items.length)document.getElementById('nlPullList').innerHTML='<div style="color:#aaa;font-size:12px;padding:8px;">No saved newsletters have a schedule or events section yet.</div>';
  }catch(e){
    document.getElementById('nlPullList').innerHTML='<div style="color:#c0392b;font-size:12px;padding:8px;">Couldn\u2019t reach GitHub: '+esc(e.message||String(e))+'</div>';
  }
}

function renderPullFilters(){
  const bar=document.getElementById('nlPullFilterBar');if(!bar)return;bar.innerHTML='';
  const present=new Set();nlPullItems.forEach(it=>{const t=(it.tag||'').trim();if(t)present.add(t);});
  const tags=['All',...present];
  tags.forEach(t=>{
    const count=(t==='All')?nlPullItems.length:nlPullItems.filter(it=>(it.tag||'').toLowerCase()===t.toLowerCase()).length;
    const chip=document.createElement('button');
    chip.className='saved-chip'+(nlPullTag.toLowerCase()===t.toLowerCase()?' active':'');
    chip.style.cssText='font-size:10px;padding:3px 9px;';
    chip.textContent=t+(t!=='All'?` (${count})`:'');
    chip.onclick=()=>{nlPullTag=t;renderPullFilters();renderPullList();};
    bar.appendChild(chip);
  });
}

function renderPullList(){
  const list=document.getElementById('nlPullList');if(!list)return;list.innerHTML='';
  let view=nlPullItems;
  if(nlPullTag&&nlPullTag!=='All')view=view.filter(it=>(it.tag||'').toLowerCase()===nlPullTag.toLowerCase());
  if(!view.length){list.innerHTML='<div style="color:#aaa;font-size:12px;padding:8px;">Nothing tagged \u201c'+esc(nlPullTag)+'\u201d.</div>';return;}
  // newest first when we have timestamps
  view=[...view].sort((a,b)=>String(b.updated).localeCompare(String(a.updated)));
  view.forEach(it=>{
    const row=document.createElement('button');
    row.type='button';
    row.style.cssText='text-align:left;border:1px solid #e3e3e6;border-radius:7px;background:#fff;padding:8px 10px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;';
    const when=it.updated?new Date(it.updated):null;
    const whenStr=when&&!isNaN(when)?when.toLocaleDateString([], {month:'short',day:'numeric'}):'';
    row.innerHTML=`<span style="min-width:0;"><span style="font-family:'Montserrat';font-size:12px;font-weight:700;color:#222;">${esc(it.name||'Untitled')}</span>
      ${it.tag?`<span style="font-family:'Montserrat';font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;background:#e05a1b;padding:1px 6px;border-radius:4px;margin-left:6px;">${esc(it.tag)}</span>`:''}</span>
      <span style="font-size:10px;color:#aaa;white-space:nowrap;">${esc(whenStr)} \u203a</span>`;
    row.onclick=()=>choosePullCalendar(it,row);
    list.appendChild(row);
  });
}

async function choosePullCalendar(it,rowEl){
  const list=document.getElementById('nlPullList');
  if(rowEl)rowEl.style.opacity='.5';
  try{
    const nl=await ghLoadFile(it.file||{path:`${ghDir()}/${(it.id||slugify(it.name))}.json`});
    const secs=nl.sections||[];
    const schedule=secs.find(s=>s.key==='nlschedule')||null;
    const events=secs.find(s=>s.key==='nlevents')||null;
    if(!schedule&&!events){toast('That newsletter has no calendar sections.');if(rowEl)rowEl.style.opacity='';return;}
    pulledCalendar={schedule,events,name:nl.name||it.name||''};
    const chosen=document.getElementById('nlPullChosen');
    if(chosen)chosen.textContent='Using calendar from \u201c'+(pulledCalendar.name||'newsletter')+'\u201d';
    document.getElementById('nlPullClear').style.display='';
    document.getElementById('nlPullPicker').style.display='none';
  }catch(e){
    toast('Couldn\u2019t load that newsletter: '+(e.message||e));
    if(rowEl)rowEl.style.opacity='';
  }
}

/* ISO yyyy-mm-dd for a local Date (no timezone drift) */
function isoDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
/* parse a yyyy-mm-dd string as a LOCAL date (avoids the UTC-midnight off-by-one) */
function parseLocalDate(s){if(!s)return null;const [y,m,d]=s.split('-').map(Number);if(!y||!m||!d)return null;return new Date(y,m-1,d);}
const NL_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const NL_MON3=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const NL_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
/* the Sunday that begins the week containing d */
function weekSunday(d){const s=new Date(d.getFullYear(),d.getMonth(),d.getDate());s.setDate(s.getDate()-s.getDay());return s;}

function buildNewsletterSkeleton(dateStr){
  frame.querySelectorAll('.sec').forEach(s=>s.remove());
  NEWSLETTER_TEMPLATE.forEach(k=>{
    const sec=addSection(k);
    // the Intro Box becomes the "note from Tim" opener
    if(sec && k==='introbox'){
      const eds=sec.querySelectorAll('[data-ph]');
      if(eds[0])eds[0].setAttribute('data-ph','Welcome');
      if(eds[1])eds[1].setAttribute('data-ph','A Note From Tim,');
    }
  });
  prefillNewsletterStatics();
  // if the operator chose to reuse a past newsletter's calendar, swap the blank
  // schedule/events sections for the saved ones (event copy AND their dates carry
  // over untouched — only the header date changes to the new send date)
  const reused=!!pulledCalendar;
  if(pulledCalendar){
    applyPulledCalendar();
  }
  const picked=parseLocalDate(dateStr);
  if(picked)applyNewsletterDates(picked,reused);
  saveStateLocal();
  frame.scrollIntoView({behavior:'smooth',block:'start'});
  const pulledMsg=reused?' (calendar reused — dates kept)':'';
  toast(picked?'\u2713 Newsletter started — header dated'+(reused?'':' and week filled')+pulledMsg:'\u2713 Newsletter started — add your quote and content'+pulledMsg);
  pulledCalendar=null; // consume it so the next start is clean
}

/* Replace the freshly-added blank nlschedule / nlevents with the pulled saved
   versions, in place, preserving their position in the skeleton. */
function applyPulledCalendar(){
  const swap=(key,saved)=>{
    if(!saved)return;
    const cur=frame.querySelector('.sec[data-key="'+key+'"]');
    if(!cur)return;
    const sec=document.createElement('div');sec.className='sec';sec.dataset.key=key;
    sec.innerHTML=saved.html+controlsHTML();
    const tag=sec.querySelector('.sec-tag');
    if(tag){const S=allSections();tag.textContent=S[key]?.name||'';}
    applySecTheme(sec,saved.theme||cur.dataset.theme||'white');
    if(saved.accent){sec.style.setProperty('--accent',saved.accent);sec.dataset.accent=saved.accent;}
    cur.replaceWith(sec);
    wireSec(sec);
  };
  swap('nlschedule',pulledCalendar.schedule);
  swap('nlevents',pulledCalendar.events);
  refreshState();
}

/* Pre-fill the fields that are the SAME on every newsletter (brand identity and
   section labels) as real text, so the operator isn't retyping "LNGVTY Hub" or
   "Upcoming Schedule" each week. Fields that change weekly — the quote, event
   names/times, tips, recipe, member content — are LEFT as ghost text so it's
   always clear what belongs there. Matching is by the placeholder text, so this
   is resilient to section reordering.

   Each entry: [placeholder-to-match] -> real value to type in. */
const NL_STATIC_PREFILL={
  // header (constant brand identity — never changes week to week)
  'LNGVTY Hub — Weekly Member Newsletter':'LNGVTY Hub — Weekly Newsletter',
  'LNGVTY':'LNGVTY',
  'Longevity Hub':'Longevity Hub',
  'Weekly Newsletter':'Weekly Newsletter',
  // intro
  'Welcome':'Welcome',
  'A Note From Tim,':'A Note From Tim,',
  // schedule
  'Every Week at LNGVTY':'This Week at LNGVTY',
  'Upcoming Schedule':'Upcoming Schedule',
  'Same time, every week — no excuses.':'Everything happening this week!',
  'Recurring Weekly Events':"What's Happening",
  // tip tuesday
  'Tip Tuesday':'Tip Tuesday',
  // tip tuesday — the four mini-card icons + labels are constant, so fill them
  '💧':'💧','🥩':'🥩','😴':'😴','🧘':'🧘',
  'Hydration':'Hydration','Protein':'Protein','Sleep':'Sleep','Mobility':'Mobility',
  // recipe
  'Recipe Corner':'Recipe Corner',
  "This Week's Featured Recipe":"This Week's Featured Recipe",
  // events
  'Special Events':'Upcoming Events',
  'Mark Your Calendar':'Mark Your Calendar',
  // quick tip — the kicker is constant, fill it as real text
  'QUICK TIP':'QUICK TIP',
  // featured products (grid) — section labels are constant
  'FEATURED PRODUCTS':'FEATURED PRODUCTS',
  'Member picks this month':'Member picks of the month',
};
function prefillNewsletterStatics(){
  frame.querySelectorAll('.sec [contenteditable][data-ph]').forEach(el=>{
    const ph=el.getAttribute('data-ph')||'';
    if(Object.prototype.hasOwnProperty.call(NL_STATIC_PREFILL,ph) && el.textContent.trim()===''){
      el.textContent=NL_STATIC_PREFILL[ph];
      markEmpty(el);
    }
  });
}

/* Fill every date-driven field from the chosen send date:
   • header date  → "Month D, YYYY" (the picked date)
   • schedule     → this week's Sun–Sat dates under each day label
   • events       → NEXT week's Sun–Sat date boxes (Mark Your Calendar) */
function applyNewsletterDates(picked,headerOnly){
  const sun=weekSunday(picked);
  // header date
  const header=frame.querySelector('.sec[data-key="nlheader"]');
  if(header){
    const eds=[...header.querySelectorAll('[contenteditable][data-ph]')];
    // the date field is the accent one that defaults to a "Month D, YYYY" placeholder
    const dateEd=eds.find(e=>/\b\d{4}\b/.test(e.getAttribute('data-ph')||'')) || eds[3];
    if(dateEd){dateEd.textContent=NL_MONTHS[picked.getMonth()]+' '+picked.getDate()+', '+picked.getFullYear();markEmpty(dateEd);}
  }
  // when a calendar was pulled from a past newsletter, keep that calendar's own
  // dates untouched — only the header date reflects the new send date.
  if(headerOnly)return;
  // schedule: fill the small date line under each day (rows are Sun..Sat in order)
  const sched=frame.querySelector('.sec[data-key="nlschedule"]');
  if(sched){
    const rows=[...sched.querySelectorAll('.li-list > .li-wrap')];
    rows.forEach((row,i)=>{
      const cells=row.querySelectorAll('[contenteditable][data-ph]');
      // cell 0 = day label, cell 1 = date line
      const day=new Date(sun);day.setDate(sun.getDate()+i);
      if(cells[0]){cells[0].textContent=NL_DAYS[day.getDay()];markEmpty(cells[0]);}
      if(cells[1]){cells[1].textContent=NL_MON3[day.getMonth()]+' '+day.getDate();markEmpty(cells[1]);}
    });
  }
  // events: prefill NEXT week's seven day-boxes (month / day# / weekday)
  const events=frame.querySelector('.sec[data-key="nlevents"]');
  if(events){
    const nextSun=new Date(sun);nextSun.setDate(sun.getDate()+7);
    const rows=[...events.querySelectorAll('.li-list > .li-wrap')];
    rows.forEach((row,i)=>{
      const box=row.querySelectorAll('td [contenteditable][data-ph]');
      const day=new Date(nextSun);day.setDate(nextSun.getDate()+i);
      // box 0 = month, 1 = day number, 2 = weekday
      if(box[0]){box[0].textContent=NL_MON3[day.getMonth()];markEmpty(box[0]);}
      if(box[1]){box[1].textContent=String(day.getDate());markEmpty(box[1]);}
      if(box[2]){box[2].textContent=NL_DAYS[day.getDay()];markEmpty(box[2]);}
    });
  }
}


/* ═══════════ EKG BACKDROP ═══════════
   A faint orange heartbeat trace behind the canvas. Purely ambient: it sits in a
   canvas element that is never part of the document, so export/preview never see it. */
function startEKG(){
  const cv=document.getElementById('ekg');
  const stage=document.getElementById('canvasStage');
  const scroller=document.getElementById('canvasScroll')||stage;
  if(!cv||!stage||!cv.getContext)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=cv.getContext('2d');
  if(!ctx)return;                      // no canvas support — the backdrop is optional
  let w=0,h=0;
  const dpr=Math.min(window.devicePixelRatio||1,2);

  /* Size the canvas to the VISIBLE scroll band, not the full document. The canvas
     is absolutely positioned inside the stage; we move it with scrollTop so it
     always covers exactly what's on screen. This keeps the drawing surface (and
     therefore the per-frame rasterisation cost) constant no matter how long the
     newsletter gets — the previous full-height sizing is what caused the sharp
     lag past a certain amount of text. */
  function size(){
    const nw=stage.clientWidth;
    const nh=Math.min(scroller.clientHeight||stage.clientHeight, 1400); // viewport band, hard cap
    if(nw===w && nh===h)return;
    w=nw;h=nh;
    cv.width=Math.max(1,w*dpr);cv.height=Math.max(1,h*dpr);
    cv.style.width=w+'px';cv.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  /* keep the canvas parked over the visible area as the user scrolls */
  function park(){cv.style.top=(scroller.scrollTop||0)+'px';}
  cv.style.position='absolute';cv.style.left='0';park();
  size();
  window.addEventListener('resize',size);
  scroller.addEventListener('scroll',park,{passive:true});
  // the canvas re-measures itself whenever the viewport (not the document) changes.
  if(window.ResizeObserver){
    let roScheduled=false;
    const ro=new ResizeObserver(()=>{
      if(roScheduled)return;roScheduled=true;
      requestAnimationFrame(()=>{roScheduled=false;size();park();});
    });
    ro.observe(scroller);
  }

  // one heartbeat: baseline, small p-wave, the tall QRS spike, then a t-wave
  function beat(x){
    if(x<0||x>1)return 0;
    if(x<0.14)return 0;
    if(x<0.22)return Math.sin((x-0.14)/0.08*Math.PI)*0.12;   // p
    if(x<0.30)return 0;
    if(x<0.34)return -((x-0.30)/0.04)*0.18;                  // q
    if(x<0.40)return -0.18+((x-0.34)/0.06)*1.18;             // r (spike)
    if(x<0.45)return 1.0-((x-0.40)/0.05)*1.35;               // s
    if(x<0.52)return -0.35+((x-0.45)/0.07)*0.35;             // back to baseline
    if(x<0.72)return Math.sin((x-0.52)/0.20*Math.PI)*0.22;   // t
    return 0;
  }

  /* Layered traces at different depths. Slower speeds and staggered cycle lengths
     mean the lines drift across each other rather than marching in lockstep, which
     reads as depth — some passing in front, some behind. */
  /* A SEA of traces. Rather than a handful of hand-placed lines, generate a dense
     field and sort it by depth: far lines are slow, thin, faint and low-amplitude;
     near lines are faster, thicker, brighter and taller. Drawing far-to-near means
     the near ones genuinely pass in front, which is what sells the parallax. */
  const PALETTE=[
    {name:'gray',  hue:'150,152,160'},
    {name:'orange',hue:'224,90,27'},
    {name:'white', hue:'255,255,255'},
  ];
  const LAYERS=(()=>{
    const out=[];
    const N=18;
    for(let i=0;i<N;i++){
      const depth=i/(N-1);                       // 0 = far, 1 = near
      // orange dominates the mid/near field; gray and white fill the depths
      const pick = (i%3===1) ? PALETTE[1] : (i%3===0 ? PALETTE[0] : PALETTE[2]);
      const near = depth;
      out.push({
        hue   : pick.hue,
        name  : pick.name,
        y     : 0.04 + (i*0.055) + (i%2?0.012:-0.012),      // spread down the page, slightly jittered
        speed : 14 + near*40,                                // px/sec — noticeable but ambient
        amp   : 16 + near*62,
        width : 0.7 + near*1.6,
        cycle : 640 - near*230,                              // near beats are tighter
        phase : (i*0.37)%1,
        alpha : (pick.name==='orange' ? 0.05+near*0.24
               : pick.name==='gray'   ? 0.04+near*0.11
               :                        0.025+near*0.07),
      });
    }
    return out.sort((a,b)=>a.amp-b.amp);          // far (small) first, near (tall) last
  })();

  let last=performance.now(), t=0;
  function draw(now){
    const dt=Math.min((now-last)/1000,0.05);   // seconds, clamped on tab-refocus
    last=now;
    t+=dt;
    size();
    ctx.clearRect(0,0,w,h);
    LAYERS.forEach(L=>{
      const baseY=h*((L.y%1)+ (L.y<0?1:0));
      const grad=ctx.createLinearGradient(0,0,w,0);
      grad.addColorStop(0,   'rgba('+L.hue+',0)');
      grad.addColorStop(0.14,'rgba('+L.hue+','+L.alpha+')');
      grad.addColorStop(0.86,'rgba('+L.hue+','+L.alpha+')');
      grad.addColorStop(1,   'rgba('+L.hue+',0)');
      ctx.strokeStyle=grad;
      ctx.lineWidth=L.width;
      ctx.lineJoin='round';ctx.lineCap='round';
      ctx.beginPath();
      const shift=t*L.speed + L.phase*L.cycle;   // px/sec — slow and ambient
      for(let px=0;px<=w;px+=2){
        const phase=(((px+shift)%L.cycle)+L.cycle)%L.cycle/L.cycle;
        const y=baseY-beat(phase)*L.amp;
        px===0?ctx.moveTo(px,y):ctx.lineTo(px,y);
      }
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
/* start it only once everything else has loaded */
if(document.readyState==='complete')setTimeout(startEKG,0);
else window.addEventListener('load',startEKG);

/* ═══════════ DRAG A SECTION FROM THE RAIL ═══════════
   Click = append to the bottom (unchanged). Click-and-hold = pick the block up and
   drop it between existing sections, with a live indicator showing where it lands. */
let dragState=null;
function armPaletteDrag(el,key){
  el.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.preventDefault();                 // never begin a text selection from the rail
    const start={x:e.clientX,y:e.clientY};
    let held=false;
    const holdTimer=setTimeout(()=>{held=true;beginDrag(key,el,start);},170);
    const up=()=>{clearTimeout(holdTimer);cleanup();if(!held)addSection(key);};
    const move=(ev)=>{
      // a decisive move before the hold fires also starts the drag
      if(!held && Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>7){
        clearTimeout(holdTimer);held=true;beginDrag(key,el,{x:ev.clientX,y:ev.clientY});
      }
    };
    const cleanup=()=>{
      el.removeEventListener('pointerup',up);
      el.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
    };
    el.addEventListener('pointerup',up,{once:true});
    el.addEventListener('pointermove',move);
    window.addEventListener('pointerup',()=>{clearTimeout(holdTimer);cleanup();},{once:true});
  });
}

function beginDrag(key,el,pt){
  const S=allSections();
  el.classList.add('dragging');
  document.body.classList.add('dragging-section');
  // a selection may already have started on pointerdown — drop it
  try{const sel=window.getSelection();if(sel)sel.removeAllRanges();}catch(e){}
  const ghost=document.createElement('div');
  ghost.className='drag-ghost';
  ghost.textContent=(S[key]&&S[key].name)||key;
  ghost.style.left=pt.x+'px';ghost.style.top=pt.y+'px';
  document.body.appendChild(ghost);

  const line=document.createElement('div');
  line.className='drop-line';

  dragState={key,el,ghost,line,before:null};

  const onMove=(e)=>{
    e.preventDefault();                 // stops the browser from starting a text selection
    ghost.style.left=e.clientX+'px';
    ghost.style.top=e.clientY+'px';
    positionDropLine(e.clientX,e.clientY);
  };
  const onUp=()=>{
    document.removeEventListener('pointermove',onMove);
    document.removeEventListener('pointerup',onUp);
    finishDrag();
  };
  document.addEventListener('pointermove',onMove);
  document.addEventListener('pointerup',onUp);
  positionDropLine(pt.x,pt.y);
}

/* work out which gap the cursor is nearest and park the indicator there */
function positionDropLine(x,y){
  if(!dragState)return;
  const frameRect=frame.getBoundingClientRect();
  const pad=140;   // a generous target — you don't have to be pixel-perfect
  const inside = x>frameRect.left-pad && x<frameRect.right+pad &&
                 y>frameRect.top-pad  && y<frameRect.bottom+pad;
  if(!inside){ if(dragState.line.parentElement)dragState.line.remove(); dragState.before=null; return; }
  const secs=[...frame.querySelectorAll('.sec')];
  let before=null;
  for(const s of secs){
    const r=s.getBoundingClientRect();
    if(y < r.top + r.height/2){ before=s; break; }
  }
  dragState.before=before;
  if(before)frame.insertBefore(dragState.line,before);
  else frame.appendChild(dragState.line);
}

function finishDrag(){
  if(!dragState)return;
  const {key,el,ghost,line,before}=dragState;
  const dropped = line.parentElement===frame;
  ghost.remove();
  if(line.parentElement)line.remove();
  el.classList.remove('dragging');
  document.body.classList.remove('dragging-section');
  try{const sel=window.getSelection();if(sel)sel.removeAllRanges();}catch(e){}
  dragState=null;
  if(dropped){
    const sec=addSection(key,before||null);
    if(sec){
      sec.classList.add('just-dropped');
      setTimeout(()=>sec.classList.remove('just-dropped'),400);
      sec.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    saveStateLocal();
  }
}
function moveSec(btn,dir){const sec=btn.closest('.sec');if(dir<0&&sec.previousElementSibling?.classList.contains('sec'))sec.previousElementSibling.before(sec);else if(dir>0&&sec.nextElementSibling)sec.nextElementSibling.after(sec);refreshState();}
function dupSec(btn){const sec=btn.closest('.sec');const clone=sec.cloneNode(true);wireSec(clone);sec.after(clone);refreshState();}
function delSec(btn){btn.closest('.sec').remove();refreshState();}

/* ═══════════ REBUILD / UPDATE A SECTION ═══════════
   Regenerate a section from the current registry code (picking up any bug fixes
   or new features) while preserving the operator's edited content — text, tags,
   photos/logos, sub-events, per-section color and shade. If the freshly-built
   markup already matches what's on the canvas, nothing changes and we say so.

   Migration strategy: capture every editable field's HTML in document order, plus
   the repeatable rows (schedule/event days, list items, tags, stats) and any
   photo/logo hosts. Build a fresh copy, then replay: grow/shrink each repeatable
   list to the saved count and pour the saved content back in, matched by position
   within each structural group. Fields that no longer exist are dropped; brand-new
   fields keep their fresh placeholder. */

// A stable fingerprint of a section's *structure* (ignoring user text) so we can
// tell whether the registry version differs from what's on the canvas.
function secStructSig(root){
  const clone=root.cloneNode(true);
  clone.querySelectorAll('.sec-controls,.sec-tag,.fill-bar').forEach(e=>e.remove());
  // strip user-entered text and volatile attributes, keep the skeleton
  clone.querySelectorAll('[contenteditable]').forEach(e=>{e.innerHTML='';});
  clone.querySelectorAll('img').forEach(e=>e.removeAttribute('src'));
  clone.querySelectorAll('[data-src]').forEach(e=>e.removeAttribute('data-src'));
  clone.querySelectorAll('[data-on]').forEach(e=>e.removeAttribute('data-on'));
  clone.querySelectorAll('[data-logo]').forEach(e=>e.removeAttribute('data-logo'));
  clone.querySelectorAll('.logo-slot,.hl-mark').forEach(e=>e.replaceWith(...e.childNodes));
  clone.querySelectorAll('[style]').forEach(e=>{
    // drop is-empty class artefacts + inline colors that come from user formatting
  });
  clone.querySelectorAll('.is-empty').forEach(e=>e.classList.remove('is-empty'));
  // strip volatile runtime attributes added after render (placeholder bookkeeping etc.)
  clone.querySelectorAll('[data-pkeys]').forEach(e=>e.removeAttribute('data-pkeys'));
  clone.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('spellcheck'));
  // drop now-empty class attributes so a live (class="") vs fresh (no class) pair matches
  clone.querySelectorAll('*').forEach(e=>{if(e.getAttribute('class')==='')e.removeAttribute('class');});
  return clone.innerHTML.replace(/\s+/g,' ').trim();
}

// Capture editable content from a section, grouped so it can be replayed onto a
// freshly-built copy of the same section type.
function captureSecContent(root){
  const REPEAT_SEL='.li-wrap,.sched-sub,.evt-sub,.tag-pill,.stat-cell,.li-list-inner tr';
  const inRepeat=(el)=>!!el.closest(REPEAT_SEL);
  // top-level editable fields (outside any repeatable row)
  const fields=[];
  root.querySelectorAll('[contenteditable]').forEach(e=>{
    if(inRepeat(e))return;
    fields.push({ph:e.getAttribute('data-ph')||'',html:e.innerHTML, empty:e.classList.contains('is-empty')});
  });
  // repeatable lists: for each list capture, per row, the editable fields (ph+html)
  // and any sub-events, so we can rebuild the same COUNT of rows using the FRESH
  // structure and pour only the text back in.
  const lists=[];
  root.querySelectorAll('.li-list').forEach(list=>{
    const rowEls=[...list.children];
    const rows=rowEls.map(row=>{
      // Capture every editable in the row as one flat, ordered pool (keyed by
      // data-ph). We also note how many sub-events the row had so the fresh row
      // can be grown to match before pouring text back in by data-ph.
      const flat=[...row.querySelectorAll('[contenteditable]')]
        .map(e=>({ph:e.getAttribute('data-ph')||'',html:e.innerHTML,empty:e.classList.contains('is-empty')}));
      const subCount=row.querySelectorAll('.sched-sub,.evt-sub').length;
      const tags=[...row.querySelectorAll('.tag-pill [contenteditable]')].map(t=>({html:t.innerHTML,empty:t.classList.contains('is-empty')}));
      return {flat,subCount,tags};
    });
    lists.push({rows});
  });
  // top-level tag wraps (outside lists)
  const tagWraps=[];
  root.querySelectorAll('.tag-wrap').forEach(w=>{
    if(w.closest('.li-list'))return;
    tagWraps.push([...w.querySelectorAll('.tag-pill [contenteditable]')].map(t=>t.innerHTML));
  });
  // photo / logo hosts
  const photos=[];
  root.querySelectorAll('.nl-ppic,.nl-rpic,.nl-pic').forEach(h=>{
    photos.push({on:h.dataset.on,src:h.dataset.src||'',logo:h.dataset.logo||'',
      logoHTML:(h.querySelector('.logo-slot')?h.querySelector('.logo-slot').innerHTML:''),
      imgsrc:(h.querySelector('img')?h.querySelector('img').getAttribute('src'):'')});
  });
  return {fields,lists,tagWraps,photos,
    theme:root.dataset.theme||'white',
    accent:(root.style.getPropertyValue('--accent')||'').trim()};
}

// pour a set of captured {ph,html,empty} fields into a set of target editables,
// matching by data-ph first then falling back to position; skips empties.
function pourFields(targets,pool){
  const rest=pool.slice();
  targets.forEach(t=>{
    const ph=t.getAttribute('data-ph')||'';
    let idx=rest.findIndex(f=>f.ph===ph);
    if(idx<0)idx=rest.length?0:-1;
    if(idx>=0){
      const f=rest.splice(idx,1)[0];
      if(f && !f.empty && f.html!=='') t.innerHTML=f.html;
    }
  });
}

// Replay captured content onto a freshly-built section of the same type.
function applySecContent(root,cap){
  // 1) repeatable lists — keep the FRESH row structure, match the saved row COUNT,
  //    and pour only the saved text into each row (so bug-fixed markup is retained).
  const newLists=root.querySelectorAll('.li-list');
  newLists.forEach((list,li)=>{
    const saved=cap.lists[li];if(!saved||!saved.rows.length)return;
    const templateRow=list.firstElementChild;
    if(!templateRow)return;
    const tHTML=templateRow.outerHTML;
    // grow/shrink the fresh list to the saved row count using the fresh template
    const want=saved.rows.length;
    while(list.children.length<want){const t=document.createElement('div');t.innerHTML=tHTML;list.appendChild(t.firstElementChild);}
    while(list.children.length>want){list.lastElementChild.remove();}
    // pour text into each fresh row
    [...list.children].forEach((row,ri)=>{
      const sr=saved.rows[ri];if(!sr)return;
      // grow the fresh row's sub-events to match the saved count first, so all
      // target fields exist before we pour
      if(sr.subCount>1){
        const addBtn=row.querySelector('.sched-addsub');
        const isEvt=!!row.querySelector('.evt-subs');
        const subHost=row.querySelector('.sched-subs,.evt-subs');
        const haveSubs=()=>subHost?subHost.querySelectorAll(':scope > .sched-sub, :scope > .evt-sub').length:0;
        let guard=0;
        while(subHost && haveSubs()<sr.subCount && guard++<20){
          if(isEvt && typeof addEvtSub==='function' && addBtn){addEvtSub(addBtn);}
          else if(typeof addSchedSub==='function' && addBtn){addSchedSub(addBtn);}
          else break;
        }
      }
      // grow row tags to match
      if(sr.tags && sr.tags.length){
        const w=row.querySelector('.tag-wrap');const addBtn=w&&w.querySelector('.tag-add');
        let guard=0;
        while(w && addBtn && w.querySelectorAll('.tag-pill').length<sr.tags.length && guard++<20){addTag(addBtn);}
        const pills=[...(w?w.querySelectorAll('.tag-pill [contenteditable]'):[])];
        sr.tags.forEach((tg,ti)=>{if(pills[ti]&&!tg.empty&&tg.html!=='')pills[ti].innerHTML=tg.html;});
      }
      // pour every editable in the fresh row from the saved flat pool, matched by
      // data-ph (falls back to order) — works even when a field moved from the
      // row level into a sub-event between versions.
      const rowTargets=[...row.querySelectorAll('[contenteditable]')].filter(e=>!e.closest('.tag-pill'));
      pourFields(rowTargets,sr.flat.filter(f=>true));
    });
  });
  // 2) top-level editable fields (outside lists)
  const REPEAT_SEL='.li-wrap,.sched-sub,.evt-sub,.tag-pill,.stat-cell,.li-list-inner tr';
  const targets=[...root.querySelectorAll('[contenteditable]')].filter(e=>!e.closest(REPEAT_SEL));
  pourFields(targets,cap.fields);
  // 3) top-level tags
  const newWraps=[...root.querySelectorAll('.tag-wrap')].filter(w=>!w.closest('.li-list'));
  newWraps.forEach((w,wi)=>{
    const saved=cap.tagWraps[wi];if(!saved)return;
    const addBtn=w.querySelector('.tag-add');
    while(w.querySelectorAll('.tag-pill').length<saved.length && addBtn){addTag(addBtn);}
    const now=[...w.querySelectorAll('.tag-pill [contenteditable]')];
    saved.forEach((html,i)=>{if(now[i])now[i].innerHTML=html;});
  });
  // 4) photos / logos
  const newHosts=root.querySelectorAll('.nl-ppic,.nl-rpic,.nl-pic');
  newHosts.forEach((h,hi)=>{
    const p=cap.photos[hi];if(!p)return;
    const img=h.querySelector('img');
    if(p.logo==='1' && p.logoHTML){ if(typeof setPhotoHost==='function')setPhotoHost(h,img,null,'',p.logoHTML); }
    else if(p.src||p.imgsrc){ if(typeof setPhotoHost==='function')setPhotoHost(h,img,p.src||p.imgsrc,'',null); }
  });
  // 5) theme + accent
  applySecTheme(root,cap.theme||'white');
  if(cap.accent){root.style.setProperty('--accent',cap.accent);root.dataset.accent=cap.accent;}
}

function rebuildSec(btn){
  const sec=btn.closest('.sec');if(!sec)return;
  const key=sec.dataset.key;
  const S=allSections();
  // widgets rebuild from the WIDGETS registry
  const isWidget=key&&key.startsWith('widget-');
  const def=isWidget?WIDGETS[key.slice(7)]:S[key];
  if(!def||typeof def.html!=='function'){toast('This block can\u2019t be auto-updated');return;}

  // build a fresh reference section (registry markup + controls) to compare
  const fresh=document.createElement('div');fresh.className='sec';fresh.dataset.key=key;
  fresh.innerHTML=def.html()+controlsHTML();

  // structural comparison — if identical, nothing to do
  if(secStructSig(sec)===secStructSig(fresh)){
    toast('\u2713 Block already up to date');
    return;
  }

  // capture the operator's content, then pour it into the fresh markup
  const cap=captureSecContent(sec);
  applySecContent(fresh,cap);

  // swap fresh in place of the old section, keep tag label + rewire
  const tag=fresh.querySelector('.sec-tag');
  if(tag)tag.textContent=isWidget?((WIDGETS[key.slice(7)]?.name||'Widget')+' (widget)'):(def.name||'');
  sec.replaceWith(fresh);
  wireSec(fresh);
  refreshState();refreshPlaceholders();saveStateLocal();
  toast('\u2713 Block updated to the latest version');
}
function clearAll(){if(!frame.querySelector('.sec'))return;if(confirm('Clear the entire email?')){frame.querySelectorAll('.sec').forEach(s=>s.remove());refreshState();try{saveStateLocal();}catch(e){}toast('Canvas cleared');}}

/* ═══════════ LIST add / remove ═══════════ */
function delLi(btn){
  const wrap=btn.closest('.li-wrap');const list=wrap.parentElement;
  if(list.querySelectorAll(':scope > .li-wrap').length<=1){toast('Keep at least one item');return;}
  wrap.remove();
  renumberSteps(list);
}
function addLi(btn){
  const list=btn.previousElementSibling;
  const proto=list.getAttribute('data-proto');if(!proto)return;
  const node=protoToNode(proto);
  if(!node){toast('Could not add that item');return;}
  list.appendChild(node);
  renumberSteps(list);
  refreshPlaceholders();node.querySelector('[contenteditable]')?.focus();
}
/* Turn a prototype HTML string into a single element.
   A plain <div> wrapper can't host table fragments: the parser hoists stray
   elements out of <table> and drops bare <tr>/<td>, which silently produced an
   empty add. Parsing inside a <template> preserves table context exactly, and we
   pick the .li-wrap explicitly rather than trusting firstElementChild. */
function protoToNode(proto){
  const t=document.createElement('template');
  t.innerHTML=String(proto).trim();
  const frag=t.content;
  return frag.querySelector('.li-wrap')
      || frag.querySelector('.tag-pill,.stat-cell')
      || frag.firstElementChild;
}
/* reorder a list item within its list */
function moveLi(btn,dir){
  const wrap=btn.closest('.li-wrap');if(!wrap)return;
  if(dir<0){const prev=wrap.previousElementSibling;if(prev&&prev.classList.contains('li-wrap'))prev.before(wrap);}
  else{const next=wrap.nextElementSibling;if(next&&next.classList.contains('li-wrap'))next.after(wrap);}
  renumberSteps(wrap.parentElement);
}
/* Auto-number any list of steps (recipe instructions). The number badges carry a
   .step-num class and are non-editable, so ordering is always 1..n with no manual
   fixing after add/delete/reorder. No-op for lists that have no .step-num badges. */
function renumberSteps(list){
  if(!list)return;
  const nums=list.querySelectorAll(':scope > .li-wrap > .step-num');
  if(!nums.length)return;
  nums.forEach((n,i)=>{n.textContent=String(i+1);});
}

/* ═══════════ DOC TRACK COLOR ═══════════
   Documentation "track" headers carry their own accent so a single document can
   run two or more color-coded threads (e.g. one color per challenge). Cycling
   recolors the header background and every accent element inside that track. */
const DOC_HUES=[
  {bg:'#2b5837',accent:'#3f7d4f',name:'Green'},
  {bg:'#4a1d40',accent:'#6b2d5c',name:'Plum'},
  {bg:'#1c3f5c',accent:'#2f6b96',name:'Blue'},
  {bg:'#5c3310',accent:'#a8622a',name:'Amber'},
  {bg:'#4a1f1f',accent:'#9c3a3a',name:'Rust'},
  {bg:'#1a1a1a',accent:'#e05a1b',name:'Brand'}
];
function cycleDocHue(btn){
  const track=btn.closest('.doc-track');if(!track)return;
  const cur=track.getAttribute('data-accent')||DOC_HUES[0].accent;
  let i=DOC_HUES.findIndex(h=>h.accent.toLowerCase()===cur.toLowerCase());
  const next=DOC_HUES[(i+1)%DOC_HUES.length];
  track.setAttribute('data-accent',next.accent);
  track.style.background=next.bg;
  toast(next.name);
  markDirty&&markDirty();
}
/* add an inline tag pill into a .tag-wrap (uses its data-proto) */
function addTag(btn){
  const wrap=btn.parentElement;const proto=wrap.getAttribute('data-proto');if(!proto)return;
  const node=protoToNode(proto);if(!node)return;
  wrap.insertBefore(node,btn);
  refreshPlaceholders();node.querySelector('[contenteditable]')?.focus();
}
/* remove an inline tag pill */
function delTag(btn){const pill=btn.closest('.tag-pill');if(pill)pill.remove();}
/* add a stat cell into a .stat-row (uses its data-proto) */
function addStat(btn){
  const row=btn.parentElement;const proto=row.getAttribute('data-proto');if(!proto)return;
  const node=protoToNode(proto);if(!node)return;
  row.insertBefore(node,btn);
  refreshPlaceholders();node.querySelector('[contenteditable]')?.focus();
}
/* remove a stat cell */
function delStat(btn){const cell=btn.closest('.stat-cell');const row=cell?.parentElement;if(!row)return;if(row.querySelectorAll(':scope > .stat-cell').length<=1){toast('Keep at least one stat');return;}cell.remove();}
/* schedule: add another event under the same day (connected bar, no gap) */
function addSchedSub(btn){
  const wrap=btn.closest('.li-wrap');const subs=wrap.querySelector('.sched-subs');if(!subs)return;
  const proto=`<div class="sched-sub" style="position:relative;padding:4px 0;"><div contenteditable="true" data-ph="Event Name" style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:var(--heading);margin-bottom:2px;"></div><div contenteditable="true" data-ph="Time &amp; details" style="font-size:11px;color:#999;font-weight:300;line-height:1.5;"></div><button class="li-del hint-late" data-hint="Delete just this event" onclick="delSchedSub(this)" title="Remove this event">×</button></div>`;
  const tmp=document.createElement('div');tmp.innerHTML=proto;const node=tmp.firstElementChild;subs.appendChild(node);
  refreshPlaceholders();node.querySelector('[contenteditable]')?.focus();
}
function delSchedSub(btn){
  const sub=btn.closest('.sched-sub');const subs=sub?.parentElement;if(!subs)return;
  if(subs.querySelectorAll(':scope > .sched-sub').length<=1){toast('Use the × on the day to remove it entirely');return;}
  sub.remove();
}
/* Upcoming Events: add another event under the same day. The gray date box is a
   full-height table cell, so stacking more events simply grows the row and the
   gray box extends down with it. */
function addEvtSub(btn){
  const wrap=btn.closest('.li-wrap');const subs=wrap.querySelector('.evt-subs');if(!subs)return;
  const proto=`<div class="evt-sub" style="position:relative;padding:10px 0;border-top:1px solid #f0f0f0;">
      <div style="margin-bottom:4px;"><span contenteditable="true" data-ph="Event Name" style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:var(--heading);text-transform:uppercase;display:inline;"></span> <span class="evt-time" contenteditable="true" data-ph="Time"></span></div>
      <div contenteditable="true" data-ph="Short description." style="font-size:12px;color:#888;line-height:1.6;font-weight:300;"></div>
      <div style="margin-top:6px;">${tagBlock(['Tag'],"display:inline-block;font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;background:rgba(224,90,27,.12);color:var(--accent);")}</div>
      <button class="li-del hint-late" data-hint="Delete just this event" onclick="delEvtSub(this)" title="Remove this event">×</button>
    </div>`;
  const tmp=document.createElement('div');tmp.innerHTML=proto;const node=tmp.firstElementChild;subs.appendChild(node);
  refreshPlaceholders();node.querySelector('[contenteditable]')?.focus();
}
function delEvtSub(btn){
  const sub=btn.closest('.evt-sub');const subs=sub?.parentElement;if(!subs)return;
  if(subs.querySelectorAll(':scope > .evt-sub').length<=1){toast('Use the × on the day to remove it entirely');return;}
  sub.remove();
}

/* ═══════════ SCHEDULE / EVENTS DATE PICKER ═══════════
   The calendar button on a Weekly Schedule day or an Upcoming Event opens a small month
   calendar. Clicking a date fills that row's day/date fields:
   • Weekly Schedule → weekday spelled out ("Sunday") + "AUG 9"
   • Upcoming Events → month ≤4-char ("Aug") + day number ("9") + weekday ("Sunday")
   Month abbreviations are capped at 4 characters; weekdays are always spelled out. */
const WEEKDAYS_FULL=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function monthAbbr(mIdx){
  // ≤4 chars: most 3-letter, but keep it readable
  const a=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
  return a[mIdx];
}
let schedCalRow=null, schedCalKind=null, schedCalView=null;
function openSchedCal(btn){
  schedCalRow=btn.closest('.li-wrap');
  const sec=btn.closest('.sec');schedCalKind=(sec&&sec.dataset.key==='nlevents')?'events':'schedule';
  schedCalView=new Date();schedCalView.setDate(1);
  renderSchedCal();
  document.getElementById('schedCalBg').classList.add('show');
}
function closeSchedCal(){document.getElementById('schedCalBg').classList.remove('show');schedCalRow=null;}
function schedCalNav(delta){schedCalView.setMonth(schedCalView.getMonth()+delta);renderSchedCal();}
function renderSchedCal(){
  const host=document.getElementById('schedCalGrid');if(!host)return;
  const y=schedCalView.getFullYear(),m=schedCalView.getMonth();
  document.getElementById('schedCalLabel').textContent=NL_MONTHS[m]+' '+y;
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  let html='<table role="presentation" style="width:100%;border-collapse:collapse;text-align:center;">';
  html+='<tr>'+['S','M','T','W','T','F','S'].map(d=>`<th style="font-family:\\'Montserrat\\';font-size:9px;color:#aaa;font-weight:700;padding:4px 0;">${d}</th>`).join('')+'</tr><tr>';
  for(let i=0;i<first;i++)html+='<td></td>';
  for(let d=1;d<=days;d++){
    const cur=new Date(y,m,d);const isToday=cur.getTime()===today.getTime();
    html+=`<td style="padding:2px;"><button onclick="pickSchedDate(${y},${m},${d})" style="width:30px;height:30px;border-radius:6px;border:1px solid ${isToday?'var(--accent)':'#e6e6e6'};background:${isToday?'rgba(224,90,27,.08)':'#fff'};color:#333;font-family:'Montserrat';font-size:12px;font-weight:600;cursor:pointer;">${d}</button></td>`;
    if((first+d)%7===0)html+='</tr><tr>';
  }
  html+='</tr></table>';
  host.innerHTML=html;
}
function pickSchedDate(y,m,d){
  if(!schedCalRow)return;
  const date=new Date(y,m,d);
  const weekday=WEEKDAYS_FULL[date.getDay()];
  const eds=[...schedCalRow.querySelectorAll('[contenteditable][data-ph]')];
  if(schedCalKind==='events'){
    // month (≤4) | day number | weekday — the first three editable fields in the date box
    const box=schedCalRow.querySelector('td[valign="middle"]')||schedCalRow;
    const boxEds=[...box.querySelectorAll('[contenteditable][data-ph]')];
    if(boxEds[0])libSetField(boxEds[0],monthAbbr(m));
    if(boxEds[1])libSetField(boxEds[1],String(d));
    if(boxEds[2])libSetField(boxEds[2],weekday);
  } else {
    // schedule: weekday + "AUG 9" (month abbr uppercased + day)
    if(eds[0])libSetField(eds[0],weekday);
    if(eds[1])libSetField(eds[1],monthAbbr(m).toUpperCase()+' '+d);
  }
  saveStateLocal();
  closeSchedCal();
}
/* timeline step: flip between complete (orange) and incomplete (gray) */
function toggleTlDot(btn){
  const wrap=btn.closest('.li-wrap');const dot=wrap.querySelector('.tl-dot');if(!dot)return;
  const done=dot.dataset.done==='1';
  dot.dataset.done=done?'0':'1';
  dot.style.background=done?'#ccc':'var(--accent)';
  btn.textContent=done?'○':'✓';
}
/* remove an entire editable-link button from its section */
function removeBtn(b){
  const wrap=b.closest('.editable-link');if(!wrap)return;
  if(confirm('Remove this button?'))wrap.remove();
}
/* newsletter: toggle member photos on/off */
function toggleMemberPics(btn){
  const card=btn.closest('.sec');const on=btn.dataset.on==='1';
  btn.dataset.on=on?'0':'1';
  btn.textContent=on?'○ Member Photos: Off':'● Member Photos: On';
  card.querySelectorAll('.nl-pic').forEach(p=>p.style.display=on?'none':'block');
  card.querySelectorAll('.nl-pic-btn').forEach(b=>b.style.display=on?'none':'inline-block');
}
/* newsletter: set a member photo via file upload (stored as data URL) */
let memberPicTarget=null;
function openMemberPic(btn){
  const wrap=btn.closest('.li-wrap');const host=wrap.querySelector('.nl-pic');const img=host.querySelector('.nl-pic-img');
  openImageLib((url,name,logoHTML)=>{
    setPhotoHost(host,img,url,name,logoHTML);
    saveStateLocal();
  });
}
/* newsletter: toggle recipe instruction steps */
function toggleRecipeSteps(btn){
  const card=btn.closest('.sec');const steps=card.querySelector('.nl-steps');if(!steps)return;
  const on=steps.dataset.on==='1';
  steps.dataset.on=on?'0':'1';
  steps.style.display=on?'none':'block';
  btn.textContent=on?'+ Show Instructions Steps':'− Hide Instructions Steps';
}
/* Generic show/hide for an optional block inside a documentation cell.
   The button carries data-target (a class) and data-label (what to call it);
   we look only inside the button's own cell so sibling columns are unaffected. */
function toggleDocExtra(btn){
  const cell=btn.closest('td')||btn.parentElement;
  const cls=btn.getAttribute('data-target');
  const label=btn.getAttribute('data-label')||'block';
  const el=cell.querySelector('.'+cls);
  if(!el)return;
  const on=el.dataset.on==='1';
  el.dataset.on=on?'0':'1';
  el.style.display=on?'none':'block';
  btn.textContent=(on?'+ Add ':'− Hide ')+label;
  markDirty&&markDirty();
}

/* ═══════════ INVESTIGATION: SUSPECT CARDS ═══════════
   A suspect card has two faces: the mugshot (front) and the charge sheet (back).
   Clicking swaps which face is shown. Both faces stay in the DOM so both remain
   editable and survive save/reload; on export the card is emitted showing the
   front, since a printed graphic or an email cannot flip. */
function flipSuspect(el,ev){
  // don't flip when the click is meant to edit text or hit a control — only flip
  // on "empty" areas of the card, or via the dedicated flip button.
  if(ev){
    const tgt=ev.target;
    if(tgt.closest('[contenteditable]')||tgt.closest('button')||tgt.closest('.li-del')) return;
  }
  const card=el.closest('.sus-card');if(!card)return;
  const front=card.querySelector('.sus-front'), back=card.querySelector('.sus-back');
  if(!front||!back)return;
  const showingBack=card.dataset.flipped==='1';
  card.dataset.flipped=showingBack?'0':'1';
  front.style.display=showingBack?'block':'none';
  back.style.display=showingBack?'none':'block';
}
/* verdict stamp cycles: under investigation -> cleared -> guilty */
const VERDICTS=[['UNDER INVESTIGATION','#8a8781'],['CLEARED','#3f7d4f'],['GUILTY','#9c3a3a']];
function cycleVerdict(btn){
  const i=(parseInt(btn.dataset.v||'0',10)+1)%VERDICTS.length;
  btn.dataset.v=i;
  btn.textContent=VERDICTS[i][0];
  btn.style.color=VERDICTS[i][1];
  btn.style.borderColor=VERDICTS[i][1];
  markDirty&&markDirty();
}
/* evidence box: click to toggle solid (collected) vs outline (pending) */
function toggleEvidence(el){
  const filled=el.dataset.filled==='1';
  el.dataset.filled=filled?'0':'1';
  el.style.backgroundColor=filled?'transparent':'var(--accent)';
  markDirty&&markDirty();
}
/* featured product: show/hide and set a per-product photo (own scope, so a
   multi-product section keeps each image independent). Mirrors the recipe photo. */
function toggleProductPic(btn){
  const card=btn.closest('.nl-prod');const pic=card.querySelector('.nl-ppic');if(!pic)return;
  const on=pic.dataset.on==='1';
  pic.dataset.on=on?'0':'1';
  pic.style.display=on?'none':'block';
  btn.dataset.on=on?'0':'1';
  // grid cards use a compact "+ Photo" button; the single product uses the
  // full-width "+ Show product photo" button. Tell them apart by the label
  // the button currently carries (both start with their own short/long form).
  const compact=/photo$/i.test((btn.textContent||'').trim()) && !/show product|hide product/i.test(btn.textContent||'');
  if(compact) btn.textContent=on?'+ Photo':'\u2212 Photo';
  else btn.textContent=on?'+ Show product photo':'\u2212 Hide product photo';
}
function openProductPic(btn){
  const host=btn.closest('.nl-ppic');const img=host.querySelector('.nl-ppic-img');
  openImageLib((url,name,logoHTML)=>{setPhotoHost(host,img,url,name,logoHTML);saveStateLocal();});
}
/* Put either a URL image or an inline HTML logo into a photo host. When a logo
   is chosen we swap the <img> for the logo markup (kept in a .logo-slot wrapper)
   so it exports as real HTML — Gmail-safe — while the host still tracks state so
   the toggle/preview keep working. Passing a url restores the plain <img>. */
function setPhotoHost(host,img,url,name,logoHTML){
  if(!host)return;
  const old=host.querySelector('.logo-slot');if(old)old.remove();
  if(logoHTML){
    if(img)img.style.display='none';
    host.dataset.logo='1';host.removeAttribute('data-src');
    const slot=document.createElement('div');
    slot.className='logo-slot';
    // center the logo and, crucially, let it size to its own content so a table
    // cell in the exported email can't stretch a fixed-height logo box taller.
    slot.style.cssText='text-align:center;padding:14px 8px;font-size:0;line-height:0;';
    slot.innerHTML='<div class="logo-inner" style="display:inline-block;vertical-align:top;">'+logoHTML+'</div>';
    host.insertBefore(slot,host.firstChild);
  } else if(url){
    host.removeAttribute('data-logo');
    if(img){img.src=url;img.alt=name||'';img.style.display='';}
    host.dataset.src=url;
  }
  // reveal the host and flip its toggle on (product/recipe photos are off by default)
  host.dataset.on='1';host.style.display='block';
  const card=host.closest('.nl-prod')||host.closest('.sec');
  if(card){
    const tg=card.querySelector('.nl-pptoggle,.nl-rpictoggle');
    if(tg){tg.dataset.on='1';
      if(tg.classList.contains('nl-pptoggle')){const compact=/photo$/i.test((tg.textContent||'').trim())&&!/show product|hide product/i.test(tg.textContent||'');tg.textContent=compact?'\u2212 Photo':'\u2212 Hide product photo';}
      else tg.textContent='\u2212 Hide Recipe Photo';
    }
  }
}
/* toggle the optional featured-recipe photo on/off */
function toggleRecipePic(btn){
  const card=btn.closest('.sec');const pic=card.querySelector('.nl-rpic');if(!pic)return;
  const on=pic.dataset.on==='1';
  pic.dataset.on=on?'0':'1';
  pic.style.display=on?'none':'block';
  btn.dataset.on=on?'0':'1';
  btn.textContent=on?'+ Show Recipe Photo':'− Hide Recipe Photo';
}
/* pick a photo for the featured recipe — downscaled to a 620px-wide JPEG data URL
   so it stays inside the email frame and keeps the payload reasonable */
function openRecipePic(btn){
  const host=btn.closest('.nl-rpic');const img=host.querySelector('.nl-rpic-img');
  // pull from the repo's image library (URL-referenced, keeps the email light)
  openImageLib((url,name,logoHTML)=>{
    setPhotoHost(host,img,url,name,logoHTML);
    saveStateLocal();
  });
}

/* ═══════════ PLACEHOLDER (ghost text) ═══════════ */
function refreshPlaceholders(){frame.querySelectorAll('[contenteditable]').forEach(markEmpty);}
function markEmpty(el){const empty=el.textContent.replace(/\u200b/g,'').trim().length===0;el.classList.toggle('is-empty',empty);}
frame.addEventListener('input',e=>{if(e.target.matches('[contenteditable]'))markEmpty(e.target);});
frame.addEventListener('focusin',e=>{if(e.target.matches('[contenteditable]'))lastEditable=e.target;});
frame.addEventListener('blur',e=>{if(e.target.matches('[contenteditable]'))markEmpty(e.target);},true);

/* ═══════════ LIST-ITEM DRAG-AND-DROP ═══════════
   Reorder items within a single .li-list by dragging their grip handle. Only
   items sharing the same parent list can swap, so a schedule day can't jump into
   an unrelated list. Wired once on the frame. */
function liDragSiblingWrap(node){
  // nearest .li-wrap that is a direct child of liDragSrc's list
  if(!liDragSrc)return null;
  const list=liDragSrc.parentElement;
  let el=node;
  while(el&&el!==frame){ if(el.classList&&el.classList.contains('li-wrap')&&el.parentElement===list)return el; el=el.parentElement; }
  return null;
}
function clearLiDrop(){frame.querySelectorAll('.li-drop-before,.li-drop-after').forEach(e=>e.classList.remove('li-drop-before','li-drop-after'));}
frame.addEventListener('dragstart',e=>{
  if(!liDragSrc)return;
  liDragSrc.classList.add('li-dragging');
  try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','li');}catch(_){}
});
frame.addEventListener('dragover',e=>{
  if(!liDragSrc)return;
  const tgt=liDragSiblingWrap(e.target);
  if(!tgt||tgt===liDragSrc)return;
  e.preventDefault();
  const r=tgt.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;
  clearLiDrop();tgt.classList.add(after?'li-drop-after':'li-drop-before');
});
frame.addEventListener('drop',e=>{
  if(!liDragSrc)return;
  const tgt=liDragSiblingWrap(e.target);
  if(tgt&&tgt!==liDragSrc){
    e.preventDefault();
    const r=tgt.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;
    if(after)tgt.after(liDragSrc);else tgt.before(liDragSrc);
    renumberSteps(liDragSrc.parentElement);
    saveStateLocal();
  }
  clearLiDrop();
});
frame.addEventListener('dragend',()=>{
  if(liDragSrc){liDragSrc.classList.remove('li-dragging');liDragSrc.removeAttribute('draggable');}
  clearLiDrop();liDragSrc=null;
});

/* ═══════════ LINK EDITOR ═══════════ */
let linkTargetWrap=null;
function openLinkModal(btn){
  linkTargetWrap=btn.closest('.editable-link');
  const cur=linkTargetWrap?linkTargetWrap.dataset.href||'':'';
  document.getElementById('linkHrefInput').value=(cur==='#'?'':cur);
  // style toggle only applies to nav-style links
  const isNav=linkTargetWrap&&linkTargetWrap.classList.contains('nav-link');
  document.getElementById('linkStyleRow').style.display=isNav?'':'none';
  if(isNav)reflectLinkStyle(linkTargetWrap.dataset.filled==='1');
  document.getElementById('linkModalBg').classList.add('show');
  setTimeout(()=>document.getElementById('linkHrefInput').focus(),50);
}
function reflectLinkStyle(filled){
  const f=document.getElementById('linkStyleFilled'),p=document.getElementById('linkStylePlain');
  if(!f||!p)return;
  f.classList.toggle('primary',filled);p.classList.toggle('primary',!filled);
}
function setLinkStyle(filled){
  if(!linkTargetWrap)return;
  linkTargetWrap.dataset.filled=filled?'1':'0';
  const a=linkTargetWrap.querySelector('a');
  if(a){
    // keep accent-text variant for the "Blog"-style plain link if it was accent
    const wasAccent=/color:var\(--accent\)/.test(a.getAttribute('style')||'')&&!filled;
    let style=filled?NAV_FILLED:NAV_PLAIN;
    if(!filled&&wasAccent)style=style.replace('color:#d6d6d6','color:var(--accent)');
    a.setAttribute('style',style);
  }
  reflectLinkStyle(filled);
}
function closeLinkModal(){document.getElementById('linkModalBg').classList.remove('show');linkTargetWrap=null;}
function saveLinkHref(){
  if(linkTargetWrap){
    let v=document.getElementById('linkHrefInput').value.trim()||'#';
    linkTargetWrap.dataset.href=v;
    const a=linkTargetWrap.querySelector('a');if(a)a.setAttribute('href',v);
    toast('Link updated');
  }
  closeLinkModal();
}

/* ═══════════ EMBED EDITOR ═══════════ */
let embedTargetHost=null;
function openEmbedEditor(btn){
  embedTargetHost=btn.closest('.sec').querySelector('.embed-host');
  document.getElementById('addGuide'); // noop
  const cur=embedTargetHost?embedTargetHost.dataset.embed||'':'';
  embedPromptCode=cur;
  document.getElementById('embedCodeInput').value=cur;
  document.getElementById('embedModalBg').classList.add('show');
}
let embedPromptCode='';
function closeEmbedModal(){document.getElementById('embedModalBg').classList.remove('show');embedTargetHost=null;}
function saveEmbedCode(){
  if(embedTargetHost){
    const code=document.getElementById('embedCodeInput').value.trim();
    embedTargetHost.dataset.embed=code;
    renderEmbedHost(embedTargetHost);
    toast(code?'Embed set':'Embed cleared');
  }
  closeEmbedModal();
}
function renderEmbedHost(host){
  const code=host.dataset.embed||'';
  if(!code){
    host.innerHTML=`<div class="embed-empty" style="padding:36px 24px;text-align:center;">
      <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;">&#9881; Embed Slot</div>
      <div style="font-size:12px;color:#888;line-height:1.6;font-weight:300;">Paste your GoHighLevel form embed code (iframe / script).<br>Use the &ldquo;Edit Embed&rdquo; button on this block.</div>
    </div>`;
    return;
  }
  // live preview of the embed inside the builder (render markup). Scripts won't execute in builder but iframes will.
  host.innerHTML=code;
}

/* ═══════════ MEDIA EDITOR (mp4 / mp3) ═══════════ */
let mediaTargetHost=null;
function openMediaEditor(btn){
  mediaTargetHost=btn.closest('.sec').querySelector('.media-host');
  const kind=mediaTargetHost.dataset.mediaKind;
  const titles={audio:'Set Audio URL (MP3)',video:'Set Video URL (MP4)',image:'Set Image URL'};
  const phs={audio:'https://.../coaching.mp3',video:'https://.../welcome.mp4',image:'https://.../featured.jpg'};
  document.getElementById('mediaModalTitle').textContent= titles[kind]||'Set Media URL';
  document.getElementById('mediaUrlInput').value=mediaTargetHost.dataset.src||'';
  document.getElementById('mediaUrlInput').placeholder= phs[kind]||'https://...';
  document.getElementById('mediaModalBg').classList.add('show');
}
function closeMediaModal(){document.getElementById('mediaModalBg').classList.remove('show');mediaTargetHost=null;}
function saveMediaUrl(){
  if(mediaTargetHost){
    const url=document.getElementById('mediaUrlInput').value.trim();
    mediaTargetHost.dataset.src=url;
    applyMedia(mediaTargetHost);
    toast(url?'Media URL set':'Media cleared');
  }
  closeMediaModal();
}
function applyMedia(host){
  const url=host.dataset.src||'';
  const el=host.querySelector('.media-el');
  const empty=host.querySelector('.media-empty');
  if(el && el.tagName==='IMG'){
    // image host: src lives directly on the <img>
    el.setAttribute('src',url);
    el.style.display=url?'block':'none';
  }else if(el){
    const src=el.querySelector('source');
    if(src)src.setAttribute('src',url);
    el.style.display=url?'block':'none';if(url)el.load();
  }
  if(empty)empty.style.display=url?'none':'';
}
function hydrateMedia(sec){
  sec.querySelectorAll('.media-host').forEach(applyMedia);
  sec.querySelectorAll('.embed-host').forEach(renderEmbedHost);
}

/* Flip a whole section horizontally: reverse the left-to-right order of every
   side-by-side (horizontal flex) row inside it. Reordering the actual DOM nodes
   — rather than using flex-direction:row-reverse — makes the flip real, so the
   email export (whose flex-to-table pass reads children in DOM order) mirrors
   the canvas exactly. Toggling it again restores the original order. Works on
   any section: Image + Text, Before/After, product grids, stat rows, etc. */
function flipSec(btn){
  const sec=btn.closest('.sec');if(!sec)return;
  let flippedAny=false;
  sec.querySelectorAll('div').forEach(el=>{
    if(el.closest('.sec-controls'))return;                 // never touch the toolbar
    const disp=(el.style.display||'').replace(/\s/g,'');
    if(disp!=='flex')return;
    const dir=(el.style.flexDirection||'').toLowerCase();
    if(dir.indexOf('column')!==-1)return;                  // only horizontal rows
    const kids=[...el.children];
    if(kids.length<2)return;
    // re-append children in reverse to flip left/right order
    for(let i=kids.length-1;i>=0;i--)el.appendChild(kids[i]);
    flippedAny=true;
  });
  if(!flippedAny){toast('Nothing to flip in this block');return;}
  sec.dataset.flipped = sec.dataset.flipped==='1' ? '0' : '1';
  refreshState&&refreshState();
  saveStateLocal&&saveStateLocal();
}

/* ═══════════ MERGE TAG HOTKEYS ═══════════ */
const BASE_HK=[
  {label:'First Name',tag:'{{contact.first_name}}'},
  {label:'Last Name',tag:'{{contact.last_name}}'},
  {label:'Phone',tag:'{{contact.phone}}'},
  {label:'Email',tag:'{{contact.email}}'}
];
let HOTKEYS=BASE_HK.slice();
let lastEditable=null,savedRange=null;
document.addEventListener('selectionchange',()=>{const sel=window.getSelection();if(sel.rangeCount&&frame.contains(sel.anchorNode)){savedRange=sel.getRangeAt(0).cloneRange();}});
function renderHotkeys(){
  const grid=document.getElementById('hkGrid');grid.innerHTML='';
  HOTKEYS.forEach((h,i)=>{
    const b=document.createElement('button');b.className='hk-btn';
    b.innerHTML=`${h.label} <span class="tg">${h.tag}</span>`+(i>=BASE_HK.length?` <span class="del" title="Remove" data-i="${i}">×</span>`:'');
    b.addEventListener('click',ev=>{
      if(ev.target.classList.contains('del')){HOTKEYS.splice(+ev.target.dataset.i,1);renderHotkeys();persistHotkeys();return;}
      insertTag(h.tag);
    });
    grid.appendChild(b);
  });
}
function insertTag(tag){
  if(!lastEditable){toast('Click into a text box first');return;}
  lastEditable.focus();
  const sel=window.getSelection();
  if(savedRange&&lastEditable.contains(savedRange.startContainer)){sel.removeAllRanges();sel.addRange(savedRange);}
  document.execCommand('insertText',false,tag);
  markEmpty(lastEditable);
}
function addHotkey(){
  const l=document.getElementById('hkLabel').value.trim();let t=document.getElementById('hkTag').value.trim();
  if(!l||!t){toast('Need both a label and a tag');return;}
  if(!/^\{\{[\s\S]*\}\}$/.test(t))t='{{'+t.replace(/[{}]/g,'')+'}}';
  HOTKEYS.push({label:l,tag:t});
  document.getElementById('hkLabel').value='';document.getElementById('hkTag').value='';
  renderHotkeys();persistHotkeys();toast('Tag added');
}
function persistHotkeys(){try{localStorage.setItem('lngvty_hotkeys',JSON.stringify(HOTKEYS.slice(BASE_HK.length)));}catch(e){}}
function loadHotkeys(){try{const d=localStorage.getItem('lngvty_hotkeys');if(d)HOTKEYS=BASE_HK.concat(JSON.parse(d));}catch(e){}}

/* ═══════════ INLINE FONT COLOR ═══════════ */
const colorbar=document.getElementById('colorbar');
const formatbar=document.getElementById('formatbar');
/* Arm the format bar whenever there's a non-empty selection inside the canvas,
   and remember that range so a click on a bar button (which blurs the editor)
   can restore it before applying the command. */
let fmtRange=null;
function fmtCaptureFromSelection(){
  const s=window.getSelection();
  if(s&&s.rangeCount&&!s.isCollapsed&&frame.contains(s.anchorNode)){
    fmtRange=s.getRangeAt(0).cloneRange();
    if(formatbar)formatbar.classList.add('armed');
    return true;
  }
  return false;
}
function fmtSyncArmed(){
  const s=window.getSelection();
  const on=s&&s.rangeCount&&!s.isCollapsed&&frame.contains(s.anchorNode);
  if(on)fmtRange=s.getRangeAt(0).cloneRange();
  if(formatbar)formatbar.classList.toggle('armed',!!on);
}
function fmtRestore(){
  if(!fmtRange)return false;
  let host=fmtRange.startContainer;
  while(host&&host.nodeType!==1)host=host.parentNode;
  const editable=host&&host.closest?host.closest('[contenteditable]'):null;
  if(editable)editable.focus();
  const s=window.getSelection();s.removeAllRanges();s.addRange(fmtRange);return true;
}
function fmtExec(cmd,val){
  if(!fmtRestore())return;
  document.execCommand('styleWithCSS',false,true);
  document.execCommand(cmd,false,val===undefined?null:val);
  fmtSyncArmed();markDirty&&markDirty();
}
function fmtBold(){fmtExec('bold');}
function fmtItalic(){fmtExec('italic');}
function fmtUnderline(){fmtExec('underline');}
function fmtAlign(dir){
  // justify commands act on the block; restore the selection first
  fmtRestore();
  document.execCommand('justify'+(dir==='left'?'Left':dir==='right'?'Right':'Center'),false,null);
  fmtSyncArmed();markDirty&&markDirty();
}
/* Highlight = pill-style background on the selection, like the recipe tags:
   a soft tint of the chosen color with a little padding and rounding. Orange by
   default. Robust to focus moving into the popover. */
let fmtLastMark='var(--accent)';
function applyHighlight(c){
  let range=(cbSavedRange&&!cbSavedRange.collapsed)?cbSavedRange.cloneRange()
           :(fmtRange&&!fmtRange.collapsed)?fmtRange.cloneRange():null;
  if(!range){ if(!fmtCaptureFromSelection()){toast('Select some text first');return;} range=fmtRange.cloneRange(); }
  const pop=document.getElementById('cbPop');
  // resolve CSS vars to a concrete color
  let val=c;
  if(/var\(/.test(val)){const m=val.match(/var\((--[\w-]+)\)/);if(m){const cv=getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();if(cv)val=cv;}}
  if(c==='transparent'){
    // unwrap: strip any highlight span wrapping/within the selection
    unwrapHighlight(range);
    if(pop)pop.classList.remove('show');markDirty&&markDirty();return;
  }
  if(range.collapsed){toast('Select some text first');return;}
  const tint=tintColor(val,0.18);           // soft background like the tags
  try{
    const span=document.createElement('span');
    span.className='hl-mark';
    span.style.backgroundColor=tint;
    span.style.color=val;
    span.style.padding='1px 6px';
    span.style.borderRadius='4px';
    span.style.fontWeight='600';
    try{ range.surroundContents(span); }
    catch(_){ const frag=range.extractContents(); span.appendChild(frag); range.insertNode(span); }
    const sel=window.getSelection();sel.removeAllRanges();const nr=document.createRange();nr.selectNodeContents(span);sel.addRange(nr);
    fmtRange=nr.cloneRange();cbSavedRange=nr.cloneRange();
  }catch(e){toast('Couldn\u2019t highlight that selection');return;}
  fmtLastMark=c;
  const dot=document.getElementById('fmtMarkDot');if(dot)dot.style.background=val;
  if(pop)pop.classList.remove('show');
  markDirty&&markDirty();
}
/* remove highlight spans intersecting a range by replacing them with their text */
function unwrapHighlight(range){
  let node=range.startContainer;
  while(node&&node!==frame){
    if(node.nodeType===1&&node.classList&&node.classList.contains('hl-mark')){
      const parent=node.parentNode;
      while(node.firstChild)parent.insertBefore(node.firstChild,node);
      parent.removeChild(node);
      return;
    }
    node=node.parentNode;
  }
}
/* mix a hex color with white to get a soft tint (for the pill background) */
function tintColor(hex,alpha){
  const m=(hex||'').replace('#','').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if(!m)return hex;
  const r=parseInt(m[1],16),g=parseInt(m[2],16),b=parseInt(m[3],16);
  const mix=(ch)=>Math.round(ch*alpha+255*(1-alpha));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}
function positionColorbar(){/* floating bar retired in favor of the fixed format bar */}
document.addEventListener('mouseup',()=>setTimeout(fmtSyncArmed,10));
document.addEventListener('keyup',()=>{const s=window.getSelection();if(s&&s.rangeCount&&frame.contains(s.anchorNode))fmtSyncArmed();});
/* ═══════════ TEXT COLOR PALETTE ═══════════
   The selection toolbar opens a popover listing every theme color (live values,
   so a re-themed document shows its own palette), a standing palette, and a hex
   field. Selection is captured on mousedown because opening the popover would
   otherwise blur it away. */
let cbSavedRange=null;
function cbCaptureRange(){
  const s=window.getSelection();
  if(s&&s.rangeCount&&!s.isCollapsed)cbSavedRange=s.getRangeAt(0).cloneRange();
}
function cbRestoreRange(){
  if(!cbSavedRange)return false;
  // focus the editable that owns the range first — execCommand('foreColor'/'hiliteColor')
  // is a no-op unless the contenteditable host actually has focus.
  let host=cbSavedRange.startContainer;
  while(host&&host.nodeType!==1)host=host.parentNode;
  const editable=host&&host.closest?host.closest('[contenteditable]'):null;
  if(editable)editable.focus();
  const s=window.getSelection();s.removeAllRanges();s.addRange(cbSavedRange);return true;
}
/* Wrap the current saved range in a <span> carrying the given inline style.
   This is used for text color and highlight instead of the flaky, deprecated
   execCommand('foreColor'/'hiliteColor'), which silently no-ops when focus has
   moved to the color popover. Manual wrapping always works. */
function fmtWrapRange(range,styleProp,styleVal){
  if(!range||range.collapsed)return false;
  // resolve a CSS var to its computed hex so the exported email has a real color
  let val=styleVal;
  if(/var\(/.test(val)){
    const m=val.match(/var\((--[\w-]+)\)/);
    if(m){const cv=getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();if(cv)val=cv;}
  }
  try{
    const span=document.createElement('span');
    span.style[styleProp]=val;
    // if the selection is entirely within one text node/element, surroundContents works;
    // otherwise fall back to extract + wrap + reinsert which handles partial/multi-node spans
    try{ range.surroundContents(span); }
    catch(_){
      const frag=range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    // reselect the newly wrapped span so the user can chain formats
    const sel=window.getSelection();sel.removeAllRanges();
    const nr=document.createRange();nr.selectNodeContents(span);sel.addRange(nr);
    fmtRange=nr.cloneRange();cbSavedRange=nr.cloneRange();
    return true;
  }catch(e){return false;}
}
function applyTextColor(c){
  // use the best range we have: the one saved when the popover opened, else the
  // last armed selection. Never bail just because focus moved to the popover.
  let range=(cbSavedRange&&!cbSavedRange.collapsed)?cbSavedRange.cloneRange()
           :(fmtRange&&!fmtRange.collapsed)?fmtRange.cloneRange():null;
  if(!range){ if(!fmtCaptureFromSelection()){toast('Select some text first');return;} range=fmtRange.cloneRange(); }
  if(fmtColorTarget==='mark'){applyHighlight(c);return;}
  const ok=fmtWrapRange(range,'color',c);
  if(!ok)toast('Select some text first');
  const dot=document.getElementById('fmtTextDot');if(dot)dot.style.background=c==='var(--accent)'?getComputedStyle(document.documentElement).getPropertyValue('--accent').trim():c;
  document.getElementById('cbPop').classList.remove('show');
  markDirty&&markDirty();
}
function applyTextHex(){
  const v=(document.getElementById('cbHex').value||'').trim();
  if(!/^#?[0-9a-f]{6}$/i.test(v)){toast('Enter a 6-digit hex, e.g. #3f7d4f');return;}
  applyTextColor(v.charAt(0)==='#'?v:'#'+v);
}
/* Open the shared color popover under the format bar, for either the text color
   or the highlight. Highlight defaults to orange and can be set to any color. */
let fmtColorTarget='text';
function openFmtColor(target){
  fmtColorTarget=target||'text';
  if(!fmtCaptureFromSelection()){toast('Select some text first');return;}
  cbSavedRange=fmtRange?fmtRange.cloneRange():null;
  renderTextPalette();
  const pop=document.getElementById('cbPop');
  document.getElementById('cbPopTitle') && (document.getElementById('cbPopTitle').textContent = target==='mark'?'Highlight color':'Text color');
  // show a "default orange" shortcut for highlight
  const resetRow=document.getElementById('cbMarkReset');
  if(resetRow)resetRow.style.display=(target==='mark')?'block':'none';
  const anchor=document.querySelector('.formatbar .fmt-swatch'+(target==='mark'?':nth-of-type(2)':''))||formatbar;
  const r=(target==='mark'?document.getElementById('fmtMarkDot'):document.getElementById('fmtTextDot')).closest('.fmt-btn').getBoundingClientRect();
  pop.style.left=Math.max(8,Math.min(window.innerWidth-260,r.left))+'px';
  pop.style.top=(r.bottom+6)+'px';
  pop.classList.add('show');
}
function renderTextPalette(){
  const cs=getComputedStyle(document.documentElement);
  const themeSw=Object.entries(THEME_VARMAP).map(([name,v])=>{
    const hex=(cs.getPropertyValue(v)||'').trim()||'#000000';
    return [name.replace('-',' '),hex];
  });
  const mk=(arr)=>arr.map(([n,hex])=>
    `<button type="button" class="sw" style="background:${hex}" title="${n} ${hex}" data-hex="${hex}"></button>`).join('');
  const themeHost=document.getElementById('cbThemeSw');
  const palHost=document.getElementById('cbPaletteSw');
  themeHost.innerHTML=mk(themeSw);
  palHost.innerHTML=mk(SEC_PALETTE.concat([['White','#ffffff'],['Black','#1a1a1a']]));
  // Attach real listeners on pointerdown and preventDefault so focus/selection
  // never leaves the editor. Inline onmousedown attributes proved unreliable when
  // the swatch grid is re-rendered each time the popover opens.
  [themeHost,palHost].forEach(host=>{
    host.querySelectorAll('.sw').forEach(sw=>{
      sw.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();applyTextColor(sw.getAttribute('data-hex'));});
    });
  });
}
const cbMore=document.getElementById('cbMore');
if(cbMore){
  cbMore.addEventListener('mousedown',e=>{
    e.preventDefault();
    cbCaptureRange();
    renderTextPalette();
    const pop=document.getElementById('cbPop');
    const r=colorbar.getBoundingClientRect();
    pop.style.left=Math.max(8,Math.min(window.innerWidth-260,r.left))+'px';
    pop.style.top=(r.bottom+6)+'px';
    pop.classList.toggle('show');
  });
}
document.addEventListener('mousedown',e=>{
  const pop=document.getElementById('cbPop');
  // ignore clicks on the format-bar swatches (they open this popover) and cbMore
  if(pop&&pop.classList.contains('show')&&!pop.contains(e.target)&&e.target!==cbMore&&!e.target.closest('.fmt-swatch')){
    pop.classList.remove('show');
  }
});

/* ═══════════ INLINE TEXT LINK (link selected text) ═══════════ */
let textLinkRange=null;       // saved selection range
let textLinkExisting=null;    // the <a> we're editing, if selection is inside one
function openTextLink(){
  const sel=window.getSelection();
  if(!sel.rangeCount||sel.isCollapsed||!frame.contains(sel.anchorNode)){toast('Select some text first');return;}
  textLinkRange=sel.getRangeAt(0).cloneRange();
  let node=sel.anchorNode;textLinkExisting=null;
  while(node&&node!==frame){if(node.nodeType===1&&node.tagName==='A'){textLinkExisting=node;break;}node=node.parentNode;}
  document.getElementById('textLinkUrl').value=textLinkExisting?(textLinkExisting.getAttribute('href')||''):'';
  document.getElementById('textLinkBg').classList.add('show');
  setTimeout(()=>document.getElementById('textLinkUrl').focus(),30);
}
const cbLink=document.getElementById('cbLink');
if(cbLink){
  cbLink.addEventListener('mousedown',e=>{e.preventDefault();openTextLink();});
}
function closeTextLink(){document.getElementById('textLinkBg').classList.remove('show');}
function restoreTextRange(){
  if(!textLinkRange)return false;
  const sel=window.getSelection();sel.removeAllRanges();sel.addRange(textLinkRange);return true;
}
function applyTextLink(){
  let url=document.getElementById('textLinkUrl').value.trim();
  if(!url){toast('Enter a URL (or use Remove Link)');return;}
  // light normalize: add https:// if it looks like a bare domain
  if(!/^([a-z]+:|\/\/|#|\{\{)/i.test(url) && /\./.test(url))url='https://'+url;
  if(textLinkExisting){
    textLinkExisting.setAttribute('href',url);
    textLinkExisting.setAttribute('target','_blank');
    textLinkExisting.style.color='inherit';
  }else{
    if(!restoreTextRange()){closeTextLink();return;}
    document.execCommand('createLink',false,url);
    // style the newly created links to inherit color + open in new tab
    const sel=window.getSelection();
    if(sel.anchorNode){
      let p=sel.anchorNode;while(p&&p!==frame){if(p.nodeType===1&&p.tagName==='A'){p.setAttribute('target','_blank');p.style.color='inherit';p.style.textDecoration='underline';}p=p.parentNode;}
    }
  }
  closeTextLink();refreshState&&refreshState();toast('Link added');
}
function removeTextLink(){
  if(textLinkExisting){
    const a=textLinkExisting;const parent=a.parentNode;
    while(a.firstChild)parent.insertBefore(a.firstChild,a);
    parent.removeChild(a);
    closeTextLink();refreshState&&refreshState();toast('Link removed');return;
  }
  // try unlink on the saved selection
  if(restoreTextRange()){document.execCommand('unlink',false,null);}
  closeTextLink();refreshState&&refreshState();toast('Link removed');
}

/* ═══════════ GLOBAL THEME ═══════════ */
const THEME_DEFAULT={accent:'#e05a1b',dark:'#1a1a1a',gray:'#3a3a3a',bg:'#f2f2f2',paper:'#f5f2e8','body-text':'#555555',heading:'#3a3a3a'};
const THEME_VARMAP={accent:'--accent',dark:'--dark',gray:'--gray',bg:'--bg',paper:'--paper','body-text':'--body-text',heading:'--heading'};
function setVar(k,v){document.documentElement.style.setProperty(THEME_VARMAP[k],v);const hx=document.getElementById('hex-'+k);if(hx)hx.textContent=v;}
Object.keys(THEME_VARMAP).forEach(k=>{const inp=document.getElementById('col-'+k);if(inp)inp.addEventListener('input',()=>setVar(k,inp.value));});
function resetTheme(){Object.entries(THEME_DEFAULT).forEach(([k,v])=>{const inp=document.getElementById('col-'+k);if(inp)inp.value=v;setVar(k,v);});toast('Theme reset');}

/* ═══════════ CUSTOMIZE (theme + typography + text clean-up) ═══════════ */
let docsEditing=false;
let notesEditing=false;

/* ═══════════ BUILD INFO ═══════════
   Bump BUILD.version whenever something ships. It surfaces in Settings →
   Version & Notes and is quoted on the feedback form, so a bug report always
   carries the build it came from. */
const BUILD={
  version : 'v23.0',
  name    : 'Split build',
  date    : '6 November 2026',
};

/* ── a small, dependency-free Markdown renderer ──
   Handles what the release notes actually use: headings, bold/italic/code,
   fenced code, tables, lists, quotes, rules, and links. Not a full CommonMark
   implementation, and doesn't need to be. */
function renderMarkdown(md){
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inline=t=>esc(t)
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');

  const lines=String(md||'').replace(/\r\n/g,'\n').split('\n');
  const out=[];
  let i=0;
  while(i<lines.length){
    const L=lines[i];

    // fenced code
    if(/^```/.test(L)){
      const buf=[];i++;
      while(i<lines.length && !/^```/.test(lines[i])){buf.push(lines[i]);i++;}
      i++;
      out.push('<pre><code>'+esc(buf.join('\n'))+'</code></pre>');
      continue;
    }
    // table
    if(/^\|/.test(L) && /^\|[\s:|-]+\|?\s*$/.test(lines[i+1]||'')){
      const cells=r=>r.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const head=cells(L);
      i+=2;
      const rows=[];
      while(i<lines.length && /^\|/.test(lines[i])){rows.push(cells(lines[i]));i++;}
      out.push('<table><tr>'+head.map(h=>'<th>'+inline(h)+'</th>').join('')+'</tr>'+
        rows.map(r=>'<tr>'+r.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</table>');
      continue;
    }
    // heading / rule / quote
    let m;
    if((m=L.match(/^(#{1,4})\s+(.*)$/))){out.push('<h'+m[1].length+'>'+inline(m[2])+'</h'+m[1].length+'>');i++;continue;}
    if(/^(-{3,}|\*{3,})\s*$/.test(L)){out.push('<hr/>');i++;continue;}
    if(/^>\s?/.test(L)){
      const buf=[];
      while(i<lines.length && /^>\s?/.test(lines[i])){buf.push(lines[i].replace(/^>\s?/,''));i++;}
      out.push('<blockquote>'+inline(buf.join(' '))+'</blockquote>');
      continue;
    }
    // lists
    if(/^\s*[-*+]\s+/.test(L)){
      const buf=[];
      while(i<lines.length && /^\s*[-*+]\s+/.test(lines[i])){buf.push(lines[i].replace(/^\s*[-*+]\s+/,''));i++;}
      out.push('<ul>'+buf.map(b=>'<li>'+inline(b)+'</li>').join('')+'</ul>');
      continue;
    }
    if(/^\s*\d+\.\s+/.test(L)){
      const buf=[];
      while(i<lines.length && /^\s*\d+\.\s+/.test(lines[i])){buf.push(lines[i].replace(/^\s*\d+\.\s+/,''));i++;}
      out.push('<ol>'+buf.map(b=>'<li>'+inline(b)+'</li>').join('')+'</ol>');
      continue;
    }
    // blank
    if(!L.trim()){i++;continue;}
    // paragraph
    const buf=[];
    while(i<lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\||>|\s*[-*+]\s|\s*\d+\.\s|-{3,})/.test(lines[i])){
      buf.push(lines[i]);i++;
    }
    out.push('<p>'+inline(buf.join(' '))+'</p>');
  }
  return out.join('\n');
}

/* ── release notes: stored, editable, resettable ── */
function getNotes(){
  try{
    const saved=localStorage.getItem('lngvty_notes');
    const ver=localStorage.getItem('lngvty_notes_ver');
    // If there's no saved copy, or it predates this build, show the fresh default
    // so new release entries always appear. A user who has intentionally edited
    // the notes in THIS build keeps their copy (ver matches).
    if(!saved || ver!==BUILD.version)return defaultNotes();
    return saved;
  }catch(e){return defaultNotes();}
}
function toggleNotesEdit(){
  const view=document.getElementById('notesView');
  const ed=document.getElementById('notesEdit');
  const foot=document.getElementById('notesEditFoot');
  const btn=document.getElementById('notesEditBtn');
  notesEditing=!notesEditing;
  if(notesEditing){
    ed.value=getNotes();
    view.style.display='none';ed.style.display='block';foot.style.display='flex';
    btn.innerHTML='&#128065; Preview';ed.focus();
  }else{
    view.innerHTML=renderMarkdown(ed.value);
    view.style.display='block';ed.style.display='none';foot.style.display='none';
    btn.innerHTML='&#9998; Edit';
  }
}
function cancelNotesEdit(){
  notesEditing=false;
  document.getElementById('notesView').style.display='block';
  document.getElementById('notesEdit').style.display='none';
  document.getElementById('notesEditFoot').style.display='none';
  document.getElementById('notesEditBtn').innerHTML='&#9998; Edit';
  document.getElementById('notesView').innerHTML=renderMarkdown(getNotes());
}
function saveNotesEdit(){
  const val=document.getElementById('notesEdit').value;
  try{localStorage.setItem('lngvty_notes',val);localStorage.setItem('lngvty_notes_ver',BUILD.version);}catch(e){}
  cancelNotesEdit();
  toast('Notes saved');
}
function resetNotes(){
  if(!confirm('Reset the release notes to the default?'))return;
  try{localStorage.removeItem('lngvty_notes');localStorage.removeItem('lngvty_notes_ver');}catch(e){}
  document.getElementById('notesEdit').value=defaultNotes();
  cancelNotesEdit();
  toast('Notes reset');
}
function copyVersionInfo(){
  const c=ghConfig();
  copyText(
    'LNGVTY Builder '+BUILD.version+' ('+BUILD.name+', '+BUILD.date+')\n'+
    'Repo: '+(c.owner||'?')+'/'+(c.repo||'?')+' \u00b7 folder: '+ghDir()+'/\n'+
    'Browser: '+navigator.userAgent,
    'Version info copied'
  );
}


/* ═══════════ SETTINGS SHELL ═══════════
   The settings dialog doesn't duplicate any UI. On first open it MOVES the body
   of each existing modal into its matching pane, so every input keeps its id and
   every handler keeps working — there's exactly one of each control in the DOM. */
const SET_PANES={
  theme  : {title:'Theme & Type', src:'customizeBg'},
  images : {title:'Images',       src:'imageBg'},
  export : {title:'Export',       src:null},         // authored inline
  html   : {title:'View HTML',    src:'modalBg'},
  import : {title:'Import',       src:'importBg'},
  newsec : {title:'New Section',  src:'addBg'},
  organize:{title:'Organize Sections', src:null},   // authored inline
  github : {title:'GitHub',       src:'githubBg'},
  docs   : {title:'Docs',         src:'docsBg'},
  guides : {title:'Guides',       src:null},   // authored inline
  about  : {title:'Version & Notes', src:null},   // authored inline
  feedback:{title:'Feedback',     src:null},      // authored inline
  pageformat:{title:'Page Format', src:null},   // authored inline
  backlog :{title:'Content Backlog', src:null},   // authored inline
  library :{title:'Content Library',  src:null},   // authored inline
};
let settingsHydrated=false;

function hydrateSettings(){
  if(settingsHydrated)return;
  Object.entries(SET_PANES).forEach(([key,cfg])=>{
    if(!cfg.src)return;                             // inline pane, nothing to move
    const modal=document.getElementById(cfg.src);
    const pane=document.getElementById('pane-'+key);
    if(!modal||!pane)return;
    // move the scroll body and the footer (buttons) out of the modal into the pane
    modal.querySelectorAll('.modal-scroll, .modal-foot, textarea#modalText').forEach(part=>{
      // a footer whose only job is "close" is redundant — the header has an X
      if(part.classList.contains('modal-foot')){
        const btns=[...part.querySelectorAll('button')];
        const allClose=btns.length>0 && btns.every(b=>/^close/i.test(b.getAttribute('onclick')||''));
        if(allClose)return;
      }
      pane.appendChild(part);
    });
    // docs also has an inline editor textarea + an Edit button living in its head
    if(cfg.src==='docsBg'){
      const ed=modal.querySelector('#docsEdit');
      const btn=modal.querySelector('#docsEditBtn');
      if(btn){
        const bar=document.createElement('div');
        bar.style.cssText='display:flex;justify-content:flex-end;margin-bottom:12px;';
        bar.appendChild(btn);
        pane.insertBefore(bar,pane.firstChild);
      }
      if(ed)pane.appendChild(ed);
    }
    // the now-empty modal shell stays in the DOM but is never shown
  });
  settingsHydrated=true;
}

function openSettings(pane){
  hydrateSettings();
  const c=ghConfig();
  const hint=document.getElementById('setRepoHint');
  if(hint)hint.textContent=ghReady()?(c.owner+'/'+c.repo+' · '+ghDir()+'/'):'No repo connected';
  document.getElementById('settingsBg').classList.add('show');
  setPane(pane||'theme');
}
function closeSettings(){document.getElementById('settingsBg').classList.remove('show');}

/* ═══════════ SECTION ORGANIZER (local only) ═══════════ */
let orgMode='newsletter';   // which rail mode we're organizing
let orgDragKey=null, orgDragFrom=null;
const ORG_MODES=[['graphics','Graphics'],['newsletter','Newsletter'],['blog','Webpage'],['docs','Docs']];
function renderOrganize(){
  const pane=document.getElementById('pane-organize');if(!pane)return;
  pane.innerHTML=`
    <div class="org-wrap">
      <div class="org-toolbar">
        <div class="org-modes">${ORG_MODES.map(([m,l])=>`<button class="org-mode${m===orgMode?' active':''}" onclick="orgSetMode('${m}')">${l}</button>`).join('')}</div>
        <button class="org-btn" onclick="orgAddTab()">＋ New tab</button>
        <button class="org-btn ghost" onclick="orgReset()">Reset all</button>
      </div>
      <div class="org-hint">Drag a section chip into another tab to move it, or drag a tab by its header to reorder. Use ⧉ to duplicate a section into more than one tab, and click a name to rename it. These changes are local to this browser and don't affect saved newsletters or exports.</div>
      <div id="orgTabs"></div>
    </div>`;
  orgRenderTabs();
}
function orgSetMode(m){orgMode=m;renderOrganize();}
function orgRenderTabs(){
  const host=document.getElementById('orgTabs');if(!host)return;host.innerHTML='';
  // compute tabs for the target mode (temporarily switch railMode for grouping math)
  const savedRail=railMode;railMode=orgMode;
  const sections=allSections();
  const grouped={};const order=[];
  Object.entries(sections).forEach(([k,s])=>{if(inCurrentMode(s)){const g=secGroup(s);if(!grouped[g]){grouped[g]=[];order.push(g);}grouped[g].push([k,s]);}});
  (SECTION_ORG.newTabs[orgMode]||[]).forEach(g=>{if(!grouped[g]){grouped[g]=[];order.push(g);}});
  // honor saved order first
  const savedOrder=SECTION_ORG.tabOrder[orgMode]||[];
  const tabs=[];savedOrder.forEach(g=>{if(grouped[g]&&!tabs.includes(g))tabs.push(g);});order.forEach(g=>{if(!tabs.includes(g))tabs.push(g);});
  railMode=savedRail;
  tabs.forEach(g=>{
    const list=grouped[g]||[];
    const tab=document.createElement('div');tab.className='org-tab';tab.dataset.tab=g;
    tab.setAttribute('draggable','true');
    tab.addEventListener('dragstart',e=>{if(orgDragKey)return;e.stopPropagation();orgDragTab=g;});
    tab.addEventListener('dragend',()=>{orgDragTab=null;host.querySelectorAll('.drop-tab').forEach(t=>t.classList.remove('drop-tab'));});
    tab.addEventListener('dragover',e=>{e.preventDefault();if(orgDragKey||orgDragTab)tab.classList.add('drop-tab');});
    tab.addEventListener('dragleave',()=>tab.classList.remove('drop-tab'));
    tab.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();tab.classList.remove('drop-tab');
      if(orgDragKey){orgMoveSection(orgDragKey,g);}
      else if(orgDragTab&&orgDragTab!==g){orgReorderTab(orgDragTab,g);}
    });
    const canDelTab=list.length===0;   // only empty tabs can be removed (keeps sections safe)
    tab.innerHTML=`<div class="org-tab-head">
        <span class="thandle">⠿</span>
        <input class="org-tab-name" value="${esc(tabLabel(g))}" onchange="orgRenameTab('${esc(g)}',this.value)" onclick="event.stopPropagation()"/>
        <span class="org-tab-count">${list.length}</span>
        ${canDelTab?`<button class="org-tab-del" title="Remove empty tab" onclick="orgDeleteTab('${esc(g)}')">×</button>`:''}
      </div>
      <div class="org-secs${list.length?'':' empty'}">${list.length?'':'Drop sections here'}</div>`;
    const secBox=tab.querySelector('.org-secs');
    list.forEach(([k,s])=>{
      const isDupe=!!(SECTION_ORG.dupes&&SECTION_ORG.dupes[k]);
      const chip=document.createElement('div');chip.className='org-chip'+(isDupe?' is-dupe':'');chip.dataset.key=k;
      chip.setAttribute('draggable','true');
      chip.addEventListener('dragstart',e=>{e.stopPropagation();orgDragKey=k;orgDragFrom=g;chip.classList.add('dragging');});
      chip.addEventListener('dragend',()=>{orgDragKey=null;orgDragFrom=null;chip.classList.remove('dragging');host.querySelectorAll('.drop-tab').forEach(t=>t.classList.remove('drop-tab'));});
      chip.innerHTML=`<span class="cic">${s.icon||'◧'}</span>
        <input class="cnm" value="${esc(secName(k,s))}" onchange="orgRenameSection('${k}',this.value)"/>
        <span class="cdup" title="Duplicate into another tab" onclick="orgDuplicate('${k}')">⧉</span>
        <span class="cdel" title="Remove this duplicate" onclick="orgDeleteDupe('${k}')">×</span>`;
      secBox.appendChild(chip);
    });
    host.appendChild(tab);
  });
}
let orgDragTab=null;
function orgWriteMode(key){
  // moving/duplicating within newsletter uses ngroup; other modes use group.
  return orgMode==='newsletter'?'ngroup':'group';
}
function orgMoveSection(key,toGroup){
  const s=allSections()[key];if(!s)return;
  const ov=SECTION_ORG.over[key]||{};
  // ensure the section is visible in this mode
  ov.mode = (orgMode==='newsletter') ? (s.mode==='graphics'||s.mode==='both'?'both':'newsletter') : orgMode;
  if(orgMode==='newsletter'){ov.ngroup=toGroup;}
  else {ov.group=toGroup;ov.ngroup=ov.ngroup;}
  // for dupes, update the dupe record instead
  if(SECTION_ORG.dupes[key]){
    if(orgMode==='newsletter')SECTION_ORG.dupes[key].ngroup=toGroup;else SECTION_ORG.dupes[key].group=toGroup;
    SECTION_ORG.dupes[key].mode=ov.mode;
  } else {
    SECTION_ORG.over[key]=ov;
  }
  saveOrg();orgRenderTabs();refreshRailIfVisible();toast('Moved to '+tabLabel(toGroup));
}
function orgRenameSection(key,name){
  name=(name||'').trim();if(!name)return;
  if(SECTION_ORG.dupes[key]){SECTION_ORG.dupes[key].name=name;}
  else{SECTION_ORG.over[key]=Object.assign({},SECTION_ORG.over[key],{name});}
  saveOrg();refreshRailIfVisible();
}
function orgDuplicate(key){
  const base=SECTION_ORG.dupes[key]?SECTION_ORG.dupes[key].base:key;
  const s=allSections()[key]||allSections()[base];if(!s)return;
  const dupKey='dup_'+base+'_'+Math.random().toString(36).slice(2,7);
  SECTION_ORG.dupes[dupKey]={base, name:(secName(key,s)+' copy'),
    group:(orgMode!=='newsletter')?secGroup(s):s.group,
    ngroup:(orgMode==='newsletter')?secGroup(s):undefined,
    mode:(orgMode==='newsletter')?'both':orgMode};
  saveOrg();orgRenderTabs();refreshRailIfVisible();toast('Duplicated — drag the copy where you want it');
}
function orgDeleteDupe(key){
  if(!SECTION_ORG.dupes[key])return;
  delete SECTION_ORG.dupes[key];saveOrg();orgRenderTabs();refreshRailIfVisible();toast('Duplicate removed');
}
function orgAddTab(){
  const name=prompt('Name the new tab:');if(!name||!name.trim())return;
  const g=name.trim();
  SECTION_ORG.newTabs[orgMode]=SECTION_ORG.newTabs[orgMode]||[];
  if(!SECTION_ORG.newTabs[orgMode].includes(g))SECTION_ORG.newTabs[orgMode].push(g);
  // append to order
  const ord=SECTION_ORG.tabOrder[orgMode]||orgCurrentOrder();
  if(!ord.includes(g))ord.push(g);SECTION_ORG.tabOrder[orgMode]=ord;
  saveOrg();orgRenderTabs();refreshRailIfVisible();
}
function orgDeleteTab(g){
  // only empty tabs reach here. Remove from newTabs + order + name.
  SECTION_ORG.newTabs[orgMode]=(SECTION_ORG.newTabs[orgMode]||[]).filter(x=>x!==g);
  SECTION_ORG.tabOrder[orgMode]=(SECTION_ORG.tabOrder[orgMode]||[]).filter(x=>x!==g);
  delete SECTION_ORG.tabNames[g];
  saveOrg();orgRenderTabs();refreshRailIfVisible();
}
function orgRenameTab(g,name){
  name=(name||'').trim();if(!name){orgRenderTabs();return;}
  SECTION_ORG.tabNames[g]=name;saveOrg();refreshRailIfVisible();
}
function orgCurrentOrder(){
  const savedRail=railMode;railMode=orgMode;
  const groups=[];const seen=new Set();
  Object.values(allSections()).forEach(s=>{if(inCurrentMode(s)){const g=secGroup(s);if(!seen.has(g)){seen.add(g);groups.push(g);}}});
  (SECTION_ORG.newTabs[orgMode]||[]).forEach(g=>{if(!seen.has(g)){seen.add(g);groups.push(g);}});
  railMode=savedRail;return groups;
}
function orgReorderTab(from,to){
  let ord=(SECTION_ORG.tabOrder[orgMode]&&SECTION_ORG.tabOrder[orgMode].length)?SECTION_ORG.tabOrder[orgMode].slice():orgCurrentOrder();
  ord=ord.filter(x=>x!==from);
  const idx=ord.indexOf(to);
  if(idx<0)ord.push(from);else ord.splice(idx,0,from);
  SECTION_ORG.tabOrder[orgMode]=ord;saveOrg();orgRenderTabs();refreshRailIfVisible();
}
function orgReset(){
  if(!confirm('Reset all section organization back to defaults? Your saved newsletters are not affected.'))return;
  SECTION_ORG={over:{},dupes:{},tabOrder:{},tabNames:{},newTabs:{}};saveOrg();renderOrganize();refreshRailIfVisible();toast('Organization reset');
}
function refreshRailIfVisible(){try{TABS=[];computeTabs();renderRail(document.getElementById('palSearch')?.value||'');}catch(e){}}

function setPane(key){
  if(!SET_PANES[key])key='theme';
  document.querySelectorAll('#setNav .set-item').forEach(b=>b.classList.toggle('active',b.dataset.pane===key));
  document.querySelectorAll('#setBody .set-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===key));
  document.getElementById('setTitle').textContent=SET_PANES[key].title;
  // pane-specific refreshes
  if(key==='images')loadImageLib();
  if(key==='organize')renderOrganize();
  if(key==='guides')renderGuides();
  if(key==='docs'){
    // the sidebar reaches this pane directly, so it has to fill itself
    const view=document.getElementById('docsView');
    const ed=document.getElementById('docsEdit');
    const content=getDocs();
    if(view && !docsEditing)view.innerHTML=content;
    if(ed && !docsEditing)ed.value=content;
  }
  if(key==='about'){
    document.getElementById('verBadge').textContent=BUILD.version;
    document.getElementById('verSub').textContent=BUILD.name+' \u00b7 '+BUILD.date;
    if(!notesEditing){
      const md=getNotes();
      document.getElementById('notesEdit').value=md;
      document.getElementById('notesView').innerHTML=renderMarkdown(md);
    }
  }
  if(key==='feedback'){
    const el=document.getElementById('fbVer');if(el)el.textContent=BUILD.version;
    // load the form lazily — no reason to hit Google until the pane is opened
    const f=document.getElementById('fbFrame');
    if(f && f.getAttribute('src')==='about:blank')f.setAttribute('src',f.dataset.src);
  }
  if(key==='backlog'){
    // load the sheet lazily — same reasoning as the feedback form
    const b=document.getElementById('blFrame');
    if(b && b.getAttribute('src')==='about:blank')b.setAttribute('src',b.dataset.src);
  }
  if(key==='library'){libInitPane();}
  if(key==='pageformat'){renderPagePresets();}
  if(key==='html'){const t=document.getElementById('modalText');if(t){t.value=buildExport();t.readOnly=true;}
    const b=document.getElementById('modalEditBtn');if(b)b.innerHTML='&#9998; Edit';}
  if(key==='github'){const c=ghConfig();
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v||'';};
    set('ghOwner',c.owner);set('ghRepo',c.repo);set('ghDir',c.dir||'saved');set('ghBranch',c.branch);set('ghToken',c.token);}
}
document.addEventListener('click',e=>{
  const item=e.target.closest('#setNav .set-item');
  if(item)setPane(item.dataset.pane);
});

/* The old entry points now route into the settings dialog, so any existing
   button, doc link, or keyboard path lands on the right pane. */
function openCustomize(){openSettings('theme');}
function closeCustomize(){closeSettings();}
function openDocsPane(){openSettings('docs');}

/* ═══════════ VIDEO GUIDES ═══════════
   Screen-recorded walkthroughs stored in the repo's /videos folder and served
   from GitHub Pages. GUIDES lists each video (filename + title + blurb); a new
   entry is added whenever a walkthrough is recorded. Filenames are provided
   after this release — until then the list shows a friendly placeholder. */
const GUIDES=[
  // Example shape (uncomment & fill once videos exist):
  // {file:'build-a-newsletter.mp4', title:'Build a newsletter, start to finish', blurb:'The full weekly workflow from Start a Newsletter to Copy HTML.', version:'v22.0'},
];
function ghPagesBase(){const c=ghConfig();if(!c.owner||!c.repo)return '';return `https://${c.owner}.github.io/${c.repo}`;}
function ghVideoDir(){const c=ghConfig();return (c.videodir||'videos').replace(/^\/+|\/+$/g,'')||'videos';}
function renderGuides(){
  const pane=document.getElementById('pane-guides');if(!pane)return;
  const base=ghPagesBase();
  let cards='';
  if(GUIDES.length){
    cards=GUIDES.map(g=>{
      const src=(base?base+'/':'')+ghVideoDir()+'/'+g.file;
      return `<div style="border:1px solid #e6e6ea;border-radius:10px;overflow:hidden;background:#fff;margin-bottom:16px;">
        <video controls preload="metadata" style="display:block;width:100%;background:#000;max-height:420px;">
          <source src="${esc(src)}" type="video/mp4"/>
          Your browser can't play this video. <a href="${esc(src)}" target="_blank" rel="noopener">Open it directly</a>.
        </video>
        <div style="padding:12px 14px;">
          <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;color:#1a1a1a;">${esc(g.title)}${g.version?` <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#fff;background:var(--accent);padding:1px 7px;border-radius:4px;margin-left:6px;">${esc(g.version)}</span>`:''}</div>
          ${g.blurb?`<div style="font-size:13px;color:#777;margin-top:4px;line-height:1.5;">${esc(g.blurb)}</div>`:''}
        </div>
      </div>`;
    }).join('');
  } else {
    cards=`<div style="border:1px dashed #d5d5da;border-radius:10px;padding:34px 20px;text-align:center;color:#999;background:#fafafa;">
      <div style="font-size:34px;margin-bottom:8px;">🎬</div>
      <div style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;color:#666;margin-bottom:6px;">Video guides are coming soon</div>
      <div style="font-size:13px;line-height:1.6;max-width:44ch;margin:0 auto;">Screen-recorded walkthroughs will appear here &mdash; a full newsletter build, plus a short clip for each significant update. They'll be stored in the repo's <code>/videos</code> folder and play right in this panel.</div>
    </div>`;
  }
  pane.innerHTML=`<div class="docs-body">
    <div class="tocard"><b>&#127909; Video Guides</b><br>Watch instead of read. Each walkthrough plays right here. New clips are added whenever there's a significant update. Prefer written steps? See the <button onclick="setPane('docs')" style="background:none;border:none;color:var(--accent);font-weight:700;cursor:pointer;padding:0;font-size:inherit;text-decoration:underline;">Docs</button> tab.</div>
    ${cards}
  </div>`;
}

/* typography — applied as document-level CSS vars that sections inherit */
function setFont(which,val){
  document.documentElement.style.setProperty(which==='heading'?'--font-heading':'--font-body',val);
  // sections hardcode their font stacks, so also sweep the canvas
  const sel=which==='heading'
    ? "[style*=\"Montserrat\"]"
    : "[style*=\"Open Sans\"]";
  frame.querySelectorAll(sel).forEach(el=>{
    const st=el.getAttribute('style')||'';
    el.setAttribute('style', st.replace(/font-family:[^;]+;?/g, 'font-family:'+val+';'));
  });
  saveStateLocal();
  document.getElementById('czStatus').textContent=(which==='heading'?'Heading':'Body')+' font updated';
}
function setBodySize(px){
  frame.querySelectorAll('.sec [contenteditable]').forEach(el=>{
    const st=el.getAttribute('style')||'';
    // only touch body-scale text (leave headings/labels/badges alone)
    const m=st.match(/font-size:\s*(\d+)px/);
    if(m && +m[1]>=12 && +m[1]<=16){
      el.setAttribute('style', st.replace(/font-size:\s*\d+px/, 'font-size:'+px));
    }
  });
  saveStateLocal();
  document.getElementById('czStatus').textContent='Body size set to '+px;
}
function setLineHeight(lh){
  frame.querySelectorAll('.sec [contenteditable]').forEach(el=>{
    const st=el.getAttribute('style')||'';
    if(/line-height:/.test(st)) el.setAttribute('style', st.replace(/line-height:[^;]+/, 'line-height:'+lh));
  });
  saveStateLocal();
  document.getElementById('czStatus').textContent='Line height set to '+lh;
}

/* Strip pasted formatting: text pasted from Word/Docs/the web drags in its own
   font-family, font-size, and color as inline styles or <span>/<font> wrappers.
   This removes those so every text box snaps back to the section's own styling,
   leaving the words untouched. */
function normalizeAllText(){
  let cleaned=0;
  frame.querySelectorAll('.sec [contenteditable]').forEach(el=>{
    // 1) unwrap junk inline wrappers, keeping their text
    el.querySelectorAll('span,font,b,i,u,em,strong').forEach(w=>{
      // keep intentional formatting tags, but drop their foreign styling
      w.removeAttribute('style');w.removeAttribute('color');w.removeAttribute('face');w.removeAttribute('size');
      w.removeAttribute('class');
      if(w.tagName==='SPAN'||w.tagName==='FONT'){
        // a bare span/font with no attributes carries no meaning — unwrap it
        if(!w.attributes.length){while(w.firstChild)w.parentNode.insertBefore(w.firstChild,w);w.remove();}
      }
    });
    // 2) drop foreign font/size/color from the box's own style, keep layout props
    const st=el.getAttribute('style')||'';
    if(/font-family|font-size|color|background/i.test(st)) cleaned++;
    // note: we intentionally do NOT wipe the section's own inline style here —
    // that IS the brand styling. We only removed the pasted children's overrides.
  });
  saveStateLocal();
  toast('\u2713 Text reset to brand styling');
  document.getElementById('czStatus').textContent='Cleaned '+cleaned+' text box(es)';
}

/* ═══════════ IMAGE LIBRARY (repo /images folder) ═══════════ */
let IMAGE_CACHE=[];
let imagePickTarget=null;   // set when the picker is opened from a section

function ghImageDir(){const c=ghConfig();return (c.imagedir||'images').replace(/^\/+|\/+$/g,'')||'images';}
/* public URL of a file in the images folder, served by GitHub Pages */
function imagePublicURL(name){
  const c=ghConfig();
  return `https://${c.owner}.github.io/${c.repo}/${ghImageDir()}/${name}`;
}
async function ghListImages(){
  if(!ghReady())throw new Error('GitHub not configured');
  const res=await fetch(ghContentsURL(ghImageDir()),{headers:ghHeaders(),cache:'no-store'});
  if(res.status===404)return [];
  if(!res.ok)throw new Error('Image list failed ('+res.status+')');
  const arr=await res.json();
  return (Array.isArray(arr)?arr:[]).filter(f=>f.type==='file'&&/\.(png|jpe?g|gif|webp|svg)$/i.test(f.name))
    .map(f=>({name:f.name,path:f.path,sha:f.sha,url:imagePublicURL(f.name)}));
}
async function ghPutImage(name,base64){
  const c=ghConfig();
  if(!c.token)throw new Error('A GitHub token is required to upload.');
  const path=`${ghImageDir()}/${name}`;
  const body={message:`builder: add image ${name}`,content:base64};
  if(c.branch)body.branch=c.branch;
  const existing=await ghGetSha(path);
  if(existing)body.sha=existing;
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`,{
    method:'PUT',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)
  });
  if(!res.ok){let m='';try{m=(await res.json()).message||'';}catch(e){}throw new Error('Upload failed ('+res.status+') '+m);}
  return await res.json();
}

/* ── HTML LOGOS: same idea as images, but each file is a snippet of HTML stored
   in the repo's /logos folder. Because they're inlined as real HTML on insert,
   they survive Gmail's image stripping (there's no <img> to strip). ── */
function ghLogoDir(){const c=ghConfig();return (c.logodir||'logos').replace(/^\/+|\/+$/g,'')||'logos';}
async function ghListLogos(){
  if(!ghReady())throw new Error('GitHub not configured');
  const res=await fetch(ghContentsURL(ghLogoDir()),{headers:ghHeaders(),cache:'no-store'});
  if(res.status===404)return [];
  if(!res.ok)throw new Error('Logo list failed ('+res.status+')');
  const arr=await res.json();
  return (Array.isArray(arr)?arr:[]).filter(f=>f.type==='file'&&/\.html?$/i.test(f.name))
    .map(f=>({name:f.name,path:f.path,sha:f.sha,download_url:f.download_url}));
}
async function ghLoadLogo(file){
  const url=file.download_url||ghContentsURL(file.path);
  const res=await fetch(url,{headers:file.download_url?{}:ghHeaders(),cache:'no-store'});
  if(!res.ok)throw new Error('Logo load failed ('+res.status+')');
  return await res.text();
}
async function ghPutLogo(name,htmlText){
  const c=ghConfig();
  if(!c.token)throw new Error('A GitHub token is required to save.');
  if(!/\.html?$/i.test(name))name+='.html';
  const path=`${ghLogoDir()}/${name}`;
  const body={message:`builder: add logo ${name}`,content:b64encode(htmlText)};
  if(c.branch)body.branch=c.branch;
  const existing=await ghGetSha(path);
  if(existing)body.sha=existing;
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`,{
    method:'PUT',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)
  });
  if(!res.ok){let m='';try{m=(await res.json()).message||'';}catch(e){}throw new Error('Logo save failed ('+res.status+') '+m);}
  return await res.json();
}
async function ghDeleteLogo(path,sha){
  const c=ghConfig();if(!c.token)throw new Error('A GitHub token is required to delete.');
  if(!sha)sha=await ghGetSha(path);
  const body={message:`builder: delete ${path}`,sha};if(c.branch)body.branch=c.branch;
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`,{
    method:'DELETE',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)});
  if(!res.ok){let m='';try{m=(await res.json()).message||'';}catch(e){}throw new Error('Delete failed ('+res.status+') '+m);}
  return await res.json();
}

/* Build export-style HTML from a saved newsletter object WITHOUT touching the
   canvas — used for saved-item thumbnails and previews so you can look at a
   newsletter without loading it over your current work. */
function renderSavedHTML(nl){
  const stash=frame.innerHTML;                 // keep the live canvas intact
  const stashEmbeds=BG_EMBEDS;                  // and the live embeds
  const stashVars={};
  Object.values(THEME_VARMAP).forEach(cv=>{stashVars[cv]=document.documentElement.style.getPropertyValue(cv);});
  let html='';
  try{
    applyThemeVars(nl.theme);
    BG_EMBEDS=Array.isArray(nl.embeds)?nl.embeds:[];
    loadSections(nl.sections||[]);
    html=buildExport();
  } finally {
    frame.innerHTML=stash;                     // always restore, even on error
    BG_EMBEDS=stashEmbeds;
    Object.entries(stashVars).forEach(([cv,v])=>{
      if(v)document.documentElement.style.setProperty(cv,v);
      else document.documentElement.style.removeProperty(cv);
    });
    frame.querySelectorAll('.sec').forEach(wireSec);
    refreshState();
  }
  return html;
}

/* small scaled-down snippet of the top of a saved newsletter */
async function renderSavedThumb(it,host){
  if(!host)return;
  try{
    const file=it.file||{path:`${ghDir()}/${(it.id||slugify(it.name))}.json`};
    const nl=await ghLoadFile(file);
    const html=renderSavedHTML(nl);
    host.innerHTML='';
    const ifr=document.createElement('iframe');
    // render at full width, then scale down so it reads as a thumbnail
    ifr.style.cssText='width:620px;height:800px;border:0;transform:scale(0.24);transform-origin:top left;pointer-events:none;position:absolute;top:0;left:50%;margin-left:-74px;';
    ifr.setAttribute('scrolling','no');
    host.appendChild(ifr);
    ifr.srcdoc=html;
  }catch(e){
    host.innerHTML='<span style="font-size:10px;color:#c66;">Preview unavailable</span>';
  }
}

/* full preview of a saved newsletter, without loading it into the canvas */
async function previewSavedItem(it){
  if(!ghReady()){toast('Connect a GitHub repo first (⚙ GitHub).');return;}
  const file=it.file||{path:`${ghDir()}/${(it.id||slugify(it.name))}.json`};
  const nl=await ghLoadFile(file);
  const html=renderSavedHTML(nl);
  const iframe=document.getElementById('previewIframe');
  iframe.srcdoc=html;
  document.getElementById('pvTitle').innerHTML='&#128065; '+esc(nl.name||it.name||'Preview');
  previewDesktop();
  document.getElementById('previewBg').classList.add('show');
}

function openImageLib(target){
  imagePickTarget=target||null;
  openSettings('images');
  // always land on the Images sub-tab; the logos tab is opt-in
  const it=document.getElementById('imgtab-images');if(it)imgLibTab('images');
}
function closeImageLib(){closeSettings();imagePickTarget=null;}

/* fetch the repo's images/ folder and render it as a thumbnail grid */
async function loadImageLib(){
  const grid=document.getElementById('imgGrid');
  const status=document.getElementById('imgStatus');
  if(!grid||!status)return;
  if(!ghReady()){status.textContent='Connect GitHub first.';grid.innerHTML='';return;}
  status.textContent='Loading…';grid.innerHTML='';
  try{
    IMAGE_CACHE=await ghListImages();
    if(!IMAGE_CACHE.length){
      status.textContent='';
      grid.innerHTML='<div style="grid-column:1/-1;color:#9b9ca3;font-size:12px;padding:28px;text-align:center;">No images yet. Upload one to get started.</div>';
      return;
    }
    IMAGE_CACHE.forEach(im=>{
      const card=document.createElement('div');
      card.className='img-card';
      card.title='Use this image';
      card.innerHTML=`<img src="${esc(im.url)}" alt="${esc(im.name)}" loading="lazy"/><div class="nm">${esc(im.name)}</div>`;
      card.onclick=()=>pickImage(im);
      grid.appendChild(card);
    });
    status.textContent=IMAGE_CACHE.length+' image'+(IMAGE_CACHE.length===1?'':'s');
  }catch(e){
    status.textContent='Could not load: '+(e.message||e);
  }
}

/* click an image: either drop it into the target that opened the picker,
   or copy its URL if the library was opened standalone from the toolbar */
function pickImage(im){
  if(imagePickTarget && typeof imagePickTarget==='function'){
    imagePickTarget(im.url,im.name);
    closeImageLib();
    return;
  }
  copyText(im.url,'Image URL copied');
}

/* ─── ADD IMAGE BY URL ───
   The repo library only lists images that were uploaded to /images. This lets
   any public image URL be dropped into the same target the picker opened for,
   without an upload (and works even with no GitHub repo connected). The URL row
   reveals inline instead of using a prompt() so it survives headless/embedded
   browsers that silently cancel prompt(). */
function addImageByUrl(){
  const row=document.getElementById('imgUrlRow');
  const inp=document.getElementById('imgUrlInput');
  if(!row||!inp)return;
  row.style.display='flex';
  inp.value='';
  inp.focus();
}
function hideImageUrlRow(){
  const row=document.getElementById('imgUrlRow');
  if(row)row.style.display='none';
}
function confirmImageUrl(){
  const inp=document.getElementById('imgUrlInput');
  if(!inp)return;
  let url=inp.value.trim();
  if(!url){toast('Paste an image URL first');inp.focus();return;}
  // tolerate a pasted "http://" and bare protocol-less links
  if(/^\/\//.test(url))url='https:'+url;
  const name=(url.split('/').pop()||'image').split('?')[0]||'image';
  hideImageUrlRow();
  if(imagePickTarget && typeof imagePickTarget==='function'){
    imagePickTarget(url,name);
    closeImageLib();
  }else{
    copyText(url,'Image URL copied');
  }
}

async function uploadImage(){
  if(!ghReady()){toast('Connect GitHub first');openGithubSettings();return;}
  const fi=document.createElement('input');fi.type='file';fi.accept='image/*';
  fi.onchange=async()=>{
    const f=fi.files[0];if(!f)return;
    const status=document.getElementById('imgStatus');
    const name=f.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
    status.textContent='Uploading '+name+'…';
    try{
      const b64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>res(String(r.result).split(',')[1]);
        r.onerror=()=>rej(new Error('read failed'));
        r.readAsDataURL(f);
      });
      await ghPutImage(name,b64);
      status.textContent='\u2713 Uploaded '+name;
      toast('\u2713 Image uploaded');
      setTimeout(loadImageLib,600);   // give GitHub Pages a moment
    }catch(e){
      status.textContent='Upload failed: '+(e.message||e);
    }
  };
  fi.click();
}

/* ═══════════ HTML LOGOS (Images tab → HTML Logos) ═══════════ */
let LOGO_CACHE=[];
function imgLibTab(which){
  const onImages=which==='images';
  document.getElementById('imgSubImages').style.display=onImages?'':'none';
  document.getElementById('imgSubLogos').style.display=onImages?'none':'';
  document.getElementById('imgtab-images').classList.toggle('active',onImages);
  document.getElementById('imgtab-logos').classList.toggle('active',!onImages);
  hideImageUrlRow();
  if(!onImages)loadLogoLib();
}
function logoLivePreview(){
  const code=document.getElementById('logoCode').value;
  const host=document.getElementById('logoPreview');
  if(!code.trim()){host.innerHTML='<span style="color:#bbb;font-size:11px;">Preview appears here</span>';return;}
  host.innerHTML=code;   // render exactly as it will be inserted
}
async function saveLogo(){
  if(!ghReady()){toast('Connect GitHub first');openGithubSettings();return;}
  const code=document.getElementById('logoCode').value.trim();
  const nameRaw=document.getElementById('logoName').value.trim();
  const st=document.getElementById('logoSaveStatus');
  if(!code){st.style.color='#c0392b';st.textContent='Paste some HTML first.';return;}
  if(!nameRaw){st.style.color='#c0392b';st.textContent='Give the logo a name.';return;}
  let name=nameRaw.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  if(!/\.html?$/i.test(name))name+='.html';
  st.style.color='#999';st.textContent='Saving '+name+'…';
  try{
    await ghPutLogo(name,code);
    st.style.color='#3f7d4f';st.textContent='\u2713 Saved '+name;
    toast('\u2713 Logo saved');
    document.getElementById('logoName').value='';
    setTimeout(loadLogoLib,500);
  }catch(e){st.style.color='#c0392b';st.textContent='Save failed: '+(e.message||e);}
}
async function loadLogoLib(){
  const grid=document.getElementById('logoGrid');const status=document.getElementById('logoStatus');
  if(!grid||!status)return;
  if(!ghReady()){status.textContent='Connect GitHub first.';grid.innerHTML='';return;}
  status.textContent='Loading…';grid.innerHTML='';
  try{
    const files=await ghListLogos();
    if(!files.length){status.textContent='';grid.innerHTML='<div style="grid-column:1/-1;color:#9b9ca3;font-size:12px;padding:28px;text-align:center;">No logos yet. Paste some HTML above and save one.</div>';return;}
    // load each file's HTML so we can render a real preview
    LOGO_CACHE=[];
    for(const f of files){
      let html='';try{html=await ghLoadLogo(f);}catch(e){html='';}
      LOGO_CACHE.push({name:f.name,path:f.path,sha:f.sha,html});
    }
    grid.innerHTML='';
    LOGO_CACHE.forEach(lg=>{
      const card=document.createElement('div');card.className='logo-card';card.title='Insert this logo';
      const label=lg.name.replace(/\.html?$/i,'');
      card.innerHTML=`<div class="lg-frame">${lg.html||'<span style=\"color:#bbb;font-size:10px;\">(empty)</span>'}</div><div class="nm">${esc(label)}</div><button class="lg-del" title="Delete logo" onclick="event.stopPropagation();deleteLogo('${esc(lg.path)}','${esc(lg.sha)}')">×</button>`;
      card.onclick=()=>pickLogo(lg);
      grid.appendChild(card);
    });
    status.textContent=LOGO_CACHE.length+' logo'+(LOGO_CACHE.length===1?'':'s');
  }catch(e){status.textContent='Could not load: '+(e.message||e);}
}
async function deleteLogo(path,sha){
  if(!confirm('Delete this logo from GitHub?'))return;
  try{await ghDeleteLogo(path,sha);toast('Logo deleted');setTimeout(loadLogoLib,400);}
  catch(e){toast('Delete failed: '+(e.message||e));}
}
/* Insert a logo as REAL HTML. If an image slot opened the picker we drop the
   logo into that slot's container (replacing the <img>); otherwise we add a
   standalone centered logo block to the canvas. Either way it's inline HTML,
   so Gmail can't strip it. */
function pickLogo(lg){
  if(imagePickTarget && typeof imagePickTarget==='function'){
    // a photo slot opened the picker — hand it the logo HTML so it goes into
    // that slot (product/recipe/member photo) as inline, Gmail-safe markup.
    imagePickTarget(null, lg.name.replace(/\.html?$/i,''), lg.html);
    closeImageLib();
    return;
  }
  // opened standalone — drop a centered logo block onto the canvas
  insertLogoBlock(lg.html);
  closeImageLib();
}
function insertLogoBlock(html){
  const sec=document.createElement('div');sec.className='sec';sec.dataset.key='logo-block';
  sec.innerHTML=`<div style="background:var(--secbg);padding:24px 20px;text-align:center;">
    <div class="logo-embed" style="display:inline-block;">${html}</div>
  </div>`+controlsHTML();
  const tag=sec.querySelector('.sec-tag');if(tag)tag.textContent='Logo';
  // insert after the currently-selected section if any, else append
  const sel=frame.querySelector('.sec.selected');
  if(sel&&sel.parentNode)sel.after(sec);else frame.appendChild(sec);
  applySecTheme(sec,'white');wireSec(sec);refreshState();saveStateLocal();
  sec.scrollIntoView({behavior:'smooth',block:'center'});
  toast('\u2713 Logo added');
}

const PRESETS=['#e05a1b','#1e88e5','#43a047','#8e24aa','#e53935','#fb8c00','#00897b','#5e35b1','#d81b60','#00acc1'];
const presetWrap=document.getElementById('presets');
PRESETS.forEach(c=>{const s=document.createElement('div');s.className='swatch';s.style.background=c;s.title=c;s.onclick=()=>{document.getElementById('col-accent').value=c;setVar('accent',c);};presetWrap.appendChild(s);});

/* ═══════════ EXPORT ═══════════ */
function currentVars(){const cs=getComputedStyle(document.documentElement);const v={};Object.entries(THEME_VARMAP).forEach(([k,cssvar])=>{v[cssvar]=cs.getPropertyValue(cssvar).trim()||THEME_DEFAULT[k];});return v;}
function buildExport(){
  const clone=frame.cloneNode(true);
  // strip builder-only chrome
  clone.querySelectorAll('.li-ctrls,.drop-line').forEach(e=>e.remove());
  clone.querySelectorAll('.sched-lctrls').forEach(td=>td.remove());
  clone.querySelectorAll('.sec-controls,.sec-tag,.li-del,.li-add,.li-move,.li-drag,.tag-add,.stat-add,.sched-addsub,.sched-cal,.link-edit,.embed-edit-btn,.media-edit-btn,.nl-flip,.tl-toggle,.btn-del,.nl-pic-btn,.nl-pictoggle,.nl-steptoggle,.nl-rpic-btn,.nl-rpictoggle,.nl-ppic-btn,.nl-pptoggle,.fill-bar,.doc-hue,.doc-extra,.doc-extra-btns').forEach(e=>e.remove());
  const hint=clone.querySelector('#emptyHint');if(hint)hint.remove();

  // bake per-section theme vars onto each section so export is self-contained
  const liveSecs=frame.querySelectorAll('.sec');
  const cloneSecs=clone.querySelectorAll('.sec');
  cloneSecs.forEach((cs,i)=>{
    const live=liveSecs[i];
    if(live){
      const theme=live.dataset.theme||'white';
      const vars=SEC_THEMES[theme]||SEC_THEMES.white;
      let extra=Object.entries(vars).map(([k,v])=>`${k}:${v}`).join(';');
      // a per-section color override must win over the global accent
      const acc=(live.style.getPropertyValue('--accent')||'').trim();
      if(acc)extra+=';--accent:'+acc;
      cs.setAttribute('style',((cs.getAttribute('style')||'')+';'+extra).replace(/^;/,''));
    }
  });

  // embeds: replace host preview content with the raw embed code
  clone.querySelectorAll('.embed-host').forEach(h=>{
    const code=h.dataset.embed||'';
    h.removeAttribute('class');h.removeAttribute('data-embed');
    h.innerHTML=code;
  });
  // media: ensure source src is set and remove empty placeholders / builder classes
  clone.querySelectorAll('.media-host').forEach(h=>{
    const url=h.dataset.src||'';
    const el=h.querySelector('.media-el');
    const empty=h.querySelector('.media-empty');
    if(empty)empty.remove();
    if(el){
      if(el.tagName==='IMG'){el.setAttribute('src',url);el.style.display=url?'block':'none';}
      else{const src=el.querySelector('source');if(src)src.setAttribute('src',url);el.style.display=url?'block':'none';}
      el.classList.remove('media-el');if(!el.getAttribute('class'))el.removeAttribute('class');
    }
    h.removeAttribute('class');h.removeAttribute('data-media-kind');h.removeAttribute('data-src');
  });

  // editable links -> clean anchors with correct href
  clone.querySelectorAll('.editable-link').forEach(w=>{
    const href=w.dataset.href||'#';
    const a=w.querySelector('a');
    if(a){a.setAttribute('href',href);}
    w.removeAttribute('class');w.removeAttribute('data-href');
    // unwrap: keep the span but it's harmless; leave as inline-block span wrapper
  });

  // tags & event-time chips: remove entirely if empty (no stray orange box)
  clone.querySelectorAll('.tag-pill').forEach(p=>{
    const ed=p.querySelector('[contenteditable]');
    if(!ed || ed.textContent.trim().length===0){p.remove();return;}
  });
  clone.querySelectorAll('.evt-time').forEach(t=>{
    if(t.textContent.trim().length===0){t.remove();return;}
    // bake the chip styling inline so it survives without the builder stylesheet
    const base="display:inline-block;background:rgba(224,90,27,.18);color:var(--accent);font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:.5px;padding:3px 10px;border-radius:4px;";
    t.setAttribute('style',base+(t.getAttribute('style')||''));
    t.classList.remove('evt-time');if(!t.getAttribute('class'))t.removeAttribute('class');
  });

  // contenteditable cleanup — drop ghost text only when truly empty.
  // EXCEPTION: small fixed-size styled badges (numbered step circles, timeline
  // dots) carry their number in the placeholder. Blanking those leaves an empty
  // colored circle with no number, so for these we bake the placeholder text in.
  clone.querySelectorAll('[contenteditable]').forEach(e=>{
    const isEmpty=e.textContent.trim().length===0 && !e.querySelector('img,iframe,video,audio');
    if(isEmpty){
      const st=e.getAttribute('style')||'';
      const ph=(e.getAttribute('data-ph')||'').trim();
      // Decide whether the placeholder is a *meaningful default* that should stay
      // visible (step numbers, dots, ordinals) vs a *fill-me-in prompt* (e.g.
      // "Event Name", "Short description.") that must NOT leak into the email.
      //   - styled badge: small fixed-size box with a background that flex-centres
      //     a short token (a numbered step circle/chip or a timeline dot)
      const fixedW=/\bwidth:\s*\d+px/.test(st), fixedH=/\bheight:\s*\d+px/.test(st);
      const centred=/display:\s*flex/.test(st) || /border-radius:\s*50%/.test(st) || /text-align:\s*center/.test(st);
      const isBadge=ph.length>0 && ph.length<=4 && fixedW && fixedH && centred && /background:/.test(st);
      //   - ordinal token: a numbering placeholder such as "1", "01", "N", "0X",
      //     "Day X", or a lone symbol/emoji — no prose words. These are real
      //     defaults for ordered lists, so keep them.
      const isOrdinalToken=ph.length>0 && ph.length<=4
        && /^(?:\d{1,3}|[0-9]?[xXnN]|[•▪◦‣·✓✔→➜»–-]|[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}])$/u.test(ph);
      e.innerHTML = (isBadge||isOrdinalToken) ? ph : '';
    }
    e.removeAttribute('contenteditable');e.removeAttribute('data-ph');e.classList.remove('is-empty');
    if(!e.getAttribute('class'))e.removeAttribute('class');
  });
  clone.querySelectorAll('.li-list').forEach(e=>{e.classList.remove('li-list');e.removeAttribute('data-proto');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.li-wrap').forEach(e=>{e.classList.remove('li-wrap');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.nl-it-row,.nl-it-pane').forEach(e=>{e.classList.remove('nl-it-row');e.classList.remove('nl-it-pane');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.tag-wrap').forEach(e=>{e.classList.remove('tag-wrap');e.removeAttribute('data-proto');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.tag-pill').forEach(e=>{e.classList.remove('tag-pill');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.stat-row').forEach(e=>{e.classList.remove('stat-row');e.removeAttribute('data-proto');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.stat-cell').forEach(e=>{e.classList.remove('stat-cell');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.sched-sub').forEach(e=>{e.classList.remove('sched-sub');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.sched-subs').forEach(e=>{e.classList.remove('sched-subs');if(!e.getAttribute('class'))e.removeAttribute('class');});
  clone.querySelectorAll('.tl-dot').forEach(e=>{e.classList.remove('tl-dot');e.removeAttribute('data-done');if(!e.getAttribute('class'))e.removeAttribute('class');});
  // newsletter: drop hidden member-pic hosts; clean shown ones
  clone.querySelectorAll('.nl-pic').forEach(p=>{
    const shown=p.style.display!=='none' && (p.dataset.src||'');
    if(!shown){p.remove();return;}
    p.removeAttribute('class');p.removeAttribute('data-media-kind');p.removeAttribute('data-src');
    const img=p.querySelector('.nl-pic-img');if(img){img.classList.remove('nl-pic-img');if(!img.getAttribute('class'))img.removeAttribute('class');}
  });
  // newsletter: drop recipe steps block if it was toggled off
  clone.querySelectorAll('.nl-steps').forEach(s=>{
    if(s.dataset.on!=='1'){s.remove();return;}
    s.classList.remove('nl-steps');s.removeAttribute('data-on');s.style.display='';if(!s.getAttribute('class'))s.removeAttribute('class');
  });
  // investigation: a printed/emailed suspect card can't flip, so emit the front
  // face and drop the hidden back; the verdict becomes plain text.
  clone.querySelectorAll('.sus-card').forEach(c=>{
    const back=c.querySelector('.sus-back');
    const front=c.querySelector('.sus-front');
    const fb=c.querySelector('.sus-flip');if(fb)fb.remove();
    const flipped=c.dataset.flipped==='1';
    // keep whichever face the operator left showing
    if(flipped){ if(front)front.remove(); if(back)back.style.display='block'; }
    else { if(back)back.remove(); if(front)front.style.display='block'; }
    const v=c.querySelector('.sus-verdict');
    if(v){
      const span=document.createElement('div');
      span.setAttribute('style',(v.getAttribute('style')||'')+';cursor:default;');
      span.textContent=v.textContent;
      v.parentNode.replaceChild(span,v);
    }
    c.removeAttribute('data-flipped');c.removeAttribute('onclick');
    c.classList.remove('sus-card');
    if(!c.getAttribute('class'))c.removeAttribute('class');
    c.querySelectorAll('.sus-front,.sus-back').forEach(f=>{
      f.classList.remove('sus-front');f.classList.remove('sus-back');
      if(!f.getAttribute('class'))f.removeAttribute('class');
    });
  });
  // standalone suspect verdict (Suspect File single section) -> freeze to plain text
  clone.querySelectorAll('.sus-verdict').forEach(v=>{
    const span=document.createElement('div');
    span.setAttribute('style',(v.getAttribute('style')||'')+';cursor:default;');
    span.textContent=v.textContent;
    v.parentNode.replaceChild(span,v);
  });

  // investigation: evidence boxes — freeze current fill, drop the click affordance
  clone.querySelectorAll('.ev-box').forEach(b=>{
    b.removeAttribute('onclick');b.removeAttribute('data-filled');b.removeAttribute('title');
    b.style.cursor='';
    b.classList.remove('ev-box');
    if(!b.getAttribute('class'))b.removeAttribute('class');
  });

  // documentation: drop optional example boxes / badge rows that were never turned on
  clone.querySelectorAll('.doc-ex,.doc-badges').forEach(b=>{
    if(b.dataset.on!=='1'){b.remove();return;}
    b.classList.remove('doc-ex');b.classList.remove('doc-badges');
    b.removeAttribute('data-on');b.style.display='';
    if(!b.getAttribute('class'))b.removeAttribute('class');
  });
  // newsletter: drop the recipe photo if toggled off or no image was chosen
  clone.querySelectorAll('.nl-rpic').forEach(p=>{
    const hasLogo=p.dataset.logo==='1' && p.querySelector('.logo-slot');
    const shown=hasLogo || (p.dataset.on==='1' && (p.dataset.src||''));
    if(!shown){p.remove();return;}
    p.removeAttribute('class');p.removeAttribute('data-on');p.removeAttribute('data-src');p.removeAttribute('data-logo');p.style.display='';
    if(hasLogo){const im=p.querySelector('.nl-rpic-img');if(im)im.remove();const sl=p.querySelector('.logo-slot');if(sl)sl.removeAttribute('class');}
    else{const img=p.querySelector('.nl-rpic-img');if(img){img.classList.remove('nl-rpic-img');if(!img.getAttribute('class'))img.removeAttribute('class');}}
  });
  // featured product photo — same rule as the recipe photo
  clone.querySelectorAll('.nl-ppic').forEach(p=>{
    const hasLogo=p.dataset.logo==='1' && p.querySelector('.logo-slot');
    const shown=hasLogo || (p.dataset.on==='1' && (p.dataset.src||''));
    if(!shown){p.remove();return;}
    p.removeAttribute('class');p.removeAttribute('data-on');p.removeAttribute('data-src');p.removeAttribute('data-logo');p.style.display='';
    if(hasLogo){const im=p.querySelector('.nl-ppic-img');if(im)im.remove();const sl=p.querySelector('.logo-slot');if(sl)sl.removeAttribute('class');}
    else{const img=p.querySelector('.nl-ppic-img');if(img){img.classList.remove('nl-ppic-img');if(!img.getAttribute('class'))img.removeAttribute('class');}}
  });
  clone.querySelectorAll('.nl-prod').forEach(p=>{p.classList.remove('nl-prod');if(!p.getAttribute('class'))p.removeAttribute('class');});
  clone.querySelectorAll('.sec').forEach(s=>{
    const key=s.dataset.key||'';const theme=s.dataset.theme||'';
    s.removeAttribute('class');s.removeAttribute('draggable');s.removeAttribute('data-key');s.removeAttribute('data-theme');s.style.opacity='';
    // stamp section identity into the exported HTML as metadata (data-sec).
    // Not used for re-import anymore (newsletters round-trip via JSON), but it
    // documents each block’s type and is harmless in email clients.
    if(key){s.setAttribute('data-sec',key);}
    if(theme){s.setAttribute('data-sectheme',theme);}
  });

  const v=currentVars();

  // ── WEBPAGE MODE: full-width browser HTML (flex is fine; resolve vars to hex for portability) ──
  if(builderMode==='webpage'){
    resolveVarsOnly(clone, v);
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LNGVTY Hub</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:#ffffff;font-family:'Open Sans',Arial,sans-serif;color:${v['--body-text']};line-height:1.6;}
  img{max-width:100%;display:block;}
  a{text-decoration:none;}
  .lngvty-page{width:100%;margin:0 auto;background:#fff;}
  .dropcap::first-letter{font-family:'Montserrat',sans-serif;font-weight:900;float:left;font-size:72px;line-height:.78;padding:8px 14px 0 0;color:${v['--accent']};}
  @media (max-width:640px){
    .lngvty-page [style*="font-size:46px"]{font-size:32px!important;}
    .lngvty-page [style*="font-size:34px"]{font-size:26px!important;}
    .lngvty-page [style*="font-size:30px"]{font-size:24px!important;}
  }
</style>
</head>
<body>
<div class="lngvty-page">
${clone.innerHTML.trim()}
</div>${buildEmbedMarkup()}
</body>
</html>`;
  }

  // ── EMAIL-SAFE PASS ──────────────────────────────────────────────
  // Real inboxes (Gmail/Outlook/Apple Mail) don't support CSS variables
  // or flexbox. Resolve every var(--x) to a hex value and convert flex
  // layouts to tables so the sent email matches the preview.
  emailSafe(clone, v);

  const rootVars=Object.entries(v).map(([k,val])=>`      ${k}:${val};`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>LNGVTY Hub Email</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet"/>
<style>
  body{margin:0;padding:0;background:${v['--bg']};font-family:'Open Sans',Arial,sans-serif;color:#1a1a1a;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table{border-collapse:collapse;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{text-decoration:none;}
  .email-wrapper{max-width:620px;margin:0 auto;background:#ffffff;}
  @media only screen and (max-width:480px){
    .email-wrapper{width:100%!important;}
    .em-pad{padding-left:20px!important;padding-right:20px!important;}
    .em-stack{display:block!important;width:100%!important;}
  }
</style>
</head>
<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${v['--bg']};">
<tr><td align="center" style="padding:0;">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" class="email-wrapper" style="max-width:620px;background:#ffffff;">
<tr><td style="padding:0;">
${clone.innerHTML.trim()}
</td></tr>
</table>
</td></tr>
</table>${buildEmbedMarkup()}
</body>
</html>`;
}

/* Resolve CSS variables to hex throughout the tree, but KEEP flexbox
   (browsers support it). Used for the full-width webpage export. */
function resolveVarsOnly(root, vars){
  const baseMap={
    '--accent':vars['--accent'],'--dark':vars['--dark'],'--gray':vars['--gray'],
    '--bg':vars['--bg'],'--paper':vars['--paper'],'--body-text':vars['--body-text'],'--heading':vars['--heading']
  };
  function resolveVar(name, secMap){
    let val=(secMap&&secMap[name]!==undefined)?secMap[name]:baseMap[name];
    if(val===undefined)return null;
    let guard=0;
    while(typeof val==='string' && val.indexOf('var(')!==-1 && guard++<6){
      val=val.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(m,n)=>{
        const r=(secMap&&secMap[n]!==undefined)?secMap[n]:baseMap[n];
        return (r!==undefined&&r!==null)?r:m;
      });
    }
    return val;
  }
  function subVars(style, secMap){
    if(!style||style.indexOf('var(')===-1)return style;
    return style.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(m,n)=>{const r=resolveVar(n,secMap);return r!=null?r:m;});
  }
  [...root.children].forEach(sec=>{
    const secMap={};
    const sty=sec.getAttribute('style')||'';
    sty.replace(/(--[a-z0-9-]+)\s*:\s*([^;]+)/gi,(m,k,val)=>{secMap[k.trim()]=val.trim();return m;});
    Object.keys(secMap).forEach(k=>{secMap[k]=resolveVar(k,secMap);});
    const apply=el=>{
      const s=el.getAttribute&&el.getAttribute('style');if(s&&s.indexOf('var(')!==-1)el.setAttribute('style',subVars(s,secMap));
      ['stroke','fill'].forEach(a=>{const av=el.getAttribute&&el.getAttribute(a);if(av&&av.indexOf('var(')!==-1)el.setAttribute(a,subVars(av,secMap));});
    };
    apply(sec);
    sec.querySelectorAll('[style*="var"],[stroke*="var"],[fill*="var"]').forEach(apply);
  });
}

/* ═══════════ EMAIL-SAFE TRANSFORM ═══════════
   Resolves CSS variables to hex and converts flex layouts to tables so the
   exported HTML renders consistently in real email clients. The builder UI
   keeps using vars/flex (it runs in Chrome); only the export is converted. */
function emailSafe(root, vars){
  // 1) build a flat var->value map, resolving chained vars (e.g. --secbg:var(--dark))
  const baseMap={
    '--accent':vars['--accent'],'--dark':vars['--dark'],'--gray':vars['--gray'],
    '--bg':vars['--bg'],'--paper':vars['--paper'],'--body-text':vars['--body-text'],'--heading':vars['--heading']
  };
  function resolveVar(name, secMap){
    let val=(secMap&&secMap[name]!==undefined)?secMap[name]:baseMap[name];
    if(val===undefined)return null;
    let guard=0;
    while(typeof val==='string' && val.indexOf('var(')!==-1 && guard++<6){
      val=val.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(m,n)=>{
        const r=(secMap&&secMap[n]!==undefined)?secMap[n]:baseMap[n];
        return (r!==undefined&&r!==null)?r:m;
      });
    }
    return val;
  }
  // substitute every var(--x) inside a style string, given the section theme map
  function subVars(style, secMap){
    if(!style||style.indexOf('var(')===-1)return style;
    return style.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(m,n)=>{
      const r=resolveVar(n, secMap);
      return r!=null?r:m;
    });
  }

  // 2) for each top-level section, read its per-section theme vars (--secbg etc.)
  //    from its own inline style, then substitute vars throughout its subtree.
  [...root.children].forEach(sec=>{
    const secMap={};
    const sty=sec.getAttribute('style')||'';
    sty.replace(/(--[a-z0-9-]+)\s*:\s*([^;]+)/gi,(m,k,val)=>{secMap[k.trim()]=val.trim();return m;});
    // resolve the section-level map values themselves
    Object.keys(secMap).forEach(k=>{secMap[k]=resolveVar(k,secMap);});
    // apply to this element and every descendant with a style attr
    const apply=el=>{
      const s=el.getAttribute&&el.getAttribute('style');
      if(s&&s.indexOf('var(')!==-1)el.setAttribute('style',subVars(s,secMap));
      // SVG presentation attrs (stroke/fill) can hold var() too
      ['stroke','fill'].forEach(a=>{
        const av=el.getAttribute&&el.getAttribute(a);
        if(av&&av.indexOf('var(')!==-1)el.setAttribute(a,subVars(av,secMap));
      });
    };
    apply(sec);
    sec.querySelectorAll('[style*="var"],[stroke*="var"],[fill*="var"]').forEach(apply);
  });

  // 3) convert flex containers to email-safe tables (rows) repeatedly until none remain
  let pass=0;
  while(pass++<40){
    const flexEl=root.querySelector('[style*="display:flex"]');
    if(!flexEl)break;
    convertFlexToTable(flexEl);
  }
}

function styleToObj(s){const o={};(s||'').split(';').forEach(p=>{const i=p.indexOf(':');if(i>0){o[p.slice(0,i).trim().toLowerCase()]=p.slice(i+1).trim();}});return o;}
function objToStyle(o){return Object.entries(o).map(([k,v])=>`${k}:${v}`).join(';');}

function convertFlexToTable(el){
  const o=styleToObj(el.getAttribute('style')||'');
  const isColumn=(o['flex-direction']||'').indexOf('column')!==-1;
  const flexWrap=(o['flex-wrap']||'').indexOf('wrap')!==-1;
  const kids=[...el.children];

  // SPECIAL CASE: a flex element with NO element children is using flex only to
  // centre its own text/inline content (e.g. a numbered step badge or timeline
  // dot: a 26px circle with display:flex;align-items:center;justify-content:center).
  // Tableizing it would throw the text away (no child cells) — instead just drop
  // the flex props and centre the content with text-align + line-height, which
  // every email client supports. Keeps the white number visible inside the circle.
  if(kids.length===0){
    const align=(o['justify-content']||'');
    delete o['display'];delete o['flex-direction'];delete o['flex-wrap'];
    delete o['align-items'];delete o['justify-content'];delete o['gap'];delete o['flex'];
    // horizontal centring -> text-align:center
    if(align.indexOf('center')!==-1||align.indexOf('around')!==-1||align.indexOf('evenly')!==-1)o['text-align']=o['text-align']||'center';
    else if(align.indexOf('end')!==-1)o['text-align']=o['text-align']||'right';
    // vertical centring inside a fixed-height box -> line-height == height
    const h=(o['height']||'').match(/^(\d+)px$/);
    if(h)o['line-height']=h[1]+'px';
    el.setAttribute('style',objToStyle(o));
    return el;
  }

  // container-level styling to keep (bg, padding, margin, border, etc.) goes on a wrapping cell
  delete o['display'];delete o['flex-direction'];delete o['flex-wrap'];
  const gap=o['gap']||'0';delete o['gap'];
  const alignItems=o['align-items']||'';const justify=o['justify-content']||'';
  delete o['align-items'];delete o['justify-content'];delete o['flex'];
  const valign=alignItems.indexOf('center')!==-1?'middle':(alignItems.indexOf('end')!==-1?'bottom':'top');
  // Flexbox stretches children to equal height by default (align-items:stretch,
  // which is also the value when align-items is unspecified). A table won't do
  // that on its own, so when the source row stretched, force the cells (and the
  // child's own box) to full height — this keeps colored side-blocks (date
  // chips, accent bars) filling the whole row instead of leaving a gap where
  // the section background shows through.
  const isStretch=(alignItems==='' || alignItems.indexOf('stretch')!==-1);
  let tAlign='left';
  if(justify.indexOf('center')!==-1)tAlign='center';
  else if(justify.indexOf('end')!==-1)tAlign='right';
  else if(justify.indexOf('between')!==-1||justify.indexOf('around')!==-1)tAlign='spread';

  // figure out how many columns per row when the flex container wraps.
  // derived from the child flex-basis percentage (e.g. 45% -> 2, 30% -> 3),
  // defaulting to 2 columns when wrapping is on.
  function colsFromChild(kid){
    const ks=styleToObj(kid.getAttribute&&kid.getAttribute('style')||'');
    const flexVal=ks['flex']||'';
    const m=flexVal.match(/(\d{1,3})\s*%/) || (ks['flex-basis']||'').match(/(\d{1,3})\s*%/) || (ks['width']||'').match(/(\d{1,3})\s*%/);
    if(m){const pct=parseInt(m[1],10);if(pct>0){const c=Math.max(1,Math.round(100/pct));return Math.min(c,4);}}
    return 2;
  }
  let cols=0;
  if(flexWrap && !isColumn && kids.length>1){cols=colsFromChild(kids[0]);}

  // Does any child grow to fill the row? In flexbox `flex:1` (or flex-grow>0)
  // makes the content expand so the row spans the full container width. A table
  // shrinks to its content unless told otherwise, so when a child grows we must
  // stretch the table to 100% — otherwise the row's white card / accent bar
  // only covers the text and the section background shows through the rest.
  function childGrows(kid){
    const ks=styleToObj(kid.getAttribute&&kid.getAttribute('style')||'');
    const f=(ks['flex']||'').trim();
    if(f){
      // flex shorthand: first number is flex-grow (e.g. "1", "1 1 45%", "1 0 auto")
      const g=parseFloat(f.split(/\s+/)[0]);
      if(!isNaN(g)&&g>0)return true;
    }
    const fg=parseFloat(ks['flex-grow']||'');
    return !isNaN(fg)&&fg>0;
  }
  const hasGrowingChild=!isColumn && kids.some(childGrows);

  const gapPx=parseInt(gap,10)||0;
  const tbl=document.createElement('table');
  tbl.setAttribute('role','presentation');tbl.setAttribute('cellpadding','0');tbl.setAttribute('cellspacing','0');tbl.setAttribute('border','0');
  // carry over identity/data attributes (e.g. data-sec / data-sectheme on a section root)
  for(const at of Array.from(el.attributes)){
    if(at.name==='style'||at.name==='class')continue;
    tbl.setAttribute(at.name,at.value);
  }
  // keep container background/padding/etc on the table; make wrapped grids full width
  const contStyle=Object.assign({},o);
  if(contStyle['width']===undefined && !isColumn && (tAlign==='spread'||cols>1||hasGrowingChild))contStyle['width']='100%';
  tbl.setAttribute('style',objToStyle(contStyle));

  if(isColumn){
    const tbody=document.createElement('tbody');
    if(justify.indexOf('center')!==-1 || justify.indexOf('around')!==-1 || justify.indexOf('evenly')!==-1){
      // column flex centered along its main axis -> put the whole stack in one
      // middle-aligned cell so it sits centred in the (often full-height) box.
      const tr=document.createElement('tr');const td=document.createElement('td');
      td.setAttribute('valign','middle');td.setAttribute('style','height:100%;');
      kids.forEach((kid,idx)=>{
        if(idx>0 && gapPx){const ks=styleToObj(kid.getAttribute('style')||'');ks['margin-top']=gapPx+'px';kid.setAttribute('style',objToStyle(ks));}
        td.appendChild(kid);
      });
      tr.appendChild(td);tbody.appendChild(tr);
    }else{
      // stack children vertically: one row per child
      kids.forEach((kid,idx)=>{
        const tr=document.createElement('tr');const td=document.createElement('td');
        td.setAttribute('valign','top');
        let cs='';if(idx>0 && gapPx)cs+=`padding-top:${gapPx}px;`;
        if(cs)td.setAttribute('style',cs);
        td.appendChild(kid);tr.appendChild(td);tbody.appendChild(tr);
      });
    }
    tbl.appendChild(tbody);
  }else if(cols>1){
    // WRAPPED GRID: chunk children into rows of `cols`, each cell equal width.
    const tbody=document.createElement('tbody');
    const cellW=Math.floor(100/cols)+'%';
    for(let i=0;i<kids.length;i+=cols){
      const tr=document.createElement('tr');
      for(let c=0;c<cols;c++){
        const kid=kids[i+c];
        const td=document.createElement('td');td.setAttribute('valign',valign);td.setAttribute('width',cellW);
        let cs=`width:${cellW};`;
        if(c>0 && gapPx)cs+=`padding-left:${Math.round(gapPx/2)}px;`;
        if(c<cols-1 && gapPx)cs+=`padding-right:${Math.round(gapPx/2)}px;`;
        if(i>0 && gapPx)cs+=`padding-top:${gapPx}px;`;
        td.setAttribute('style',cs);
        if(kid){td.appendChild(kid);}else{td.innerHTML='&nbsp;';}
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    tbl.appendChild(tbody);
  }else{
    // single row: one cell per child
    const tbody=document.createElement('tbody');const tr=document.createElement('tr');
    kids.forEach((kid,idx)=>{
      const td=document.createElement('td');td.setAttribute('valign',valign);
      // preserve an explicit width set on the child (e.g. width:50%)
      const ks=styleToObj(kid.getAttribute&&kid.getAttribute('style')||'');
      let cs='';
      if(ks['width'])cs+=`width:${ks['width']};`;
      // a growing child (flex:1) should take all remaining width after the
      // fixed-width siblings, so its cell gets width:100% (and the table is
      // already 100%). This makes the white card / content fill the row.
      else if(childGrows(kid)){cs+='width:100%;';td.setAttribute('width','100%');}
      // stretched rows: make every cell + its child fill the full row height so
      // colored side-blocks don't leave a gap (matches flex align-items:stretch)
      // — but never stretch a fixed-size logo, which would balloon its background.
      const holdsLogo=kid.querySelector&&kid.querySelector('.logo-slot,.logo-inner');
      if(isStretch && kids.length>1 && !holdsLogo){
        cs+='height:100%;';
        if(ks['height']===undefined){ks['height']='100%';kid.setAttribute('style',objToStyle(ks));}
      }
      if(idx>0 && gapPx)cs+=`padding-left:${gapPx}px;`;
      if(tAlign==='center')td.setAttribute('align','center');
      if(cs)td.setAttribute('style',cs);
      td.appendChild(kid);tr.appendChild(td);
    });
    tbody.appendChild(tr);tbl.appendChild(tbody);
    if(tAlign==='center'){tbl.setAttribute('align','center');}
  }
  el.parentNode.replaceChild(tbl,el);
  return tbl;
}
/* Robust clipboard write.
   navigator.clipboard.writeText() rejects silently in several real situations —
   a non-secure context, a lost user-gesture, or the document not being focused
   (which happens when a modal or toast steals focus). Every copy path in the app
   goes through this, which falls back to a hidden textarea + execCommand so the
   copy still lands. Returns true on success. */
function copyText(text,okMsg){
  okMsg=okMsg||'Copied';
  const fallback=()=>{
    try{
      const ta=document.createElement('textarea');
      ta.value=text;
      ta.setAttribute('readonly','');
      ta.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.select();ta.setSelectionRange(0,ta.value.length);
      const ok=document.execCommand('copy');
      ta.remove();
      toast(ok?okMsg:'Copy failed \u2014 open View HTML and copy manually');
      return ok;
    }catch(e){
      toast('Copy failed \u2014 open View HTML and copy manually');
      return false;
    }
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    try{
      navigator.clipboard.writeText(text).then(()=>toast(okMsg),()=>fallback());
      return true;
    }catch(e){ return fallback(); }
  }
  return fallback();
}

function copyHTML(){copyText(buildExport(),'HTML copied');}
function downloadHTML(){const blob=new Blob([buildExport()],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lngvty-email-'+Date.now()+'.html';a.click();URL.revokeObjectURL(a.href);toast('Downloaded');}
function viewHTML(){openSettings('html');}
function closeModal(){closeSettings();}
function copyModal(){copyText(document.getElementById('modalText').value,'Copied');}
/* toggle the HTML textarea between read-only and editable for live tweaks */
function toggleModalEdit(){
  const t=document.getElementById('modalText');const b=document.getElementById('modalEditBtn');
  t.readOnly=!t.readOnly;
  if(t.readOnly){b.innerHTML='&#9998; Edit';toast('Locked (view only)');}
  else{b.innerHTML='&#128274; Lock';t.focus();toast('Editing — tweak the HTML, then Copy or Preview it');}
}
/* preview exactly what's in the textarea (including any manual edits) */
function previewModalHTML(){
  const html=document.getElementById('modalText').value;
  const iframe=document.getElementById('previewIframe');
  iframe.srcdoc=html;
  document.getElementById('pvTitle').innerHTML='&#128065; Preview (edited HTML)';
  previewDesktop();
  document.getElementById('previewBg').classList.add('show');
}

/* ═══════════ PREVIEW ═══════════ */
function openPreview(){
  const html=buildExport();
  const iframe=document.getElementById('previewIframe');
  iframe.srcdoc=html;
  const isWeb=(builderMode==='webpage');
  document.getElementById('pvTitle').innerHTML=isWeb?'&#128065; Webpage Preview':'&#128065; Email Preview';
  previewDesktop();
  document.getElementById('previewBg').classList.add('show');
}
function previewDesktop(){
  const iframe=document.getElementById('previewIframe');
  const isWeb=(builderMode==='webpage');
  iframe.style.width=isWeb?'100%':'620px';
  iframe.style.maxWidth=isWeb?'1100px':'620px';
  document.querySelectorAll('.preview-top button').forEach(b=>b.classList.remove('active'));
  document.getElementById('pvDesktop').classList.add('active');
}
function closePreview(){document.getElementById('previewBg').classList.remove('show');document.getElementById('previewIframe').srcdoc='';}
function setPreviewWidth(w,btnId){
  const iframe=document.getElementById('previewIframe');
  iframe.style.maxWidth='';
  iframe.style.width=w+'px';
  document.querySelectorAll('.preview-top button').forEach(b=>b.classList.remove('active'));
  document.getElementById(btnId).classList.add('active');
}

/* Import a newsletter from structured section JSON. This is the inverse of
   Copy CSS / the GitHub save: it rebuilds the editor from the section data, so
   every section keeps its type and stays fully editable — never an "Imported"
   block. Accepts raw JSON or the full Copy CSS bundle (JSON is extracted). */
function openImport(){
  const t=document.getElementById('importText');if(t)t.value='';
  const st=document.getElementById('importStatus');if(st)st.textContent='';
  const rep=document.getElementById('importReplace');if(rep)rep.checked=true;
  openSettings('import');
  setTimeout(()=>t&&t.focus(),40);
}
function closeImport(){closeSettings();}

/* pull a newsletter object out of pasted text: raw JSON, a Copy Bundle (JSON sits
   between the LNGVTY-JSON markers), or JSON embedded anywhere in the text */
function extractNewsletterJSON(raw){
  if(!raw)return null;
  raw=raw.trim();
  const m=raw.match(/LNGVTY-JSON\s*([\s\S]*?)\s*LNGVTY-JSON/);
  if(m){try{return JSON.parse(m[1].trim());}catch(e){}}
  try{return JSON.parse(raw);}catch(e){}
  const a=raw.indexOf('{'), b=raw.lastIndexOf('}');
  if(a!==-1&&b>a){try{return JSON.parse(raw.slice(a,b+1));}catch(e){}}
  return null;
}

function doImport(){
  const raw=document.getElementById('importText').value;
  const status=document.getElementById('importStatus');
  const nl=extractNewsletterJSON(raw);
  if(!nl){status.textContent='Couldn\u2019t find valid newsletter JSON in that text.';return;}
  const sections=Array.isArray(nl.sections)?nl.sections:(Array.isArray(nl)?nl:null);
  if(!sections){status.textContent='That JSON has no "sections" array.';return;}
  // validate section keys against known sections
  const known=allSections();
  const good=sections.filter(s=>s&&s.key&&(known[s.key]||s.key.startsWith('widget-')));
  const skipped=sections.length-good.length;
  if(!good.length){status.textContent='None of the sections match known section types.';return;}
  const replace=document.getElementById('importReplace').checked;
  if(replace && nl.theme)applyThemeVars(nl.theme);
  loadSections(good, !replace);
  saveStateLocal();
  closeImport();
  toast(`Imported ${good.length} section${good.length!==1?'s':''}`+(skipped?` (${skipped} skipped)`:''));
}



/* ═══════════ SAVED NEWSLETTERS (GitHub) ═══════════ */
// Browses structured newsletter JSON files stored in the repo's /saved folder.

// placeholder items shown only before the first successful reload
const SAVED_PLACEHOLDERS=[
  {name:'Weekly Newsletter — Template',tag:'Newsletter',updated:'placeholder'},
  {name:'90-Day Challenge Promo',tag:'Graphic',updated:'placeholder'},
  {name:'Final Scan Reminder',tag:'Graphic',updated:'placeholder'},
  {name:'New Member Welcome',tag:'Newsletter',updated:'placeholder'}
];

let savedEverLoaded=false;
let savedActiveTag='All';                 // current filter
let savedCurrentItems=[];                 // full (unfiltered) list currently shown
let savedCurrentPlaceholder=false;
// tags we always offer as filters even if nothing is saved under them yet
const SAVED_STD_TAGS=['Graphic','Newsletter','Webpage','Promo','Announcement','Other'];

function openSaved(){
  const list=getSavedList();
  if(list.length){savedCurrentItems=list;savedCurrentPlaceholder=false;document.getElementById('savedStatus').textContent=list.length+' saved newsletter(s).';}
  else if(savedEverLoaded){savedCurrentItems=[];savedCurrentPlaceholder=false;document.getElementById('savedStatus').textContent='No saved newsletters found.';}
  else{savedCurrentItems=SAVED_PLACEHOLDERS;savedCurrentPlaceholder=true;document.getElementById('savedStatus').textContent=ghReady()?'Loading your newsletters from GitHub…':'Connect a GitHub repo (⚙ GitHub) to store newsletters.';}
  savedActiveTag='All';
  renderSavedFilters();
  renderSaved(savedCurrentItems,savedCurrentPlaceholder);
  document.getElementById('savedBg').classList.add('show');
  // always pull the latest from GitHub on open so Load works without a manual refresh
  if(ghReady())reloadSaved();
}
function closeSaved(){document.getElementById('savedBg').classList.remove('show');}

/* build the filter chips from the standard tags + whatever tags exist in the data */
function renderSavedFilters(){
  const bar=document.getElementById('savedFilterBar');if(!bar)return;
  // keep the leading "Filter:" label, clear any old chips
  bar.querySelectorAll('.saved-chip').forEach(c=>c.remove());
  // collect tags: standard set first, then any extra tags found in the data
  const present=new Set();
  (savedCurrentItems||[]).forEach(it=>{const t=(it.tag||'').trim();if(t)present.add(t);});
  const tags=['All'];
  SAVED_STD_TAGS.forEach(t=>{if(!tags.includes(t))tags.push(t);});
  [...present].forEach(t=>{if(!tags.some(x=>x.toLowerCase()===t.toLowerCase()))tags.push(t);});
  tags.forEach(t=>{
    const count=(t==='All')?(savedCurrentItems||[]).length:(savedCurrentItems||[]).filter(it=>(it.tag||'').toLowerCase()===t.toLowerCase()).length;
    const chip=document.createElement('button');
    chip.className='saved-chip'+(savedActiveTag.toLowerCase()===t.toLowerCase()?' active':'');
    chip.textContent=t+(t!=='All'?` (${count})`:'');
    chip.onclick=()=>{savedActiveTag=t;renderSavedFilters();renderSaved(savedCurrentItems,savedCurrentPlaceholder);};
    bar.appendChild(chip);
  });
}

/* ── Edit a saved item's metadata (name/tag/status/notes) straight to GitHub,
   without loading the whole newsletter into the builder. ── */
let savedEditItem=null;
function openSavedEdit(it){
  if(!ghReady()){toast('Connect a GitHub repo first (\u2699 GitHub).');openGithubSettings();return;}
  savedEditItem=it;
  const sel=document.getElementById('seTag');
  // build tag options from the standard set plus whatever tags exist
  const present=new Set();(savedCurrentItems||[]).forEach(x=>{const t=(x.tag||'').trim();if(t)present.add(t);});
  const tags=[...SAVED_STD_TAGS];present.forEach(t=>{if(!tags.some(x=>x.toLowerCase()===t.toLowerCase()))tags.push(t);});
  if(it.tag && !tags.some(x=>x.toLowerCase()===String(it.tag).toLowerCase()))tags.unshift(it.tag);
  sel.innerHTML=tags.map(t=>`<option value="${esc(t)}"${(it.tag||'').toLowerCase()===t.toLowerCase()?' selected':''}>${esc(t)}</option>`).join('');
  document.getElementById('seName').value=it.name||'';
  document.getElementById('seStatus').value=it.status||'';
  document.getElementById('seNotes').value=it.notes||'';
  document.getElementById('seStatusMsg').textContent='';
  document.getElementById('savedEditBg').classList.add('show');
}
function closeSavedEdit(){document.getElementById('savedEditBg').classList.remove('show');savedEditItem=null;}
async function saveSavedEdit(){
  if(!savedEditItem)return;
  const btn=document.getElementById('seSaveBtn');
  const msg=document.getElementById('seStatusMsg');
  const name=document.getElementById('seName').value.trim();
  const tag=document.getElementById('seTag').value;
  const statusV=document.getElementById('seStatus').value.trim();
  const notes=document.getElementById('seNotes').value.trim();
  if(!name){msg.style.color='#c0392b';msg.textContent='Name can\u2019t be empty.';return;}
  btn.disabled=true;btn.textContent='Saving\u2026';msg.style.color='#999';msg.textContent='Saving to GitHub\u2026';
  try{
    const file=savedEditItem.file||{path:`${ghDir()}/${(savedEditItem.id||slugify(savedEditItem.name))}.json`};
    const nl=await ghLoadFile(file);
    // keep the same id/file (renaming only changes the display name, not the filename,
    // so we never orphan or duplicate the stored file)
    nl.name=name;nl.tag=tag;nl.status=statusV;nl.notes=notes;
    nl.updatedAt=new Date().toISOString();
    await ghPut(nl);
    // reflect in the local registry + in-memory list so the grid updates immediately
    const id=nl.id||savedEditItem.id||slugify(name);
    const list=getSavedList().map(r=>((r.id||slugify(r.name))===id)?{...r,name,tag,status:statusV,notes,updated:nl.updatedAt}:r);
    setSavedList(list);
    (savedCurrentItems||[]).forEach(x=>{if((x.id||slugify(x.name))===id){x.name=name;x.tag=tag;x.status=statusV;x.notes=notes;x.updated=nl.updatedAt;}});
    closeSavedEdit();
    renderSavedFilters();renderSaved(savedCurrentItems,savedCurrentPlaceholder);
    toast('\u2713 Details updated');
  }catch(e){
    msg.style.color='#c0392b';msg.textContent='Save failed: '+(e.message||e);
  }
  btn.disabled=false;btn.textContent='Save changes';
}

function renderSaved(items,isPlaceholder){
  const grid=document.getElementById('savedGrid');grid.innerHTML='';
  // apply the active tag filter
  let view=items||[];
  if(savedActiveTag&&savedActiveTag!=='All'){
    view=view.filter(it=>(it.tag||'').toLowerCase()===savedActiveTag.toLowerCase());
  }
  if(!view.length){
    const empty=document.createElement('div');
    empty.style.cssText='grid-column:1/-1;padding:30px 10px;text-align:center;color:#aaa;font-size:13px;';
    empty.textContent=(savedActiveTag&&savedActiveTag!=='All')?`No saved items tagged “${savedActiveTag}”.`:'No saved newsletters yet.';
    grid.appendChild(empty);
    return;
  }
  view.forEach(it=>{
    const card=document.createElement('div');
    card.style.cssText='border:1px solid #e3e3e6;border-radius:9px;padding:13px;background:#fff;display:flex;flex-direction:column;gap:7px;'+(isPlaceholder?'opacity:.7;':'');
    const badge=(/newsletter/i.test(it.tag||''))?'#e05a1b':(/webpage/i.test(it.tag||'')?'#2a6cb0':'#1a1a1a');
    const when=it.updated?new Date(it.updated):null;
    const whenStr=when&&!isNaN(when)?when.toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):(it.updated||'');
    card.innerHTML=`<div class="sv-thumb" style="height:120px;border:1px solid #ececef;border-radius:6px;background:#fafafa;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:10px;color:#bbb;">${isPlaceholder?'No preview':'Loading preview…'}</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-family:'Montserrat';font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;background:${badge};padding:2px 7px;border-radius:4px;">${esc(it.tag||'graphic')}</span>
        ${it.status?`<span style="font-family:'Montserrat';font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#666;background:#eee;padding:2px 7px;border-radius:4px;">${esc(it.status)}</span>`:''}</div>
      <div style="font-family:'Montserrat';font-size:13px;font-weight:700;color:#222;line-height:1.3;">${esc(it.name||'Untitled')}</div>
      ${it.notes?`<div style="font-size:11px;color:#777;line-height:1.4;">${esc(it.notes)}</div>`:''}
      <div style="font-size:10px;color:#aaa;">${isPlaceholder?'Preview placeholder':('Updated '+esc(whenStr))}</div>`;
    const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px;';
    const load=document.createElement('button');
    load.className='tb-btn';load.style.cssText='font-size:10px;padding:7px 6px;width:100%;justify-content:center;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    load.innerHTML='&#128229; Load';
    load.onclick=async()=>{
      if(isPlaceholder){toast('Connect GitHub and Reload first.');return;}
      if(!ghReady()){toast('Connect a GitHub repo first (⚙ GitHub).');return;}
      load.disabled=true;load.innerHTML='&#128229; Loading…';
      try{
        const file=it.file||{path:`${ghDir()}/${(it.id||slugify(it.name))}.json`};
        const nl=await ghLoadFile(file);
        if(applyNewsletter(nl)){saveStateLocal();closeSaved();toast('\u2713 Loaded "'+(nl.name||it.name||'newsletter')+'"');}
      }catch(e){toast('Load failed: '+(e.message||e));}
      load.disabled=false;load.innerHTML='&#128229; Load';
    };
    row.appendChild(load);
    if(!isPlaceholder){
      const pv=document.createElement('button');
      pv.className='tb-btn';pv.style.cssText='font-size:10px;padding:7px 6px;width:100%;justify-content:center;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      pv.innerHTML='&#128065; Preview';
      pv.onclick=async()=>{
        pv.disabled=true;pv.innerHTML='&#128065; …';
        try{ await previewSavedItem(it); }
        catch(e){ toast('Preview failed: '+(e.message||e)); }
        pv.disabled=false;pv.innerHTML='&#128065; Preview';
      };
      row.appendChild(pv);
    }
    if(!isPlaceholder){
      const ed=document.createElement('button');
      ed.className='tb-btn';ed.style.cssText='font-size:10px;padding:7px 6px;width:100%;justify-content:center;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      ed.innerHTML='&#9998; Edit';
      ed.onclick=()=>openSavedEdit(it);
      row.appendChild(ed);
    }
    if(!isPlaceholder){
      const del=document.createElement('button');
      del.className='tb-btn danger';del.style.cssText='font-size:10px;padding:7px 6px;width:100%;justify-content:center;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      del.innerHTML='&#128465; Delete';
      del.onclick=async()=>{
        if(!confirm('Delete "'+(it.name||'this')+'" from GitHub? This removes the saved file (version history keeps a copy).'))return;
        const id=it.id||slugify(it.name);
        if(ghReady()){
          try{await ghDelete((it.file&&it.file.path)||`${ghDir()}/${id}.json`,(it.file&&it.file.sha)||null);}
          catch(e){toast('GitHub delete failed: '+(e.message||e));return;}
        }
        const list=getSavedList().filter(r=>(r.id||slugify(r.name))!==id);
        setSavedList(list);openSaved();toast('Deleted');
      };
      row.appendChild(del);
    }
    card.appendChild(row);
    grid.appendChild(card);
    if(!isPlaceholder)renderSavedThumb(it,card.querySelector('.sv-thumb'));
  });
}

async function reloadSaved(){
  const status=document.getElementById('savedStatus');
  const btn=document.getElementById('savedReload');
  const setBtn=(t)=>{if(btn)btn.innerHTML=t;};
  if(!ghReady()){status.textContent='No GitHub repo connected. Click \u2699 GitHub to set one up.';openGithubSettings();return;}  status.textContent='Loading from GitHub…';setBtn('&#8635; Reloading…');
  try{
    const files=await ghList();
    if(!files.length){
      savedEverLoaded=true;savedCurrentItems=[];savedCurrentPlaceholder=false;
      renderSavedFilters();renderSaved([],false);
      status.textContent='No newsletters in '+ghDir()+'/ yet. Save one to create it.';
      setBtn('&#8635; Reload');return;
    }
    // fetch each file's metadata (lightweight: name/tag/status/notes/updatedAt)
    const items=[];
    for(const f of files){
      try{
        const nl=await ghLoadFile(f);
        items.push({
          id:nl.id||f.name.replace(/\.json$/i,''),
          name:nl.name||f.name.replace(/\.json$/i,''),
          tag:nl.tag||'',status:nl.status||'',notes:nl.notes||'',
          updated:nl.updatedAt||'',file:f
        });
      }catch(e){/* skip unreadable file */}
    }
    // mirror metadata into the local registry (GitHub is source of truth)
    setSavedList(items.map(({file,notes,...m})=>({...m,notes})));
    savedEverLoaded=true;savedCurrentItems=items;savedCurrentPlaceholder=false;
    renderSavedFilters();renderSaved(items,false);
    status.textContent=`${items.length} saved newsletter(s).`;
  }catch(e){
    status.textContent='Could not reach GitHub: '+(e.message||e);
  }
  setBtn('&#8635; Reload');
}

/* Copy CSS: copies the finished email HTML plus the structured section JSON
   (the exact data that gets saved to GitHub). Useful for manual testing and
   for round-tripping a newsletter back in via the Import button. */
function copyCSS(){
  const html=buildExport();
  const data=serializeNewsletter({name:''});
  const bundle=
`<!-- ===== LNGVTY NEWSLETTER EXPORT ===== -->
<!-- 1) EMAIL HTML (paste into GHL) -->

${html}

<!-- ===== SECTION DATA (JSON saved to GitHub — paste into Import to rebuild) ===== -->
<!--LNGVTY-JSON
${JSON.stringify(data,null,2)}
LNGVTY-JSON-->`;
  copyText(bundle,'Copied HTML + section data');
}

/* ═══════════ BUTTON TOOLTIPS ═══════════ */
(function(){
  const box=document.getElementById('tipBox');
  if(!box)return;
  function show(el){
    const t=el.getAttribute('data-tip');if(!t)return;
    box.textContent=t;box.style.display='block';
    const r=el.getBoundingClientRect();
    let left=r.left, top=r.bottom+8;
    requestAnimationFrame(()=>{
      const bw=box.getBoundingClientRect().width;
      if(left+bw>window.innerWidth-8)left=window.innerWidth-bw-8;
      if(left<8)left=8;
      box.style.left=left+'px';box.style.top=top+'px';
    });
  }
  function hide(){box.style.display='none';}
  document.addEventListener('mouseover',e=>{const el=e.target.closest('[data-tip]');if(el)show(el);});
  document.addEventListener('mouseout',e=>{const el=e.target.closest('[data-tip]');if(el)hide();});
  document.addEventListener('click',e=>{if(e.target.closest('[data-tip]'))hide();});
})();

/* ═══════════ DOCUMENTATION ═══════════ */
/* ═══════════ RELEASE NOTES (Markdown) ═══════════ */
function defaultNotes(){return `# LNGVTY Builder — Release Notes

A browser-based builder for LNGVTY Hub's newsletters, graphics, and web pages.
Split into an index file plus styles/ and scripts/ folders. No server,
no build step, no runtime cost.

**Current build:** v23.0 "Split build" · 6 November 2026

---

## How it works, briefly

The builder holds a library of **72 brand-locked components**. You assemble a
document from them, and it exports **email-safe HTML** — table-based, inline-styled,
and tested to render in Outlook, Gmail, and Apple Mail.

The important architectural decision: **structured section data, not exported HTML,
is the source of truth.** Export is a lossy transform — it flattens a "Calendar" and
a "Recipe" into anonymous nested tables. If you save the HTML and re-parse it later,
you cannot recover what the markup *meant*, and every block comes back as a dead
"Imported" lump. So documents are saved as JSON describing the sections, and the HTML
is regenerated on demand. The round trip is lossless by construction.

> **Principle:** never persist the output of a lossy transform as your source of
> truth. Persist the input; re-derive the output.

---

## v23.0 — Split build · 6 November 2026

- **The builder is no longer one giant file.** The app is split into an index file (the shell), styles/builder.css (all the builder-UI styling), and two files under scripts/ — registry.js (the component library) and app.js (the engine). Much easier to debug and edit: a CSS tweak lives in the stylesheet, a section definition in the registry, the engine in app.js. **Exported emails are unaffected** — they are still single-file, inline-styled HTML, exactly as before. Because the files load by relative path, open the builder through its GitHub Pages URL (or a local server), not by double-clicking the index file off disk.
- **Fixed the nested-div paragraphs in Quick Tip, Note, and every other text field.** Pressing Enter inside any editable text used to let the browser insert a stray block element (and nest them deeper on each further Enter), which quietly changed the font. Enter now always adds a clean line break in the field's own style. Inside the paragraph lists (Quick Tip), a second Enter on a blank line still starts a fresh paragraph block, same as before.
- **Add images by link, not just by upload.** The Image Library now has an **"Add image by URL"** button next to Upload — paste the link to any image already hosted on the web and it drops straight into the slot. Works even with no GitHub repo connected. Uploading to the repo's images folder still works too.

## v22.11 — Header with logo image · 28 September 2026

- **New “Newsletter Header + Logo” block** in the Newsletter group. It’s the same as the original header (orange bar, dark band, Weekly Newsletter + date, quote bar) but the LNGVTY text on the left is replaced by a logo image. The original text-based header is unchanged and still available.

## v22.10 — Clean up the old flip button · 28 September 2026

- **Removed the leftover “Flip sides” button** that still showed up on Image + Text blocks in older saved newsletters (and in their previews/exports). Opening an affected newsletter now clears it automatically, and it no longer appears in previews or the exported email. Use the flip button in the block toolbar instead (added in v22.9).

## v22.9 — Flip button in the block toolbar · 28 September 2026

- **New Flip button in every block’s toolbar** (the mirror icon, next to the update and drag buttons). It flips the block horizontally — mirroring the left/right layout — so it works on Image + Text, Before / After, product grids, and any side-by-side block. Click again to flip back.
- The flip is real (the sides actually swap), so the exported email matches the canvas.
- Replaced the earlier “Flip sides” button that sat on the Image + Text block itself (it overlapped the toolbar).

## v22.8 — More image blocks · 28 September 2026

- **Image + Text now has a “Flip sides” button** (top-right, on hover) that swaps which side the image and the text sit on. The swap is real, so the exported email matches the canvas.
- **Three more blocks in the Images group:**
- **Image Grid (2×2)** — a four-photo grid; add or remove tiles with “+ photo”.
- **Photo Banner (text overlay)** — a wide photo with a headline and subtext on a dark bar beneath it, for a big announcement.
- **Before / After** — two labeled images side by side for member transformations or progress.

## v22.7 — Images section · 28 September 2026

- **New “Images” group in the Newsletter tab** for dropping photos into a newsletter, with four blocks:
- **Big Picture** — one full-width featured image with an optional caption (the same big-picture block, now on the newsletter side).
- **Image Row (columns)** — a row of side-by-side images, three by default. Click “+ column” to add another or the × on a column to remove one; the row re-flows and exports as an email-safe table.
- **Image + Text** — an image beside a headline and paragraph, good for a member spotlight or a story. Stacks on mobile.
- **Image Card + Button** — a framed image with a title, description, and a linkable button (like a “Learn More” card).
- Every image is set by pasting a public image URL, and all four blocks recolor with the section theme and export clean.

## v22.6 — Update a block to the latest version · 14 August 2026

- **New "update block" button in each block's top bar** (the circular-arrow icon, next to the
  color button). When a block like the Weekly Schedule or Upcoming Events gets a bug fix or a
  new feature, older newsletters you saved still use the old version. Click this button to
  rebuild that block with the latest code **while keeping everything you typed** — text, tags,
  dates, photos, colors, and any extra events you added.
- If the block is already current, it just says **"Block already up to date."**
- Nothing else changes: after updating, every control still works (add/delete events, calendar
  picker, drag, color, formatting), and the block exports cleanly.

## v22.5 — Settings icons + multi-event Upcoming Events · 14 August 2026

- **Settings icons render everywhere now.** The menu icons were emoji that showed as "??" in
  some browsers — they're now clean drawn icons that display the same on every device.
- **Upcoming Events: calendar button no longer overlaps delete.** The events rows now match the
  Weekly Schedule: drag, delete-whole-day, and the calendar sit on the left; add-event and the
  up/down arrows sit on the right.
- **Multiple events per day on Upcoming Events.** Click "+ event" to add another event under the
  same date — the gray date box simply extends down to fit. Each event has its own delete (×)
  that appears on hover, and the whole-day × removes the entire day.

## v22.4 — Color & highlight fix · 12 August 2026

- **Fixed text color and highlight in the formatting bar.** The color and highlight buttons
  now open their color menu and actually apply to the selected text. Highlight uses a
  pill-style background (orange by default, any color) like the recipe tags. (The buttons
  relied on a browser command that silently did nothing once the color menu took focus;
  they now wrap the selection directly, which always works and exports cleanly.)

## v22.4 — Color & highlight fix · 12 August 2026

- **Fixed text color and highlight not applying** from the formatting bar. Picking a color now
  reliably colors the selected text, and the highlight paints a soft pill behind it (orange by
  default, like the recipe tags) — with any color you choose. Both carry through to the
  exported email.

## v22.3 — Formatting bar · 8 August 2026

- **New formatting bar under the toolbar.** Select any text on the canvas and a slim bar
  right below the main buttons lets you set it: **bold / italic / underline**, **align**
  (left / center / right), **text color**, **highlight** (orange by default, any color), and
  **link**. It replaces the little floating popup, so the controls are always in the same
  place instead of crowding the selection.
- **Bigger section labels.** The orange kicker on **Quick Tip** and **Letter / Body Text** is
  now 20px so it reads as a proper heading.

## v22.2 — Performance fix (long-document lag) · 7 August 2026

- **Fixed severe lag on longer newsletters.** The animated EKG backdrop was sizing its
  drawing surface to the full document height, so once a newsletter got long enough, every
  animation frame had to repaint an enormous canvas — which made the whole page stutter past
  a certain amount of text. The backdrop is now capped to the visible area and follows the
  scroll, so it stays smooth no matter how long the newsletter gets. (Measured ~2× faster
  frame times on a very long document, and it no longer degrades as you keep typing.)

## v22.1 — Calendar button fix · 7 August 2026

- **Fixed the ������ date-picker buttons not appearing** on the schedule and events rows. They
  now show on hover as a clear calendar icon — in the left control stack on the Weekly
  Schedule, and with the other controls on Upcoming Events.

## v22.0 — Calendars, Guides, Embeds & docs refresh · 7 August 2026

- **Date picker on the schedule and events.** Both the Weekly Schedule and Upcoming Events
  now have a ������ button. Click it, pick a day, and it fills the row automatically — the
  Weekly Schedule gets the weekday spelled out plus “AUG 9”; Upcoming Events gets the month
  (≤ 4 letters), the day number, and the weekday. No more typing dates by hand.
- **Tidier schedule controls.** On the Weekly Schedule, the drag handle and the delete-whole-day
  button moved to the ⬅ left of each row; add-event and the up/down arrows stay on the right.
  Hovering a × for a second now tells you whether it deletes just that event or the whole day.
- **Background Embeds.** A new ������ Embed button in the top bar holds hidden embed / tracking
  codes (analytics, pixels, preheaders). They ride along in the exported HTML but never show
  on the canvas, and you can add as many as you like. Saved with the newsletter.
- **New Guides tab.** ⚙ Settings → ������ Guides holds screen-recorded walkthroughs that play
  right in the panel. Docs and Guides link to each other. (Videos are added over time — the
  first ones land shortly.)
- **Docs refresh.** The guide now covers the current image situation (Gmail stripping hosted
  images) and how to use Gmail-safe HTML logos, with links to free online logo tools; the
  Organize Sections tab; a line-by-line example of recipe stats (“6g Protein”) and tags; and a
  prominent button that jumps straight to the feedback form.
- **American spelling.** “colour” is now “color” throughout — the standard going forward.

## v21.11 — Logo sizing fix · 7 August 2026

- **Fixed HTML logos stretching in preview/export.** A logo dropped into a product or recipe
  photo slot is now kept at its natural size instead of being stretched to match the card
  height, so it renders the same in the editor, the preview, and the sent email.

## v21.10 — Logos in photo slots · 7 August 2026

- **HTML logos now drop into the photo slots**, not just as a standalone block. Click
  “Set photo” (or “+ Photo”) on a Featured Product card or the Featured Recipe, switch to
  the HTML Logos tab, and pick a logo — it lands right in that photo spot as inline HTML.
  The slot reveals itself automatically and the logo exports Gmail-safe (no image to strip).
  Picking a logo with no photo slot open still drops a centered logo block as before, and
  regular URL images work exactly as they did.

## v21.9 — HTML Logos · 6 August 2026

- **New “HTML Logos” section in the Images tab.** Because Gmail strips image files from
  graphics, you can now build logos out of pure HTML instead. Open ⚙ Images and switch to
  the **HTML Logos** tab: paste your markup, watch it render in the live preview, name it,
  and save it to the repo’s <code>/logos</code> folder — same GitHub-backed workflow as
  images, but the files are HTML. Saved logos show as real rendered previews with their name
  underneath, just like the image grid. Click one to drop it into your newsletter as inline
  HTML, so there’s no image for Gmail to strip.

## v21.8 — Recipe picker, free-form stats & the Section Organizer · 6 August 2026

- **Pick recipes by hand — no more random pulls.** The Recipe section’s fill bar now has a
  “������ Choose recipe…” button that opens a searchable list of every recipe in your library.
  Pick the exact one you want; randomness is gone for recipes.
- **Recipe stats & tags are now free-form lists.** In ⚙ Content Library, a recipe’s stats are
  entered one per line, amount first: “6g Protein”, “410 Calories”, “$2.75 Per Serving” —
  any combination you like. Tags work the same way, one per line. When you place the recipe,
  the builder reads each line and fills the stat blocks and tag pills automatically, growing
  or shrinking to match. These save to GitHub like everything else in the library.
- **Saved tab buttons tidied up.** Load / Preview / Edit / Delete now sit in a neat 2×2 grid
  instead of overflowing the card.
- **New “Organize Sections” settings page.** Drag any section into a different tab, drag tabs
  to reorder them, rename sections and tabs inline, make brand-new tabs, and duplicate a
  section so the same block lives in several tabs at once. It works across Graphics,
  Newsletter, Webpage and Docs. All of this is local to your browser — it never changes your
  saved newsletters or what gets exported — and there’s a one-click “Reset all”.

## v21.7 — Saved editing & smarter calendar reuse · 4 August 2026

- **Reused calendars keep their own dates.** When you pull a calendar from a past
  newsletter in the ⚡ Start a Newsletter popup, the Weekly Schedule and Upcoming Events
  now come across exactly as they were — dates included. Only the header date updates to
  your chosen week. (If you *don’t* pull a calendar, the dates still auto-fill from the
  date you pick, as before.)
- **Edit saved newsletters without loading them.** The ⭐ Saved menu now has an
  ✎ Edit button on each card. Change the name, tag, status, or notes and it saves the
  change straight to GitHub — no need to load the whole newsletter first. The stored file
  keeps its original filename, so nothing is duplicated or orphaned.

## v21.6 — Starter template polish · 3 August 2026

- **Featured Products (grid) is now part of the ⚡ Start a Newsletter skeleton**, placed
  right below Tip Tuesday.
- **Section titles come pre-written, not as ghost text.** The Quick Tip “QUICK TIP” kicker
  and the Featured Products “FEATURED PRODUCTS” / “Member picks of the month” titles are
  filled in as real text when you start a newsletter, so there’s nothing to retype.

## v21.5 — Newsletter workflow · 3 August 2026

- **Fixed: Intro Box / Letter Body text was uneditable after a reload.** Editing now
  re-activates correctly when a saved newsletter is reopened (or the page is closed and
  reopened).
- **New “Quick Tip” newsletter section.** A centered version of the letter body with an
  orange “QUICK TIP” kicker and add/removable paragraphs. It’s now part of the
  ⚡ Start a Newsletter skeleton.
- **Drag-and-drop for the schedules.** Both the Weekly Schedule and Upcoming Events now
  have a grip handle (⠹) on each row — drag a day to reorder instead of clicking the
  arrows repeatedly. The arrows still work too.
- **Featured Products photos toggle off by default.** The product grid now hides photos
  until you turn them on per card (matching the single Featured Product), so cards aren’t
  dominated by oversized images.
- **Reuse a calendar from a past newsletter.** In the ⚡ Start a Newsletter date popup
  there’s now a “Pull calendar from a newsletter…” button: pick a previous newsletter
  (filter by tag), and its Weekly Schedule + Upcoming Events come across with the event
  names intact — only the dates change to your chosen week. No more rewriting the calendar
  every week.

## v21.4 — Investigation section pack · 31 July 2026

Ten new Investigation sections, pulled from the Whole30 daily graphics so the whole
campaign can be built in-app:

- **Briefing — Week by Week.** The week-by-week version of the Investigator Briefing.
  Add or remove weeks; each has a tag, title, and description.
- **Case Details (table).** A clean two-column detail table (starts, duration, cost…) with
  add/removable rows.
- **File Checklist (opening report).** A checkbox list for the member’s opening evidence.
- **Log Evidence Bar** and **Log Evidence Bar (with kicker).** Two call-to-action bars with a
  real linkable button. The kicker version adds an orange line above the headline. Both
  work on the orange or dark (black) shade.
- **Weekly Evidence Log (7 days).** A compact seven-square strip; click any square to toggle
  solid (logged) or outline (pending). Smaller squares than the existing progress block.
- **Debrief Header.** A bold kicker + big title + intro line for week debriefs.
- **Suspect File (single).** One suspect dossier — name, aliases, motives, and a
  click-to-cycle verdict stamp.
- **Reward / Status Bar.** A circular emoji badge beside a label and note — for reward
  unlocks or a board-status line. Swap the emoji and text to reuse it anywhere.
- **Clue Card (data / dark).** A dark clue card for surfacing a pattern from member logs.

## v21.3 — Featured Products grid · 30 July 2026

- **New “Featured Products (grid)” section** (Newsletter). Shows products two per row in
  neat, equal-sized cards — each with a fixed-height photo (no more oversized images),
  a name, a short blurb, add/removable detail fields, and a Shop button. Add or remove
  whole product cards; they reflow two-up automatically and convert cleanly to an
  email-safe two-column table on export. The original single Featured Product section is
  unchanged for when you want one hero product.

## v21.2 — Suspect card editing · 28 July 2026

- **Suspect cards are editable again.** Clicking the text on a suspect card used to flip
  it, so there was no way to edit the name, aliases, or motives. Now clicking the text just
  edits it; the card only flips when you click an empty part of it or use the new
  <b>⟳ flip button</b> (top-left, on hover). The verdict stamp still cycles without flipping.

## v21.1 — Fixes & Featured Product · 27 July 2026

- **Featured Product** (Newsletter). A new section with a toggleable photo (same as the
  recipe photo, pulls from your image library), product name, a short blurb, and
  <b>add/removable detail fields</b> — price, size, best-for to start, each removable, more
  addable — plus a linkable <b>Shop Now</b> button. Roomy 2-up layout so it never feels
  cramped.
- **Recipe macros can be removed again.** The × on each macro stat existed but never
  appeared on hover, so stats could only be added. Fixed.
- **Multi-event schedule days can be trimmed.** Same fix — the × on the second, third,
  etc. event of a day now shows on hover so extra events can be removed.
- **Evidence board boxes toggle.** On the investigation Evidence Collected block, click any
  box to switch it between <b>solid</b> (collected) and <b>outline</b> (pending). The
  export keeps whatever state you left.
- **Quote generator into the header.** Hardened so it reliably fills the newsletter
  header’s quote line, tolerates alternate field names, and tells you what’s wrong instead
  of doing nothing if the header is missing or the item has no text.

## v21.0 — The Investigation (Whole30 kit) · 24 July 2026

- **Fifteen new Whole30 sections** under a new <b>Investigation</b> sub-tab in Graphics.
  The conceit runs all the way through: the member is the investigator, the food groups
  are suspects, and how they feel is the evidence. Enough pieces to build a graphic for
  every day of the thirty, not just the week markers.
- **Suspect Board with flip cards.** Click a suspect to open their file — the mugshot
  turns over to reveal known aliases, potential motives, and a <b>verdict stamp</b> that
  cycles <i>Under Investigation → Cleared → Guilty</i>. Both faces stay editable, and the
  export prints whichever face you left showing.
- **The full kit:** Case File Cover, Investigator Briefing, Suspect Board, Evidence
  Collected, Clue Card, Daily Mission, Symptom Log, Case Timeline, Stakeout Notes (a note
  from Tim in case-file dress), Redacted Teaser, The Raid (pantry clean-out),
  Interrogation, Anonymous Tip, Investigator Badge, and Case Closed.
- Everything follows LNGVTY colors and the section shade/color controls, so the whole
  case file can be re-tinted per section like any other block.

## v20.3 — Color control & growable blocks · 23 July 2026

- **Per-section color.** Every block now has a color dot in its hover controls. Pick a
  swatch or type a hex code and that section's rules, bullets, eyebrows and borders all
  follow it — the rest of the document is unaffected. This is what lets one plan run a
  green track and a purple track side by side. Choose ✕ to fall back to the document
  color. Section colors are saved with the document and baked into the export.
- **The shade button works on documentation blocks now.** Those sections were painted with
  a hard-coded white background, so cycling the theme appeared to do nothing. They use the
  block shade properly, and <b>Orange</b> is relabelled <b>Accent</b> since it follows
  whatever color that section is set to.
- **Full text-color palette.** Selecting text and clicking <b>Color</b> now opens every
  color in your current theme, a standing palette, and a hex box — instead of the old
  four fixed swatches.
- **Blocks grow one item at a time.** Promise Grid, Phase Columns, Mechanics Cards,
  Numbered Pillars and the Recommendation steps used to add a whole row of three or four.
  Now it's one benefit, one column, one card, one step — and rows re-centre as they fill,
  so three items don't stretch to fill four slots.
- **Phase bullets are editable again.** They were zero-width inline spans with nothing to
  click. They're now proper add/removable list items with their own ×.
- **Settings menu reorganised.** Page Format sits at the top with Theme &amp; Type and
  Images; the content tools (Backlog, Library) share a group; GitHub, Docs and Version &amp;
  Notes share another; and Send Feedback is set apart at the bottom.

## v20.2 — Doc polish: delete, extras, cream · 23 July 2026

- **Delete is back on the wide documentation blocks.** Moving those buttons into a table
  cell in v20.1 fixed the add, but the hover rule only looked for a direct child, so the
  × never appeared. Rows, columns and timeline stops can be removed again.
- **Numbered Pillars gained two optional blocks.** Hover a pillar and you get
  <b>+ Add example box</b> (the light grey sample panel) and <b>+ Add badges</b> (a row of
  add/removable pill tags). Both start hidden so cells stay uncluttered, they apply to one
  pillar at a time, and anything left switched off is dropped from the export.
- **New Cream section color.** The theme cycle is now White → Cream → Gray → Black
  → Orange. Cream is a real theme variable, editable under <b>Settings → Theme &amp;
  Type</b>, so a document can alternate white and cream bands the way the plan layout does.

## v20.1 — Wide-table Add fix · 23 July 2026

- **Fixed the dead "+ Add" buttons** on the wide documentation blocks (Promise Grid,
  Phase Columns, Mechanics Cards, Numbered Pillars, Route/Timeline, Recommendation).
  Their row template had the delete button sitting directly inside the <code>&lt;table&gt;</code>
  rather than in a cell — browsers hoist stray elements out of a table, so the builder
  ended up cloning the button instead of the row and nothing appeared. The buttons now
  live in a proper cell.
- **Hardened the underlying add logic** so this class of bug can't come back silently:
  row templates are parsed in a real table context and the new row is located explicitly,
  and if a template is ever malformed the builder now says so instead of doing nothing.
  The same protection covers the tag and stat rows.

## v20.0 — Documentation Mode · 23 July 2026

- **New "Documentation" tab** in the sections dropdown, alongside Newsletter, Graphics
  and Webpage. Seventeen new blocks for building plan, proposal and strategy documents
  without writing any code \u2014 the same drag-to-place, ghost-text, add-and-remove
  behaviour as every other section.
- **What's in it:** Document Masthead, The Bet / Thesis, Section Header (rule),
  Color Track Header, Promise Grid, Phase / Week Columns, Mechanics Cards, Example Box,
  Route / Timeline, Numbered Pillars, Production Table, Metric Strip, Pull Quote,
  Recommendation (orange), and the Document Footer Bar.
- **Color-coded tracks.** The Track Header carries a color chip (hover it) that cycles
  through six palettes \u2014 green, plum, blue, amber, rust, brand orange \u2014 so one
  document can run two or more visually distinct threads, like one color per challenge.
- **Everything grows.** Every table, column set, card pair, timeline stop and next-step
  row has its own <b>+ Add</b>, so a document expands to whatever length it needs.
- **Three new planning blocks** beyond the original layout: <b>Risks &amp; Mitigations</b>,
  <b>Owners &amp; Dates</b>, and the <b>Metric Strip</b> \u2014 the parts a plan needs before
  anyone will actually approve it.
- **Page Format is now a menu, not a toggle.** The old Email/Webpage switch became a
  button that opens <b>Settings \u2192 \U0001F4CF Page Format</b>: pick <b>Email / Graphic</b>
  (620px, email-safe tables), <b>Webpage</b> (1100px), or <b>Document</b> (1080px), set a
  custom width, side padding and export style, and <b>save your own presets</b>. Your
  choice is remembered between sessions.

## v19.9 — The actual fix: Save / Preview / Saved · 22 July 2026

- **Found and fixed the real cause of the dead buttons.** A single missing
  <code>&lt;/div&gt;</code> in the Content Library editor (added back in v19.0) left that
  modal unclosed, so every dialog defined after it — <b>Save</b>, <b>Preview</b>,
  <b>Saved</b>, and the <b>toast</b> — was nested *inside* a permanently hidden
  container. They were opening correctly the whole time; they simply could never be
  seen. That's why Clear, Settings, and Copy worked while everything else appeared dead,
  and why the console showed no errors.
- Copy now shows its "Copied" confirmation again, for the same reason.
- Added a structural check to the build audit so an unclosed modal can't slip through
  again: every dialog must be a direct child of the page body.

## v19.8 — False-alarm fix · 21 July 2026

- **Removed the scary red banner false alarm.** The <code>ResizeObserver loop…</code>
  message is a harmless, self-correcting browser notice — but the v19.6 diagnostic was
  treating it as a crash and showing a "Startup issue" banner over a page that was
  actually fine. Benign warnings like this are now ignored; the banner only appears for
  genuine errors.
- **Fixed the canvas resize warning at its source** by deferring the heartbeat canvas's
  re-measure to the next animation frame, so the notice stops firing at all.
- **Made "Reset & reload" safe.** It previously wiped all browser storage, which could
  blank the page; it now clears only the builder's own saved data and reloads.
- <b>Clear</b> now also saves the emptied canvas and confirms with a toast.

## v19.7 — Private-mode fix (the dead buttons) · 21 July 2026

- **Fixed the frozen toolbar.** In Safari Private mode — and any browser where storage
  is disabled or over quota — <code>localStorage</code> throws the moment it's touched,
  which was quietly killing Save, Preview, Saved, and Start-a-Newsletter (the console
  showed no error because the failures were swallowed). All storage now goes through a
  crash-proof shim that falls back to in-memory storage for the session, so every button
  keeps working. This was the cause of the "buttons do nothing" reports.
- When running in that memory-only mode, a one-time note reminds you that local
  auto-save is off, so use <b>Save</b> (to GitHub) to keep your work.

## v19.6 — Diagnostics · 21 July 2026

- **Startup is now guarded and self-reporting.** If anything goes wrong while the page
  loads — most often a corrupt saved draft left over from an older version — you now get
  a red banner at the top naming the exact problem, plus a one-click <b>Reset &amp;
  reload</b> that clears the stored data and starts fresh. No more buttons that silently
  do nothing.
- Each startup step is isolated, so one bad step can't take down the rest of the page
  (the toolbar keeps working even if a saved draft won't load).

## v19.5 — Reliability (buttons & toasts) · 21 July 2026

- **The toast (that little confirmation popup) can no longer break anything.** It's now
  crash-proof and rebuilds itself if it's missing, so a copy always confirms with
  "Copied" and a stray failure can't take a button down with it.
- **Save / Preview / Saved are hardened.** Added a safety net that surfaces any
  unexpected error as a message instead of a button that silently does nothing.
- The toast no longer sits in front of anything, so it can't intercept a click.

## v19.4 — Content Library (generate fixes) · 21 July 2026

- **Generating a tip now fills everything.** The main headline, the description under
  it, and the tags all populate — previously the headline text was landing on the
  wrong line and the description/tags were left blank. Tips.json gained a proper
  \`description\` field for this.
- **Recipe stats expanded and fixed.** The featured recipe now shows six stats —
  Protein, Calories, Per Serving, Total Carbs, Net Carbs, and Sugar — and the cost
  gets its <b>$</b> back. Recipes.json carries the new carb/sugar values.
- **Recipe ingredients and steps generate properly.** Both lists now fill from the
  recipe (growing or trimming to the exact count), steps auto-number, and the
  instructions panel opens on its own so the steps are visible.
- The Content Library editors gained the matching fields (tip Description; recipe
  Total/Net Carbs and Sugar) so new entries can set them too.

## v19.3 — Content Library (docs & notes) · 21 July 2026

- **Fixed the release notes going blank.** A stray pair of backticks in the v19.0 note
  broke the notes renderer, so the whole Version & Notes tab could come up empty. Fixed,
  and the notes and docs now **self-heal**: if your browser is holding an older saved
  copy, the builder shows the current built-in version instead of a stale one. Your own
  edits (made in this build) are still kept, and <b>Reset to Default</b> restores these.
- **Docs expanded** with a full walkthrough of <b>Generate / Next / reroll</b>, how the
  reserved-then-published lifecycle keeps content from being used up before an issue is
  sent, and how to add/edit/delete items in the Content Library.

## v19.2 — Content Library (polish) · 21 July 2026

- **Tip Tuesday mini-cards pre-fill on start.** The four category cards (💧 Hydration,
  🥩 Protein, 😴 Sleep, 🧘 Mobility) now come in with their icon and label already
  filled — only the tip detail under each is left as ghost text.
- **Tips carry tags.** Each tip in the library has a Tags list, and generating a tip
  drops its tags into the pills above the main tip automatically. You can set tags when
  adding or editing a tip in the Content Library (one per line).
- **Sidebar tabs tidied.** Newsletter / Widgets / Tags now sit flush and inline in the
  left rail — the Tags pull-tab that stuck out is gone.

## v19.1 — Content Library (fix) · 21 July 2026

- **Library now finds the JSON files.** The loader was looking for lowercase
  filenames (\`tips.json\`) but the repo files are capitalized (\`Tips.json\`), and
  GitHub paths are case-sensitive — so every type showed "No items." It now reads
  the capitalized names that are actually in \`/backlog\`.
- **Fill bar no longer collides with the section controls.** The 🎲 Generate / 🔄 Next
  / reroll buttons had space reserved on both sides so the hover controls (theme,
  move, duplicate, delete) and the section-type tag no longer overlap them.

## v19.0 — Content Library · 20 July 2026

- **The builder now has a real content library.** Your Tip Tuesday tips, quotes,
  recipes, smarter swaps, budget proteins, and myth-busters live as JSON files in
  the repo's \`/backlog\` folder, each item carrying a lifecycle status:
  **available → reserved → published**.
- **Generate & Next, right in the sections.** Tip Tuesday, the header quote, and the
  recipe each got a small fill bar. **🎲 Generate** pulls an unused item and drops it
  in; **🔄 Next** swaps it for another (the skipped one comes back to the pool — it's
  only skipped for the current session, never lost).
- **Reroll one line of Tip Tuesday.** Beyond cycling the whole tip, you can reroll just
  the hydration, protein, sleep, or mobility line from that field's own pool.
- **Nothing is used up until you send.** Generating an item marks it *reserved* for the
  draft. When you save the newsletter with status **Sent**, every item it reserved is
  marked *published* with the issue name and date. Change your mind before sending and
  the reservations just release — no permanent "used" flag flipped by accident.
- **Content Library page** under Settings → 🌐 Content Library. Tabs per content type,
  search + status filter, and full add / edit / delete. Green dot = published, yellow =
  reserved, gray = available. No JSON editing by hand — the page does the file writes.
- Everything still lives in GitHub. No database, no Airtable, no Make, no monthly fees.

## v18.1 — Autopilot (fix) · 20 July 2026

- **Ghost text no longer disappears in the newsletter starter.** The date auto-fill
  in v18.0 was blanking the placeholders on the schedule and events blocks, so the
  event-name/time fields came up empty with nothing to show what went there. Every
  varying field now keeps its ghost text (Event Name, Time & details, etc.).
- **Static brand + section text is now pre-filled for real** when you start a
  newsletter: the header identity (LNGVTY Hub, Longevity Hub, Weekly Newsletter),
  the intro labels (Welcome, A Note From Tim), and each section's eyebrow/title
  (Upcoming Schedule, Recipe Corner, Mark Your Calendar, etc.). You're no longer
  retyping the same headings every week — only the quote, dates auto-fill, and the
  week's actual content are left to you. Weekly-varying fields stay ghost text.

## v18.0 — Autopilot · 20 July 2026

- **Newsletter starter now asks for the date first.** Pick any day in the send
  week and the starter snaps to that week's Sunday, then auto-fills the header
  date, all seven schedule day-dates (Sun–Sat), and next week's **Mark Your
  Calendar** date boxes. Empty days are just deleted — no typing dates by hand.
  "Skip dates" still builds a blank skeleton.
- **Widgets pane** added beside the mode dropdown (Tags moved to a pull-tab that
  hangs off the right edge). First widget: an orange, fully linkable **Button**
  you can drop into any layout — same editable label + link as the CTA sections.
- **Paragraph typing fixed.** In the "Note from Tim" (and any paragraph block),
  Enter now continues the *same* line style instead of resetting font/size/color.
  Enter on a blank line starts a new paragraph — so two Enters = new paragraph,
  no more adding paragraph blocks by hand.
- **Recipe steps auto-number.** Step badges renumber 1..n automatically on add,
  delete, and reorder. The number is no longer an editable field.
- **Remove individual schedule events** (the ✕ on each event under a day) and
  **remove recipe stats** (the ✕ on each stat) — no need to delete the whole day
  or rebuild the stat row.
- Weekly Schedule and Upcoming Events now start with all seven days laid out.

## v17.0 — The Backlog · 16 July 2026

- **Content Backlog pane** added under Settings, embedding the published Google
  Sheet content bank — Tip Tuesday, Smarter Swaps, Budget Proteins, Recipes,
  Quotes, and more, plus a Dashboard tab showing what's queued next for each
  category. Items marked \`USED\` gray out and strike through so nothing repeats.
- Same lazy-load pattern as the Feedback pane — it doesn't touch Google until you
  open the pane. The sheet stays editable in its own tab via a link in the pane.
- Docs updated with a Content Backlog row in the Settings reference.

## v16.0 — Sea of Signals · 13 July 2026

- **EKG backdrop rebuilt** as a dense, depth-sorted field of 18 traces in orange,
  gray, and white. Near lines are faster, thicker, and brighter; far lines are slow,
  thin, and faint. Drawn far-to-near so the near ones genuinely pass in front.
- **Feedback pane** added under Settings, with the bug/idea form embedded. The form
  loads lazily — it doesn't touch Google until you open the pane.
- **Version & Notes pane** added. Shows the current build and holds this document,
  editable in Markdown with a live preview.
- **Unsaved-changes guard.** Closing or reloading the tab with unsaved edits now
  prompts before you lose the work.
- README rewritten as a durable project description rather than a changelog.

## v15.0 — Newsletter Starter & Drag-to-Place · 13 July 2026

- **Fixed all copy buttons.** \`navigator.clipboard.writeText()\` rejects *silently*
  when the document isn't focused — a modal or a toast is enough to cause it — and the
  rejection was unhandled. Nothing reached the clipboard and nothing said so. Every
  copy path now runs through one hardened helper with an \`execCommand\` fallback.
- **Start a Newsletter** button: lays down the standard skeleton in reading order —
  header, note, schedule, tips, recipe, events, footer.
- **Drag-to-place.** Click a rail section to append it; *click and hold* to drag it
  between existing sections, with a drop indicator and a fall-in animation.
- **EKG backdrop** introduced, with a white shell around the document.
- Footer and Intro Box made available in Newsletter mode.
- Restored \`extractNewsletterJSON\` and \`readGhForm\`, silently dropped by an earlier
  refactor — Import and GitHub settings were both throwing.

## v14.0 — Settings Shell · 13 July 2026

- Toolbar cut to the three actions used constantly: **Save**, **Preview**, **Copy HTML**.
- Everything else moved behind a single **Settings** dialog — a sidebar of sections on
  the left, the chosen pane on the right.
- The dialog does **not** duplicate any UI. On first open it *relocates* each existing
  modal's body into its pane, so every control keeps its id and handler. There is
  exactly one of each input in the DOM.
- Global theme restored, under **Theme & Type**.

## v13.0 — Toolbar, Images & Customization · 13 July 2026

- **Image library** backed by the repo's \`images/\` folder, with thumbnails and upload.
  Photos are referenced **by URL**, not embedded as base64 — embedded images bloat the
  payload and get Gmail to clip the message.
- **Reset All Text to Brand Styling** — strips the fonts, sizes, and colors that come
  along when you paste from Word, Docs, or the web.
- Fixed **tag pills merging into one orange bar** on export. The gap between them came
  from the editor's flex \`gap\`, which is stripped on export; spacing now rides on each
  pill as an inline margin.
- Fixed the GitHub folder default (\`templates\` → \`saved\`), which only surfaced on a
  cleared cache or in incognito.
- Hardcoded the real Facebook / Instagram / Website URLs into all footers.
- Typography controls (heading font, body font, size, line height).
- Saved documents gained **thumbnail previews** and a **Preview** button that renders a
  document *without* loading it over your current work.

## v12.0 — Featured Recipe Imagery · 13 July 2026

- Optional, toggleable photo on the Featured Recipe section.
- Export is conditional in both directions: the block is omitted when the toggle is off
  *and* when it's on but no image was chosen — so a broken image can never ship.

## v11.0 — Keto Campaign & Library Expansion

- Authored a four-email drip campaign (days 7, 14, 21, 30), then harvested **18 new
  components** from it into the library, bringing the total to 72.
- Distributed the reusable pieces into their natural groups (lists, strips, embeds,
  offers, CTAs) rather than siloing them under one campaign heading.
- Saved-document library made to auto-refresh, so **Load** works without a manual reload.
- **View HTML** made editable for last-mile tweaks.

## v10.0 — Interface & Interchange

- Rail tab strip replaced with a dropdown; Tags pinned separately.
- Duplicate event sections consolidated; weekday field added under the date.
- **Copy Bundle** (HTML + section data) and **Import** on structured JSON.
- Tag and status persisted inside the document, so they survive a cache wipe.

## v9.0 — Layout Hardening

The flex-to-table converter produced the most instructive bugs in the project:

- **\`align-items: stretch\` → \`height:100%\`.** Flexbox stretches children to equal
  height implicitly; tables don't. Without the mapping, colored side-bars rendered only
  as tall as their own empty content, exposing the background through the gap.
- **\`flex: 1\` → \`width:100%\`.** A table shrinks to its content unless told otherwise,
  so white content cards stopped wherever the text ended.
- **Flex containers with no element children** — a numbered badge centering its own digit
  — are no longer tableized. Doing so produced a table with no cells and an empty circle.
  They're centered with \`text-align\` and \`line-height\` instead.
- Schedule and event rows **rewritten as hand-written tables**, removing them from the
  converter's remit entirely. A heuristic that must be right is a liability; explicit
  markup that cannot drift is an asset.

## v8.0 — GitHub Migration & the Structured Data Model

The architectural turning point.

- Retired **Airtable and Make**. The GitHub Contents API became the datastore: documents
  are JSON files under \`saved/\`, and Git supplies version history and backups for free.
- **Removed HTML import entirely**, eliminating the "Imported section" class of bug at
  its root.
- Defined the canonical schema (\`lngvty.newsletter/v1\`) and unified save/load onto a
  single lossless code path.

## v7.0 — Email-Safe Export

- Built the flex→table conversion, style inlining, and CSS-variable resolution pipeline.
- Established the automated structural audit across the whole library.

## v6.0 — Persistence (Airtable & Make)

- Saved-graphics library with name/tag/status/notes, via Make webhooks into Airtable.

## v5.0 — Newsletter Mode

- Graphics / Newsletter / Webpage modes sharing one component library and one canvas.
- Newsletter components ported and their fixed form fields converted to ghost text.

## v4.0 — Reordering & Layout Corrections

- Drag reordering; CTA alignment fixes; removable buttons; results-timeline toggle.

## v3.0 — Embeds, Links & Custom Sections

- Embed sections (GHL forms, MP4, MP3); editable hrefs everywhere; live preview.
- **Custom section builder**: paste HTML to create a new reusable component.

## v2.0 — Content Model & Dynamic Sections

- **Ghost text**: default copy became a visible suggestion that never leaks into export.
- Dynamic lists; per-section theming; merge-tag hotkeys; per-character color.

## v1.0 — First Interactive Builder

- Toggleable sections, fixed order, no persistence. Validated the concept before further
  investment.

## Phase 0 — Hand-Edited Templates

- Static HTML edited by hand per campaign. Established the design system.

---

## Known limitations

| Item | Detail |
|---|---|
| Token in \`localStorage\` | Writes need a GitHub token, held client-side. Accepted for a private two-person tool; a serverless proxy is the fix before any wider exposure. |
| No visual regression testing | Correctness is verified structurally, not visually. A section can pass every check and still look wrong. |
| Manual list numbering | Reordering a numbered list doesn't renumber its items. |
| View HTML edits are one-way | Tweaks there don't flow back to the canvas — by design. Reverse-parsing is the exact failure mode the architecture exists to avoid. |

## Verification

Every change is checked against the whole library, not just the part that was touched:

- all 72 sections export with no residual \`display:flex\`
- no builder-only chrome (controls, drop lines, list affordances) survives export
- no empty table rows — the signature of a failed component conversion
- no ghost-text prose leaks into the output
- every \`onclick\` in the DOM resolves to a real function *(this check exists because a
  refactor twice silently deleted adjacent functions)*
- section type identity survives a serialize → apply round trip

None of it substitutes for sending yourself a test email.
`;}

function defaultDocs(){return `<div class="docs-body">

<div class="tocard">
  <b>Start here</b><br>
  This tool builds the weekly newsletter and one-off graphics, then hands you finished HTML to paste into GoHighLevel. You never touch code. Everything you see on the page can be clicked and typed over.
  <br><br>
  <b>The 60-second version</b><br>
  Click <span class="btnrep orange">&#9889; Start a Newsletter</span> &rarr; type over the faded text &rarr; <span class="btnrep orange">&#128190; Save</span> &rarr; <span class="btnrep">&#128203; Copy HTML</span> &rarr; paste into GHL.
</div>

<div style="display:flex;gap:10px;flex-wrap:wrap;margin:14px 0 6px;">
  <button onclick="setPane('feedback')" style="background:var(--accent);color:#fff;border:none;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:13px;letter-spacing:.4px;padding:12px 20px;cursor:pointer;box-shadow:0 3px 10px rgba(224,90,27,.25);">&#128172; Send Feedback / Report a Bug</button>
  <button onclick="setPane('guides')" style="background:#1a1a1a;color:#fff;border:none;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:13px;letter-spacing:.4px;padding:12px 20px;cursor:pointer;">&#127909; Watch the Video Guides &rarr;</button>
</div>
<p style="font-size:13px;color:#888;margin:4px 0 0;">Found something broken or have an idea? The orange button jumps straight to the feedback form. Prefer to watch instead of read? The <b>Guides</b> tab has screen-recorded walkthroughs.</p>

<h2>1. The screen, in three parts</h2>

<table>
  <tr><th style="width:24%;">Where</th><th>What it's for</th></tr>
  <tr>
    <td><b>Left rail</b></td>
    <td>Your library of blocks. Pick <b>Newsletter</b>, <b>Graphics</b>, <b>Webpage</b>, or <b>Documentation</b> from the dropdown at the top. <b>Widgets</b> (next to it) holds drop-in pieces like a linkable orange button. <b>Tags</b> (the tab beside them) holds merge fields like the member's first name.</td>
  </tr>
  <tr>
    <td><b>Middle canvas</b></td>
    <td>The document itself. This is what your members will see. Click any text to edit it.</td>
  </tr>
  <tr>
    <td><b>Top bar</b></td>
    <td>Save, Preview, Copy HTML, Embed, Saved, and <span class="btnrep">&#9881; Settings</span> &mdash; everything else lives inside Settings. <b>&#128279; Embed</b> holds hidden tracking/embed codes that ride along in the exported HTML but never show on the canvas.</td>
  </tr>
</table>

<div class="note">
  <b>Faded text is a suggestion, not real text.</b> It's there to show you what belongs in that spot. If you leave it alone it will <b>not</b> appear in the email. Click it and type to make it real.
</div>

<h2>2. Build the weekly newsletter</h2>

<div class="bigstep"><div class="num">1</div><div class="stxt">
  <b>Make sure you're on the Newsletter tab</b>
  The dropdown at the top-left should say <b>Newsletter</b>. It opens there by default, so usually there's nothing to do.
</div></div>

<div class="bigstep"><div class="num">2</div><div class="stxt">
  <b>Click <span class="btnrep orange">&#9889; Start a Newsletter</span></b>
  It's the orange box at the top of the left rail. First it asks for the <b>newsletter date</b> &mdash; pick any day in the week you're sending. It then drops in the whole standard newsletter, already in the right order:
  <br><br>
  Header + Quote &rarr; A Note From Tim &rarr; Weekly Schedule &rarr; Tip Tuesday &rarr; Featured Recipe &rarr; Upcoming Events &rarr; Footer
  <br><br>
  Because you gave it the date, it also fills in the header date, all seven schedule day-dates for that week, and next week's <b>Mark Your Calendar</b> dates automatically. Everything else is faded placeholder text you fill in. (Use <b>Skip dates</b> if you'd rather do it by hand.)
</div></div>

<div class="bigstep"><div class="num">3</div><div class="stxt">
  <b>Fill in the header</b>
  The <b>Date</b> is already filled from the week you picked. Click the <b>"Quote"</b> line and type the week's quote. Everything else in the header is already correct.
</div></div>

<div class="bigstep"><div class="num">4</div><div class="stxt">
  <b>Write the note from Tim</b>
  Click the paragraph and type. <b>Press Enter for a new line</b> in the same style; press Enter again on a blank line to start a fresh paragraph &mdash; you don't need to add paragraph blocks by hand. You still can with <span class="btnrep">+ Add Paragraph</span>; remove one by hovering it and clicking the <span class="chip red">&times;</span>.
</div></div>

<div class="bigstep"><div class="num">5</div><div class="stxt">
  <b>Fill in the weekly schedule</b>
  All seven days are laid out with this week's dates already filled. Click the event name and time to edit them. Any day with nothing on it, just delete.
  <ul>
    <li><span class="btnrep">+ Add Day</span> &mdash; adds another row.</li>
    <li><span class="btnrep">&#65291; event</span> &mdash; puts a <b>second event on the same day</b> (no new row needed). Each event has its own <span class="chip red">&times;</span> to remove just that one.</li>
    <li><span class="chip">&#9650;</span> <span class="chip">&#9660;</span> &mdash; move a day up or down. Hover the row to see them.</li>
    <li><span class="chip red">&times;</span> &mdash; delete the whole day.</li>
  </ul>
</div></div>

<div class="bigstep"><div class="num">6</div><div class="stxt">
  <b>Tip Tuesday, the recipe, and the events</b>
  All three work the same way: click text to change it, and use the dashed <span class="btnrep">+ Add</span> buttons to add tips, ingredients, steps, or events. A few extras worth knowing:
  <ul>
    <li><b>Recipe photo</b> &mdash; click <span class="btnrep">+ Show Recipe Photo</span>, then pick an image from the library.</li>
    <li><b>Recipe steps number themselves</b> &mdash; add, remove, or reorder steps and they stay 1, 2, 3&hellip; automatically. No typing numbers.</li>
    <li><b>Recipe stats</b> &mdash; add stats with <span class="btnrep">+ stat</span>; remove any one with its <span class="chip red">&times;</span>.</li>
    <li><b>Mark Your Calendar</b> &mdash; starts with next week's seven dates already filled. Type in the events you have and delete the empty days.</li>
    <li><b>Tags</b> (like <span class="chip pill orange">Members Only</span>) &mdash; click <span class="btnrep">+ tag</span> to add one. Leave a tag blank and it simply won't show up.</li>
  </ul>
</div></div>

<div class="bigstep"><div class="num">7</div><div class="stxt">
  <b>Check it, then save it</b>
  Click <span class="btnrep">&#128065; Preview</span> to see exactly what lands in the inbox &mdash; there's a mobile toggle too, worth a look. Happy? Click <span class="btnrep orange">&#128190; Save</span>, give it a name, and it's stored.
</div></div>

<div class="bigstep"><div class="num">8</div><div class="stxt">
  <b>Send it</b>
  Click <span class="btnrep">&#128203; Copy HTML</span>. In GoHighLevel, make a new email, choose the <b>Custom HTML / Code</b> block, and paste.
  <br><br>
  <b>Always send yourself a test first.</b> The preview here is accurate, but a real inbox is the final word.
</div></div>

<h2>3. Adding and moving blocks</h2>

<table>
  <tr><th style="width:30%;">To do this</th><th>Do that</th></tr>
  <tr><td><b>Add a block to the bottom</b></td><td><b>Click</b> it once in the left rail.</td></tr>
  <tr><td><b>Drop a block in the middle</b></td><td><b>Click and hold</b> it in the rail, drag onto the page. A dashed <b>Drop here</b> line shows where it will land. Let go.</td></tr>
  <tr><td><b>Move a block already on the page</b></td><td>Hover it and use the <span class="chip">&#8593;</span> <span class="chip">&#8595;</span> buttons in its top-right corner.</td></tr>
  <tr><td><b>Copy a block</b></td><td>Hover it, click the <span class="chip">&#10697;</span> duplicate button.</td></tr>
  <tr><td><b>Delete a block</b></td><td>Hover it, click <span class="chip red">&times;</span>.</td></tr>
  <tr><td><b>Change a block's color</b></td><td>Hover it, click the theme button (<span class="chip">&#9679; Black</span> / <span class="chip">&#9680; Gray</span> / <span class="chip">&#9675; White</span>) to cycle it.</td></tr>
</table>

<h2>4. Text, links, and merge fields</h2>

<h3>Editing text</h3>
<p>Click and type. To color a few words, <b>select them</b> and a small bar appears &mdash; pick a color, or click <span class="btnrep">&#128279; Link</span> to turn them into a link.</p>

<h3>Changing where a button goes</h3>
<p>Hover the button and click the <span class="btnrep">&#128279; link</span> control next to it. Paste your URL. You never need to edit code to change a link.</p>

<div class="note">
  Facebook, Instagram, and the website link in the footers are <b>already set</b> to the real LNGVTY accounts. You don't need to touch them.
</div>

<h3>Merge fields (first name, etc.)</h3>
<p>Click into a text box where you want it, then open the <b>Tags</b> tab (top-left of the rail, next to Widgets) and click a field. It drops in at your cursor. <code>{{contact.first_name}}</code> becomes the member's actual first name when GHL sends it.</p>

<h3>Building a plan document</h3>
<p>Pick <b>Documentation</b> from the sections dropdown to get a set of blocks made for plans, proposals and strategy docs. Before you start, open <b>Settings &rarr; &#128207; Page Format</b> and choose <b>Document</b> &mdash; documents are much wider than an email, and this sets the canvas to match.</p>
<p>A typical plan reads in this order:</p>
<ul>
  <li><b>Document Masthead</b> &mdash; who it's for, what it is, and the headline claim.</li>
  <li><b>The Bet / Thesis</b> &mdash; the single big idea, stated so someone could disagree with it.</li>
  <li><b>Section Header</b> &mdash; an eyebrow, a title, and a rule. Use one before each major part.</li>
  <li><b>Color Track Header</b> &mdash; the colored banner for one thread of the plan. Hover it and click <span class="btnrep">&#9680; color</span> to cycle through green, plum, blue, amber, rust, and brand orange. Give each track its own color and the document explains itself at a glance.</li>
  <li><b>Promise Grid</b>, <b>Phase Columns</b>, <b>Mechanics Cards</b> &mdash; the substance of each track.</li>
  <li><b>Numbered Pillars</b> &mdash; hover any pillar for <span class="btnrep">+ Add example box</span> and <span class="btnrep">+ Add badges</span>. Both stay hidden until you turn them on, so cells don't get crowded.</li>
  <li><b>Route / Timeline</b> &mdash; the dark schedule block. Each stop is add/removable and reorderable.</li>
  <li><b>Production Table</b>, <b>Risks &amp; Mitigations</b>, <b>Owners &amp; Dates</b> &mdash; the operational half.</li>
  <li><b>Recommendation</b> &mdash; the orange close. Lead with what you want them to do.</li>
  <li><b>Document Footer Bar</b> &mdash; the thin dark strip at the very bottom.</li>
</ul>
<p>Every table, column set, card pair and timeline stop has its own <span class="btnrep">+ Add</span> button, so nothing is locked to the length it starts at. When you're done, <b>Copy HTML</b> gives you the finished page &mdash; or use your browser's Print &rarr; Save as PDF to hand someone a document.</p>

<h3>The Whole30 Investigation kit</h3>
<p>In the <b>Graphics</b> tab there's an <b>Investigation</b> sub-tab holding a full case-file set for the Whole30 challenge. The idea is that the member is the investigator, the food groups are the suspects, and how they feel each day is the evidence.</p>
<p>There are enough blocks to make a graphic for <b>every day</b> of the thirty:</p>
<ul>
  <li><b>Case File Cover</b> and <b>Investigator Briefing</b> — how the challenge opens.</li>
  <li><b>Suspect Board</b> — the interactive one. <b>Click any suspect card</b> and it turns over to show that food's aliases and suspected motives. Click the verdict stamp at the bottom to cycle <b>Under Investigation → Cleared → Guilty</b>. Whichever side you leave showing is the side that exports.</li>
  <li><b>Daily Mission</b>, <b>Anonymous Tip</b>, <b>Clue Card</b>, <b>Redacted Teaser</b> — the day-to-day drops.</li>
  <li><b>Symptom Log</b>, <b>Evidence Collected</b>, <b>Case Timeline</b> — tracking progress.</li>
  <li><b>The Raid</b> (pantry clean-out), <b>Interrogation</b>, <b>Stakeout Notes</b> — familiar sections in case-file dress.</li>
  <li><b>Investigator Badge</b> and <b>Case Closed</b> — the finish.</li>
</ul>
<p>Every one of them takes colors and shades like any other block, so you can re-tint the whole case file if a future challenge needs a different look.</p>

<h3>Colors: global and per-section</h3>
<p>There are two levels of color, and they work the same way.</p>
<ul>
  <li><b>Whole document</b> &mdash; <b>Settings &rarr; &#127912; Theme &amp; Type</b>. Changing the accent here re-colors everything at once.</li>
  <li><b>One section</b> &mdash; hover a block and click the small <b>color dot</b> in its controls. Pick a swatch or type a hex code. That section's rules, bullets, eyebrows and borders all follow it, and the rest of the document is untouched. This is how a plan runs a green track and a purple track side by side. Choose <b>&#10005;</b> to go back to the document color.</li>
</ul>
<p>The shade button next to it (<b>&#9675; White</b>) cycles the block background: <b>White &rarr; Cream &rarr; Gray &rarr; Black &rarr; Accent</b>. "Accent" follows whatever color that section is set to, so it stays correct if you re-color later.</p>
<p><b>Coloring words:</b> select any text and a small bar appears. Click <b>Color</b> for the full palette &mdash; every color in your current theme, a standing palette, and a hex box for anything else.</p>

<h3>Lists that grow</h3>
<p>Anywhere you see a dashed <span class="btnrep">+ Add</span> button, that block grows one item at a time &mdash; one benefit, one column, one card, one step. Rows re-centre themselves as you add or remove, so a set of three doesn't stretch awkwardly to fill four slots. Hover any item and click its <span class="chip red">&times;</span> to remove it. (A list always keeps at least one item, so a block can't collapse into nothing.)</p>

<h3>Widgets</h3>
<p>Open <b>Widgets</b> (next to the mode dropdown, top-left) for drop-in pieces you can add to any layout. Click one and it's appended to the canvas as its own block. The first widget is an orange <b>Button</b> &mdash; click its label to rename it, and use the <span class="btnrep">&#128279; link</span> control to set where it goes, exactly like the buttons in the CTA sections.</p>

<div class="note">
  <b>Heads up: hosted images are currently unreliable in Gmail.</b> Gmail (and some other clients) strip or block images that are loaded from a URL, so a photo that looks perfect in the preview can show up as a broken icon in the actual inbox. Until that's sorted, the safest way to put a logo or graphic into an email is an <b>HTML logo</b> (below), which is built from real HTML and can't be stripped.
</div>

<h3>HTML logos (Gmail-safe graphics)</h3>
<p>Because a plain image can get stripped, the builder lets you drop in <b>HTML logos</b> &mdash; small graphics made entirely out of HTML and CSS instead of an image file. They render the same everywhere and survive Gmail because there's no image for it to block.</p>
<ul>
  <li><b>Where they live:</b> <span class="btnrep">&#9881; Settings</span> &rarr; <b>&#128247; Images</b> &rarr; the <b>HTML Logos</b> tab.</li>
  <li><b>Make one:</b> paste your logo's HTML into the box. A <b>live preview</b> shows it as you type. Give it a name and click <b>Save to GitHub</b> &mdash; it's stored in the repo's <code>/logos</code> folder, exactly like images are stored in <code>/images</code>.</li>
  <li><b>Use one:</b> saved logos appear as real previews with their name underneath. On a <b>Featured Product</b> card or the <b>Featured Recipe</b>, click <span class="btnrep">Set photo</span> (or <span class="btnrep">+ Photo</span>), switch to the <b>HTML Logos</b> tab, and click a logo &mdash; it drops right into that photo spot as inline HTML. Pick one with no photo slot open and it drops in as its own centered block.</li>
</ul>
<p><b>Don't write HTML by hand?</b> You don't have to. Free online tools can generate the HTML/CSS for a simple logo or badge that you can paste straight in:</p>
<ul>
  <li><a href="https://www.canva.com/create/logos/" target="_blank" rel="noopener">Canva Logo Maker</a> &mdash; design a logo, then export/convert it (or recreate a simple version in HTML).</li>
  <li><a href="https://cssgradient.io/" target="_blank" rel="noopener">CSSGradient.io</a> &mdash; build the colored background for a logo tile and copy the CSS.</li>
  <li><a href="https://htmlcssbuttongenerator.com/" target="_blank" rel="noopener">HTML/CSS Button Generator</a> &mdash; good for badge- and pill-style marks.</li>
  <li><a href="https://www.w3schools.com/howto/howto_css_circles.asp" target="_blank" rel="noopener">W3Schools &mdash; shapes &amp; badges</a> &mdash; copy-paste recipes for circular and rounded marks.</li>
</ul>
<p>When in doubt, ask whoever set up the builder for a logo snippet &mdash; paste it into the HTML Logos tab once and it's saved for good.</p>

<h3>Reorganizing the blocks (Organize Sections)</h3>
<p>The left-rail blocks are grouped into tabs (Structure, Hero, Body, and so on). If that grouping doesn't match how you work, you can rearrange it: <span class="btnrep">&#9881; Settings</span> &rarr; <b>&#9776; Organize Sections</b>.</p>
<ul>
  <li><b>Move a block to another tab</b> &mdash; drag its chip into a different tab.</li>
  <li><b>Reorder tabs</b> &mdash; drag a tab by its header.</li>
  <li><b>Duplicate a block</b> &mdash; the <span class="chip">&#10697;</span> button copies a block so the same one can live in more than one tab.</li>
  <li><b>Rename</b> &mdash; click a block name or a tab name and type.</li>
  <li><b>New tabs</b> &mdash; <b>+ New tab</b> makes an empty one; drag blocks into it. Empty tabs can be deleted.</li>
  <li><b>Switch modes</b> &mdash; do all of the above separately for Graphics, Newsletter, Webpage, and Docs.</li>
</ul>
<div class="note">
  Organizing is <b>local to your browser only</b> &mdash; it changes how the rail looks for you, and never affects your saved newsletters or what gets exported. <b>Reset all</b> puts everything back to the defaults.
</div>

<h3>Filling sections from the content library</h3>
<p>Instead of typing tips, quotes, and recipes by hand every week, the builder keeps a <b>library</b> of them and drops them in for you. Tip Tuesday, the header quote, and the recipe each have a small dark <b>fill bar</b> across the top:</p>
<ul>
  <li><b>&#127922; Generate</b> &mdash; pulls a fresh, unused item from the library and fills the whole section with it. For a tip, that's the headline, all four category lines (hydration / protein / sleep / mobility), and the tags above it. For a quote, the quote and its credit. For a recipe, the name, stats, ingredients, and steps.</li>
  <li><b>&#128260; Next</b> &mdash; don't like what came up? This swaps it for a different one. The one you passed on goes right back in the pool; it's only set aside for the rest of this sitting, so you never lose it and you won't see the same one twice while you're deciding.</li>
  <li><b>reroll one</b> (Tip Tuesday only) &mdash; the small <b>Hydration / Protein / Sleep / Mobility</b> buttons change just that one line, pulling from that category's pool across all your tips. Handy when the main tip is perfect but one sub-line isn't.</li>
</ul>
<p><b>How "used" works &mdash; the safe part.</b> Generating an item doesn't burn it. It marks it <b>reserved</b> for the newsletter you're working on. It only becomes <b>published</b> (and stops coming up again) when you <b>Save the newsletter with its status set to Sent</b>. So you can generate, reject, and regenerate all you like while drafting &mdash; nothing is permanently used until the issue actually goes out. If you change your mind before sending, the reservations just quietly release.</p>
<p>The status of every item shows in the library as a colored dot: <b>gray = available</b>, <b>yellow = reserved</b> (in a draft), <b>green = published</b> (already sent).</p>

<h3>Managing the library (add / edit / delete)</h3>
<p>Open <b>Settings &rarr; &#127760; Content Library</b>. Across the top are tabs for each kind of content: Tip Tuesday, Smarter Swaps, Budget Proteins, Recipes, Quotes, and Myth Busters. Pick a tab to see every item in that pool.</p>
<ul>
  <li><b>+ Add</b> opens a form for that content type &mdash; fill it in and save. You never touch JSON; the builder writes the file for you.</li>
  <li><b>Edit</b> on any row changes it; <b>Del</b> removes it.</li>
  <li>Use the <b>search box</b> and the <b>status dropdown</b> to find things fast.</li>
  <li>For tips, there's a <b>Tags</b> box (one per line) &mdash; those are the pills that appear above the main tip when it's generated.</li>
</ul>
<p><b>Recipes: stats and tags are one-per-line.</b> A recipe's stats and tags each have their own box where you type <b>one entry per line</b> &mdash; just like the ingredients and steps boxes. This lets every recipe have its own mix of stats instead of a fixed set.</p>
<ul>
  <li><b>Stats box &mdash; amount first, then the label.</b> Put the number/amount at the start of the line and the label after a space. For example:
    <br><code>6g Protein</code>
    <br><code>210 Calories</code>
    <br><code>$2.75 Per Serving</code>
    <br><code>8g Net Carbs</code>
    <br>The builder reads each line and fills a stat block: the first word (<code>6g</code>, <code>210</code>, <code>$2.75</code>) becomes the big number, and the rest (<code>Protein</code>, <code>Calories</code>) becomes the label under it. Add or remove lines and the recipe grows or shrinks its stat blocks to match.</li>
  <li><b>Tags box &mdash; one tag per line.</b> For example:
    <br><code>Keto</code>
    <br><code>High Protein</code>
    <br><code>One Pot</code>
    <br>Each line becomes one of the pills shown on the recipe.</li>
</ul>
<p>When you place a recipe with <span class="btnrep">&#128214; Choose recipe&hellip;</span>, all of this fills in automatically &mdash; the name, stats, tags, ingredients, and steps.</p>
<p>Everything lives as JSON files in the <code>/backlog</code> folder of your GitHub repo, so it's versioned and backed up for free, just like your saved newsletters. Adding content here means it's instantly available to <b>&#127922; Generate</b> in the builder.</p>

<h2>5. Settings</h2>

<p>Click <span class="btnrep">&#9881; Settings</span> in the top bar. Pick a section on the left; it opens on the right.</p>

<table>
  <tr><th style="width:26%;">Section</th><th>What's in it</th></tr>
  <tr><td><b>&#127912; Theme &amp; Type</b></td><td>Colors for the whole document, fonts, text size, and <b>Reset All Text to Brand Styling</b> &mdash; see the tip below.</td></tr>
  <tr><td><b>&#128247; Images</b></td><td>Every image in the library, as thumbnails. Click one to use it, or upload a new one.</td></tr>
  <tr><td><b>&#8595; Export</b></td><td>Copy HTML, Copy Bundle, or Download the file.</td></tr>
  <tr><td><b>&#10216;&#10217; View HTML</b></td><td>The finished code. Click <b>&#9998; Edit</b> to hand-tweak it (rarely needed).</td></tr>
  <tr><td><b>&#128229; Import</b></td><td>Paste a saved bundle to rebuild a document.</td></tr>
  <tr><td><b>&#10010; New Section</b></td><td>Build your own reusable block by pasting in HTML.</td></tr>
  <tr><td><b>&#9776; Organize Sections</b></td><td>Rearrange the left-rail blocks: drag blocks between tabs, reorder or rename tabs, duplicate blocks, and make new tabs. Local to your browser; never affects saved work.</td></tr>
  <tr><td><b>&#9881; GitHub</b></td><td>Where documents are stored. Set up once, then forget it.</td></tr>
  <tr><td><b>&#128214; Docs</b></td><td>This guide. Click <b>&#9998; Edit</b> to change it. See also <b>&#127909; Guides</b> for video walkthroughs.</td></tr>
  <tr><td><b>&#127909; Guides</b></td><td>Screen-recorded walkthroughs &mdash; how to build a newsletter start to finish, plus a short video for each significant update.</td></tr>
  <tr><td><b>&#128203; Content Backlog</b></td><td>The rotating bank of tips, smarter swaps, budget proteins, recipes, and quotes. The <b>Dashboard</b> tab shows what's queued next. Mark an item <b>USED</b> after it runs so it isn't repeated.</td></tr>
  <tr><td><b>&#128207; Page Format</b></td><td>How wide the canvas is and how it exports. Choose <b>Email / Graphic</b>, <b>Webpage</b>, or <b>Document</b>, set a custom width and padding, and save your own presets.</td></tr>
  <tr><td><b>&#127760; Content Library</b></td><td>The editable version of that bank, stored as JSON in <code>/backlog</code>. Add, edit, or delete tips, quotes, recipes, swaps, proteins, and myths. Sections pull from here with <b>&#127922; Generate</b>; items go <b>reserved</b> when pulled and <b>published</b> when the newsletter is sent.</td></tr>
  <tr><td><b>&#128172; Feedback</b></td><td>A quick form to send notes or bug reports.</td></tr>
  <tr><td><b>&#8505; Version &amp; Notes</b></td><td>The current build number and the full release history. <b>&#9998; Edit</b> to annotate; <b>&#8634; Reset to Default</b> restores the built-in notes.</td></tr>
</table>

<div class="note">
  <b>Pasted text looking wrong?</b> Copying from Word, Google Docs, or a website drags its fonts and colors along with it. Go to <span class="btnrep">&#9881; Settings</span> &rarr; <b>Theme &amp; Type</b> &rarr; <span class="btnrep">&#129529; Reset All Text to Brand Styling</span>. It fixes the formatting and leaves your words alone.
</div>

<h2>6. Saving, reopening, and images</h2>

<h3>Saving</h3>
<p><span class="btnrep orange">&#128190; Save</span> asks for a <b>Name</b>, a <b>Tag</b>, a <b>Status</b>, and any <b>Notes</b>. Saving again with the same name updates that same document &mdash; it won't create a duplicate.</p>

<h3>Reopening something</h3>
<p>Click <span class="btnrep">&#9733; Saved</span>. Every document shows a small picture of itself. Three buttons on each:</p>
<ul>
  <li><span class="btnrep">&#128065; Preview</span> &mdash; look at it <b>without</b> opening it, so you don't lose what you're working on.</li>
  <li><span class="btnrep">&#128229; Load</span> &mdash; open it up and keep editing.</li>
  <li><span class="btnrep red">&#128465; Delete</span> &mdash; remove it.</li>
</ul>

<h3>Images</h3>
<p>Any time you add a photo, the image library opens. Click a picture to use it, or <b>Upload New Image</b> to add one. Uploaded images are saved and available forever after.</p>

<h2>7. If something looks off</h2>

<table>
  <tr><th style="width:38%;">What you're seeing</th><th>What to do</th></tr>
  <tr><td>The faded example text got sent in a real email</td><td>You typed in that box, so it became real. Clear the box completely and it won't appear.</td></tr>
  <tr><td>Pasted text is the wrong font or color</td><td>Settings &rarr; Theme &amp; Type &rarr; <b>Reset All Text to Brand Styling</b>.</td></tr>
  <tr><td>Copy button doesn't seem to do anything</td><td>Click on the page once, then try again. If it still fails, use Settings &rarr; View HTML and copy from there.</td></tr>
  <tr><td>Saved list is empty</td><td>Settings &rarr; GitHub, and check the connection.</td></tr>
  <tr><td>Stuck in the Tags or Widgets panel</td><td>Click the dropdown (Newsletter / Graphics / Webpage) to get back to the blocks.</td></tr>
  <tr><td>Email looks broken in the inbox</td><td>Note which block, and send it over. That's a bug worth fixing, not something you did wrong.</td></tr>
</table>

<div class="tocard">
  <b>The one rule</b><br>
  Always send yourself a test email before sending to everyone. It takes twenty seconds and catches everything.
</div>

</div>`;}
function getDocs(){
  try{
    const saved=localStorage.getItem('lngvty_docs');
    const ver=localStorage.getItem('lngvty_docs_ver');
    if(!saved || ver!==BUILD.version)return defaultDocs();
    return saved;
  }catch(e){return defaultDocs();}
}
function openDocs(){
  const view=document.getElementById('docsView');
  const ed=document.getElementById('docsEdit');
  const content=getDocs();
  if(view)view.innerHTML=content;
  if(ed)ed.value=content;
  openSettings('docs');
}
function closeDocs(){closeSettings();}
/* flip the docs pane between reading and editing */
function toggleDocsEdit(){
  const view=document.getElementById('docsView');
  const ed=document.getElementById('docsEdit');
  const foot=document.getElementById('docsEditFoot');
  const btn=document.getElementById('docsEditBtn');
  docsEditing=!docsEditing;
  if(docsEditing){
    ed.value=view.innerHTML;
    view.style.display='none';ed.style.display='block';foot.style.display='flex';
    btn.innerHTML='&#128065; Preview';
    ed.focus();
  }else{
    view.innerHTML=ed.value;
    view.style.display='block';ed.style.display='none';foot.style.display='none';
    btn.innerHTML='&#9998; Edit';
  }
}
function cancelDocsEdit(){
  docsEditing=false;
  document.getElementById('docsView').style.display='block';
  document.getElementById('docsEdit').style.display='none';
  document.getElementById('docsEditFoot').style.display='none';
  document.getElementById('docsEditBtn').innerHTML='&#9998; Edit';
}
function saveDocsEdit(){
  const val=document.getElementById('docsEdit').value;
  try{localStorage.setItem('lngvty_docs',val);localStorage.setItem('lngvty_docs_ver',BUILD.version);}catch(e){}
  document.getElementById('docsView').innerHTML=val;
  cancelDocsEdit();
  toast('Docs saved');
}
function resetDocs(){
  if(!confirm('Reset documentation to the default?'))return;
  try{localStorage.removeItem('lngvty_docs');localStorage.removeItem('lngvty_docs_ver');}catch(e){}
  document.getElementById('docsEdit').value=defaultDocs();
  document.getElementById('docsView').innerHTML=defaultDocs();
  toast('Docs reset');
}

/* ═══════════ ADD CUSTOM SECTION ═══════════ */
function openAddSection(){
  const t=document.getElementById('addHtml');if(t)t.value='';
  openSettings('newsec');
}
function closeAddSection(){closeSettings();}
function populateAddTabs(){
  const mode=document.getElementById('addMode')?.value||'graphics';
  const sel=document.getElementById('addTab');sel.innerHTML='';
  groupsForMode(mode).forEach(g=>{const o=document.createElement('option');o.value=g;o.textContent=g;sel.appendChild(o);});
  if(!sel.options.length){const o=document.createElement('option');o.value='Custom';o.textContent='Custom';sel.appendChild(o);}
}
function onAddModeChange(){populateAddTabs();}
function resolveAddTab(){
  const nw=document.getElementById('addNewTab').value.trim();
  if(nw)return nw;
  return document.getElementById('addTab').value||'Custom';
}
function customKey(name){return 'custom_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_'+Math.random().toString(36).slice(2,6);}
function saveCustomSection(){
  const name=document.getElementById('addName').value.trim();
  let raw=document.getElementById('addHtml').value.trim();
  if(!name){toast('Give the section a name');return;}
  if(!raw){toast('Paste some HTML first');return;}
  const tab=resolveAddTab();
  const theme=document.getElementById('addTheme').value;
  const cmode=document.getElementById('addMode')?.value||'graphics';
  const key=customKey(name);
  CUSTOM[key]={group:tab,name:name,icon:'◧',theme:theme,raw:raw,mode:cmode};
  if(!TABS.includes(tab))TABS.push(tab);
  persistCustom();
  if(openGroups===null)openGroups=new Set();
  openGroups.add(tab);
  setRailMode(cmode);
  renderRail();
  closeAddSection();
  toast('Section added to '+tab);
}
function insertAddPreview(){
  let raw=document.getElementById('addHtml').value.trim();
  if(!raw){toast('Paste some HTML first');return;}
  const theme=document.getElementById('addTheme').value;
  const sec=document.createElement('div');sec.className='sec';sec.dataset.key='__preview';
  sec.innerHTML=raw+controlsHTML();
  const tag=sec.querySelector('.sec-tag');if(tag)tag.textContent=(document.getElementById('addName').value.trim()||'Custom Preview');
  frame.appendChild(sec);
  applySecTheme(sec,theme);
  wireSec(sec);refreshState();
  closeAddSection();
  sec.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Test-inserted (not saved to a tab)');
}
function deleteCustom(key){
  if(!CUSTOM[key])return;
  if(!confirm('Delete this custom section from the palette?'))return;
  const tab=CUSTOM[key].group;
  delete CUSTOM[key];
  persistCustom();
  renderRail();
  toast('Custom section deleted');
}
function persistCustom(){try{localStorage.setItem('lngvty_custom',JSON.stringify({custom:CUSTOM,tabs:TABS}));}catch(e){}}
function loadCustom(){try{const d=localStorage.getItem('lngvty_custom');if(d){const o=JSON.parse(d);CUSTOM=o.custom||{};if(Array.isArray(o.tabs))TABS=o.tabs;}}catch(e){}}

function renderAddGuide(){
  document.getElementById('addGuide').innerHTML=`
  <h4>How to format your HTML</h4>
  Paste a single wrapper <code>&lt;div&gt;</code> containing your section. The builder makes every <code>contenteditable</code> element editable, recolors anything using the theme variables, and wires up special widgets automatically.
  <h4>Use theme variables (so colors stay in sync)</h4>
  <ul>
    <li><code>var(--accent)</code> — your orange (auto-recolors with the swatch)</li>
    <li><code>var(--secbg)</code> — section background; flips with the block&rsquo;s ●/◐/○ theme button</li>
    <li><code>var(--sectext)</code> / <code>var(--secmuted)</code> — heading &amp; muted text that flip with the theme</li>
    <li><code>var(--heading)</code> / <code>var(--body-text)</code> — global heading &amp; body colors</li>
  </ul>
  <span class="codeblock">&lt;div style="background:var(--secbg);padding:36px 48px;"&gt;
  &lt;div contenteditable="true" style="color:var(--sectext);"&gt;Editable heading&lt;/div&gt;
&lt;/div&gt;</span>
  <h4>Editable text</h4>
  Add <code>contenteditable="true"</code> to any element you want to type into. Selecting text inside it shows the inline <strong>color bar</strong> so you can recolor individual characters.
  <h4>Editable links / buttons</h4>
  Wrap a link so its destination can be changed without touching code:
  <span class="codeblock">&lt;span class="editable-link" data-href="https://example.com" style="position:relative;display:inline-block;"&gt;
  &lt;a contenteditable="true" href="https://example.com" style="..."&gt;Click Me&lt;/a&gt;
  &lt;button class="link-edit" type="button" onclick="openLinkModal(this)"&gt;🔗 link&lt;/button&gt;
&lt;/span&gt;</span>
  <h4>Repeatable lists (the &ldquo;+ Add&rdquo; button)</h4>
  Wrap each repeatable item in <code>&lt;div class="li-wrap"&gt;</code> with a delete button, place them in a <code>li-list</code> whose <code>data-proto</code> holds the HTML for a new item, and add the add-button:
  <span class="codeblock">&lt;div class="li-list" data-proto="&amp;lt;div class=&amp;quot;li-wrap&amp;quot;&amp;gt;...&amp;lt;button class=&amp;quot;li-del&amp;quot; onclick=&amp;quot;delLi(this)&amp;quot;&amp;gt;×&amp;lt;/button&amp;gt;&amp;lt;/div&amp;gt;"&gt;
  &lt;div class="li-wrap"&gt;Stat A &lt;button class="li-del" onclick="delLi(this)"&gt;×&lt;/button&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;button class="li-add" onclick="addLi(this)"&gt;+ Add stat&lt;/button&gt;</span>
  Note: the <code>data-proto</code> value must be HTML-escaped (use <code>&amp;lt;</code>, <code>&amp;quot;</code>). Easiest path: copy a built-in list section&rsquo;s markup via <em>View HTML</em> as a template.
  <h4>Embeds, video &amp; audio</h4>
  For a GHL form slot add <code>&lt;div class="embed-host" data-embed=""&gt;&lt;/div&gt;</code> plus a button calling <code>openEmbedEditor(this)</code>. For media use <code>&lt;div class="media-host" data-media-kind="video"&gt;</code> (or <code>audio</code>) containing a <code>&lt;video class="media-el"&gt;</code>/<code>&lt;audio class="media-el"&gt;</code> with a <code>&lt;source&gt;</code>, and a button calling <code>openMediaEditor(this)</code>.
  <h4>Safe to skip all of this</h4>
  Plain HTML works too — it just won&rsquo;t have editable text/links unless you add the attributes above. Use <strong>Test Insert</strong> to drop it on the canvas and check it before saving.`;
}

/* ═══════════ SAVE / LOAD ═══════════ */
let MEM=null;

/* ═══════════════════════════════════════════════════════════════════════
   CANONICAL NEWSLETTER MODEL  (structured section data — no HTML parsing)

   Every newsletter is described by this shape, which is exactly what the
   editor already knows before export. Saving writes this object; loading
   rebuilds the editor from it. Exported HTML is GENERATED from it on demand
   (buildExport) and is never the stored source of truth.

     {
       schema:    "lngvty.newsletter/v1",
       id:        "tip-tuesday-week-3",   // slug, also the filename in /saved
       name:      "Tip Tuesday – Week 3",
       tag:       "Newsletter",
       status:    "Draft",
       notes:     "...",
       updatedAt: "2026-…Z",
       theme:     { "--accent":"#e05a1b", … },   // global CSS theme vars
       sections:  [ { key, theme, html }, … ]     // one per canvas block
     }

   sections[].key   = the section TYPE (hero, calendar, recipe, …). This is
                      the identity that makes "Add Event" etc. keep working —
                      loadSections() rebuilds the live DOM and re-wires it,
                      so dynamic controls are never lost. No "Imported" blocks.
   sections[].html  = the edited inner HTML of that block (text, links, media).
   ════════════════════════════════════════════════════════════════════════ */
const NEWSLETTER_SCHEMA='lngvty.newsletter/v1';

/* slugify a name into a safe, stable file id */
function slugify(name){
  return String(name||'').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'newsletter';
}

/* read the canvas into the structured section list (no controls/tags) */
function serializeSections(){
  return [...frame.querySelectorAll('.sec')].map(s=>{
    const c=s.cloneNode(true);
    c.querySelectorAll('.sec-controls,.sec-tag,.fill-bar').forEach(e=>e.remove());
    const o={key:s.dataset.key,theme:s.dataset.theme||'white',html:c.innerHTML};
    // remember a per-section color override so it survives save/reload
    const acc=(s.style.getPropertyValue('--accent')||'').trim();
    if(acc)o.accent=acc;
    return o;
  });
}

/* read the current global theme vars */
function serializeTheme(){
  const cs=getComputedStyle(document.documentElement);const theme={};
  Object.values(THEME_VARMAP).forEach(cv=>theme[cv]=cs.getPropertyValue(cv).trim());
  return theme;
}

/* build a full canonical newsletter object from the current editor + metadata */
function serializeNewsletter(meta){
  meta=meta||{};
  return {
    schema:NEWSLETTER_SCHEMA,
    id:meta.id||slugify(meta.name),
    name:meta.name||'',
    tag:meta.tag||'',
    status:meta.status||'',
    notes:meta.notes||'',
    updatedAt:meta.updatedAt||new Date().toISOString(),
    theme:serializeTheme(),
    embeds:BG_EMBEDS,
    sections:serializeSections()
  };
}

/* apply a saved theme-vars object to the document + color inputs */
function applyThemeVars(theme){
  if(!theme)return;
  Object.entries(theme).forEach(([cv,val])=>{
    if(!val)return;
    document.documentElement.style.setProperty(cv,val);
    const key=Object.keys(THEME_VARMAP).find(k=>THEME_VARMAP[k]===cv);
    if(key){const inp=document.getElementById('col-'+key);if(inp)inp.value=val;const hx=document.getElementById('hex-'+key);if(hx)hx.textContent=val;}
  });
}

/* rebuild the canvas from a structured section list (replaces current canvas).
   This is the SINGLE load path — identical for localStorage and GitHub. */
function loadSections(sections,append){
  const S=allSections();
  if(!append)frame.querySelectorAll('.sec').forEach(s=>s.remove());
  (sections||[]).forEach(s=>{
    const sec=document.createElement('div');sec.className='sec';sec.dataset.key=s.key;
    sec.innerHTML=s.html+controlsHTML();
    const tag=sec.querySelector('.sec-tag');
    if(tag){
      let nm=S[s.key]?.name||'';
      if(!nm && s.key && s.key.startsWith('widget-')){const wk=s.key.slice(7);nm=(WIDGETS[wk]?.name||'Widget')+' (widget)';}
      tag.textContent=nm;
    }
    applySecTheme(sec,s.theme);
    if(s.accent){sec.style.setProperty('--accent',s.accent);sec.dataset.accent=s.accent;}
    wireSec(sec);frame.appendChild(sec);
  });
  refreshState();
}

/* load an entire canonical newsletter object into the editor */
/* Metadata of the newsletter currently loaded into the editor (name/tag/status/
   notes). Captured on load so the Save modal pre-fills them — this is what makes
   Tag & Status survive a delete-and-reload (they ride along in the GitHub JSON). */
let currentMeta={name:'',tag:'',status:'',notes:''};

function applyNewsletter(nl){
  if(!nl||typeof nl!=='object'){toast('That file isn\u2019t a valid newsletter');return false;}
  if(nl.schema && nl.schema!==NEWSLETTER_SCHEMA){
    // tolerate future minor versions but warn on a totally foreign shape
    if(!Array.isArray(nl.sections)){toast('Unrecognised file format');return false;}
  }
  applyThemeVars(nl.theme);
  BG_EMBEDS=Array.isArray(nl.embeds)?nl.embeds:[];
  loadSections(nl.sections||[]);
  // remember this newsletter's metadata so re-saving keeps Tag/Status/Notes
  currentMeta={name:nl.name||'',tag:nl.tag||'',status:nl.status||'',notes:nl.notes||''};
  try{localStorage.setItem('lngvty_current_meta',JSON.stringify(currentMeta));}catch(e){}
  return true;
}

/* client-side autosave (canvas + theme) to localStorage — silent.
   Stored in the legacy {secs,theme} shape that loadState() reads. */
function saveStateLocal(){
  const data=JSON.stringify({secs:serializeSections(),theme:serializeTheme(),embeds:BG_EMBEDS});
  try{localStorage.setItem('lngvty_builder',data);}catch(e){MEM=data;}
}

/* ═══════════ BACKGROUND EMBEDS ═══════════
   Hidden embed/tracking codes that ride along in the exported HTML (appended at
   the end) but never render on the canvas. Stored with the newsletter state. */
let BG_EMBEDS=[];
function openEmbeds(){renderEmbedList();document.getElementById('embedsBg').classList.add('show');}
function closeEmbeds(){document.getElementById('embedsBg').classList.remove('show');}
function renderEmbedList(){
  const host=document.getElementById('embedList');if(!host)return;host.innerHTML='';
  if(!BG_EMBEDS.length){host.innerHTML='<div style="color:#aaa;font-size:12px;padding:8px 0;">No embeds yet. Click “Add embed” to paste one.</div>';}
  BG_EMBEDS.forEach((em,i)=>{
    const row=document.createElement('div');
    row.style.cssText='border:1px solid #e6e6ea;border-radius:8px;padding:10px;background:#fafafa;';
    row.innerHTML=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
        <input type="text" value="${esc(em.label||'')}" placeholder="Label (e.g. Analytics pixel)" oninput="updateEmbed(${i},'label',this.value)" style="flex:1;padding:6px 9px;border:1px solid #ddd;border-radius:6px;font-size:12px;"/>
        <button class="tb-btn danger" onclick="removeEmbed(${i})" style="padding:5px 10px;font-size:11px;">Remove</button>
      </div>
      <textarea oninput="updateEmbed(${i},'code',this.value)" placeholder="Paste embed / tracking code here…" style="width:100%;min-height:80px;padding:8px;border:1px solid #ddd;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:11px;box-sizing:border-box;resize:vertical;">${esc(em.code||'')}</textarea>`;
    host.appendChild(row);
  });
}
function addEmbed(){BG_EMBEDS.push({label:'',code:''});renderEmbedList();}
function updateEmbed(i,key,val){if(BG_EMBEDS[i]){BG_EMBEDS[i][key]=val;}}
function removeEmbed(i){BG_EMBEDS.splice(i,1);renderEmbedList();saveStateLocal();}
function saveEmbeds(){
  BG_EMBEDS=BG_EMBEDS.filter(e=>(e.code||'').trim());
  saveStateLocal();closeEmbeds();
  const n=BG_EMBEDS.length;
  toast(n?('\u2713 '+n+' embed'+(n===1?'':'s')+' saved'):'Embeds cleared');
}
/* Build the hidden embed markup appended to the exported email. */
function buildEmbedMarkup(){
  const live=BG_EMBEDS.filter(e=>(e.code||'').trim());
  if(!live.length)return '';
  return '\n<!-- background embeds -->\n'+live.map(e=>
    (e.label?`<!-- ${String(e.label).replace(/--+/g,'-')} -->\n`:'')+e.code
  ).join('\n')+'\n';
}

/* ═══════════════════════════════════════════════════════════════════════
   GITHUB STORAGE

   Saved newsletters live as JSON files in a repo folder (default: /saved).
   Uses the GitHub REST Contents API — no extra service, free version
   history + backups, and everything lives next to the builder.

     SAVE  : PUT  /repos/{owner}/{repo}/contents/{dir}/{id}.json
     LIST  : GET  /repos/{owner}/{repo}/contents/{dir}
     LOAD  : GET  a file's download_url (raw JSON)

   Reads from a PUBLIC repo work with no token. WRITES (save/delete) always
   require a fine-grained personal-access token with Contents:read+write on
   the repo. A static page cannot hide a secret, so the token is entered once
   and kept in this browser's localStorage (see the GitHub Settings modal).
   ════════════════════════════════════════════════════════════════════════ */
const GH_API='https://api.github.com';
/* Default GitHub storage target. Newsletters are stored as JSON files in
   github.com/senviskyec/LNGVTY-HTML-Builder under /templates. Anything saved
   in the GitHub settings modal (especially the token) overrides these. */
const GH_DEFAULTS={owner:'senviskyec',repo:'LNGVTY-HTML-Builder',dir:'saved',branch:'',imagedir:'images'};
function ghConfig(){
  let saved={};
  try{saved=JSON.parse(localStorage.getItem('lngvty_github')||'{}');}catch(e){saved={};}
  return Object.assign({},GH_DEFAULTS,saved);
}
function setGhConfig(cfg){
  try{localStorage.setItem('lngvty_github',JSON.stringify(cfg||{}));}catch(e){}
}
function ghReady(){const c=ghConfig();return !!(c.owner&&c.repo);}
function ghDir(){const c=ghConfig();return (c.dir||'saved').replace(/^\/+|\/+$/g,'')||'saved';}
function ghHeaders(needWrite){
  const c=ghConfig();const h={'Accept':'application/vnd.github+json'};
  if(c.token)h['Authorization']='Bearer '+c.token;
  return h;
}
function ghContentsURL(path){
  const c=ghConfig();
  const branch=c.branch?('?ref='+encodeURIComponent(c.branch)):'';
  return `${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}${branch}`;
}
/* base64-encode UTF-8 safely (handles emoji / non-Latin1) */
function b64encode(str){return btoa(unescape(encodeURIComponent(str)));}
function b64decode(str){try{return decodeURIComponent(escape(atob(str.replace(/\s/g,''))));}catch(e){return atob(str.replace(/\s/g,''));}}

/* list newsletter JSON files in the saved/ folder */
async function ghList(){
  if(!ghReady())throw new Error('GitHub not configured');
  const res=await fetch(ghContentsURL(ghDir()),{headers:ghHeaders(),cache:'no-store'});
  if(res.status===404)return [];               // folder doesn't exist yet
  if(!res.ok)throw new Error('GitHub list failed ('+res.status+')');
  const arr=await res.json();
  return (Array.isArray(arr)?arr:[]).filter(f=>f.type==='file'&&/\.json$/i.test(f.name))
    .map(f=>({name:f.name,path:f.path,sha:f.sha,download_url:f.download_url}));
}
/* fetch + parse one newsletter file by its raw download url */
async function ghLoadFile(file){
  const url=file.download_url||ghContentsURL(file.path);
  const res=await fetch(url,{headers:file.download_url?{}:ghHeaders(),cache:'no-store'});
  if(!res.ok)throw new Error('GitHub load failed ('+res.status+')');
  return await res.json();
}
/* look up the current sha for a path (needed to UPDATE an existing file) */
async function ghGetSha(path){
  const res=await fetch(ghContentsURL(path),{headers:ghHeaders(),cache:'no-store'});
  if(res.status===404)return null;
  if(!res.ok)throw new Error('GitHub stat failed ('+res.status+')');
  const j=await res.json();return j.sha||null;
}
/* create or update a newsletter file; returns the API response */
async function ghPut(nl){
  const c=ghConfig();
  if(!c.token)throw new Error('A GitHub token is required to save.');
  const path=`${ghDir()}/${nl.id}.json`;
  const body={
    message:`builder: save "${nl.name||nl.id}"`,
    content:b64encode(JSON.stringify(nl,null,2))
  };
  if(c.branch)body.branch=c.branch;
  const existing=await ghGetSha(path);
  if(existing)body.sha=existing;            // update in place (no duplicate)
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`,{
    method:'PUT',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)
  });
  if(!res.ok){let msg='';try{msg=(await res.json()).message||'';}catch(e){}throw new Error('GitHub save failed ('+res.status+') '+msg);}
  return await res.json();
}
/* delete a newsletter file */
async function ghDelete(path,sha){
  const c=ghConfig();
  if(!c.token)throw new Error('A GitHub token is required to delete.');
  if(!sha)sha=await ghGetSha(path);
  const body={message:`builder: delete ${path}`,sha};
  if(c.branch)body.branch=c.branch;
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`,{
    method:'DELETE',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)
  });
  if(!res.ok){let msg='';try{msg=(await res.json()).message||'';}catch(e){}throw new Error('GitHub delete failed ('+res.status+') '+msg);}
  return await res.json();
}

/* ════════════════════════════════════════════════════════════════════════
   CONTENT LIBRARY  ·  /backlog/*.json
   A lightweight CMS on top of the same GitHub Contents API. Each content type
   is one JSON file whose items share a lifecycle:
     available → reserved (pulled into a draft) → published (newsletter sent)
   "Generate" reserves an available item; "Next" skips it for THIS session only
   (in-memory) and reserves another; sending the newsletter publishes every
   item reserved by it; deleting/!sent releases them back to available.
   ════════════════════════════════════════════════════════════════════════ */
const LIB_TYPES={
  tips     :{file:'Tips.json',     label:'Tip Tuesday',      noun:'tip'},
  swaps    :{file:'Swaps.json',    label:'Smarter Swaps',    noun:'swap'},
  proteins :{file:'Proteins.json', label:'Budget Proteins',  noun:'protein'},
  recipes  :{file:'Recipes.json',  label:'Recipes',          noun:'recipe'},
  quotes   :{file:'Quotes.json',   label:'Quotes',           noun:'quote'},
  myths    :{file:'Myths.json',    label:'Myth Busters',     noun:'myth'}
};
const LIB_DIR='backlog';
/* in-memory cache of each loaded file: {type:{doc, sha}} */
const LIB_CACHE={};
/* items skipped via "Next" this session only — released, not persisted-skipped */
const LIB_SKIPPED={};   // {type: Set(ids)}
function libSkipSet(type){return (LIB_SKIPPED[type]||(LIB_SKIPPED[type]=new Set()));}

function libPath(type){return LIB_DIR+'/'+LIB_TYPES[type].file;}
function libEmptyDoc(type){return {schema:'lngvty.content/v1',type,updatedAt:new Date().toISOString(),items:[]};}

/* fetch a content file (cached). Falls back to an empty doc if it doesn't exist. */
async function libLoad(type,force){
  if(!force && LIB_CACHE[type])return LIB_CACHE[type];
  if(!ghReady())throw new Error('Connect GitHub first (⚙ GitHub).');
  const res=await fetch(ghContentsURL(libPath(type)),{headers:ghHeaders(),cache:'no-store'});
  if(res.status===404){LIB_CACHE[type]={doc:libEmptyDoc(type),sha:null};return LIB_CACHE[type];}
  if(!res.ok)throw new Error('Library load failed ('+res.status+')');
  const j=await res.json();
  let doc;try{doc=JSON.parse(b64decode(j.content));}catch(e){doc=libEmptyDoc(type);}
  if(!doc.items)doc.items=[];
  LIB_CACHE[type]={doc,sha:j.sha||null};
  return LIB_CACHE[type];
}
/* write a content file back to GitHub (updates cache sha) */
async function libSave(type,message){
  const c=ghConfig();
  if(!c.token)throw new Error('A GitHub token is required to update the library.');
  const entry=LIB_CACHE[type];if(!entry)throw new Error('Nothing loaded for '+type);
  entry.doc.updatedAt=new Date().toISOString();
  const body={message:message||('library: update '+type),content:b64encode(JSON.stringify(entry.doc,null,2))};
  if(c.branch)body.branch=c.branch;
  if(entry.sha)body.sha=entry.sha;
  const res=await fetch(`${GH_API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${libPath(type)}`,{
    method:'PUT',headers:Object.assign({'Content-Type':'application/json'},ghHeaders(true)),body:JSON.stringify(body)
  });
  if(!res.ok){let m='';try{m=(await res.json()).message||'';}catch(e){}throw new Error('Library save failed ('+res.status+') '+m);}
  const j=await res.json();entry.sha=j.content&&j.content.sha||entry.sha;
  return j;
}
function libItems(type){return (LIB_CACHE[type]&&LIB_CACHE[type].doc.items)||[];}
function libFind(type,id){return libItems(type).find(x=>x.id===id);}
function libAvailable(type){
  const skip=libSkipSet(type);
  return libItems(type).filter(x=>x.status==='available' && !skip.has(x.id));
}
function libNextId(type,noun){
  const items=libItems(type);let n=0;
  items.forEach(x=>{const m=String(x.id).match(/(\d+)$/);if(m)n=Math.max(n,+m[1]);});
  return (noun||LIB_TYPES[type].noun)+'-'+String(n+1).padStart(3,'0');
}

/* Reserve the next available item of a type for the current newsletter.
   Returns the reserved item, or null if the pool is empty. Persists to GitHub. */
async function libReserve(type){
  await libLoad(type);
  const pool=libAvailable(type);
  if(!pool.length)return null;
  const item=pool[Math.floor(Math.random()*pool.length)];
  item.status='reserved';
  item.reservedBy=currentNewsletterKey();
  item.updatedAt=new Date().toISOString();
  try{await libSave(type,'library: reserve '+item.id);}catch(e){toast('Reserved locally — GitHub sync failed');}
  return item;
}
/* Reserve a SPECIFIC item chosen from the picker (deliberate, not random). */
async function libReserveSpecific(type,id){
  await libLoad(type);
  const item=libFind(type,id);if(!item)return null;
  if(item.status==='available'||!item.status){
    item.status='reserved';item.reservedBy=currentNewsletterKey();item.updatedAt=new Date().toISOString();
    try{await libSave(type,'library: reserve '+item.id);}catch(e){toast('Reserved locally — GitHub sync failed');}
  }
  return item;
}
/* Release a specific reserved item back to available (used by "Next" + unpublish). */
async function libRelease(type,id,persist){
  const item=libFind(type,id);if(!item)return;
  if(item.status==='reserved'){item.status='available';item.reservedBy=null;item.updatedAt=new Date().toISOString();
    if(persist){try{await libSave(type,'library: release '+id);}catch(e){}}}
}
/* identifier for the newsletter currently in the editor (used as reservedBy). */
function currentNewsletterKey(){
  const nm=(currentMeta&&currentMeta.name)||'';
  return nm?slugify(nm):'draft';
}

/* When a newsletter is SENT: publish every item this newsletter reserved.
   When it's NOT sent (draft/review): leave reservations intact so they're held.
   Call from confirmSave with the chosen status + issue label. */
async function libSyncOnSave(status,issueLabel){
  const key=currentNewsletterKey();
  const sent=/sent|publish/i.test(status||'');
  // items may have been reserved before the newsletter had a name (key "draft"),
  // so a Sent newsletter claims anything reserved under its own key OR "draft".
  const claims=id=>id===key||id==='draft';
  for(const type of Object.keys(LIB_TYPES)){
    const entry=LIB_CACHE[type];if(!entry)continue;
    let changed=false;
    entry.doc.items.forEach(it=>{
      if(it.status==='reserved' && claims(it.reservedBy) && sent){
        it.status='published';it.publishedIn=issueLabel||key;it.publishedDate=isoDate(new Date());it.updatedAt=new Date().toISOString();changed=true;
      } else if(it.status==='reserved' && it.reservedBy==='draft' && key!=='draft'){
        // newsletter now has a name — claim its draft reservations so a later
        // send (or a release) can find them by the newsletter's key.
        it.reservedBy=key;it.updatedAt=new Date().toISOString();changed=true;
      }
    });
    if(changed){try{await libSave(type,'library: sync for '+ (issueLabel||key));}catch(e){}}
  }
}

/* ── Rendering a reserved item into the active section on the canvas ── */
/* Each returns true on success. They locate the matching section by data-key
   and set field text (real content, not ghost), then mark non-empty. */
function libSetField(el,val){if(!el)return;el.textContent=val==null?'':String(val);markEmpty(el);}
function sectionByKey(key){return frame.querySelector('.sec[data-key="'+key+'"]');}

function fillTip(item,only){
  const sec=sectionByKey('nltip');if(!sec)return false;
  const c=item.content||{};
  const eds=[...sec.querySelectorAll('[contenteditable][data-ph]')];
  const byPh=re=>eds.find(e=>re.test(e.getAttribute('data-ph')||''));
  // main headline is the big white line ("Recovery Is Where Results Happen"),
  // description is the muted paragraph right under it ("You don't get stronger…").
  if(!only||only==='main'){
    const headline=byPh(/where results happen|this week's headline|main tip/i);
    if(headline && c.main)libSetField(headline,c.main);
    const desc=byPh(/you don't get stronger|prioritize these four|short intro/i);
    if(desc && c.description)libSetField(desc,c.description);
  }
  // sub-tips: match the four cards by their accent label
  const subs=[['hydration',c.hydration],['protein',c.protein],['sleep',c.sleep],['mobility',c.mobility]];
  subs.forEach(([label,val])=>{
    if(only && only!==label && only!=='all')return;
    const labelCell=eds.find(e=>(e.getAttribute('data-ph')||'').toLowerCase()===label);
    if(labelCell){
      const card=labelCell.closest('.li-wrap')||labelCell.parentElement;
      const cends=card?[...card.querySelectorAll('[contenteditable]')]:[];
      const detail=cends[cends.length-1];
      if(detail&&detail!==labelCell&&val)libSetField(detail,val);
    }
  });
  // tags above the main tip
  if(!only||only==='main'){
    if(Array.isArray(c.tags))setSectionTags(sec,c.tags);
  }
  return true;
}
/* Replace the pills in a section's first tag-wrap with the given tag strings,
   reusing the wrap's own prototype so styling/×/＋ behavior stays intact. */
function setSectionTags(sec,tags){
  const wrap=sec.querySelector('.tag-wrap');if(!wrap)return;
  const proto=wrap.getAttribute('data-proto')||'';
  const addBtn=wrap.querySelector('.tag-add');
  wrap.querySelectorAll(':scope > .tag-pill').forEach(p=>p.remove());
  (tags.length?tags:['']).forEach(t=>{
    const tmp=document.createElement('div');tmp.innerHTML=proto;
    const pill=tmp.firstElementChild;
    const span=pill.querySelector('[contenteditable]');
    if(span && t){span.textContent=t;markEmpty(span);}
    if(addBtn)wrap.insertBefore(pill,addBtn);else wrap.appendChild(pill);
  });
}
function fillQuote(item){
  const sec=sectionByKey('nlheader');
  if(!sec){toast('Add a Newsletter Header section first');return false;}
  const c=item.content||{};
  const quote=c.quote||c.text||c.body||'';
  if(!quote){toast('That quote item has no text');return false;}
  const eds=[...sec.querySelectorAll('[contenteditable][data-ph]')];
  let q=eds.find(e=>/quote/i.test(e.getAttribute('data-ph')||''));
  if(!q)q=eds.find(e=>/this week/i.test(e.getAttribute('data-ph')||''));
  if(!q){toast('Could not find the quote line in the header');return false;}
  libSetField(q,c.credit?('“'+quote+'” — '+c.credit):('“'+quote+'”'));
  return true;
}
function fillSwap(item){
  const sec=sectionByKey('nltip');   // swaps often live in a tip/callout; fall back to a toast
  const c=item.content||{};
  toast('Swap: '+c.instead+' → '+c.swap);
  return insertContentBlock('Smarter Swap',
    `<b>${c.instead}</b> (${c.insteadCals} cal) → <b>${c.swap}</b> (${c.swapCals} cal) · saves ${c.saved} cal`);
}
function fillProtein(item){
  const c=item.content||{};
  return insertContentBlock('Budget Protein',
    `<b>${c.name}</b> — ${c.protein}g protein / ${c.serving} · ${c.price} (${c.per10g}/10g)`);
}
function fillMyth(item){
  const c=item.content||{};
  return insertContentBlock('Myth Buster',
    `<b>MYTH:</b> ${c.myth}<br><b>TRUTH:</b> ${c.truth}`);
}
function fillRecipe(item){
  const sec=sectionByKey('nlrecipe');const c=item.content||{};
  if(!sec){toast('Add a Recipe section first');return false;}
  const eds=[...sec.querySelectorAll('[contenteditable][data-ph]')];
  const name=eds.find(e=>/sheet pan|recipe name/i.test(e.getAttribute('data-ph')||''));
  if(name&&c.name)libSetField(name,c.name);
  // subtitle → time · servings
  const desc=eds.find(e=>/one-pan|simple, high-protein/i.test(e.getAttribute('data-ph')||''));
  if(desc){const bits=[c.time,c.servings&&(c.servings+' servings')].filter(Boolean).join(' · ');if(bits)libSetField(desc,bits);}
  // stats — now a free-text list, one per line "6g Protein" (amount first, label rest).
  // Grow/shrink the stat row to match, then write amount + label into each cell.
  const stats=parseStatLines(c.stats);
  if(stats.length)fillStatRow(sec,stats);
  // tags — free-text list, one tag per line.
  if(Array.isArray(c.tags)&&c.tags.length)fillTagWrap(sec,c.tags.filter(t=>String(t).trim()));
  // ingredients → the non-step list; steps → the step-num list
  const lists=[...sec.querySelectorAll('.li-list')];
  const stepList=lists.find(l=>/step-num/.test(l.getAttribute('data-proto')||''));
  const ingList=lists.find(l=>l!==stepList);
  if(ingList&&Array.isArray(c.ingredients))fillList(ingList,c.ingredients);
  if(stepList&&Array.isArray(c.steps)){
    fillList(stepList,c.steps);
    // steps live in a collapsed panel by default — reveal it so they show
    const panel=sec.querySelector('.nl-steps');
    const toggle=sec.querySelector('.nl-steptoggle');
    if(panel&&panel.dataset.on!=='1'&&toggle)toggleRecipeSteps(toggle);
  }
  // image, if provided and a photo toggle exists
  if(c.image){
    const pic=sec.querySelector('.nl-rpic');const img=sec.querySelector('.nl-rpic-img');
    if(pic&&img){img.src=c.image;pic.dataset.on='1';pic.dataset.src=c.image;pic.style.display='block';
      const tg=sec.querySelector('.nl-rpictoggle');if(tg){tg.dataset.on='1';tg.textContent='\u2212 Hide Recipe Photo';}}
  }
  return true;
}
/* Split a free-text stat line into [amount, label]: the first whitespace-delimited
   token is the amount ("6g", "$3.50", "520"), the rest is the label ("Protein"). */
function parseStatLines(lines){
  if(!Array.isArray(lines))lines=(lines==null?'':String(lines)).split('\n');
  return lines.map(l=>String(l).trim()).filter(Boolean).map(l=>{
    const i=l.indexOf(' ');
    if(i<0)return [l,''];              // one token → treat as the amount
    return [l.slice(0,i).trim(), l.slice(i+1).trim()];
  });
}
/* Grow/shrink the recipe stat row to N cells and write amount+label into each. */
function fillStatRow(sec,pairs){
  const row=sec.querySelector('.stat-row');if(!row)return;
  const addBtn=row.querySelector('.stat-add');
  let cells=[...row.querySelectorAll(':scope > .stat-cell')];
  while(cells.length<pairs.length && addBtn){addStat(addBtn);cells=[...row.querySelectorAll(':scope > .stat-cell')];}
  for(let i=cells.length-1;i>=pairs.length && i>0;i--){const del=cells[i].querySelector('.li-del');if(del)delStat(del);}
  cells=[...row.querySelectorAll(':scope > .stat-cell')];
  pairs.forEach((p,i)=>{
    const cell=cells[i];if(!cell)return;
    const ce=cell.querySelectorAll('[contenteditable]');
    if(ce[0])libSetField(ce[0],p[0]);
    if(ce[1])libSetField(ce[1],p[1]);
  });
}
/* Grow/shrink the recipe tag row to match and write each tag. */
function fillTagWrap(sec,tags){
  const wrap=sec.querySelector('.tag-wrap');if(!wrap)return;
  const addBtn=wrap.querySelector('.tag-add');
  let pills=[...wrap.querySelectorAll(':scope > .tag-pill')];
  while(pills.length<tags.length && addBtn){addTag(addBtn);pills=[...wrap.querySelectorAll(':scope > .tag-pill')];}
  for(let i=pills.length-1;i>=tags.length && i>0;i--){pills[i].remove();}
  pills=[...wrap.querySelectorAll(':scope > .tag-pill')];
  tags.forEach((t,i)=>{const pill=pills[i];if(!pill)return;const ce=pill.querySelector('[contenteditable]');if(ce)libSetField(ce,t);});
}
/* fill a li-list with array values, growing/shrinking it to match the array */
function fillList(list,arr){
  if(!list||!Array.isArray(arr))return;
  const addBtn=list.nextElementSibling;
  // grow to at least arr.length rows
  let wraps=[...list.querySelectorAll(':scope > .li-wrap')];
  while(wraps.length<arr.length && addBtn && addBtn.classList.contains('li-add')){
    addLi(addBtn);wraps=[...list.querySelectorAll(':scope > .li-wrap')];
  }
  // remove extra rows beyond arr.length (keep at least 1)
  wraps=[...list.querySelectorAll(':scope > .li-wrap')];
  for(let i=wraps.length-1;i>=arr.length && i>0;i--){
    const del=wraps[i].querySelector('.li-del');if(del)delLi(del);
  }
  // write values
  wraps=[...list.querySelectorAll(':scope > .li-wrap')];
  arr.forEach((val,i)=>{
    const wrap=wraps[i];if(!wrap)return;
    const ed=wrap.querySelector('[contenteditable]:not(.step-num)');
    if(ed)libSetField(ed,val);
  });
  renumberSteps(list);
}
/* generic: append a simple content block section to the canvas */
function insertContentBlock(label,html){
  const sec=document.createElement('div');sec.className='sec';sec.dataset.key='content-block';
  sec.innerHTML=`<div style="background:var(--secbg);padding:24px 48px;border-bottom:1px solid #eee;">
    <div style="font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:8px;">${label}</div>
    <div contenteditable="true" style="font-size:14px;color:var(--sectext);line-height:1.7;">${html}</div>
  </div>`+controlsHTML();
  const tag=sec.querySelector('.sec-tag');if(tag)tag.textContent=label;
  frame.appendChild(sec);applySecTheme(sec,'white');wireSec(sec);refreshState();saveStateLocal();
  sec.scrollIntoView({behavior:'smooth',block:'center'});
  return true;
}

const LIB_FILLERS={tips:fillTip,quotes:fillQuote,swaps:fillSwap,proteins:fillProtein,myths:fillMyth,recipes:fillRecipe};

/* PUBLIC: Generate — reserve an available item and drop it into the section.
   Tracks which item is currently placed per type so "Next" can release it. */
const LIB_PLACED={};   // {type:id}
async function libGenerate(type,only){
  try{
    const item=await libReserve(type);
    if(!item){toast('No available '+LIB_TYPES[type].label+' left — add more in the Content Library');return;}
    LIB_PLACED[type]=item.id;
    (LIB_FILLERS[type]||(()=>{}))(item,only);
    refreshState();saveStateLocal();
    toast('\u2713 '+LIB_TYPES[type].label+' filled');
  }catch(e){toast(e.message||'Could not generate');}
}
/* PUBLIC: Next — skip the current item this session, reserve+place another. */
async function libNext(type,only){
  const cur=LIB_PLACED[type];
  if(cur){libSkipSet(type).add(cur);await libRelease(type,cur,true);}
  await libGenerate(type,only);
}

/* ── LIBRARY PICKER: choose a specific item (no randomness). ── */
let libPickType=null, libPickItems=[];
async function openLibPicker(type){
  libPickType=type;
  const label=(LIB_TYPES[type]&&LIB_TYPES[type].label)||'Item';
  document.getElementById('libPickTitle').textContent='📖 Choose a '+label.replace(/s$/,'');
  document.getElementById('libPickNote').textContent='';
  document.getElementById('libPickSearch').value='';
  document.getElementById('libPickStatus').textContent='';
  document.getElementById('libPickList').innerHTML='<div style="color:#aaa;font-size:12px;padding:10px;">Loading…</div>';
  document.getElementById('libPickBg').classList.add('show');
  try{
    await libLoad(type);
    libPickItems=libItems(type)||[];
    renderLibPickList();
    if(!libPickItems.length)document.getElementById('libPickList').innerHTML='<div style="color:#aaa;font-size:12px;padding:10px;">No '+label+' in the library yet. Add some under ⚙ Content Library.</div>';
  }catch(e){
    document.getElementById('libPickList').innerHTML='<div style="color:#c0392b;font-size:12px;padding:10px;">Couldn\u2019t load: '+esc(e.message||String(e))+'</div>';
  }
}
function closeLibPicker(){document.getElementById('libPickBg').classList.remove('show');libPickType=null;}
function libItemTitle(type,it){
  const c=it.content||{};
  if(type==='recipes')return c.name||'Untitled recipe';
  if(type==='quotes')return (c.quote||'').slice(0,60)||'Untitled';
  if(type==='swaps')return (c.instead?('Instead of '+c.instead):'Swap');
  if(type==='proteins')return c.name||'Protein';
  if(type==='myths')return (c.myth||'').slice(0,60)||'Myth';
  if(type==='tips')return c.main||'Tip';
  return c.name||it.id||'Item';
}
function libItemSub(type,it){
  const c=it.content||{};
  if(type==='recipes'){const bits=[c.time,c.servings&&(c.servings+' servings')].filter(Boolean).join(' · ');const stats=parseStatLines(c.stats).map(p=>p.join(' ')).slice(0,3).join('  ·  ');return [bits,stats].filter(Boolean).join('   ');}
  return '';
}
function renderLibPickList(){
  const list=document.getElementById('libPickList');if(!list||!libPickType)return;
  const q=(document.getElementById('libPickSearch').value||'').toLowerCase().trim();
  let view=libPickItems.slice();
  // hide items already published/used elsewhere? show all, but mark status
  if(q)view=view.filter(it=>(libItemTitle(libPickType,it)+' '+libItemSub(libPickType,it)).toLowerCase().includes(q));
  list.innerHTML='';
  if(!view.length){list.innerHTML='<div style="color:#aaa;font-size:12px;padding:10px;">Nothing matches “'+esc(q)+'”.</div>';return;}
  view.forEach(it=>{
    const row=document.createElement('button');
    row.type='button';
    row.style.cssText='text-align:left;border:1px solid #e3e3e6;border-radius:8px;background:#fff;padding:10px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;';
    const sub=libItemSub(libPickType,it);
    const status=(it.status&&it.status!=='available')?`<span style="font-family:'Montserrat';font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;background:#eee;padding:2px 7px;border-radius:4px;">${esc(it.status)}</span>`:'';
    row.innerHTML=`<span style="min-width:0;"><span style="font-family:'Montserrat';font-size:13px;font-weight:700;color:#222;">${esc(libItemTitle(libPickType,it))}</span>${sub?`<span style="display:block;font-size:11px;color:#999;margin-top:2px;">${esc(sub)}</span>`:''}</span><span style="display:flex;gap:6px;align-items:center;white-space:nowrap;">${status}<span style="color:#e05a1b;font-weight:700;font-size:12px;">Use ›</span></span>`;
    row.onclick=()=>chooseLibItem(it,row);
    list.appendChild(row);
  });
}
async function chooseLibItem(it,rowEl){
  if(!libPickType)return;
  if(rowEl)rowEl.style.opacity='.5';
  try{
    const type=libPickType;
    // place it deliberately: mark reserved, fill the section, track it
    LIB_PLACED[type]=it.id;
    (LIB_FILLERS[type]||(()=>{}))(it);
    try{await libReserveSpecific(type,it.id);}catch(_){}
    refreshState();saveStateLocal();
    closeLibPicker();
    toast('\u2713 '+libItemTitle(type,it)+' added');
  }catch(e){toast(e.message||'Could not add');if(rowEl)rowEl.style.opacity='';}
}
/* PUBLIC: cycle just one Tip sub-field from the per-field pool (hydration…). */
async function libNextTipField(field){
  try{
    await libLoad('tips');
    const pool=libItems('tips').map(x=>x.content&&x.content[field]).filter(Boolean);
    if(!pool.length){toast('No '+field+' tips available');return;}
    const val=pool[Math.floor(Math.random()*pool.length)];
    const sec=sectionByKey('nltip');if(!sec)return;
    const eds=[...sec.querySelectorAll('[contenteditable][data-ph]')];
    const labelCell=eds.find(e=>(e.getAttribute('data-ph')||'').toLowerCase()===field);
    if(labelCell){const card=labelCell.closest('.li-wrap')||labelCell.parentElement;const cends=card?[...card.querySelectorAll('[contenteditable]')]:[];const detail=cends[cends.length-1];if(detail&&detail!==labelCell)libSetField(detail,val);}
    saveStateLocal();toast('\u2713 New '+field+' tip');
  }catch(e){toast(e.message||'Could not cycle');}
}

/* ── CONTENT LIBRARY settings page (CRUD) ── */
/* Field schema per type: [key,label,type] where type = text|textarea|list */
const LIB_FIELDS={
  tips:[['main','Main Tip (headline)','textarea'],['description','Description','textarea'],['tags','Tags (one per line)','list'],['hydration','Hydration','text'],['protein','Protein','text'],['sleep','Sleep','text'],['mobility','Mobility','text'],['misc','Misc','text']],
  swaps:[['instead','Instead of…','text'],['insteadCals','Cals (A)','text'],['swap','Try this…','text'],['swapCals','Cals (B)','text'],['saved','Cals saved','text']],
  proteins:[['name','Protein source','text'],['serving','Serving','text'],['protein','Protein (g)','text'],['price','Price / serving','text'],['per10g','$ per 10g','text'],['notes','Notes','textarea']],
  recipes:[['name','Recipe name','text'],['image','Image URL','text'],['servings','Servings','text'],['time','Prep + cook','text'],['stats','Stats (one per line, e.g. "6g Protein")','list'],['tags','Tags (one per line)','list'],['ingredients','Ingredients (one per line)','list'],['steps','Steps (one per line)','list']],
  quotes:[['quote','Quote','textarea'],['credit','Credit','text']],
  myths:[['myth','The myth','textarea'],['truth','The truth','textarea'],['source','Source / note','text']]
};
const LIB_TITLE={tips:'main',swaps:'instead',proteins:'name',recipes:'name',quotes:'quote',myths:'myth'};
let libCurrentType='tips';
let libEditingId=null;

function libInitPane(){
  // build type tabs once
  const tabs=document.getElementById('libTabs');
  if(tabs && !tabs.children.length){
    Object.entries(LIB_TYPES).forEach(([type,cfg])=>{
      const b=document.createElement('button');
      b.className='lib-tab'+(type===libCurrentType?' active':'');
      b.textContent=cfg.label;b.dataset.type=type;
      b.onclick=()=>{libCurrentType=type;document.querySelectorAll('#libTabs .lib-tab').forEach(x=>x.classList.toggle('active',x.dataset.type===type));libReloadCurrent();};
      tabs.appendChild(b);
    });
  }
  const st=document.getElementById('libGhState');
  if(st)st.textContent=ghReady()?('Connected to '+ghConfig().owner+'/'+ghConfig().repo+' · /'+LIB_DIR):'Connect a repo in ⚙ GitHub to load.';
  libReloadCurrent();
}
async function libReloadCurrent(){
  const list=document.getElementById('libList');
  if(!ghReady()){list.innerHTML='<div class="lib-empty">Connect GitHub to load your library.</div>';return;}
  list.innerHTML='<div class="lib-empty">Loading…</div>';
  try{await libLoad(libCurrentType,true);libRenderList();}
  catch(e){list.innerHTML='<div class="lib-empty">Could not load: '+(e.message||e)+'</div>';}
}
function libRenderList(){
  const list=document.getElementById('libList');if(!list)return;
  const q=(document.getElementById('libSearch').value||'').toLowerCase();
  const filt=document.getElementById('libFilter').value;
  const titleKey=LIB_TITLE[libCurrentType];
  let items=libItems(libCurrentType);
  if(filt)items=items.filter(x=>x.status===filt);
  if(q)items=items.filter(x=>JSON.stringify(x.content).toLowerCase().includes(q));
  if(!items.length){list.innerHTML='<div class="lib-empty">No items. Click <b>+ Add</b> to create one.</div>';return;}
  const dot={available:'gray',reserved:'yellow',published:'green'};
  list.innerHTML=items.map(it=>{
    const title=(it.content&&it.content[titleKey])||'(untitled)';
    const sub=it.status==='published'?('Published · '+(it.publishedIn||'')):(it.status==='reserved'?('Reserved · '+(it.reservedBy||'')):'Available');
    return `<div class="lib-row">
      <span class="lib-dot ${dot[it.status]||'gray'}" title="${it.status}"></span>
      <span class="lib-row-main"><span class="lib-row-title">${escapeHtml(String(title).slice(0,90))}</span><span class="lib-row-sub">${it.id} · ${sub}</span></span>
      <button class="lib-mini" onclick="libOpenEditor('${it.id}')">Edit</button>
      <button class="lib-mini danger" onclick="libDeleteItem('${it.id}')">Del</button>
    </div>`;
  }).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function libOpenEditor(id){
  libEditingId=id||null;
  const fields=LIB_FIELDS[libCurrentType];
  const item=id?libFind(libCurrentType,id):null;
  document.getElementById('libEditTitle').textContent=(id?'Edit ':'Add ')+LIB_TYPES[libCurrentType].label;
  const host=document.getElementById('libEditFields');
  host.innerHTML=fields.map(([key,label,type])=>{
    let val=item&&item.content?item.content[key]:'';
    if(type==='list'&&Array.isArray(val))val=val.join('\n');
    if(type==='textarea'||type==='list')
      return `<div class="field-row"><label>${label}</label><textarea id="lf_${key}" style="width:100%;min-height:${type==='list'?90:60}px;padding:9px 11px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;">${escapeHtml(val||'')}</textarea></div>`;
    return `<div class="field-row"><label>${label}</label><input id="lf_${key}" type="text" value="${escapeHtml(val||'')}" style="width:100%;padding:9px 11px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;"/></div>`;
  }).join('');
  document.getElementById('libEditStatus').textContent='';
  document.getElementById('libEditBg').classList.add('show');
}
function closeLibEditor(){document.getElementById('libEditBg').classList.remove('show');}
async function libSaveEditor(){
  const fields=LIB_FIELDS[libCurrentType];
  const content={};
  fields.forEach(([key,label,type])=>{
    const el=document.getElementById('lf_'+key);let v=el?el.value:'';
    if(type==='list')content[key]=v.split('\n').map(s=>s.trim()).filter(Boolean);
    else content[key]=v.trim();
  });
  const btn=document.getElementById('libEditSave');const st=document.getElementById('libEditStatus');
  btn.disabled=true;st.textContent='Saving…';
  try{
    await libLoad(libCurrentType);
    if(libEditingId){
      const it=libFind(libCurrentType,libEditingId);
      if(it){it.content=content;it.updatedAt=new Date().toISOString();}
    }else{
      LIB_CACHE[libCurrentType].doc.items.push({
        id:libNextId(libCurrentType),status:'available',reservedBy:null,publishedIn:null,publishedDate:null,
        createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),content
      });
    }
    await libSave(libCurrentType,'library: '+(libEditingId?'edit ':'add ')+libCurrentType);
    closeLibEditor();libRenderList();toast('\u2713 Saved to library');
  }catch(e){st.textContent=e.message||'Save failed';}
  btn.disabled=false;
}
async function libDeleteItem(id){
  if(!confirm('Delete '+id+' from the library? This cannot be undone.'))return;
  try{
    await libLoad(libCurrentType);
    const doc=LIB_CACHE[libCurrentType].doc;
    doc.items=doc.items.filter(x=>x.id!==id);
    await libSave(libCurrentType,'library: delete '+id);
    libRenderList();toast('Deleted '+id);
  }catch(e){toast(e.message||'Delete failed');}
}

/* ── GitHub settings modal ── */
function openGithubSettings(note){
  openSettings('github');
  const el=document.getElementById('ghTestStatus');if(el)el.textContent=note||'';
}
function closeGithubSettings(){closeSettings();}
/* read the GitHub settings pane back into a config object */
function readGhForm(){
  const val=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  return {
    owner   : val('ghOwner'),
    repo    : val('ghRepo'),
    dir     : (val('ghDir')||'saved').replace(/^\/+|\/+$/g,''),
    branch  : val('ghBranch'),
    token   : val('ghToken'),
    imagedir: 'images'
  };
}
function saveGithubSettings(){
  const cfg=readGhForm();
  if(!cfg.owner||!cfg.repo){document.getElementById('ghTestStatus').textContent='Owner and Repository are required.';return;}
  setGhConfig(cfg);
  closeGithubSettings();
  toast('\u2713 GitHub settings saved');
}
async function testGithub(){
  const cfg=readGhForm();
  const el=document.getElementById('ghTestStatus');
  if(!cfg.owner||!cfg.repo){el.textContent='Enter owner and repository first.';return;}
  setGhConfig(cfg);            // apply so the helpers use these values
  el.textContent='Testing…';
  try{
    const files=await ghList();
    let msg=`\u2713 Connected. Found ${files.length} newsletter file(s) in ${ghDir()}/.`;
    if(cfg.token){
      // verify the token actually has write scope by reading repo perms
      try{
        const r=await fetch(`${GH_API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`,{headers:ghHeaders()});
        if(r.ok){const j=await r.json();const p=j.permissions||{};msg+=p.push?' Token can write \u2713':' (token present but no write permission — saving may fail)';}
      }catch(e){}
    }else{
      msg+=' No token set — read-only (can browse + load, not save).';
    }
    el.textContent=msg;
  }catch(e){
    el.textContent='\u2717 '+(e.message||e)+' — check owner/repo'+(cfg.token?'/token':' (private repos need a token)');
  }
}

/* Save button -> open the modal to collect Name/Tag/Status/Notes */
function saveState(){
  if(!frame.querySelector('.sec')){saveStateLocal();toast('Saved (empty canvas)');return;}
  document.getElementById('saveModalStatus').textContent='';
  // restore last-known metadata (survives a page reload too)
  if(!currentMeta.tag && !currentMeta.status){
    try{const m=JSON.parse(localStorage.getItem('lngvty_current_meta')||'null');if(m)currentMeta=m;}catch(e){}
  }
  // (re)build the Tag dropdown so any custom tags persist, then preselect
  rebuildSaveTagOptions(currentMeta.tag);
  // prefill the rest from the currently-loaded newsletter
  const nameEl=document.getElementById('saveName');
  if(currentMeta.name && !nameEl.value)nameEl.value=currentMeta.name;
  if(currentMeta.status)document.getElementById('saveStatus').value=currentMeta.status;
  if(currentMeta.notes)document.getElementById('saveNotes').value=currentMeta.notes;
  document.getElementById('saveBg').classList.add('show');
  setTimeout(()=>nameEl.focus(),30);
}

/* persistent custom tags the user has added in the Save modal */
function getCustomTags(){try{return JSON.parse(localStorage.getItem('lngvty_custom_tags')||'[]');}catch(e){return [];}}
function addCustomTag(t){const list=getCustomTags();if(!list.includes(t)){list.push(t);try{localStorage.setItem('lngvty_custom_tags',JSON.stringify(list));}catch(e){}}}

/* rebuild the Save-modal Tag <select> with the standard tags, any custom tags,
   and a trailing "＋ Add new tag…" entry. Preselects `selected` if given. */
function rebuildSaveTagOptions(selected){
  const sel=document.getElementById('saveTag');if(!sel)return;
  const std=['Newsletter','Graphic','Promo','Announcement','Other'];
  const tags=[...std];
  getCustomTags().forEach(t=>{if(!tags.includes(t))tags.push(t);});
  if(selected && !tags.includes(selected))tags.push(selected);   // a loaded tag we've never seen
  sel.innerHTML=tags.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')
    +'<option value="__add__">＋ Add new tag…</option>';
  sel.value=selected && tags.includes(selected)?selected:tags[0];
}

/* when the user picks "Add new tag…", prompt for it and add it */
function onSaveTagChange(sel){
  if(sel.value!=='__add__')return;
  const t=(prompt('New tag name:')||'').trim();
  if(t){addCustomTag(t);rebuildSaveTagOptions(t);}
  else{rebuildSaveTagOptions(getCustomTags()[0]||'Newsletter');}
}
function closeSaveModal(){document.getElementById('saveBg').classList.remove('show');}

/* local registry of saved newsletters (mirrors GitHub, enables offline browse).
   Stores metadata only — the full structured doc lives in /saved on GitHub. */
function getSavedList(){try{return JSON.parse(localStorage.getItem('lngvty_saved')||'[]');}catch(e){return [];}}
function setSavedList(arr){try{localStorage.setItem('lngvty_saved',JSON.stringify(arr));}catch(e){}}

async function confirmSave(){
  const name=document.getElementById('saveName').value.trim();
  if(!name){toast('Please enter a Name');document.getElementById('saveName').focus();return;}
  let tag=document.getElementById('saveTag').value;
  if(tag==='__add__')tag='';   // never save the "Add new tag…" sentinel
  const status=document.getElementById('saveStatus').value;
  const notes=document.getElementById('saveNotes').value.trim();

  // remember this metadata so the next Save (and a delete/reload) keeps it
  currentMeta={name,tag,status,notes};
  try{localStorage.setItem('lngvty_current_meta',JSON.stringify(currentMeta));}catch(e){}

  // 1) always autosave the working canvas locally
  saveStateLocal();

  // 2) build the canonical structured newsletter (no exported HTML stored)
  const nl=serializeNewsletter({name,tag,status,notes});

  // 3) update local registry — NO DUPLICATES (match by id/slug)
  const list=getSavedList();
  const idx=list.findIndex(r=>(r.id||slugify(r.name))===nl.id);
  const meta={id:nl.id,name:nl.name,tag,status,notes,updated:nl.updatedAt};
  if(idx>=0)list[idx]=meta;else list.unshift(meta);
  setSavedList(list);

  // 4) push the JSON file to GitHub
  const btn=document.getElementById('saveConfirmBtn');
  const statusEl=document.getElementById('saveModalStatus');
  if(!ghReady()){
    closeSaveModal();
    toast('Saved locally — connect GitHub to sync');
    statusEl.textContent='';
    openGithubSettings('Connect a repo to store newsletters in GitHub.');
    if(document.getElementById('savedBg').classList.contains('show'))openSaved();
    return;
  }
  btn.disabled=true;btn.innerHTML='&#128190; Saving…';statusEl.textContent='Saving to GitHub…';
  let ok=false,errMsg='';
  try{await ghPut(nl);ok=true;}
  catch(e){ok=false;errMsg=e.message||String(e);}
  // sync content-library lifecycle: publish reserved items if this issue is Sent
  try{await libSyncOnSave(status,name);}catch(e){}
  btn.disabled=false;btn.innerHTML='&#128190; Save';
  if(ok){
    closeSaveModal();
    markClean();
    toast('\u2713 Saved to GitHub');
  }else{
    statusEl.textContent=errMsg;
    toast('Saved locally (GitHub save failed)');
  }
  if(document.getElementById('savedBg').classList.contains('show'))openSaved();
}

function loadState(){
  let data=null;try{data=localStorage.getItem('lngvty_builder');}catch(e){data=MEM;}
  if(!data)return;
  try{
    const {secs,theme,embeds}=JSON.parse(data);
    applyThemeVars(theme);
    BG_EMBEDS=Array.isArray(embeds)?embeds:[];
    loadSections(secs||[]);
  }catch(e){console.warn('load failed',e);}
}

/* toast + keys */
let toastTimer;
function toast(msg){
  try{
    let t=document.getElementById('toast');
    let m=document.getElementById('toastMsg');
    // self-heal: if the toast element was removed or never rendered, recreate it
    if(!t){
      t=document.createElement('div');t.id='toast';t.className='toast';
      t.innerHTML='<span id="toastMsg"></span>';
      document.body.appendChild(t);
      m=document.getElementById('toastMsg');
    }
    if(!m){m=document.createElement('span');m.id='toastMsg';t.appendChild(m);}
    m.textContent=msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>t.classList.remove('show'),1900);
  }catch(e){/* never let a toast failure break the caller */}
}
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='s'){e.preventDefault();saveState();}
  if(e.key==='Escape'){closeModal();closeLinkModal();closeAddSection();closePreview();closeImport();closeDocs();closeSaved();closeSaveModal();closeGithubSettings();closeCustomize();closeImageLib();closeTextLink();closeEmbedModal&&closeEmbedModal();closeMediaModal&&closeMediaModal();}
});

/* ═══════════ UNSAVED-CHANGES GUARD ═══════════
   The canvas autosaves locally, but "saved" here means saved to GitHub. Track
   whether the document has drifted since the last real save and warn on the way out. */
let dirty=false;
function markDirty(){dirty=true;}
function markClean(){dirty=false;}
window.addEventListener('beforeunload',e=>{
  if(!dirty)return;
  if(!frame || !frame.querySelector('.sec'))return;   // nothing to lose
  e.preventDefault();
  e.returnValue='';        // browsers show their own wording; this opts in
  return '';
});
/* any edit to the canvas marks it dirty */
document.addEventListener('input',e=>{if(frame&&frame.contains(e.target))markDirty();});

/* Show a visible banner if anything goes wrong, instead of a silently dead page.
   This is the diagnostic that turns "buttons do nothing" into a readable cause. */
function showFatalBanner(where,err){
  try{
    let b=document.getElementById('fatalBanner');
    if(!b){
      b=document.createElement('div');b.id='fatalBanner';
      b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:100000;background:#b02a37;color:#fff;font-family:Montserrat,Arial,sans-serif;font-size:13px;padding:10px 16px;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;gap:12px;align-items:center;';
      b.innerHTML='<b style="white-space:nowrap;">⚠ Heads up</b><span id="fatalMsg" style="flex:1;"></span><button onclick="lngvtySafeReset()" style="background:#fff;color:#b02a37;border:0;border-radius:5px;font-weight:700;padding:6px 12px;cursor:pointer;white-space:nowrap;">Reset &amp; reload</button><button onclick="this.parentElement.remove()" style="background:transparent;color:#fff;border:1px solid #fff;border-radius:5px;padding:6px 10px;cursor:pointer;">Dismiss</button>';
      document.body.appendChild(b);
    }
    document.getElementById('fatalMsg').textContent=where+': '+((err&&err.message)||err||'unknown error')+' — if this keeps happening, click Reset & reload.';
  }catch(e){}
}
/* Reset clears only THIS app's stored keys (never the whole origin), then reloads.
   Nuking all of localStorage was too aggressive and could blank the page. */
function lngvtySafeReset(){
  try{
    ['lngvty_builder','lngvty_current_meta','lngvty_notes','lngvty_notes_ver','lngvty_docs','lngvty_docs_ver','lngvty_custom_tags','lngvty_hotkeys','lngvty_custom_sections'].forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
  }catch(e){}
  location.reload();
}
/* Some browser warnings arrive as window "error" events but are completely benign
   and self-correcting — most notably ResizeObserver's "loop" notice. Never surface
   those as a banner; they don't indicate anything broken. */
const BENIGN_ERROR_RE=/ResizeObserver loop|Script error\.?$|Non-Error promise rejection/i;
window.addEventListener('error',function(ev){
  const msg=(ev&&(ev.message||(ev.error&&ev.error.message)))||'';
  if(BENIGN_ERROR_RE.test(msg))return;              // ignore harmless noise
  showFatalBanner('Error',ev.error||ev.message);
});

/* INIT — each step guarded so one bad step can't take down the whole page
   (e.g. a corrupt saved doc from an older version shouldn't kill the toolbar). */
(function runInit(){
  const step=(name,fn)=>{try{fn();}catch(e){console.error('INIT '+name,e);showFatalBanner('Init/'+name,e);}};
  step('cleanParagraphGuard',wireCleanParagraphGuard);
  step('loadCustom',loadCustom);
  step('pageFormat',()=>{let id='email';try{id=localStorage.getItem('lngvty_pf_active')||'email';}catch(e){}setBuilderMode(pfFind(id));});
  step('setRailMode',()=>setRailMode('newsletter'));
  step('hotkeys',()=>{loadHotkeys();renderHotkeys();});
  step('loadState',loadState);
  step('refreshState',refreshState);
  // If browser storage is unavailable (e.g. private mode), tell the user once —
  // the app still works, but saves won't survive a reload until they use GitHub.
  if(window.__lsMemoryOnly){setTimeout(()=>toast("Private/restricted mode: work won't auto-save locally — use Save to GitHub"),800);}
})();
