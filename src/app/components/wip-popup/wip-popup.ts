import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WipPopupService } from '../../services/wip-popup.service';

@Component({
  selector: 'app-wip-popup',
  imports: [CommonModule],
  templateUrl: './wip-popup.html',
  styleUrls: ['./wip-popup.scss'],
})
export class WipPopupComponent {
  protected wipPopupService: WipPopupService = inject(WipPopupService);

  protected onBackdropClick(): void {
    this.wipPopupService.close();
  }

  protected onPopupClick(event: MouseEvent): void {
    // Prevent backdrop click from closing when clicking inside the popup
    event.stopPropagation();
  }
}
