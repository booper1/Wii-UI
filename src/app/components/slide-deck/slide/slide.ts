import { Component, computed, inject, input, Signal } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { DisplayService } from '../../../services/display.service';
import { SlideService } from '../../../services/slide.service';
import { ChannelComponent } from './channel/channel';
import { ClockComponent } from './clock/clock';

@Component({
  selector: 'app-slide',
  imports: [ChannelComponent, ClockComponent],
  templateUrl: './slide.html',
  styleUrls: ['./slide.scss'],
})
export class SlideComponent {
  private displayService: DisplayService = inject(DisplayService);
  private slideService: SlideService = inject(SlideService);

  public channels = input.required<Channel[]>();
  public slideIndex = input.required<number>();
  public isIntroSlide = input.required<boolean>();

  protected readonly introDelays: Signal<number[]> = computed(() => {
    const rippleDelay: number = parseFloat(this.displayService.cssVar('--introRippleStepDelayMs'));
    const startDelay: number = parseFloat(this.displayService.cssVar('--introStartDelayMs'));
    const gridCols: number = this.displayService.channelGrid().cols;

    return this.channels().map((_, i) => {
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      return (row + col) * rippleDelay + startDelay;
    });
  });

  protected readonly slideWidthMinusGap: Signal<number> = computed(
    () => this.displayService.slideWidth() - this.displayService.channelGapPx(),
  );
  protected readonly gridColCount: Signal<number> = computed(() => this.displayService.channelGrid().cols);
  protected readonly topPx: Signal<number> = computed(() => this.displayService.channelGridTopPx());
  protected readonly gapPx: Signal<number> = computed(() => this.displayService.channelGapPx());

  protected readonly shouldRenderChannel: Signal<ReadonlyArray<boolean>> = computed(() => {
    const channels = this.channels();
    const slideIndex = this.slideIndex();
    const columnCount = this.displayService.channelGrid().cols;

    const currentSlideIndex = this.slideService.currentSlideIndex();
    const tempSlideIndex = this.slideService.tempSlideIndex();
    const isAnimating = this.slideService.isAnimating();

    const shiftAmount = Math.sign(currentSlideIndex - tempSlideIndex);
    const targetSlideIndex = currentSlideIndex + shiftAmount;

    const isFirstCol = (i: number) => i % columnCount === 0;
    const isLastCol = (i: number) => i % columnCount === columnCount - 1;

    return channels.map((_, i) => {
      if (isAnimating) {
        return (
          slideIndex === tempSlideIndex ||
          slideIndex === currentSlideIndex ||
          (slideIndex === tempSlideIndex - 1 && isLastCol(i)) ||
          (slideIndex === tempSlideIndex + 1 && isFirstCol(i)) ||
          (shiftAmount === 1 && slideIndex === targetSlideIndex && isFirstCol(i)) ||
          (shiftAmount === -1 && slideIndex === targetSlideIndex && isLastCol(i))
        );
      } else {
        return (
          slideIndex === currentSlideIndex ||
          (slideIndex === currentSlideIndex - 1 && isLastCol(i)) ||
          (slideIndex === currentSlideIndex + 1 && isFirstCol(i))
        );
      }
    });
  });
}
