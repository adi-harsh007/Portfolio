/**
 * Stylized Ronin / Samurai Wanderer Avatar Renderer
 * Custom vector-crafted samurai sprite with dynamic Verlet cloth cape,
 * straw kasa hat, katana scabbard, and fluid animation states.
 */

export function drawRoninAvatar(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // 1. Dynamic Ground Shadow
  ctx.save();
  ctx.scale(1, 0.28);
  const shadowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Face left or right
  ctx.scale(player.facing, 1);

  const t = player.animTimer;
  const isWalking = player.animState === 'WALK';
  const isJumping = player.animState === 'JUMP';
  const isBowing = player.animState === 'BOW';

  // Animation procedural offsets
  const walkCycle = isWalking ? Math.sin(t * 0.28) : 0;
  const bobY = isWalking ? Math.abs(Math.sin(t * 0.28)) * 3 : (isJumping ? -4 : Math.sin(t * 0.08) * 1.5);
  const torsoTilt = isBowing ? 0.35 : (isWalking ? 0.08 : 0);

  // 2. Dynamic Verlet Haori Cloak / Cape (Behind body)
  if (player.cape && player.cape.length > 1) {
    ctx.save();
    // Untranslate player offset so we draw cape nodes in local coords
    ctx.scale(player.facing, 1); // undo facing inversion for global cloth nodes
    ctx.translate(-player.x, -player.y);

    ctx.beginPath();
    ctx.moveTo(player.cape[0].x, player.cape[0].y);
    for (let i = 1; i < player.cape.length; i++) {
      ctx.lineTo(player.cape[i].x, player.cape[i].y);
    }

    // Give the cape thickness
    ctx.strokeStyle = '#991b1b'; // Deep twilight crimson
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Inner cape lining
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Gold trim accent
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.translate(0, -bobY);

  // 3. Hakama Trousers & Legs
  ctx.fillStyle = '#0f172a'; // Midnight dark hakama

  if (isJumping) {
    // Tucked legs mid-jump
    ctx.fillRect(-8, -22, 7, 16);
    ctx.fillRect(2, -26, 7, 14);
    // Sandals
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-9, -7, 9, 5);
    ctx.fillRect(1, -13, 9, 5);
  } else {
    // Left leg
    ctx.fillRect(-9 + walkCycle * 4, -26, 7, 24);
    // Right leg
    ctx.fillRect(2 - walkCycle * 4, -26, 7, 24);

    // Waraji straw sandals
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-10 + walkCycle * 4, -4, 9, 4);
    ctx.fillRect(1 - walkCycle * 4, -4, 9, 4);
    // White tabi socks
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-10 + walkCycle * 4, -8, 8, 4);
    ctx.fillRect(1 - walkCycle * 4, -8, 8, 4);
  }

  // 4. Torso & Kimono (Gi)
  ctx.save();
  ctx.rotate(torsoTilt);

  // Dark under-kimono
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-10, -56, 20, 32);

  // White crossover collar
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-6, -56);
  ctx.lineTo(2, -42);
  ctx.stroke();

  // Obi (Crimson sash)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-11, -38, 22, 7);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-3, -37, 6, 5); // Gold sash buckle

  // 5. Katana (Saya / Scabbard on left hip)
  ctx.save();
  ctx.translate(-8, -36);
  ctx.rotate(0.35 + (isWalking ? walkCycle * 0.1 : 0));
  // Scabbard
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-3, -2, 38, 5);
  // Gold Kojiri (tip) and Kurikata
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(32, -2, 4, 5);
  ctx.fillRect(4, -3, 3, 7);
  // Tsuka (Hilt) & Tsuba (Guard)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-2, -5, 3, 11); // Tsuba guard
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-16, -2, 14, 5); // Tsuka hilt wrapped in red
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-17, -2, 2, 5); // Kashira pommel
  ctx.restore();

  // 6. Arms & Hands
  ctx.fillStyle = '#1e293b';
  if (isBowing) {
    // Respectful hand folded on chest
    ctx.fillRect(0, -50, 14, 6);
    ctx.fillStyle = '#e09f67';
    ctx.fillRect(12, -50, 5, 5);
  } else if (isWalking) {
    ctx.fillRect(-13 - walkCycle * 5, -52, 6, 20);
    ctx.fillRect(7 + walkCycle * 5, -52, 6, 20);
    // Skin-toned hands
    ctx.fillStyle = '#e09f67';
    ctx.fillRect(-13 - walkCycle * 5, -34, 5, 5);
    ctx.fillRect(7 + walkCycle * 5, -34, 5, 5);
  } else {
    // Rest position near katana
    ctx.fillRect(-13, -52, 6, 20);
    ctx.fillRect(7, -52, 6, 20);
    ctx.fillStyle = '#e09f67';
    ctx.fillRect(-13, -34, 5, 5);
    ctx.fillRect(7, -34, 5, 5);
  }

  // 7. Head & Face Silhouette
  ctx.fillStyle = '#e09f67';
  ctx.fillRect(-6, -67, 13, 13);
  // Determined eye
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(2, -63, 3, 2);

  // 8. Traditional Kasa Straw Hat (Woven Bamboo / Straw cone)
  ctx.save();
  ctx.translate(0, -68);
  if (isBowing) ctx.rotate(0.2);

  // Hat Cone Silhouette
  ctx.fillStyle = '#78350f'; // Dark woven bamboo
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(26, 2);
  ctx.lineTo(-26, 2);
  ctx.closePath();
  ctx.fill();

  // Highlight ridge on top of hat
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(26, 2);
  ctx.stroke();

  // Crimson ribbon / chin cord knot trailing in the wind
  const cordWind = Math.sin(t * 0.14) * 5;
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.quadraticCurveTo(-14, 12, -18 + cordWind, 22);
  ctx.stroke();

  ctx.restore(); // Hat
  ctx.restore(); // Torso tilt
  ctx.restore(); // Player transform

  // 9. Minimalist Overhead Name Tag (Subtle & high-taste)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 10px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(10, 10, 12, 0.7)';
  ctx.fillRect(player.x - 48, player.y - 94, 96, 17);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(player.x - 48, player.y - 94, 96, 17);
  ctx.fillStyle = '#fde68a';
  ctx.fillText('ADITYA • RONIN', player.x, player.y - 82);
  ctx.restore();
}
