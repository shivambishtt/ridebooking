"use client";

import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import { VehicleType } from "@/lib/types";

interface Props {
  selected: VehicleType | null;
  onSelect: (type: VehicleType) => void;
}

export const vehicles = [
  {
    id: "four_wheeler",
    name: "Car",
    icon: <DirectionsCarIcon />,
    capacity: 4,
    desc: "Affordable compact rides",
  },
  {
    id: "two_wheeler",
    name: "Bike",
    icon: <TwoWheelerIcon />,
    capacity: 2,
    desc: "Quick & low-cost rides",
  },
  {
    id: "three_wheeler",
    name: "Auto",
    icon: <ElectricRickshawIcon />,
    capacity: 3,
    desc: "Budget friendly rides",
  },
];

function VehicleCard({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => {
        const isSelected = selected === vehicle.id;

        return (
          <div
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id as VehicleType)}
            className={`
              flex items-center justify-between
              p-4 rounded-xl cursor-pointer
              border transition-all
              hover:shadow-md
              ${isSelected ? "ring-2 ring-primary" : ""}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="text-xl">{vehicle.icon}</div>

              <div className="flex items-center justify-center gap-2">
                <h2 className="font-semibold text-base">{vehicle.name}</h2>

                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PersonIcon fontSize="small" />
                  {vehicle.capacity}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">{vehicle.desc}</p>
              </div>
            </div>

            {isSelected && <div className="text-sm font-medium">✓</div>}
          </div>
        );
      })}
    </div>
  );
}

export default VehicleCard;
