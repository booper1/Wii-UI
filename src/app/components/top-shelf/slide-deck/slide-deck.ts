import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { DisplayService } from '../../../services/display.service';
import { SlideService } from '../../../services/slide.service';
import { SlideComponent } from './slide/slide';

@Component({
  selector: 'app-slide-deck',
  imports: [SlideComponent, CommonModule],
  templateUrl: './slide-deck.html',
  styleUrl: './slide-deck.scss',
})
export class SlideDeckComponent {
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);

  protected readonly slideDeckTransform: Signal<string> = computed(() => {
    return `translateX(calc(-${
      (this.slideService.currentSlideIndex() /
        this.slideService.slideDeck().length) *
      100
    }% + (var(--stageWidth) - ${100 / this.slideService.slideDeck().length}%) / 2))`;
  });

  protected readonly slideDeckSvgTransform: Signal<string> = computed(() => {
    return `translateX(calc(-${
      (this.slideService.currentSlideDeckSvgIndex() /
        this.slideService.slideDeck().length) *
      100
    }% + (var(--stageWidth) - ${100 / this.slideService.slideDeck().length}%) / 2))`;
  });
}
