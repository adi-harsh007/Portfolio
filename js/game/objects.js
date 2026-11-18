/**
 * Interactive Game Objects: Torii Shrines, Ancient Scrolls, and Glowing Momiji Leaves
 */

import { state } from '../core/state.js';
import { REALM_OBJECTS } from '../config/data.js';

export function drawRealmObjects(ctx, canvasHeight) {
  const currentObjects = REALM_OBJECTS.filter(o => o.realmIndex === state.currentRealmIndex);
  const animTime = state.player.animTimer;

  for (const obj of currentObjects) {
    if (obj.type === 'leaf') {
      drawMomijiLeaf(ctx, obj, animTime);
    } else if (obj.type === 'scroll') {
      drawAncientScroll(ctx, obj, animTime);
    } else if (obj.type === 'shrine') {
      drawToriiShrine(ctx, obj, animTime);
    }
  }

  // Draw Context Interaction Prompt if active
  if (state.activeObject && !state.detailPanel.open && !state.pauseMenuOpen) {
    drawContextPrompt(ctx, state.activeObject, animTime);
  }
}

// 1. Glowing Momiji Maple Leaf Collectible
function drawMomijiLeaf(ctx, obj, t) {
  const isCollected = state.collectedLeaves.includes(obj.id);
  if (isCollected) return; // Disappears once gathered

  const bobY = Math.sin(t * 0.08 + obj.x) * 8;
  const rot = Math.sin(t * 0.05 + obj.x) * 0.25;
  const x = obj.x;
  const y = state.player.y - 45 + bobY;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Soft radiant pulse aura
  const pulse = Math.sin(t * 0.1) * 4;
  const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18 + pulse);
  grad.addColorStop(0, 'rgba(245, 158, 11, 0.7)');
  grad.addColorStop(0.6, 'rgba(239, 68, 68, 0.35)');
  grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 18 + pulse, 0, Math.PI * 2);
  ctx.fill();

  // Hand-drawn Maple Leaf 5-point shape
  ctx.fillStyle = '#dc2626'; // Vivid scarlet red
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(4, -4);
  ctx.lineTo(12, -7);
  ctx.lineTo(6, 0);
  ctx.lineTo(10, 8);
  ctx.lineTo(2, 6);
  ctx.lineTo(0, 13); // Stem
  ctx.lineTo(-2, 6);
  ctx.lineTo(-10, 8);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, -7);
  ctx.lineTo(-4, -4);
  ctx.closePath();
  ctx.fill();

  // Gold leaf vein
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 11);
  ctx.lineTo(0, -9);
  ctx.moveTo(0, 0);
  ctx.lineTo(6, -4);
  ctx.moveTo(0, 2);
  ctx.lineTo(-6, -4);
  ctx.stroke();

  ctx.restore();
}

// 2. Ancient Japanese Scroll
function drawAncientScroll(ctx, obj, t) {
  const isNearby = state.activeObject && state.activeObject.id === obj.id;
  const bobY = Math.sin(t * 0.06 + obj.x * 0.1) * 5;
  const x = obj.x;
  const y = state.player.y - 75 + bobY;

  ctx.save();
  ctx.translate(x, y);

  // Highlight beacon beam
  if (isNearby) {
    const beamGrad = ctx.createLinearGradient(0, -40, 0, 80);
    beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(-20, -40, 40, 120);
  }

  // Scroll Rollers (Dark mahogany wood cylinders)
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-18, -12, 36, 4);
  ctx.fillRect(-18, 12, 36, 4);
  // Gold caps on ends
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-19, -13, 3, 6);
  ctx.fillRect(16, -13, 3, 6);
  ctx.fillRect(-19, 11, 3, 6);
  ctx.fillRect(16, 11, 3, 6);

  // Parchment Body
  ctx.fillStyle = '#fef3c7'; // Aged ivory parchment
  ctx.fillRect(-15, -10, 30, 22);

  // Kanji calligraphy strokes on parchment
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-9, -5, 18, 2);
  ctx.fillRect(-7, 0, 14, 2);
  ctx.fillRect(-9, 5, 18, 2);

  // Red seal stamp (Hanko)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(5, 3, 5, 5);

  // Tag Badge floating above
  ctx.textAlign = 'center';
  ctx.font = '700 9px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(-32, -32, 64, 15);
  ctx.strokeStyle = isNearby ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-32, -32, 64, 15);
  ctx.fillStyle = '#fde68a';
  ctx.fillText(obj.tag || 'SCROLL', 0, -21);

  ctx.restore();
}

// 3. Torii Gate Shrine / Project Portal
function drawToriiShrine(ctx, obj, t) {
  const isNearby = state.activeObject && state.activeObject.id === obj.id;
  const x = obj.x;
  const y = state.player.y;

  ctx.save();
  ctx.translate(x, y);

  // Lantern Glow Gradient
  const glow = Math.sin(t * 0.08) * 8;
  const glowGrad = ctx.createRadialGradient(0, -110, 10, 0, -110, 110 + glow);
  glowGrad.addColorStop(0, isNearby ? 'rgba(245, 158, 11, 0.4)' : 'rgba(220, 38, 38, 0.25)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, -110, 110 + glow, 0, Math.PI * 2);
  ctx.fill();

  // Torii Base Stone Pedestals (Kamebara)
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-72, -10, 24, 10);
  ctx.fillRect(48, -10, 24, 10);

  // Two Main Vertical Pillars (Hashira)
  ctx.fillStyle = isNearby ? '#dc2626' : '#991b1b'; // Crimson vermillion
  ctx.fillRect(-66, -170, 14, 160);
  ctx.fillRect(52, -170, 14, 160);

  // Lower Crossbar (Nuki)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-82, -135, 164, 12);

  // Gakuzuka (Center tablet connecting crossbars)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-12, -170, 24, 35);
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 10px serif';
  ctx.textAlign = 'center';
  ctx.fillText('門', 0, -148);

  // Upper Main Beam (Kasagi & Shimaki) with upturned curved roof ends
  ctx.fillStyle = '#1c1917'; // Black lacquered top
  ctx.beginPath();
  ctx.moveTo(-100, -188);
  ctx.quadraticCurveTo(0, -180, 100, -188);
  ctx.lineTo(95, -172);
  ctx.quadraticCurveTo(0, -168, -95, -172);
  ctx.closePath();
  ctx.fill();

  // Vermillion beam beneath Kasagi
  ctx.fillStyle = isNearby ? '#dc2626' : '#991b1b';
  ctx.fillRect(-88, -172, 176, 12);

  // Hanging Stone Lanterns (Tōrō) on each side
  drawHangingLantern(ctx, -75, -120, t);
  drawHangingLantern(ctx, 75, -120, t + 1);

  // Shrine Signboard Title
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const titleW = ctx.measureText(obj.title).width + 24;
  ctx.fillStyle = 'rgba(10, 10, 12, 0.9)';
  ctx.fillRect(-titleW / 2, -214, titleW, 22);
  ctx.strokeStyle = isNearby ? '#38bdf8' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-titleW / 2, -214, titleW, 22);
  ctx.fillStyle = isNearby ? '#38bdf8' : '#fde68a';
  ctx.fillText(obj.icon + ' ' + obj.title, 0, -199);

  ctx.restore();
}

function drawHangingLantern(ctx, lx, ly, t) {
  ctx.save();
  ctx.translate(lx, ly);

  // Lantern cord
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // Wooden hexagonal frame
  ctx.fillStyle = '#292524';
  ctx.fillRect(-7, 0, 14, 4);
  ctx.fillRect(-7, 18, 14, 4);

  // Paper window with glowing candle
  const flicker = Math.sin(t * 0.25) * 0.2 + 0.8;
  ctx.fillStyle = `rgba(251, 191, 36, ${0.75 * flicker})`;
  ctx.fillRect(-6, 4, 12, 14);

  // Subtle candle flame aura
  const candleGrad = ctx.createRadialGradient(0, 11, 2, 0, 11, 14);
  candleGrad.addColorStop(0, 'rgba(255, 237, 213, 0.9)');
  candleGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = candleGrad;
  ctx.beginPath();
  ctx.arc(0, 11, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. Clean Context Interaction Prompt
function drawContextPrompt(ctx, obj, t) {
  const promptY = state.player.y - 120 + Math.sin(t * 0.1) * 3;
  const x = state.player.x;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';

  const actionText = obj.type === 'scroll' 
    ? 'PRESS [E] TO READ SCROLL' 
    : obj.targetRealm !== undefined
    ? `PRESS [E] TO ENTER ${obj.title.toUpperCase()}`
    : 'PRESS [E] TO INSPECT SHRINE';

  const textW = ctx.measureText(actionText).width + 32;

  // Background pill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(x - textW / 2, promptY, textW, 26);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - textW / 2, promptY, textW, 26);

  // Glowing diamond corners
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x - textW / 2 - 2, promptY + 11, 4, 4);
  ctx.fillRect(x + textW / 2 - 2, promptY + 11, 4, 4);

  ctx.fillStyle = '#e0f2fe';
  ctx.fillText('✨ ' + actionText, x, promptY + 17);

  ctx.restore();
}

