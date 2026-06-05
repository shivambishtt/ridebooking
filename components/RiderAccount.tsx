"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import getIntials from "@/lib/getInitials";

interface Ride {
  _id: string;
  pickupLocation: {
    address: string;
  };
  dropLocation: {
    address: string;
  };
  fare: number;
  distance: number;
  status: string;
}

interface AccountData {
  rider: {
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
  };
  stats: {
    ride: Ride[];
    totalRides: number;
    recentRides: Ride[];
    totalSpent: number;
  };
}

function RiderAccount() {
  const session = useSession();
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch("/api/user/account/details");
        const data = await response.json();
        setAccountData(data);
      } catch (error) {
        console.log("Fetch account details error", error);
      }
    };
    fetchAccountDetails();
  }, []);

  if (session.data?.user.role !== "user") return;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-black shadow-lg">
              {getIntials(accountData?.rider?.name)}
            </div>

            <h1 className="mt-3 text-2xl font-bold">
              {accountData?.rider?.name}
            </h1>

            <p className="text-zinc-400 mt-1">{accountData?.rider?.email}</p>

            <div className="mt-6 w-full space-y-4">
              <div className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-zinc-400">Phone</span>
                <span className="font-semibold">
                  {accountData?.rider?.phoneNumber}
                </span>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-zinc-400">Favourite Ride</span>
                <span className="font-semibold">
                  {formatDate(accountData?.rider?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Total Trips</p>
              <h1 className="text-3xl font-bold mt-2">
                {accountData?.stats?.totalRides}
              </h1>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Money Spent</p>
              <h1 className="text-3xl font-bold mt-2">
                ₹ {accountData?.stats?.totalSpent || 0}
              </h1>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
              <p className="text-zinc-400">Saved Places</p>
              <h1 className="text-3xl font-bold mt-2">
                {accountData?.savedPlaces?.length || 0}
              </h1>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">Quick Actions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                Book Ride
              </Button>

              <Button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                Ride History
              </Button>

              <Button className="bg-zinc-800 hover:bg-primary hover:text-black transition-all rounded-2xl p-5 font-semibold">
                Saved Places
              </Button>

              <Button className="bg-zinc-800 hover:bg-red-500 transition-all rounded-2xl p-5 font-semibold">
                Logout
              </Button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Trips</h2>

              <Button className="font-semibold hover:cursor-pointer">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {accountData?.stats?.recentRides?.map((ride: Ride) => (
                <div
                  key={ride._id}
                  className="bg-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:scale-[1.01] transition-all"
                >
                  <div>
                    <p className="text-sm text-zinc-400">Pickup</p>
                    <h3 className="font-semibold text-md">
                      {ride.pickupLocation.address}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Drop</p>
                    <h3 className="font-semibold text-md">
                      {ride.dropLocation.address}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Fare</p>
                    <h3 className="font-semibold text-md">₹{ride.fare}</h3>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Distance</p>
                    <h3 className="font-semibold text-md">
                      {ride.distance} KM
                    </h3>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        ride.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiderAccount;
