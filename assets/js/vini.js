(() => {
const UI={
it:{
 title:'La Carta Vini',intro:'Una selezione pensata per accompagnare la nostra cucina, tra territorio e grandi denominazioni.',
 foodMenu:'MENU CIBO',wineList:'CARTA VINI',
 entryList:'CARTA DEI VINI',entryListText:'Esplora la selezione completa',
 entryGuide:'TROVA IL VINO GIUSTO',entryGuideText:'Lasciati guidare dal nostro Wine Guide',
 back:'CARTA VINI',catalogEyebrow:'LA SELEZIONE',catalogTitle:'Carta dei Vini',
 categories:{sparkling:'BOLLICINE',white:'BIANCHI',red:'ROSSI',rose:'ROSATI'},all:'TUTTI',
 guideTitle:'Trova il vino giusto',guideIntro:'Tre domande per trovare le bottiglie più adatte al tuo gusto e a ciò che mangerai.',
 questions:['Cosa vuoi bere?','Che carattere cerchi?','Cosa mangerai?'],
 styles:{fresh:'FRESCO',mineral:'MINERALE',elegant:'ELEGANTE',structured:'STRUTTURATO',aromatic:'AROMATICO',soft:'MORBIDO'},
 foods:{raw:'CRUDI',fish:'PESCE',pasta:'PASTA',meat:'CARNE',vegetables:'VEGETALI',dessert:'DOLCE'},
 countries:{all:'TUTTI',italy:'ITALIA',france:'FRANCIA',spain:'SPAGNA'},
 results:'PER TE ABBIAMO SCELTO',noResults:'Nessuna bottiglia corrisponde esattamente. Prova a cambiare una scelta.',
 perfectWith:'PERFETTO CON',facts:{denomination:'DENOMINAZIONE',grapes:'UVE',vintage:'ANNATA',dosage:'DOSAGGIO',aging:'AFFINAMENTO',format:'FORMATO'}
},
en:{
 title:'The Wine List',intro:'A selection created to accompany our cuisine, from local terroirs to great appellations.',
 foodMenu:'FOOD MENU',wineList:'WINE LIST',entryList:'THE WINE LIST',entryListText:'Explore the complete selection',
 entryGuide:'FIND THE RIGHT WINE',entryGuideText:'Let our Wine Guide help you choose',
 back:'WINE LIST',catalogEyebrow:'THE SELECTION',catalogTitle:'The Wine List',
 categories:{sparkling:'SPARKLING',white:'WHITES',red:'REDS',rose:'ROSÉ'},all:'ALL',
 guideTitle:'Find the right wine',guideIntro:'Three questions to find bottles suited to your taste and your food.',
 questions:['What would you like to drink?','What character are you looking for?','What will you eat?'],
 styles:{fresh:'FRESH',mineral:'MINERAL',elegant:'ELEGANT',structured:'STRUCTURED',aromatic:'AROMATIC',soft:'SOFT'},
 foods:{raw:'RAW',fish:'FISH',pasta:'PASTA',meat:'MEAT',vegetables:'VEGETABLES',dessert:'DESSERT'},
 countries:{all:'ALL',italy:'ITALY',france:'FRANCE',spain:'SPAIN'},
 results:'SELECTED FOR YOU',noResults:'No bottle matches exactly. Try changing one choice.',
 perfectWith:'PERFECT WITH',facts:{denomination:'APPELLATION',grapes:'GRAPES',vintage:'VINTAGE',dosage:'DOSAGE',aging:'AGING',format:'FORMAT'}
},
es:{
 title:'La Carta de Vinos',intro:'Una selección pensada para acompañar nuestra cocina, entre territorio y grandes denominaciones.',
 foodMenu:'MENÚ COMIDA',wineList:'CARTA DE VINOS',entryList:'CARTA DE VINOS',entryListText:'Explora la selección completa',
 entryGuide:'ENCUENTRA EL VINO IDEAL',entryGuideText:'Déjate guiar por nuestro Wine Guide',
 back:'CARTA DE VINOS',catalogEyebrow:'LA SELECCIÓN',catalogTitle:'Carta de Vinos',
 categories:{sparkling:'ESPUMOSOS',white:'BLANCOS',red:'TINTOS',rose:'ROSADOS'},all:'TODOS',
 guideTitle:'Encuentra el vino ideal',guideIntro:'Tres preguntas para encontrar las botellas más adecuadas a tu gusto y a lo que comerás.',
 questions:['¿Qué quieres beber?','¿Qué carácter buscas?','¿Qué vas a comer?'],
 styles:{fresh:'FRESCO',mineral:'MINERAL',elegant:'ELEGANTE',structured:'ESTRUCTURADO',aromatic:'AROMÁTICO',soft:'SUAVE'},
 foods:{raw:'CRUDOS',fish:'PESCADO',pasta:'PASTA',meat:'CARNE',vegetables:'VEGETALES',dessert:'POSTRE'},
 countries:{all:'TODOS',italy:'ITALIA',france:'FRANCIA',spain:'ESPAÑA'},
 results:'HEMOS ELEGIDO PARA TI',noResults:'Ninguna botella coincide exactamente. Prueba a cambiar una opción.',
 perfectWith:'PERFECTO CON',facts:{denomination:'DENOMINACIÓN',grapes:'UVAS',vintage:'AÑADA',dosage:'DOSAGE',aging:'CRIANZA',format:'FORMATO'}
}};
let lang=localStorage.getItem('scirocco_lang')||'it',data={wines:[]},menuData={products:[],categories:[]},activeType='sparkling',activeCountry='all',guideStep=0,guide={type:null,style:null,food:null};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],t=o=>o?.[lang]||o?.it||'',money=n=>new Intl.NumberFormat(lang==='en'?'en-GB':lang==='es'?'es-ES':'it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:0}).format(n);
function ui(){return UI[lang]||UI.it}
function applyUI(){
 const u=ui();document.documentElement.lang=lang;
 $('#winePageTitle').textContent=u.title;$('#winePageIntro').textContent=u.intro;$('#wineFoodLabel').textContent=u.foodMenu;$('#wineListLabel').textContent=u.wineList;
 $('#wineEntryListTitle').textContent=u.entryList;$('#wineEntryListText').textContent=u.entryListText;$('#wineEntryGuideTitle').textContent=u.entryGuide;$('#wineEntryGuideText').textContent=u.entryGuideText;
 $('#wineBackHome').textContent=u.back;const guideBackHome=$('#guideBackHome');if(guideBackHome)guideBackHome.textContent=u.back;$('#wineCatalogEyebrow').textContent=u.catalogEyebrow;$('#wineCatalogTitle').textContent=u.catalogTitle;
 $('#guideTitle').textContent=u.guideTitle;$('#guideIntro').textContent=u.guideIntro;$('#wineFoodPairingsTitle').textContent=u.perfectWith;
 $$('#wineCategoryBar [data-wine-category]').forEach(b=>b.textContent=u.categories[b.dataset.wineCategory]);
 const toggle=$('#menuLangToggle');if(toggle)toggle.textContent=lang.toUpperCase();
 $$('[data-menu-lang]').forEach(b=>b.classList.toggle('active',b.dataset.menuLang===lang));
 if(!$('#wineCatalog').hidden)renderCatalog();if(!$('#wineGuide').hidden)renderGuide();
}
function show(section){
 const catalogActive=section!=='guide';
 $('#wineCatalog').hidden=!catalogActive;
 $('#wineGuide').hidden=catalogActive;
 $('#openWineList').classList.toggle('is-active',catalogActive);
 $('#openWineGuide').classList.toggle('is-active',!catalogActive);
 if(catalogActive)renderCatalog();
 if(!catalogActive){
  guideStep=0;
  guide={type:null,style:null,food:null};
  renderGuide();
 }
 const target=catalogActive?$('#wineCatalog'):$('#wineGuide');
 if(target)window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-18),behavior:'smooth'});
}
function renderCatalog(){
 const u=ui();$$('#wineCategoryBar button').forEach(b=>b.classList.toggle('is-active',b.dataset.wineCategory===activeType));
 const available=[...new Set(data.wines.filter(w=>w.active&&w.type===activeType).map(w=>w.country))];
 if(activeCountry!=='all'&&!available.includes(activeCountry))activeCountry='all';
 $('#wineFilterStack').innerHTML=['all',...available].map(c=>`<button class="wine-filter ${c===activeCountry?'is-active':''}" data-country="${c}">${u.countries[c]||c.toUpperCase()}</button>`).join('');
 $$('#wineFilterStack button').forEach(b=>b.onclick=()=>{activeCountry=b.dataset.country;renderCatalog()});
 const list=data.wines.filter(w=>w.active&&w.type===activeType&&(activeCountry==='all'||w.country===activeCountry)).sort((a,b)=>(a.order||99)-(b.order||99));
 $('#wineProducts').innerHTML=list.map(w=>`<button class="wine-product" data-wine="${w.id}"><img class="wine-product-image" src="${w.image}" alt=""><span class="wine-product-copy"><span class="wine-product-producer">${w.producer}</span><span class="wine-product-name">${t(w.name)}</span><span class="wine-product-meta">${w.denomination} · ${w.grapes.join(', ')}${w.vintage&&w.vintage!=='NV'?' · '+w.vintage:''}</span></span><span class="wine-product-price">${money(w.price)}</span><span class="wine-product-arrow">›</span></button>`).join('');
 $$('#wineProducts [data-wine]').forEach(b=>b.onclick=()=>openWine(b.dataset.wine));
}
const guideDescriptors={
 type:{
  sparkling:{it:'Effervescente · luminoso',en:'Sparkling · luminous',es:'Espumoso · luminoso'},
  white:{it:'Fresco · preciso',en:'Fresh · precise',es:'Fresco · preciso'},
  red:{it:'Profondo · avvolgente',en:'Deep · enveloping',es:'Profundo · envolvente'},
  rose:{it:'Mediterraneo · delicato',en:'Mediterranean · delicate',es:'Mediterráneo · delicado'}
 },
 style:{
  fresh:{it:'Vivo · agile · immediato',en:'Vibrant · agile · immediate',es:'Vivo · ágil · inmediato'},
  mineral:{it:'Teso · sapido · verticale',en:'Tense · saline · vertical',es:'Tenso · salino · vertical'},
  elegant:{it:'Fine · equilibrato · persistente',en:'Fine · balanced · persistent',es:'Fino · equilibrado · persistente'},
  structured:{it:'Intenso · complesso · profondo',en:'Intense · complex · deep',es:'Intenso · complejo · profundo'},
  aromatic:{it:'Espressivo · fragrante · avvolgente',en:'Expressive · fragrant · enveloping',es:'Expresivo · fragante · envolvente'},
  soft:{it:'Rotondo · armonioso · vellutato',en:'Round · harmonious · velvety',es:'Redondo · armonioso · aterciopelado'}
 },
 food:{
  raw:{it:'Ostriche · tartare · carpacci',en:'Oysters · tartare · carpaccio',es:'Ostras · tartar · carpaccio'},
  fish:{it:'Brace · forno · Mediterraneo',en:'Grill · oven · Mediterranean',es:'Brasa · horno · Mediterráneo'},
  pasta:{it:'Primi di mare e di terra',en:'Sea and land pasta dishes',es:'Pastas de mar y tierra'},
  meat:{it:'Secondi · cotture alla brace',en:'Mains · grilled preparations',es:'Segundos · cocciones a la brasa'},
  vegetables:{it:'Orto · legumi · cucina vegetale',en:'Garden · legumes · vegetables',es:'Huerta · legumbres · vegetales'},
  dessert:{it:'Cioccolato · agrumi · fine pasto',en:'Chocolate · citrus · dessert',es:'Chocolate · cítricos · postre'}
 }
};
function guideDesc(group,key){
 const item=guideDescriptors[group]&&guideDescriptors[group][key];
 return item?(item[lang]||item.it):'';
}
function updateTastePath(){
 const u=ui();
 const values=[
  guide.type?u.categories[guide.type]:'—',
  guide.style?u.styles[guide.style]:'—',
  guide.food?u.foods[guide.food]:'—'
 ];
 const tastePath=$('#wineTastePath');
 if(tastePath){
  const heading=lang==='en'?'YOUR PROFILE':lang==='es'?'TU PERFIL':'IL TUO PROFILO';
  tastePath.innerHTML=`<small>${heading}</small><div>${values.map((value,i)=>`<span class="${value==='—'?'is-empty':'is-set'}"><b>${value}</b><em>0${i+1}</em></span>${i<2?'<i>—</i>':''}`).join('')}</div>`;
 }
}
function guideOptionMarkup(group,key,label){
 return `<button type="button" class="wine-choice" data-guide-value="${key}"><span class="wine-choice-label">${label}</span><small>${guideDesc(group,key)}</small><b>→</b></button>`;
}

const characterKeys=['fresh','mineral','elegant','structured','aromatic','soft'];
let characterWheelIndex=0;
let wineWheelAnimating=false;
function characterWheelLabel(key){return ui().styles[key]||key}
function wheelOffset(index,current,total){let d=index-current;if(d>total/2)d-=total;if(d<-total/2)d+=total;return d}
function renderCharacterWheel(){
 const track=$('#wineWheelTrack'),counter=$('#wineWheelCounter'),confirm=$('#wineWheelConfirm');
 if(!track)return;
 const total=characterKeys.length;

 if(track.children.length!==total){
  track.innerHTML=characterKeys.map((key,index)=>`<div class="wine-wheel-option" role="option" aria-selected="false" data-wheel-index="${index}"><strong>${characterWheelLabel(key)}</strong><small></small></div>`).join('');
 }

 [...track.children].forEach((option,index)=>{
  const key=characterKeys[index],d=wheelOffset(index,characterWheelIndex,total);
  option.dataset.depth=String(d);
  option.classList.toggle('is-current',d===0);
  option.setAttribute('aria-selected',d===0?'true':'false');
  const small=option.querySelector('small');
  if(small)small.textContent=d===0?guideDesc('style',key):'';
  option.hidden=Math.abs(d)>2;
 });

 if(counter)counter.textContent=`${String(characterWheelIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
 if(confirm){const choose=lang==='en'?'CHOOSE':lang==='es'?'ELEGIR':'SCEGLI';confirm.textContent=`${choose} ${characterWheelLabel(characterKeys[characterWheelIndex])} →`;confirm.classList.remove('is-selected')}
}
function moveCharacterWheel(delta){
 if(wineWheelAnimating)return;
 wineWheelAnimating=true;

 const track=$('#wineWheelTrack');
 const total=characterKeys.length;
 const nextIndex=(characterWheelIndex+delta+total)%total;

 if(!track){
  characterWheelIndex=nextIndex;
  renderCharacterWheel();
  wineWheelAnimating=false;
  return;
 }

 const options=[...track.querySelectorAll('.wine-wheel-option')];

 /* FRAME 1 — prepare the sixth card just outside the visible cylinder.
    Nothing currently visible moves yet. */
 options.forEach((option,index)=>{
  const nextDepth=wheelOffset(index,nextIndex,total);
  if(Math.abs(nextDepth)<=2 && option.hidden){
   option.hidden=false;
   option.dataset.depth=String(delta>0?3:-3);
   option.classList.remove('is-current');
   option.setAttribute('aria-selected','false');
  }
 });

 /* Force the preparation state to be painted before changing depths. */
 void track.offsetHeight;

 requestAnimationFrame(()=>{
  requestAnimationFrame(()=>{
   /* FRAME 2 — every mounted card advances exactly one physical level. */
   options.forEach((option,index)=>{
    const key=characterKeys[index];
    const d=wheelOffset(index,nextIndex,total);

    option.dataset.depth=String(d);
    option.classList.toggle('is-current',d===0);
    option.setAttribute('aria-selected',d===0?'true':'false');

    const small=option.querySelector('small');
    if(small)small.textContent=d===0?guideDesc('style',key):'';
   });

   characterWheelIndex=nextIndex;

   const counter=$('#wineWheelCounter'),confirm=$('#wineWheelConfirm');
   if(counter)counter.textContent=`${String(characterWheelIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
   if(confirm){
    const choose=lang==='en'?'CHOOSE':lang==='es'?'ELEGIR':'SCEGLI';
    confirm.textContent=`${choose} ${characterWheelLabel(characterKeys[characterWheelIndex])} →`;
    confirm.classList.remove('is-selected');
   }

   /* Hide only the card that has completed its exit, after the CSS transition. */
   window.setTimeout(()=>{
    options.forEach((option,index)=>{
     const d=wheelOffset(index,characterWheelIndex,total);
     option.hidden=Math.abs(d)>2;
    });
    wineWheelAnimating=false;
   },500);
  });
 });
}
function confirmCharacterWheel(){guide.style=characterKeys[characterWheelIndex];const c=$('#wineWheelConfirm');if(c)c.classList.add('is-selected');setTimeout(()=>showGuideStep(2),220)}
function syncCharacterWheel(){const selected=guide.style?characterKeys.indexOf(guide.style):-1;characterWheelIndex=selected>=0?selected:0;renderCharacterWheel()}
function renderGuide(){
 const u=ui();
 const sets=[
  ['type',Object.entries(u.categories)],
  ['style',Object.entries(u.styles)],
  ['food',Object.entries(u.foods)]
 ];
 sets.forEach(([group,entries],i)=>{
  $(`#guideQuestion${i}`).textContent=u.questions[i];
  $(`#guideOptions${i}`).innerHTML=entries.map(([key,label])=>guideOptionMarkup(group,key,label)).join('');
 });
 updateTastePath();
 syncCharacterWheel();
 showGuideStep(guideStep);
}
function showGuideStep(step){
 guideStep=Math.max(0,Math.min(Number(step)||0,3));
 $$('.wine-step[data-guide-step]').forEach(el=>{
  el.classList.toggle('active',Number(el.dataset.guideStep)===guideStep);
 });
 $('#guideResult').classList.toggle('active',guideStep===3);
 $('#guideProgressBar').style.width=`${Math.min(guideStep+1,3)/3*100}%`;
 updateTastePath();
 if(guideStep===3){
  const searching=$('#guideSearching');
  const result=$('#guideResult');
  if(result)result.classList.remove('active');
  if(searching){
   $('#guideSearchingText').textContent=lang==='en'?'SEARCHING OUR CELLAR…':lang==='es'?'BUSCANDO EN NUESTRA BODEGA…':'STIAMO CERCANDO NELLA NOSTRA CANTINA…';
   searching.classList.remove('is-visible');
   void searching.offsetWidth;
   searching.classList.add('is-visible');
   clearTimeout(window.__wineGuideResultTimer);
   window.__wineGuideResultTimer=setTimeout(()=>{
    searching.classList.remove('is-visible');
    renderGuideResults();
    if(result)result.classList.add('active');
   },650);
  }else renderGuideResults();
 }
}
function handleGuideClick(event){
 const choice=event.target.closest('[data-guide-value]');
 if(choice&&$('#wineGuide').contains(choice)){
  const value=choice.dataset.guideValue;
  if(guideStep===0)guide.type=value;
  else if(guideStep===1)guide.style=value;
  else if(guideStep===2)guide.food=value;
  choice.classList.add('is-selected');
  const nextStep=guideStep+1;
  setTimeout(()=>showGuideStep(nextStep),260);
  return;
 }
 const back=event.target.closest('[data-guide-back]');
 if(back&&$('#wineGuide').contains(back)){
  if(guideStep===1)guide.type=null;
  else if(guideStep===2)guide.style=null;
  showGuideStep(guideStep-1);
 }
}
const foodMap={raw:['ostriche','ricciola-agrumi'],fish:['ostriche','ricciola-agrumi','polpo-patata','dentice-brace'],pasta:['spaghettone-ricci','orecchiette-cime-rapa'],meat:[],vegetables:['parmigiana-melanzane','fave-cicoria','carciofo-arrostito'],dessert:['sorbetto-limone','cremoso-cioccolato']};
function renderGuideResults(){
 const u=ui(),foodIds=foodMap[guide.food]||[];
 const scored=data.wines.filter(w=>w.active&&w.type===guide.type)
  .map(w=>({w,score:((w.style||[]).includes(guide.style)?2:0)+((w.foodPairings||[]).some(id=>foodIds.includes(id))?2:0)}))
  .sort((a,b)=>b.score-a.score || ((a.w.order??999)-(b.w.order??999)))
  .slice(0,4).map(x=>x.w);
 const primary=scored[0],alternatives=scored.slice(1);
 $('#guideResultEyebrow').textContent=lang==='en'?'OUR CHOICE FOR YOU':lang==='es'?'NUESTRA ELECCIÓN PARA TI':'LA NOSTRA SCELTA PER TE';
 $('#guideResultTitle').textContent='';
 if(!primary){
  $('#guideResultList').innerHTML=`<p>${u.noResults}</p>`;
 }else{
  const reason=lang==='en'
   ?'The bottle that best matches the character and pairing you selected.'
   :lang==='es'
    ?'La botella que mejor interpreta el carácter y el maridaje que has elegido.'
    :'La bottiglia che interpreta meglio il carattere e l’abbinamento che hai scelto.';
  const altTitle=lang==='en'?'OTHER LABELS YOU MAY LIKE':lang==='es'?'OTRAS ETIQUETAS QUE PODRÍAN GUSTARTE':'ALTRE ETICHETTE CHE POTREBBERO PIACERTI';
  $('#guideResultList').innerHTML=`
   <button type="button" class="wine-guide-hero-card" data-guide-wine="${primary.id}">
    <span class="wine-guide-hero-visual"><img src="${primary.image}" alt=""></span>
    <span class="wine-guide-hero-copy">
     <small>${primary.producer}</small>
     <strong>${t(primary.name)}</strong>
     <em>${primary.denomination}${primary.region?' · '+primary.region:''}</em>
     <span class="wine-guide-reason">${reason}</span>
     <span class="wine-guide-hero-bottom"><b>${money(primary.price)}</b><i>${lang==='en'?'DISCOVER THE WINE':lang==='es'?'DESCUBRE EL VINO':'SCOPRI IL VINO'} →</i></span>
    </span>
   </button>
   ${alternatives.length?`<div class="wine-guide-alternatives"><p>${altTitle}</p><div class="wine-guide-alt-grid">${alternatives.map(w=>`<button type="button" class="wine-guide-alt-card" data-guide-wine="${w.id}"><span class="wine-guide-alt-image"><img src="${w.image}" alt=""></span><span class="wine-guide-alt-copy"><small>${w.producer}</small><strong>${t(w.name)}</strong><em>${w.denomination||''}</em><span><b>${money(w.price)}</b><i>→</i></span></span></button>`).join('')}</div></div>`:''}`;
 }
 $$('[data-guide-wine]').forEach(btn=>btn.onclick=()=>openWine(btn.dataset.guideWine));
 $('#guideModify').textContent=lang==='en'?'‹ CHANGE SELECTIONS':lang==='es'?'‹ MODIFICAR ELECCIONES':'‹ MODIFICA LE SCELTE';
 $('#guideModify').onclick=()=>{guide.food=null;showGuideStep(2)};
 $('#guideRestart').textContent=lang==='en'?'START AGAIN':lang==='es'?'EMPEZAR DE NUEVO':'RICOMINCIA';
 $('#guideRestart').onclick=()=>{guideStep=0;guide={type:null,style:null,food:null};renderGuide()};
}
function openWine(id){
 const w=data.wines.find(x=>x.id===id);if(!w)return;const u=ui();
 $('#wineSheetImage').src=w.image||'';$('#wineSheetImage').alt=t(w.name);$('#wineSheetMeta').textContent=`${w.denomination} · ${w.region}`;$('#wineSheetName').textContent=t(w.name);$('#wineSheetProducer').textContent=w.producer;$('#wineSheetDescription').textContent=t(w.description);
 const facts=[[u.facts.denomination,w.denomination],[u.facts.grapes,w.grapes.join(', ')],[u.facts.vintage,w.vintage],[u.facts.dosage,w.dosage],[u.facts.aging,w.aging],[u.facts.format,w.format]].filter(x=>x[1]);
 $('#wineSheetFacts').innerHTML=facts.map(x=>`<div class="wine-fact"><span>${x[0]}</span><span>${x[1]}</span></div>`).join('');$('#wineSheetPrice').textContent=money(w.price);
 const pair=w.foodPairings||[];
 const foodCards=pair.map(id=>{
  const p=menuData.products.find(x=>x.id===id&&x.active);
  if(!p)return '';
  const category=menuData.categories.find(c=>c.id===p.category);
  return `<a class="dish-related-card" data-food="${p.id}" href="menu.html?piatto=${encodeURIComponent(p.id)}"><small>${category?t(category.name):''}</small><strong>${t(p.name)}</strong><span>${money(p.price)}</span></a>`;
 }).join('');
 $('#wineFoodPairingsBlock').hidden=!foodCards;
 $('#wineFoodPairings').innerHTML=foodCards;
 $('#wineBackdrop').hidden=false;$('#wineSheet').setAttribute('aria-hidden','false');document.body.classList.add('sheet-open');requestAnimationFrame(()=>{$('#wineSheet').classList.add('open');$('#wineBackdrop').classList.add('open')});
}
function closeWine(){$('#wineSheet').classList.remove('open');$('#wineBackdrop').classList.remove('open');$('#wineSheet').setAttribute('aria-hidden','true');document.body.classList.remove('sheet-open');setTimeout(()=>{$('#wineBackdrop').hidden=true},220)}
function initEvents(){
 const wineGuide=$('#wineGuide');
 if(wineGuide&&!wineGuide.dataset.eventsBound){
  wineGuide.addEventListener('click',handleGuideClick);
  wineGuide.dataset.eventsBound='1';
 }
 const wheelConfirm=$('#wineWheelConfirm'),wheelStage=$('#wineWheelStage');
 if(wheelConfirm)wheelConfirm.onclick=confirmCharacterWheel;
 if(wheelStage&&!wheelStage.dataset.wheelBound){
  let startY=null,dragging=false;
  wheelStage.addEventListener('pointerdown',e=>{startY=e.clientY;dragging=false;if(wheelStage.setPointerCapture)wheelStage.setPointerCapture(e.pointerId)});
  wheelStage.addEventListener('pointermove',e=>{if(startY!==null&&Math.abs(e.clientY-startY)>8)dragging=true});
  wheelStage.addEventListener('pointerup',e=>{if(startY===null)return;const dy=e.clientY-startY;startY=null;if(Math.abs(dy)>24)moveCharacterWheel(dy<0?1:-1)});
  wheelStage.addEventListener('pointercancel',()=>{startY=null});
  wheelStage.addEventListener('click',e=>{const o=e.target.closest('[data-wheel-index]');if(!o||dragging){dragging=false;return}const target=Number(o.dataset.wheelIndex);if(Number.isFinite(target)&&target!==characterWheelIndex){let d=target-characterWheelIndex;if(d>characterKeys.length/2)d-=characterKeys.length;if(d<-characterKeys.length/2)d+=characterKeys.length;moveCharacterWheel(d>0?1:-1)}});
  wheelStage.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();moveCharacterWheel(-1)}if(e.key==='ArrowDown'){e.preventDefault();moveCharacterWheel(1)}if(e.key==='Enter'||e.key===' '){e.preventDefault();confirmCharacterWheel()}});
  wheelStage.dataset.wheelBound='1';
 }

 $('#openWineList').onclick=()=>show('catalog');$('#openWineGuide').onclick=()=>show('guide');$('#closeWineList').onclick=()=>show(null);const closeWineGuide=$('#closeWineGuide');if(closeWineGuide)closeWineGuide.onclick=()=>show(null);
 $$('#wineCategoryBar [data-wine-category]').forEach(b=>b.onclick=()=>{activeType=b.dataset.wineCategory;activeCountry='all';renderCatalog()});
 $('#wineSheetClose').onclick=closeWine;$('#wineBackdrop').onclick=closeWine;
 $$('[data-menu-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.menuLang;localStorage.setItem('scirocco_lang',lang);applyUI();const p=$('#menuLangPopover');if(p)p.classList.remove('open')});
 const toggle=$('#menuLangToggle'),pop=$('#menuLangPopover');if(toggle&&pop)toggle.onclick=()=>pop.classList.toggle('open');
}
async function init(){
 try{
  const [wineResponse,menuResponse]=await Promise.all([
   fetch('data/wines.json'),
   fetch('data/menu.json')
  ]);
  data=await wineResponse.json();
  menuData=await menuResponse.json();
 }catch(e){
  console.error('Wine/menu data',e);
 }
 applyUI();
 initEvents();
 const params=new URLSearchParams(location.search),wine=params.get('vino');
 if(wine)openWine(wine);
 renderCatalog();
}
init();
})();