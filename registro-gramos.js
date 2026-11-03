(()=>{
'use strict';
const foods=[
 ['atun','Atún al agua (peso escurrido)','proteinas',null,'½ lata escurrida = 1 porción'],
 ['pollo','Pechuga de pollo','proteinas',50,'50 g = 1 porción'],
 ['pavo','Pavo','proteinas',55,'55 g = 1 porción'],
 ['pescado','Pescado / salmón','proteinas',80,'80 g = 1 porción'],
 ['vacuno','Vacuno magro','proteinas',50,'50 g = 1 porción'],
 ['arroz','Arroz cocido','cereales',130,'130 g = 1 porción'],
 ['fideos','Fideos cocidos','cereales',110,'110 g = 1 porción'],
 ['quinoa','Quínoa / cuscús cocido','cereales',120,'120 g = 1 porción'],
 ['papa','Papa cocida','cereales',150,'150 g = 1 porción'],
 ['avena','Avena','cereales',40,'40 g = 1 porción'],
 ['yogur','Yogur natural o light','lacteos',125,'125 g = 1 porción']
];
const $=id=>document.getElementById(id),format=n=>Number(n).toLocaleString('es-CL',{maximumFractionDigits:2});
function init(){if(!$('fc14Food'))return;
 const sel=$('fc14Food');sel.innerHTML=foods.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('');
 let theme=localStorage.getItem('fitcontrol-theme')||'oscuro';document.body.classList.toggle('fc-light',theme==='claro');
 const themePanel=document.createElement('div');themePanel.className='card';themePanel.innerHTML='<h3>🎨 Apariencia FitControl 1.4</h3><label class="field">Tema visual<select id="fc14Theme"><option value="oscuro">Oscuro · azul petróleo</option><option value="claro">Claro · blanco hielo</option></select></label><p class="muted">Tu preferencia queda guardada en este dispositivo.</p>';
 const ajustes=$('ajustes');if(ajustes){ajustes.appendChild(themePanel);$('fc14Theme').value=theme;$('fc14Theme').onchange=()=>{theme=$('fc14Theme').value;localStorage.setItem('fitcontrol-theme',theme);document.body.classList.toggle('fc-light',theme==='claro')}}
 function food(){return foods.find(f=>f[0]===sel.value)}
 function unit(){const f=food();if(f[0]!=='atun')return f[3];const can=Number($('fc14Can').value);return can>0?can/2:NaN}
 function calculate(){const f=food(),target=Number($('fc14Target').value),g=Number($('fc14Amount').value),u=unit();$('fc14CanWrap').style.display=f[0]==='atun'?'block':'none';
 $('fc14Suggested').innerHTML=Number.isFinite(u)&&target>0?`<span class="fc14-note">Cantidad para ${format(target)} porciones · ${f[4]}</span><br><strong>${format(target*u)} g</strong>${f[0]==='atun'?` <span class="fc14-note">(${format(target/2)} latas)</span>`:''}`:'<span class="fc14-note">Indica el peso escurrido de una lata para calcular los gramos.</span>';
 $('fc14Calculated').innerHTML=Number.isFinite(u)&&g>0?`<span class="fc14-note">Si consumiste ${format(g)} g</span><br><strong>${format(g/u)} porciones</strong> <span class="fc14-note">de ${f[2]==='proteinas'?'proteína':f[2]}</span>`:'<span class="fc14-note">Ingresa los gramos consumidos para calcular las porciones reales.</span>';
 $('fc14Warning').style.display='none';if(g>0&&(!Number.isFinite(u)||u<=0)){$('fc14Warning').textContent='Falta indicar el peso escurrido de la lata.';$('fc14Warning').style.display='block'}
 }
 ['fc14Food','fc14Target','fc14Amount','fc14Can'].forEach(id=>$(id).addEventListener('input',calculate));
 $('fc14Save').onclick=()=>{const f=food(),g=Number($('fc14Amount').value),u=unit();if(!(g>0&&g<=10000&&u>0)){alert('Ingresa los gramos consumidos y, para el atún, el peso escurrido de una lata.');return}
 const amount=Math.round(g/u*100)/100;if(!confirm(`¿Sumar ${format(amount)} porciones de ${f[2]} al registro del día seleccionado?`))return;
 const d=$('portionDate').value||day();if(typeof window.fc15Add==='function'){window.fc15Add({date:d,group:f[2],portions:amount,grams:g,food:f[1],mealType:$('mealType').value});}else{db.portions[d]??={};db.portions[d][f[2]]=Math.round(((Number(db.portions[d][f[2]])||0)+amount)*100)/100;save();renderPortions();}if(typeof toast==='function')toast('Porciones registradas');};
 $('fc14Fill').onclick=()=>{const f=food(),g=Number($('fc14Amount').value);if(!(g>0)){alert('Primero indica los gramos consumidos.');return} $('mealName').value=f[1];$('mealGrams').value=g;$('mealDate').value=$('portionDate').value||day();$('mealName').scrollIntoView({behavior:'smooth',block:'center'});if(typeof toast==='function')toast('Completa los nutrientes y guarda la comida');};
 calculate();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
