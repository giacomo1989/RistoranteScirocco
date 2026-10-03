const OPENAI_URL = 'https://api.openai.com/v1/responses';
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna';
const LANGUAGES = {it:'Italian',en:'English',es:'Spanish',fr:'French',de:'German',pt:'Portuguese'};

function send(res,status,data){res.status(status).json(data)}
function text(v,max=6000){return typeof v==='string'?v.trim().slice(0,max):''}
function lang(code){return LANGUAGES[code]||code}
function extractOutput(json){
  if(typeof json.output_text==='string' && json.output_text.trim()) return json.output_text;
  for(const item of json.output||[]) for(const part of item.content||[]) if(part.type==='output_text' && part.text) return part.text;
  return '';
}
async function askOpenAI(instructions,input){
  if(!process.env.OPENAI_API_KEY) throw Object.assign(new Error('OPENAI_API_KEY missing'),{status:503,code:'api_key_missing'});
  const r=await fetch(OPENAI_URL,{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,instructions,input,temperature:0.4,text:{format:{type:'json_object'}}})});
  const data=await r.json();
  if(!r.ok) throw Object.assign(new Error(data?.error?.message||'OpenAI request failed'),{status:r.status||502,code:'openai_error'});
  const raw=extractOutput(data);
  try{return JSON.parse(raw)}catch{throw Object.assign(new Error('Invalid structured response'),{status:502,code:'invalid_ai_response'})}
}
function generationInstructions(language){return `You write concise, elegant restaurant-menu copy in ${lang(language)}. Use ONLY facts supplied in the product context. Never invent ingredients, provenance, awards, vintages, production methods, tasting facts or claims. Do not repeat the product name mechanically. shortDescription must be one compact menu line; description must be polished but concise (normally 1-3 sentences). Return only JSON with exactly: {"shortDescription":"...","description":"..."}.`}
function translationInstructions(source,targets,preserve){return `Translate restaurant menu content from ${lang(source)} into: ${targets.map(lang).join(', ')}. Preserve meaning, tone, punctuation and factual content; do not add facts. ${preserve?'Wine producer names, cuvées, denominations, appellations, grape names and other proper names must remain unchanged unless a conventional localized form is clearly required.':''} Return only JSON shaped exactly as {"translations":{"xx":{"name":"...","shortDescription":"...","description":"..."}}}, with one key for every requested target language code.`}

export default async function handler(req,res){
  if(req.method!=='POST') return send(res,405,{error:'method_not_allowed'});
  try{
    const body=req.body||{};
    if(body.action==='generate'){
      const language=text(body.language,10)||'it';
      const context=body.context && typeof body.context==='object'?body.context:{};
      if(!text(context.name,300)) return send(res,400,{error:'name_required'});
      const result=await askOpenAI(generationInstructions(language),`PRODUCT CONTEXT (JSON):\n${JSON.stringify(context)}`);
      return send(res,200,{shortDescription:text(result.shortDescription,1000),description:text(result.description,3000)});
    }
    if(body.action==='translate'){
      const source=text(body.sourceLanguage,10)||'it';
      const targets=Array.isArray(body.targetLanguages)?[...new Set(body.targetLanguages.map(x=>text(x,10)).filter(x=>x&&x!==source))].slice(0,8):[];
      if(!targets.length) return send(res,400,{error:'target_languages_required'});
      const content={name:text(body.name,500),shortDescription:text(body.shortDescription,1500),description:text(body.description,5000)};
      if(!content.name&&!content.shortDescription&&!content.description) return send(res,400,{error:'content_required'});
      const result=await askOpenAI(translationInstructions(source,targets,!!body.preserveProperNames),`SOURCE CONTENT (JSON):\n${JSON.stringify(content)}`);
      const translations={};
      for(const code of targets){const v=result?.translations?.[code]||{};translations[code]={name:text(v.name,500),shortDescription:text(v.shortDescription,1500),description:text(v.description,5000)}}
      return send(res,200,{translations});
    }
    return send(res,400,{error:'invalid_action'});
  }catch(err){return send(res,err.status||500,{error:err.code||'server_error',message:process.env.NODE_ENV==='development'?err.message:undefined})}
}
