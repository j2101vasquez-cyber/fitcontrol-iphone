(()=>{
'use strict';
const foods={
'Cereales · desayuno y once':[['Avena tradicional o instantánea','40 g'],['Cereal de chocolate','1 taza'],['Galletas de agua, soda o salvado','6 unidades'],['Muesli 5 frutas','½ taza'],['Pan hallulla','½ unidad'],['Marraqueta sin miga','1 unidad'],['Pan pita integral o blanco','1 unidad'],['Pan de molde integral o blanco','2 rebanadas']],
'Cereales · almuerzo y cena':[['Arroz blanco o integral cocido','130 g'],['Fideos cocidos','110 g'],['Quínoa o cuscús cocido','120 g'],['Choclo, habas o arvejas','130 g'],['Papa mediana','150 g'],['Fajitas tamaño M','2 unidades']],
'Proteínas':[['Claras de huevo','3 unidades'],['Huevos','2 unidades'],['Jamón de pollo o pavo','1 lámina'],['Pechuga de pollo','50 g'],['Pavo','55 g'],['Almejas, choritos, machas o locos','6 unidades'],['Atún','½ lata'],['Pescado o salmón','80 g'],['Vacuno magro (posta, filete, lomo liso, pollo ganso)','50 g'],['Carne molida 3 % grasa','50 g'],['Carne de soya','30 g']],
'Lácteos':[['Leche cultivada light','1 taza'],['Leche descremada (sin lactosa opcional)','1 taza'],['Leche de soya o almendras','¾ taza'],['Quesillo','1 trozo de tres dedos de grosor'],['Ricota o cottage','2 cucharadas'],['Yogur natural o light','125 g'],['Lácteo alto en proteínas','1 unidad']],
'Frutas':[['Frambuesas, frutillas, melón o sandía','1 taza'],['Durazno, manzana, membrillo, naranja, pera, pepino dulce o pomelo','1 unidad mediana'],['Plátano o chirimoya','½ unidad'],['Kiwi, mandarina, tunas, higos, huesillos, mango pequeño o ciruelas','2 unidades'],['Piña natural','¾ taza'],['Uvas','10 unidades']],
'Alimentos ricos en grasa · día por medio':[['Almendras','26 unidades'],['Pistachos o avellanas','40 unidades'],['Maní','30 unidades'],['Nueces','5 unidades'],['Mantequilla de maní','1 cucharada rasa'],['Palta','½ unidad'],['Aceitunas','10 unidades'],['Semillas','1 cucharada rasa']],
'Verduras · libre consumo':[['Achicoria, apio, cochayuyo, endivia, lechuga, penca, pepino, pimentón, rabanitos, repollo o ulte','Libre']],
'Verduras · consumo general':[['Acelga, betarraga, espinaca, zanahoria o zapallo','½ taza'],['Berenjena, brócoli, champiñones, coliflor, porotos verdes o zapallo italiano','1 taza'],['Alcachofa pequeña o tomate','1 unidad'],['Espárragos','5 unidades']],
'Legumbres':[['Garbanzos, lentejas o porotos con 30 % arroz o fideos','1 taza']]
};
const examples={
'Desayuno':['Pan de molde o marraqueta + 3 huevos','6 galletas de salvado/soda/agua + jamón de pavo','Avena + lácteo + manzana + huevos (incorpora la colación)'],
'Colación mañana':['Yogur alto en proteínas + manzana','Leche + plátano pequeño'],
'Almuerzo':['Pollo (150 g) + arroz cocido (130 g) + verduras','Reineta (240 g) + papa (150 g) + ensalada','Guiso de lentejas o porotos (1½ tazas) + 2 huevos'],
'Once':['Yogur alto en proteínas + frutillas + mantequilla de maní (solo día correspondiente)','Leche + arándanos + almendras (solo día correspondiente)'],
'Cena':['Atún al agua + cuscús + verduras','Pavo salteado + verduras + fajitas','Marraqueta sin miga + huevos + jamón de pavo + ensalada','Ciabatta sin miga + churrasco magro + verduras','Fideos con verduras + salmón'],
'Colación nocturna':['Yogur alto en proteínas solo si hay hambre']
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const nextDate=s=>{const [y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d+1);return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`};
function values(){try{return db.portions||{}}catch{return {}}}
function paintAlert(){
 const target=document.getElementById('portionDate'); const out=document.getElementById('fatCycle');if(!target||!out)return;
 const d=target.value||new Date().toLocaleDateString('en-CA'); const all=values();
 const prev=Object.keys(all).filter(x=>x<d && Number(all[x]?.grasas||0)>0).sort().pop();
 const consumed=Number(all[d]?.grasas||0)>0;
 const yesterday=(()=>{const [y,m,dd]=d.split('-').map(Number);const t=new Date(y,m-1,dd-1);return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`})();
 let msg=consumed?`✓ Porción de alimento rico en grasa registrada hoy. Mañana (${nextDate(d)}) corresponde descanso.`:
 Number(all[yesterday]?.grasas||0)>0?'⚠ Ayer registraste una porción de alimento rico en grasa. Hoy corresponde descanso.':
 'Hoy no hay una porción de grasa registrada. Revisa la pauta y el historial antes de consumirla.';
 out.textContent=msg;
 out.style.padding='12px';out.style.border='1px solid #416176';out.style.borderRadius='12px';out.style.margin='12px 0';
}
function build(){
 const tracker=document.getElementById('portionTracker');if(!tracker)return;
 const parent=tracker.closest('.card');
 if(!document.getElementById('fatCycle')){const d=document.createElement('div');d.id='fatCycle';tracker.after(d)}
 if(!document.getElementById('foodCatalog')){
 const section=document.createElement('div');section.className='card';section.id='foodCatalog';
 section.innerHTML=`<h3>📚 Todas las opciones de tu pauta</h3><p class="muted">Equivalencias por porción según la pauta original. No reemplazan una nueva pauta que apruebes.</p><label class="field">Buscar alimento<input id="foodCatalogSearch" placeholder="Ej. arroz, huevo, palta"></label><div id="foodCatalogResults"></div><h3>🍽️ Ejemplos de comidas del nutricionista</h3><div id="foodExamples"></div><p class="note">La porción de alimentos ricos en grasa es día por medio según el menú. No restringe la grasa natural de otros alimentos. Los ejemplos son combinaciones, no porciones adicionales.</p>`;
 parent.after(section);
 document.getElementById('foodCatalogSearch').addEventListener('input',draw);
 }
 draw();paintAlert();
}
function draw(){
 const q=(document.getElementById('foodCatalogSearch')?.value||'').toLocaleLowerCase('es');
 document.getElementById('foodCatalogResults').innerHTML=Object.entries(foods).map(([group,items])=>{
 const matched=items.filter(([n])=>(group+' '+n).toLocaleLowerCase('es').includes(q));
 if(!matched.length)return '';
 return `<details ${q?'open':''}><summary><b>${escape(group)}</b> (${matched.length})</summary><div style="margin:10px 0">${matched.map(([n,amount])=>`<div class="item row"><span>${escape(n)}</span><b>${escape(amount)}</b></div>`).join('')}</div></details>`;
 }).join('');
 document.getElementById('foodExamples').innerHTML=Object.entries(examples).map(([group,items])=>`<details><summary><b>${escape(group)}</b> (${items.length})</summary>${items.map(x=>`<p class="muted">• ${escape(x)}</p>`).join('')}</details>`).join('');
}
const original=window.renderPortions;
if(typeof original==='function')window.renderPortions=function(){original();paintAlert()};
const ready=()=>{build();document.getElementById('portionDate')?.addEventListener('change',paintAlert)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();