// FitControl 1.7.1 - Sustituciones equivalentes. Sin alterar los datos anteriores.
(()=>{
'use strict';
const C={
 cerealDesayuno:[['Avena tradicional o instantánea',40,'g'],['Cereal de chocolate',1,'taza'],['Galletas de agua/soda/salvado',6,'un'],['Muesli 5 frutas',0.5,'taza'],['Hallulla',0.5,'un'],['Marraqueta sin miga',1,'un'],['Pan pita',1,'un'],['Pan de molde',2,'rebanadas']],
 cerealComida:[['Arroz cocido',130,'g'],['Fideos cocidos',110,'g'],['Quínoa cocida',120,'g'],['Cuscús cocido',120,'g'],['Papa cocida',150,'g'],['Choclo',130,'g'],['Habas',130,'g'],['Arvejas',130,'g'],['Tortillas medianas',2,'un']],
 proteina:[['Pechuga de pollo',50,'g'],['Pechuga de pavo',55,'g'],['Pescado',80,'g'],['Vacuno magro',50,'g'],['Carne molida 3% grasa',50,'g'],['Carne de soya seca',30,'g'],['Huevos',2,'un'],['Claras de huevo',3,'un'],['Jamón de pollo o pavo',1,'lámina'],['Atún al agua',0.5,'lata']],
 lacteo:[['Yogur natural o light',125,'g'],['Lácteo alto en proteínas',1,'un'],['Leche descremada',1,'taza'],['Leche de soya o almendras',0.75,'taza'],['Ricota o cottage',2,'cucharadas']],
 fruta:[['Manzana',1,'un'],['Pera',1,'un'],['Naranja',1,'un'],['Frutillas',1,'taza'],['Frambuesas',1,'taza'],['Plátano',0.5,'un'],['Kiwi',2,'un'],['Mandarina',2,'un'],['Piña',0.75,'taza'],['Uvas',10,'un']],
 grasa:[['Almendras',26,'un'],['Pistachos',40,'un'],['Maní',30,'un'],['Nueces',5,'un'],['Mantequilla de maní',1,'cucharada rasa'],['Palta',0.5,'un'],['Aceitunas',10,'un'],['Semillas',1,'cucharada rasa']]
};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const aliases=[
 ['cerealDesayuno',/avena|cereal de chocolate|galletas de agua|galletas soda|muesli|hallulla|marraqueta|pan pita|pan de molde|pan integral|tostadas/],
 ['cerealComida',/arroz|fideo|pasta|quinoa|quinoa|cuscus|papa|choclo|habas|arvejas|tortilla/],
 ['proteina',/pechuga|pollo|pavo|reineta|salmon|pescado|vacuno|posta|carne molida|carne de soya|huevo|clara|jamon|atun/],
 ['lacteo',/yogur|yogurt|leche|quesillo|ricota|cottage/],
 ['fruta',/manzana|pera|naranja|frutilla|frambuesa|platano|kiwi|mandarina|pina|uva|melon|sandia/],
 ['grasa',/almendra|pistacho|mani|nuez|mantequilla de mani|palta|aceituna|semilla/]
];
function category(name){let n=norm(name);for(let [cat,rx] of aliases)if(rx.test(n))return cat;return null}
const KEY='fc171-recipe-substitutions';let changes={};try{changes=JSON.parse(localStorage.getItem(KEY))||{}}catch(_){}
const originalRender=renderRecipes,originalShopping=addRecipeShopping,originalMeal=addRecipeMeal;
function ingredient(r,i){return changes[r.id]?.[i]||r.ingredients[i]}
function modified(r){return r.ingredients.map((v,i)=>ingredient(r,i))}
function renderControls(){for(const r of recipes){const input=document.getElementById('portions-'+r.id);if(!input)continue;const card=input.closest('.recipe');if(!card)continue;let slot=document.createElement('div');slot.className='fc171-controls';slot.style.cssText='margin:12px 0;padding:12px;border:1px solid var(--accent,#37d7a4);border-radius:12px';const heading=document.createElement('b');heading.textContent='🔄 Cambiar ingredientes por equivalentes';slot.appendChild(heading);const tip=document.createElement('p');tip.className='note';tip.textContent='Solo se muestran cambios de un mismo grupo de la pauta. Las cantidades se calculan por porción equivalente; confirma si el ingrediente original representa exactamente esa porción.';slot.appendChild(tip);
 r.ingredients.forEach((orig,i)=>{let cat=category(orig[0]);if(!cat)return;const choices=C[cat];let line=document.createElement('label');line.className='field';line.style.marginTop='8px';line.textContent=orig[0]+' ('+orig[1]+' '+orig[2]+')';let sel=document.createElement('select');sel.setAttribute('aria-label','Sustituir '+orig[0]);let def=document.createElement('option');def.value='';def.textContent='Original: '+orig[0];sel.appendChild(def);choices.forEach((o,j)=>{let op=document.createElement('option');op.value=String(j);op.textContent=o[0]+' · '+o[1]+' '+o[2]+' / porción';sel.appendChild(op)});
 const saved=changes[r.id]?.[i];if(saved){const j=choices.findIndex(o=>o[0]===saved[0]);if(j>=0)sel.value=String(j)}
 sel.onchange=()=>{if(sel.value===''){if(changes[r.id])delete changes[r.id][i]}else{const opt=choices[+sel.value];const originalPortion=choices.find(o=>norm(o[0])===norm(orig[0]));const multiplier=originalPortion&&norm(originalPortion[2])===norm(orig[2])?orig[1]/originalPortion[1]:1;
 if(!originalPortion && !confirm('No se pudo verificar automáticamente la equivalencia exacta del ingrediente original. ¿Aplicar una porción de la alternativa y revisar antes de registrar?')){sel.value='';return}
 changes[r.id]??={};changes[r.id][i]=[opt[0],Math.round(opt[1]*multiplier*100)/100,opt[2]]}
 localStorage.setItem(KEY,JSON.stringify(changes));renderRecipes()};line.appendChild(sel);slot.appendChild(line)});
 if(slot.querySelector('select')){let list=document.createElement('p');list.className='note';list.textContent='Ingredientes seleccionados: '+modified(r).map(x=>x[0]+' '+x[1]+' '+x[2]).join(' · ');slot.appendChild(list);input.parentElement.insertBefore(slot,input.parentElement.firstChild)}
 }}
renderRecipes=function(){originalRender();renderControls()};
function withIngredients(id,fn){const r=recipes.find(x=>x.id===id);if(!r)return;const before=r.ingredients;r.ingredients=modified(r);try{return fn()}finally{r.ingredients=before}}
addRecipeShopping=function(id){return withIngredients(id,()=>originalShopping(id))};
addRecipeMeal=function(id){const r=recipes.find(x=>x.id===id);if(!r)return;const altered=Object.keys(changes[id]||{}).length>0;if(altered){if(!r.groups||!Object.keys(r.groups).length){toast('No se puede descontar esta receta: equivalencias sin validar');return}if(!confirm('Confirma que cada sustitución mantiene la porción original de tu pauta. No se recalculan calorías ni macronutrientes. ¿Continuar?'))return}
 return withIngredients(id,()=>{const prev=r.name;if(altered)r.name+=' (con sustituciones)';try{return originalMeal(id)}finally{r.name=prev}})};
renderRecipes();
})();