(function(){
  const map={background:'--gm-bg',surface:'--gm-surface',surfaceAlt:'--gm-surface-2',surfaceRaised:'--gm-surface-3',text:'--gm-text',textStrong:'--gm-text-strong',muted:'--gm-muted',accent:'--gm-accent',accentStrong:'--gm-accent-strong',dark:'--gm-dark',darkSoft:'--gm-dark-soft',darkRaised:'--gm-dark-raised',onDark:'--gm-on-dark',success:'--gm-success',danger:'--gm-danger',displayFont:'--gm-font-display',bodyFont:'--gm-font-body',radius:'--gm-radius',sheetRadius:'--gm-radius-sheet'};
  const langNames={it:'IT',en:'EN',es:'ES',fr:'FR',de:'DE',pt:'PT'};
  function apply(c){
    window.GIACOMO_MENU_CONFIG=c;
    const s=document.documentElement.style;
    Object.entries(c.theme||{}).forEach(([k,v])=>map[k]&&s.setProperty(map[k],v));
    const brand=(c.brand||{}), integration=(c.integration||{}), locale=(c.locale||{});
    document.querySelectorAll('.menu-mobile-brand,.brand span,#menuEyebrow,.menu-intro .eyebrow').forEach(el=>{if(brand.name)el.textContent=brand.name});
    document.querySelectorAll('.brand small').forEach(el=>{if(brand.tagline)el.textContent=brand.tagline});
    if(brand.name){
      document.title=document.title.replace(/Scirocco/gi,brand.name);
      const meta=document.querySelector('meta[name="description"]'); if(meta) meta.content=meta.content.replace(/Scirocco/gi,brand.name);
    }
    const linkMap={
      '.menu-mobile-brand,.brand':integration.homeUrl,
      '.menu-mobile-cellar,.nav a[href*="cantina"]':integration.cellarUrl,
      '.nav a[href*="cucina"]':integration.kitchenUrl,
      '.nav a[href*="contatti"]':integration.contactsUrl,
      '.btn.btn-outline':integration.bookingUrl
    };
    Object.entries(linkMap).forEach(([sel,url])=>{if(url)document.querySelectorAll(sel).forEach(a=>a.setAttribute('href',url))});
    const active=Array.isArray(locale.active)&&locale.active.length?locale.active:['it'];
    document.querySelectorAll('[data-menu-lang]').forEach(btn=>{const l=btn.dataset.menuLang;btn.hidden=!active.includes(l);btn.textContent=langNames[l]||l.toUpperCase()});
    document.documentElement.dataset.gmRestaurant=brand.name||'restaurant';
    document.dispatchEvent(new CustomEvent('giacomo-menu:config',{detail:c}));
  }
  fetch('data/restaurant.json').then(r=>r.ok?r.json():Promise.reject(new Error('restaurant config'))).then(apply).catch(()=>{});
})();
