/**
 * Realm 1: The Healer's Garden (医術の庭) — DermaScope Triage
 * Visual features:
 * - Bioluminescent garden with glowing moss, lotus blooms, and Grad-CAM color halos
 * - Fireflies (Hotaru) drifting through the evening mist
 * - Ancient stone apothecary gazebo & diagnostic laboratory shrine
 */

import { state } from '../../core/state.js';
import { getTerrainHeight } from '../physics.js';

export function drawRealmGarden(ctx, canvasWidth, canvasHeight) {
  const camX = state.camera.x;
  const t = state.player.animTimer;

  // 1. SKY GRADIENT: Deep emerald / twilight teal
  const sky = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  sky.addColorStop(0, '#040d0a');
  sky.addColorStop(0.5, '#0b241e');
  sky.addColorStop(1, '#13392f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Crescent Moon
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(canvasWidth * 0.82, 90, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0b241e'; // cutout
  ctx.beginPath();
  ctx.arc(canvasWidth * 0.82 - 7, 85, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. PARALLAX 1: Misty Zen Bamboo Groves (0.25x)
  ctx.save();
  ctx.fillStyle = '#081a15';
  const bambooOffset = -(camX * 0.25);
  for (let bx = -100; bx < canvasWidth + 200; bx += 40) {
    const rx = bx + (bambooOffset % 40);
    ctx.fillRect(rx, canvasHeight - 260, 6, 170);
    // Bamboo leaves
    ctx.beginPath();
    ctx.ellipse(rx + 8, canvasHeight - 240, 16, 4, 0.4, 0, Math.PI * 2);
    ctx.ellipse(rx - 8, canvasHeight - 210, 16, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. PARALLAX 2: Stone Pagoda & Moss Terraces (0.5x)
  ctx.save();
  const midOffset = -(camX * 0.5);
  for (let px = 200; px < 3000; px += 600) {
    const screenX = px + midOffset;
    if (screenX < -150 || screenX > canvasWidth + 150) continue;
    drawMiniPagoda(ctx, screenX, canvasHeight - 110);
  }
  ctx.restore();

  // 4. FOREGROUND LAYER 3 (1.0x Camera World Space)
  ctx.save();
  ctx.translate(-camX, -state.camera.y);

  // Mossy Garden Soil
  ctx.fillStyle = '#06120e';
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);
  for (let x = 0; x <= 3000; x += 40) {
    const gy = getTerrainHeight(1, x, canvasHeight);
    ctx.lineTo(x, gy);
  }
  ctx.lineTo(3000, canvasHeight);
  ctx.closePath();
  ctx.fill();

  // Vibrant Emerald Moss Border
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Bioluminescent Grad-CAM Flowers along the path
  drawBioluminescentFlowers(ctx, canvasHeight, t);

  // Floating Fireflies (Hotaru)
  drawFireflies(ctx, canvasHeight, t);

  ctx.restore();
}

function drawMiniPagoda(ctx, x, y) {
  ctx.fillStyle = '#0c241d';
  // 3 Tiered Roofs
  for (let i = 0; i < 3; i++) {
    const ry = y - 90 + i * 26;
    const rw = 42 - i * 8;
    ctx.beginPath();
    ctx.moveTo(x - rw, ry + 12);
    ctx.quadraticCurveTo(x, ry + 2, x + rw, ry + 12);
    ctx.lineTo(x + rw - 6, ry);
    ctx.lineTo(x - rw + 6, ry);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(x - 5, y - 90, 10, 80);
}

function drawBioluminescentFlowers(ctx, canvasHeight, t) {
  const flowerX = [380, 820, 1240, 1750, 2280, 2650];
  for (let i = 0; i < flowerX.length; i++) {
    const fx = flowerX[i];
    const fy = getTerrainHeight(1, fx, canvasHeight);

    // Stem
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo(fx + 6, fy - 16, fx, fy - 28);
    ctx.stroke();

    // Grad-CAM Colors: Rose Red (#f43f5e) or Amber (#f59e0b) or Cyan (#38bdf8)
    const color = i % 3 === 0 ? '#f43f5e' : (i % 3 === 1 ? '#f59e0b' : '#38bdf8');
    const glow = Math.sin(t * 0.1 + i) * 4 + 8;

    // Glowing aura
    const grad = ctx.createRadialGradient(fx, fy - 30, 1, fx, fy - 30, glow);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fx, fy - 30, glow, 0, Math.PI * 2);
    ctx.fill();

    // Blossom center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy - 30, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFireflies(ctx, canvasHeight, t) {
  for (let i = 0; i < 28; i++) {
    const fx = ((i * 113 + t * 0.6) % 3000);
    const fy = (canvasHeight - 160) + Math.sin(t * 0.05 + i * 2) * 50;
    const alpha = Math.sin(t * 0.08 + i) * 0.4 + 0.6;

    ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

