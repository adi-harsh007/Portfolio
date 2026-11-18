/**
 * Slide-In Project Detail Drawer & Live Interactive Sandboxes
 */

import { state } from '../core/state.js';
import { PROJECT_DETAILS, DERMASCOPE_SAMPLES, THERMOPACK_RECORDS, SKILLS_INVENTORY } from '../config/data.js';
import { gameAudio } from '../core/gameAudio.js';

export function openDetailPanel(projectKey, sourceObject) {
  state.detailPanel.open = true;
  state.detailPanel.projectKey = projectKey;
  state.detailPanel.sourceObject = sourceObject;

  const drawer = document.getElementById('detailDrawer');
  const drawerBody = document.getElementById('drawerBody');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerSubtitle = document.getElementById('drawerSubtitle');

  if (drawer) {
    drawer.classList.remove('translate-x-full');
  }

  gameAudio.playKotoNote(7);

  // If this is a scroll rather than a full project shrine:
  if (projectKey === 'scroll' && sourceObject) {
    if (drawerTitle) drawerTitle.textContent = sourceObject.title;
    if (drawerSubtitle) drawerSubtitle.textContent = sourceObject.subtitle || 'ANCIENT SCROLL OF KNOWLEDGE';
    if (drawerBody) {
      drawerBody.innerHTML = `
        <div class="space-y-4">
          <div class="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-100 font-serif leading-relaxed text-sm sm:text-base">
            <div class="text-xs font-mono text-amber-400 mb-2 font-bold tracking-widest uppercase">📜 ${sourceObject.tag || 'LORE'}</div>
            <p>${sourceObject.summary}</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
            <div>📍 Location: ${sourceObject.title}</div>
            <div>⚔️ Realm: ${state.currentRealmIndex + 1} of 5</div>
            <div class="text-emerald-400">✓ Inscribed into portfolio memory</div>
          </div>
        </div>
      `;
    }
    return;
  }

  const proj = PROJECT_DETAILS[projectKey] || PROJECT_DETAILS.dermascope;
  if (drawerTitle) drawerTitle.textContent = proj.title;
  if (drawerSubtitle) drawerSubtitle.textContent = proj.category;

  if (drawerBody) {
    renderProjectDrawerContent(drawerBody, projectKey, proj);
  }
}

export function closeDetailPanel() {
  state.detailPanel.open = false;
  state.detailPanel.projectKey = null;
  state.detailPanel.sourceObject = null;

  const drawer = document.getElementById('detailDrawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
  }
}

function renderProjectDrawerContent(container, projectKey, proj) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- 1. Metrics Strip -->
      <div class="grid grid-cols-2 gap-2.5">
        ${proj.metrics.map(m => `
          <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow">
            <div class="text-[10px] font-mono uppercase text-slate-400 tracking-wider">${m.label}</div>
            <div class="text-lg font-extrabold text-amber-300 mt-0.5">${m.val}</div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">${m.desc}</div>
          </div>
        `).join('')}
      </div>

      <!-- 2. Source Code & Live Links -->
      <div class="flex flex-wrap items-center gap-2.5">
        ${proj.repoUrl ? `
          <a href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 shadow">
            <span>GitHub Repository ↗</span>
          </a>
        ` : ''}
        ${proj.liveUrl ? `
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-1.5 shadow">
            <span>Live Production Demo ↗</span>
          </a>
        ` : ''}
      </div>

      <!-- 3. Key Architectural Proof Points -->
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Engineering Architecture & Grounded Proof</h4>
        <ul class="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
          ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>

      <!-- 4. Interactive Live Sandbox Simulator -->
      <div class="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-xs font-mono font-bold text-amber-300">⚡ LIVE INTERACTIVE SANDBOX SIMULATOR</span>
          <span class="text-[10px] font-mono text-emerald-400 animate-pulse">● RUNNING IN BROWSER</span>
        </div>

        <div id="sandboxContainer">
          <!-- Populated by specific sandbox renderer -->
        </div>
      </div>

      <!-- 5. Tech Stack Tags -->
      <div class="space-y-2">
        <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Technologies Used</div>
        <div class="flex flex-wrap gap-1.5">
          ${proj.stack.map(tag => `
            <span class="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Mount specific interactive sandbox
  const sandbox = container.querySelector('#sandboxContainer');
  if (sandbox) {
    if (projectKey === 'dermascope') {
      mountDermaScopeSandbox(sandbox);
    } else if (projectKey === 'eventify') {
      mountEventifySandbox(sandbox);
    } else if (projectKey === 'medistore') {
      mountMediStoreSandbox(sandbox);
    } else if (projectKey === 'skills') {
      mountSkillsAndFoundrySandbox(sandbox);
    }
  }
}

// ----------------------------------------------------------------------
// SANDBOX 1: DermaScope Triage Grad-CAM & OOD Lesion Scanner
// ----------------------------------------------------------------------
function mountDermaScopeSandbox(container) {
  const sample = DERMASCOPE_SAMPLES[state.derma.sampleIndex];

  container.innerHTML = `
    <div class="space-y-3">
      <div>
        <label for="sbDermaSample" class="block text-[11px] font-mono text-slate-400 mb-1">Select Diagnostic Case:</label>
        <select id="sbDermaSample" class="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-white font-mono">
          ${DERMASCOPE_SAMPLES.map((s, idx) => `<option value="${idx}" ${idx === state.derma.sampleIndex ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>

      <!-- Mode Switcher -->
      <div class="grid grid-cols-3 gap-1.5">
        <button id="btnDermaRaw" type="button" class="py-1 px-2 rounded-lg text-xs font-mono font-semibold border ${state.derma.viewMode === 'raw' ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-slate-900 text-slate-300 border-slate-700'}">1. Raw Scan</button>
        <button id="btnDermaOod" type="button" class="py-1 px-2 rounded-lg text-xs font-mono font-semibold border ${state.derma.viewMode === 'ood' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-slate-900 text-slate-300 border-slate-700'}">2. OOD Gate</button>
        <button id="btnDermaGrad" type="button" class="py-1 px-2 rounded-lg text-xs font-mono font-semibold border ${state.derma.viewMode === 'gradcam' ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-slate-300 border-slate-700'}">3. Grad-CAM</button>
      </div>

      <!-- Canvas Scanner -->
      <div class="flex items-center justify-center bg-slate-900 rounded-xl p-3 border border-slate-800">
        <canvas id="sbDermaCanvas" width="280" height="160" class="rounded-lg shadow"></canvas>
      </div>

      <!-- Opacity Slider -->
      <div class="space-y-1">
        <div class="flex justify-between text-[11px] font-mono">
          <span class="text-slate-400">Grad-CAM Overlay Intensity:</span>
          <span id="sbDermaOpacityVal" class="text-amber-300">${state.derma.heatmapOpacity}%</span>
        </div>
        <input id="sbDermaSlider" type="range" min="0" max="100" value="${state.derma.heatmapOpacity}" class="w-full accent-amber-400 cursor-pointer" />
      </div>

      <!-- Telemetry Readout -->
      <div class="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
        <div class="flex justify-between">
          <span class="text-slate-400">Two-Stage OOD Gate:</span>
          <span class="${sample.mahalanobisDist > 3.5 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}">${sample.oodGateStatus}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Mahalanobis Distance:</span>
          <span class="text-white">${sample.mahalanobisDist.toFixed(2)} (Threshold: 3.50)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Prediction:</span>
          <span class="text-amber-300 font-bold">${sample.predictedClass}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Confidence:</span>
          <span class="text-emerald-400 font-bold">${(sample.confidence * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  `;

  drawDermaScopeCanvas();

  container.querySelector('#sbDermaSample')?.addEventListener('change', (e) => {
    state.derma.sampleIndex = parseInt(e.target.value, 10);
    mountDermaScopeSandbox(container);
  });

  container.querySelector('#btnDermaRaw')?.addEventListener('click', () => {
    state.derma.viewMode = 'raw';
    mountDermaScopeSandbox(container);
  });
  container.querySelector('#btnDermaOod')?.addEventListener('click', () => {
    state.derma.viewMode = 'ood';
    mountDermaScopeSandbox(container);
  });
  container.querySelector('#btnDermaGrad')?.addEventListener('click', () => {
    state.derma.viewMode = 'gradcam';
    mountDermaScopeSandbox(container);
  });

  const slider = container.querySelector('#sbDermaSlider');
  slider?.addEventListener('input', (e) => {
    state.derma.heatmapOpacity = parseInt(e.target.value, 10);
    const label = container.querySelector('#sbDermaOpacityVal');
    if (label) label.textContent = state.derma.heatmapOpacity + '%';
    drawDermaScopeCanvas();
  });
}

function drawDermaScopeCanvas() {
  const canvas = document.getElementById('sbDermaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const sample = DERMASCOPE_SAMPLES[state.derma.sampleIndex];
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Simulated Skin Tone Base
  ctx.fillStyle = '#fce7f3';
  ctx.fillRect(10, 10, W - 20, H - 20);

  // Lesion Blob Shape
  ctx.fillStyle = sample.lesionColor;
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, 54, 38, sample.asymmetry, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = sample.borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // If Mode === 'ood'
  if (state.derma.viewMode === 'ood') {
    ctx.fillStyle = sample.mahalanobisDist > 3.5 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.35)';
    ctx.fillRect(10, 10, W - 20, H - 20);

    ctx.strokeStyle = sample.mahalanobisDist > 3.5 ? '#f43f5e' : '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 65, H / 2 - 50, 130, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sample.mahalanobisDist > 3.5 ? '⚠️ OOD GATE: REJECTED' : '✓ OOD GATE: IN-DISTRIBUTION', W / 2, H / 2);
    return;
  }

  // If Mode === 'gradcam'
  if (state.derma.viewMode === 'gradcam') {
    const alpha = state.derma.heatmapOpacity / 100;
    // Layer 1 Red Heat Ring
    const grad = ctx.createRadialGradient(W / 2, H / 2, 8, W / 2, H / 2, 60);
    grad.addColorStop(0, `rgba(239, 68, 68, ${0.9 * alpha})`);
    grad.addColorStop(0.5, `rgba(245, 158, 11, ${0.7 * alpha})`);
    grad.addColorStop(0.85, `rgba(56, 189, 248, ${0.4 * alpha})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(10, 10, W - 20, H - 20);
  }
}

// ----------------------------------------------------------------------
// SANDBOX 2: Eventify Pro Concurrency & Row Locking Simulator
// ----------------------------------------------------------------------
function mountEventifySandbox(container) {
  container.innerHTML = `
    <div class="space-y-3 font-mono text-xs">
      <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
        <span class="text-slate-300">SELECT ... FOR UPDATE Row Lock:</span>
        <button id="btnToggleRowLock" type="button" class="px-2.5 py-1 rounded text-xs font-bold ${state.eventify.rowLockEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-slate-950'}">
          ${state.eventify.rowLockEnabled ? 'ENABLED (Safe)' : 'DISABLED (Race)'}
        </button>
      </div>

      <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
        <span class="text-slate-300">Redis Cache Accelerator:</span>
        <button id="btnToggleRedis" type="button" class="px-2.5 py-1 rounded text-xs font-bold ${state.eventify.redisEnabled ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'}">
          ${state.eventify.redisEnabled ? 'REDIS (11ms)' : 'POSTGRES (142ms)'}
        </button>
      </div>

      <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
        <span class="text-slate-400">Remaining VIP Hackathon Seats:</span>
        <span id="sbSeatsVal" class="text-base font-bold ${state.eventify.seatsRemaining < 0 ? 'text-rose-400' : 'text-emerald-400'}">${state.eventify.seatsRemaining} Seats</span>
      </div>

      <button id="btnRunBurst" type="button" class="w-full py-2.5 rounded-xl font-bold bg-violet-500 hover:bg-violet-400 text-slate-950 transition shadow">
        ⚡ Fire 50 Concurrent Registration Requests
      </button>

      <!-- Terminal Output -->
      <div id="sbEventifyLog" class="p-3 rounded-lg bg-black text-[11px] h-32 overflow-y-auto space-y-1 text-slate-300 border border-slate-800 font-mono">
        ${state.eventify.simLogs.map(l => `<div>${l}</div>`).join('')}
      </div>
    </div>
  `;

  container.querySelector('#btnToggleRowLock')?.addEventListener('click', () => {
    state.eventify.rowLockEnabled = !state.eventify.rowLockEnabled;
    mountEventifySandbox(container);
  });

  container.querySelector('#btnToggleRedis')?.addEventListener('click', () => {
    state.eventify.redisEnabled = !state.eventify.redisEnabled;
    mountEventifySandbox(container);
  });

  container.querySelector('#btnRunBurst')?.addEventListener('click', () => {
    runConcurrencyBurst(container);
  });
}

function runConcurrencyBurst(container) {
  const logEl = container.querySelector('#sbEventifyLog');
  const seatsEl = container.querySelector('#sbSeatsVal');
  const lock = state.eventify.rowLockEnabled;
  const redis = state.eventify.redisEnabled;
  const latency = redis ? 11 : 142;

  let newSeats = state.eventify.seatsRemaining;
  let logMsg = '';

  if (lock) {
    // Safe row lock prevents negative capacity
    if (newSeats > 0) {
      newSeats = 0;
      logMsg = `[200 OK] 50 requests serialized via SELECT ... FOR UPDATE. 3 seats booked atomically. 47 rejected with HTTP 409 (Capacity Full). Latency: ${latency}ms.`;
    } else {
      logMsg = `[409 CONFLICT] All seats taken. Row lock protected database state. Zero overbooking. Latency: ${latency}ms.`;
    }
  } else {
    // Race condition simulates overbooking
    newSeats -= 12; // Overbooked into negative!
    logMsg = `[CRITICAL ANOMALY] Race condition! Unlocked concurrency booked 15 seats when only 3 existed! Seats remaining: ${newSeats}. OVERBOOKING DETECTED.`;
  }

  state.eventify.seatsRemaining = newSeats;
  state.eventify.simLogs.unshift(logMsg);

  if (seatsEl) {
    seatsEl.textContent = `${newSeats} Seats`;
    seatsEl.className = `text-base font-bold ${newSeats < 0 ? 'text-rose-400' : 'text-emerald-400'}`;
  }

  if (logEl) {
    logEl.innerHTML = state.eventify.simLogs.map(l => `<div>${l}</div>`).join('');
  }
}

// ----------------------------------------------------------------------
// SANDBOX 3: MediStore HMAC-SHA256 & Docker Stack Simulator
// ----------------------------------------------------------------------
function mountMediStoreSandbox(container) {
  container.innerHTML = `
    <div class="space-y-3 font-mono text-xs">
      <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
        <span class="text-slate-300">Simulate Webhook Tamper Attack:</span>
        <button id="btnToggleTamper" type="button" class="px-2.5 py-1 rounded text-xs font-bold ${state.medistore.tamperAttack ? 'bg-rose-500 text-slate-950' : 'bg-slate-700 text-slate-300'}">
          ${state.medistore.tamperAttack ? 'TAMPERED PAYLOAD ($1.00)' : 'LEGITIMATE PAYLOAD ($140.00)'}
        </button>
      </div>

      <!-- 4-Stage Verification Pipeline -->
      <div class="space-y-2">
        <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span class="text-slate-400">1. Client Checkout:</span>
          <span class="text-white">Rx Cart Verified</span>
        </div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span class="text-slate-400">2. Server Price Check:</span>
          <span class="text-emerald-400">Server Recalculation Enforced</span>
        </div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span class="text-slate-400">3. HMAC-SHA256 Check:</span>
          <span class="${state.medistore.tamperAttack ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}">
            ${state.medistore.tamperAttack ? 'SIGNATURE MISMATCH (BLOCKED)' : 'VALID SIGNATURE (ACCEPTED)'}
          </span>
        </div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span class="text-slate-400">4. Docker Compose Stack:</span>
          <span class="text-cyan-400">React + Express 5 + PG16 Healthy</span>
        </div>
      </div>

      <div class="p-2.5 rounded-lg ${state.medistore.tamperAttack ? 'bg-rose-950/40 border border-rose-500/50 text-rose-200' : 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-200'}">
        ${state.medistore.tamperAttack
          ? '🛡️ ATTACK DEFENDED: HMAC cryptographic hash computed with server secret did not match incoming webhook body. Order fulfillment aborted.'
          : '✓ VERIFIED: Webhook payload authenticated via crypto.createHmac("sha256", secret). Order placed safely.'}
      </div>
    </div>
  `;

  container.querySelector('#btnToggleTamper')?.addEventListener('click', () => {
    state.medistore.tamperAttack = !state.medistore.tamperAttack;
    mountMediStoreSandbox(container);
  });
}

// ----------------------------------------------------------------------
// SANDBOX 4: Skills Matrix & A.M. Thermopack 3NF Relational Console
// ----------------------------------------------------------------------
function mountSkillsAndFoundrySandbox(container) {
  container.innerHTML = `
    <div class="space-y-4 font-mono text-xs">
      <!-- Thermopack 3NF MySQL Live Search -->
      <div class="space-y-2">
        <div class="text-[11px] text-amber-300 font-bold uppercase">A.M. Thermopack Relational Schema (500+ Records)</div>
        <input id="sbSqlSearch" type="text" placeholder="Search customer, product or city..." class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white" />
        <div id="sbSqlResults" class="space-y-1.5 max-h-36 overflow-y-auto">
          ${THERMOPACK_RECORDS.map(r => `
            <div class="p-2 rounded bg-slate-900/90 border border-slate-800 flex justify-between items-center text-[11px]">
              <div>
                <span class="text-white font-bold">${r.customer}</span>
                <span class="text-slate-400">(${r.city}) — ${r.product}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] ${r.paymentStatus === 'CLEARED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${r.paymentStatus}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Skills Arsenal -->
      <div class="border-t border-slate-800 pt-3 space-y-2">
        <div class="text-[11px] text-cyan-300 font-bold uppercase">Equippable Weapon Arsenal (24 Core Skills)</div>
        <div class="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
          ${SKILLS_INVENTORY.slice(0, 10).map(s => `
            <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
              <span class="text-white font-bold">${s.name}</span>
              <span class="text-[10px] text-slate-400 block">${s.tier}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#sbSqlSearch');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = THERMOPACK_RECORDS.filter(r => 
      r.customer.toLowerCase().includes(q) || 
      r.city.toLowerCase().includes(q) || 
      r.product.toLowerCase().includes(q)
    );
    const resEl = container.querySelector('#sbSqlResults');
    if (resEl) {
      resEl.innerHTML = filtered.map(r => `
        <div class="p-2 rounded bg-slate-900/90 border border-slate-800 flex justify-between items-center text-[11px]">
          <div>
            <span class="text-white font-bold">${r.customer}</span>
            <span class="text-slate-400">(${r.city}) — ${r.product}</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] ${r.paymentStatus === 'CLEARED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${r.paymentStatus}</span>
        </div>
      `).join('');
    }
  });
}

