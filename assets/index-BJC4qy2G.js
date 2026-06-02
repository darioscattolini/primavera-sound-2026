(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={"estrella-damm":`Estrella Damm`,revolut:`Revolut`,cupra:`Cupra`,warehouse:`Warehouse`,"auditori-rockdelux":`Auditori Rockdelux`,schwarzkopf:`Schwarzkopf`,"schwarzkopf-backstage":`Schwarzkopf Backstage`,port:`Port`,occident:`Occident`,fever:`Fever`,plenitude:`Plenitude`,"levis-501-club":`Levi's 501 Club`,"levis-501-plaza":`Levi's 501 Plaza`,"aperol-island-of-joy":`Aperol Island of Joy`,"pulse-cupra":`Pulse Cupra`,"disney-stage":`Disney Stage`,"barcelona-sona":`Barcelona Sona`,"parc-del-forum":`Parc del Fòrum`};function t(e){let t=new Date(e+2*3600*1e3);return t.getUTCHours().toString().padStart(2,`0`)+`:`+t.getUTCMinutes().toString().padStart(2,`0`)}function n(e,t){return{3:`wed`,4:`thu`,5:`fri`,6:`sat`,7:`sun`}[new Date((e||t)+2*3600*1e3).getUTCDate()]??`tbd`}function r(r){return r.data.getLineupEvent.artists.filter(e=>e.venues.length>0).map(r=>{let i=r.venues[0],a=parseInt(i.dateTimeStartReal,10),o=parseInt(i.dateTimeStartHuman,10);return{id:r.artistSlugName,name:r.artistName,day:n(o,a),stage:e[i.venueSlugName]??i.venueSlugName,stageSlug:i.venueSlugName,time:t(a),timeTs:a,duration:i.duration,image:r.image?.en??``}}).sort((e,t)=>e.timeTs-t.timeTs)}async function i(){return r(await fetch(`data/lineup.json`).then(e=>e.json()))}var a=`ps26_state`;function o(){try{return JSON.parse(localStorage.getItem(a)??`{}`)}catch{return{}}}function s(e){localStorage.setItem(a,JSON.stringify(e))}function c(e,t){return e[t]||(e[t]={priority:null}),e[t]}function l(e,t,n){return e.filter(e=>{let r=c(t,e.id);return!(n.day!==`all`&&e.day!==n.day||n.stage!==`all`&&e.stageSlug!==n.stage||n.prio!==`all`&&(r.priority??`none`)!==n.prio)})}var u=[`wed`,`thu`,`fri`,`sat`,`sun`],d={wed:{label:`Wed 3`,full:`Wednesday, June 3`,color:`#4a1d6b`,emoji:`💜`},thu:{label:`Thu 4`,full:`Thursday, June 4`,color:`#7c3aed`,emoji:`💜`},fri:{label:`Fri 5`,full:`Friday, June 5`,color:`#0891b2`,emoji:`💙`},sat:{label:`Sat 6`,full:`Saturday, June 6`,color:`#059669`,emoji:`💚`},sun:{label:`Sun 7`,full:`Sunday, June 7 · Primavera Bits`,color:`#db2777`,emoji:`🩷`},tbd:{label:`TBD`,full:`TBD`,color:`#888888`,emoji:``}};function f(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function p(e,t){let[n,r]=e.split(`:`).map(Number),i=n*60+r+t;return`${String(Math.floor(i/60)%24).padStart(2,`0`)}:${String(i%60).padStart(2,`0`)}`}var m={genres:[`Indie Rock`,`Shoegaze`,`Dream Pop`],videos:[{id:`NUnvdUDWHBU`,title:`Karma Police`},{id:`u5CVsCnxyXg`,title:`Fake Plastic Trees`},{id:`XFkzRNyygfk`,title:`High and Dry`},{id:`yI2oS2hoL0k`,title:`Burn the Witch`}]};function h(e){return m}var g={must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`};function _(e,t){let n=c(t,e.id).priority??``,r=p(e.time,e.duration),i=d[e.day]?.label??e.day,{genres:a}=h(e.id),o=e.image?`<img class="card-img" src="${e.image}" alt="" loading="lazy" onerror="this.style.display='none'">`:``,s=a.map(e=>`<span class="genre-chip">${f(e)}</span>`).join(``),l=n?`<span class="card-prio-icon">${g[n]}</span>`:``;return`<div class="artist-card day-${e.day}${n?` priority-${n}`:``}"
    id="card-${e.id}" data-action="open-modal" data-id="${e.id}">
    ${o}
    <div class="card-body">
      <div class="card-top">
        <div class="artist-name">${f(e.name)}</div>
        ${l}
      </div>
      <div class="card-meta">
        <span class="time">${e.time}–${r}</span>
        <span class="stage">${f(e.stage)}</span>
        <span class="day-badge">${i}</span>
      </div>
      <div class="card-genres">${s}</div>
    </div>
  </div>`}function v(e,t){let n={};e.forEach(e=>{(n[e.day]??=[]).push(e)});let r=``;for(let e of u){let i=n[e];if(!i||i.length===0)continue;let a=d[e];r+=`<div class="day-section">
      <div class="day-header">
        <div class="day-dot" style="background:${a.color}"></div>
        <h2>${a.emoji} ${a.full}</h2>
        <span class="day-count">${i.length} artist${i.length===1?``:`s`}</span>
      </div>
      <div class="artists-grid">
        ${i.map(e=>_(e,t)).join(``)}
      </div>
    </div>`}return r||`<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`}var y={must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`};function b(e,t){let n=e.filter(e=>{let n=c(t,e.id).priority;return n===`must`||n===`want`||n===`maybe`}).sort((e,t)=>e.timeTs-t.timeTs);if(n.length===0)return`<div class="empty-state">
      <div class="big">📋</div>
      <div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Go to Lineup and mark artists as 🔥 Must or ⭐ Want.</div>
    </div>`;let r=x(n),i={};n.forEach(e=>{(i[e.day]??=[]).push(e)});let a=``;for(let e of u){let n=i[e];if(!n)continue;let o=d[e];a+=`<div class="schedule-day">
      <div class="schedule-day-title">
        <span style="color:${o.color}">${o.emoji}</span>
        ${o.full}
        <span class="count-badge">${n.length}</span>
      </div>
      <div class="schedule-list">`;for(let e of n){let n=c(t,e.id).priority??``,i=y[n]??``,o=r.has(e.id)?`<span class="conflict-badge">⚡ clash</span>`:``,s=p(e.time,e.duration),{genres:l}=h(e.id),u=l.map(e=>`<span class="genre-chip genre-chip--sm">${f(e)}</span>`).join(``);a+=`<div class="schedule-item ${n}" data-action="open-modal" data-id="${e.id}">
        <div class="sched-time">${e.time}</div>
        <div class="sched-prio-icon">${i}</div>
        <div style="flex:1;min-width:0">
          <div class="sched-name">${f(e.name)}${o}</div>
          <div class="sched-meta">${f(e.stage)} · ${e.duration} min · ends ${s}</div>
          <div style="margin-top:4px">${u}</div>
        </div>
      </div>`}a+=`</div></div>`}return a}function x(e){let t=new Set;for(let n=0;n<e.length;n++)for(let r=n+1;r<e.length;r++){let i=e[n],a=e[r];if(i.day!==a.day)continue;let o=i.timeTs+i.duration*6e4,s=a.timeTs+a.duration*6e4;i.timeTs<s&&a.timeTs<o&&(t.add(i.id),t.add(a.id))}return t}var S=1.5,C=48,w=120,T=36e5;function E(e,t){let n={};e.forEach(e=>{(n[e.day]??=[]).push(e)});for(let e of u){let r=n[e];if(r?.length)return k(e,r,t)}return`<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`}function D(e,t){return E(e,t)}function O(e,t){let n=e.filter(e=>{let n=c(t,e.id).priority;return n===`must`||n===`want`||n===`maybe`});return n.length?E(n,t):`<div class="empty-state">
      <div class="big">📋</div><div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Mark artists as 🔥 Must or ⭐ Want in the Lineup.</div>
    </div>`}function k(e,t,n){d[e];let r=new Map;t.forEach(e=>{r.has(e.stageSlug)||r.set(e.stageSlug,e.stage)});let i=[...r.entries()].sort((e,t)=>e[1].localeCompare(t[1])),a=Math.min(...t.map(e=>e.timeTs)),o=Math.max(...t.map(e=>e.timeTs+e.duration*6e4)),s=Math.floor(a/T)*T,l=Math.ceil(o/T)*T,u=(l-s)/6e4*S+24,m=[],h=[];for(let e=s;e<=l;e+=T){let t=12+(e-s)/6e4*S,n=new Date(e+2*36e5),r=`${String(n.getUTCHours()).padStart(2,`0`)}:00`;m.push(`<div class="sg-tick" style="top:${t}px">${r}</div>`),h.push(`<div class="sg-hline" style="top:${t}px"></div>`)}let g=i.map(([,e])=>`<div class="sg-col-header" style="width:${w}px">${f(e)}</div>`).join(``),_=i.map(([e])=>`<div class="sg-col" style="width:${w}px">${t.filter(t=>t.stageSlug===e).map(e=>{let t=c(n,e.id).priority??``,r=12+(e.timeTs-s)/6e4*S,i=Math.max(e.duration*S,28),a=p(e.time,e.duration),o=t===`must`?`🔥 `:t===`want`?`⭐ `:t===`maybe`?`🤔 `:``;return`<div class="sg-block${t?` sg-${t}`:``}"
          style="top:${r}px;height:${i}px"
          data-action="open-modal" data-id="${e.id}">
          <div class="sg-block-name">${o}${f(e.name)}</div>
          <div class="sg-block-time">${e.time}–${a}</div>
        </div>`}).join(``)}</div>`).join(``),v=i.length*121+C;return`<div class="sg-outer">
    <div class="sg-header-sticky">
      <div class="sg-header-row" style="padding-left:${C}px;min-width:${v}px">${g}</div>
    </div>
    <div class="sg-scroll">
      <div style="min-width:${v}px">
        <div class="sg-body" style="height:${u}px">
          <div class="sg-ruler">${m.join(``)}</div>
          <div class="sg-cols-area">
            <div class="sg-hlines">${h.join(``)}</div>
            ${_}
          </div>
        </div>
      </div>
    </div>
  </div>`}function A(e,t){let n=c(t,e.id).priority??``,r=p(e.time,e.duration),i=d[e.day],{genres:a,videos:o}=h(e.id),s=a.map(e=>`<span class="genre-chip">${f(e)}</span>`).join(``),l=[`must`,`want`,`maybe`,`skip`].map(t=>`<button class="prio-btn${n===t?` active-${t}`:``}"
      data-action="modal-set-priority" data-id="${e.id}" data-value="${t}">
      ${{must:`🔥 Must`,want:`⭐ Want`,maybe:`🤔 Maybe`,skip:`👋 Skip`}[t]}
    </button>`).join(``),u=e.image?`<img class="modal-img" src="${e.image}" alt="" onerror="this.style.display='none'">`:``,m=o.map(e=>`
    <a class="video-thumb" href="https://www.youtube.com/watch?v=${e.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-thumb-img" style="background-image:url(https://img.youtube.com/vi/${e.id}/mqdefault.jpg)">
        <div class="video-play-btn">▶</div>
      </div>
      <div class="video-thumb-title">${f(e.title)}</div>
    </a>
  `).join(``);return`<div class="modal-overlay" id="modal-overlay">
    <div class="modal" id="modal-box">
      <button class="modal-close" data-action="close-modal" aria-label="Close">×</button>

      <div class="modal-header">
        ${u}
        <div class="modal-info">
          <div class="modal-name">${f(e.name)}</div>
          <div class="modal-meta">
            <div style="color:${i.color}">${i.emoji} ${i.full}</div>
            <div>${f(e.stage)}</div>
            <div><strong>${e.time}–${r}</strong> · ${e.duration} min</div>
          </div>
          <div class="modal-genres">${s}</div>
        </div>
      </div>

      <div class="priority-btns modal-priority-btns">${l}</div>

      <div class="video-grid">${m}</div>
    </div>
  </div>`}function j(e){return u.filter(t=>e.some(e=>e.day===t)).map(e=>`<div class="chip day-${e}" data-filter="day" data-val="${e}">${d[e].label}</div>`).join(``)}function M(e){let t=new Set,n=[];return e.forEach(e=>{t.has(e.stageSlug)||(t.add(e.stageSlug),n.push({slug:e.stageSlug,name:e.stage}))}),n.sort((e,t)=>e.name.localeCompare(t.name)),n.map(({slug:e,name:t})=>`<div class="chip" data-filter="stage" data-val="${e}">${f(t)}</div>`).join(``)}var N=[],P=o(),F=`lineup`,I=`stage`,L={day:`all`,prio:`all`,stage:`all`},R=document.getElementById(`lineup-view`),z=document.getElementById(`schedule-view`),B=document.getElementById(`lineup-grid`),V=document.getElementById(`schedule-content`),H=document.getElementById(`modal-container`);function U(){if(F===`lineup`){let e=l(N,P,L);B.innerHTML=I===`stage`?D(e,P):v(e,P)}else V.innerHTML=I===`stage`?O(N,P):b(N,P)}document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-tab]`);t&&(F=t.dataset.tab,document.querySelectorAll(`.tab`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),R.style.display=F===`lineup`?``:`none`,z.style.display=F===`schedule`?`block`:`none`,U())}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);t&&(I=t.dataset.view,document.querySelectorAll(`[data-view]`).forEach(e=>e.classList.remove(`active`)),document.querySelectorAll(`[data-view="${I}"]`).forEach(e=>e.classList.add(`active`)),U())}),document.getElementById(`filters-bar`).addEventListener(`click`,e=>{let t=e.target.closest(`.filter-group-btn`);t&&t.closest(`.filter-group`)?.classList.toggle(`open`)}),document.getElementById(`filters-bar`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-filter]`);if(!t)return;let n=t.dataset.filter,r=t.dataset.val;document.querySelectorAll(`[data-filter="${n}"]`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),n===`day`&&(L.day=r),n===`prio`&&(L.prio=r),n===`stage`&&(L.stage=r),F===`lineup`&&U()}),document.addEventListener(`scroll`,e=>{let t=e.target;if(!t.classList?.contains(`sg-scroll`))return;let n=t.closest(`.sg-outer`)?.querySelector(`.sg-header-row`);n&&(n.style.transform=`translateX(-${t.scrollLeft}px)`)},{passive:!0,capture:!0}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="open-modal"]`);if(!t)return;let n=N.find(e=>e.id===t.dataset.id);n&&(H.innerHTML=A(n,P),document.body.style.overflow=`hidden`)}),document.addEventListener(`click`,e=>{let t=e.target;(t.id===`modal-overlay`||t.closest(`[data-action="close-modal"]`))&&W()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&W()});function W(){H.innerHTML=``,document.body.style.overflow=``}document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="modal-set-priority"]`);if(!t)return;let{id:n,value:r}=t.dataset,i=c(P,n);i.priority=i.priority===r?null:r,s(P),G(n,i.priority),document.querySelectorAll(`[data-action="modal-set-priority"]`).forEach(e=>{e.className=e.className.replace(/active-\w+/g,``).trim(),i.priority&&e.dataset.value===i.priority&&e.classList.add(`active-${i.priority}`)})});function G(e,t){let n=document.getElementById(`card-${e}`);if(n){n.className=n.className.replace(/priority-\w+/g,``).trim(),t&&n.classList.add(`priority-${t}`);let e=n.querySelector(`.card-prio-icon`);e&&(e.textContent=t?{must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`}[t]??``:``)}document.querySelectorAll(`.sg-block[data-id="${e}"]`).forEach(n=>{n.className=`sg-block${t?` sg-${t}`:``}`;let r=n.querySelector(`.sg-block-name`);if(r){let n={must:`🔥 `,want:`⭐ `,maybe:`🤔 `},i=N.find(t=>t.id===e)?.name??``;r.textContent=(t&&n[t]?n[t]:``)+i}}),document.querySelectorAll(`.schedule-item[data-id="${e}"]`).forEach(e=>{e.className=e.className.replace(/\b(must|want|maybe|skip)\b/g,``).trim(),t&&e.classList.add(t)})}function K(){let e={wed:3,thu:4,fri:5,sat:6,sun:7},t=new Date(Date.now()+2*36e5),n=t.getUTCMonth()===5?t.getUTCDate():t.getUTCMonth()<5?0:99,r=[`wed`,`thu`,`fri`,`sat`,`sun`].filter(e=>N.some(t=>t.day===e));return r.find(t=>e[t]>=n)??r[r.length-1]??`thu`}i().then(e=>{N=e,document.querySelector(`#day-filters .filter-chips`).insertAdjacentHTML(`beforeend`,j(N)),document.querySelector(`#stage-filter-wrap .filter-chips`).insertAdjacentHTML(`beforeend`,M(N));let t=K();L.day=t,document.querySelector(`[data-filter="day"][data-val="${t}"]`)?.classList.add(`active`),U()}).catch(e=>{B.innerHTML=`<div class="empty-state">
      <div class="big">⚠️</div>
      <div>Could not load lineup.json</div>
      <div style="margin-top:8px;font-size:0.8rem;color:#999">${f(e.message)}</div>
    </div>`});