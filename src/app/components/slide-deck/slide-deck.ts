import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SlideService } from '../../services/slide.service';
import { SlideComponent } from '../slide/slide';

@Component({
  selector: 'app-slide-deck',
  imports: [SlideComponent, CommonModule],
  templateUrl: './slide-deck.html',
  styleUrl: './slide-deck.scss',
})
export class SlideDeckComponent {
  slideService = inject(SlideService);

  // TODO: Signals
  protected getSlideTransform(): string {
    return `translateX(calc(-${(this.slideService.currentSlideIndex + 1) * 100}% + (100vw - 100%) / 2))`;
  }
}
