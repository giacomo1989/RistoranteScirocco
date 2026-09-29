const SUPPORTED_LANGS=["it","en","es"];
const getByPath=(obj,path)=>path.split(".").reduce((acc,key)=>acc?.[key],obj);
async function setLanguage(lang){
  if(!SUPPORTED_LANGS.includes(lang)) lang="it";
  try{
    const response=await fetch(`locales/${lang}.json`);
    if(!response.ok) throw new Error("Translation file not found");
    const t=await response.json();
    document.documentElement.lang=lang;
    const pageData=document.body.classList.contains("cuisine-page")?t.cucinaPage:null;
    document.title=pageData?.metaTitle||t.meta.title;
    document.getElementById("metaDescription")?.setAttribute("content",pageData?.metaDescription||t.meta.description);
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const value=getByPath(t,el.dataset.i18n);
      if(value==null) return;
      if(el.hasAttribute("data-i18n-html")) el.innerHTML=value; else el.textContent=value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el=>{
      const value=getByPath(t,el.dataset.i18nAria); if(value) el.setAttribute("aria-label",value);
    });
    document.getElementById("menuToggle")?.setAttribute("aria-label",t.nav.open);
    document.querySelectorAll("[data-lang]").forEach(btn=>btn.classList.toggle("active",btn.dataset.lang===lang));
    localStorage.setItem("scirocco_lang",lang);
  }catch(err){console.error(err);}
}
document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>setLanguage(btn.dataset.lang)));
setLanguage(localStorage.getItem("scirocco_lang")||"it");