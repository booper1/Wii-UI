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
  protected displayService: DisplayService = inject(DisplayService);
  protected slideService: SlideService = inject(SlideService);

  protected introChannels: Channel[] = [];
  protected introFadeOutDelayMs: number = 0;
  protected isIntroComplete: boolean = false;

  ngOnInit(): void {
    this.renderSlideDeck();
    for (let i = 0; i < this.displayService.channelGrid().capacity; i++) {
      this.introChannels.push(EMPTY_CHANNEL);
    }

    this.initializeIntroAnimation();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.renderSlideDeck();
  }

  private initializeIntroAnimation(): void {
    const gridCols: number = this.displayService.channelGrid().cols;
    const rows: number[] = this.introChannels.map((_, i) => Math.floor(i / gridCols));
    const colsArr: number[] = this.introChannels.map((_, i) => i % gridCols);

    const startDelay: number = this.displayService.cssVar('--introStartDelay');
    const rippleStepDelay: number = this.displayService.cssVar('--introRippleStepDelay');
    const rippleDuration: number =
      this.displayService.cssVar('--introRippleFadeIn') +
      this.displayService.cssVar('--introRippleHold') +
      this.displayService.cssVar('--introRippleFadeOut');
    const endDelay: number = this.displayService.cssVar('--introEndDelay');
    const fadeOut: number = this.displayService.cssVar('--introFadeOut');

    const maxDiagonal: number = Math.max(...rows.map((r, i) => r + colsArr[i]));
    this.introFadeOutDelayMs = startDelay + maxDiagonal * rippleStepDelay + rippleDuration + endDelay;
    this.displayService.introTotalTime.set(this.introFadeOutDelayMs + fadeOut);

    window.setTimeout(() => {
      this.isIntroComplete = true;
    }, this.introFadeOutDelayMs + fadeOut);
  }

  private renderSlideDeck(): void {
    this.displayService.updateViewport();
    this.slideService.updateForResize();
    this.displayService.configureSlideDeck(this.slideService.slideDeck().length);
  }
}
