/**
 * Cinematic Japanese Ink & Crimson Mist Realm Transition Engine
 */

import { state } from '../core/state.js';
import { REALMS } from '../config/data.js';
import { gameAudio } from '../core/gameAudio.js';
import { triggerScreenShake } from './camera.js';
import { getTerrainHeight } from './physics.js';
import { updateHudRealmTitle } from '../ui/gameHud.js';

export function startRealmTransition(targetRealmIndex) {
  if (state.transition.active) return;
  if (targetRealmIndex < 0 || targetRealmIndex >= REALMS.length) return;

  state.transition.active = true;
  state.transition.phase = 'out';
  state.transition.progress = 0;
  state.transition.targetRealm = targetRealmIndex;

  gameAudio.playTaikoBoom();
  gameAudio.playKatanaRing();
  triggerScreenShake(8);
}

export function updateTransition(canvasHeight) {
  if (!state.transition.active) return;

  const t = state.transition;
  const speed = 0.045; // ~22 frames per half-transition

  if (t.phase === 'out') {
    t.progress += speed;
    if (t.progress >= 1) {
      t.progress = 1;
      // Midpoint: switch realm
      state.currentRealmIndex = t.targetRealm;
      state.maxRealmReached = Math.max(state.maxRealmReached, t.targetRealm);

      // Reset player position at entrance of new realm
      state.player.x = 240;
      state.player.vx = 0;
      state.player.vy = 0;
      state.player.y = getTerrainHeight(t.targetRealm, 240, canvasHeight);
      state.player.isGrounded = true;

      // Update camera
      state.camera.x = 0;

      // Update HUD
      updateHudRealmTitle();

      t.phase = 'in';
      gameAudio.playKotoNote(4);
    }
  } else if (t.phase === 'in') {
    t.progress -= speed;
    if (t.progress <= 0) {
      t.progress = 0;
      t.phase = 'idle';
      t.active = false;
      t.targetRealm = null;
    }
  }
}

export function drawTransitionOverlay(ctx, canvasWidth, canvasHeight) {
  if (!state.transition.active) return;

  const p = state.transition.progress;
  ctx.save();

  // 1. Deep Crimson Ink Wash Wipe
  ctx.fillStyle = `rgba(18, 2, 5, ${p})`;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Swirling Japanese Crest & Kanji at Peak
  if (p > 0.4) {
    const realm = REALMS[state.transition.targetRealm ?? state.currentRealmIndex];
    const textAlpha = Math.min(1, (p - 0.4) * 2.5);

    ctx.textAlign = 'center';

    // Red Seal Stamp
    ctx.fillStyle = `rgba(220, 38, 38, ${textAlpha * 0.85})`;
    ctx.fillRect(canvasWidth / 2 - 24, canvasHeight / 2 - 80, 48, 48);
    ctx.fillStyle = `rgba(254, 243, 199, ${textAlpha})`;
    ctx.font = 'bold 22px serif';
    ctx.fillText('道', canvasWidth / 2, canvasHeight / 2 - 47);

    // Kanji Title
    ctx.font = 'bold 26px serif';
    ctx.fillStyle = `rgba(254, 243, 199, ${textAlpha})`;
    ctx.fillText(realm.kanji, canvasWidth / 2, canvasHeight / 2 - 10);

    // English Subtitle
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(245, 158, 11, ${textAlpha})`;
    ctx.fillText(realm.title.toUpperCase(), canvasWidth / 2, canvasHeight / 2 + 18);
  }

  ctx.restore();
}

