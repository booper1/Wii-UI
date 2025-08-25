import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { DisplayService } from '../../../services/display.service';
import { SlideService } from '../../../services/slide.service';
import { SlideComponent } from './slide/slide';

@Component({
  selector: 'app-slide-deck',
  imports: [SlideComponent, CommonModule],
  templateUrl: './slide-deck.html',
  styleUrl: './slide-deck.scss',
})
export class SlideDeckComponent implements OnInit, AfterViewInit {
  protected displayService = inject(DisplayService);
  protected slideService = inject(SlideService);

  private totalSlideCount = 0;
  protected transitionEnabled = false;

  ngOnInit() {
    this.totalSlideCount = this.slideService.slideDeck.length;
    this.displayService.configureSlideDeck(this.totalSlideCount);
  }

  ngAfterViewInit() {
    // Wait for the first draw once the slide deck is in its starting place,
    // then enable transitions for all subsequent changes.
    requestAnimationFrame(() => {
      this.transitionEnabled = true;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.displayService.updateViewportHeight();
  }

  protected getSlideDeckTransform(): string {
    return `translateX(calc(-${(this.slideService.currentSlideIndex / this.totalSlideCount) * 100}% + 
            (var(--stageWidth) - ${100 / this.totalSlideCount}%) / 2))`;
  }
}
