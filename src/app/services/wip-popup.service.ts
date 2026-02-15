import { Injectable, signal, WritableSignal } from '@angular/core';

export enum WipPopupType {
  AboutMii = 'aboutMii',
  Settings = 'settings',
}

@Injectable({
  providedIn: 'root',
})
export class WipPopupService {
  public activePopup: WritableSignal<WipPopupType | null> = signal(null);

  public open(type: WipPopupType): void {
    this.activePopup.set(type);
  }

  public close(): void {
    this.activePopup.set(null);
  }

  public getTitle(): string {
    switch (this.activePopup()) {
      case WipPopupType.AboutMii:
        return 'About Mii';
      case WipPopupType.Settings:
        return 'Settings';
      default:
        return '';
    }
  }
}
