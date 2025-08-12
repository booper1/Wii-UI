import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrls: ['./clock.scss'],
})
export class Clock implements OnInit, OnDestroy {
  // `undefined` except when testing.
  // Example values: "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL"
  locale?: string;

  // `undefined` except when testing.
  // Example value: new Date("2021-07-25T15:30:00")
  testDate?: Date;

  effectiveLocale: string = this.locale ?? navigator.language;

  time: Date = this.testDate ?? new Date();

  showColon = true;

  is12HourFormat = false;

  intervalId?: ReturnType<typeof setInterval>;

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

  get rawHours(): number {
    return this.time.getHours();
  }

  get displayHours(): string {
    const hours = this.is12HourFormat
      ? this.rawHours % 12 || 12
      : this.rawHours;
    return hours.toString().padStart(2, '0');
  }

  get minutes(): string {
    return this.time.getMinutes().toString().padStart(2, '0');
  }

  get dateDisplay(): string {
    return new Intl.DateTimeFormat(this.effectiveLocale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    })
      .format(this.time)
      .replace(/([A-Za-zÀ-ÿ])/, (c) => c.toUpperCase());
  }

  get amPm(): string {
    return this.rawHours >= 12 ? 'PM' : 'AM';
  }
}
