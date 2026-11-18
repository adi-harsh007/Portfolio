/**
 * 2D Platformer Physics & Cloth Verlet Engine for "Path of the Ronin"
 */

import { state } from '../core/state.js';
import { REALMS, REALM_OBJECTS } from '../config/data.js';
import { gameAudio } from '../core/gameAudio.js';

// Evaluate ground Y coordinate for a given realm and X coordinate
export function getTerrainHeight(realmIndex, x, canvasHeight) {
  const baseFloor = canvasHeight - 110;

  if (realmIndex === 0) {
    // Mountain Path: gentle rolling cliff edge
    const hill = Math.sin(x * 0.0025) * 22 + Math.cos(x * 0.006) * 8;
    return baseFloor + hill;
  } else if (realmIndex === 1) {
    // Healer's Garden: tranquil mossy terraces
    const terrace = Math.sin(x * 0.002) * 16 + Math.sin(x * 0.008) * 6;
    return baseFloor + terrace;
  } else if (realmIndex === 2) {
    // Festival Grounds: wooden boardwalk & arched bridges
    let bridgeY = 0;
    if (x > 1200 && x < 2100) {
      // Arched festival drum bridge
      const p = (x - 1200) / 900;
      bridgeY = -Math.sin(p * Math.PI) * 45;
    }
    return baseFloor + bridgeY;
  } else if (realmIndex === 3) {
    // Merchant's Vault: stone pavilion floor with raised dais
    let dais = 0;
    if (x > 1400 && x < 1900) dais = -26;
    return baseFloor + dais;
  } else {
    // Summit: craggy peak ascending toward the right
    const ascend = -((x / 3200) * 80) + Math.sin(x * 0.003) * 14;
    return baseFloor + ascend;
  }
}

export function updatePhysics(canvasHeight) {
  if (state.detailPanel.open || state.pauseMenuOpen) {
    state.player.vx = 0;
    return;
  }

  const currentRealm = REALMS[state.currentRealmIndex] || REALMS[0];
  const worldW = currentRealm.width;
  const p = state.player;

  // 1. Horizontal Movement & Input Handling
  const speed = state.keys.sprint ? 7.0 : 4.4;
  let isMoving = false;

  if (state.keys.left && !state.keys.right) {
    p.vx = -speed;
    p.facing = -1;
    isMoving = true;
  } else if (state.keys.right && !state.keys.left) {
    p.vx = speed;
    p.facing = 1;
    isMoving = true;
  } else {
    p.vx *= 0.72; // Snappy ground friction
    if (Math.abs(p.vx) < 0.1) p.vx = 0;
  }

  // 2. Jump Impulse
  if (state.keys.up && p.isGrounded) {
    p.vy = -11.2;
    p.isGrounded = false;
    p.animState = 'JUMP';
    gameAudio.playJump();
  }

  // 3. Gravity & Vertical Movement
  const gravity = 0.54;
  p.vy += gravity;
  if (p.vy > 14) p.vy = 14; // Terminal fall velocity

  p.x += p.vx;
  p.y += p.vy;

  // Realm Boundaries
  p.x = Math.max(80, Math.min(worldW - 80, p.x));

  // 4. Ground Collision
  const groundY = getTerrainHeight(state.currentRealmIndex, p.x, canvasHeight);
  if (p.y >= groundY) {
    p.y = groundY;
    p.vy = 0;
    p.isGrounded = true;
  } else {
    p.isGrounded = false;
  }

  // 5. Animation State Machine
  p.animTimer++;
  if (!p.isGrounded) {
    p.animState = 'JUMP';
  } else if (p.bowTimer > 0) {
    p.animState = 'BOW';
    p.bowTimer--;
  } else if (isMoving) {
    p.animState = 'WALK';
    // Footstep rhythm (crunch every 14 frames)
    if (p.animTimer % 14 === 0) {
      gameAudio.playFootstep();
    }
  } else {
    p.animState = 'IDLE';
  }

  // 6. Cloth / Haori Verlet Physics
  updateCapePhysics(p);

  // 7. Object Proximity Detection
  checkNearbyObjects();
}

// 5-Node Verlet Rope for the Ronin's Windblown Cloak
function updateCapePhysics(p) {
  const cape = p.cape;
  if (!cape || cape.length === 0) return;

  // Pin root node to ronin's neck/shoulders
  const rootX = p.x - p.facing * 10;
  const rootY = p.y - 48;
  cape[0].x = rootX;
  cape[0].y = rootY;

  // Wind influence
  const windForce = 0.6 + Math.sin(p.animTimer * 0.05) * 0.4;
  const moveDrag = -p.vx * 0.8;

  for (let i = 1; i < cape.length; i++) {
    const node = cape[i];
    const vx = (node.x - node.oldX) * 0.82;
    const vy = (node.y - node.oldY) * 0.82;

    node.oldX = node.x;
    node.oldY = node.y;

    node.x += vx + (moveDrag - p.facing * windForce * 1.5) * (i * 0.3);
    node.y += vy + 0.35; // gentle gravity on fabric
  }

  // Constraint iterations (maintain segment lengths ~11px)
  const segmentLen = 11;
  for (let iter = 0; iter < 3; iter++) {
    for (let i = 0; i < cape.length - 1; i++) {
      const n1 = cape[i];
      const n2 = cape[i + 1];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const diff = (dist - segmentLen) / dist;

      if (i === 0) {
        n2.x -= dx * diff;
        n2.y -= dy * diff;
      } else {
        n1.x += dx * diff * 0.5;
        n1.y += dy * diff * 0.5;
        n2.x -= dx * diff * 0.5;
        n2.y -= dy * diff * 0.5;
      }
    }
  }
}

// Proximity detection for scrolls, shrines, and collectible momiji leaves
function checkNearbyObjects() {
  const p = state.player;
  const currentObjects = REALM_OBJECTS.filter(o => o.realmIndex === state.currentRealmIndex);
  let closest = null;
  let closestDist = Infinity;

  for (const obj of currentObjects) {
    const dist = Math.abs(p.x - obj.x);

    // Auto-collect maple leaves on touch (radius 48px)
    if (obj.type === 'leaf' && dist < 48) {
      if (!state.collectedLeaves.includes(obj.id)) {
        state.collectedLeaves.push(obj.id);
        gameAudio.playKotoNote(8);
        // Spawn sparkle particles
        for (let i = 0; i < 14; i++) {
          state.particles.push({
            x: obj.x + (Math.random() - 0.5) * 30,
            y: p.y - 40 + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 3,
            vy: -1.5 - Math.random() * 2,
            life: 30 + Math.random() * 15,
            color: '#f59e0b',
            size: 3 + Math.random() * 2
          });
        }
      }
      continue;
    }

    // Proximity range for scrolls & shrines (radius 85px)
    if (dist < 85 && dist < closestDist) {
      closestDist = dist;
      closest = obj;
    }
  }

  state.activeObject = closest;
}

