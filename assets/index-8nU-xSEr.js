(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={"estrella-damm":`Estrella Damm`,revolut:`Revolut`,cupra:`Cupra`,warehouse:`Levi's Warehouse`,"auditori-rockdelux":`Auditori Rockdelux`,schwarzkopf:`Schwarzkopf`,"schwarzkopf-backstage":`Backstage by Schwarzkopf`,port:`Port`,occident:`Occident`,fever:`Fever House`,plenitude:`Plenitude`,"levis-501-club":`501 Club`,"levis-501-plaza":`Levi's Plaza`,"aperol-island-of-joy":`Aperol Island of Joy`,"pulse-cupra":`Cupra Pulse`,"disney-stage":`Disney`,"barcelona-sona":`Barcelona Sona`,"parc-del-forum":`Parc del Fòrum`,adidas:`The Adidas Yard`};function t(e){let t=new Date(e+2*3600*1e3);return t.getUTCHours().toString().padStart(2,`0`)+`:`+t.getUTCMinutes().toString().padStart(2,`0`)}function n(e,t){return{3:`wed`,4:`thu`,5:`fri`,6:`sat`,7:`sun`}[new Date((e||t)+2*3600*1e3).getUTCDate()]??`tbd`}function r(r){return r.data.getLineupEvent.artists.filter(e=>e.venues.length>0).map(r=>{let i=r.venues[0],a=parseInt(i.dateTimeStartReal,10),o=parseInt(i.dateTimeStartHuman,10);return{id:r.artistSlugName,name:r.artistName,day:n(o,a),stage:e[i.venueSlugName]??i.venueSlugName,stageSlug:i.venueSlugName,time:t(a),timeTs:a,duration:i.duration,image:r.image?.en??``}}).sort((e,t)=>e.timeTs-t.timeTs)}var i=`https://graphql.primaverasound.com/prod/graphql`,a=`
  query Get($name: String!) {
    getLineupEvent(name: $name) {
      artists {
        artistSlugName
        artistName
        image { en }
        duration
        venues {
          venueSlugName
          dateTimeStartReal
          dateTimeStartHuman
          duration
        }
      }
    }
  }
`;async function o(){return r(await(await fetch(i,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({query:a,operationName:`Get`,variables:{name:`primavera-sound-2026-barcelona`}})})).json())}var s=`ps26_state`;function c(){try{return JSON.parse(localStorage.getItem(s)??`{}`)}catch{return{}}}function l(e){localStorage.setItem(s,JSON.stringify(e))}function u(e,t){return e[t]||(e[t]={priority:null,tags:[]}),e[t]}function d(e,t,n){return e.filter(e=>{let r=u(t,e.id);if(n.day!==`all`&&e.day!==n.day||n.stage.length>0&&!n.stage.includes(e.stageSlug))return!1;if(n.prio.length>0){let e=r.priority??`none`;if(!n.prio.includes(e))return!1}return!0})}var f=[`wed`,`thu`,`fri`,`sat`,`sun`],p=[`estrella-damm`,`revolut`,`plenitude`,`adidas`,`aperol-island-of-joy`,`disney-stage`,`barcelona-sona`,`cupra`,`pulse-cupra`,`port`,`schwarzkopf`,`warehouse`,`levis-501-club`,`schwarzkopf-backstage`,`levis-501-plaza`,`occident`,`auditori-rockdelux`],m={wed:{label:`Wed 3`,full:`Wednesday, June 3`,color:`#4a1d6b`,emoji:`💜`},thu:{label:`Thu 4`,full:`Thursday, June 4`,color:`#7c3aed`,emoji:`💜`},fri:{label:`Fri 5`,full:`Friday, June 5`,color:`#0891b2`,emoji:`💙`},sat:{label:`Sat 6`,full:`Saturday, June 6`,color:`#059669`,emoji:`💚`},sun:{label:`Sun 7`,full:`Sunday, June 7 · Primavera Bits`,color:`#db2777`,emoji:`🩷`},tbd:{label:`TBD`,full:`TBD`,color:`#888888`,emoji:``}};function h(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function g(e,t){let[n,r]=e.split(`:`).map(Number),i=n*60+r+t;return`${String(Math.floor(i/60)%24).padStart(2,`0`)}:${String(i%60).padStart(2,`0`)}`}var _={};async function v(){try{_=await fetch(`data/enrichment.json`).then(e=>e.json())}catch{_={}}}var y={genres:[`Indie Rock`,`Shoegaze`,`Dream Pop`],videos:[{id:`NUnvdUDWHBU`,title:`Karma Police`},{id:`u5CVsCnxyXg`,title:`Fake Plastic Trees`},{id:`XFkzRNyygfk`,title:`High and Dry`},{id:`yI2oS2hoL0k`,title:`Burn the Witch`}]};function b(e){let t=_[e];return t?{genres:t.genres??[],videos:[...t.classics??[],...t.recent??[],...t.videos??[]]}:y}var x={must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`};function S(e,t){let n=u(t,e.id).priority??``,r=g(e.time,e.duration),i=m[e.day]?.label??e.day,{genres:a}=b(e.id),o=e.image?`<img class="card-img" src="${e.image}" alt="" loading="lazy" onerror="this.style.display='none'">`:``,s=a.map(e=>`<span class="genre-chip">${h(e)}</span>`).join(``),c=n?`<span class="card-prio-icon">${x[n]}</span>`:``;return`<div class="artist-card day-${e.day}${n?` priority-${n}`:``}"
    id="card-${e.id}" data-action="open-modal" data-id="${e.id}">
    ${o}
    <div class="card-body">
      <div class="card-top">
        <div class="artist-name">${h(e.name)}</div>
        ${c}
      </div>
      <div class="card-meta">
        <span class="time">${e.time}–${r}</span>
        <span class="stage">${h(e.stage)}</span>
        <span class="day-badge">${i}</span>
      </div>
      <div class="card-genres">${s}</div>
    </div>
  </div>`}function C(e,t){let n={};e.forEach(e=>{(n[e.day]??=[]).push(e)});let r=``;for(let e of f){let i=n[e];if(!i||i.length===0)continue;let a=m[e];r+=`<div class="day-section">
      <div class="day-header">
        <div class="day-dot" style="background:${a.color}"></div>
        <h2>${a.emoji} ${a.full}</h2>
        <span class="day-count">${i.length} artist${i.length===1?``:`s`}</span>
      </div>
      <div class="artists-grid">
        ${i.map(e=>S(e,t)).join(``)}
      </div>
    </div>`}return r||`<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`}var w={must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`};function T(e,t){let n=e.filter(e=>{let n=u(t,e.id).priority;return n===`must`||n===`want`||n===`maybe`}).sort((e,t)=>e.timeTs-t.timeTs);if(n.length===0)return`<div class="empty-state">
      <div class="big">📋</div>
      <div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Go to Lineup and mark artists as 🔥 Must or ⭐ Want.</div>
    </div>`;let r=E(n),i={};n.forEach(e=>{(i[e.day]??=[]).push(e)});let a=``;for(let e of f){let n=i[e];if(!n)continue;let o=m[e];a+=`<div class="schedule-day">
      <div class="schedule-day-title">
        <span style="color:${o.color}">${o.emoji}</span>
        ${o.full}
        <span class="count-badge">${n.length}</span>
      </div>
      <div class="schedule-list">`;for(let e of n){let n=u(t,e.id).priority??``,i=w[n]??``,o=r.has(e.id)?`<span class="conflict-badge">⚡ clash</span>`:``,s=g(e.time,e.duration),{genres:c}=b(e.id),l=c.map(e=>`<span class="genre-chip genre-chip--sm">${h(e)}</span>`).join(``);a+=`<div class="schedule-item ${n}" data-action="open-modal" data-id="${e.id}">
        <div class="sched-time">${e.time}</div>
        <div class="sched-prio-icon">${i}</div>
        <div style="flex:1;min-width:0">
          <div class="sched-name">${h(e.name)}${o}</div>
          <div class="sched-meta">${h(e.stage)} · ${e.duration} min · ends ${s}</div>
          <div style="margin-top:4px">${l}</div>
        </div>
      </div>`}a+=`</div></div>`}return a}function E(e){let t=new Set;for(let n=0;n<e.length;n++)for(let r=n+1;r<e.length;r++){let i=e[n],a=e[r];if(i.day!==a.day)continue;let o=i.timeTs+i.duration*6e4,s=a.timeTs+a.duration*6e4;i.timeTs<s&&a.timeTs<o&&(t.add(i.id),t.add(a.id))}return t}var D=1.5,O=48,k=120,A=36e5;function j(e,t){let n={};e.forEach(e=>{(n[e.day]??=[]).push(e)});for(let e of f){let r=n[e];if(r?.length)return P(e,r,t)}return`<div class="empty-state"><div class="big">🔍</div><div>No artists match your filters.</div></div>`}function M(e,t){return j(e,t)}function N(e,t){let n=e.filter(e=>{let n=u(t,e.id).priority;return n===`must`||n===`want`||n===`maybe`});return n.length?j(n,t):`<div class="empty-state">
      <div class="big">📋</div><div>No artists marked yet.</div>
      <div style="margin-top:8px;font-size:0.85rem">Mark artists as 🔥 Must or ⭐ Want in the Lineup.</div>
    </div>`}function P(e,t,n){m[e];let r=new Map;t.forEach(e=>{r.has(e.stageSlug)||r.set(e.stageSlug,e.stage)});let i=[...r.entries()].sort((e,t)=>{let n=p.indexOf(e[0]),r=p.indexOf(t[0]);return n===-1&&r===-1?e[1].localeCompare(t[1]):n===-1?1:r===-1?-1:n-r}),a=Math.min(...t.map(e=>e.timeTs)),o=Math.max(...t.map(e=>e.timeTs+e.duration*6e4)),s=Math.floor(a/A)*A,c=Math.ceil(o/A)*A,l=(c-s)/6e4*D+24,d=[],f=[];for(let e=s;e<=c;e+=A){let t=12+(e-s)/6e4*D,n=new Date(e+2*36e5),r=`${String(n.getUTCHours()).padStart(2,`0`)}:00`;d.push(`<div class="sg-tick" style="top:${t}px">${r}</div>`),f.push(`<div class="sg-hline" style="top:${t}px"></div>`)}let _=i.map(([,e])=>`<div class="sg-col-header" style="width:${k}px">${h(e)}</div>`).join(``),v=i.map(([e])=>`<div class="sg-col" style="width:${k}px">${t.filter(t=>t.stageSlug===e).map(e=>{let t=u(n,e.id),r=t.priority??``,i=12+(e.timeTs-s)/6e4*D,a=Math.max(e.duration*D,28),o=g(e.time,e.duration),c=r===`must`?`🔥 `:r===`want`?`⭐ `:r===`maybe`?`🤔 `:``,l=(t.tags??[]).join(` · `);return`<div class="sg-block${r?` sg-${r}`:``}"
          style="top:${i}px;height:${a}px"
          data-action="open-modal" data-id="${e.id}">
          <div class="sg-block-name">${c}${h(e.name)}</div>
          <div class="sg-block-time">${e.time}–${o}</div>
          ${l?`<div class="sg-block-tags">${h(l)}</div>`:``}
        </div>`}).join(``)}</div>`).join(``),y=i.length*121+O;return`<div class="sg-outer">
    <div class="sg-header-sticky">
      <div class="sg-header-row" style="padding-left:${O}px;min-width:${y}px">${_}</div>
    </div>
    <div class="sg-scroll">
      <div style="min-width:${y}px">
        <div class="sg-body" style="height:${l}px">
          <div class="sg-ruler">${d.join(``)}</div>
          <div class="sg-cols-area">
            <div class="sg-hlines">${f.join(``)}</div>
            ${v}
          </div>
        </div>
      </div>
    </div>
  </div>`}function F(e,t){let n=u(t,e.id),r=n.priority??``,i=g(e.time,e.duration),a=m[e.day],{genres:o,videos:s}=b(e.id),c=o.map(e=>`<span class="genre-chip">${h(e)}</span>`).join(``),l=(n.tags??[]).map(t=>`<span class="user-tag">${h(t)}<button class="tag-remove" data-action="remove-tag" data-id="${e.id}" data-tag="${h(t)}" aria-label="Remove">×</button></span>`).join(``),d=[`must`,`want`,`maybe`,`skip`].map(t=>`<button class="prio-btn${r===t?` active-${t}`:``}"
      data-action="modal-set-priority" data-id="${e.id}" data-value="${t}">
      ${{must:`🔥 Must`,want:`⭐ Want`,maybe:`🤔 Maybe`,skip:`👋 Skip`}[t]}
    </button>`).join(``),f=e.image?`<img class="modal-img" src="${e.image}" alt="" onerror="this.style.display='none'">`:``,p=s.map(e=>`
    <a class="video-thumb" href="https://www.youtube.com/watch?v=${e.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-thumb-img" style="background-image:url(https://img.youtube.com/vi/${e.id}/mqdefault.jpg)">
        <div class="video-play-btn">▶</div>
      </div>
      <div class="video-thumb-title">${h(e.title)}</div>
    </a>
  `).join(``);return`<div class="modal-overlay" id="modal-overlay">
    <div class="modal" id="modal-box">
      <button class="modal-close" data-action="close-modal" aria-label="Close">×</button>

      <div class="modal-header">
        ${f}
        <div class="modal-info">
          <div class="modal-name">${h(e.name)}</div>
          <div class="modal-meta">
            <div style="color:${a.color}">${a.emoji} ${a.full}</div>
            <div>${h(e.stage)}</div>
            <div><strong>${e.time}–${i}</strong> · ${e.duration} min</div>
          </div>
          <div class="modal-genres">${c}</div>
        </div>
      </div>

      <div class="priority-btns modal-priority-btns">${d}</div>

      <div class="modal-tags-section">
        <div class="modal-tags" id="modal-tags-${e.id}">
          ${l}
          <input class="modal-tag-input" type="text" placeholder="+ tag" data-id="${e.id}" maxlength="32">
        </div>
      </div>

      <div class="modal-links">
        <a class="modal-link" href="https://www.primaverasound.com/en/artist/${e.id}?e=primavera-sound-2026-barcelona" target="_blank" rel="noopener noreferrer">
          Primavera Sound
        </a>
        <a class="modal-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.name)}" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
      </div>

      <div class="video-grid">${p}</div>
    </div>
  </div>`}function I(e){return f.filter(t=>e.some(e=>e.day===t)).map(e=>`<div class="chip day-${e}" data-filter="day" data-val="${e}">${m[e].label}</div>`).join(``)}function L(e){let t=new Set,n=[];return e.forEach(e=>{t.has(e.stageSlug)||(t.add(e.stageSlug),n.push({slug:e.stageSlug,name:e.stage}))}),n.sort((e,t)=>{let n=p.indexOf(e.slug),r=p.indexOf(t.slug);return n===-1&&r===-1?e.name.localeCompare(t.name):n===-1?1:r===-1?-1:n-r}),n.map(({slug:e,name:t})=>`<div class="chip" data-filter="stage" data-val="${e}">${h(t)}</div>`).join(``)}var R=[],z=c(),B=`lineup`,V=`stage`,H={day:`all`,prio:[],stage:[]},U=document.getElementById(`lineup-view`),W=document.getElementById(`schedule-view`),G=document.getElementById(`lineup-grid`),K=document.getElementById(`schedule-content`),q=document.getElementById(`modal-container`);function J(){if(B===`lineup`){let e=d(R,z,H);G.innerHTML=V===`stage`?M(e,z):C(e,z)}else{let e=d(R,z,H);K.innerHTML=V===`stage`?N(e,z):T(e,z)}}document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-tab]`);t&&(B=t.dataset.tab,document.querySelectorAll(`.tab`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),U.style.display=B===`lineup`?``:`none`,W.style.display=B===`schedule`?`block`:`none`,J())}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-view]`);t&&(V=t.dataset.view,document.querySelectorAll(`[data-view]`).forEach(e=>e.classList.remove(`active`)),document.querySelectorAll(`[data-view="${V}"]`).forEach(e=>e.classList.add(`active`)),J())}),document.getElementById(`filters-bar`).addEventListener(`click`,e=>{let t=e.target.closest(`.filter-group-btn`);t&&t.closest(`.filter-group`)?.classList.toggle(`open`)}),document.getElementById(`filters-bar`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-filter]`);if(!t)return;let n=t.dataset.filter,r=t.dataset.val;if(n===`day`)document.querySelectorAll(`[data-filter="day"]`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),H.day=r;else if(r===`all`)document.querySelectorAll(`[data-filter="${n}"]`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),n===`prio`&&(H.prio=[]),n===`stage`&&(H.stage=[]);else{document.querySelector(`[data-filter="${n}"][data-val="all"]`)?.classList.remove(`active`),t.classList.toggle(`active`);let e=[...document.querySelectorAll(`[data-filter="${n}"].active`)].map(e=>e.dataset.val);n===`prio`&&(H.prio=e),n===`stage`&&(H.stage=e),e.length===0&&document.querySelector(`[data-filter="${n}"][data-val="all"]`)?.classList.add(`active`)}J()}),document.addEventListener(`scroll`,e=>{let t=e.target;if(!t.classList?.contains(`sg-scroll`))return;let n=t.closest(`.sg-outer`)?.querySelector(`.sg-header-row`);n&&(n.style.transform=`translateX(-${t.scrollLeft}px)`)},{passive:!0,capture:!0}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="open-modal"]`);if(!t)return;let n=R.find(e=>e.id===t.dataset.id);n&&(q.innerHTML=F(n,z),document.body.style.overflow=`hidden`)}),document.addEventListener(`click`,e=>{let t=e.target;(t.id===`modal-overlay`||t.closest(`[data-action="close-modal"]`))&&Y()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Y()});function Y(){q.innerHTML=``,document.body.style.overflow=``}document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="modal-set-priority"]`);if(!t)return;let{id:n,value:r}=t.dataset,i=u(z,n);i.priority=i.priority===r?null:r,l(z),$(n,i.priority),document.querySelectorAll(`[data-action="modal-set-priority"]`).forEach(e=>{e.className=e.className.replace(/active-\w+/g,``).trim(),i.priority&&e.dataset.value===i.priority&&e.classList.add(`active-${i.priority}`)})});function X(e){let t=e.dataset.id,n=e.value.trim();if(!n)return;let r=u(z,t);if(r.tags||=[],r.tags.includes(n)){e.value=``;return}r.tags.push(n),l(z),e.value=``,Z(t,r.tags),Q(t,r.tags)}document.addEventListener(`keydown`,e=>{if(e.key!==`Enter`)return;let t=e.target.closest(`.modal-tag-input`);t&&X(t)}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="remove-tag"]`);if(!t)return;let{id:n,tag:r}=t.dataset,i=u(z,n);i.tags=(i.tags??[]).filter(e=>e!==r),l(z),Z(n,i.tags),Q(n,i.tags)});function Z(e,t){let n=document.getElementById(`modal-tags-${e}`);if(!n)return;let r=n.querySelector(`.modal-tag-input`)?.value??``;n.innerHTML=t.map(t=>`<span class="user-tag">${h(t)}<button class="tag-remove" data-action="remove-tag" data-id="${e}" data-tag="${t}" aria-label="Remove">×</button></span>`).join(``)+`<input class="modal-tag-input" type="text" placeholder="+ tag" data-id="${e}" maxlength="32" value="${h(r)}">`,n.querySelector(`.modal-tag-input`)?.focus()}function Q(e,t){document.querySelectorAll(`.sg-block[data-id="${e}"]`).forEach(e=>{let n=e.querySelector(`.sg-block-tags`);if(t.length===0){n?.remove();return}n||(n=document.createElement(`div`),n.className=`sg-block-tags`,e.appendChild(n)),n.textContent=t.join(` · `)})}function $(e,t){let n=document.getElementById(`card-${e}`);if(n){n.className=n.className.replace(/priority-\w+/g,``).trim(),t&&n.classList.add(`priority-${t}`);let e=n.querySelector(`.card-prio-icon`);e&&(e.textContent=t?{must:`🔥`,want:`⭐`,maybe:`🤔`,skip:`👋`}[t]??``:``)}document.querySelectorAll(`.sg-block[data-id="${e}"]`).forEach(n=>{n.className=`sg-block${t?` sg-${t}`:``}`;let r=n.querySelector(`.sg-block-name`);if(r){let n={must:`🔥 `,want:`⭐ `,maybe:`🤔 `},i=R.find(t=>t.id===e)?.name??``;r.textContent=(t&&n[t]?n[t]:``)+i}}),document.querySelectorAll(`.schedule-item[data-id="${e}"]`).forEach(e=>{e.className=e.className.replace(/\b(must|want|maybe|skip)\b/g,``).trim(),t&&e.classList.add(t)})}function ee(){let e={wed:3,thu:4,fri:5,sat:6,sun:7},t=new Date(Date.now()+2*36e5),n=t.getUTCMonth()===5?t.getUTCDate():t.getUTCMonth()<5?0:99,r=[`wed`,`thu`,`fri`,`sat`,`sun`].filter(e=>R.some(t=>t.day===e));return r.find(t=>e[t]>=n)??r[r.length-1]??`thu`}Promise.all([o(),v()]).then(([e])=>{R=e,document.querySelector(`#day-filters .filter-chips`).insertAdjacentHTML(`beforeend`,I(R)),document.querySelector(`#stage-filter-wrap .filter-chips`).insertAdjacentHTML(`beforeend`,L(R));let t=ee();H.day=t,document.querySelector(`[data-filter="day"][data-val="${t}"]`)?.classList.add(`active`),J()}).catch(e=>{G.innerHTML=`<div class="empty-state">
      <div class="big">⚠️</div>
      <div>Could not load lineup.json</div>
      <div style="margin-top:8px;font-size:0.8rem;color:#999">${h(e.message)}</div>
    </div>`});