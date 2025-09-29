import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { EMPTY_CHANNEL } from '../../constants/channels.data';
import { Channel } from '../../models/channel.model';
import { DisplayService } from '../../services/display.service';
import { SlideService } from '../../services/slide.service';
import { ZoomService } from '../../services/zoom.service';
import { BottomShelfComponent } from '../bottom-shelf/bottom-shelf';
import { SlideDeckComponent } from '../slide-deck/slide-deck';
import { SlideComponent } from '../slide-deck/slide/slide';
import { ZoomOverlayComponent } from '../zoom-overlay/zoom-overlay';

@Component({
  selector: 'app-wii-ui',
  imports: [SlideDeckComponent, BottomShelfComponent, SlideComponent, ZoomOverlayComponent],
  templateUrl: './wii-ui.html',
  styleUrls: ['./wii-ui.scss'],
})
export class WiiUi implements OnInit, OnDestroy {
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);
  protected zoomService: ZoomService = inject(ZoomService);

  protected introChannels: Channel[] = [];
  protected introFadeOutDelayMs: number = 0;
  protected isIntroComplete: WritableSignal<boolean> = signal(false);

  protected readonly canArrowLeft: Signal<boolean> = computed(() => {
    if (!this.zoomService.isZoomActive()) {
      return this.slideService.canSlideLeft();
    } else {
      return this.slideService.canZoomChannelLeft();
    }
  });

  protected readonly canArrowRight: Signal<boolean> = computed(() => {
    if (!this.zoomService.isZoomActive()) {
      return this.slideService.canSlideRight();
    } else {
      return this.slideService.canZoomChannelRight();
    }
  });

  private readonly keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      this.arrowLeft();
    }
    if (event.key === 'ArrowRight') {
      this.arrowRight();
    }
    if (event.key === 'Escape') {
      this.zoomService.zoomOut();
    }
  };

  ngOnInit(): void {
    this.renderSlideDeck();
    for (let i = 0; i < this.displayService.channelGrid().capacity; i++) {
      const empty = { ...EMPTY_CHANNEL, id: `empty-intro-${i}` };
      this.introChannels.push(empty);
    }

    this.initializeIntroAnimation();

    // Change slides on arrow keys
    window.addEventListener('keydown', this.keydownHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keydownHandler);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.renderSlideDeck();
  }

  private initializeIntroAnimation(): void {
    const gridCols: number = this.displayService.channelGrid().cols;
    const rows: number[] = this.introChannels.map((_, i) => Math.floor(i / gridCols));
    const colsArr: number[] = this.introChannels.map((_, i) => i % gridCols);

    const startDelay: number = parseFloat(this.displayService.cssVar('--introStartDelayMs'));
    const rippleStepDelay: number = parseFloat(this.displayService.cssVar('--introRippleStepDelayMs'));
    const rippleDuration: number =
      parseFloat(this.displayService.cssVar('--introRippleFadeInMs')) +
      parseFloat(this.displayService.cssVar('--introRippleHoldMs')) +
      parseFloat(this.displayService.cssVar('--introRippleFadeOutMs'));
    const endDelay: number = parseFloat(this.displayService.cssVar('--introEndDelayMs'));
    const fadeOut: number = parseFloat(this.displayService.cssVar('--introFadeOutMs'));

    const maxDiagonal: number = Math.max(...rows.map((r, i) => r + colsArr[i]));
    this.introFadeOutDelayMs = startDelay + maxDiagonal * rippleStepDelay + rippleDuration + endDelay;
    this.displayService.introTotalTime.set(this.introFadeOutDelayMs + fadeOut);

    setTimeout(() => {
      this.isIntroComplete.set(true);
    }, this.introFadeOutDelayMs + fadeOut);
  }

  private renderSlideDeck(): void {
    this.displayService.updateViewport();
    this.slideService.updateForResize();
    this.displayService.configureSlideDeck(this.slideService.slideDeck().length);
  }

  protected arrowLeft(): void {
    if (!this.zoomService.isZoomActive()) {
      this.slideService.prevSlide();
    } else {
      this.slideService.prevZoomedChannel();
    }
  }

  protected arrowRight(): void {
    if (!this.zoomService.isZoomActive()) {
      this.slideService.nextSlide();
    } else {
      this.slideService.nextZoomedChannel();
    }
  }
}
