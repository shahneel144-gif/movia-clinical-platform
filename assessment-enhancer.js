(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const key=()=>{const text=document.querySelector('.page h3')?.textContent||'';return 'movia.assessment.'+(text.split(' · ')[0]||'patient')};
  const sections=[
    ['Pain & Symptom Profile',[['pain-location','Pain location / distribution',''],['onset','Onset & duration',''],['aggravating','Aggravating factors',''],['easing','Easing factors',''],['24h','24-hour pattern / irritability','']]],
    ['Safety & Screening',[['redflags','Red-flag screening','No red flags identified'],['neuro','Neurological screen','Not assessed'],['precautions','Precautions / contraindications','None documented']]],
    ['Functional Assessment',[['activity','Activity limitations',''],['participation','Participation restrictions',''],['goals','Patient goals',''],['outcome','Outcome measure & baseline','']]],
    ['Objective Examination',[['romdetail','Regional ROM / movement quality',''],['mmt','MMT / strength pattern',''],['special','Special tests',''],['palpation','Palpation / symptom reproduction',''],['gait','Gait / functional movement','']]],
    ['Clinical Impression',[['impairments','Key impairments',''],['priorities','Clinical priorities',''],['working','Working clinical impression',''],['plan','Assessment plan / reassessment criteria','']]]
  ];
  function inject(){
    const page=document.querySelector('.page');
    if(!page || page.dataset.enhanced==='1') return;
    const tabs=page.querySelector('.tabs'); if(!tabs) return;
    page.dataset.enhanced='1';
    const data=JSON.parse(localStorage.getItem(key())||'{}');
    const wrap=document.createElement('div'); wrap.className='assessment-enhanced';
    wrap.innerHTML='<div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured documentation for clinician review</span></div><span class="assessment-badge">Pilot V1</span></div>'+
      sections.map(([title,fields])=>'<section class="assessment-section"><div class="section-title">'+esc(title)+'</div><div class="assessment-grid">'+fields.map(([id,label,def])=>'<div class="field"><label>'+esc(label)+'</label><textarea data-assess="'+id+'" rows="2" placeholder="Document findings...">'+esc(data[id]||def)+'</textarea></div>').join('')+'</div></section>').join('')+
      '<div class="assessment-footer"><div class="mini">MOVIA provides structured decision support. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" data-enhanced-save>Save Comprehensive Assessment</button></div>';
    const actions=page.querySelector('.actions');
    if(actions) page.insertBefore(wrap,actions); else page.appendChild(wrap);
    wrap.querySelector('[data-enhanced-save]').addEventListener('click',()=>{
      const out={};wrap.querySelectorAll('[data-assess]').forEach(x=>out[x.dataset.assess]=x.value.trim());
      localStorage.setItem(key(),JSON.stringify(out));
      const b=wrap.querySelector('[data-enhanced-save]');b.textContent='Assessment Saved ✓';setTimeout(()=>b.textContent='Save Comprehensive Assessment',1800);
    });
  }
  const obs=new MutationObserver(()=>setTimeout(inject,20));
  obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(inject,300);
})();