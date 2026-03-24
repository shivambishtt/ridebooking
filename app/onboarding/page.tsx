"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, User } from "lucide-react";

type Role = "user" | "captain" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  function handleContinue() {
    if (!selectedRole) return;

    if (selectedRole === "captain") {
      router.push("/captain-signup");
    } else {
      router.push("/signup");
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to RideApp</h1>
        <p className="text-muted-foreground mt-2">
          How would you like to proceed?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <RoleCard
          icon={<User size={32} />}
          label="I'm a Rider"
          selected={selectedRole === "user"}
          onClick={() => setSelectedRole("user")}
        />
        <RoleCard
          icon={<Car size={32} />}
          label="I'm a Captain"
          selected={selectedRole === "captain"}
          onClick={() => setSelectedRole("captain")}
        />
      </div>

      <Button
        className="w-full max-w-sm"
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}

function RoleCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all
        ${
          selected
            ? "border-primary bg-primary/5 text-primary"
            : "border-muted hover:border-primary/50"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
