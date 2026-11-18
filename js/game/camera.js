/**
 * Smooth 2D Tracking Camera with Realm Clamping & Screen Shake
 */

import { state } from '../core/state.js';
import { REALMS } from '../config/data.js';

export function updateCamera(canvasWidth, canvasHeight) {
  const currentRealm = REALMS[state.currentRealmIndex] || REALMS[0];
  const worldW = currentRealm.width;

  // Center camera horizontally on the player with subtle lead in facing direction
  const leadOffset = state.player.facing * 80;
  const desiredCamX = state.player.x - canvasWidth * 0.42 + leadOffset;

  // Clamp within realm world boundaries
  const maxCamX = Math.max(0, worldW - canvasWidth);
  const clampedCamX = Math.max(0, Math.min(maxCamX, desiredCamX));

  // Smooth lerp (0.12 factor)
  state.camera.x += (clampedCamX - state.camera.x) * 0.12;

  // Vertical camera follows large terrain altitude variations
  const desiredCamY = Math.min(0, (canvasHeight - 650) * 0.3);
  state.camera.y += (desiredCamY - state.camera.y) * 0.1;

  // Screen shake decay
  if (state.camera.shake > 0) {
    state.camera.shake *= 0.88;
    if (state.camera.shake < 0.2) state.camera.shake = 0;
  }
}

export function triggerScreenShake(intensity = 6) {
  state.camera.shake = intensity;
}

