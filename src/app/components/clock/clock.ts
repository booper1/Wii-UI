import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrls: ['./clock.scss'],
})
export class ClockComponent implements OnInit, OnDestroy {
  // `undefined` except when testing.
  // Example values: "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL"
  private locale?: string;
  // `undefined` except when testing.
  // Example value: new Date("2021-07-25T15:30:00")
  private testDate?: Date;

  private effectiveLocale: string = this.locale ?? navigator.language;
  private intervalId?: ReturnType<typeof setInterval>;
  private time: Date = this.testDate ?? new Date();

  protected is12HourFormat: boolean = false;
  protected showColon: boolean = true;

  ngOnInit(): void {
    this.detect12HourFormat();
    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private detect12HourFormat(): void {
    const now = this.testDate ?? new Date();
    const timeParts = new Intl.DateTimeFormat(this.effectiveLocale, {
      hour: 'numeric',
    }).formatToParts(now);
    this.is12HourFormat = timeParts.some((part) => part.type === 'dayPeriod');
  }

  private startClock(): void {
    this.intervalId = setInterval(() => {
      this.time = this.testDate ?? new Date();
      this.showColon = !this.showColon;
    }, 1000);
  }

  protected get displayHours(): string {
    const hours = this.is12HourFormat
      ? this.time.getHours() % 12 || 12
      : this.time.getHours();
    return hours.toString();
  }

  protected get displayMinutes(): string {
    return this.time.getMinutes().toString().padStart(2, '0');
  }

  protected get displayAmPm(): string {
    return this.time.getHours() >= 12 ? 'PM' : 'AM';
  }

  protected get displayDate(): string {
    return new Intl.DateTimeFormat(this.effectiveLocale, {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    })
      .format(this.time)
      .replace(/([A-Za-zÀ-ÿ])/, (c) => c.toUpperCase());
  }
}
