/**
 * 2D Canvas Engine & 60 FPS Render Loop for "Path of the Ronin"
 */

import { state } from '../core/state.js';
import { updatePhysics } from './physics.js';
import { updateCamera } from './camera.js';
import { drawRoninAvatar } from './avatar.js';
import { drawRealmObjects } from './objects.js';
import { updateTransition, drawTransitionOverlay } from './transitions.js';
import { updateGuidedJourney } from '../ui/pauseMenu.js';
import { updateLeafCounter } from '../ui/gameHud.js';

// Realm Renderers
import { drawRealmMountain } from './realms/realmMountain.js';
import { drawRealmGarden } from './realms/realmGarden.js';
import { drawRealmFestival } from './realms/realmFestival.js';
import { drawRealmVault } from './realms/realmVault.js';
import { drawRealmSummit } from './realms/realmSummit.js';

let canvas = null;
let ctx = null;

export function initEngine() {
  canvas = document.getElementById('gameCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    resizeGameCanvas();
  }
}

export function resizeGameCanvas() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

export function updateEngine() {
  const h = window.innerHeight;
  const w = window.innerWidth;

  // 1. Guided Journey Autopilot
  updateGuidedJourney();

  // 2. Physics & Player Collision
  updatePhysics(h);

  // 3. Camera Smooth Lerp & Bounds
  updateCamera(w, h);

  // 4. Realm Transitions
  updateTransition(h);

  // 5. Update Ambient Leaf Counter in HUD
  updateLeafCounter();

  // 6. Particle Updates
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) state.particles.splice(i, 1);
  }
}

export function drawEngine() {
  if (!canvas || !ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Clear Screen
  ctx.clearRect(0, 0, w, h);

  // Screen Shake Transform
  ctx.save();
  if (state.camera.shake > 0) {
    const sx = (Math.random() - 0.5) * state.camera.shake;
    const sy = (Math.random() - 0.5) * state.camera.shake;
    ctx.translate(sx, sy);
  }

  // 1. Draw Active Realm Scenery
  const realmIdx = state.currentRealmIndex;
  if (realmIdx === 0) {
    drawRealmMountain(ctx, w, h);
  } else if (realmIdx === 1) {
    drawRealmGarden(ctx, w, h);
  } else if (realmIdx === 2) {
    drawRealmFestival(ctx, w, h);
  } else if (realmIdx === 3) {
    drawRealmVault(ctx, w, h);
  } else {
    drawRealmSummit(ctx, w, h);
  }

  // 2. Draw Interactive World Objects (Scrolls, Torii Shrines, Leaves)
  ctx.save();
  ctx.translate(-state.camera.x, -state.camera.y);
  drawRealmObjects(ctx, h);

  // 3. Draw Ronin Avatar
  drawRoninAvatar(ctx, state.player);

  // 4. Draw Particles
  for (let i = 0; i < state.particles.length; i++) {
    const p = state.particles[i];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size || 3, p.size || 3);
  }
  ctx.restore();

  // 5. Cinematic Realm Transition Ink Wash
  drawTransitionOverlay(ctx, w, h);

  ctx.restore(); // Screen shake
}
