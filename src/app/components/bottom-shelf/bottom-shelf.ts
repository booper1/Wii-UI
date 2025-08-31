import { Component, inject } from '@angular/core';
import { DisplayService } from '../../services/display.service';
import { TimeService } from '../../services/time.service';
import { CornerActionSlotComponent } from './corner-action-slot/corner-action-slot';
import { SHARED_DESIGN } from '../../constants/shared-design.data';

@Component({
  selector: 'app-bottom-shelf',
  imports: [CornerActionSlotComponent],
  templateUrl: './bottom-shelf.html',
  styleUrl: './bottom-shelf.scss',
})
export class BottomShelfComponent {
  protected timeService = inject(TimeService);
  protected displayService = inject(DisplayService);

  get shelfHeightPx(): number {
    return (
      this.displayService.slideHeight() - this.displayService.borderStartY()
    );
  }

  get dateFontPx(): number {
    return 72 * (this.shelfHeightPx / SHARED_DESIGN.BOTTOM_SHELF_HEIGHT);
  }

  get dateBoxHeightPx(): number {
    return 64 * (this.shelfHeightPx / SHARED_DESIGN.BOTTOM_SHELF_HEIGHT);
  }

  get dateTopPx(): number {
    return this.displayService.notchDepth() + this.shelfHeightPx * 0.08;
  }

  get actionSlotBottomPx(): number {
    return this.shelfHeightPx * 0.11;
  }
}
