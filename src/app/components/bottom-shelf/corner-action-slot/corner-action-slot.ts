import { CommonModule } from '@angular/common';
import { Component, Input, Signal, computed, inject } from '@angular/core';
import { SHARED_DESIGN } from '../../../constants/shared-design.data';
import { DisplayService } from '../../../services/display.service';
import { CornerActionButtonComponent } from '../corner-action-button/corner-action-button';

@Component({
  selector: 'app-corner-action-slot',
  imports: [CommonModule, CornerActionButtonComponent],
  templateUrl: './corner-action-slot.html',
  styleUrls: ['./corner-action-slot.scss'],
})
export class CornerActionSlotComponent {
  protected displayService: DisplayService = inject(DisplayService);

  @Input({ required: true }) public isRight!: boolean;

  protected readonly viewBoxWidth: number = 400;
  protected readonly viewBoxHeight: number = 312;

  protected readonly slotWidthPx: Signal<number> = computed(() => {
    return (
      (this.viewBoxWidth * SHARED_DESIGN.CORNER_ACTION_SCALE * this.displayService.bottomShelfHeight()) /
      SHARED_DESIGN.BOTTOM_SHELF_HEIGHT
    );
  });
}
