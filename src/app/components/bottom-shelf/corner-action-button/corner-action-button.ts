import { CommonModule } from '@angular/common';
import { Component, Input, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { SHARED_DESIGN } from '../../../constants/shared-design.data';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-corner-action-button',
  imports: [CommonModule],
  templateUrl: './corner-action-button.html',
  styleUrls: ['./corner-action-button.scss'],
})
export class CornerActionButtonComponent {
  protected displayService: DisplayService = inject(DisplayService);

  @Input({ required: true }) public isRight!: boolean;

  protected readonly viewBoxSize: number = 235;
  protected readonly center: number = Math.floor(this.viewBoxSize / 2);
  protected readonly borderWidth: number = 5;
  protected readonly outerRadius: number = this.center - Math.floor(this.borderWidth / 2);
  protected readonly innerRadius: number = this.outerRadius - Math.floor(this.borderWidth / 2);
  protected readonly settingsCogSize: number = 175;

  protected readonly buttonWidthPx: Signal<number> = computed(() => {
    return (
      (this.viewBoxSize * SHARED_DESIGN.CORNER_ACTION_SCALE * this.displayService.bottomShelfHeight()) /
      SHARED_DESIGN.BOTTOM_SHELF_HEIGHT
    );
  });

  // Smooth shadow scaling: 15 at 16:9 -> 5 at 73:100
  protected readonly shadowDistancePx: Signal<number> = computed(() => {
    const currentAspectRatio = this.displayService.currentVW() / this.displayService.currentVH();

    const aspectScale = (SHARED_DESIGN.ASPECT_RATIO - currentAspectRatio) / (SHARED_DESIGN.ASPECT_RATIO - 73 / 100);

    return SHARED_DESIGN.CORNER_ACTION_SCALE * (15 - 10 * aspectScale);
  });

  // Pressed visual state
  protected pressed: WritableSignal<boolean> = signal(false);

  protected onWiiClick(): void {
    // TODO: Handle the click event
    console.log(`${this.isRight ? 'Right' : 'Left'} Wii button clicked`);
  }

  // Pointer helpers so pressed state never gets stuck
  protected onPointerDown(): void {
    this.pressed.set(true);
  }

  protected onPointerCancel(): void {
    this.pressed.set(false);
  }
}
