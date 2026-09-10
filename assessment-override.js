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
  const decisionKey=()=>`movia.decision.${patient().id}`;
  function load(){try{return JSON.parse(localStorage.getItem(storageKey())||'{}')||{};}catch(e){return {};}}
  function loadDecision(){try{return JSON.parse(localStorage.getItem(decisionKey())||'null');}catch(e){return null;}}
  function save(box){const data={};box.querySelectorAll('[data-comp]').forEach(x=>data[x.dataset.comp]=x.value);localStorage.setItem(storageKey(),JSON.stringify(data));}
  function values(){const p=patient(),s=load();return {p,s,text:Object.values(s).join(' ').toLowerCase()};}
  function hasText(s,terms){const t=Object.values(s).join(' ').toLowerCase();return terms.some(x=>t.includes(x));}
  function intelligence(){
    const {p,s,text}=values();
    const c=(p.condition||'').toLowerCase();
    const pain=Number(p.pain)||Number((p.sessions?.[p.sessions.length-1]||{}).pain)||0;
    const rom=p.rom||'—';
    let priorities=[],suggestions=[],monitor=[],why=[],exercises=[],progression=[];
    if(c.includes('low back')){
      priorities=['Clarify symptom distribution and irritability','Screen for red flags and neurological involvement','Assess lumbar movement, trunk/hip strength and functional tolerance','Use patient goals to guide graded activity'];
      suggestions=['Lumbar mobility within symptom tolerance','Progressive trunk/core strengthening','Hip strengthening as indicated by examination','Education on activity modification and graded return to function'];
      why=['Current documentation identifies Low Back Pain with reduced lumbar flexion and reduced trunk/core strength.','Treatment direction therefore emphasizes movement tolerance, progressive capacity and functional loading rather than symptom treatment alone.'];
      exercises=[['Cat-Camel','Lumbar mobility','Use within comfortable range; monitor symptom response'],['Bird Dog','Trunk control','Progress control and hold time as tolerated'],['Dead Bug','Core strengthening','Progress repetitions or lever length when control is maintained']];
      progression=['Pain remains stable or improves during/after exercise','Lumbar flexion tolerance improves','Trunk/core control improves without symptom aggravation','Sitting and bending tolerance improves'];
      monitor=['Pain response during/after activity','Lumbar movement tolerance','Functional sitting/bending tolerance','Exercise response between sessions'];
    }else if(c.includes('knee')){
      priorities=['Characterize pain, stiffness and functional limitations','Assess knee ROM, quadriceps strength and lower-limb function','Screen relevant precautions and contributing factors','Use functional goals to guide progression'];
      suggestions=['Progressive quadriceps and lower-limb strengthening','Functional sit-to-stand / stair training as indicated','Mobility work within tolerance','Education and activity pacing'];
      why=['The documented knee presentation should be linked to ROM, quadriceps capacity and functional task tolerance.','Progression should be based on symptom response and improvement in meaningful activities.'];
      exercises=[['Quad Set','Quadriceps activation','Progress toward active knee extension control'],['Sit to Stand','Functional strengthening','Adjust chair height and repetitions to tolerance']];
      progression=['Pain/stiffness remains manageable after exercise','Knee ROM improves or is maintained','Sit-to-stand/stair tolerance improves','Lower-limb strength and control improve'];
      monitor=['Pain and stiffness','Knee ROM','Functional task tolerance','Strength and exercise response'];
    }else if(c.includes('shoulder')){
      priorities=['Clarify pain behavior and irritability','Assess active/passive ROM and strength pattern','Screen neurological and relevant red-flag features','Relate findings to functional goals'];
      suggestions=['Pain-limited shoulder mobility','Rotator cuff/scapular strengthening as indicated','Movement retraining and graded functional loading','Education on load management'];
      why=['The shoulder pathway links irritability and ROM with strength and functional loading tolerance.','Exercise selection should be adjusted to the documented examination findings and response.'];
      exercises=[['Wall Slide','Shoulder mobility','Progress range while maintaining acceptable symptoms'],['Scapular Retraction','Scapular control','Progress repetitions and control before adding load']];
      progression=['Pain response is acceptable during/after loading','Shoulder ROM improves','Strength tolerance improves','Overhead/activity tolerance improves'];
      monitor=['Pain with movement','ROM','Strength tolerance','Functional overhead/activity tolerance'];
    }else{
      priorities=['Complete symptom and safety screening','Identify key impairments from examination','Link impairments to activity and participation limits','Set measurable patient-centred goals'];
      suggestions=['Select interventions from examination findings and patient goals','Use graded therapeutic exercise where appropriate','Provide education and monitor response'];
      why=['Recommendations are intentionally broad until sufficient patient-specific examination data are documented.'];
      exercises=[];
      progression=['Symptoms remain stable or improve','Relevant objective measures improve','Functional goals show measurable progress'];
      monitor=['Symptoms','Function','Objective measures','Response to treatment'];
    }
    const safety=hasText(s,['red flag','redflag','contraindication','neurolog'])?'Documented screening information available — clinician review required.':'Safety screening has not been documented in the saved comprehensive assessment.';
    const documented=s['5-0-key-impairments']||'';
    const impression=s['5-2-working-clinical-impression']||'';
    const decision=loadDecision();
    return `<div class="ai intelligence-v2">
      <div class="intel-hero"><div><strong>MOVIA INTELLIGENCE</strong><h3>Clinician-reviewed assessment synthesis</h3><p><b>${esc(p.condition)}</b> · Current pain ${esc(pain)}/10 · ROM ${esc(rom)}°.</p></div><span class="assessment-badge">DECISION SUPPORT</span></div>
      <div class="intel-strip"><div><span>DOCUMENTED IMPAIRMENT</span><b>${esc(documented||'Not yet documented')}</b></div><div><span>WORKING IMPRESSION</span><b>${esc(impression||'Not yet documented')}</b></div></div>
      <div class="grid2" style="margin-top:16px">
        <div class="card" style="box-shadow:none"><h4>Clinical priorities</h4><ul>${priorities.map(x=>`<li>${x}</li>`).join('')}</ul></div>
        <div class="card" style="box-shadow:none"><h4>Suggested treatment direction</h4><ul>${suggestions.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      </div>
      <div class="card intel-reason" style="box-shadow:none"><h4>Why MOVIA suggests this</h4><ul>${why.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      ${exercises.length?`<div class="card" style="box-shadow:none"><h4>Suggested exercise options</h4><div class="exercise-suggestions">${exercises.map(x=>`<div class="exercise-suggestion"><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div><p>${esc(x[2])}</p></div>`).join('')}</div><div class="mini">Exercise suggestions are options for clinician selection, not an automatic prescription.</div></div>`:''}
      <div class="grid2" style="margin-top:16px">
        <div class="card" style="box-shadow:none"><h4>Safety & screening</h4><p>${safety}</p></div>
        <div class="card" style="box-shadow:none"><h4>Monitor at follow-up</h4><ul>${monitor.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      </div>
      <div class="card" style="box-shadow:none"><h4>Progression criteria</h4><p class="mini">Consider progression when the following are met and the treating physiotherapist agrees:</p><ul>${progression.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="intel-approval"><div><b>Clinician decision</b><p class="mini">Review the synthesis before incorporating it into the treatment plan.</p></div><div class="decision-buttons"><button type="button" class="secondary" data-intel-decision="modify">Needs modification</button><button type="button" class="primary" data-intel-decision="approve">Approve for plan</button></div><div class="mini decision-status">${decision?`Last decision: <b>${decision.label}</b>`:'No clinician decision recorded yet.'}</div></div>
      <div class="mini">Decision support only. Recommendations are based on the documented case pattern and must be confirmed or modified by the treating physiotherapist.</div>
    </div>`;
  }
  function objective(){const p=patient();return `<div class="formgrid">${Object.entries(p.findings).map(([k,v])=>`<div class="field"><label>${esc(k)}</label><input value="${esc(v)}"></div>`).join('')}</div><div class="field"><label>Functional limitation</label><textarea rows="4">${esc(p.history)}</textarea></div>`;}
  assessment=function(){
    const p=patient(),saved=load();
    let comprehensive='';
    for(const [title,fs] of groups){comprehensive+=`<section class="assessment-section"><div class="section-title">${title}</div><div class="assessment-grid">${fs.map((f,i)=>{const id=title.split('.')[0]+'-'+i+'-'+f.replace(/[^a-z0-9]+/gi,'-').toLowerCase();return `<div class="field"><label>${esc(f)}</label><textarea data-comp="${esc(id)}" rows="2" placeholder="Document clinical findings...">${esc(saved[id]||'')}</textarea></div>`}).join('')}</div></section>`;}
    const body=S.tab==='subjective'?`<div class="assessment-enhanced"><div class="assessment-intro"><div><b>COMPREHENSIVE CLINICAL ASSESSMENT</b><span>Structured physiotherapy documentation for clinician review</span></div><span class="assessment-badge">MOVIA V1</span></div>${comprehensive}<div class="assessment-footer"><div class="mini">Structured decision support only. Final clinical judgement remains with the treating physiotherapist.</div><button type="button" class="primary" id="save-comprehensive-real">Save Comprehensive Assessment</button></div></div>`:S.tab==='objective'?objective():intelligence();
    return `<div class="card page"><div class="head"><div><h3>${esc(p.name)} · ${esc(p.condition)}</h3><div class="mini">${p.id}</div></div><button type="button" class="secondary" data-action="patient-profile">Patient Profile</button></div><div class="tabs">${[['subjective','Subjective'],['objective','Objective'],['ai','MOVIA Intelligence']].map(x=>`<button type="button" class="tab ${S.tab===x[0]?'active':''}" data-tab="${x[0]}">${x[1]}</button>`).join('')}</div>${body}</div>`;
  };
  document.addEventListener('click',function(e){
    if(e.target&&e.target.id==='save-comprehensive-real'){const box=e.target.closest('.assessment-enhanced');save(box);e.target.textContent='Assessment Saved ✓';setTimeout(()=>{if(e.target)e.target.textContent='Save Comprehensive Assessment'},1800);}
    const decision=e.target?.dataset?.intelDecision;
    if(decision){const label=decision==='approve'?'Approved for treatment plan':'Needs modification';localStorage.setItem(decisionKey(),JSON.stringify({label,time:new Date().toISOString()}));e.target.closest('.intel-approval').querySelector('.decision-status').innerHTML=`Last decision: <b>${label}</b>`;toast(`MOVIA decision recorded: ${label}`);}
  });
})();