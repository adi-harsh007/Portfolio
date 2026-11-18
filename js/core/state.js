/**
 * Central State Model for "Path of the Ronin" Portfolio
 */

export const state = {
  // Realm & Progression
  currentRealmIndex: 0,
  maxRealmReached: 0,
  transition: {
    active: false,
    progress: 0,      // 0 to 1
    phase: 'idle',    // 'idle' | 'out' | 'in'
    targetRealm: null
  },

  // Camera
  camera: {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    shake: 0
  },

  // Player Physics & Samurai Animation State
  player: {
    x: 240,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1, // 1: right, -1: left
    isGrounded: true,
    animState: 'IDLE', // 'IDLE' | 'WALK' | 'JUMP' | 'BOW'
    animTimer: 0,
    bowTimer: 0,
    // Cloth / Cape Physics Nodes (Verlet rope nodes)
    cape: [
      { x: 240, y: 0, oldX: 240, oldY: 0 },
      { x: 235, y: 10, oldX: 235, oldY: 10 },
      { x: 230, y: 22, oldX: 230, oldY: 22 },
      { x: 222, y: 35, oldX: 222, oldY: 35 },
      { x: 215, y: 48, oldX: 215, oldY: 48 }
    ]
  },

  // Input State
  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    sprint: false,
    interact: false
  },

  // Interactions & Discovery
  collectedLeaves: [], // Array of leaf IDs
  activeObject: null,  // Nearest interactable object
  detailPanel: {
    open: false,
    projectKey: null,
    sourceObject: null
  },
  pauseMenuOpen: false,

  // Ambient Particles & Environmental Effects
  particles: [],
  leaves: [],
  embers: [],
  stars: [],
  lanterns: [],

  // Audio Settings
  audioEnabled: false,

  // Guided Journey (Autopilot Recruiter Tour)
  guidedJourney: {
    active: false,
    step: 0,
    timer: 0
  },

  // Live Sandboxes Sub-States
  derma: {
    sampleIndex: 0,
    viewMode: 'gradcam', // 'raw' | 'ood' | 'gradcam'
    heatmapOpacity: 80,
    reviewThreshold: 23.6
  },
  eventify: {
    rowLockEnabled: true,
    redisEnabled: true,
    seatsRemaining: 3,
    simLogs: ['Ready: 3 VIP seats available. Toggle SELECT ... FOR UPDATE and simulate concurrency.'],
    lastLatencyMs: 11
  },
  medistore: {
    activeStep: 2,
    tamperAttack: false
  },
  thermopack: {
    schemaView: 'normalized', // 'excel' | 'normalized'
    statusFilter: 'ALL',
    searchQuery: ''
  },
  rpg: {
    categoryFilter: 'All',
    equippedIds: ['py', 'ts', 'react', 'fastapi', 'pytorch', 'postgres']
  }
};
