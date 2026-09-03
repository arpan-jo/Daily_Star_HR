import dayjs from 'dayjs';

/**
 * Normalise an office-hours value into minutes since midnight.
 *
 * The native tracking service needs the window as a plain number so it can keep
 * applying it every day while the app is killed. Doing the parsing here means dayjs
 * handles whatever EmployeeInfoToLocationSync returns (full datetime or "HH:mm[:ss]")
 * and native never has to guess at a format.
 *
 * Returns null when the value cannot be understood, so callers can fall back.
 */
export const minutesOfDay = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value >= 0 && value <= 1440 ? Math.round(value) : null;
  }
  if (typeof value !== 'string' || !value.trim()) return null;

  const parsed = dayjs(value);
  if (parsed.isValid()) return parsed.hour() * 60 + parsed.minute();

  // dayjs cannot parse a bare time like "09:30" or "18:00:00"
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
};
