/* FitControl 1.9.2 Beta — aportes visibles por receta */
(function(){
'use strict';
const labels={cereales:'🌾 Cereal',proteinas:'🥚 Proteína',lacteos:'🥛 Lácteo',frutas:'🍎 Fruta',grasas:'🥑 Grasa'};
const aliases={cereal:'cereales',proteina:'proteinas',lacteo:'lacteos',fruta:'frutas',grasa:'grasas'};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function portions(recipe){
  if(!recipe||!recipe.groups||!Object.keys(recipe.groups).length)return null;
  const out={};
  for(const [key,value] of Object.entries(recipe.groups)){
    const k=aliases[norm(key)]||norm(key), n=Number(value);
    if(!labels[k]||!Number.isFinite(n)||n<0)return null;
    out[k]=(out[k]||0)+n;
  }
  return out;
}
function describe(recipe){
  const g=portions(recipe);
  if(!g)return '<span style="color:#c58b25">⚠ Equivalencias pendientes de validar</span>';
  const entries=Object.entries(g).filter(([,v])=>v>0);
  return entries.length?entries.map(([k,v])=>esc(labels[k])+': '+esc(String(v))).join(' · '):'Sin porciones declaradas';
}
function decorate(){
  const host=document.getElementById('planDays');
  if(!host||typeof db==='undefined'||!db.weekPlanner)return;
  const cards=host.querySelectorAll('.card');
  cards.forEach((card,d)=>{
    const selects=card.querySelectorAll('select');
    selects.forEach((select,i)=>{
      const id=db.weekPlanner.days[d]?.[i];
      const r=typeof recipes!=='undefined'?recipes.find(x=>x.id===id):null;
      const field=select.closest('label');
      if(!field)return;
      const note=document.createElement('div');
      note.className='fc192-portions';
      note.style.cssText='font-size:12px;line-height:1.5;margin-top:5px;opacity:.9';
      note.innerHTML=describe(r);
      field.appendChild(note);
    });
  });
}
const previous=window.drawPlan;
if(typeof previous==='function'){
  window.drawPlan=function(){const result=previous.apply(this,arguments);decorate();return result;};
  decorate();
}
})();
