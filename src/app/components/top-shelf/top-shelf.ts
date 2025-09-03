import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { EMPTY_CHANNEL } from '../../constants/channels.data';
import { Channel } from '../../models/channel.model';
import { DisplayService } from '../../services/display.service';
import { SlideService } from '../../services/slide.service';
import { SlideDeckComponent } from './slide-deck/slide-deck';
import { SlideComponent } from './slide-deck/slide/slide';

@Component({
  selector: 'app-top-shelf',
  imports: [SlideDeckComponent, CommonModule, SlideComponent],
  templateUrl: './top-shelf.html',
  styleUrl: './top-shelf.scss',
})
export class TopShelfComponent {
  protected displayService = inject(DisplayService);
  protected slideService = inject(SlideService);

  protected introChannels: Channel[] = [];
  protected introFadeOutDelayMs = 0;

  ngOnInit() {
    this.renderSlideDeck();
    for (let i = 0; i < this.displayService.channelGrid().capacity; i++) {
      this.introChannels.push(EMPTY_CHANNEL);
    }

    this.initializeIntroAnimation();
  }

  @HostListener('window:resize')
  onResize() {
    this.renderSlideDeck();
  }

  private initializeIntroAnimation(): void {
    const cols = this.displayService.channelGrid().cols;
    const rows = this.introChannels.map((_, i) => Math.floor(i / cols));
    const colsArr = this.introChannels.map((_, i) => i % cols);

    const startDelay = this.displayService.cssVar('--introStartDelay');
    const rippleStepDelay = this.displayService.cssVar(
      '--introRippleStepDelay',
    );
    const rippleDuration =
      this.displayService.cssVar('--introRippleFadeIn') +
      this.displayService.cssVar('--introRippleHold') +
      this.displayService.cssVar('--introRippleFadeOut');
    const endDelay = this.displayService.cssVar('--introEndDelay');
    const fadeOut = this.displayService.cssVar('--introFadeOut');

    const maxDiagonal = Math.max(...rows.map((r, i) => r + colsArr[i]));
    this.introFadeOutDelayMs =
      startDelay + maxDiagonal * rippleStepDelay + rippleDuration + endDelay;
    this.displayService.introTotalTime.set(this.introFadeOutDelayMs + fadeOut);
  }

  private renderSlideDeck(): void {
    this.displayService.updateViewport();
    this.slideService.updateForResize();
    this.displayService.configureSlideDeck(this.slideService.slideDeck.length);
  }
}
