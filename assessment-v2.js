(function(){
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const sections=[
    ['1. Pain & Symptom Profile',[['pain-location','Pain location / distribution'],['onset','Onset & duration'],['aggravating','Aggravating factors'],['easing','Easing factors'],['pattern','24-hour pattern / irritability']]],
    ['2. Safety & Screening',[['redflags','Red-flag screening'],['neuro','Neurological screen'],['precautions','Precautions / contraindications']]],
    ['3. Functional Assessment',[['activity','Activity limitations'],['participation','Participation restrictions'],['goals','Patient goals'],['outcome','Outcome measure & baseline']]],
    ['4. Objective Examination',[['rom','Regional ROM / movement quality'],['strength','MMT / strength pattern'],['special','Special tests'],['palpation','Palpation / symptom reproduction'],['gait','Gait / functional movement']]],
    ['5. Clinical Impression',[['impairments','Key impairments'],['priorities','Clinical priorities'],['impression','Working clinical impression'],['reassessment','Assessment plan / reassessment criteria']]]
  ];
  function findPage(){
    const pages=document.querySelectorAll('.page');
    for(const p of pages){if(p.querySelector('.tabs') && p.querySelector('[data-action="assessment-save"]')) return p;}
    return null;
  }
  function key(page){
    const h=page.querySelector('.head h3');
    const name=(h?.textContent||'patient').split(' · ')[0].trim();
    return 'movia.comprehensive.'+(name||'patient');
  }
  function mount(){
    const page=findPage();
    if(!page || page.querySelector('.movia-comprehensive')) return;
    let saved={}; try{saved=JSON.parse(localStorage.getItem(key(page))||'{}')||{};}catch(e){}
    const box=document.createElement('div');
    box.className='movia-comprehensive assessment-enhanced';
    box.innerHTML='<div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured physiotherapy documentation</span></div><span class="assessment-badge">MOVIA V1</span></div>'+sections.map(([title,items])=>'<section class="assessment-section"><div class="section-title">'+title+'</div><div class="assessment-grid">'+items.map(([id,label])=>'<div class="field"><label>'+label+'</label><textarea data-movia-field="'+id+'" rows="2" placeholder="Document clinical findings...">'+esc(saved[id]||'')+'</textarea></div>').join('')+'</div></section>').join('')+'<div class="assessment-footer"><div class="mini">Structured decision support only. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" data-movia-save>Save Comprehensive Assessment</button></div>';
    const actions=page.querySelector('.actions');
    if(actions) actions.before(box); else page.append(box);
    box.querySelector('[data-movia-save]').addEventListener('click',function(){
      const data={};box.querySelectorAll('[data-movia-field]').forEach(x=>data[x.dataset.moviaField]=x.value.trim());
      localStorage.setItem(key(page),JSON.stringify(data));
      this.textContent='Assessment Saved ✓';
      setTimeout(()=>this.textContent='Save Comprehensive Assessment',1800);
    });
  }
  function boot(){mount();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
  setInterval(mount,1000);
})();