import { Component, inject } from '@angular/core';
import { DisplayService } from '../../services/display.service';
import { TimeService } from '../../services/time.service';
import { CornerActionSlotComponent } from '../corner-action-slot/corner-action-slot';

@Component({
  selector: 'app-bottom-deck',
  imports: [CornerActionSlotComponent],
  templateUrl: './bottom-deck.html',
  styleUrl: './bottom-deck.scss',
})
export class BottomDeckComponent {
  timeService = inject(TimeService);
  displayService = inject(DisplayService);

  public datePositionY = `calc(${this.displayService.notchDepth}px + 8%)`;
}
