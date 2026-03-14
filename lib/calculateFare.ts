export function calculateFare(distance: number) {
  const BASE_FARE = 40;
  const FARE_PER_KM = 12;
  const MIN_FARE = 50;

  const calculate = BASE_FARE + FARE_PER_KM * distance;
  return Math.floor(Math.max(calculate, MIN_FARE));
}
