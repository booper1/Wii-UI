import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CHANNELS, EMPTY_CHANNEL } from '../constants/channels.data';
import { Channel } from '../models/channel.model';
import { DisplayService } from './display.service';

@Injectable({ providedIn: 'root' })
export class SlideService {
  private displayService: DisplayService = inject(DisplayService);

  private readonly MIN_SLIDES: number = 10;
  private slideTransitionDuration: number = 0;

  public slideDeck: WritableSignal<Channel[][]> = signal<Channel[][]>([]);
  public currentSlideIndex: WritableSignal<number> = signal(1);
  public currentSlideDeckSvgIndex: WritableSignal<number> = signal(0);
  public canSlideLeft: WritableSignal<boolean> = signal(false);
  public canSlideRight: WritableSignal<boolean> = signal(false);
  public isAnimating: WritableSignal<boolean> = signal(false);

  public readonly allChannels: Channel[] = [...CHANNELS];

  private channelCapacity: number = 1;

  private keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') this.nextSlide();
    if (event.key === 'ArrowLeft') this.prevSlide();
  };

  constructor() {
    this.slideDeck.set(this.buildSlides(this.allChannels));
    this.initializeSliding();
  }

  private buildSlides(channels: Channel[]): Channel[][] {
    const slides: Channel[][] = [];
    const totalSlides: number = Math.max(Math.ceil(channels.length / this.channelCapacity), this.MIN_SLIDES);

    // 1 empty slide to pad the start
    slides.push([]);

    let emptyChannelIndex = 0;
    for (let i = 0; i < totalSlides; i++) {
      const start: number = i * this.channelCapacity;
      const end: number = start + this.channelCapacity;
      const slice: Channel[] = channels.slice(start, end);

      // Fill remaining space with empty channels
      while (slice.length < this.channelCapacity) {
        const empty = { ...EMPTY_CHANNEL, id: `empty-${emptyChannelIndex++}` };
        slice.push(empty);
      }

      slides.push(slice);
    }

    // 1 more empty slide to pad the end
    slides.push([]);

    return slides;
  }

  public updateForResize(): void {
    this.channelCapacity = this.displayService.channelGrid().capacity;
    this.slideDeck.set(this.buildSlides(this.allChannels));

    this.currentSlideIndex.set(
      this.currentSlideIndex() <= this.slideDeck().length - 2 ? this.currentSlideIndex() : this.slideDeck().length - 2,
    );

    this.currentSlideDeckSvgIndex.set((this.slideDeck().length - 1) / 2);

    this.updateNavigation(true);
    this.displayService.configureSlideDeck(this.slideDeck().length);
  }

  private initializeSliding(): void {
    // Configure initial navigation
    this.updateNavigation(true);

    // Prevent spamming through slides
    this.slideTransitionDuration = this.displayService.parseCssDuration('--slideTransitionDuration');

    // Change slides on arrow keys
    window.addEventListener('keydown', this.keydownHandler);
  }

  private updateNavigation(blockAnimation: boolean = false): void {
    this.canSlideRight.set(this.currentSlideIndex() < this.slideDeck().length - 2);
    this.canSlideLeft.set(this.currentSlideIndex() > 1);

    if (!blockAnimation) {
      this.isAnimating.set(true);
      setTimeout(() => {
        this.isAnimating.set(false);
        this.currentSlideDeckSvgIndex.set((this.slideDeck().length - 1) / 2);
      }, this.slideTransitionDuration);
    }
  }

  public nextSlide(): void {
    if (!this.isAnimating() && this.canSlideRight()) {
      this.currentSlideIndex.update((i) => i + 1);
      this.currentSlideDeckSvgIndex.update((i) => i + 1);
      this.updateNavigation();
    }
  }

  public prevSlide(): void {
    if (!this.isAnimating() && this.canSlideLeft()) {
      this.currentSlideIndex.update((i) => i - 1);
      this.currentSlideDeckSvgIndex.update((i) => i - 1);
      this.updateNavigation();
    }
  }
}
