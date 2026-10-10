(() => {
const DRINK_FALLBACK=`<svg class="gm-image-fallback-icon gm-image-fallback-cocktail" viewBox="0 0 140 160" aria-hidden="true"><path d="M20 24 H120 L76 82 V132 H101 M49 132 H101 M64 82 L20 24 M76 82 L120 24 M43 48 H97 M88 39 C101 28 112 29 121 35 C111 43 100 46 88 39 Z"/></svg>`;
const moduleRoot=document.querySelector('[data-menu-module="drinks"]')||document;

const pageParams=new URLSearchParams(location.search),adminPreview=pageParams.get('adminPreview')==='1',previewToken=pageParams.get('previewToken');if(adminPreview)document.body.classList.add('admin-embedded-preview');
function adminSnapshot(){if(!adminPreview||!previewToken)return null;try{return JSON.parse(sessionStorage.getItem(`giacomo_menu_preview_${previewToken}`)||'null')}catch(e){console.warn('[Admin preview] invalid snapshot',e);return null}}
let UI=null,data,lang=localStorage.getItem('scirocco_lang')||'it',activeCategory='bevande',current=null;
const $=s=>moduleRoot.querySelector(s),t=o=>o?.[lang]||o?.it||'',money=n=>new Intl.NumberFormat(lang==='en'?'en-GB':lang==='es'?'es-ES':'it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:0}).format(n);
const list=$('#menuList'),bar=$('#menuCategoryBar'),sheet=$('#dishSheet'),backdrop=$('#dishBackdrop');
function applyUI(){document.documentElement.lang=lang;$('#drinkSheetGallery').dataset.emptyLabel=UI.drinks.noImage||'';const dt=$('#drinksTitle'),di=$('#drinksIntro'),mf=$('#menuFoodLabel'),mw=$('#menuWineLabel'),md=$('#menuDrinksLabel'),mlt=$('#menuLangToggle');if(dt)dt.textContent=UI.drinks.title;if(di)di.textContent=UI.drinks.intro;if(mf)mf.textContent=UI.drinks.foodMenu;if(mw)mw.textContent=UI.drinks.wineList;if(md)md.textContent=UI.drinks.drinksList;if(mlt)mlt.textContent=lang.toUpperCase();document.querySelectorAll('[data-menu-lang],[data-mobile-lang]').forEach(b=>b.classList.toggle('active',(b.dataset.mobileLang||b.dataset.menuLang)===lang));renderCategories();renderMenu()}
function getVisibleMenuHeaderHeight(){
 const mobile=document.querySelector('.menu-mobile-header');
 const desktop=document.querySelector('#header.menu-desktop-header');
 const visible=el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0};
 const header=visible(mobile)?mobile:(visible(desktop)?desktop:null);
 return header?Math.ceil(header.getBoundingClientRect().height):0
}
function scrollProductsToFixedStart(){
 requestAnimationFrame(()=>{
  const headerH=getVisibleMenuHeaderHeight();
  const absoluteTop=bar.getBoundingClientRect().top+window.scrollY;
  window.scrollTo({top:Math.max(0,absoluteTop-headerH),behavior:'smooth'})
 })
}
function selectCategory(id,update){
 if(!data.categories.some(c=>c.id===id))return;
 if(id===activeCategory)return;
 activeCategory=id;
 renderCategories();
 renderMenu();
 if(update){
  const q=new URLSearchParams(location.search);if(moduleRoot!==document)q.set('section','drinks');q.set('categoria',id);q.delete('bevanda');history.replaceState(null,'',`?${q.toString()}`);
  scrollProductsToFixedStart()
 }
}
function syncLiquidCategoryIndicator(){const active=bar.querySelector('button.active');if(!active)return;bar.style.setProperty('--liquid-x',`${active.offsetLeft}px`);bar.style.setProperty('--liquid-w',`${active.offsetWidth}px`)}
function renderCategories(){bar.innerHTML=data.categories.sort((a,b)=>a.order-b.order).map(c=>`<button data-category="${c.id}" class="${c.id===activeCategory?'active':''}">${t(c.name)}</button>`).join('');bar.querySelectorAll('button').forEach(b=>b.onclick=()=>selectCategory(b.dataset.category,true));requestAnimationFrame(syncLiquidCategoryIndicator)}
function renderMenu(){const cat=data.categories.find(c=>c.id===activeCategory)||data.categories[0],ps=data.products.filter(p=>p.active!==false&&p.category===activeCategory).sort((a,b)=>(a.order||0)-(b.order||0));list.innerHTML=`<div class="menu-section-heading"><span>0${cat.order}</span><h2>${t(cat.name)}</h2></div><div class="menu-products">${ps.map(p=>{const thumb=(p.images?.[0]||p.image||'');return `<button class="menu-product" data-item="${p.id}"><span class="gm-product-thumb gm-product-thumb-drinks">${DRINK_FALLBACK}${thumb?`<img class="menu-product-thumb" src="${thumb}" alt="" loading="lazy">`:''}</span><div class="menu-product-copy"><h3>${t(p.name)}</h3><p>${t(p.shortDescription)}</p></div><strong>${money(p.price)}</strong><span class="menu-product-arrow">›</span></button>`}).join('')}</div>`;list.querySelectorAll('.gm-product-thumb img').forEach(img=>img.onerror=()=>img.remove());list.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>openItem(b.dataset.item))}
function openItem(id){
 const p=data.products.find(x=>x.id===id&&(adminPreview||x.active!==false));if(!p){console.error('[ProductCard] Beverage product not found',{id,context:adminPreview?'admin':'menu'});return;}current=id;
 const img=p.images?.[0]||p.image||'',cat=data.categories.find(c=>c.id===p.category);
 const gallery=$('#drinkSheetGallery'),image=$('#drinkSheetImage');
 if(!gallery.querySelector('.gm-image-fallback-icon'))gallery.insertAdjacentHTML('afterbegin',DRINK_FALLBACK);gallery.classList.toggle('is-empty',!img);image.hidden=!img;if(img){image.src=img;image.alt=t(p.name);image.onerror=()=>{image.hidden=true;image.removeAttribute('src');gallery.classList.add('is-empty')}}else{image.removeAttribute('src');image.alt=''}
 $('#drinkSheetCategory').textContent=t(cat?.name);$('#drinkSheetName').textContent=t(p.name);$('#drinkSheetDescription').textContent=t(p.description)||t(p.shortDescription)||'';
 const labels=lang==='en'?{format:'FORMAT',alcohol:'ALCOHOL'}:lang==='es'?{format:'FORMATO',alcohol:'GRADUACIÓN'}:{format:'FORMATO',alcohol:'GRADAZIONE'};
 const facts=[];if(p.format)facts.push([labels.format,p.format]);if(p.alcohol!==undefined&&p.alcohol!==null&&p.alcohol!=='')facts.push([labels.alcohol,`${p.alcohol}% vol`]);
 $('#drinkSheetFacts').innerHTML=facts.map(x=>`<div class="drink-fact"><span>${x[0]}</span><span>${x[1]}</span></div>`).join('');$('#drinkSheetFacts').hidden=!facts.length;$('#drinkSheetPrice').textContent=money(p.price);
 sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');backdrop.hidden=false;requestAnimationFrame(()=>backdrop.classList.add('show'));document.body.classList.add('sheet-open')
}
function close(){if(adminPreview&&window.parent!==window){window.parent.postMessage('giacomo-menu:close-product-preview','*');return}sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');backdrop.classList.remove('show');document.body.classList.remove('sheet-open');current=null;setTimeout(()=>backdrop.hidden=true,250)}
async function init(){UI=await fetch(`languages/${lang}.json`).then(r=>r.json());const publicData=await fetch('data/drinks.json').then(r=>r.json()),snapshot=adminSnapshot();data=snapshot?.drinks||publicData;const q=pageParams,c=q.get('categoria'),item=q.get('bevanda');if(c&&data.categories.some(x=>x.id===c))activeCategory=c;if(item){const p=data.products.find(x=>x.id===item);if(p)activeCategory=p.category}applyUI();if(item)setTimeout(()=>openItem(item),120)}
$('#dishClose').onclick=close;backdrop.onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current)close()});if(moduleRoot===document){if($('#menuLangToggle')&&$('#menuLangPopover'))$('#menuLangToggle').onclick=()=>$('#menuLangPopover').classList.toggle('open');document.querySelectorAll('[data-menu-lang],[data-mobile-lang]').forEach(b=>b.onclick=async()=>{lang=b.dataset.mobileLang||b.dataset.menuLang;localStorage.setItem('scirocco_lang',lang);UI=await fetch(`languages/${lang}.json`).then(r=>r.json());$('#menuLangPopover')?.classList.remove('open');applyUI()})}window.addEventListener('resize',()=>requestAnimationFrame(syncLiquidCategoryIndicator));
window.addEventListener('giacomo-menu:language',async e=>{lang=e.detail;UI=await fetch(`languages/${lang}.json`).then(r=>r.json());applyUI()});init().catch(console.error);

})();
