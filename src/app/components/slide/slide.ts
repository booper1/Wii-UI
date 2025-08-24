import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Channel } from '../../models/channel.model';
import { DisplayService } from '../../services/display.service';
import { ChannelComponent } from '../channel/channel';
import { ClockComponent } from '../clock/clock';

@Component({
  selector: 'app-slide',
  imports: [CommonModule, ChannelComponent, ClockComponent],
  templateUrl: './slide.html',
  styleUrls: ['./slide.scss'],
})
export class SlideComponent {
  public displayService = inject(DisplayService);

  @Input({ required: true }) channels!: Channel[];
  @Input({ required: true }) isInactiveSlide!: boolean;
}
