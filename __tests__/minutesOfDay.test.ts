import { minutesOfDay } from '../src/common/services/minutesOfDay';

// Guards the office-hours window handed to the native tracking service. If this
// returns null unexpectedly, native silently falls back to 6AM-6PM.
describe('minutesOfDay', () => {
  it('parses a bare time', () => {
    expect(minutesOfDay('06:00')).toBe(360);
    expect(minutesOfDay('18:00:00')).toBe(1080);
    expect(minutesOfDay('9:30')).toBe(570);
  });

  it('parses a full datetime, ignoring the date', () => {
    expect(minutesOfDay('2026-07-30T06:00:00')).toBe(360);
    expect(minutesOfDay('2026-01-02T18:45:00')).toBe(1125);
  });

  it('passes through numbers already in minutes', () => {
    expect(minutesOfDay(360)).toBe(360);
    expect(minutesOfDay(0)).toBe(0);
  });

  it('returns null for values it cannot use, so callers fall back', () => {
    expect(minutesOfDay(undefined)).toBeNull();
    expect(minutesOfDay(null)).toBeNull();
    expect(minutesOfDay('')).toBeNull();
    expect(minutesOfDay('not a time')).toBeNull();
    expect(minutesOfDay('99:99')).toBeNull();
    expect(minutesOfDay(-5)).toBeNull();
  });
});

// Mirrors MqttService.shouldTrackNow()'s window comparison, including the
// night-shift case where the window crosses midnight.
const inWindow = (now: number, from: number, to: number) =>
  from <= to ? now >= from && now < to : now >= from || now < to;

describe('office-hours window', () => {
  const from = minutesOfDay('06:00')!;
  const to = minutesOfDay('18:00')!;

  it('tracks inside 6AM-6PM and not outside', () => {
    expect(inWindow(minutesOfDay('06:00')!, from, to)).toBe(true);
    expect(inWindow(minutesOfDay('12:00')!, from, to)).toBe(true);
    expect(inWindow(minutesOfDay('17:59')!, from, to)).toBe(true);
    expect(inWindow(minutesOfDay('18:00')!, from, to)).toBe(false);
    expect(inWindow(minutesOfDay('05:59')!, from, to)).toBe(false);
    expect(inWindow(minutesOfDay('23:00')!, from, to)).toBe(false);
  });

  it('handles a night shift that crosses midnight', () => {
    const nightFrom = minutesOfDay('22:00')!;
    const nightTo = minutesOfDay('06:00')!;
    expect(inWindow(minutesOfDay('23:30')!, nightFrom, nightTo)).toBe(true);
    expect(inWindow(minutesOfDay('02:00')!, nightFrom, nightTo)).toBe(true);
    expect(inWindow(minutesOfDay('12:00')!, nightFrom, nightTo)).toBe(false);
  });
});
