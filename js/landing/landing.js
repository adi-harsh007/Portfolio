/**
 * Ghost of Yōtei Landing Page Controller
 * Manages canvas initialization, procedural audio triggers,
 * keyboard shortcuts, cinematic menu animations, and page transitions.
 */

import { YoteiCanvas } from './canvas.js';
import { YoteiAudio } from './audio.js';

class LandingController {
  constructor() {
    this.canvasEl = document.getElementById('yoteiCanvas');
    this.audio = new YoteiAudio();
    this.canvas = null;

    this.menuItems = Array.from(document.querySelectorAll('.yotei-menu-item'));
    this.activeIndex = 0;
    this.isTransitioning = false;

    this.soundToggleBtn = document.getElementById('soundToggle');
    this.audioPrompt = document.getElementById('audioPrompt');

    this.init();
  }

  init() {
    // 1. Start Canvas
    if (this.canvasEl) {
      this.canvas = new YoteiCanvas(this.canvasEl);
    }

    // 2. Setup Audio Activation on First Interaction
    const unlockAudio = () => {
      this.audio.ensureContext();
      if (this.audioPrompt) {
        this.audioPrompt.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => this.audioPrompt.remove(), 600);
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // 3. Sound Toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = this.audio.toggleMute();
        this.soundToggleBtn.innerHTML = muted
          ? '<span class="text-neutral-500">[ 音: OFF ]</span>'
          : '<span class="text-amber-400">[ 音: ON ]</span>';
      });
    }

    // 4. Menu Item Mouse Events
    this.menuItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        if (this.isTransitioning) return;
        this.setActiveIndex(index);
        this.audio.playBladeSlash();
      });

      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectItem(item);
      });
    });

    // 5. Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      if (this.isTransitioning) return;

      const key = e.key;

      if (key === '1' || key === '2' || key === '3' || key === '4') {
        const idx = parseInt(key, 10) - 1;
        if (this.menuItems[idx]) {
          this.setActiveIndex(idx);
          this.selectItem(this.menuItems[idx]);
        }
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        e.preventDefault();
        const next = (this.activeIndex + 1) % this.menuItems.length;
        this.setActiveIndex(next);
        this.audio.playBladeSlash();
      } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        e.preventDefault();
        const prev = (this.activeIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.setActiveIndex(prev);
        this.audio.playBladeSlash();
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        if (this.menuItems[this.activeIndex]) {
          this.selectItem(this.menuItems[this.activeIndex]);
        }
      } else if (key === 'm' || key === 'M') {
        if (this.soundToggleBtn) this.soundToggleBtn.click();
      }
    });

    // Initial focus styling
    this.updateMenuHighlight();
  }

  setActiveIndex(index) {
    this.activeIndex = index;
    this.updateMenuHighlight();
  }

  updateMenuHighlight() {
    this.menuItems.forEach((item, idx) => {
      const isSelected = idx === this.activeIndex;
      item.classList.toggle('active', isSelected);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  selectItem(item) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const href = item.getAttribute('href');
    this.audio.playTaikoDrum();

    // Visual slash feedback
    item.classList.add('selected');
    const flash = document.getElementById('cinematicFlash');
    if (flash) {
      flash.classList.remove('opacity-0', 'pointer-events-none');
      flash.classList.add('opacity-90');
    }

    // Smooth navigation delay to allow Taiko boom & flash to register
    setTimeout(() => {
      if (href && href !== '#') {
        window.location.href = href;
      } else {
        this.isTransitioning = false;
        if (flash) {
          flash.classList.remove('opacity-90');
          flash.classList.add('opacity-0', 'pointer-events-none');
        }
      }
    }, 550);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new LandingController();
});

