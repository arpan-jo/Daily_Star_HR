import { getDistanceInMeters } from '../src/common/services/getDistanceInMeters';

// Guards the distance gate that decides whether a tracked point gets published.
describe('getDistanceInMeters', () => {
  it('is 0 for the same point', () => {
    expect(getDistanceInMeters(23.8103, 90.4125, 23.8103, 90.4125)).toBe(0);
  });

  it('matches a known distance (Dhaka -> Chittagong ~217km)', () => {
    const d = getDistanceInMeters(23.8103, 90.4125, 22.3569, 91.7832);
    expect(d / 1000).toBeGreaterThan(210);
    expect(d / 1000).toBeLessThan(225);
  });

  it('resolves short walks in meters, not kilometres', () => {
    // ~0.0001 deg latitude is ~11m
    const d = getDistanceInMeters(23.8103, 90.4125, 23.8104, 90.4125);
    expect(d).toBeGreaterThan(5);
    expect(d).toBeLessThan(20);
  });

  it('is symmetric', () => {
    const a = getDistanceInMeters(23.8103, 90.4125, 23.82, 90.42);
    const b = getDistanceInMeters(23.82, 90.42, 23.8103, 90.4125);
    expect(a).toBeCloseTo(b, 6);
  });
});
