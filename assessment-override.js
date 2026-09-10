(function(){
  function esc2(x){return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  const fields=[
    ['1. Pain & Symptom Profile',['Pain location / distribution','Onset & duration','Aggravating factors','Easing factors','24-hour pattern / irritability']],
    ['2. Safety & Screening',['Red-flag screening','Neurological screen','Precautions / contraindications']],
    ['3. Functional Assessment',['Activity limitations','Participation restrictions','Patient goals','Outcome measure & baseline']],
    ['4. Objective Examination',['Regional ROM / movement quality','MMT / strength pattern','Special tests','Palpation / symptom reproduction','Gait / functional movement']],
    ['5. Clinical Impression',['Key impairments','Clinical priorities','Working clinical impression','Assessment plan / reassessment criteria']]
  ];
  const ids=fields.flatMap(x=>x[1]);
  const key=()=>`movia.comprehensive.${patient().id}`;
  function load(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{};}catch(e){return {};}}
  function save(box){const data={};box.querySelectorAll('[data-comp]').forEach(x=>data[x.dataset.comp]=x.value);localStorage.setItem(key(),JSON.stringify(data));}
  assessment=function(){
    const p=patient(),saved=load();
    let comprehensive='';
    for(const [title,fs] of fields){comprehensive+=`<section class="assessment-section"><div class="section-title">${title}</div><div class="assessment-grid">${fs.map((f,i)=>{const id=title.split('.')[0]+'-'+i+'-'+f.replace(/[^a-z0-9]+/gi,'-').toLowerCase();return `<div class="field"><label>${f}</label><textarea data-comp="${esc2(id)}" rows="2" placeholder="Document clinical findings...">${esc2(saved[id]||'')}</textarea></div>`}).join('')}</div></section>`;}
    return `<div class="card page"><div class="head"><div><h3>${esc2(p.name)} · ${esc2(p.condition)}</h3><div class="mini">${p.id}</div></div><button type="button" class="secondary" data-action="patient-profile">Patient Profile</button></div><div class="tabs">${[['subjective','Subjective'],['objective','Objective'],['ai','MOVIA Intelligence']].map(x=>`<button type="button" class="tab ${S.tab===x[0]?'active':''}" data-tab="${x[0]}">${x[1]}</button>`).join('')}</div><div class="assessment-enhanced"><div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured physiotherapy documentation for clinician review</span></div><span class="assessment-badge">MOVIA V1</span></div>${comprehensive}<div class="assessment-footer"><div class="mini">Structured decision support only. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" id="save-comprehensive-real">Save Comprehensive Assessment</button></div></div></div>`;
  };
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='save-comprehensive-real'){const box=e.target.closest('.assessment-enhanced');save(box);e.target.textContent='Assessment Saved ✓';setTimeout(()=>{if(e.target)e.target.textContent='Save Comprehensive Assessment'},1800);}});
})();