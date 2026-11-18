/* Awaken Digital — proposal v2 */
(function(){
'use strict';
var D=document,root=D.documentElement,W=window;
root.classList.add('js');
var RM=!!(W.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE=!!(W.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches);
if(FINE)root.classList.add('fine');
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function clamp(v,a,b){return v<a?a:v>b?b:v}
var WA='959255762417',MAIL='nyinyisoewin@awakenentertainment.org',LIVE='https://awakenentertainment.org/digital/proposal/';
var VW=function(){return W.innerWidth},VH=function(){return W.innerHeight};

/* ================= DATA ================= */
var PAL={all:{h:'—',acc:'#9bd600',ink:'#3f6212',tint:'#f3fadf',soft:'#dff5a0'},fmcg:{h:35,acc:'#ee6a4a',ink:'#852a12',tint:'#ffe8e1',soft:'#ffc5b4'},lux:{h:86,acc:'#c68d00',ink:'#6c4400',tint:'#fbefd6',soft:'#efd49b'},health:{h:137,acc:'#61af3a',ink:'#255c00',tint:'#e5f6df',soft:'#bfe4b1'},bev:{h:188,acc:'#00b8ac',ink:'#00615a',tint:'#d7f8f4',soft:'#98e9e1'},tech:{h:239,acc:'#00a3f4',ink:'#00538b',tint:'#dcf4ff',soft:'#a7e0ff'},fin:{h:290,acc:'#9982f8',ink:'#4e3c8e',tint:'#efedff',soft:'#d6cfff'},life:{h:341,acc:'#db68b7',ink:'#792962',tint:'#ffe7f7',soft:'#fdc3e7'}};
var IND={
 all:{label:'All brands',short:'All brands',icon:'spark'},
 fmcg:{label:'FMCG & snacks',short:'FMCG & snacks',icon:'cookie',pack:'Grow',
  hook:'Win the feed before the shelf.',
  ch:'Choices at the shop take seconds, so familiarity has to be built on the phone first. The snack people saw this week is the one their hand reaches for.',
  plays:[['Snack-size series','A recurring short-form series with characters people follow — from the team behind 12 original series.'],['Challenge + creator wave','A simple challenge seeded with micro and nano creators from MCDB, then scaled with paid boosts on what works.'],['Season peaks','Thingyan and Thadingyut content, packs and sampling built around the moments the whole country is online.']],
  proof:'Tone Tone Noodle and Kido Candies each reached around a million organic views and engagements in three months; Ximi Jelly passed 1M before paid promotion. Design partner to Gery since its Myanmar launch.',
  kpi:['Views & engagement rate','Follower growth','Share of voice vs category','Creator & UGC volume','Distributor & shop feedback'],
  mon:{3:'Thingyan packs, sampling and water-fight creator challenges.',5:'Back-to-school snacks and lunchbox content.',9:'Thadingyut gifting packs and homecoming moments.',11:'Year-end party packs and gifting.'}},
 bev:{label:'Beverages',short:'Beverages',icon:'soda',pack:'Grow',
  hook:'Show up in the moment.',
  ch:'Drinks are bought on impulse and on occasion — heat, festivals, football nights, long shifts. The brand that is there in the moment gets picked.',
  plays:[['Moment calendar','Content planned a quarter ahead around Thingyan, football, exams and the hot season.'],['Always-on creator roster','A year-round line-up with clear roles: anchors for reach, community creators for engagement.'],['Shop-front stories','Cooler-door, outlet and street-stall content that links the feed to the point of sale.']],
  proof:'A 12-month creator programme for a drinks brand: 51 posts, 29.2M views, 6.8% engagement. For regulated categories, we plan within the advertising rules in force.',
  kpi:['Reach in season','Engagement per post','Cost per view','Outlet & promotion uptake','Sentiment'],
  mon:{2:'Hot-season refreshment: heat-beating drinks content.',3:'Thingyan — the biggest drinks moment of the year.',7:'Football nights: late-match content and outlet promotions.',11:'Year-end parties and celebrations.'}},
 tech:{label:'Telecom & tech',short:'Telecom & tech',icon:'cpu',pack:'Lead',
  hook:'Make the spec sheet feel real.',
  ch:'Specs and offers all sound alike. People believe what they see tested in real life, by people like them.',
  plays:[['Proof-in-life launch','Drops, rain, long days and real users — each feature shown in the moment it matters, cut for TikTok and Facebook.'],['Daily social engine','Monthly calendars and daily creative for offers, packs and service updates.'],['Creator unboxing wave','Reviews and unboxings from tech and lifestyle creators, timed to launch week.']],
  proof:'HONOR X9c and X6c launches — single videos reached 874.8K and 405.8K views. MPT: monthly calendars, digital campaigns, daily social creative and videography.',
  kpi:['Launch-week reach','Video completion rate','Store & online enquiries','Offer uptake','Comment sentiment'],
  mon:{3:'New Year upgrades and Thingyan photo and video features.',5:'Back to school — phones, data packs and laptops.',9:'Thadingyut gifting and festival deals.',11:'Year-end deals and flagship launches.'}},
 fin:{label:'Banking, fintech & insurance',short:'Finance',icon:'bank',pack:'Grow',
  hook:'Turn trust into taps.',
  ch:'Money products need trust and a clear “how”. People sign up when they understand it — and see people like them using it safely.',
  plays:[['How-to series','Short explainers for each feature — sign up, top up, transfer, claim — in plain Burmese.'],['Real-user stories','Shop owners, farmers and families: why they use it, filmed where they live and work.'],['Community help desk','Viber and Telegram channels plus Facebook Groups for questions, tips and offers, run daily.']],
  proof:'Design work for Wave Money, Micromoney and MPT Pay. FVS Corporate Insurance is also on our client wall.',
  kpi:['Sign-ups & installs','Cost per sign-up','How-to completion','Questions answered & response time','Sentiment'],
  mon:{0:'New-year money goals and saving how-tos.',3:'Thingyan travel, transfers and gifting money.',9:'Festival spending and sending money home.',11:'Year-end bills, bonuses and budgeting.'}},
 health:{label:'Health & pharma',short:'Health & pharma',icon:'pill',pack:'Grow',
  hook:'Explain it simply. Say it safely.',
  ch:'Health brands must educate without over-claiming. Families listen to experts — and to people they trust.',
  plays:[['Expert + creator pairs','A doctor or pharmacist explains; a creator shows daily life. Every claim checked against your approved list.'],['Locally shot visuals','Real Myanmar faces and settings instead of imported stock — as we did for Becozinc.'],['Seasonal care moments','Rainy season, exams and Thingyan heat: timely tips that keep the brand useful.']],
  proof:'Becozinc (Dr. Reddy’s): website, social media and locally shot photography for the zinc & B-complex launch.',
  kpi:['Reach in target groups','Saves & shares on education posts','Pharmacy enquiries','Questions & sentiment'],
  mon:{2:'Hot-season care: hydration and heat tips.',5:'Rainy-season family care routines.',7:'Check-ups and everyday health habits.',9:'Festival-season wellness.'}},
 life:{label:'F&B, retail & lifestyle',short:'F&B & lifestyle',icon:'food',pack:'Launch',
  hook:'Get them through the door.',
  ch:'Venues and shops live on visits. People go where their feed shows them something worth the trip this week.',
  plays:[['Come-visit content','Venue tours, creator visits, menu drops and behind-the-counter moments, posted weekly.'],['Event & offer drops','Launch nights, weekend offers and festival specials pushed through TikTok, Facebook and chat groups.'],['Local creator circle','Food, gaming and lifestyle creators near you, briefed every month.']],
  proof:'WonderXland reached nearly a million views and interactions in three months without paid ads.',
  kpi:['Visits & bookings','Offer code use','Follower growth','Check-ins & UGC'],
  mon:{1:'Valentine’s dining, dates and gifts.',3:'Thingyan events, water-fight venues and nights out.',9:'Thadingyut lights, family outings and food.',11:'Christmas and year-end parties.'}},
 lux:{label:'Beauty, fashion & luxury',short:'Beauty & luxury',icon:'gem',pack:'Launch',
  hook:'Make them want it first.',
  ch:'Premium buyers judge a brand by how it looks and who wears it. One careless post can cheapen it.',
  plays:[['Films & macro photography','Craft-level visuals of product, texture and detail, shot by our production team.'],['Stylist & creator circle','A small, carefully cast group of creators who fit the brand.'],['Occasion moments','Weddings, Thadingyut gifting and birthdays — content built around reasons to buy.']],
  proof:'Aye Mya Thu Luxury Jewelry: a debut ahead of most new entrants in luxury accessories, before any paid promotion.',
  kpi:['Saves & shares','DMs & enquiries','Store visits','Engagement quality'],
  mon:{1:'Valentine’s gifting.',3:'New Year gifting and Thingyan looks.',9:'Wedding season opens — bridal and gifting.',10:'Wedding season and Tazaungdaing celebrations.'}}
};
IND.all.mon={3:'Thingyan — the biggest moment for most categories.',9:'Thadingyut — gifting and homecoming.',11:'Year-end shopping and parties.'};
var ORDER=['fmcg','bev','tech','fin','health','life','lux'];
var MONTHS=[
 {m:'Jan',n:'January',s:'Cool season',e:[['party','New Year’s Day','1 January — fresh-start offers and resolutions']]},
 {m:'Feb',n:'February',s:'Cool season',e:[['heart','Valentine’s Day','14 February — gifting, dining and couple content']]},
 {m:'Mar',n:'March',s:'Hot season',e:[['sun','Hot season begins','Heat-beating drinks, care and indoor fun']]},
 {m:'Apr',n:'April',s:'Hot season',e:[['waves','Thingyan water festival','Mid-April — Myanmar New Year, the biggest moment of the year']]},
 {m:'May',n:'May',s:'Hot season',e:[['flower','Kason full moon','Watering the Bodhi tree — family and merit-making']]},
 {m:'Jun',n:'June',s:'Rainy season',e:[['grad','Back to school','Schools reopen — stationery, snacks, phones and data'],['rain','The rains arrive','Indoor content, delivery and rainy-day care']]},
 {m:'Jul',n:'July',s:'Rainy season',e:[['moon','Waso full moon','Buddhist Lent begins — a quieter, reflective season']]},
 {m:'Aug',n:'August',s:'Rainy season',e:[['trophy','Football season','The English Premier League kicks off — late-night match content']]},
 {m:'Sep',n:'September',s:'Rainy season',e:[['cal','Plan the festival push','Lock October content before the rush']]},
 {m:'Oct',n:'October',s:'End of the rains',e:[['spark','Thadingyut festival of lights','Full moon — gifting, paying respects, homecoming'],['gift','Wedding season opens','Lent ends — weddings and celebrations return']]},
 {m:'Nov',n:'November',s:'Cool season',e:[['flower','Tazaungdaing festival','Full moon — lights, robe-weaving contests, night markets']]},
 {m:'Dec',n:'December',s:'Cool season',e:[['gift','Christmas & year-end','Holiday shopping, parties and year-in-review content']]}
];
var SEASONS=[[2,4,'#f59e0b','Hot'],[5,9,'#0ea5e9','Rainy'],[10,13,'#a78bfa','Cool']];
var SECT={all:'All',tel:'Telecom & tech',fin:'Finance',fmcg:'FMCG',drink:'Drinks',hb:'Health & beauty',life:'Lifestyle & luxury',ngo:'NGO & other'};
var LOGOS=[['mpt','MPT','tech fin','tel',117,200],['honor','HONOR','tech','tel',360,70],['wave-money','Wave Money','fin','fin',200,200],['gery','Gery','fmcg','fmcg',200,200],['kido','Kido Candies','fmcg','fmcg',360,174],['ximi','Ximi Jelly','fmcg','fmcg',313,177],['tone-tone','Tone Tone Noodle','fmcg','fmcg',272,200],['becozinc','Becozinc','health','hb',360,124],['mpt-pay','MPT Pay','fin tech','fin',200,200],['micromoney','Micromoney','fin','fin',222,200],['tiger','Tiger','bev','drink',180,200],['awba','awba','','ngo',360,168],['handicap-intl','Handicap International','health','ngo',153,200],['aye-mya-thu','Aye Mya Thu Luxury Jewelry','lux','life',360,167],['wonderxland','WonderXland','life','life',200,200],['abc','ABC','bev','drink',200,200],['fvs','FVS Corporate Insurance','fin','fin',360,151],['kirin','Kirin Ichiban','bev','drink',200,200],['umg','UMG','','ngo',164,200],['inca-king','Inca King Health & Beauty','lux health','hb',300,171],['macarthurs','MacArthur’s','bev','drink',200,200],['wtm','Women Transforming Myanmar','','ngo',360,111],['rakhinelink','RakhineLink','tech','tel',360,129],['grand-royal','Grand Royal','bev','drink',200,200],['amby','Amby London','lux','hb',200,200],['eastern-palace','Eastern Palace','life','life',219,200],['sjoliv','SJÖLIV','','ngo',360,73],['sky-bow','Sky Bow','','ngo',267,100],['cele-panda','Cele Panda','life','life',162,200]];
var SERIES=[['wingeta','WinGeTa','Drama · Mystery',10,'Channel K'],['chit-thaw-atar','Chit Thaw Atar','Drama · Romance',13,'Fortune TV'],['soul-of-love','Soul of Love','Drama · Horror',2,'TikTok'],['exit','EXIT','Horror',5,'15–20 min'],['maung-kyauk-khae','Maung Kyauk Khae','Horror · Comedy',5,'30 min'],['lu-pyo-gyi','Lu Pyo Gyi Kone Sone Sai','Comedy · Drama',5,'Original OST'],['nauk-sone-su-taung','Nauk Sone Su Taung','Drama · Comedy',5,'30 min'],['a-chit-sone-yan-phet','A Chit Sone Yan Phet','Drama · Romance',5,'20 min'],['apai-khan-myitta','Apai Khan Myitta','Thriller · Drama',5,'30 min'],['a-chit-sate','A Chit Sate','Drama · Romance',5,'30 min'],['taw-thar','Taw Thar · The Hick','Comedy · Horror',4,'30 min'],['lay-htae-ka-pone-pyin','Lay Htae Ka Pone Pyin','Drama · Romance',3,'30–35 min']];
var GENRES=[['Drama',9,'#7ee2b8'],['Romance',4,'#f9a8d4'],['Horror',4,'#a78bfa'],['Comedy',4,'#fde047'],['Thriller',1,'#fb923c'],['Mystery',1,'#7cc0ff']];
var AGES=[['13–17',7.9],['18–24',11.2],['25–34',15.8],['35–44',14.8],['45–54',12.5],['55–64',9.4],['65+',7.7]];
var SLOPE=[['TikTok',21.0,32.2,'url(#tkg)','+53%'],['Facebook',13.7,11.1,'#a0560f','−19%'],['LinkedIn',1.10,1.40,'#8a7f70','+27%'],['Instagram',0.93,0.62,'#c4b8a5','−34%']];
var REELS=[['5-episode mini-series','creator challenge','how-to series','street-interview series','behind-the-scenes diary','talk-show segment','unboxing wave','live shopping night'],['Thingyan','Thadingyut','football nights','the hot season','wedding season','back to school','year-end gifting','Valentine’s week'],['TikTok with micro creators','Facebook Groups and Messenger','YouTube and Shorts','Viber and Telegram communities','TikTok Live','a celebrity anchor plus nano creators']];
var GOALS=['Launch a new product','Grow on TikTok','Fix or relaunch our pages','Creator / celebrity campaign','Seasonal campaign (Thingyan, Thadingyut)','Brand film or TV commercial','Branded series or talk show','Key visuals & design','PR & launch event','MCDB viewer login'];
var CHS=['TikTok','Facebook','YouTube','Instagram','Viber / Telegram','TV'];
var TIMES=['As soon as possible','In 1–3 months','For Thingyan 2027','Later'];
var BUDS=['Under 50 Lakh','50–200 Lakh','200–500 Lakh','500 Lakh+','Not sure yet'];
var PACKS=['Not sure','Launch','Grow','Lead'];
var ADDONS=['Brand film or TVC','Branded series or talk show','Celebrity & creator bundle','Key visuals & packaging','Photography','PR launch & events','Paid media management','Studio & kit hire'];
var ACTS=['Opening','Act I · The shift','Act II · Who we are','Act III · What we make','Act IV · Your plan'];
var SUM={top:'Cover',glance:'Awaken in 60 seconds',why:'Myanmar moved to short video',who:'Video-first, one roof, since 2016',grow:'Story first, organic before paid',proof:'Real brands, real numbers',talent:'MCDB: 695 names, 944.5M reach',production:'12 original series, 67 episodes',design:'Identity, key visuals, social design',category:'Ideas, moments and an idea machine',process:'Strategy, create, launch, grow',packages:'Launch, Grow, Lead — and compare',start:'Build your brief in a minute'};
var MCOL={hero:'#3f6212',red:'#e50d0c',sand:'#a0560f',ink:'#111',peach:'#c2410c',white:'#ff5a3c',studio:'#d4891c',green:'#0f3a2c',lilac:'#6d28d9',ice:'#0369a1',teal:'#0b3a3f',gold:'#ad7a2a'};
var DARK=['red','ink','studio','green','teal'];
function svgIc(id){return '<svg class="ic"><use href="#i-'+id+'"/></svg>'}

/* ================= HELPERS ================= */
var toastEl=$('#toast'),tt;
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('on')},2600)}
function copyText(t,ok){function fb(){var ta=D.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';D.body.appendChild(ta);ta.select();var r=false;try{r=D.execCommand('copy')}catch(e){}D.body.removeChild(ta);r?ok():toast('Select the text and copy it manually')}
 try{if(navigator.clipboard&&W.isSecureContext){navigator.clipboard.writeText(t).then(ok,fb);return}}catch(e){}fb()}
function vt(fn){if(D.startViewTransition&&!RM){try{D.startViewTransition(fn);return}catch(e){}}fn()}
function goTo(sel,block){var el=typeof sel==='string'?$(sel):sel;if(!el)return;el.scrollIntoView({behavior:RM?'auto':'smooth',block:block||'start'})}

/* ================= HERO ================= */
var mz=$('#mosaic');
[[0,1,2,3,4,5,6],[7,8,9,10,11,12,13],[14,15,16,17,18,19,20]].forEach(function(r,ri){var row=D.createElement('div');row.className='mrow';var h='';for(var k=0;k<2;k++){r.forEach(function(i){h+='<img src="img/m'+(i<10?'0':'')+i+'.webp" alt="" width="300" height="360" decoding="async"'+(ri>0||k>0?' loading="lazy"':'')+'>'})}row.innerHTML=h;mz.appendChild(row)});
setTimeout(function(){D.body.classList.add('ready')},60);

/* ================= COUNTERS + REVEAL ================= */
function count(el){if(el.dataset.done)return;el.dataset.done='1';var to=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),pre=el.dataset.pre||'',suf=el.dataset.suf||'';
 function fmt(v){return pre+v.toFixed(dec)+suf}
 if(RM){el.textContent=fmt(to);return}var t0=null,dur=1500;
 function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(to*e);if(k<1)requestAnimationFrame(step);else el.textContent=fmt(to)}
 requestAnimationFrame(step)}
var IO='IntersectionObserver' in W;
var revealHooks=[];
function onReveal(el,fn){revealHooks.push([el,fn])}
if(IO&&!RM){
 var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add('in');rio.unobserve(t);if(t.dataset.count)count(t);$$('[data-count]',t).forEach(count);revealHooks.forEach(function(h){if(h[0]===t)h[1]()})})},{rootMargin:'0px 0px -8% 0px',threshold:.01});
 $$('.rv').forEach(function(el){rio.observe(el)});
 $$('[data-count]').forEach(function(el){if(!el.closest('.rv'))rio.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')});setTimeout(function(){revealHooks.forEach(function(h){h[1]()})},50)}

/* ================= CHAPTERS, ACTS, RAIL, MENU ================= */
var chaps=$$('[data-chap]'),rail=$('#rail'),mlist=$('#mlist'),tbProg=$('#tbProg');
var actOf=function(c){return +(c.dataset.act||0)};
(function buildNav(){
 var groups={};chaps.forEach(function(c){var a=actOf(c);(groups[a]=groups[a]||[]).push(c)});
 var html='';
 Object.keys(groups).forEach(function(a){
  var rg=D.createElement('div');rg.className='rg';
  groups[a].forEach(function(c){if(c.id==='top')return;var x=D.createElement('a');x.href='#'+c.id;x.setAttribute('aria-label',c.dataset.label);x.innerHTML='<span>'+c.dataset.label+'</span>';rg.appendChild(x)});
  if(rg.children.length)rail.appendChild(rg);
  html+='<div class="mgrp"><h6>'+ACTS[a]+'<i></i></h6><ul class="mlist">';
  groups[a].forEach(function(c){if(c.id==='top')return;var t=c.dataset.label.replace(/^\d+ · /,'');html+='<li><a href="#'+c.id+'" style="--mc:'+MCOL[c.dataset.theme]+'"><span class="mn">'+c.dataset.n+'</span><span class="mt">'+t+'</span><span class="seen-ic" aria-hidden="true">✓</span><span class="ms">'+(SUM[c.id]||'')+'</span></a></li>'});
  html+='</ul></div>';
  var sp=D.createElement('span');sp.dataset.act=a;sp.innerHTML='<i></i>';tbProg.appendChild(sp);
 });
 mlist.innerHTML=html;
})();
var curEl=$('#curLabel'),actEl=$('#actLabel'),pbNum=$('#pbNum'),pbName=$('#pbName'),pbAct=$('#pbAct'),curChap=chaps[0];
function setCur(c){curChap=c;var t=c.dataset.theme||'hero';D.body.setAttribute('data-t',t);D.body.classList.toggle('dk',DARK.indexOf(t)>-1);
 curEl.textContent=c.id==='top'?'':c.dataset.label;actEl.textContent=c.id==='top'?'':ACTS[actOf(c)];
 pbNum.textContent=c.dataset.n;pbName.textContent=c.dataset.short||'';pbAct.textContent=ACTS[actOf(c)].replace(/ ·.*/,'')||'Chapter';
 $$('a',rail).forEach(function(a){var on=a.getAttribute('href')==='#'+c.id;a.classList.toggle('on',on);if(on)a.classList.add('seen')});
 $$('a',mlist).forEach(function(a){var on=a.getAttribute('href')==='#'+c.id;a.classList.toggle('on',on);if(on)a.classList.add('seen')});
 var tc=getComputedStyle(D.body).getPropertyValue('--tb-bg');var m=$('meta[name=theme-color]');if(m&&MCOL[t])m.setAttribute('content',t==='hero'||t==='white'?'#ffffff':getComputedStyle(c).getPropertyValue('--bg').trim()||'#ffffff');}
if(IO){var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setCur(e.target)})},{rootMargin:'-46% 0px -52% 0px'});chaps.forEach(function(c){cio.observe(c)})}

/* ================= SCROLL ENGINE ================= */
var ring=$('#ring'),CIRC=100.53,actTops=[],segs=$$('span',tbProg);
var mosaicEl=$('#mosaic'),opNums=$$('.op .n'),bands=$$('.actband'),growPath=$('#growPath'),stgs=$$('.stg'),hgal=$('#hgal'),hTrack=$('#hgalTrack'),hCount=$('#hgalCount'),hBar=$('#hgalBar'),scards=$$('.scard');
var hgalOn=false,hgalShift=0;
function measure(){
 var y=W.scrollY;actTops=[];
 for(var a=0;a<ACTS.length;a++){var first=chaps.filter(function(c){return actOf(c)===a})[0];if(first)actTops.push(first.getBoundingClientRect().top+y)}
 actTops.push(root.scrollHeight);
 segs.forEach(function(s,i){s.style.setProperty('--g',Math.max(1,actTops[i+1]-actTops[i]).toFixed(0))});
 setupHgal();
}
function setupHgal(){
 if(!hgal)return;
 var want=VW()>=1000&&!RM;
 hgalOn=want;hgal.classList.toggle('static',!want);
 if(want){var w=hTrack.scrollWidth,vw=VW();hgalShift=Math.max(0,w-vw);hgal.style.height=(VH()-60+hgalShift)+'px'}
 else{hgal.style.height='';hTrack.style.removeProperty('--tx')}
}
var ticking=false;
function frame(){
 ticking=false;var y=W.scrollY,vh=VH(),h=root.scrollHeight-vh,p=h>0?clamp(y/h,0,1):0;
 ring.style.strokeDashoffset=(CIRC*(1-p)).toFixed(2);
 var mid=y+vh*.5;
 segs.forEach(function(s,i){var a=actTops[i],b=actTops[i+1];if(a===undefined||b===undefined)return;s.style.setProperty('--p',clamp((mid-a)/(b-a),0,1).toFixed(3))});
 if(!RM){
  if(y<vh*1.2&&mosaicEl){var k=clamp(y/vh,0,1);mosaicEl.style.setProperty('--my',(k*-80).toFixed(1)+'px');mosaicEl.style.setProperty('--ms',(1+k*.08).toFixed(3));mosaicEl.style.setProperty('--mo',(1-k*.6).toFixed(3))}
  opNums.forEach(function(n){var r=n.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;n.style.setProperty('--fill',clamp((vh-r.top)/(vh*.55),0,1).toFixed(3))});
  bands.forEach(function(b){var r=b.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var q=clamp((vh-r.top)/(vh+r.height),0,1);b.firstElementChild.style.setProperty('--x',(-q*Math.max(400,b.firstElementChild.scrollWidth*.35)).toFixed(1)+'px')});
 }else{opNums.forEach(function(n){n.style.setProperty('--fill',1)})}
 if(growPath){var r=growPath.getBoundingClientRect();if(r.top<vh&&r.bottom>0){var d=RM?1:clamp((vh*.88-r.top)/(r.height+vh*.25),0,1);growPath.style.setProperty('--draw',d.toFixed(3));stgs.forEach(function(s,i){s.classList.toggle('lit',d>=[.12,.38,.64,.88][i])})}}
 if(hgalOn){var rg=hgal.getBoundingClientRect();var q=clamp(-(rg.top-60)/Math.max(1,rg.height-(vh-60)),0,1);hTrack.style.setProperty('--tx',(-q*hgalShift).toFixed(1)+'px');hBar.style.setProperty('--hp',q.toFixed(3));var n=Math.min(SERIES.length,Math.round(q*(SERIES.length-1))+1);hCount.textContent=(n<10?'0':'')+n}
 if(!RM&&scards.length){var sm=VW()<=1000;scards.forEach(function(c,i){var nx=scards[i+1];if(!nx){c.style.setProperty('--sc',1);c.style.setProperty('--dim',0);return}var top=(sm?70:84)+(i+1)*(sm?14:20);var rc=c.getBoundingClientRect(),rn=nx.getBoundingClientRect();var q=clamp(1-(rn.top-top)/Math.max(1,rc.height),0,1);c.style.setProperty('--sc',(1-q*.07).toFixed(4));c.style.setProperty('--dim',(q*.38).toFixed(3))})}
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
W.addEventListener('scroll',onScroll,{passive:true});
var rto;W.addEventListener('resize',function(){clearTimeout(rto);rto=setTimeout(function(){measure();frame()},150)});

/* ================= 01 STORY ================= */
(function story(){
 var chart=$('#storyChart'),kick=$('#scKicker'),steps=$$('.step'),storyEl=$('#story');
 var KICK=['Internet users · end of 2026','Ad reach by platform · end of 2026','One year of change · late 2025 → late 2026','Who is watching · 2026'];
 steps.forEach(function(s){var w=D.createElement('div');w.className='step-in';while(s.firstChild)w.appendChild(s.firstChild);s.appendChild(w)});
 var wf=$('#waffle'),h='';for(var i=0;i<100;i++)h+='<i class="'+(i<72?'f':'')+'" style="--d:'+i+'"></i>';wf.innerHTML=h;
 var sv=$('#slope'),X1=150,X2=400,Y=function(v){return 288-v/35*250};
 var s='<defs><linearGradient id="tkg" x1="0" x2="1"><stop offset="0" stop-color="#25f4ee"/><stop offset="1" stop-color="#fe2c55"/></linearGradient></defs>';
 s+='<line x1="'+X1+'" y1="20" x2="'+X1+'" y2="292" stroke="currentColor" stroke-opacity=".15"/><line x1="'+X2+'" y1="20" x2="'+X2+'" y2="292" stroke="currentColor" stroke-opacity=".15"/>';
 s+='<text x="'+X1+'" y="316" text-anchor="middle" font-size="12" font-weight="800" opacity=".6">LATE 2025</text><text x="'+X2+'" y="316" text-anchor="middle" font-size="12" font-weight="800" opacity=".6">LATE 2026</text>';
 SLOPE.forEach(function(p,i){var y1=Y(p[1]),y2=Y(p[2]),off=i===2?-9:i===3?9:0;
  s+='<path class="sl" pathLength="100" style="--len:100;transition-delay:'+(i*.12)+'s" d="M'+X1+','+y1.toFixed(1)+' L'+X2+','+y2.toFixed(1)+'" stroke="'+p[3]+'"/>';
  s+='<circle class="dot" cx="'+X1+'" cy="'+y1.toFixed(1)+'" r="5" fill="'+(i===0?'#25f4ee':p[3])+'"/><circle class="dot" cx="'+X2+'" cy="'+y2.toFixed(1)+'" r="6" fill="'+(i===0?'#fe2c55':p[3])+'"/>';
  s+='<text class="dot" x="'+(X1-12)+'" y="'+(y1+4+off).toFixed(1)+'" text-anchor="end" font-size="'+(i<2?14:11.5)+'" font-weight="'+(i<2?800:600)+'">'+p[0]+' '+p[1].toFixed(i<2?1:2)+'M</text>';
  s+='<text class="dot" x="'+(X2+12)+'" y="'+(y2+4+off).toFixed(1)+'" font-size="'+(i<2?16:11.5)+'" font-weight="800">'+p[2].toFixed(i<2?1:2)+'M <tspan font-weight="600" opacity=".65">'+p[4]+'</tspan></text>';
 });
 sv.innerHTML=s;
 var ag=$('#ages');ag.innerHTML=AGES.map(function(a,i){return '<div class="ab'+(a[0]==='25–34'?' hi':'')+'"><b>'+a[1]+'%</b><i style="--h:'+(a[1]/16*100).toFixed(1)+';--d:'+i+'"></i><span>'+a[0]+'</span></div>'}).join('');
 function set(n){chart.setAttribute('data-step',n);kick.textContent=KICK[n-1];steps.forEach(function(s){s.classList.toggle('on',s.dataset.step==n)})}
 set(1);
 if(IO){
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(+e.target.dataset.step)})},{rootMargin:'-42% 0px -42% 0px'});
  steps.forEach(function(s){sio.observe(s)});
  var seen=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){storyEl.classList.add('seen');seen.disconnect()}})},{threshold:.2});seen.observe(storyEl);
 }else storyEl.classList.add('seen');
})();

/* ================= 02 WHO ================= */
(function(){
 var rs=$$('#reasons .rs');function on(el){rs.forEach(function(x){x.classList.toggle('on',x===el)})}
 rs.forEach(function(el){el.addEventListener('mouseenter',function(){on(el)});el.addEventListener('focus',function(){on(el)});el.addEventListener('click',function(){on(el)})});
 var ob=$('#orbit');if(!ob)return;var nodes=$$('.onode',ob),sp='';
 nodes.forEach(function(n,i){var a=(-90+i*60)*Math.PI/180;var x=50+41*Math.cos(a),y=50+41*Math.sin(a);n.style.left=x.toFixed(2)+'%';n.style.top=y.toFixed(2)+'%';sp+='<line class="spk" x1="300" y1="300" x2="'+(300+246*Math.cos(a)).toFixed(1)+'" y2="'+(300+246*Math.sin(a)).toFixed(1)+'"/>'});
 $('.spokes',ob).innerHTML=sp;
})();

/* ================= 03 GROW: curve dot ================= */
(function(){
 var cp=$('#cpath'),dot=$('#cdot'),card=cp&&cp.closest('.curve');if(!cp||!dot)return;
 function run(){var svg=cp.ownerSVGElement,L=cp.getTotalLength(),t0=null,dur=RM?1:2200;dot.style.opacity=1;
  function place(t){var pt=cp.getPointAtLength(L*t),r=svg.getBoundingClientRect(),pr=dot.parentElement.getBoundingClientRect();dot.style.transform='translate('+(r.left-pr.left+pt.x/400*r.width).toFixed(1)+'px,'+(r.top-pr.top+pt.y/130*r.height).toFixed(1)+'px)'}
  function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3);place(e);if(k<1)requestAnimationFrame(st)}requestAnimationFrame(st);
  W.addEventListener('resize',function(){place(1)})}
 onReveal(card,function(){setTimeout(run,300)});
})();

/* ================= 04 PROOF ================= */
var caseCat='all';
(function(){
 var CATS=[['all','All'],['fmcg','FMCG'],['tech','Tech'],['life','Lifestyle'],['lux','Luxury'],['bev','Drinks']];
 var cases=$$('#cases .case'),rows=$$('#ledger tbody tr'),cf=$('#caseFilter');
 cf.innerHTML=CATS.map(function(c){var n=c[0]==='all'?cases.length:cases.filter(function(x){return x.dataset.cat===c[0]}).length;return '<button type="button" role="tab" aria-selected="'+(c[0]==='all')+'" data-c="'+c[0]+'"><i style="--c:'+(PAL[c[0]]?PAL[c[0]].acc:'#ff5a3c')+'"></i>'+c[1]+'<em>'+n+'</em></button>'}).join('');
 function flip(mut){var first=new Map();cases.forEach(function(el){if(!el.classList.contains('out'))first.set(el,el.getBoundingClientRect())});mut();if(RM||!Element.prototype.animate)return;
  cases.forEach(function(el){if(el.classList.contains('out'))return;var f=first.get(el),l=el.getBoundingClientRect();if(f){var dx=f.left-l.left,dy=f.top-l.top;if(Math.abs(dx)+Math.abs(dy)>1)el.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)'})}else el.animate([{opacity:0,transform:'scale(.94) translateY(16px)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'})})}
 cf.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;caseCat=b.dataset.c;$$('button',cf).forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});
  flip(function(){cases.forEach(function(c){c.classList.toggle('out',caseCat!=='all'&&c.dataset.cat!==caseCat)})});rows.forEach(function(r){r.classList.toggle('out',caseCat!=='all'&&r.dataset.cat!==caseCat)})});
 var cv=$('#caseView'),ledger=$('#ledger'),grid=$('#cases'),note=$('.cases-note');
 cv.addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;$$('button',cv).forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});var l=b.dataset.v==='ledger';vt(function(){grid.hidden=l;note.hidden=l;ledger.hidden=!l})});
 // logos
 var lw=$('#logos'),lm=$('#lmTrack');
 lw.innerHTML=LOGOS.map(function(l){return '<li data-ind="'+l[2]+'" data-sec="'+l[3]+'" data-name="'+esc(l[1])+'"><img src="img/logo/'+l[0]+'.webp" alt="'+esc(l[1])+'" width="'+l[4]+'" height="'+l[5]+'" loading="lazy" decoding="async"></li>'}).join('');
 var mq='';for(var k=0;k<2;k++)LOGOS.forEach(function(l){mq+='<img src="img/logo/'+l[0]+'.webp" alt="" width="'+l[4]+'" height="'+l[5]+'" loading="lazy" decoding="async">'});lm.innerHTML=mq;
 var st=$('#sectorTabs');st.innerHTML=Object.keys(SECT).map(function(k){var n=k==='all'?LOGOS.length:LOGOS.filter(function(l){return l[3]===k}).length;return '<button type="button" role="tab" aria-selected="'+(k==='all')+'" data-s="'+k+'">'+SECT[k]+'<em>'+n+'</em></button>'}).join('');
 st.addEventListener('click',function(e){var b=e.target.closest('[data-s]');if(!b)return;sector=b.dataset.s;$$('button',st).forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});paintLogos()});
})();
var sector='all';
function paintLogos(){var k=ind;$$('#logos li').forEach(function(li){var inS=sector==='all'||li.dataset.sec===sector;var m=k!=='all'&&(' '+li.dataset.ind+' ').indexOf(' '+k+' ')>-1;li.classList.toggle('dim',sector!=='all'?!inS:(k!=='all'&&!m));li.classList.toggle('hit',m&&inS);li.style.order=sector!=='all'&&inS?'-1':''})}

/* ================= 05 TALENT: dot matrix ================= */
(function(){
 var sv=$('#dotmx');if(!sv)return;var C=35,R=20,G=12,tot=695,S=96;sv.setAttribute('viewBox','0 0 '+(C*G)+' '+(R*G));
 var seed=7,pick={},n=0;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
 while(n<S){var i=Math.floor(rnd()*tot);if(!pick[i]){pick[i]=1;n++}}
 var h='';for(var i=0;i<tot;i++){var cx=(i%C)*G+G/2,cy=Math.floor(i/C)*G+G/2;h+='<circle cx="'+cx+'" cy="'+cy+'" r="3.7" style="--d:'+i+'"'+(pick[i]?' class="s"':'')+'/>'}
 sv.innerHTML=h;
 if(IO){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){sv.classList.add('go');o.disconnect()}})},{threshold:.25});o.observe(sv)}else sv.classList.add('go');
})();

/* ================= 06 PRODUCTION ================= */
(function(){
 hTrack.innerHTML=SERIES.map(function(s,i){return '<figure class="sv"><div class="im"><img src="img/series-'+s[0]+'.webp" alt="'+esc(s[1])+' series banner" width="640" height="320" loading="lazy" decoding="async"><span class="no">'+(i<9?'0':'')+(i+1)+'</span></div><figcaption class="cap"><div><b>'+esc(s[1])+'</b><span>'+s[2]+' · '+s[4]+'</span></div><div class="eps"><strong>'+s[3]+'</strong><span>eps</span></div></figcaption></figure>'}).join('');
 var eb=$('#epbars');eb.innerHTML=SERIES.slice().sort(function(a,b){return b[3]-a[3]}).map(function(s,i){return '<div class="ep"><span>'+esc(s[1])+'</span><i style="--v:'+s[3]+';--d:'+i+'"></i><b>'+s[3]+'</b></div>'}).join('');
 var gd=$('#gdonut'),gl=$('#gleg'),tot=GENRES.reduce(function(a,g){return a+g[1]},0),off=0,c='';
 GENRES.forEach(function(g){var pct=g[1]/tot*100;c+='<circle cx="80" cy="80" r="58" pathLength="100" stroke="'+g[2]+'" stroke-dasharray="0 100" data-a="'+(pct-.8).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'"/>';off+=pct});
 gd.innerHTML=c+'<text x="80" y="80" transform="rotate(90 80 80)" text-anchor="middle" font-size="26" font-weight="900" fill="currentColor" font-family="Inter,sans-serif" dy="2">23</text><text x="80" y="98" transform="rotate(90 80 80)" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor" opacity=".6" font-family="Inter,sans-serif" letter-spacing="1">GENRE TAGS</text>';
 gl.innerHTML=GENRES.map(function(g){return '<li><i style="--c:'+g[2]+'"></i>'+g[0]+'<b>'+g[1]+'</b></li>'}).join('');
 onReveal(gd.closest('.rv'),function(){$$('circle',gd).forEach(function(ci){ci.setAttribute('stroke-dasharray',ci.dataset.a+' 100')})});
})();

/* ================= 07 DESIGN ================= */
(function(){
 var tabs=$('#dtabs'),figs=$$('#dgal .dg'),notes=$$('.dnotes article');
 tabs.addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(!b)return;var d=b.dataset.d;$$('button',tabs).forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});
  vt(function(){figs.forEach(function(f){f.classList.toggle('out',d!=='all'&&f.dataset.d!==d)});notes.forEach(function(n){n.classList.toggle('dim',d!=='all'&&n.dataset.d!==d);n.classList.toggle('hit',d!=='all'&&n.dataset.d===d)})})});
 var lb=$('#lightbox'),li=$('#lbImg'),lc=$('#lbCap'),cur=0,vis=[];
 function show(i){vis=figs.filter(function(f){return !f.classList.contains('out')});cur=(i+vis.length)%vis.length;var f=vis[cur],im=$('img',f);li.src=im.currentSrc||im.src;li.alt=im.alt;lc.innerHTML=$('figcaption',f).innerHTML}
 figs.forEach(function(f){f.tabIndex=0;f.setAttribute('role','button');f.addEventListener('click',function(){vis=figs.filter(function(x){return !x.classList.contains('out')});show(vis.indexOf(f));openOv('#lightbox')});f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.click()}})});
 $('#lbPrev').addEventListener('click',function(){show(cur-1)});$('#lbNext').addEventListener('click',function(){show(cur+1)});
 lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
})();

/* ================= 08 CATEGORY: tabs, playbook, wheel, idea machine ================= */
var tabs=$('#itabs');
tabs.innerHTML=['all'].concat(ORDER).map(function(k){return '<button type="button" class="itab" role="tab" data-k="'+k+'"><i style="--c:'+PAL[k].acc+'"></i>'+(k==='all'?'All industries':IND[k].short)+'</button>'}).join('');
tabs.addEventListener('click',function(e){var b=e.target.closest('[data-k]');if(b)setInd(b.dataset.k)});
function renderPlay(k){var box=$('#play');
 if(k==='all'){box.innerHTML='<div class="pgrid">'+ORDER.map(function(x){var I=IND[x],P=PAL[x];return '<button type="button" class="pcard" data-k="'+x+'" style="--c:'+P.acc+';--ci:'+P.ink+'">'+svgIc(I.icon)+'<span class="eyebrow">'+I.label+'</span><b>'+I.hook+'</b><span class="go">See ideas →</span></button>'}).join('')+'</div>';return}
 var I=IND[k];
 box.innerHTML='<div class="play"><div><span class="eyebrow">'+svgIc(I.icon)+I.label+'</span><div class="hk">'+I.hook+'</div><p class="ch">'+I.ch+'</p><div class="pr"><small>Proof from the category</small><p>'+I.proof+'</p></div></div>'+
 '<div><div class="plays">'+I.plays.map(function(p,i){return '<div class="card"><b>'+(i+1)+'</b><h4>'+p[0]+'</h4><p>'+p[1]+'</p></div>'}).join('')+'</div>'+
 '<span class="eb2">What we would measure</span><div class="ms">'+I.kpi.map(function(m){return '<span>'+m+'</span>'}).join('')+'</div>'+
 '<div class="pk-hint">Suggested start: <b>'+I.pack+'</b> <a href="#packages">See packages →</a></div></div></div>'}
$('#play').addEventListener('click',function(e){var b=e.target.closest('.pcard');if(b)setInd(b.dataset.k)});

var selMonth=new Date().getMonth();
(function wheel(){
 var sv=$('#wheel'),cx=230,cy=230,R=196,r=118;sv.setAttribute('viewBox','0 0 460 460');
 function P(rad,a){var t=(a-90)*Math.PI/180;return [cx+rad*Math.cos(t),cy+rad*Math.sin(t)]}
 function arc(r1,r2,a0,a1){var p1=P(r1,a0),p2=P(r1,a1),p3=P(r2,a1),p4=P(r2,a0);return 'M'+p1[0].toFixed(1)+','+p1[1].toFixed(1)+' A'+r1+','+r1+' 0 0 1 '+p2[0].toFixed(1)+','+p2[1].toFixed(1)+' L'+p3[0].toFixed(1)+','+p3[1].toFixed(1)+' A'+r2+','+r2+' 0 0 0 '+p4[0].toFixed(1)+','+p4[1].toFixed(1)+' Z'}
 var s='';
 SEASONS.forEach(function(se){var a0=se[0]*30+2,a1=(se[1]+1)*30-2,p1=P(216,a0),p2=P(216,a1),lg=(a1-a0)>180?1:0;s+='<path class="season" stroke="'+se[2]+'" d="M'+p1[0].toFixed(1)+','+p1[1].toFixed(1)+' A216,216 0 '+lg+' 1 '+p2[0].toFixed(1)+','+p2[1].toFixed(1)+'"/>'});
 MONTHS.forEach(function(mo,i){var a0=i*30+1.2,a1=(i+1)*30-1.2,mid=i*30+15,lp=P(157,mid);
  s+='<path class="seg-a" data-m="'+i+'" d="'+arc(R,r,a0,a1)+'" tabindex="0" role="button" aria-label="'+mo.n+'"/><text class="ml" x="'+lp[0].toFixed(1)+'" y="'+lp[1].toFixed(1)+'">'+mo.m.toUpperCase()+'</text>';
  mo.e.forEach(function(e,j){var mp=P(205,mid+(mo.e.length>1?(j?5:-5):0));s+='<circle class="mom" cx="'+mp[0].toFixed(1)+'" cy="'+mp[1].toFixed(1)+'" r="4"/>'})});
 s+='<circle class="hub" cx="'+cx+'" cy="'+cy+'" r="104"/><text class="hub-t" id="hubT" x="'+cx+'" y="'+(cy+6)+'"></text><text class="hub-s" id="hubS" x="'+cx+'" y="'+(cy+30)+'"></text>';
 sv.innerHTML=s;
 sv.addEventListener('click',function(e){var p=e.target.closest('.seg-a');if(p){selMonth=+p.dataset.m;paintWheel()}});
 sv.addEventListener('keydown',function(e){var p=e.target.closest('.seg-a');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selMonth=+p.dataset.m;paintWheel()}});
 if(FINE)sv.addEventListener('mouseover',function(e){var p=e.target.closest('.seg-a');if(p&&+p.dataset.m!==selMonth){selMonth=+p.dataset.m;paintWheel()}});
})();
function paintWheel(){var I=IND[ind],mon=I.mon||{};
 $$('#wheel .seg-a').forEach(function(p){var m=+p.dataset.m;p.classList.toggle('hot',mon[m]!==undefined);p.classList.toggle('sel',m===selMonth)});
 var mo=MONTHS[selMonth];$('#hubT').textContent=mo.m.toUpperCase();$('#hubS').textContent=mo.s.toUpperCase();
 var line=mon[selMonth]!==undefined?'<b>For '+(ind==='all'?'most brands':I.label)+':</b> '+mon[selMonth]:(ind==='all'?'Pick your industry above to see what this month means for you.':'<b>For '+I.label+':</b> a quieter month — a good time for always-on content and planning the next peak.');
 $('#monthCard').innerHTML='<div class="mc-m">'+mo.n+'</div><div class="mc-s">'+mo.s+'</div><ul>'+mo.e.map(function(e){return '<li>'+svgIc(e[0])+'<div><b>'+e[1]+'</b><span>'+e[2]+'</span></div></li>'}).join('')+'</ul><div class="mc-ind">'+line+'</div>'}

var lastIdea='';
(function idea(){
 var rs=[$('#reel0'),$('#reel1'),$('#reel2')],out=$('#ideaOut'),keep=$('#keepIdea'),btn=$('#spin'),pos=[0,0,0],busy=false;
 rs.forEach(function(el,i){var h='';for(var k=0;k<4;k++)REELS[i].forEach(function(t){h+='<div>'+t+'</div>'});el.innerHTML=h});
 function ih(){var d=$('div',rs[0]);return d?d.offsetHeight:84}
 function finish(pick){var f=REELS[0][pick[0]],m=REELS[1][pick[1]],c=REELS[2][pick[2]];lastIdea='A '+f+' for '+m+', on '+c+'.';out.innerHTML='A <em>'+f+'</em> for <em>'+m+'</em>, on '+c+'.';keep.disabled=false;busy=false}
 btn.addEventListener('click',function(){if(busy)return;busy=true;keep.disabled=true;var pick=REELS.map(function(r){return Math.floor(Math.random()*r.length)}),H=ih();
  if(RM){rs.forEach(function(el,i){el.style.transform='translateY('+(-pick[i]*H)+'px)'});finish(pick);return}
  var done=0;rs.forEach(function(el,i){var n=REELS[i].length,from=pos[i],to=(2*n+pick[i]);el.style.transition='none';el.style.transform='translateY('+(-from*H)+'px)';el.offsetHeight;
   el.style.transition='transform '+(1.1+i*.45)+'s cubic-bezier(.15,.8,.2,1)';el.style.transform='translateY('+(-to*H)+'px)';
   setTimeout(function(){el.style.transition='none';el.style.transform='translateY('+(-pick[i]*H)+'px)';pos[i]=pick[i];if(++done===3)finish(pick)},(1.1+i*.45)*1000+60)})});
 keep.addEventListener('click',function(){if(!lastIdea)return;addIdea(lastIdea);keep.disabled=true;toast('Idea added to your brief')});
})();

/* ================= 10 PACKAGES ================= */
(function(){
 var pv=$('#pkView'),pks=$('#pks'),cmp=$('#compare');
 pv.addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;$$('button',pv).forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});var c=b.dataset.v==='compare';vt(function(){pks.hidden=c;cmp.hidden=!c})});
 var ad=$('#addons');ad.innerHTML=ADDONS.map(function(a){return '<button type="button" aria-pressed="false" data-addon="'+esc(a)+'">'+svgIc('plus')+esc(a)+'</button>'}).join('');
 ad.addEventListener('click',function(e){var b=e.target.closest('[data-addon]');if(!b)return;var inp=$('input[name="add"][value="'+b.dataset.addon.replace(/"/g,'\\"')+'"]');if(inp){inp.checked=!inp.checked;syncAddons();updateBrief(true);toast(inp.checked?'Added to your brief':'Removed from your brief')}});
})();
(function(){$$('#compare tbody td').forEach(function(td,i){if(td.closest('.grp,.cta-row')||td.cellIndex===0)return;var t=td.textContent.trim();
 if(t==='\u2713'){td.className='y';td.innerHTML=svgIc('check')+'<span class="sr">Included</span>'}
 else if(t==='\u2014'){td.className='n';td.innerHTML='<span aria-hidden="true">\u2014</span><span class="sr">Not included</span>'}
 else td.className='tx'})})();
D.addEventListener('focusin',function(e){if(e.target.matches&&e.target.matches('input:not([type=checkbox]):not([type=radio]),select,textarea'))D.body.classList.add('typing')});
D.addEventListener('focusout',function(){setTimeout(function(){var a=D.activeElement;if(!(a&&a.matches&&a.matches('input:not([type=checkbox]):not([type=radio]),select,textarea')))D.body.classList.remove('typing')},50)});
function syncAddons(){$$('#addons [data-addon]').forEach(function(b){var i=$('input[name="add"][value="'+b.dataset.addon.replace(/"/g,'\\"')+'"]');b.setAttribute('aria-pressed',i&&i.checked?'true':'false')})}

/* ================= OVERLAYS ================= */
var lastFocus=null;
function openOv(sel){var m=$(sel);if(!m)return;$$('.ov.open').forEach(function(o){if(o!==m)closeOv(o,true)});lastFocus=D.activeElement;m.classList.add('open');m.setAttribute('aria-hidden','false');D.body.classList.add('lock');setTimeout(function(){var f=sel==='#palette'?$('#palQ'):$('.x',m);f&&f.focus()},60);if(sel==='#palette')renderPal('')}
function closeOv(m,quiet){m.classList.remove('open');m.setAttribute('aria-hidden','true');if(!$('.ov.open'))D.body.classList.remove('lock');if(!quiet&&lastFocus&&lastFocus.focus)try{lastFocus.focus({preventScroll:true})}catch(e){}}
D.addEventListener('click',function(e){var o=e.target.closest('[data-open]');if(o){e.preventDefault();openOv(o.getAttribute('data-open'));return}
 if(e.target.closest('[data-palette]')){e.preventDefault();openOv('#palette');return}
 if(e.target.closest('[data-print]')){e.preventDefault();doPrint();return}
 var x=e.target.closest('[data-close]');if(x){closeOv(x.closest('.ov'));return}
 if(e.target.classList&&e.target.classList.contains('ov'))closeOv(e.target)});
mlist.addEventListener('click',function(e){if(e.target.closest('a'))closeOv($('#menu'),true)});
function doPrint(){$$('.ov.open').forEach(function(o){closeOv(o,true)});$$('.faq details').forEach(function(d){d.open=true});$$('.rv').forEach(function(el){el.classList.add('in')});setTimeout(function(){try{W.print()}catch(e){toast('Use your browser’s Print menu to save as PDF')}},120)}
W.addEventListener('beforeprint',function(){$$('.faq details').forEach(function(d){d.open=true})});

/* ================= PERSONALISATION ================= */
var qs;try{qs=new URLSearchParams(location.search)}catch(e){qs={get:function(){return null}}}
var brand=(qs.get('for')||qs.get('brand')||'').replace(/[\u0000-\u001f<>]/g,'').replace(/\s+/g,' ').trim().slice(0,60);
var ind=qs.get('ind');if(!IND[ind]){ind=store('aw_ind');if(!IND[ind])ind='all'}
if(brand){$$('[data-brand]').forEach(function(el){el.textContent=brand});$('#forChip').hidden=false;$$('.if-brand').forEach(function(el){el.hidden=false});D.title='Awaken × '+brand+' — Proposal'}

/* ================= INDUSTRY PICKER ================= */
var ip=$('#ipickList');
ip.innerHTML=['all'].concat(ORDER).map(function(k){var I=IND[k];return '<button type="button" data-k="'+k+'" style="--c:'+PAL[k].acc+'"><i></i>'+I.label+'<span>'+(k==='all'?'Show everything':I.hook)+'</span></button>'}).join('');
ip.addEventListener('click',function(e){var b=e.target.closest('[data-k]');if(!b)return;setInd(b.dataset.k);closeOv($('#ipick'),true);if(b.dataset.k!=='all')toast('Tailored for '+IND[b.dataset.k].label)});
$('#swatches').innerHTML=ORDER.map(function(k){return '<span style="--c:'+PAL[k].acc+'"><i></i>'+IND[k].short+' · '+PAL[k].h+'°</span>'}).join('');

/* ================= BRIEF ================= */
var bInd=$('#bInd'),mkInd=$('#mkInd'),bf=$('#bform');
function opts(el,name,arr,type){el.innerHTML=arr.map(function(v){return '<label><input type="'+type+'" name="'+name+'" value="'+esc(v)+'"><span>'+esc(v)+'</span></label>'}).join('')}
opts($('#oGoal'),'goal',GOALS,'checkbox');opts($('#oCh'),'ch',CHS,'checkbox');opts($('#oTime'),'time',TIMES,'radio');opts($('#oBud'),'bud',BUDS,'radio');opts($('#oPack'),'pack',PACKS,'radio');opts($('#oAdd'),'add',ADDONS,'checkbox');
var indOpts=['all'].concat(ORDER).map(function(k){return '<option value="'+k+'">'+(k==='all'?'Choose industry':IND[k].label)+'</option>'}).join('');
bInd.innerHTML=indOpts.replace('Choose industry','Other / not listed');mkInd.innerHTML=indOpts.replace('Choose industry','Any industry');
if(brand)$('#bBrand').value=brand;
function val(n){var el=$('input[name="'+n+'"]:checked');return el?el.value:''}
function vals(n){return $$('input[name="'+n+'"]:checked').map(function(x){return x.value})}
function addIdea(t){var set=$('#ideaSet'),o=$('#oIdea');set.hidden=false;if(vals('idea').indexOf(t)>-1)return;var l=D.createElement('label');l.innerHTML='<input type="checkbox" name="idea" checked value="'+esc(t)+'"><span>'+esc(t)+'</span>';o.appendChild(l);updateBrief(true)}
function briefText(){var b=$('#bBrand').value.trim(),k=bInd.value,L=[];
 L.push('Hi Awaken, here is our brief.');L.push('');
 L.push('Brand: '+(b||'—'));L.push('Industry: '+(k&&k!=='all'?IND[k].label:'Other / not listed'));
 var g=vals('goal');if(g.length)L.push('We need: '+g.join(', '));
 var c=vals('ch');if(c.length)L.push('Channels: '+c.join(', '));
 if(val('time'))L.push('Timing: '+val('time'));
 if(val('bud'))L.push('Budget (first phase): '+val('bud'));
 if(val('pack')&&val('pack')!=='Not sure')L.push('Package: '+val('pack'));
 var a=vals('add');if(a.length)L.push('Add-ons: '+a.join(', '));
 var id=vals('idea');if(id.length){L.push('Ideas we liked:');id.forEach(function(x){L.push('• '+x)})}
 var n=$('#bName').value.trim(),cn=$('#bCon').value.trim(),nt=$('#bNote').value.trim();
 if(n)L.push('From: '+n);if(cn)L.push('Contact: '+cn);if(nt){L.push('');L.push('Notes: '+nt)}
 L.push('');L.push('(Sent from the Awaken Digital proposal page)');return L.join('\n')}
var lastCount=0;
function updateBrief(bump){var t=briefText(),b=$('#bBrand').value.trim();$('#bOut').textContent=t;
 $('#sWA').href='https://wa.me/'+WA+'?text='+encodeURIComponent(t);
 $('#sML').href='mailto:'+MAIL+'?subject='+encodeURIComponent('Brief'+(b?' from '+b:'')+' — Awaken Digital')+'&body='+encodeURIComponent(t);
 var cnt=vals('goal').length+vals('add').length+vals('idea').length+(val('pack')&&val('pack')!=='Not sure'?1:0);
 var bc=$('#briefCount'),pb=$('#pbBrief');bc.textContent=pb.textContent=cnt;bc.hidden=pb.hidden=!cnt;
 if(cnt>lastCount&&bump!==false){bc.classList.remove('bump');void bc.offsetWidth;bc.classList.add('bump')}lastCount=cnt;
 var parts=[b,bInd.value!=='all',vals('goal').length,vals('ch').length,val('time'),val('bud'),val('pack'),$('#bName').value.trim(),$('#bCon').value.trim()];
 var pct=Math.round(parts.filter(Boolean).length/parts.length*100);$('#bpFill').style.width=pct+'%';$('#bpPct').textContent=pct+'%';
 $$('.pk').forEach(function(p){p.classList.toggle('chosen',val('pack')===p.dataset.pk)})}
bf.addEventListener('input',function(){updateBrief(true)});bf.addEventListener('change',function(){syncAddons();updateBrief(true)});bf.addEventListener('submit',function(e){e.preventDefault()});
bInd.addEventListener('change',function(){bInd.dataset.touched='1'});
$('#sCP').addEventListener('click',function(){copyText(briefText(),function(){toast('Brief copied')})});
$('#sVB').addEventListener('click',function(){copyText(briefText(),function(){toast('Brief copied — paste it into Viber');setTimeout(function(){location.href='viber://chat?number=%2B959255762417'},500)})});
D.addEventListener('click',function(e){var g=e.target.closest('[data-add-goal]');if(g){var i=$('input[name="goal"][value="'+g.dataset.addGoal+'"]');if(i&&!i.checked){i.checked=true;updateBrief(true)}toast('Added to your brief')}
 var p=e.target.closest('[data-pack]');if(p){var r=$('input[name="pack"][value="'+p.dataset.pack+'"]');if(r)r.checked=true;updateBrief(true);toast(p.dataset.pack+' added to your brief — scroll down when ready');}});

/* link maker */
function mk(){var b=$('#mkBrand').value.replace(/\s+/g,' ').trim(),k=mkInd.value,p=[];if(b)p.push('for='+encodeURIComponent(b));if(k&&k!=='all')p.push('ind='+k);var s=p.length?'?'+p.join('&'):'';
 var base=/awakenentertainment\.org$/.test(location.hostname)?location.origin+location.pathname:LIVE;$('#mkOut').value=base+s;$('#mkOpen').href=location.pathname+s}
$('#mkBrand').addEventListener('input',mk);mkInd.addEventListener('change',mk);
$('#mkCopy').addEventListener('click',function(){copyText($('#mkOut').value,function(){toast('Link copied')})});

/* ================= SET INDUSTRY ================= */
function setInd(k,silent){if(!IND[k])k='all';var apply=function(){
 ind=k;store('aw_ind',k);var I=IND[k],P=PAL[k];
 root.style.setProperty('--ind',P.acc);root.style.setProperty('--ind-ink',P.ink);root.style.setProperty('--ind-tint',P.tint);root.style.setProperty('--ind-soft',P.soft);
 $$('[data-indlabel]').forEach(function(el){el.textContent=k==='all'?'All brands':I.short});
 $('#indLine').textContent=k==='all'?'':'Ideas for '+I.label+' inside.';
 $$('#cases .case').forEach(function(c){var m=k!=='all'&&(' '+c.dataset.ind+' ').indexOf(' '+k+' ')>-1;c.classList.toggle('match',m);c.style.order=m?'-1':''});
 paintLogos();
 $$('.itab').forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k?'true':'false')});
 $$('#ipickList [data-k]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.k===k?'true':'false')});
 renderPlay(k);paintWheel();
 $$('.pk').forEach(function(p){var s=k!=='all'&&p.dataset.pk===I.pack;p.classList.toggle('sug',s);$('.sg',p).textContent=s?'Suggested for '+I.short:''});
 $$('#compare th[data-pk]').forEach(function(th,i){var on=k!=='all'&&th.dataset.pk===I.pack;th.classList.toggle('sugc',on)});
 if(!bInd.dataset.touched)bInd.value=k;mkInd.value=k;mk();updateBrief(false);
 if(!silent){try{var u=new URL(location.href);if(k==='all')u.searchParams.delete('ind');else u.searchParams.set('ind',k);history.replaceState(null,'',u.pathname+u.search+u.hash)}catch(e){}}};
 if(silent)apply();else vt(apply)}
setInd(ind,true);
$('#mkBrand').value=brand;mk();updateBrief(false);

/* ================= COMMAND PALETTE ================= */
var PAL_ITEMS=[];
(function(){
 chaps.forEach(function(c){if(c.id==='top')return;PAL_ITEMS.push({t:'Chapter',l:c.dataset.label.replace(/^\d+ · /,''),s:c.dataset.n==='★'?'':c.dataset.n,k:SUM[c.id]||'',run:function(){goTo('#'+c.id)}})});
 ['all'].concat(ORDER).forEach(function(k){PAL_ITEMS.push({t:'Industry',l:IND[k].label,s:k==='all'?'':IND[k].hook,k:'industry tailor filter',run:function(){setInd(k);goTo('#category')}})});
 $$('#cases .case').forEach(function(c){var h=$('h4',c).textContent,me=$('.m',c)||$('.kn b',c),m=me?me.textContent:'';PAL_ITEMS.push({t:'Case',l:h,s:m,k:'proof result '+c.dataset.cat,run:function(){goTo(c,'center');c.animate&&c.animate([{boxShadow:'0 0 0 0 rgba(255,90,60,.0)'},{boxShadow:'0 0 0 8px rgba(255,90,60,.45)'},{boxShadow:'0 0 0 0 rgba(255,90,60,0)'}],{duration:1400})}})});
 [['Build your brief','brief contact quote send whatsapp viber email',function(){goTo('#start')}],
  ['Compare packages','launch grow lead table price',function(){$('#pkView [data-v=compare]').click();goTo('#packages')}],
  ['Show the proof ledger','table numbers results',function(){$('#caseView [data-v=ledger]').click();goTo('#proof')}],
  ['Spin an idea','idea machine random concept',function(){goTo('#idea','center');setTimeout(function(){$('#spin').click()},700)}],
  ['Open the year of moments','calendar thingyan thadingyut month wheel',function(){goTo('#year','center')}],
  ['Open MCDB','talent database celebrities kol',function(){W.open('/mcdb/','_blank','noopener')}],
  ['Copy link to this proposal','share url',function(){copyText(location.href.split('#')[0],function(){toast('Link copied')})}],
  ['Save as PDF','print download',function(){doPrint()}],
  ['Choose your industry','tailor',function(){openOv('#ipick')}],
  ['Keyboard shortcuts','help keys',function(){openOv('#help')}]].forEach(function(a){PAL_ITEMS.push({t:'Action',l:a[0],s:'',k:a[1],run:a[2]})});
})();
var palSel=0,palRes=[];
function renderPal(q){q=(q||'').toLowerCase().trim();var toks=q.split(/\s+/).filter(Boolean);
 palRes=PAL_ITEMS.filter(function(it){var h=(it.t+' '+it.l+' '+it.s+' '+it.k).toLowerCase();return toks.every(function(t){return h.indexOf(t)>-1})}).slice(0,14);palSel=0;paintPal()}
function paintPal(){var ul=$('#palList');if(!palRes.length){ul.innerHTML='<li class="empty">Nothing found</li>';return}
 ul.innerHTML=palRes.map(function(it,i){return '<li role="option" data-i="'+i+'" class="'+(i===palSel?'on':'')+'"><span class="pt">'+it.t+'</span><b>'+esc(it.l)+'</b><small>'+esc(it.s)+'</small></li>'}).join('')}
function runPal(i){var it=palRes[i];if(!it)return;closeOv($('#palette'),true);setTimeout(it.run,60)}
$('#palQ').addEventListener('input',function(e){renderPal(e.target.value)});
$('#palQ').addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();palSel=Math.min(palRes.length-1,palSel+1);paintPal();scrollSel()}else if(e.key==='ArrowUp'){e.preventDefault();palSel=Math.max(0,palSel-1);paintPal();scrollSel()}else if(e.key==='Enter'){e.preventDefault();runPal(palSel)}});
function scrollSel(){var on=$('#palList li.on');on&&on.scrollIntoView({block:'nearest'})}
$('#palList').addEventListener('click',function(e){var li=e.target.closest('[data-i]');if(li)runPal(+li.dataset.i)});
$('#palList').addEventListener('mousemove',function(e){var li=e.target.closest('[data-i]');if(li&&+li.dataset.i!==palSel){palSel=+li.dataset.i;paintPal()}});

/* ================= KEYBOARD ================= */
D.addEventListener('keydown',function(e){
 if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();$('#palette').classList.contains('open')?closeOv($('#palette')):openOv('#palette');return}
 if(e.key==='Escape'){$$('.ov.open').forEach(function(o){closeOv(o)});return}
 var tg=e.target,typing=tg&&(/INPUT|TEXTAREA|SELECT/.test(tg.tagName)||tg.isContentEditable);
 if(typing||e.metaKey||e.ctrlKey||e.altKey||$('.ov.open'))return;
 var key=e.key;
 if(key==='/'){e.preventDefault();openOv('#palette')}
 else if(key==='j'||key==='k'){var list=chaps,i=list.indexOf(curChap);var n=list[clamp(i+(key==='j'?1:-1),0,list.length-1)];if(n){e.preventDefault();goTo(n)}}
 else if(key==='i'){openOv('#ipick')}
 else if(key==='b'){goTo('#start')}
 else if(key==='m'){openOv('#menu')}
 else if(key==='p'){doPrint()}
 else if(key==='?'){openOv('#help')}
});

/* ================= CURSOR, MAGNETIC, TILT ================= */
if(FINE&&!RM){
 var cur=$('#cursor'),ringEl=$('.cur-ring',cur),dotEl=$('.cur-dot',cur),tip=$('#curTip'),mx=-100,my=-100,rx=-100,ry=-100,shown=false;
 W.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!shown){shown=true;rx=mx;ry=my;cur.classList.remove('gone')}dotEl.style.transform='translate3d('+mx+'px,'+my+'px,0)'},{passive:true});
 D.addEventListener('mouseleave',function(){cur.classList.add('gone');shown=false});
 (function loop(){rx+=(mx-rx)*.2;ry+=(my-ry)*.2;ringEl.style.transform='translate3d('+rx.toFixed(1)+'px,'+ry.toFixed(1)+'px,0)';requestAnimationFrame(loop)})();
 D.addEventListener('mouseover',function(e){var t=e.target.closest('[data-tip]');var h=e.target.closest('a,button,label,summary,input,select,textarea,[role=button],.case,.dg');
  if(t&&!e.target.closest('a,button')){tip.textContent=t.dataset.tip;cur.classList.add('tip');cur.classList.remove('hov')}else if(t&&t.tagName==='A'){tip.textContent=t.dataset.tip;cur.classList.add('tip');cur.classList.remove('hov')}else{cur.classList.remove('tip');cur.classList.toggle('hov',!!h)}});
 $$('.mag').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform='translate('+(x*.18).toFixed(1)+'px,'+(y*.28).toFixed(1)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
 $$('.tilt').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.classList.add('hot');c.style.setProperty('--tx',(-y*5).toFixed(2)+'deg');c.style.setProperty('--ty',(x*6).toFixed(2)+'deg')});c.addEventListener('mouseleave',function(){c.classList.remove('hot');c.style.setProperty('--tx','0deg');c.style.setProperty('--ty','0deg')})});
 var hero=$('.hero');hero.addEventListener('mousemove',function(e){var x=e.clientX/VW()-.5,y=e.clientY/VH()-.5;mosaicEl.style.setProperty('--rx',(10-y*8).toFixed(2)+'deg');mosaicEl.style.setProperty('--ry',(-16+x*10).toFixed(2)+'deg')});
}

/* ================= START ================= */
measure();frame();
W.addEventListener('load',function(){measure();frame()});
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){measure();frame()});
})();
