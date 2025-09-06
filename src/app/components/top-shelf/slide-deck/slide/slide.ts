import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Channel } from '../../../../models/channel.model';
import { DisplayService } from '../../../../services/display.service';
import { SlideService } from '../../../../services/slide.service';
import { ChannelComponent } from './channel/channel';
import { ClockComponent } from './clock/clock';

type ShowHideElement = {
  isHidden: boolean;
  timer?: ReturnType<typeof setTimeout>;
};

@Component({
  selector: 'app-slide',
  imports: [CommonModule, ChannelComponent, ClockComponent],
  templateUrl: './slide.html',
  styleUrls: ['./slide.scss'],
})
export class SlideComponent {
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);

  @Input({ required: true }) public channels!: Channel[];
  @Input({ required: true }) public slideIndex!: number;
  @Input({ required: true }) public isIntroSlide!: boolean;

  protected readonly introDelays: Signal<number[]> = computed(() => {
    const rippleDelay: number = this.displayService.cssVar('--introRippleStepDelay');
    const startDelay: number = this.displayService.cssVar('--introStartDelay');
    const gridCols: number = this.displayService.channelGrid().cols;

    return this.channels.map((_, i) => {
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      return (row + col) * rippleDelay + startDelay;
    });
  });

  protected readonly slideWidthMinusGap: Signal<number> = computed(
    () => this.displayService.slideWidth() - this.displayService.channelGapPx(),
  );
  protected readonly gridCols: Signal<number> = computed(() => this.displayService.channelGrid().cols);
  protected readonly topPx: Signal<number> = computed(() => this.displayService.channelGridTopPx());
  protected readonly gapPx: Signal<number> = computed(() => this.displayService.channelGapPx());

  protected slideTransitionDuration: WritableSignal<number> = signal(0);

  private channelStates: Map<number, ShowHideElement> = new Map<number, ShowHideElement>();

  private clockState: ShowHideElement = { isHidden: false };

  ngOnInit(): void {
    this.slideTransitionDuration.set(this.displayService.parseCssDuration('--slideTransitionDuration'));
  }

  protected shouldRenderChannel(index: number): boolean {
    const channelState: ShowHideElement = this.channelStates.get(index) ?? {
      isHidden: false,
    };
    const channelIsVisible: boolean = this.isChannelInView(index);

    return this.updateHideState(channelState, channelIsVisible, true, index);
  }

  protected shouldRenderClock(): boolean {
    const clockIsVisible: boolean = this.slideIndex === this.slideService.currentSlideIndex();

    return this.updateHideState(this.clockState, clockIsVisible);
  }

  private isChannelInView(index: number): boolean {
    const gridCols: number = this.gridCols();
    const currentSlideIndex: number = this.slideService.currentSlideIndex();

    return (
      this.slideIndex === currentSlideIndex ||
      (this.slideIndex === currentSlideIndex - 1 && index % gridCols === gridCols - 1) ||
      (this.slideIndex === currentSlideIndex + 1 && index % gridCols === 0)
    );
  }

  private updateHideState(
    element: ShowHideElement,
    isVisible: boolean,
    isChannelUpdate: boolean = false,
    channelIndex: number = 0,
  ): boolean {
    if (isVisible) {
      if (element.timer) {
        clearTimeout(element.timer);
        element.timer = undefined;
      }
      element.isHidden = false;
      if (isChannelUpdate) {
        this.channelStates.set(channelIndex, element);
      }
      return true;
    } else if (element.isHidden) {
      return false;
    } else if (!element.timer) {
      element.timer = window.setTimeout(() => {
        element.timer = undefined;
        if (!isVisible) {
          element.isHidden = true;
          if (isChannelUpdate) {
            this.channelStates.set(channelIndex, element);
          }
        }
      }, this.slideTransitionDuration());
    }

    return true;
  }
}
