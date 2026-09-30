(() => {
const UI={it:{title:'Il Menu',intro:'Una cucina mediterranea contemporanea, tra mare e terra.',wineTitle:'Scopri la nostra selezione di vini',explore:'ESPLORA →',ingredients:'INGREDIENTI',allergens:'ALLERGENI',pairings:'ABBINALO CON',before:'PRIMA POTREBBE PIACERTI',after:'PER CONTINUARE',noAllergens:'Nessun allergene dichiarato',close:'Chiudi',foodMenu:'MENU CIBO',wineList:'CARTA VINI'},en:{title:'The Menu',intro:'Contemporary Mediterranean cuisine, between sea and land.',wineTitle:'Discover our wine selection',explore:'EXPLORE →',ingredients:'INGREDIENTS',allergens:'ALLERGENS',pairings:'PAIR IT WITH',before:'YOU MAY LIKE BEFORE',after:'TO CONTINUE',noAllergens:'No declared allergens',close:'Close',foodMenu:'FOOD MENU',wineList:'WINE LIST'},es:{title:'El Menú',intro:'Cocina mediterránea contemporánea, entre mar y tierra.',wineTitle:'Descubre nuestra selección de vinos',explore:'EXPLORAR →',ingredients:'INGREDIENTES',allergens:'ALÉRGENOS',pairings:'ACOMPÁÑALO CON',before:'ANTES TE PUEDE GUSTAR',after:'PARA CONTINUAR',noAllergens:'Sin alérgenos declarados',close:'Cerrar',foodMenu:'MENÚ COMIDA',wineList:'CARTA DE VINOS'}};
let data,lang=localStorage.getItem('scirocco_lang')||'it',activeCategory='crudi',currentDish=null;
const $=s=>document.querySelector(s), list=$('#menuList'),bar=$('#menuCategoryBar'),sheet=$('#dishSheet'),backdrop=$('#dishBackdrop');
const t=o=>o?.[lang]||o?.it||''; const money=n=>new Intl.NumberFormat(lang==='en'?'en-GB':lang==='es'?'es-ES':'it-IT',{style:'currency',currency:'EUR',minimumFractionDigits:0}).format(n);
function applyUI(){document.documentElement.lang=lang;$('#menuTitle').textContent=UI[lang].title;$('#menuIntro').textContent=UI[lang].intro;$('#menuFoodLabel').textContent=UI[lang].foodMenu;$('#menuWineLabel').textContent=UI[lang].wineList;const wineGatewayTitle=$('#wineGatewayTitle'),wineGatewayLink=$('#wineGatewayLink');if(wineGatewayTitle)wineGatewayTitle.textContent=UI[lang].wineTitle;if(wineGatewayLink)wineGatewayLink.textContent=UI[lang].explore;$('#menuLangToggle').textContent=lang.toUpperCase();document.querySelectorAll('[data-menu-lang]').forEach(b=>b.classList.toggle('active',b.dataset.menuLang===lang));renderCategories();renderMenu();if(currentDish) openDish(currentDish,false)}
function renderCategories(){bar.innerHTML=data.categories.sort((a,b)=>a.order-b.order).map(c=>`<button data-category="${c.id}" class="${c.id===activeCategory?'active':''}">${t(c.name)}</button>`).join('');bar.querySelectorAll('button').forEach(b=>b.onclick=()=>selectCategory(b.dataset.category,true))}
function renderMenu(){const cat=data.categories.find(c=>c.id===activeCategory);const ps=data.products.filter(p=>p.active&&p.category===activeCategory).sort((a,b)=>a.order-b.order);list.innerHTML=`<div class="menu-section-heading"><span>0${cat.order}</span><h2>${t(cat.name)}</h2></div><div class="menu-products">${ps.map(p=>{const thumb=(p.images&&p.images.length?p.images[0]:p.image)||'';return `<button class="menu-product" data-dish="${p.id}">${thumb?`<img class="menu-product-thumb" src="${thumb}" alt="" loading="lazy">`:''}<div class="menu-product-copy"><h3>${t(p.name)}</h3><p>${t(p.shortDescription)}</p></div><strong>${money(p.price)}</strong><span class="menu-product-arrow">›</span></button>`}).join('')}</div>`;list.querySelectorAll('[data-dish]').forEach(b=>b.onclick=()=>openDish(b.dataset.dish,true))}
function getVisibleMenuHeaderHeight(){
 const mobile=document.querySelector('.menu-mobile-header');
 const desktop=document.querySelector('#header.menu-desktop-header');
 const visible=el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>0};
 const header=visible(mobile)?mobile:(visible(desktop)?desktop:null);
 return header?Math.ceil(header.getBoundingClientRect().height):0
}
function scrollProductsToFixedStart(){
 requestAnimationFrame(()=>{
  const products=document.querySelector('.menu-products');
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
  history.replaceState(null,'',`?categoria=${id}`);
  scrollProductsToFixedStart()
 }
}
function wineCard(id){const w=data.wines.find(x=>x.id===id);return w?`<a class="dish-related-card wine" href="vini.html?vino=${encodeURIComponent(w.id)}"><small>VINO</small><strong>${w.name}</strong><span>${w.meta}</span></a>`:''}
function foodCard(id){const p=data.products.find(x=>x.id===id&&x.active);return p?`<button class="dish-related-card" data-related-dish="${p.id}"><small>${t(data.categories.find(c=>c.id===p.category).name)}</small><strong>${t(p.name)}</strong><span>${money(p.price)}</span></button>`:''}
function block(title,content,klass=''){return content?`<section class="dish-detail-block ${klass}"><h4>${title}</h4>${content}</section>`:''}
function dishImages(p){const imgs=Array.isArray(p.images)?p.images.filter(Boolean):[];return imgs.length?imgs:(p.image?[p.image]:[])}
function galleryMarkup(p){const imgs=dishImages(p);if(!imgs.length)return '';const multi=imgs.length>1;return `<div class="dish-sheet-gallery" data-gallery><div class="dish-sheet-image" data-gallery-image style="background-image:url('${imgs[0]}')"></div>${multi?`<button class="dish-gallery-arrow prev" type="button" data-gallery-prev aria-label="Foto precedente">‹</button><button class="dish-gallery-arrow next" type="button" data-gallery-next aria-label="Foto successiva">›</button><div class="dish-gallery-dots" aria-hidden="true">${imgs.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('')}</div>`:''}</div>`}
function initDishGallery(p){const gallery=sheet.querySelector('[data-gallery]');if(!gallery)return;const imgs=dishImages(p);if(imgs.length<2)return;const image=gallery.querySelector('[data-gallery-image]'),dots=[...gallery.querySelectorAll('.dish-gallery-dots span')];let index=0,startX=null;const show=i=>{index=(i+imgs.length)%imgs.length;image.style.backgroundImage=`url('${imgs[index]}')`;dots.forEach((d,n)=>d.classList.toggle('active',n===index))};gallery.querySelector('[data-gallery-prev]').onclick=e=>{e.stopPropagation();show(index-1)};gallery.querySelector('[data-gallery-next]').onclick=e=>{e.stopPropagation();show(index+1)};gallery.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});gallery.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));startX=null},{passive:true})}
function openDish(id,update=true){const p=data.products.find(x=>x.id===id&&x.active);if(!p)return;currentDish=id;const u=UI[lang];const allerg=p.allergens.length?p.allergens.map(x=>`<span>${x.replaceAll('-',' ')}</span>`).join(''):`<span>${u.noAllergens}</span>`;$('#dishSheetContent').innerHTML=`${galleryMarkup(p)}<div class="dish-sheet-body"><div class="dish-sheet-title"><div><small>${t(data.categories.find(c=>c.id===p.category).name)}</small><h2>${t(p.name)}</h2></div><strong>${money(p.price)}</strong></div><p class="dish-sheet-description">${t(p.description)}</p>${block(u.ingredients,`<p>${t(p.ingredients)}</p>`)}${block(u.allergens,`<div class="allergen-list">${allerg}</div>`)}${block(u.pairings,p.winePairings.map(wineCard).join(''),'related')}${block(u.before,p.recommendedBefore.map(foodCard).join(''),'related')}${block(u.after,p.recommendedAfter.map(foodCard).join(''),'related')}</div>`;initDishGallery(p);sheet.querySelectorAll('[data-related-dish]').forEach(b=>b.onclick=()=>openDish(b.dataset.relatedDish,true));sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');backdrop.hidden=false;requestAnimationFrame(()=>backdrop.classList.add('show'));document.body.classList.add('sheet-open');if(update)history.replaceState(null,'',`?piatto=${id}`)
 requestAnimationFrame(()=>{
  const scrollContainer=document.querySelector('.dish-sheet');
  if(scrollContainer)scrollContainer.scrollTop=0;
  const panel=document.querySelector('.dish-sheet-panel');
  if(panel)panel.scrollTop=0;
  const content=document.querySelector('.dish-sheet-content');
  if(content)content.scrollTop=0;
  const gallery=document.querySelector('.dish-sheet-gallery');
  if(gallery)gallery.scrollIntoView({block:'start',behavior:'auto'});
 });
}
function closeDish(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');backdrop.classList.remove('show');document.body.classList.remove('sheet-open');currentDish=null;setTimeout(()=>backdrop.hidden=true,250);history.replaceState(null,'',`?categoria=${activeCategory}`)}
async function init(){data=await fetch('data/menu.json').then(r=>{if(!r.ok)throw Error('menu.json');return r.json()});const q=new URLSearchParams(location.search),dish=q.get('piatto'),requested=q.get('categoria');const aliases={mare:'secondi',vegetali:'contorni'};if(requested)activeCategory=aliases[requested]||requested;if(dish){const p=data.products.find(x=>x.id===dish);if(p)activeCategory=p.category}applyUI();if(dish)setTimeout(()=>openDish(dish,false),120)}
$('#dishClose').onclick=closeDish;backdrop.onclick=closeDish;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentDish)closeDish()});$('#menuLangToggle').onclick=()=>$('#menuLangPopover').classList.toggle('open');document.querySelectorAll('[data-menu-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.menuLang;localStorage.setItem('scirocco_lang',lang);$('#menuLangPopover').classList.remove('open');applyUI()});
init().catch(console.error);

(function(){
  const bar=document.getElementById('menuCategoryBar');
  const mobileHeader=document.querySelector('.menu-mobile-header');
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

    bar.style.setProperty('top', headerHeight+'px', 'important');
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
  }
})();
})();