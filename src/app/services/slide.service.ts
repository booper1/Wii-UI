import { inject, Injectable, OnDestroy } from '@angular/core';
import { CHANNELS, EMPTY_CHANNEL } from '../constants/channels.data';
import { Channel } from '../models/channel.model';
import { DisplayService } from './display.service';

@Injectable({ providedIn: 'root' })
export class SlideService implements OnDestroy {
  private displayService = inject(DisplayService);

  private readonly MIN_SLIDES: number = 5;
  private transitionDurationMs: number = 0;

  public slideDeck: Channel[][] = [];
  public currentSlideIndex: number = 1;
  public canSlideLeft: boolean = false;
  public canSlideRight: boolean = false;
  public isAnimating: boolean = false;

  public readonly allChannels: Channel[] = [...CHANNELS];

  private channelCapacity: number = 1;

  private keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') this.nextSlide();
    if (event.key === 'ArrowLeft') this.prevSlide();
  };

  constructor() {
    // Populate slide / channel data
    this.slideDeck = this.buildSlides(this.allChannels);

    this.initializeSliding();
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keydownHandler);
  }

  private buildSlides(channels: Channel[]): Channel[][] {
    const slides: Channel[][] = [];
    const totalSlides = Math.max(
      Math.ceil(channels.length / this.channelCapacity),
      this.MIN_SLIDES,
    );

    // 1 empty slide to pad the start
    slides.push([]);

    for (let i = 0; i < totalSlides; i++) {
      const start = i * this.channelCapacity;
      const end = start + this.channelCapacity;
      const slice = channels.slice(start, end);

      // Fill remaining space with empty channels
      while (slice.length < this.channelCapacity) {
        slice.push(EMPTY_CHANNEL);
      }

      slides.push(slice);
    }

    // 1 more empty slide to pad the end
    slides.push([]);

    return slides;
  }

  public updateForResize(): void {
    this.channelCapacity = this.displayService.channelGrid().capacity;
    this.slideDeck = this.buildSlides(this.allChannels);

    this.currentSlideIndex =
      this.currentSlideIndex <= this.slideDeck.length - 2
        ? this.currentSlideIndex
        : this.slideDeck.length - 2;

    this.updateNavigation(true);
    this.displayService.configureSlideDeck(this.slideDeck.length);
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
    window.addEventListener('keydown', this.keydownHandler);
  }

  private updateNavigation(blockAnimation: boolean = false): void {
    this.canSlideRight = this.currentSlideIndex < this.slideDeck.length - 2;
    this.canSlideLeft = this.currentSlideIndex > 1;

    if (!blockAnimation) {
      this.isAnimating = true;
      setTimeout(() => (this.isAnimating = false), this.transitionDurationMs);
    }
  }

  public nextSlide(): void {
    if (!this.isAnimating && this.canSlideRight) {
      this.currentSlideIndex++;
      this.updateNavigation();
    }
  }

  public prevSlide(): void {
    if (!this.isAnimating && this.canSlideLeft) {
      this.currentSlideIndex--;
      this.updateNavigation();
    }
  }
}
