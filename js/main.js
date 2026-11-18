/**
 * Application Entry Point & Input Orchestrator for "Path of the Ronin"
 */

import { state } from './core/state.js';
import { initEngine, resizeGameCanvas, updateEngine, drawEngine } from './game/engine.js';
import { initHUD, handleInteraction } from './ui/gameHud.js';
import { initPauseMenu, openPauseMenu, closePauseMenu, stopGuidedJourney } from './ui/pauseMenu.js';
import { closeDetailPanel } from './ui/detailPanel.js';

let rafId = null;

function gameLoop() {
  updateEngine();
  drawEngine();
  rafId = window.requestAnimationFrame(gameLoop);
}

function initInputListeners() {
  // 1. Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // If typing inside an input field, do not capture movement keys
    const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      if (e.key === 'Escape') {
        if (state.detailPanel.open) closeDetailPanel();
        else if (state.pauseMenuOpen) closePauseMenu();
      }
      return;
    }

    // Cancel Guided Journey autopilot on manual user input
    if (state.guidedJourney.active) {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'w', ' '].includes(e.key)) {
        stopGuidedJourney();
      }
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      state.keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      state.keys.right = true;
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      state.keys.up = true;
    } else if (e.key === 'Shift') {
      state.keys.sprint = true;
    } else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
      handleInteraction();
    } else if (e.key === 'Escape') {
      if (state.detailPanel.open) {
        closeDetailPanel();
      } else if (state.pauseMenuOpen) {
        closePauseMenu();
      } else {
        openPauseMenu();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      state.keys.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      state.keys.right = false;
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      state.keys.up = false;
    } else if (e.key === 'Shift') {
      state.keys.sprint = false;
    }
  });

  // 2. Detail Drawer Close Buttons
  document.getElementById('btnCloseDrawer')?.addEventListener('click', closeDetailPanel);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeDetailPanel);

  // 3. Mobile Touch Navigation Controls
  const btnTouchLeft = document.getElementById('touchMoveLeft');
  const btnTouchRight = document.getElementById('touchMoveRight');
  const btnTouchJump = document.getElementById('touchJump');

  if (btnTouchLeft && btnTouchRight) {
    ['mousedown', 'touchstart'].forEach(evt => {
      btnTouchLeft.addEventListener(evt, (e) => { e.preventDefault(); state.keys.left = true; });
      btnTouchRight.addEventListener(evt, (e) => { e.preventDefault(); state.keys.right = true; });
      btnTouchJump?.addEventListener(evt, (e) => { e.preventDefault(); state.keys.up = true; });
    });

    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
      btnTouchLeft.addEventListener(evt, () => { state.keys.left = false; });
      btnTouchRight.addEventListener(evt, () => { state.keys.right = false; });
      btnTouchJump?.addEventListener(evt, () => { state.keys.up = false; });
    });
  }

  // Window Resize
  window.addEventListener('resize', resizeGameCanvas);
}

function init() {
  initEngine();
  initHUD();
  initPauseMenu();
  initInputListeners();

  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = window.requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
