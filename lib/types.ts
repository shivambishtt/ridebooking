export enum VehicleType {
  TWO_WHEELER = "two_wheeler",
  THREE_WHEELER = "three_wheeler",
  FOUR_WHEELER = "four_wheeler",
}

export const VehicleTypeLabel: Record<VehicleType, string> = {
  [VehicleType.TWO_WHEELER]: "2 Wheeler",
  [VehicleType.THREE_WHEELER]: "3 Wheeler",
  [VehicleType.FOUR_WHEELER]: "4 Wheeler",
};
