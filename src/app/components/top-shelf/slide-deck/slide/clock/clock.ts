import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimeService } from '../../../../../services/time.service';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrls: ['./clock.scss'],
})
export class ClockComponent {
  protected timeService = inject(TimeService);
}
