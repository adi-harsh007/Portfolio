/**
 * Realm 3: The Merchant's Vault (商人の宝物庫) — MediStore
 * Visual features:
 * - Underground fortified stone treasury with cyan crystalline light
 * - Docker Compose shipping containers styled as heavy iron/steel crates
 * - Cryptographic HMAC-SHA256 seal vaults & Razorpay golden balances
 */

import { state } from '../../core/state.js';
import { getTerrainHeight } from '../physics.js';

export function drawRealmVault(ctx, canvasWidth, canvasHeight) {
  const camX = state.camera.x;
  const t = state.player.animTimer;

  // 1. SKY / CAVERN CEILING GRADIENT: Deep oceanic teal & dark slate
  const sky = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  sky.addColorStop(0, '#030c10');
  sky.addColorStop(0.5, '#071f28');
  sky.addColorStop(1, '#0e3846');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Cavern Stalactites along the ceiling
  ctx.save();
  ctx.fillStyle = '#041217';
  for (let cx = 0; cx < canvasWidth + 100; cx += 55) {
    const ch = 30 + Math.sin(cx * 0.05) * 20;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx + 25, ch);
    ctx.lineTo(cx + 50, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. PARALLAX 1: Massive Reinforced Vault Doors & Pillars (0.25x)
  ctx.save();
  ctx.fillStyle = '#091c24';
  const pillarOffset = -(camX * 0.25);
  for (let px = -150; px < canvasWidth + 250; px += 280) {
    const rx = px + (pillarOffset % 280);
    // Stone pillar
    ctx.fillRect(rx, 40, 48, canvasHeight - 120);
    // Pillar capitals
    ctx.fillStyle = '#0d2833';
    ctx.fillRect(rx - 8, 40, 64, 16);
    ctx.fillRect(rx - 8, canvasHeight - 140, 64, 16);
    ctx.fillStyle = '#091c24';
  }
  ctx.restore();

  // 3. PARALLAX 2: Hanging Blue Torches & Chain Hoists (0.5x)
  ctx.save();
  const midOffset = -(camX * 0.5);
  for (let hx = 100; hx < 3000; hx += 340) {
    const screenX = hx + midOffset;
    if (screenX < -100 || screenX > canvasWidth + 100) continue;
    drawHangingVaultTorch(ctx, screenX, 90, t);
  }
  ctx.restore();

  // 4. FOREGROUND LAYER 3 (1.0x Camera World Space)
  ctx.save();
  ctx.translate(-camX, -state.camera.y);

  // Heavy Dressed Stone Floor
  ctx.fillStyle = '#061318';
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);
  for (let x = 0; x <= 3000; x += 40) {
    const gy = getTerrainHeight(3, x, canvasHeight);
    ctx.lineTo(x, gy);
  }
  ctx.lineTo(3000, canvasHeight);
  ctx.closePath();
  ctx.fill();

  // Cyan Crystalline Stone Rim
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Docker Compose Containers as Iron Shipping Crates
  drawDockerCrate(ctx, 850, canvasHeight, 'DOCKER PG16', '#0284c7');
  drawDockerCrate(ctx, 950, canvasHeight, 'EXPRESS 5', '#10b981');
  drawDockerCrate(ctx, 2300, canvasHeight, 'PRISMA ORM', '#6366f1');

  // Cryptographic Razorpay HMAC-SHA256 Lock Stele
  drawHmacLockStele(ctx, 1350, canvasHeight, t);

  ctx.restore();
}

function drawHangingVaultTorch(ctx, x, y, t) {
  // Iron chain
  ctx.strokeStyle = '#0f2f3d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Blue Fire Brazier
  ctx.fillStyle = '#0e3846';
  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.lineTo(x + 8, y + 14);
  ctx.lineTo(x - 8, y + 14);
  ctx.closePath();
  ctx.fill();

  // Blue Flame
  const flameH = 14 + Math.sin(t * 0.25) * 4;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.quadraticCurveTo(x, y - flameH, x + 8, y);
  ctx.closePath();
  ctx.fill();

  // Cyan aura
  const aura = ctx.createRadialGradient(x, y - 5, 2, x, y - 5, 30);
  aura.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, y - 5, 30, 0, Math.PI * 2);
  ctx.fill();
}

function drawDockerCrate(ctx, x, canvasHeight, label, accentColor) {
  const y = getTerrainHeight(3, x, canvasHeight);

  // Heavy steel crate
  ctx.fillStyle = '#0f2933';
  ctx.fillRect(x - 42, y - 54, 84, 54);

  // Accent edge brackets
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 42, y - 54, 84, 54);

  // Corrugation ribs
  ctx.fillStyle = '#091c24';
  for (let r = 0; r < 3; r++) {
    ctx.fillRect(x - 34 + r * 24, y - 48, 16, 42);
  }

  // Stencil Label
  ctx.fillStyle = '#e0f2fe';
  ctx.font = 'bold 8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 24);
}

function drawHmacLockStele(ctx, x, canvasHeight, t) {
  const y = getTerrainHeight(3, x, canvasHeight);

  // Stone Pillar
  ctx.fillStyle = '#09212c';
  ctx.fillRect(x - 28, y - 85, 56, 85);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 28, y - 85, 56, 85);

  // Cryptographic Keyhole with glowing runes
  const pulse = Math.sin(t * 0.1) * 3;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(x, y - 55, 12 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HMAC', x, y - 52);
  ctx.fillText('SHA256', x, y - 25);
}

