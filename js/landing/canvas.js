/**
 * Ghost of Yōtei Canvas Engine
 * Renders Crimson Twilight Mount Yōtei, parallax mist, animated ronin on cliff edge,
 * and realistic windblown Japanese maple leaves (momiji) with mouse wind interaction.
 */

export class YoteiCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.time = 0;
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, active: false };
    this.wind = { base: 1.8, gust: 0, gustTimer: 0 };

    this.leaves = [];
    this.embers = [];
    this.stars = [];
    this.fogOffsets = [0, 0, 0];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate stars
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.45,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 2 + 1,
      });
    }

    // Generate maple leaves (momiji)
    const leafCount = Math.min(Math.floor(window.innerWidth / 18), 85);
    for (let i = 0; i < leafCount; i++) {
      this.leaves.push(this.createLeaf(true));
    }

    // Generate burning embers
    for (let i = 0; i < 40; i++) {
      this.embers.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8 - 0.5,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.005 + 0.003,
      });
    }

    // Mouse wind interaction
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (this.mouse.lastX !== 0) {
        this.mouse.vx = currentX - this.mouse.lastX;
        this.mouse.vy = currentY - this.mouse.lastY;
      }
      this.mouse.x = currentX;
      this.mouse.y = currentY;
      this.mouse.lastX = currentX;
      this.mouse.lastY = currentY;
      this.mouse.active = true;

      // Mouse gust effect on nearby leaves
      const mRadius = 140;
      for (const leaf of this.leaves) {
        const dx = leaf.x - this.mouse.x;
        const dy = leaf.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mRadius && dist > 0) {
          const force = (1 - dist / mRadius) * 4.5;
          leaf.vx += (dx / dist) * force + this.mouse.vx * 0.08;
          leaf.vy += (dy / dist) * force + this.mouse.vy * 0.08;
          leaf.rotSpeed += (Math.random() - 0.5) * 0.12;
        }
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Click creates wind burst
    window.addEventListener('click', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 12; i++) {
        const leaf = this.createLeaf(false);
        leaf.x = x + (Math.random() - 0.5) * 60;
        leaf.y = y + (Math.random() - 0.5) * 60;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 4;
        leaf.vx = Math.cos(angle) * speed;
        leaf.vy = Math.sin(angle) * speed;
        this.leaves.push(leaf);
        if (this.leaves.length > 120) this.leaves.shift();
      }
    });

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createLeaf(randomY = false) {
    const palette = [
      '#991b1b', // deep crimson
      '#dc2626', // vermilion red
      '#ea580c', // burnt orange
      '#f97316', // autumn orange
      '#b45309', // gold amber
    ];
    return {
      x: Math.random() * (this.width + 300) - 100,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * 11 + 9,
      color: palette[Math.floor(Math.random() * palette.length)],
      vx: -(Math.random() * 2.2 + 1.2),
      vy: Math.random() * 1.4 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      tilt: Math.random() * Math.PI,
      tiltSpeed: Math.random() * 0.05 + 0.02,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.04 + 0.02,
      swingAmp: Math.random() * 1.5 + 0.5,
    };
  }

  animate() {
    this.time += 0.016;

    // Wind dynamics
    this.wind.gustTimer += 0.016;
    if (this.wind.gustTimer > 4) {
      this.wind.gust = Math.sin(this.time * 1.5) * 1.2;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Sky & Sun
    this.drawSky();

    // 2. Stars
    this.drawStars();

    // 3. Mount Yōtei
    this.drawMountYotei();

    // 4. Parallax Mountain Ridges & Mist
    this.drawDistantRidges();

    // 5. Foreground Cliff & Wanderer (Ronin)
    this.drawCliffAndRonin();

    // 6. Atmospheric Ground Fog
    this.drawFogLayers();

    // 7. Rising Embers
    this.drawEmbers();

    // 8. Windblown Maple Leaves (Momiji)
    this.drawLeaves();

    requestAnimationFrame(() => this.animate());
  }

  drawSky() {
    const w = this.width;
    const h = this.height;

    // Twilight Gradient: Deep Indigo -> Fiery Crimson -> Warm Amber Horizon
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, '#0c0512'); // Pitch twilight indigo
    grad.addColorStop(0.28, '#260c1e'); // Deep dusk violet
    grad.addColorStop(0.55, '#6a121e'); // Crimson red
    grad.addColorStop(0.75, '#b42b1b'); // Burning scarlet
    grad.addColorStop(0.88, '#e6511b'); // Saffron amber
    grad.addColorStop(1.0, '#f97316'); // Horizon glow

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Large Crimson Celestial Disc (Setting Sun / Blood Moon behind peak)
    const sunX = w * 0.58;
    const sunY = h * 0.62;
    const sunR = Math.min(w, h) * 0.22;

    const sunGlow = this.ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.8);
    sunGlow.addColorStop(0, 'rgba(255, 120, 50, 0.45)');
    sunGlow.addColorStop(0.4, 'rgba(230, 40, 30, 0.25)');
    sunGlow.addColorStop(0.7, 'rgba(160, 20, 20, 0.1)');
    sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = sunGlow;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, sunR * 2.8, 0, Math.PI * 2);
    this.ctx.fill();

    // Sun disc
    const sunDisc = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
    sunDisc.addColorStop(0, 'rgba(255, 235, 180, 0.95)');
    sunDisc.addColorStop(0.45, 'rgba(255, 100, 40, 0.88)');
    sunDisc.addColorStop(0.85, 'rgba(200, 25, 25, 0.7)');
    sunDisc.addColorStop(1, 'rgba(140, 15, 15, 0)');

    this.ctx.fillStyle = sunDisc;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawStars() {
    this.ctx.save();
    for (const star of this.stars) {
      const alpha = star.alpha * (0.6 + 0.4 * Math.sin(this.time * star.twinkleSpeed));
      this.ctx.fillStyle = `rgba(255, 245, 220, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x * this.width, star.y * this.height, star.r, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawMountYotei() {
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    // Peak coordinates (iconic symmetrical stratovolcano cone of Mount Yōtei)
    const peakX = w * 0.58;
    const peakY = h * 0.42;
    const baseWidth = w * 0.82;
    const leftBase = peakX - baseWidth * 0.52;
    const rightBase = peakX + baseWidth * 0.52;
    const baseY = h * 0.88;

    ctx.save();

    // 1. Mountain Base Silhouette
    const mtnGrad = ctx.createLinearGradient(0, peakY, 0, baseY);
    mtnGrad.addColorStop(0, '#2d0917');
    mtnGrad.addColorStop(0.5, '#1e0510');
    mtnGrad.addColorStop(1, '#0e0208');

    ctx.fillStyle = mtnGrad;
    ctx.beginPath();
    ctx.moveTo(leftBase, baseY);

    // Left curved volcanic flank
    ctx.bezierCurveTo(
      peakX - baseWidth * 0.28, baseY - 60,
      peakX - 90, peakY + 45,
      peakX - 35, peakY + 6
    );

    // Volcanic crater plateau / small crater notch
    ctx.lineTo(peakX - 10, peakY);
    ctx.lineTo(peakX + 15, peakY + 3);
    ctx.lineTo(peakX + 35, peakY + 7);

    // Right curved flank
    ctx.bezierCurveTo(
      peakX + 95, peakY + 45,
      peakX + baseWidth * 0.28, baseY - 60,
      rightBase, baseY
    );

    ctx.lineTo(leftBase, baseY);
    ctx.closePath();
    ctx.fill();

    // 2. Snow Cap with Crimson Sunset Glow
    ctx.save();
    ctx.clip(); // clip to mountain shape

    const snowGrad = ctx.createLinearGradient(peakX, peakY, peakX, peakY + 120);
    snowGrad.addColorStop(0, 'rgba(255, 210, 190, 0.85)'); // Twilight amber snow
    snowGrad.addColorStop(0.3, 'rgba(240, 130, 110, 0.65)');
    snowGrad.addColorStop(0.7, 'rgba(150, 40, 50, 0.3)');
    snowGrad.addColorStop(1, 'rgba(40, 10, 20, 0)');

    ctx.fillStyle = snowGrad;
    ctx.beginPath();
    ctx.moveTo(peakX - 120, peakY + 140);
    // Craggy snow tongues running down valleys
    ctx.lineTo(peakX - 80, peakY + 90);
    ctx.lineTo(peakX - 50, peakY + 125);
    ctx.lineTo(peakX - 20, peakY + 70);
    ctx.lineTo(peakX + 10, peakY + 115);
    ctx.lineTo(peakX + 45, peakY + 85);
    ctx.lineTo(peakX + 85, peakY + 130);
    ctx.lineTo(peakX + 125, peakY + 60);
    ctx.lineTo(peakX + 140, peakY);
    ctx.lineTo(peakX - 140, peakY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawDistantRidges() {
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    // Midground Rolling Hills & Pines
    ctx.save();
    const hillGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
    hillGrad.addColorStop(0, 'rgba(24, 6, 16, 0.95)');
    hillGrad.addColorStop(1, '#080206');

    ctx.fillStyle = hillGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.76);
    ctx.bezierCurveTo(w * 0.25, h * 0.72, w * 0.5, h * 0.8, w * 0.78, h * 0.74);
    ctx.bezierCurveTo(w * 0.9, h * 0.72, w * 0.98, h * 0.75, w, h * 0.77);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Distant pine tree silhouettes on midground ridges
    this.drawPineSilhouette(w * 0.42, h * 0.77, 28);
    this.drawPineSilhouette(w * 0.45, h * 0.78, 22);
    this.drawPineSilhouette(w * 0.72, h * 0.75, 34);
    this.drawPineSilhouette(w * 0.75, h * 0.76, 26);
    this.drawPineSilhouette(w * 0.82, h * 0.75, 38);
    this.drawPineSilhouette(w * 0.86, h * 0.76, 30);

    ctx.restore();
  }

  drawPineSilhouette(x, y, height) {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a0208';
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x - height * 0.35, y);
    ctx.lineTo(x + height * 0.35, y);
    ctx.closePath();
    ctx.fill();

    // Trunk
    ctx.fillRect(x - 1.5, y - 2, 3, 5);
  }

  drawCliffAndRonin() {
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    ctx.save();

    // 1. Rocky Foreground Precipice (Left side, dramatic overlook)
    const cliffWidth = Math.max(w * 0.38, 360);
    const cliffHeight = h * 0.45;
    const cliffY = h - cliffHeight;

    const cliffGrad = ctx.createLinearGradient(0, cliffY, cliffWidth, h);
    cliffGrad.addColorStop(0, '#15050e');
    cliffGrad.addColorStop(0.6, '#0a0207');
    cliffGrad.addColorStop(1, '#040103');

    ctx.fillStyle = cliffGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.lineTo(cliffWidth * 0.35, h * 0.63);
    ctx.lineTo(cliffWidth * 0.65, h * 0.61);
    ctx.lineTo(cliffWidth * 0.85, h * 0.66); // Peak promontory point
    // Jagged cliff face dropping down
    ctx.lineTo(cliffWidth * 0.82, h * 0.72);
    ctx.lineTo(cliffWidth * 0.88, h * 0.78);
    ctx.lineTo(cliffWidth * 0.75, h * 0.88);
    ctx.lineTo(cliffWidth * 0.8, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Windblown wild mountain grass along cliff ledge
    ctx.strokeStyle = '#220815';
    ctx.lineWidth = 1.6;
    const grassStart = cliffWidth * 0.2;
    const grassEnd = cliffWidth * 0.84;
    for (let gx = grassStart; gx < grassEnd; gx += 8) {
      const gy = h * 0.61 + (gx / cliffWidth) * 18;
      const sway = Math.sin(this.time * 4 + gx * 0.1) * 7 - 4; // leaning in wind
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx - 4 + sway, gy - 8, gx - 8 + sway * 1.5, gy - 16);
      ctx.stroke();
    }

    // 2. The Ronin Silhouette on the precipice
    // Standing positioned at cliff point looking right at Mount Yōtei
    const roninX = cliffWidth * 0.68;
    const roninY = h * 0.62;
    const scale = Math.min(w, h) / 750;

    this.drawWandererFigure(roninX, roninY, scale);

    ctx.restore();
  }

  drawWandererFigure(x, y, s) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);

    ctx.fillStyle = '#050104'; // Deep silhouette
    ctx.strokeStyle = '#050104';

    // A. Legs & Hakama
    ctx.beginPath();
    // Front leg firm on rock
    ctx.moveTo(-10, 0);
    ctx.lineTo(-6, -42);
    ctx.lineTo(8, -42);
    ctx.lineTo(12, 0);
    ctx.lineTo(4, 0);
    ctx.lineTo(0, -32);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();

    // B. Torso & Kimono
    ctx.beginPath();
    ctx.moveTo(-12, -42);
    ctx.lineTo(12, -42);
    ctx.lineTo(10, -78);
    ctx.lineTo(-8, -78);
    ctx.closePath();
    ctx.fill();

    // Belt / Obi
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-11, -48);
    ctx.lineTo(11, -48);
    ctx.stroke();

    // C. Katana at Hip (Angled sword scabbard & hilt)
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Scabbard pointing down-backwards
    ctx.moveTo(-3, -50);
    ctx.lineTo(-38, -32);
    ctx.stroke();

    // Katana Hilt (Tsuka) & Guard (Tsuba) pointing forward
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-3, -50);
    ctx.lineTo(12, -58);
    ctx.stroke();

    // Fluttering sword cord (Sageo)
    const cordSway = Math.sin(this.time * 6) * 5;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-12, -46);
    ctx.quadraticCurveTo(-22, -42 + cordSway, -32, -38 + cordSway * 1.5);
    ctx.stroke();
    ctx.restore();

    // D. Flowing Haori / Cape (Procedural billowing cloth in wind)
    // Cape billows backward to the left because wind blows strongly to the left!
    const windT = this.time * 7;
    const wave1 = Math.sin(windT) * 12;
    const wave2 = Math.cos(windT * 1.3) * 16;
    const wave3 = Math.sin(windT * 0.8) * 10;

    ctx.beginPath();
    ctx.moveTo(-8, -75); // shoulder attach
    // Upper cape contour rippling in wind
    ctx.bezierCurveTo(
      -25, -74 + wave1 * 0.4,
      -55, -70 + wave2 * 0.7,
      -85 - wave3 * 0.5, -62 + wave1
    );
    // Trailing cape hem flapping
    ctx.lineTo(-78, -38 + wave2);
    ctx.bezierCurveTo(
      -50, -42 + wave1 * 0.6,
      -28, -44,
      -10, -42
    );
    ctx.closePath();
    ctx.fill();

    // E. Long Scarf / Headband Streamer (Horizontal wind trail)
    const scarfWave = Math.sin(this.time * 9) * 8;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-4, -84); // back of neck
    ctx.bezierCurveTo(
      -25, -86 + scarfWave,
      -55, -84 - scarfWave,
      -75, -80 + scarfWave * 1.4
    );
    ctx.stroke();

    // F. Head & Straw Hat (Jingasa / Amigasa)
    // Traditional wide-brimmed conical hat tilted slightly
    ctx.beginPath();
    ctx.moveTo(18, -88); // front brim
    ctx.lineTo(0, -100); // peak of hat
    ctx.lineTo(-22, -90); // back brim
    ctx.closePath();
    ctx.fill();

    // Hat chin strap
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(8, -88);
    ctx.lineTo(1, -78);
    ctx.lineTo(-6, -88);
    ctx.stroke();

    ctx.restore();
  }

  drawFogLayers() {
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    // 3 Parallax drifting mist layers across valleys
    const mistConfigs = [
      { y: h * 0.68, speed: 0.15, alpha: 0.18, height: 90, color: '240, 90, 60' },
      { y: h * 0.78, speed: 0.35, alpha: 0.22, height: 120, color: '200, 50, 40' },
      { y: h * 0.88, speed: 0.55, alpha: 0.28, height: 140, color: '140, 20, 30' },
    ];

    ctx.save();
    mistConfigs.forEach((cfg, idx) => {
      this.fogOffsets[idx] = (this.fogOffsets[idx] + cfg.speed) % (w * 2);
      const off = this.fogOffsets[idx];

      const grad = ctx.createLinearGradient(0, cfg.y - cfg.height, 0, cfg.y + cfg.height);
      grad.addColorStop(0, `rgba(${cfg.color}, 0)`);
      grad.addColorStop(0.5, `rgba(${cfg.color}, ${cfg.alpha})`);
      grad.addColorStop(1, `rgba(${cfg.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-w, cfg.y);

      // Rolling sine fog wave
      for (let x = -w; x <= w * 2; x += 60) {
        const wave = Math.sin((x + off) * 0.005) * 25 + Math.cos((x + off) * 0.012) * 15;
        ctx.lineTo(x, cfg.y + wave);
      }
      ctx.lineTo(w * 2, h);
      ctx.lineTo(-w, h);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  drawEmbers() {
    const ctx = this.ctx;
    ctx.save();
    for (const ember of this.embers) {
      ember.x += ember.vx + Math.sin(this.time * 2 + ember.y * 0.01) * 0.6;
      ember.y += ember.vy;
      ember.alpha -= ember.decay;

      if (ember.alpha <= 0 || ember.y < 0 || ember.x < 0) {
        ember.x = Math.random() * this.width;
        ember.y = this.height + 10;
        ember.alpha = Math.random() * 0.8 + 0.3;
        ember.vy = -(Math.random() * 1.8 + 0.6);
      }

      ctx.fillStyle = `rgba(255, ${Math.floor(120 + Math.random() * 80)}, 30, ${ember.alpha})`;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawLeaves() {
    const ctx = this.ctx;

    for (let i = 0; i < this.leaves.length; i++) {
      const leaf = this.leaves[i];

      // Natural flight & wind turbulence
      leaf.swing += leaf.swingSpeed;
      const windForce = this.wind.base + this.wind.gust;
      leaf.x += leaf.vx - windForce + Math.sin(leaf.swing) * leaf.swingAmp;
      leaf.y += leaf.vy + Math.cos(leaf.swing) * 0.6;

      // Tumbling physics (3D flip illusion using scaleX)
      leaf.rotation += leaf.rotSpeed;
      leaf.tilt += leaf.tiltSpeed;
      const scaleX = Math.cos(leaf.tilt);

      // Drag decay
      leaf.vx *= 0.985;
      leaf.vy = leaf.vy * 0.98 + (Math.random() * 0.02);

      // Wrap around screen
      if (leaf.x < -60 || leaf.y > this.height + 60) {
        this.leaves[i] = this.createLeaf(false);
        this.leaves[i].x = this.width + 40;
      }

      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.scale(scaleX, 1);

      this.drawMomijiShape(ctx, leaf.size, leaf.color);

      ctx.restore();
    }
  }

  drawMomijiShape(ctx, size, color) {
    // 5-Pointed Japanese Maple Leaf (Momiji)
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(0, size * 0.7); // Stem base
    ctx.lineTo(0, size * 0.2);

    // 5 Lobes: Bottom Left, Top Left, Center Peak, Top Right, Bottom Right
    const lobes = [
      { angle: -Math.PI * 0.65, length: size * 0.7 },
      { angle: -Math.PI * 0.58, length: size * 0.95 },
      { angle: -Math.PI * 0.5, length: size * 1.15 }, // Center peak
      { angle: -Math.PI * 0.42, length: size * 0.95 },
      { angle: -Math.PI * 0.35, length: size * 0.7 },
    ];

    for (const lobe of lobes) {
      const lx = Math.cos(lobe.angle) * lobe.length;
      const ly = Math.sin(lobe.angle) * lobe.length;
      ctx.quadraticCurveTo(lx * 0.5, ly * 0.5, lx, ly);
      ctx.lineTo(0, size * 0.15);
    }

    ctx.closePath();
    ctx.fill();

    // Delicate leaf vein
    ctx.strokeStyle = 'rgba(255, 220, 180, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.lineTo(0, -size * 0.9);
    ctx.stroke();
  }
}

