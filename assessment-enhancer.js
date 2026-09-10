(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fields=[
    ['Pain & Symptom Profile',[['pain-location','Pain location / distribution',''],['onset','Onset & duration',''],['aggravating','Aggravating factors',''],['easing','Easing factors',''],['24h','24-hour pattern / irritability','']]],
    ['Safety & Screening',[['redflags','Red-flag screening','No red flags identified'],['neuro','Neurological screen','Not assessed'],['precautions','Precautions / contraindications','None documented']]],
    ['Functional Assessment',[['activity','Activity limitations',''],['participation','Participation restrictions',''],['goals','Patient goals',''],['outcome','Outcome measure & baseline','']]],
    ['Objective Examination',[['romdetail','Regional ROM / movement quality',''],['mmt','MMT / strength pattern',''],['special','Special tests',''],['palpation','Palpation / symptom reproduction',''],['gait','Gait / functional movement','']]],
    ['Clinical Impression',[['impairments','Key impairments',''],['priorities','Clinical priorities',''],['working','Working clinical impression',''],['plan','Assessment plan / reassessment criteria','']]]
  ];
  function getPage(){return document.querySelector('#app .page')||document.querySelector('.page');}
  function patientKey(page){
    const heading=page?.querySelector('.head h3')?.textContent||page?.querySelector('h3')?.textContent||'patient';
    return 'movia.assessment.'+(heading.split(' · ')[0].trim()||'patient');
  }
  function inject(){
    const page=getPage();
    if(!page || page.dataset.enhanced==='1') return;
    const tabs=page.querySelector('.tabs');
    if(!tabs) return;
    try{
      let data={};
      try{data=JSON.parse(localStorage.getItem(patientKey(page))||'{}')||{};}catch(e){data={};}
      const wrap=document.createElement('div');
      wrap.className='assessment-enhanced';
      wrap.innerHTML='<div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured documentation for clinician review</span></div><span class="assessment-badge">Pilot V1</span></div>'+
        fields.map(([title,items])=>'<section class="assessment-section"><div class="section-title">'+esc(title)+'</div><div class="assessment-grid">'+items.map(([id,label,def])=>'<div class="field"><label>'+esc(label)+'</label><textarea data-assess="'+id+'" rows="2" placeholder="Document findings...">'+esc(data[id]||def)+'</textarea></div>').join('')+'</div></section>').join('')+
        '<div class="assessment-footer"><div class="mini">MOVIA provides structured decision support. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" data-enhanced-save>Save Comprehensive Assessment</button></div>';
      const actions=page.querySelector('.actions');
      if(actions) actions.parentNode.insertBefore(wrap,actions); else page.appendChild(wrap);
      wrap.querySelector('[data-enhanced-save]').addEventListener('click',()=>{
        const out={};
        wrap.querySelectorAll('[data-assess]').forEach(x=>out[x.dataset.assess]=x.value.trim());
        localStorage.setItem(patientKey(page),JSON.stringify(out));
        const b=wrap.querySelector('[data-enhanced-save]');
        b.textContent='Assessment Saved ✓';
        setTimeout(()=>b.textContent='Save Comprehensive Assessment',1800);
      });
      page.dataset.enhanced='1';
    }catch(e){console.warn('MOVIA assessment enhancer:',e);}
  }
  function run(){setTimeout(inject,50);setTimeout(inject,300);setTimeout(inject,1000);}
  if(document.body){new MutationObserver(run).observe(document.body,{childList:true,subtree:true});}
  run();
})();