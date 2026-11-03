(function(){
const KEY='fitcontrol-theme';
const b=document.getElementById('fcThemeButton');
function apply(mode){document.body.classList.toggle('fc-light',mode!=='dark');if(b)b.textContent=mode==='dark'?'☀️ Claro':'🌙 Oscuro';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',mode==='dark'?'#102b3f':'#f4f7fb');}
let mode='dark';try{mode=localStorage.getItem(KEY)==='light'?'light':'dark'}catch(e){}apply(mode);
b?.addEventListener('click',()=>{mode=document.body.classList.contains('fc-light')?'dark':'light';apply(mode);try{localStorage.setItem(KEY,mode)}catch(e){}});
function mark(tab){document.body.dataset.activeTab=tab||'inicio'}
mark(document.querySelector('.nav button.active')?.dataset.page);
document.querySelectorAll('.nav button[data-page]').forEach(x=>x.addEventListener('click',()=>mark(x.dataset.page)));
})();
