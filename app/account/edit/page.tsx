"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getInitials from "@/lib/getInitials";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AccountData {
  rider: {
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
  };
  stats: {
    totalRides: number;
  };
}

function EditProfile() {
  const router = useRouter();
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/account/details");
        const data = await response.json();
        setAccountData(data);
        setName(data.rider.name);
        setEmail(data.rider.email);
        setPhoneNumber(data.rider.phoneNumber);
      } catch (error) {
        console.log("Fetch profile error", error);
      }
    };
    fetchProfile();
  }, []);

  const handleDetailsUpdate = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/user/account/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message, {
          position: "top-center",
          style: {
            background: "#D50419",
          },
        });
      } else {
        toast.success(data.message, {
          position: "top-center",
          style: {
            background: "#418B24",
          },
        });
        router.push("/account");
      }
    } catch (error) {
      setLoading(false);
      console.log("Profile update error", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-black shadow-lg">
                {getInitials(name)}
              </div>

              <h1 className="mt-4 text-2xl font-bold">{name}</h1>

              <p className="text-zinc-400 mt-1">{email}</p>

              <div className="mt-6 w-full space-y-4">
                <div className="bg-zinc-800 rounded-2xl p-4 flex justify-between">
                  <span className="text-zinc-400">Phone</span>

                  <span className="font-semibold">{phoneNumber}</span>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4 flex justify-between">
                  <span className="text-zinc-400">Joined</span>

                  <span className="font-semibold">
                    {accountData?.rider?.createdAt &&
                      formatDate(accountData.rider.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">Personal Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-zinc-400 mb-2">Full Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2">Phone Number</label>

                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-4 pt-5">
                <Link href="/account">
                  <Button
                    variant="outline"
                    className="rounded-xl hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  onClick={handleDetailsUpdate}
                  disabled={loading}
                  className="bg-primary text-black hover:opacity-90 rounded-xl font-semibold hover:cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
