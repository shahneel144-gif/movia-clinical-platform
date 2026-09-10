(function(){
  const esc=x=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const groups=[
    ['1. Pain & Symptom Profile',['Pain location / distribution','Onset & duration','Aggravating factors','Easing factors','24-hour pattern / irritability']],
    ['2. Safety & Screening',['Red-flag screening','Neurological screen','Precautions / contraindications']],
    ['3. Functional Assessment',['Activity limitations','Participation restrictions','Patient goals','Outcome measure & baseline']],
    ['4. Objective Examination',['Regional ROM / movement quality','MMT / strength pattern','Special tests','Palpation / symptom reproduction','Gait / functional movement']],
    ['5. Clinical Impression',['Key impairments','Clinical priorities','Working clinical impression','Assessment plan / reassessment criteria']]
  ];
  const storageKey=()=>`movia.comprehensive.${patient().id}`;
  function load(){try{return JSON.parse(localStorage.getItem(storageKey())||'{}')||{};}catch(e){return {};}}
  function save(box){const data={};box.querySelectorAll('[data-comp]').forEach(x=>data[x.dataset.comp]=x.value);localStorage.setItem(storageKey(),JSON.stringify(data));}
  function values(){const p=patient(),s=load();return {p,s,text:Object.values(s).join(' ').toLowerCase()};}
  function intelligence(){
    const {p,text}=values();
    const pain=Number(p.pain)||Number((p.sessions?.[p.sessions.length-1]||{}).pain)||0;
    const c=(p.condition||'').toLowerCase();
    let priorities=[],suggestions=[],monitor=[];
    if(c.includes('low back')){
      priorities=['Clarify symptom distribution and irritability','Screen for red flags and neurological involvement','Assess lumbar movement, trunk/hip strength and functional tolerance','Use patient goals to guide graded activity'];
      suggestions=['Lumbar mobility within symptom tolerance','Progressive trunk/core strengthening','Hip strengthening as indicated by examination','Education on activity modification and graded return to function'];
      monitor=['Pain response during/after activity','Lumbar movement tolerance','Functional sitting/bending tolerance','Exercise response between sessions'];
    }else if(c.includes('knee')){
      priorities=['Characterize pain, stiffness and functional limitations','Assess knee ROM, quadriceps strength and lower-limb function','Screen relevant precautions and contributing factors','Use functional goals to guide progression'];
      suggestions=['Progressive quadriceps and lower-limb strengthening','Functional sit-to-stand / stair training as indicated','Mobility work within tolerance','Education and activity pacing'];
      monitor=['Pain and stiffness','Knee ROM','Functional task tolerance','Strength and exercise response'];
    }else if(c.includes('shoulder')){
      priorities=['Clarify pain behavior and irritability','Assess active/passive ROM and strength pattern','Screen neurological and relevant red-flag features','Relate findings to functional goals'];
      suggestions=['Pain-limited shoulder mobility','Rotator cuff/scapular strengthening as indicated','Movement retraining and graded functional loading','Education on load management'];
      monitor=['Pain with movement','ROM','Strength tolerance','Functional overhead/activity tolerance'];
    }else{
      priorities=['Complete symptom and safety screening','Identify key impairments from examination','Link impairments to activity and participation limits','Set measurable patient-centred goals'];
      suggestions=['Select interventions from examination findings and patient goals','Use graded therapeutic exercise where appropriate','Provide education and monitor response'];
      monitor=['Symptoms','Function','Objective measures','Response to treatment'];
    }
    const redflag=/red.?flag|contraindication|neurolog/i.test(text)?'Documented screening information available — clinician review required.':'Safety screening has not been documented in the saved comprehensive assessment.';
    return `<div class="ai"><strong>MOVIA INTELLIGENCE</strong><h3>Clinician-reviewed assessment synthesis</h3><p><b>${esc(p.condition)}</b> · Current pain ${p.pain}/10 · ROM ${p.rom}°.</p><div class="grid2" style="margin-top:16px"><div><h4>Clinical priorities</h4><ul>${priorities.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><h4>Suggested treatment direction</h4><ul>${suggestions.map(x=>`<li>${x}</li>`).join('')}</ul></div></div><div style="margin-top:16px"><h4>Safety & screening</h4><p>${redflag}</p><h4>Monitor at follow-up</h4><ul>${monitor.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="mini">Decision support only. Recommendations are based on the documented case pattern and must be confirmed or modified by the treating physiotherapist.</div></div>`;
  }
  function objective(){const p=patient();return `<div class="formgrid">${Object.entries(p.findings).map(([k,v])=>`<div class="field"><label>${esc(k)}</label><input value="${esc(v)}"></div>`).join('')}</div><div class="field"><label>Functional limitation</label><textarea rows="4">${esc(p.history)}</textarea></div>`;}
  assessment=function(){
    const p=patient(),saved=load();
    let comprehensive='';
    for(const [title,fs] of groups){comprehensive+=`<section class="assessment-section"><div class="section-title">${title}</div><div class="assessment-grid">${fs.map((f,i)=>{const id=title.split('.')[0]+'-'+i+'-'+f.replace(/[^a-z0-9]+/gi,'-').toLowerCase();return `<div class="field"><label>${esc(f)}</label><textarea data-comp="${esc(id)}" rows="2" placeholder="Document clinical findings...">${esc(saved[id]||'')}</textarea></div>`}).join('')}</div></section>`;}
    const body=S.tab==='subjective'?`<div class="assessment-enhanced"><div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured physiotherapy documentation for clinician review</span></div><span class="assessment-badge">MOVIA V1</span></div>${comprehensive}<div class="assessment-footer"><div class="mini">Structured decision support only. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" id="save-comprehensive-real">Save Comprehensive Assessment</button></div></div>`:S.tab==='objective'?objective():intelligence();
    return `<div class="card page"><div class="head"><div><h3>${esc(p.name)} · ${esc(p.condition)}</h3><div class="mini">${p.id}</div></div><button type="button" class="secondary" data-action="patient-profile">Patient Profile</button></div><div class="tabs">${[['subjective','Subjective'],['objective','Objective'],['ai','MOVIA Intelligence']].map(x=>`<button type="button" class="tab ${S.tab===x[0]?'active':''}" data-tab="${x[0]}">${x[1]}</button>`).join('')}</div>${body}</div>`;
  };
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='save-comprehensive-real'){const box=e.target.closest('.assessment-enhanced');save(box);e.target.textContent='Assessment Saved ✓';setTimeout(()=>{if(e.target)e.target.textContent='Save Comprehensive Assessment'},1800);}});
})();