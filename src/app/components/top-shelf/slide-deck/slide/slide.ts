import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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

  protected getSlideWidth(): string {
    return `calc(${this.displayService.slideWidth}px - ${this.displayService.relativePx(12)})`;
  }
}
