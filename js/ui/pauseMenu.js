/**
 * Samurai Scroll Pause Menu & Guided Journey Autopilot
 */

import { state } from '../core/state.js';
import { REALMS } from '../config/data.js';
import { gameAudio } from '../core/gameAudio.js';
import { startRealmTransition } from '../game/transitions.js';

export function initPauseMenu() {
  const menu = document.getElementById('pauseMenu');
  const btnClose = document.getElementById('btnClosePauseMenu');
  const btnResume = document.getElementById('btnResumeGame');
  const btnGuidedTour = document.getElementById('btnGuidedTour');

  btnClose?.addEventListener('click', closePauseMenu);
  btnResume?.addEventListener('click', closePauseMenu);

  btnGuidedTour?.addEventListener('click', () => {
    closePauseMenu();
    startGuidedJourney();
  });

  menu?.addEventListener('click', (e) => {
    if (e.target === menu) closePauseMenu();
  });
}

export function openPauseMenu() {
  state.pauseMenuOpen = true;
  gameAudio.playKotoNote(5);

  const menu = document.getElementById('pauseMenu');
  if (menu) menu.classList.remove('hidden');

  renderRealmFastTravelList();
}

export function closePauseMenu() {
  state.pauseMenuOpen = false;
  const menu = document.getElementById('pauseMenu');
  if (menu) menu.classList.add('hidden');
}

function renderRealmFastTravelList() {
  const container = document.getElementById('fastTravelList');
  if (!container) return;

  container.innerHTML = REALMS.map((r, idx) => {
    const isCurrent = idx === state.currentRealmIndex;
    return `
      <button type="button" data-realm-idx="${idx}" class="realm-select-btn w-full p-2.5 rounded-xl text-left font-mono text-xs transition flex items-center justify-between border ${
        isCurrent ? 'bg-amber-500/20 text-amber-200 border-amber-500/50' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
      }">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-400' : 'bg-slate-600'}"></span>
          <span class="font-bold">${idx + 1}. ${r.title}</span>
        </div>
        <span class="text-[11px] text-amber-300/70 font-serif">${r.kanji}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.realm-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-realm-idx'), 10);
      closePauseMenu();
      if (idx !== state.currentRealmIndex) {
        startRealmTransition(idx);
      }
    });
  });
}

// -------------------------------------------------------------
// Guided Journey: 90-Second Recruiter Autopilot
// -------------------------------------------------------------
export function startGuidedJourney() {
  state.guidedJourney.active = true;
  state.guidedJourney.step = 0;
  state.guidedJourney.timer = 0;

  gameAudio.playKatanaRing();
  if (state.currentRealmIndex !== 0) {
    startRealmTransition(0);
  }
}

export function stopGuidedJourney() {
  state.guidedJourney.active = false;
  state.guidedJourney.timer = 0;
}

export function updateGuidedJourney() {
  if (!state.guidedJourney.active) return;

  const currentRealm = REALMS[state.currentRealmIndex] || REALMS[0];
  const worldW = currentRealm.width;

  // Walk ronin smoothly towards the exit gate
  state.keys.right = true;
  state.keys.sprint = false;

  // Once approaching end of realm, auto-trigger transition to next realm
  if (state.player.x >= worldW - 450 && !state.transition.active) {
    const nextIdx = state.currentRealmIndex + 1;
    if (nextIdx < REALMS.length) {
      startRealmTransition(nextIdx);
    } else {
      // Reached summit end!
      stopGuidedJourney();
    }
  }
}

