import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { TIMING } from '../../../../constants/timing-variables';
import { DisplayService } from '../../../../services/display.service';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrls: ['./clock.scss'],
})
export class ClockComponent {
  protected timeService: TimeService = inject(TimeService);
  protected displayService: DisplayService = inject(DisplayService);

  protected titleDelay = this.displayService.introTotalTime() + TIMING.CLOCK_TITLE_HOLD_DURATION;
  protected timeDelay =
    this.displayService.introTotalTime() +
    TIMING.CLOCK_TITLE_HOLD_DURATION +
    TIMING.CLOCK_TITLE_SWAP_DURATION * (1 / 2);

  protected readonly amPmRightCh: Signal<number> = computed(() => {
    return -4 * this.displayService.clockScaleFactor();
  });
}
