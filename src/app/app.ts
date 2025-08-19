import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChannelComponent } from './components/channel/channel';
import { ClockComponent } from './components/clock/clock';
import { CHANNELS, EMPTY_CHANNEL } from './data/channels.data';
import { Channel } from './models/channel.model';

// REFERENCES
// https://www.youtube.com/watch?v=DTNYegBnFL0
// https://www.youtube.com/watch?v=UldvTh4BJc0
// https://www.youtube.com/watch?v=D4nQk0PiM90

@Component({
  selector: 'app-root',
  imports: [CommonModule, ChannelComponent, ClockComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  private readonly MIN_PAGES: number = 5;
  private readonly PAGE_SIZE: number = 12;
  private isAnimating: boolean = false;
  private transitionDurationMs: number = 0;

  protected pages: Channel[][] = [];
  protected currentPageIndex: number = 0;
  protected canPageLeft: boolean = false;
  protected canPageRight: boolean = false;

  ngOnInit(): void {
    // Populate page / channel data
    this.pages = this.buildPages([...CHANNELS]);

    this.initializePaging();
  }

  private buildPages(channels: Channel[]): Channel[][] {
    const result: Channel[][] = [];
    const totalPages = Math.max(
      Math.ceil(channels.length / this.PAGE_SIZE),
      this.MIN_PAGES,
    );

    for (let i = 0; i < totalPages; i++) {
      const start = i * this.PAGE_SIZE;
      const end = start + this.PAGE_SIZE;
      const slice = channels.slice(start, end);

      // Fill the last page with empty channels
      while (slice.length < this.PAGE_SIZE) {
        slice.push(EMPTY_CHANNEL);
      }

      result.push(slice);
    }

    return result;
  }

  private initializePaging(): void {
    // Configure initial navigation
    this.updateNavigation(true);

    // Prevent spamming through pages
    const duration = getComputedStyle(document.documentElement)
      .getPropertyValue('--pageTransitionDuration')
      .trim();
    this.transitionDurationMs = parseFloat(duration) * 1000;

    // Change pages on arrow keys
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') this.nextPage();
      if (event.key === 'ArrowLeft') this.prevPage();
    });
  }

  private updateNavigation(initializing: boolean = false): void {
    this.canPageRight = this.currentPageIndex < this.pages.length - 1;
    this.canPageLeft = this.currentPageIndex > 0;

    if (!initializing) {
      this.isAnimating = true;
      setTimeout(() => (this.isAnimating = false), this.transitionDurationMs);
    }
  }

  protected nextPage() {
    if (!this.isAnimating && this.canPageRight) {
      this.currentPageIndex++;
      this.updateNavigation();
    }
  }

  protected prevPage() {
    if (!this.isAnimating && this.canPageLeft) {
      this.currentPageIndex--;
      this.updateNavigation();
    }
  }

  protected getPageTransform(index: number): string {
    const offset = index - this.currentPageIndex;
    return `translateX(calc(${offset * 100}% + ${offset} * var(--channelGap))) translate(-50%, -75%)`;
  }
}
