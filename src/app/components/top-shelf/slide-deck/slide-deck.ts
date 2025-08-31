import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { DisplayService } from '../../../services/display.service';
import { SlideService } from '../../../services/slide.service';
import { SlideComponent } from './slide/slide';

@Component({
  selector: 'app-slide-deck',
  imports: [SlideComponent, CommonModule],
  templateUrl: './slide-deck.html',
  styleUrl: './slide-deck.scss',
})
export class SlideDeckComponent implements OnInit {
  protected displayService = inject(DisplayService);
  protected slideService = inject(SlideService);

  ngOnInit() {
    this.renderSlideDeck();
  }

  @HostListener('window:resize')
  onResize() {
    this.renderSlideDeck();
  }

  private renderSlideDeck(): void {
    this.displayService.updateViewport();
    this.slideService.updateForResize();
    this.displayService.configureSlideDeck(this.slideService.slideDeck.length);
  }

  protected getSlideDeckTransform(): string {
    return `translateX(calc(-${(this.slideService.currentSlideIndex / this.slideService.slideDeck.length) * 100}% + 
            (var(--stageWidth) - ${100 / this.slideService.slideDeck.length}%) / 2))`;
  }
}
