import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
  protected displayService = inject(DisplayService);

  @Input({ required: true }) public isRight!: boolean;
  @Input({ required: true }) public shelfHeightPx!: number;

  readonly viewBoxWidth = 400;
  readonly viewBoxHeight = 312;

  protected get slotWidthPx(): number {
    return (
      (this.viewBoxWidth *
        SHARED_DESIGN.CORNER_ACTION_SCALE *
        this.shelfHeightPx) /
      SHARED_DESIGN.BOTTOM_SHELF_HEIGHT
    );
  }
}
