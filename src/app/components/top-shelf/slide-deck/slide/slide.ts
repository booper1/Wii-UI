import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Channel } from '../../../../models/channel.model';
import { DisplayService } from '../../../../services/display.service';
import { ChannelComponent } from './channel/channel';
import { ClockComponent } from './clock/clock';

@Component({
  selector: 'app-slide',
  imports: [CommonModule, ChannelComponent, ClockComponent],
  templateUrl: './slide.html',
  styleUrls: ['./slide.scss'],
})
export class SlideComponent {
  protected displayService = inject(DisplayService);

  @Input({ required: true }) public channels!: Channel[];
  @Input({ required: true }) public isInactiveSlide!: boolean;
  @Input({ required: true }) public isIntroSlide!: boolean;

  protected readonly introDelays = signal<number[]>([]);

  ngOnInit() {
    this.initializeIntroAnimation();
  }

  private initializeIntroAnimation(): void {
    const rippleStepDelay = this.displayService.cssVar(
      '--introRippleStepDelay',
    );
    const startDelay = this.displayService.cssVar('--introStartDelay');

    const cols = this.displayService.channelGrid().cols;
    const rows = this.channels.map((_, i) => Math.floor(i / cols));
    const colsArr = this.channels.map((_, i) => i % cols);

    this.introDelays.set(
      this.channels.map(
        (_, i) => (rows[i] + colsArr[i]) * rippleStepDelay + startDelay,
      ),
    );
  }
}
