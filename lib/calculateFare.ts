import { VehicleType } from "./types";

const BASE_FARE = 40;
const FARE_PER_KM = 12;
const MIN_FARE = 50;

export const VEHICLE_RATES = {
  two_wheeler: {
    BASE_FARE: 20,
    FARE_PER_KM: 8,
    MIN_FARE: 30,
  },

  three_wheeler: {
    BASE_FARE: 30,
    FARE_PER_KM: 11,
    MIN_FARE: 40,
  },

  four_wheeler: {
    BASE_FARE: 40,
    FARE_PER_KM: 15,
    MIN_FARE: 50,
  },
};

export function calculateFare(distance: number, vehicleType: VehicleType) {
  const { BASE_FARE, FARE_PER_KM, MIN_FARE } = VEHICLE_RATES[vehicleType];
  return Math.floor(Math.max(BASE_FARE + FARE_PER_KM * distance, MIN_FARE));
}

export function getAllFares(distance: number) {
  return {
    two_wheeler: calculateFare(distance, VehicleType.TWO_WHEELER),
    four_wheeler: calculateFare(distance, VehicleType.FOUR_WHEELER),
    three_wheeler: calculateFare(distance, VehicleType.THREE_WHEELER),
  };
}
