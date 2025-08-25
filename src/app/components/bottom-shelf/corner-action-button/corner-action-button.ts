import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-corner-action-button',
  imports: [CommonModule],
  templateUrl: './corner-action-button.html',
  styleUrls: ['./corner-action-button.scss'],
})
export class CornerActionButtonComponent {
  @Input({ required: true }) public isRight!: boolean;

  protected pressed: boolean = false;

  protected onWiiClick(): void {
    // TODO: Handle the click event
    console.log(`${this.isRight ? 'Right' : 'Left'} Wii button clicked`);
  }
}
