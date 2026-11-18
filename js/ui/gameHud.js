/**
 * Minimalist Floating HUD & Audio/Pause Orchestrator
 */

import { state } from '../core/state.js';
import { REALMS } from '../config/data.js';
import { gameAudio } from '../core/gameAudio.js';
import { openPauseMenu } from './pauseMenu.js';
import { openDetailPanel } from './detailPanel.js';
import { startRealmTransition } from '../game/transitions.js';

export function initHUD() {
  const btnToggleSound = document.getElementById('btnToggleSound');
  const btnOpenMenu = document.getElementById('btnOpenMenu');
  const btnContextAction = document.getElementById('btnContextAction');

  btnToggleSound?.addEventListener('click', () => {
    const enabled = gameAudio.toggleAudio();
    const icon = document.getElementById('soundIcon');
    if (icon) icon.textContent = enabled ? '🔊' : '🔇';
  });

  btnOpenMenu?.addEventListener('click', () => {
    openPauseMenu();
  });

  btnContextAction?.addEventListener('click', () => {
    handleInteraction();
  });

  updateHudRealmTitle();
}

export function handleInteraction() {
  if (state.detailPanel.open || state.pauseMenuOpen) return;
  const obj = state.activeObject;
  if (!obj) return;

  // Trigger respectful samurai bow
  state.player.bowTimer = 35;
  gameAudio.playKotoNote(6);

  if (obj.targetRealm !== undefined) {
    // Exit Torii Gate: transition to target realm!
    startRealmTransition(obj.targetRealm);
  } else if (obj.type === 'scroll') {
    // Open scroll modal in detail drawer
    openDetailPanel(obj.projectKey || 'scroll', obj);
  } else if (obj.type === 'shrine') {
    // Open project detail drawer & live sandbox
    openDetailPanel(obj.projectKey || 'skills', obj);
  }
}

export function updateHudRealmTitle() {
  const realm = REALMS[state.currentRealmIndex] || REALMS[0];
  const badgeEl = document.getElementById('hudRealmBadge');
  const kanjiEl = document.getElementById('hudRealmKanji');
  const titleEl = document.getElementById('hudRealmTitle');

  if (badgeEl) badgeEl.textContent = `REALM ${realm.index + 1} OF 5`;
  if (kanjiEl) kanjiEl.textContent = realm.kanji;
  if (titleEl) titleEl.textContent = realm.title;
}

export function updateLeafCounter() {
  const counterEl = document.getElementById('hudLeafCount');
  if (counterEl) {
    counterEl.textContent = `${state.collectedLeaves.length}/10`;
  }
}

