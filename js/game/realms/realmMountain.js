/**
 * Realm 0: The Mountain Path (霊山への道)
 * Atmospheric Ghost of Yōtei environment:
 * - Parallax 0: Crimson Twilight gradient sky + Mount Yōtei volcano silhouette + distant stars
 * - Parallax 1 (0.2x): Distant misty ridges & pine forests
 * - Parallax 2 (0.5x): Midground Torii gates, stone lanterns (Tōrō), and twisted autumn maples
 * - Layer 3 (1.0x): Rugged mountain trail, mossy rock ledges, roadside Jizō statues
 */

import { state } from '../../core/state.js';
import { getTerrainHeight } from '../physics.js';

export function drawRealmMountain(ctx, canvasWidth, canvasHeight) {
  const camX = state.camera.x;
  const t = state.player.animTimer;

  // -----------------------------------------------------------------
  // 1. SKY GRADIENT & MOUNT YŌTEI SILHOUETTE (Fixed / Parallax 0)
  // -----------------------------------------------------------------
  const sky = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  sky.addColorStop(0, '#0a0304');
  sky.addColorStop(0.45, '#24080c');
  sky.addColorStop(0.85, '#4a141b');
  sky.addColorStop(1, '#661b24');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Distant stars in upper twilight sky
  ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
  for (let i = 0; i < 45; i++) {
    const sx = (i * 73) % canvasWidth;
    const sy = (i * 37) % (canvasHeight * 0.4);
    const twinkle = Math.sin(t * 0.05 + i) * 0.4 + 0.6;
    ctx.globalAlpha = twinkle * 0.7;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1.0;

  // Mount Yōtei Volcano Silhouette in distance (Parallax 0.05x)
  const mountainX = canvasWidth * 0.55 - (camX * 0.05);
  const mountainBaseY = canvasHeight - 120;
  ctx.save();
  ctx.fillStyle = '#160507';
  ctx.beginPath();
  ctx.moveTo(mountainX - 340, mountainBaseY);
  ctx.quadraticCurveTo(mountainX - 140, mountainBaseY - 180, mountainX - 35, mountainBaseY - 260);
  ctx.lineTo(mountainX + 35, mountainBaseY - 260); // Flat volcanic caldera peak
  ctx.quadraticCurveTo(mountainX + 140, mountainBaseY - 180, mountainX + 340, mountainBaseY);
  ctx.closePath();
  ctx.fill();

  // Snowcap on Mount Yōtei
  ctx.fillStyle = 'rgba(254, 226, 226, 0.12)';
  ctx.beginPath();
  ctx.moveTo(mountainX - 60, mountainBaseY - 230);
  ctx.lineTo(mountainX - 35, mountainBaseY - 260);
  ctx.lineTo(mountainX + 35, mountainBaseY - 260);
  ctx.lineTo(mountainX + 60, mountainBaseY - 230);
  ctx.quadraticCurveTo(mountainX, mountainBaseY - 215, mountainX - 60, mountainBaseY - 230);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // -----------------------------------------------------------------
  // 2. PARALLAX LAYER 1: Distant Misty Ridges (0.2x)
  // -----------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = '#1f080b';
  const ridgeOffset = -(camX * 0.2);
  for (let bx = -300; bx < canvasWidth + 300; bx += 220) {
    const rx = bx + (ridgeOffset % 220);
    const rh = 140 + Math.sin(bx * 0.02) * 45;
    ctx.beginPath();
    ctx.moveTo(rx - 120, canvasHeight - 90);
    ctx.quadraticCurveTo(rx, canvasHeight - 90 - rh, rx + 120, canvasHeight - 90);
    ctx.fill();
  }
  // Soft crimson mountain mist
  const mist1 = ctx.createLinearGradient(0, canvasHeight - 220, 0, canvasHeight - 90);
  mist1.addColorStop(0, 'rgba(74, 20, 27, 0)');
  mist1.addColorStop(1, 'rgba(74, 20, 27, 0.45)');
  ctx.fillStyle = mist1;
  ctx.fillRect(0, canvasHeight - 220, canvasWidth, 130);
  ctx.restore();

  // -----------------------------------------------------------------
  // 3. PARALLAX LAYER 2: Midground Pine Trees & Torii Gates (0.5x)
  // -----------------------------------------------------------------
  ctx.save();
  const midOffset = -(camX * 0.5);
  for (let tx = 0; tx < 2800; tx += 360) {
    const screenX = tx + midOffset;
    if (screenX < -150 || screenX > canvasWidth + 150) continue;
    drawMidgroundPine(ctx, screenX, canvasHeight - 110, 110);
  }
  ctx.restore();

  // -----------------------------------------------------------------
  // 4. FOREGROUND LAYER 3 (1.0x Camera World Space)
  // -----------------------------------------------------------------
  ctx.save();
  ctx.translate(-camX, -state.camera.y);

  // Terrain Solid Fill
  ctx.fillStyle = '#0a0405';
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);

  // Draw smooth terrain along path
  for (let x = 0; x <= 2800; x += 40) {
    const gy = getTerrainHeight(0, x, canvasHeight);
    ctx.lineTo(x, gy);
  }
  ctx.lineTo(2800, canvasHeight);
  ctx.closePath();
  ctx.fill();

  // Upper Earth Ridge / Grass Border
  ctx.strokeStyle = '#270c10';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Stone path markers & wooden trail posts
  drawTrailDecorations(ctx, canvasHeight, t);

  ctx.restore();
}

function drawMidgroundPine(ctx, x, y, h) {
  ctx.fillStyle = '#140608';
  // Trunk
  ctx.fillRect(x - 5, y - h, 10, h);
  // Tiered pine foliage
  for (let i = 0; i < 4; i++) {
    const tierY = y - h + i * 22;
    const tierW = 35 + i * 16;
    ctx.beginPath();
    ctx.moveTo(x - tierW, tierY + 22);
    ctx.lineTo(x, tierY);
    ctx.lineTo(x + tierW, tierY + 22);
    ctx.closePath();
    ctx.fill();
  }
}

function drawTrailDecorations(ctx, canvasHeight, t) {
  // Roadside Stone Lanterns (Tōrō) along path
  const lanternXPositions = [280, 980, 1700, 2250];
  for (const lx of lanternXPositions) {
    const ly = getTerrainHeight(0, lx, canvasHeight);
    drawStoneToro(ctx, lx, ly, t);
  }

  // Jizō Stone Protector Statues with red bib
  const jizoXPositions = [720, 1950];
  for (const jx of jizoXPositions) {
    const jy = getTerrainHeight(0, jx, canvasHeight);
    drawJizoStatue(ctx, jx, jy);
  }

  // Wooden Distance Post ("KIIT • 1350m")
  const px = 1150;
  const py = getTerrainHeight(0, px, canvasHeight);
  ctx.fillStyle = '#3f181c';
  ctx.fillRect(px - 6, py - 52, 12, 52);
  ctx.fillStyle = '#fde68a';
  ctx.font = '700 8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KIIT', px, py - 38);
  ctx.fillText('HUB', px, py - 26);
}

function drawStoneToro(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);

  // Stone Base
  ctx.fillStyle = '#1a0c0e';
  ctx.fillRect(-12, -8, 24, 8);
  ctx.fillRect(-8, -26, 16, 18); // Pillar
  ctx.fillRect(-14, -32, 28, 6); // Fire chamber platform

  // Fire Chamber with glowing candle window
  ctx.fillStyle = '#0a0304';
  ctx.fillRect(-10, -50, 20, 18);
  const flicker = Math.sin(t * 0.15 + x) * 0.2 + 0.8;
  ctx.fillStyle = `rgba(251, 191, 36, ${0.85 * flicker})`;
  ctx.fillRect(-6, -46, 12, 12);

  // Soft light aura
  const aura = ctx.createRadialGradient(0, -40, 2, 0, -40, 26);
  aura.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
  aura.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, -40, 26, 0, Math.PI * 2);
  ctx.fill();

  // Pagoda Curved Roof (Kasa)
  ctx.fillStyle = '#1a0c0e';
  ctx.beginPath();
  ctx.moveTo(-18, -50);
  ctx.quadraticCurveTo(0, -58, 18, -50);
  ctx.lineTo(14, -58);
  ctx.lineTo(-14, -58);
  ctx.closePath();
  ctx.fill();

  // Jewel finial top (Hōju)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, -62, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawJizoStatue(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Stone base pedestal
  ctx.fillStyle = '#1c1012';
  ctx.fillRect(-10, -6, 20, 6);

  // Rounded stone body
  ctx.beginPath();
  ctx.arc(0, -22, 11, 0, Math.PI * 2);
  ctx.fill();

  // Round head
  ctx.beginPath();
  ctx.arc(0, -36, 8, 0, Math.PI * 2);
  ctx.fill();

  // Traditional Red Cloth Bib (Yodarekake)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(-7, -30);
  ctx.lineTo(7, -30);
  ctx.lineTo(0, -18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

