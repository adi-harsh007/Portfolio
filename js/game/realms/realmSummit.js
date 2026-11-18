/**
 * Realm 4: The Yōtei Summit (羊蹄の頂) — Skills, Thermopack, Contact
 * Visual features:
 * - High mountain caldera overlooking the misty valleys and past realms below
 * - Rising golden sun rising above volcanic cloud sea
 * - Ancient Shinto stone stele engraved with A.M. Thermopack MySQL 3NF schema
 * - Celestial 24-skill Constellation Shrine & Direct Contact dispatch scroll
 */

import { state } from '../../core/state.js';
import { getTerrainHeight } from '../physics.js';

export function drawRealmSummit(ctx, canvasWidth, canvasHeight) {
  const camX = state.camera.x;
  const t = state.player.animTimer;

  // 1. SKY GRADIENT: Golden sunrise breaking through crimson dawn
  const sky = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  sky.addColorStop(0, '#100205');
  sky.addColorStop(0.45, '#3b0b14');
  sky.addColorStop(0.8, '#701a24');
  sky.addColorStop(1, '#9e2532');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Rising Golden Sun on Horizon
  const sunX = canvasWidth * 0.72;
  const sunY = canvasHeight * 0.42;
  ctx.save();
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 140);
  sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  sunGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.6)');
  sunGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
  ctx.fill();

  // Solid golden sun core
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. PARALLAX 1: Distant Sea of Clouds (Unkai) & Mountain Peaks (0.25x)
  ctx.save();
  ctx.fillStyle = 'rgba(74, 20, 27, 0.6)';
  const cloudOffset = -(camX * 0.25);
  for (let cx = -200; cx < canvasWidth + 300; cx += 180) {
    const rx = cx + (cloudOffset % 180);
    ctx.beginPath();
    ctx.ellipse(rx, canvasHeight - 160, 110, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. PARALLAX 2: Ancient Windblown Summit Pines & Torii silhouettes (0.5x)
  ctx.save();
  const midOffset = -(camX * 0.5);
  for (let px = 300; px < 3200; px += 750) {
    const screenX = px + midOffset;
    if (screenX < -150 || screenX > canvasWidth + 150) continue;
    drawWindsweptPine(ctx, screenX, canvasHeight - 110);
  }
  ctx.restore();

  // 4. FOREGROUND LAYER 3 (1.0x Camera World Space)
  ctx.save();
  ctx.translate(-camX, -state.camera.y);

  // Rugged Volcanic Summit Rock
  ctx.fillStyle = '#100406';
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);
  for (let x = 0; x <= 3200; x += 40) {
    const gy = getTerrainHeight(4, x, canvasHeight);
    ctx.lineTo(x, gy);
  }
  ctx.lineTo(3200, canvasHeight);
  ctx.closePath();
  ctx.fill();

  // Golden Horizon Edge Highlight
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // A.M. Thermopack MySQL Monolith Stele
  drawThermopackMonolith(ctx, 620, canvasHeight, t);

  // Golden Shimenawa Sacred Straw Rope Posts at Summit Edge
  drawShimenawaPosts(ctx, 2900, canvasHeight);

  // Windblown Golden Embers
  drawSummitEmbers(ctx, canvasHeight, t);

  ctx.restore();
}

function drawWindsweptPine(ctx, x, y) {
  ctx.fillStyle = '#170609';
  // Trunk bent dramatically by mountain wind toward right
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.quadraticCurveTo(x + 20, y - 60, x + 65, y - 100);
  ctx.lineTo(x + 75, y - 100);
  ctx.quadraticCurveTo(x + 30, y - 55, x + 8, y);
  ctx.closePath();
  ctx.fill();

  // Windswept needle clusters
  for (let i = 0; i < 3; i++) {
    const nx = x + 45 + i * 20;
    const ny = y - 95 + i * 15;
    ctx.beginPath();
    ctx.ellipse(nx, ny, 26, 9, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawThermopackMonolith(ctx, x, canvasHeight, t) {
  const y = getTerrainHeight(4, x, canvasHeight);

  // Large Ancient Stone Tablet (Sekitō)
  ctx.fillStyle = '#1f0a0e';
  ctx.fillRect(x - 45, y - 110, 90, 110);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 45, y - 110, 90, 110);

  // Engraved Relational Database Schema Calligraphy
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('A.M. THERMOPACK', x, y - 88);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '8px "JetBrains Mono", monospace';
  ctx.fillText('MySQL 3NF Normal', x, y - 72);
  ctx.fillText('500+ Relational Rows', x, y - 58);
  ctx.fillText('customers ⋈ payments', x, y - 44);

  // Pulsing rune glow
  const runePulse = Math.sin(t * 0.1) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(56, 189, 248, ${0.4 * runePulse})`;
  ctx.fillRect(x - 38, y - 32, 76, 14);
  ctx.fillStyle = '#0f172a';
  ctx.fillText('PRESS [E] TO QUERY', x, y - 22);
}

function drawShimenawaPosts(ctx, x, canvasHeight) {
  const y = getTerrainHeight(4, x, canvasHeight);

  // Two sacred posts with rice-straw rope & zigzag paper streamers (Shide)
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x - 50, y - 80, 8, 80);
  ctx.fillRect(x + 50, y - 80, 8, 80);

  // Straw rope
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 46, y - 70);
  ctx.quadraticCurveTo(x, y - 55, x + 46, y - 70);
  ctx.stroke();

  // White zigzag paper streamers
  ctx.fillStyle = '#ffffff';
  for (let i = -1; i <= 1; i++) {
    const sx = x + i * 28;
    const sy = y - 62 + (i === 0 ? 5 : 0);
    ctx.fillRect(sx - 3, sy, 6, 14);
  }
}

function drawSummitEmbers(ctx, canvasHeight, t) {
  for (let i = 0; i < 24; i++) {
    const ex = (i * 137 + t * 2.2) % 3200;
    const ey = canvasHeight - 70 - ((t * 0.8 + i * 24) % 180);
    const alpha = Math.sin(t * 0.08 + i) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
    ctx.fillRect(ex, ey, 2.5, 2.5);
  }
}

