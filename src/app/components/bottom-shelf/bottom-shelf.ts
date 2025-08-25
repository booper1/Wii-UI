import { Component, inject } from '@angular/core';
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
  protected timeService = inject(TimeService);
  protected displayService = inject(DisplayService);

  protected bottomShelfHeight: string = `${this.displayService.relativePx(this.displayService.slideDeckHeight - this.displayService.blueStartY)}`;
  protected datePositionY: string = `calc(${this.displayService.relativePx(this.displayService.notchDepth)} + 8%)`;
}
