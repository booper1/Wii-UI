import {
  computed,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  public is12HourFormat: WritableSignal<boolean> = signal(false);
  public hideColon: WritableSignal<boolean> = signal(true);

  // `undefined` except when testing.
  // Example values: "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL"
  private readonly testLocale?: string;
  // `undefined` except when testing.
  // Example value: new Date("2021-07-25T15:30:00")
  private readonly testDate?: Date;

  private readonly effectiveLocale: string =
    this.testLocale ?? navigator.language;
  private readonly time: WritableSignal<Date> = signal<Date>(
    this.testDate ?? new Date(),
  );

  constructor() {
    this.detect12HourFormat();
    this.startClock();
  }

  public readonly currentHour: Signal<string> = computed(() => {
    const hours = this.is12HourFormat()
      ? this.time().getHours() % 12 || 12
      : this.time().getHours();
    return hours.toString();
  });

  public readonly currentMinute: Signal<string> = computed(() => {
    return this.time().getMinutes().toString().padStart(2, '0');
  });

  public readonly amPmValue: Signal<string> = computed(() => {
    return this.time().getHours() >= 12 ? 'PM' : 'AM';
  });

  public readonly currentDate: Signal<string> = computed(() => {
    return new Intl.DateTimeFormat(this.effectiveLocale, {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    })
      .format(this.time())
      .replace(/([A-Za-zÀ-ÿ])/, (c) => c.toUpperCase());
  });

  private detect12HourFormat(): void {
    const now: Date = this.testDate ?? new Date();
    const timeParts: Intl.DateTimeFormatPart[] = new Intl.DateTimeFormat(
      this.effectiveLocale,
      {
        hour: 'numeric',
      },
    ).formatToParts(now);
    this.is12HourFormat.set(
      timeParts.some((part) => part.type === 'dayPeriod'),
    );
  }

  private startClock(): void {
    setInterval(() => {
      this.time.set(this.testDate ?? new Date());
      this.hideColon.update((val) => !val);
    }, 1000);
  }
}
