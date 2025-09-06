import { Component, computed, inject, Signal } from '@angular/core';
import { SHARED_DESIGN } from '../../constants/shared-design.data';
import { DisplayService } from '../../services/display.service';
import { TimeService } from '../../services/time.service';
import { CornerActionSlotComponent } from './corner-action-slot/corner-action-slot';

@Component({
  selector: 'app-bottom-shelf',
  imports: [CornerActionSlotComponent],
  templateUrl: './bottom-shelf.html',
  styleUrl: './bottom-shelf.scss',
})
export class BottomShelfComponent {
  protected timeService: TimeService = inject(TimeService);
  protected displayService: DisplayService = inject(DisplayService);

  protected readonly dateFontPx: Signal<number> = computed(() => {
    return (
      72 *
      (this.displayService.bottomShelfHeight() /
        SHARED_DESIGN.BOTTOM_SHELF_HEIGHT)
    );
  });

  protected readonly dateBoxHeightPx: Signal<number> = computed(() => {
    return (
      64 *
      (this.displayService.bottomShelfHeight() /
        SHARED_DESIGN.BOTTOM_SHELF_HEIGHT)
    );
  });

  protected readonly dateTopPx: Signal<number> = computed(() => {
    return (
      this.displayService.notchDepth() +
      this.displayService.bottomShelfHeight() * 0.08
    );
  });

  protected readonly actionSlotBottomPx: Signal<number> = computed(() => {
    return this.displayService.bottomShelfHeight() * 0.11;
  });
}
