import { Injectable } from '@angular/core';
import { CHANNELS, EMPTY_CHANNEL } from '../data/channels.data';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class SlideService {
  private readonly MIN_SLIDES: number = 5;
  private readonly CHANNELS_PER_SLIDE: number = 12;
  private isAnimating: boolean = false;
  private transitionDurationMs: number = 0;

  public slideDeck: Channel[][] = [];
  public currentSlideIndex: number = 0;
  public canSlideLeft: boolean = false;
  public canSlideRight: boolean = false;

  constructor() {
    // Populate slide / channel data
    this.slideDeck = this.buildSlides([...CHANNELS]);

    this.initializeSliding();
  }

  private buildSlides(channels: Channel[]): Channel[][] {
    const result: Channel[][] = [];
    const totalSlides = Math.max(
      Math.ceil(channels.length / this.CHANNELS_PER_SLIDE),
      this.MIN_SLIDES,
    );

    for (let i = 0; i < totalSlides; i++) {
      const start = i * this.CHANNELS_PER_SLIDE;
      const end = start + this.CHANNELS_PER_SLIDE;
      const slice = channels.slice(start, end);

      // Fill remaining space with empty channels
      while (slice.length < this.CHANNELS_PER_SLIDE) {
        slice.push(EMPTY_CHANNEL);
      }

      result.push(slice);
    }

    return result;
  }

  private initializeSliding(): void {
    // Configure initial navigation
    this.updateNavigation(true);

    // Prevent spamming through slides
    const duration = getComputedStyle(document.documentElement)
      .getPropertyValue('--slideTransitionDuration')
      .trim();
    this.transitionDurationMs = parseFloat(duration) * 1000;

    // Change slides on arrow keys
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') this.nextSlide();
      if (event.key === 'ArrowLeft') this.prevSlide();
    });
  }

  private updateNavigation(initializing: boolean = false): void {
    this.canSlideRight = this.currentSlideIndex < this.slideDeck.length - 1;
    this.canSlideLeft = this.currentSlideIndex > 0;

    if (!initializing) {
      this.isAnimating = true;
      setTimeout(() => (this.isAnimating = false), this.transitionDurationMs);
    }
  }

  public nextSlide() {
    if (!this.isAnimating && this.canSlideRight) {
      this.currentSlideIndex++;
      this.updateNavigation();
    }
  }

  public prevSlide() {
    if (!this.isAnimating && this.canSlideLeft) {
      this.currentSlideIndex--;
      this.updateNavigation();
    }
  }
}
