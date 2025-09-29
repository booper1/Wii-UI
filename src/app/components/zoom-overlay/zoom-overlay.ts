import { PortalModule } from '@angular/cdk/portal';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ZoomService } from '../../services/zoom.service';

@Component({
  selector: 'app-zoom-overlay',
  imports: [PortalModule],
  templateUrl: './zoom-overlay.html',
  styleUrls: ['./zoom-overlay.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ZoomOverlayComponent {
  protected zoomService: ZoomService = inject(ZoomService);

  // Called when portal finishes attaching new content
  // At which point, Angular has created the view but not all child nodes are guaranteed to exist in the DOM
  onPortalAttached() {
    // Don't run anything on the initial attach / zoom
    if (this.zoomService.channelBgCachedAttributes && this.zoomService.channelFgCachedAttributes) {
      // Use a microtask (Promise.resolve) instead of requestAnimationFrame.
      // This defers execution until Angular finishes rendering child nodes,
      // but still runs before the browser’s next paint, so no frame flicker.
      Promise.resolve().then(() => {
        // Grab the new zoomed channel group elements inside the overlay
        const bgGroupElement = document.querySelector('#zoom-overlay g.channelContent.bg');
        const fgGroupElement = document.querySelector('#zoom-overlay g.channelContent.fg');

        // Restore cached attributes (transform, origin, style, etc.)
        // so the new portal element immediately matches the old one’s state.
        if (bgGroupElement) {
          this.zoomService.restoreAttributes(bgGroupElement, this.zoomService.channelBgCachedAttributes!);
        }
        if (fgGroupElement) {
          this.zoomService.restoreAttributes(fgGroupElement, this.zoomService.channelFgCachedAttributes!);
        }

        // Clear caches once applied to avoid stale data on future swaps
        this.zoomService.clearCachedAttributes();
      });
    }
  }
}
