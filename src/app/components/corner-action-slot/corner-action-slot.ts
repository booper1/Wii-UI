import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CornerActionButtonComponent } from '../corner-action-button/corner-action-button';

@Component({
  selector: 'app-corner-action-slot',
  imports: [CommonModule, CornerActionButtonComponent],
  templateUrl: './corner-action-slot.html',
  styleUrls: ['./corner-action-slot.scss'],
})
export class CornerActionSlotComponent {
  @Input({ required: true }) public isRight!: boolean;
}
