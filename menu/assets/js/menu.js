(() => {
const moduleRoot=document.querySelector('[data-menu-module="food"]')||document;

let UI=null;
const pageParams=new URLSearchParams(location.search),adminPreview=pageParams.get('adminPreview')==='1',previewToken=pageParams.get('previewToken');if(adminPreview)document.body.classList.add('admin-embedded-preview');
function adminSnapshot(){if(!adminPreview||!previewToken)return null;try{return JSON.parse(sessionStorage.getItem(`giacomo_menu_preview_${previewToken}`)||'null')}catch(e){console.warn('[Admin preview] invalid snapshot',e);return null}}
function openRelated(kind,id){if(adminPreview&&window.parent!==window){window.parent.postMessage({type:'giacomo-menu:open-product',kind,id},'*');return true}return false}
let data,lang=localStorage.getItem('scirocco_lang')||'it',activeCategory='crudi',currentDish=null;
const $=s=>moduleRoot.querySelector(s), list=$('#menuList'),bar=$('#menuCategoryBar'),sheet=$('#dishSheet'),backdrop=$('#dishBackdrop');
const FOOD_FALLBACK=`<svg class="gm-image-fallback-icon gm-image-fallback-fish" viewBox="0 0 180 100" aria-hidden="true"><path d="M20 50 C42 24 84 20 124 48 C139 37 151 31 163 29 C158 41 157 59 163 71 C151 69 139 63 124 52 C84 80 42 76 20 50 Z M52 49 C70 40 91 40 108 49 C91 58 70 58 52 49 Z"/><circle cx="43" cy="43" r="2.3"/></svg>`;
const t=o=>o?.[lang]||o?.it||''; const money=n=>new Intl.NumberFormat(lang==='en'?'en-GB':lang==='es'?'es-ES':'it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:0}).format(n);
function applyUI(){document.documentElement.lang=lang;const mt=$('#menuTitle'),mi=$('#menuIntro'),mf=$('#menuFoodLabel'),mw=$('#menuWineLabel');if(mt)mt.textContent=UI.menu.title;if(mi)mi.textContent=UI.menu.intro;if(mf)mf.textContent=UI.menu.foodMenu;if(mw)mw.textContent=UI.menu.wineList;const dl=$('#menuDrinksLabel');if(dl)dl.textContent=UI.menu.drinksList||'BEVANDE';const wineGatewayTitle=$('#wineGatewayTitle'),wineGatewayLink=$('#wineGatewayLink');if(wineGatewayTitle)wineGatewayTitle.textContent=UI.menu.wineTitle;if(wineGatewayLink)wineGatewayLink.textContent=UI.menu.explore;const mlt=$('#menuLangToggle');if(mlt)mlt.textContent=lang.toUpperCase();document.querySelectorAll('[data-menu-lang],[data-mobile-lang]').forEach(b=>b.classList.toggle('active',(b.dataset.mobileLang||b.dataset.menuLang)===lang));renderCategories();renderMenu();if(currentDish) openDish(currentDish,false)}
function syncLiquidCategoryIndicator(){const active=bar.querySelector('button.active');if(!active)return;bar.style.setProperty('--liquid-x',`${active.offsetLeft}px`);bar.style.setProperty('--liquid-w',`${active.offsetWidth}px`)}
function renderCategories(){bar.innerHTML=data.categories.sort((a,b)=>a.order-b.order).map(c=>`<button data-category="${c.id}" class="${c.id===activeCategory?'active':''}">${t(c.name)}</button>`).join('');bar.querySelectorAll('button').forEach(b=>b.onclick=()=>selectCategory(b.dataset.category,true));requestAnimationFrame(syncLiquidCategoryIndicator)}
function renderMenu(){const cat=data.categories.find(c=>c.id===activeCategory);const ps=data.products.filter(p=>p.active&&p.category===activeCategory).sort((a,b)=>a.order-b.order);list.innerHTML=`<div class="menu-section-heading"><span>0${cat.order}</span><h2>${t(cat.name)}</h2></div><div class="menu-products">${ps.map(p=>{const thumb=(p.images&&p.images.length?p.images[0]:p.image)||'';return `<button class="menu-product" data-dish="${p.id}"><span class="gm-product-thumb gm-product-thumb-food">${FOOD_FALLBACK}${thumb?`<img class="menu-product-thumb" src="${thumb}" alt="" loading="lazy">`:''}</span><div class="menu-product-copy"><h3>${t(p.name)}</h3><p>${t(p.shortDescription)}</p></div><strong>${money(p.price)}</strong><span class="menu-product-arrow">›</span></button>`}).join('')}</div>`;list.querySelectorAll('.gm-product-thumb img').forEach(img=>img.onerror=()=>img.remove());list.querySelectorAll('[data-dish]').forEach(b=>b.onclick=()=>openDish(b.dataset.dish,true))}
function getVisibleMenuHeaderHeight(){
 const mobile=document.querySelector('.menu-mobile-header');
 const desktop=document.querySelector('#header.menu-desktop-header');
 const visible=el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0};
 const header=visible(mobile)?mobile:(visible(desktop)?desktop:null);
 return header?Math.ceil(header.getBoundingClientRect().height):0
}
function scrollProductsToFixedStart(){
 requestAnimationFrame(()=>{
  const products=moduleRoot.querySelector('.menu-products');
  if(!products)return;
  const headerH=getVisibleMenuHeaderHeight();
  const barH=Math.ceil(bar.getBoundingClientRect().height);
  const gap=12;
  const absoluteTop=products.getBoundingClientRect().top+window.scrollY;
  window.scrollTo({top:Math.max(0,absoluteTop-headerH-barH-gap),behavior:'smooth'})
 })
}
function selectCategory(id,update){
 if(!data.categories.some(c=>c.id===id))return;
 activeCategory=id;
 renderCategories();
 renderMenu();
 if(update){
  const q=new URLSearchParams(location.search);if(moduleRoot!==document)q.set('section','food');q.set('categoria',id);q.delete('piatto');history.replaceState(null,'',`?${q.toString()}`);
  scrollProductsToFixedStart()
 }
}
function wineCard(id){const w=data.wines.find(x=>x.id===id);if(!w)return '';return adminPreview?`<button type="button" class="dish-related-card wine" data-related-wine="${w.id}"><small>VINO</small><strong>${w.name}</strong><span>${w.meta}</span></button>`:`<a class="dish-related-card wine" href="menu.html?section=wine&vino=${encodeURIComponent(w.id)}" target="_top"><small>VINO</small><strong>${w.name}</strong><span>${w.meta}</span></a>`}
function foodCard(id){const p=data.products.find(x=>x.id===id&&(adminPreview||x.active));if(!p)return '';const category=data.categories.find(c=>c.id===p.category);return `<button type="button" class="dish-related-card" data-related-dish="${p.id}"><small>${category?t(category.name):''}</small><strong>${t(p.name)}</strong><span>${money(p.price)}</span></button>`}
function block(title,content,klass=''){return content?`<section class="dish-detail-block ${klass}"><h4>${title}</h4>${content}</section>`:''}
function dishImages(p){const imgs=Array.isArray(p.images)?p.images.filter(Boolean):[];return imgs.length?imgs:(p.image?[p.image]:[])}
function galleryMarkup(p){const imgs=dishImages(p);const multi=imgs.length>1;return `<div class="dish-sheet-gallery gm-card-image-fallback" data-gallery>${FOOD_FALLBACK}<div class="dish-sheet-image" data-gallery-image${imgs.length?` style="background-image:url('${imgs[0]}')"`:''}></div>${multi?`<button class="dish-gallery-arrow prev" type="button" data-gallery-prev aria-label="${UI.menu.previousPhoto||'Foto precedente'}">‹</button><button class="dish-gallery-arrow next" type="button" data-gallery-next aria-label="${UI.menu.nextPhoto||'Foto successiva'}">›</button><div class="dish-gallery-dots" aria-hidden="true">${imgs.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div>`:''}</div>`}
function initDishGallery(p){const gallery=sheet.querySelector('[data-gallery]');if(!gallery)return;const imgs=dishImages(p),image=gallery.querySelector('[data-gallery-image]');const apply=i=>{if(!imgs[i]){image.style.backgroundImage='none';return}const probe=new Image();probe.onload=()=>image.style.backgroundImage=`url('${imgs[i]}')`;probe.onerror=()=>image.style.backgroundImage='none';probe.src=imgs[i]};apply(0);if(imgs.length<2)return;const dots=[...gallery.querySelectorAll('.dish-gallery-dots span')];let index=0,startX=null;const show=i=>{index=(i+imgs.length)%imgs.length;apply(index);dots.forEach((d,n)=>d.classList.toggle('active',n===index))};gallery.querySelector('[data-gallery-prev]').onclick=e=>{e.stopPropagation();show(index-1)};gallery.querySelector('[data-gallery-next]').onclick=e=>{e.stopPropagation();show(index+1)};gallery.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});gallery.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));startX=null},{passive:true})}
function openDish(id,update=true){const p=data.products.find(x=>x.id===id&&(adminPreview||x.active));if(!p)return;currentDish=id;const u=UI.menu;const allergens=Array.isArray(p.allergens)?p.allergens:[],winePairings=Array.isArray(p.winePairings)?p.winePairings:[],recommendedBefore=Array.isArray(p.recommendedBefore)?p.recommendedBefore:[],recommendedAfter=Array.isArray(p.recommendedAfter)?p.recommendedAfter:[];const allerg=allergens.length?p.allergens.map(x=>`<span>${x.replaceAll('-',' ')}</span>`).join(''):`<span>${u.noAllergens}</span>`;$('#dishSheetContent').innerHTML=`${galleryMarkup(p)}<div class="dish-sheet-body"><div class="dish-sheet-title"><div><small>${t(data.categories.find(c=>c.id===p.category).name)}</small><h2>${t(p.name)}</h2></div><strong>${money(p.price)}</strong></div><p class="dish-sheet-description">${t(p.description)}</p>${block(u.ingredients,`<p>${t(p.ingredients)}</p>`)}${block(u.allergens,`<div class="allergen-list">${allerg}</div>`)}${block(u.pairings,winePairings.map(wineCard).join('')+`<a class="dish-ai-sommelier" href="menu.html?section=wine&piatto=${encodeURIComponent(p.id)}" target="_top"><span>✦</span><b>${u.askSommelier||'CHIEDI AL SOMMELIER'}</b></a>`,'related')}${block(u.before,recommendedBefore.map(foodCard).join(''),'related')}${block(u.after,recommendedAfter.map(foodCard).join(''),'related')}</div>`;initDishGallery(p);sheet.querySelectorAll('[data-related-dish]').forEach(b=>b.onclick=()=>{if(!openRelated('food',b.dataset.relatedDish))openDish(b.dataset.relatedDish,true)});sheet.querySelectorAll('[data-related-wine]').forEach(b=>b.onclick=()=>openRelated('wine',b.dataset.relatedWine));sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');backdrop.hidden=false;requestAnimationFrame(()=>backdrop.classList.add('show'));document.body.classList.add('sheet-open');if(update){const q=new URLSearchParams(location.search);if(moduleRoot!==document)q.set('section','food');q.set('piatto',id);history.replaceState(null,'',`?${q.toString()}`)}
 requestAnimationFrame(()=>{
  const scrollContainer=moduleRoot.querySelector('.dish-sheet');
  if(scrollContainer)scrollContainer.scrollTop=0;
  const panel=moduleRoot.querySelector('.dish-sheet-panel');
  if(panel)panel.scrollTop=0;
  const content=moduleRoot.querySelector('.dish-sheet-content');
  if(content)content.scrollTop=0;
  const gallery=moduleRoot.querySelector('.dish-sheet-gallery');
  if(gallery)gallery.scrollIntoView({block:'start',behavior:'auto'});
 });
}
function closeDish(){if(adminPreview&&window.parent!==window){window.parent.postMessage('giacomo-menu:close-product-preview','*');return}sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');backdrop.classList.remove('show');document.body.classList.remove('sheet-open');currentDish=null;setTimeout(()=>{backdrop.hidden=true;window.dispatchEvent(new CustomEvent('giacomo-menu:food-closed'))},250);if(!moduleRoot.classList.contains('is-cross-card-host'))history.replaceState(null,'',`?categoria=${activeCategory}`)}
async function init(){UI=await fetch(`languages/${lang}.json`).then(r=>{if(!r.ok)throw Error('language');return r.json()});const publicData=await fetch('data/menu.json').then(r=>{if(!r.ok)throw Error('menu.json');return r.json()});const snapshot=adminSnapshot();data=snapshot?.food||publicData;if(!Array.isArray(data.wines))data.wines=snapshot?.wine?.wines||publicData.wines||[];const q=pageParams,dish=q.get('piatto'),requested=q.get('categoria');const aliases={mare:'secondi',vegetali:'contorni'};if(requested)activeCategory=aliases[requested]||requested;if(dish){const p=data.products.find(x=>x.id===dish);if(p)activeCategory=p.category;else console.error('[ProductCard] Food product not found',{id:dish,context:adminPreview?'admin':'menu'})}applyUI();if(dish)setTimeout(()=>openDish(dish,false),120)}
$('#dishClose').onclick=closeDish;backdrop.onclick=closeDish;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentDish)closeDish()});if(moduleRoot===document){if($('#menuLangToggle')&&$('#menuLangPopover'))$('#menuLangToggle').onclick=()=>$('#menuLangPopover').classList.toggle('open');document.querySelectorAll('[data-menu-lang],[data-mobile-lang]').forEach(b=>b.onclick=async()=>{lang=b.dataset.mobileLang||b.dataset.menuLang;localStorage.setItem('scirocco_lang',lang);UI=await fetch(`languages/${lang}.json`).then(r=>r.json());$('#menuLangPopover')?.classList.remove('open');applyUI()})}window.addEventListener('resize',()=>requestAnimationFrame(syncLiquidCategoryIndicator));
window.addEventListener('giacomo-menu:language',async e=>{lang=e.detail;UI=await fetch(`languages/${lang}.json`).then(r=>r.json());applyUI()});
init().catch(console.error);

(function(){
  const bar=moduleRoot.querySelector('#menuCategoryBar');
  const mobileHeader=document.querySelector('.menu-mobile-header');
  const menuSelector=document.querySelector('.menu-card-selector');
  const desktopHeader=document.querySelector('#header.menu-desktop-header');

  if(!bar)return;

  function isVisible(el){
    if(!el)return false;
    const cs=window.getComputedStyle(el);
    const rect=el.getBoundingClientRect();
    return cs.display!=='none' && cs.visibility!=='hidden' && rect.height>0;
  }

  function syncCategoryTop(){
    let activeHeader=null;

    if(isVisible(mobileHeader)) activeHeader=mobileHeader;
    else if(isVisible(desktopHeader)) activeHeader=desktopHeader;

    const headerHeight=activeHeader
      ? Math.ceil(activeHeader.getBoundingClientRect().height)
      : 0;

    const selectorHeight =
      isVisible(menuSelector)
        ? Math.ceil(menuSelector.getBoundingClientRect().height)
        : 0;

    bar.style.setProperty('top', topOffset+'px', 'important');
  }

  syncCategoryTop();
  window.addEventListener('DOMContentLoaded',syncCategoryTop);
  window.addEventListener('load',syncCategoryTop);
  window.addEventListener('resize',syncCategoryTop);
  window.addEventListener('orientationchange',syncCategoryTop);

  if('ResizeObserver' in window){
    const ro=new ResizeObserver(syncCategoryTop);
    if(mobileHeader)ro.observe(mobileHeader);
    if(desktopHeader)ro.observe(desktopHeader);
    if(menuSelector)ro.observe(menuSelector);
  }
})();
window.addEventListener('giacomo-menu:open-food',e=>{const d=e.detail;openDish(typeof d==='object'?d.id:d,typeof d==='object'?d.update!==false:true)});
window.addEventListener('giacomo-menu:close-food',()=>{if(currentDish)closeDish()});
})();