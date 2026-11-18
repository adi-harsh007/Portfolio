/**
 * Realm 2: The Festival Grounds (宵祭の広場) — Eventify Pro
 * Visual features:
 * - Traditional Japanese Matsuri with arched vermillion bridge (Taiko-bashi)
 * - Strings of glowing paper lanterns (Chōchin) floating into the indigo night sky
 * - Festival stall (Yatai) silhouettes with warm amber banners
 */

import { state } from '../../core/state.js';
import { getTerrainHeight } from '../physics.js';

export function drawRealmFestival(ctx, canvasWidth, canvasHeight) {
  const camX = state.camera.x;
  const t = state.player.animTimer;

  // 1. SKY GRADIENT: Festive deep indigo / royal violet
  const sky = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  sky.addColorStop(0, '#090514');
  sky.addColorStop(0.5, '#1b0e36');
  sky.addColorStop(1, '#341a5c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Distant Festival Fireworks Sparks (occasional twinkling bursts)
  ctx.save();
  for (let i = 0; i < 20; i++) {
    const fx = (canvasWidth * 0.4 + i * 28) % canvasWidth;
    const fy = 60 + Math.sin(t * 0.08 + i) * 35;
    const sparkAlpha = Math.sin(t * 0.12 + i * 1.5) * 0.5 + 0.5;
    ctx.fillStyle = i % 2 === 0 ? `rgba(244, 63, 94, ${sparkAlpha})` : `rgba(251, 191, 36, ${sparkAlpha})`;
    ctx.fillRect(fx, fy, 2, 2);
  }
  ctx.restore();

  // 2. PARALLAX 1: Distant City Pagodas & Festive Streamers (0.25x)
  ctx.save();
  ctx.fillStyle = '#140826';
  const pagodaOffset = -(camX * 0.25);
  for (let bx = -100; bx < canvasWidth + 200; bx += 320) {
    const rx = bx + (pagodaOffset % 320);
    ctx.fillRect(rx, canvasHeight - 220, 28, 130);
    // Pagoda roof eaves
    ctx.beginPath();
    ctx.moveTo(rx - 16, canvasHeight - 200);
    ctx.lineTo(rx + 44, canvasHeight - 200);
    ctx.lineTo(rx + 14, canvasHeight - 225);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 3. PARALLAX 2: Overhead Festive Lantern Garlands (0.5x)
  ctx.save();
  const garlandOffset = -(camX * 0.5);
  ctx.strokeStyle = 'rgba(76, 29, 149, 0.4)';
  ctx.lineWidth = 1.5;
  for (let gx = -200; gx < canvasWidth + 400; gx += 260) {
    const rx = gx + (garlandOffset % 260);
    ctx.beginPath();
    ctx.moveTo(rx, 90);
    ctx.quadraticCurveTo(rx + 130, 135, rx + 260, 90);
    ctx.stroke();

    // Hang 3 mini paper lanterns on each garland curve
    for (let j = 1; j <= 3; j++) {
      const lx = rx + j * 65;
      const ly = 90 + Math.sin((j / 4) * Math.PI) * 40;
      drawMiniChochin(ctx, lx, ly, t + j);
    }
  }
  ctx.restore();

  // 4. FOREGROUND LAYER 3 (1.0x Camera World Space)
  ctx.save();
  ctx.translate(-camX, -state.camera.y);

  // Wooden Boardwalk & Pond Terrain
  ctx.fillStyle = '#0f081d';
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);
  for (let x = 0; x <= 3200; x += 40) {
    const gy = getTerrainHeight(2, x, canvasHeight);
    ctx.lineTo(x, gy);
  }
  ctx.lineTo(3200, canvasHeight);
  ctx.closePath();
  ctx.fill();

  // Boardwalk Timber Rim
  ctx.strokeStyle = '#6d28d9';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Arched Red Drum Bridge Railings (between 1200 and 2100)
  drawArchedBridgeRailing(ctx, canvasHeight);

  // Festival Stalls (Yatai)
  drawFestivalStall(ctx, 800, canvasHeight, 'EVENTBOT');
  drawFestivalStall(ctx, 2450, canvasHeight, 'TICKETS');

  // Floating Water Lanterns drifting on koi pond below bridge
  drawFloatingWaterLanterns(ctx, canvasHeight, t);

  ctx.restore();
}

function drawMiniChochin(ctx, x, y, t) {
  const flicker = Math.sin(t * 0.2) * 0.2 + 0.8;

  // Red/Gold glowing body
  ctx.fillStyle = `rgba(244, 63, 94, ${0.9 * flicker})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Black caps
  ctx.fillStyle = '#0f081d';
  ctx.fillRect(x - 5, y - 4, 10, 3);
  ctx.fillRect(x - 5, y + 17, 10, 3);
}

function drawArchedBridgeRailing(ctx, canvasHeight) {
  ctx.strokeStyle = '#dc2626'; // Vermillion bridge railing
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 1200; x <= 2100; x += 30) {
    const gy = getTerrainHeight(2, x, canvasHeight);
    if (x === 1200) ctx.moveTo(x, gy - 26);
    else ctx.lineTo(x, gy - 26);
  }
  ctx.stroke();

  // Baluster posts
  ctx.fillStyle = '#7f1d1d';
  for (let x = 1220; x <= 2080; x += 60) {
    const gy = getTerrainHeight(2, x, canvasHeight);
    ctx.fillRect(x - 3, gy - 26, 6, 26);
    // Gold Giboshi finial on top of each post
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, gy - 30, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
  }
}

function drawFestivalStall(ctx, x, canvasHeight, label) {
  const y = getTerrainHeight(2, x, canvasHeight);

  // Wooden stall structure
  ctx.fillStyle = '#1e1138';
  ctx.fillRect(x - 60, y - 90, 120, 90);

  // Striped Red/White Awning
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.fillRect(x - 60 + i * 20, y - 105, 20, 15);
  }

  // Counter
  ctx.fillStyle = '#4c1d95';
  ctx.fillRect(x - 65, y - 45, 130, 8);

  // Warm amber stall light
  ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.fillRect(x - 55, y - 85, 110, 40);

  // Banner
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 60);
}

function drawFloatingWaterLanterns(ctx, canvasHeight, t) {
  for (let i = 0; i < 8; i++) {
    const lx = 1350 + i * 85 + Math.sin(t * 0.04 + i) * 12;
    const ly = canvasHeight - 45;

    // Wooden float base
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(lx - 9, ly, 18, 4);

    // Glowing square paper lantern
    const flicker = Math.sin(t * 0.15 + i) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(253, 230, 138, ${0.85 * flicker})`;
    ctx.fillRect(lx - 7, ly - 12, 14, 12);
  }
}

