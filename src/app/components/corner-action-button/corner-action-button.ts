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

  public pressed = false;

  public onWiiClick() {
    // TODO: Handle the click event
  }
}
