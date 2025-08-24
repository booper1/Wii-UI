import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  // `undefined` except when testing.
  // Example values: "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL"
  private locale?: string;
  // `undefined` except when testing.
  // Example value: new Date("2021-07-25T15:30:00")
  private testDate?: Date;

  private effectiveLocale: string = this.locale ?? navigator.language;
  private time: Date = this.testDate ?? new Date();

  public is12HourFormat: boolean = false;
  public hideColon: boolean = true;

  constructor() {
    this.detect12HourFormat();
    this.startClock();
  }

  private detect12HourFormat(): void {
    const now = this.testDate ?? new Date();
    const timeParts = new Intl.DateTimeFormat(this.effectiveLocale, {
      hour: 'numeric',
    }).formatToParts(now);
    this.is12HourFormat = timeParts.some((part) => part.type === 'dayPeriod');
  }

  private startClock(): void {
    setInterval(() => {
      this.time = this.testDate ?? new Date();
      this.hideColon = !this.hideColon;
    }, 1000);
  }

  public get displayHours(): string {
    const hours = this.is12HourFormat
      ? this.time.getHours() % 12 || 12
      : this.time.getHours();
    return hours.toString();
  }

  public get displayMinutes(): string {
    return this.time.getMinutes().toString().padStart(2, '0');
  }

  public get displayAmPm(): string {
    return this.time.getHours() >= 12 ? 'PM' : 'AM';
  }

  public get displayDate(): string {
    return new Intl.DateTimeFormat(this.effectiveLocale, {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    })
      .format(this.time)
      .replace(/([A-Za-zÀ-ÿ])/, (c) => c.toUpperCase());
  }
}
