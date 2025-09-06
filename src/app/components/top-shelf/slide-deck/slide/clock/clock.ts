import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { DisplayService } from '../../../../../services/display.service';
import { TimeService } from '../../../../../services/time.service';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrls: ['./clock.scss'],
})
export class ClockComponent {
  protected timeService: TimeService = inject(TimeService);
  protected displayService: DisplayService = inject(DisplayService);

  protected readonly amPmRightCh: Signal<number> = computed(() => {
    return -4 * this.displayService.clockScaleFactor();
  });
}
