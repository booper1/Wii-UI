import {
  afterNextRender,
  computed,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CHANNELS, EMPTY_CHANNEL } from '../constants/channels.data';
import { Channel } from '../models/channel.model';
import { DisplayService } from './display.service';
import { ZoomService } from './zoom.service';

@Injectable({ providedIn: 'root' })
export class SlideService {
  private displayService: DisplayService = inject(DisplayService);
  private zoomService: ZoomService = inject(ZoomService);
  private environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);

  private readonly MIN_SLIDES: number = 3;

  public slideDeck: WritableSignal<Channel[][]> = signal<Channel[][]>([]);
  public currentSlideIndex: WritableSignal<number> = signal(1);
  public currentSlideDeckSvgIndex: WritableSignal<number> = signal(0);
  public canSlideLeft: WritableSignal<boolean> = signal(false);
  public canSlideRight: WritableSignal<boolean> = signal(false);
  public isAnimating: WritableSignal<boolean> = signal(false);
  public tempSlideIndex: WritableSignal<number> = signal(1);

  public readonly canZoomChannelLeft: Signal<boolean> = computed(() => {
    return (
      this.zoomService.zoomState() === 'zoomedIn' &&
      this.allChannels.findIndex((c) => c.id === this.zoomService.activeChannelId()) !== 0
    );
  });

  public readonly canZoomChannelRight: Signal<boolean> = computed(() => {
    return (
      this.zoomService.zoomState() === 'zoomedIn' &&
      this.allChannels.findIndex((c) => c.id === this.zoomService.activeChannelId()) !== this.allChannels.length - 1
    );
  });

  public readonly allChannels: Channel[] = [...CHANNELS];

  private channelCapacity: number = 1;

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
        const empty = { ...EMPTY_CHANNEL, id: `${EMPTY_CHANNEL.id}-${emptyChannelIndex++}` };
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

    if (this.zoomService.activeChannelId()) {
      const zoomChannelIndex = this.allChannels.findIndex((c) => c.id === this.zoomService.activeChannelId());
      this.currentSlideIndex.set(Math.floor(zoomChannelIndex / this.channelCapacity) + 1);
    } else {
      this.currentSlideIndex.set(
        this.currentSlideIndex() <= this.slideDeck().length - 2
          ? this.currentSlideIndex()
          : this.slideDeck().length - 2,
      );
    }

    this.currentSlideDeckSvgIndex.set((this.slideDeck().length - 1) / 2);

    this.updateNavigation(true);
    this.displayService.configureSlideDeck(this.slideDeck().length);
  }

  private initializeSliding(): void {
    // Configure initial navigation
    this.updateNavigation(true);
    this.tempSlideIndex.set(this.currentSlideIndex());
  }

  private updateNavigation(blockAnimation: boolean = false): void {
    this.canSlideRight.set(this.currentSlideIndex() < this.slideDeck().length - 2);
    this.canSlideLeft.set(this.currentSlideIndex() > 1);

    if (!blockAnimation) {
      this.isAnimating.set(true);
    } else {
      this.currentSlideDeckSvgIndex.set((this.slideDeck().length - 1) / 2);
    }
  }

  public prevSlide(blockAnimation: boolean = false): void {
    if (!this.isAnimating() && this.canSlideLeft()) {
      this.tempSlideIndex.set(this.currentSlideIndex());
      this.currentSlideIndex.update((i) => i - 1);
      this.currentSlideDeckSvgIndex.update((i) => i - 1);
      this.updateNavigation(blockAnimation);
    }
  }

  public nextSlide(blockAnimation: boolean = false): void {
    if (!this.isAnimating() && this.canSlideRight()) {
      this.tempSlideIndex.set(this.currentSlideIndex());
      this.currentSlideIndex.update((i) => i + 1);
      this.currentSlideDeckSvgIndex.update((i) => i + 1);
      this.updateNavigation(blockAnimation);
    }
  }

  public prevZoomedChannel(): void {
    if (this.canZoomChannelLeft()) {
      const currentId = this.zoomService.activeChannelId();

      if (currentId) {
        const currentIndex = this.allChannels.findIndex((c) => c.id === currentId);

        if (currentIndex > 0) {
          if (currentIndex % this.channelCapacity === 0) {
            this.prevSlide(true);
          }

          // Ensure rect is read after the DOM reflow completes
          runInInjectionContext(this.environmentInjector, () => {
            afterNextRender(() => {
              this.zoomService.setActiveChannel(this.allChannels[currentIndex - 1].id);
            });
          });
        }
      }
    }
  }

  public nextZoomedChannel(): void {
    if (this.canZoomChannelRight()) {
      const currentId = this.zoomService.activeChannelId();

      if (currentId) {
        const currentIndex = this.allChannels.findIndex((c) => c.id === currentId);
        if (currentIndex > -1 && currentIndex !== this.allChannels.length - 1) {
          if ((currentIndex + 1) % this.channelCapacity === 0) {
            this.nextSlide(true);
          }

          // Ensure rect is read after the DOM reflow completes
          runInInjectionContext(this.environmentInjector, () => {
            afterNextRender(() => {
              this.zoomService.setActiveChannel(this.allChannels[currentIndex + 1].id);
            });
          });
        }
      }
    }
  }
}
