import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { WiiUi } from './components/wii-ui/wii-ui';
import { TIMING } from './constants/timing-variables';

@Component({
  selector: 'app-root',
  imports: [WiiUi],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  constructor() {
    gsap.set(document.documentElement, {
      '--zoomTransitionDurationMs': `${TIMING.ZOOM_TRANSITION_DURATION}ms`,
    });
    gsap.set(document.documentElement, {
      '--slideTransitionDurationMs': `${TIMING.SLIDE_TRANSITION_DURATION}ms`,
    });
    gsap.set(document.documentElement, {
      '--arrowSlideInDurationMs': `${TIMING.ARROW_SLIDE_IN_DURATION}ms`,
    });
    gsap.set(document.documentElement, {
      '--clockTitleSwapDurationMs': `${TIMING.CLOCK_TITLE_SWAP_DURATION}ms`,
    });

    // INTRO VARS
    gsap.set(document.documentElement, {
      '--introStartDelayMs': `${TIMING.INTRO_START_DELAY}ms`,
    });
    gsap.set(document.documentElement, {
      '--introRippleStepDelayMs': `${TIMING.INTRO_RIPPLE_STEP_DELAY}ms`,
    });
    gsap.set(document.documentElement, {
      '--introRippleFadeInMs': `${TIMING.INTRO_RIPPLE_FADE_IN}ms`,
    });
    gsap.set(document.documentElement, {
      '--introRippleHoldMs': `${TIMING.INTRO_RIPPLE_HOLD}ms`,
    });
    gsap.set(document.documentElement, {
      '--introRippleFadeOutMs': `${TIMING.INTRO_RIPPLE_FADE_OUT}ms`,
    });
    gsap.set(document.documentElement, {
      '--introEndDelayMs': `${TIMING.INTRO_END_DELAY}ms`,
    });
    gsap.set(document.documentElement, {
      '--introFadeOutMs': `${TIMING.INTRO_FADE_OUT}ms`,
    });
  }

  // Pause animations so that they don't run while the tab is inactive
  // Primarily for the intro sequence
  ngOnInit() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.documentElement.classList.add('paused-animations');
      } else {
        document.documentElement.classList.remove('paused-animations');
      }
    });
  }
}
