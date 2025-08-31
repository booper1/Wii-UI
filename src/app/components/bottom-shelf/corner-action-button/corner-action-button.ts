import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { SHARED_DESIGN } from '../../../constants/shared-design.data';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-corner-action-button',
  imports: [CommonModule],
  templateUrl: './corner-action-button.html',
  styleUrls: ['./corner-action-button.scss'],
})
export class CornerActionButtonComponent {
  protected displayService = inject(DisplayService);

  @Input({ required: true }) public isRight!: boolean;
  @Input({ required: true }) public shelfHeightPx!: number;

  protected readonly viewBoxSize = 235;
  protected readonly center = Math.floor(this.viewBoxSize / 2);
  protected readonly borderWidth = 5;
  protected readonly outerRadius =
    this.center - Math.floor(this.borderWidth / 2);
  protected readonly innerRadius =
    this.outerRadius - Math.floor(this.borderWidth / 2);

  // Pressed visual state
  protected pressed = false;

  protected get buttonWidthPx(): number {
    return (
      (this.viewBoxSize *
        SHARED_DESIGN.CORNER_ACTION_SCALE *
        this.shelfHeightPx) /
      SHARED_DESIGN.BOTTOM_SHELF_HEIGHT
    );
  }

  // Smooth shadow scaling: 15 at 16:9 -> 5 at 73:100
  protected shadowDistancePx = computed(() => {
    const currentAspectRatio =
      this.displayService.currentVW() / this.displayService.currentVH();

    const aspectScale =
      (SHARED_DESIGN.ASPECT_RATIO - currentAspectRatio) /
      (SHARED_DESIGN.ASPECT_RATIO - 73 / 100);

    return SHARED_DESIGN.CORNER_ACTION_SCALE * (15 - 10 * aspectScale);
  });

  protected onWiiClick(): void {
    // TODO: Handle the click event
    console.log(`${this.isRight ? 'Right' : 'Left'} Wii button clicked`);
  }

  // Pointer helpers so pressed state never gets stuck
  protected onPointerDown() {
    this.pressed = true;
  }

  protected onPointerCancel() {
    this.pressed = false;
  }
}
